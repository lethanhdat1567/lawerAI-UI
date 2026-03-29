"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ExternalLinkIcon,
  Loader2Icon,
  PlusIcon,
  ShieldCheckIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { BlogThumbnailUploadField } from "@/app/(marketing)/blog/_components/blogThumbnailUploadField";
import { RichTextEditor } from "@/components/rich-text-editor/richTextEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination/pagination";
import { ApiError } from "@/lib/api/errors";
import { isHtmlContentEffectivelyEmpty } from "@/lib/editor/plain-excerpt";
import {
  blogAdminCreatePost,
  blogAdminDeletePost,
  blogAdminPatchPost,
  blogAdminPostById,
  blogAdminPosts,
  blogPublicTags,
} from "@/lib/blog/blogApi";
import type { BlogPostListItem, BlogPostStatusUI, BlogTag } from "@/lib/blog/types";

const PAGE_SIZE = 12;

function statusLabel(s: BlogPostListItem["status"]): string {
  return s === "PUBLISHED" ? "Xuất bản" : "Nháp";
}

function toggleInSet(set: Set<string>, id: string): Set<string> {
  const n = new Set(set);
  if (n.has(id)) n.delete(id);
  else n.add(id);
  return n;
}

export function AdminBlogManage() {
  const [items, setItems] = useState<BlogPostListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [qDraft, setQDraft] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "DRAFT" | "PUBLISHED">(
    "",
  );
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [authorIdFilter, setAuthorIdFilter] = useState("");
  const [authorIdFilterDraft, setAuthorIdFilterDraft] = useState("");
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPostListItem | null>(null);
  const [editSlug, setEditSlug] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editStatus, setEditStatus] =
    useState<BlogPostListItem["status"]>("PUBLISHED");
  const [editAuthorId, setEditAuthorId] = useState("");
  const [editTagIds, setEditTagIds] = useState<Set<string>>(new Set());
  const [editIsVerified, setEditIsVerified] = useState(false);
  const [editVerificationNotes, setEditVerificationNotes] = useState("");
  const [editLegalCorpusVersion, setEditLegalCorpusVersion] = useState("");
  const [saving, setSaving] = useState(false);
  const [createAuthorId, setCreateAuthorId] = useState("");
  const [createTitle, setCreateTitle] = useState("");
  const [createBody, setCreateBody] = useState("");
  const [createSlug, setCreateSlug] = useState("");
  const [createExcerpt, setCreateExcerpt] = useState("");
  const [createThumbnailUrl, setCreateThumbnailUrl] = useState("");
  const [createStatus, setCreateStatus] =
    useState<BlogPostStatusUI>("PUBLISHED");
  const [createTagIds, setCreateTagIds] = useState<Set<string>>(new Set());

  const load = useCallback(
    async (targetPage?: number) => {
      const p = targetPage ?? page;
      setLoading(true);
      try {
        const res = await blogAdminPosts({
          q: q.trim() || undefined,
          tagSlug: null,
          sort: "updated",
          page: p,
          pageSize: PAGE_SIZE,
          status: statusFilter || undefined,
          verifiedOnly: verifiedOnly || undefined,
          authorId: authorIdFilter.trim() || undefined,
        });
        setItems(res.items);
        setTotal(res.total);
      } catch (e) {
        const msg =
          e instanceof ApiError ? e.message : "Không tải danh sách Blog (admin).";
        toast.error(msg);
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [q, page, statusFilter, verifiedOnly, authorIdFilter],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (page > maxPage) setPage(maxPage);
  }, [total, page]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { tags: t } = await blogPublicTags();
        if (!cancelled) setTags(t);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function openEdit(row: BlogPostListItem) {
    setEditing(row);
    setEditSlug(row.slug);
    setEditTitle(row.title);
    setEditExcerpt(row.excerpt ?? "");
    setEditThumbnailUrl(row.thumbnailUrl ?? "");
    setEditAuthorId(row.author.id);
    setEditStatus(row.status);
    setEditTagIds(new Set(row.tags.map((t) => t.id)));
    setEditBody("");
    setEditIsVerified(row.isVerified);
    setEditVerificationNotes("");
    setEditLegalCorpusVersion("");
    setSheetOpen(true);
    void (async () => {
      try {
        const { post } = await blogAdminPostById(row.id);
        setEditBody(post.body);
        setEditThumbnailUrl(post.thumbnailUrl ?? "");
        setEditVerificationNotes(post.verificationNotes ?? "");
        setEditLegalCorpusVersion(post.legalCorpusVersion ?? "");
        setEditIsVerified(post.isVerified);
      } catch {
        toast.error("Không tải chi tiết bài.");
        setSheetOpen(false);
        setEditing(null);
      }
    })();
  }

  async function saveEdit() {
    if (!editing) return;
    if (!editTitle.trim() || isHtmlContentEffectivelyEmpty(editBody)) {
      toast.error("Tiêu đề và nội dung bắt buộc.");
      return;
    }
    if (!editAuthorId.trim()) {
      toast.error("Cần author user id.");
      return;
    }
    setSaving(true);
    try {
      const { post } = await blogAdminPatchPost(editing.id, {
        title: editTitle.trim(),
        slug: editSlug.trim(),
        body: editBody,
        excerpt: editExcerpt.trim() ? editExcerpt.trim() : null,
        thumbnailUrl: editThumbnailUrl.trim() ? editThumbnailUrl.trim() : null,
        status: editStatus,
        authorId: editAuthorId.trim(),
        tagIds: [...editTagIds],
        isVerified: editIsVerified,
        verificationNotes: editVerificationNotes.trim()
          ? editVerificationNotes.trim()
          : null,
        legalCorpusVersion: editLegalCorpusVersion.trim()
          ? editLegalCorpusVersion.trim()
          : null,
      });
      toast.success("Đã cập nhật.");
      setItems((prev) => prev.map((x) => (x.id === post.id ? post : x)));
      setSheetOpen(false);
      setEditing(null);
      void load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: BlogPostListItem) {
    if (!window.confirm(`Xóa mềm bài "${row.title}"?`)) return;
    try {
      await blogAdminDeletePost(row.id);
      toast.success("Đã xóa bài.");
      void load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Xóa thất bại.");
    }
  }

  async function createPost() {
    if (!createAuthorId.trim() || !createTitle.trim()) {
      toast.error("Cần authorId và tiêu đề.");
      return;
    }
    if (isHtmlContentEffectivelyEmpty(createBody)) {
      toast.error("Nội dung không được để trống.");
      return;
    }
    setSaving(true);
    try {
      await blogAdminCreatePost({
        authorId: createAuthorId.trim(),
        title: createTitle.trim(),
        body: createBody,
        excerpt: createExcerpt.trim() ? createExcerpt.trim() : null,
        thumbnailUrl: createThumbnailUrl.trim() ? createThumbnailUrl.trim() : null,
        status: createStatus,
        slug: createSlug.trim() || undefined,
        tagIds: [...createTagIds],
      });
      toast.success("Đã tạo bài.");
      setCreateOpen(false);
      setCreateAuthorId("");
      setCreateTitle("");
      setCreateBody("");
      setCreateSlug("");
      setCreateExcerpt("");
      setCreateThumbnailUrl("");
      setCreateTagIds(new Set());
      setCreateStatus("PUBLISHED");
      setPage(1);
      await load(1);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Tạo bài thất bại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-wrap items-end gap-2">
          <div className="min-w-[200px] flex-1">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Tìm kiếm
            </p>
            <Input
              value={qDraft}
              onChange={(e) => setQDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setQ(qDraft);
                  setPage(1);
                }
              }}
              placeholder="Tiêu đề, slug, nội dung…"
              className="h-10"
            />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Trạng thái
            </p>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as typeof statusFilter);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">Tất cả</option>
              <option value="PUBLISHED">Xuất bản</option>
              <option value="DRAFT">Nháp</option>
            </select>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Author (cuid)
            </p>
            <Input
              value={authorIdFilterDraft}
              onChange={(e) => setAuthorIdFilterDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setAuthorIdFilter(authorIdFilterDraft);
                  setPage(1);
                }
              }}
              placeholder="Lọc theo tác giả…"
              className="h-10 font-mono text-xs"
            />
          </div>
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => {
                setVerifiedOnly(e.target.checked);
                setPage(1);
              }}
              className="rounded border-border"
            />
            Chỉ verified
          </label>
          <Button
            type="button"
            variant="secondary"
            className="h-10"
            onClick={() => {
              setQ(qDraft);
              setAuthorIdFilter(authorIdFilterDraft);
              setPage(1);
            }}
          >
            Lọc
          </Button>
        </div>
        <Button type="button" className="h-10" onClick={() => setCreateOpen(true)}>
          <PlusIcon className="size-4" aria-hidden />
          Bài mới
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-muted-foreground">
          <Loader2Icon className="size-8 animate-spin" aria-hidden />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-[220px] font-medium whitespace-normal">
                    <span className="line-clamp-2">{row.title}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums text-xs">
                    {row.slug}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.author.username}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={row.status === "PUBLISHED" ? "default" : "secondary"}
                    >
                      {statusLabel(row.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {row.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <ShieldCheckIcon className="size-3.5" aria-hidden />
                        Có
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="tabular-nums text-xs text-muted-foreground">
                    {new Date(row.updatedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {row.status === "PUBLISHED" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          render={<Link href={`/blog/${row.slug}`} />}
                        >
                          <ExternalLinkIcon className="size-3.5" />
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => openEdit(row)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-destructive"
                        onClick={() => void remove(row)}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex flex-col items-center gap-3 border-t border-border pt-4 sm:flex-row sm:justify-between">
        <p className="order-2 text-center text-xs text-muted-foreground sm:order-1 sm:text-left">
          {total > 0 ? (
            <>
              Hiển thị{" "}
              <span className="font-medium text-foreground">
                {(page - 1) * PAGE_SIZE + 1}–
                {(page - 1) * PAGE_SIZE + items.length}
              </span>{" "}
              trong{" "}
              <span className="font-medium text-foreground">{total}</span> bài
              {totalPages > 1 ? (
                <>
                  {" "}
                  · Trang{" "}
                  <span className="font-medium text-foreground">
                    {page}/{totalPages}
                  </span>
                </>
              ) : null}
            </>
          ) : null}
        </p>
        <Pagination
          className="order-1 sm:order-2"
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          ariaLabel="Phân trang Blog admin"
        />
      </div>

      <Sheet
        open={sheetOpen}
        onOpenChange={(o) => {
          setSheetOpen(o);
          if (!o) setEditing(null);
        }}
      >
        <SheetContent
          side="right"
          className="flex w-full max-w-lg flex-col gap-0 sm:max-w-xl"
        >
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle>Chỉnh sửa Blog (admin)</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            <div>
              <label className="text-sm font-medium" htmlFor="ab-slug">
                Slug
              </label>
              <Input
                id="ab-slug"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className="mt-1.5 h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="ab-title">
                Tiêu đề
              </label>
              <Input
                id="ab-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-1.5 h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="ab-ex">
                Tóm tắt
              </label>
              <textarea
                id="ab-ex"
                value={editExcerpt}
                onChange={(e) => setEditExcerpt(e.target.value)}
                rows={2}
                className="mt-1.5 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <BlogThumbnailUploadField
              id="ab-thumb"
              label="Ảnh thumbnail"
              value={editThumbnailUrl}
              onChange={setEditThumbnailUrl}
              disabled={saving}
            />
            <div>
              <label className="text-sm font-medium" htmlFor="ab-author">
                Author user id (cuid)
              </label>
              <Input
                id="ab-author"
                value={editAuthorId}
                onChange={(e) => setEditAuthorId(e.target.value)}
                className="mt-1.5 h-10 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="ab-status">
                Trạng thái
              </label>
              <select
                id="ab-status"
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value as BlogPostListItem["status"])
                }
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="PUBLISHED">Xuất bản</option>
                <option value="DRAFT">Nháp</option>
              </select>
            </div>
            {tags.length > 0 ? (
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Thẻ</legend>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <label
                      key={t.id}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs has-[:checked]:border-primary/50 has-[:checked]:bg-primary/10"
                    >
                      <input
                        type="checkbox"
                        checked={editTagIds.has(t.id)}
                        onChange={() =>
                          setEditTagIds((s) => toggleInSet(s, t.id))
                        }
                        className="rounded border-border"
                      />
                      {t.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
            <div className="rounded-lg border border-border p-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={editIsVerified}
                  onChange={(e) => setEditIsVerified(e.target.checked)}
                  className="rounded border-border"
                />
                Đã kiểm chứng (verified)
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                Bật sẽ ghi nhận thời điểm và admin hiện tại trên server.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="ab-notes">
                Ghi chú kiểm chứng
              </label>
              <textarea
                id="ab-notes"
                value={editVerificationNotes}
                onChange={(e) => setEditVerificationNotes(e.target.value)}
                rows={3}
                className="mt-1.5 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="ab-legal">
                Phiên bản legal corpus
              </label>
              <Input
                id="ab-legal"
                value={editLegalCorpusVersion}
                onChange={(e) => setEditLegalCorpusVersion(e.target.value)}
                className="mt-1.5 h-10"
                placeholder="vd. v2024.1"
              />
            </div>
            <div>
              <p className="text-sm font-medium">Nội dung</p>
              <div className="mt-1.5 min-h-[200px]">
                <RichTextEditor value={editBody} onChange={setEditBody} />
              </div>
            </div>
          </div>
          <SheetFooter className="border-t border-border pt-4">
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>
              Hủy
            </Button>
            <Button disabled={saving} onClick={() => void saveEdit()}>
              {saving ? "Đang lưu…" : "Lưu"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent
          side="right"
          className="flex w-full max-w-lg flex-col gap-0 sm:max-w-xl"
        >
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle>Tạo bài Blog (admin)</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            <div>
              <label className="text-sm font-medium" htmlFor="bc-author">
                Author user id (cuid)
              </label>
              <Input
                id="bc-author"
                value={createAuthorId}
                onChange={(e) => setCreateAuthorId(e.target.value)}
                className="mt-1.5 h-10 font-mono text-xs"
                placeholder="clx…"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="bc-slug">
                Slug (tuỳ chọn)
              </label>
              <Input
                id="bc-slug"
                value={createSlug}
                onChange={(e) => setCreateSlug(e.target.value)}
                className="mt-1.5 h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="bc-title">
                Tiêu đề
              </label>
              <Input
                id="bc-title"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                className="mt-1.5 h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="bc-ex">
                Tóm tắt (tuỳ chọn)
              </label>
              <textarea
                id="bc-ex"
                value={createExcerpt}
                onChange={(e) => setCreateExcerpt(e.target.value)}
                rows={2}
                className="mt-1.5 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <BlogThumbnailUploadField
              id="bc-thumb"
              label="Ảnh thumbnail (tuỳ chọn)"
              value={createThumbnailUrl}
              onChange={setCreateThumbnailUrl}
              disabled={saving}
            />
            <div>
              <label className="text-sm font-medium" htmlFor="bc-status">
                Trạng thái
              </label>
              <select
                id="bc-status"
                value={createStatus}
                onChange={(e) =>
                  setCreateStatus(e.target.value as BlogPostStatusUI)
                }
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="PUBLISHED">Xuất bản</option>
                <option value="DRAFT">Nháp</option>
              </select>
            </div>
            {tags.length > 0 ? (
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Thẻ</legend>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <label
                      key={t.id}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs has-[:checked]:border-primary/50 has-[:checked]:bg-primary/10"
                    >
                      <input
                        type="checkbox"
                        checked={createTagIds.has(t.id)}
                        onChange={() =>
                          setCreateTagIds((s) => toggleInSet(s, t.id))
                        }
                        className="rounded border-border"
                      />
                      {t.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
            <div>
              <p className="text-sm font-medium">Nội dung</p>
              <div className="mt-1.5 min-h-[200px]">
                <RichTextEditor value={createBody} onChange={setCreateBody} />
              </div>
            </div>
          </div>
          <SheetFooter className="border-t border-border pt-4">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Hủy
            </Button>
            <Button disabled={saving} onClick={() => void createPost()}>
              {saving ? "Đang tạo…" : "Tạo"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
