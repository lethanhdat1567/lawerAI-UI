"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ExternalLinkIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

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
import { hubPublicCategories } from "@/lib/hub/hubCategoryApi";
import {
  hubAdminCreatePost,
  hubAdminDeletePost,
  hubAdminPatchPost,
  hubAdminPostById,
  hubAdminPosts,
} from "@/lib/hub/hubApi";
import type { HubCategoryUI, HubPostListItem } from "@/lib/hub/types";

const PAGE_SIZE = 12;

function statusLabel(s: HubPostListItem["status"]): string {
  return s === "PUBLISHED" ? "Đăng" : "Ẩn";
}

export function AdminHubManage() {
  const [items, setItems] = useState<HubPostListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [qDraft, setQDraft] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "PUBLISHED" | "HIDDEN">(
    "",
  );
  const [categories, setCategories] = useState<HubCategoryUI[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<HubPostListItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editStatus, setEditStatus] =
    useState<HubPostListItem["status"]>("PUBLISHED");
  const [saving, setSaving] = useState(false);
  const [createAuthorId, setCreateAuthorId] = useState("");
  const [createTitle, setCreateTitle] = useState("");
  const [createBody, setCreateBody] = useState("");
  const [createCategoryId, setCreateCategoryId] = useState("");
  const [createSlug, setCreateSlug] = useState("");

  const load = useCallback(
    async (targetPage?: number) => {
      const p = targetPage ?? page;
      setLoading(true);
      try {
        const res = await hubAdminPosts({
          q: q.trim() || undefined,
          categorySlug: null,
          sort: "updated",
          page: p,
          pageSize: PAGE_SIZE,
          status: statusFilter || undefined,
        });
        setItems(res.items);
        setTotal(res.total);
      } catch (e) {
        const msg =
          e instanceof ApiError ? e.message : "Không tải danh sách Hub (admin).";
        toast.error(msg);
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [q, page, statusFilter],
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
        const { categories: c } = await hubPublicCategories();
        if (!cancelled) setCategories(c);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function openEdit(row: HubPostListItem) {
    setEditing(row);
    setEditTitle(row.title);
    setEditSlug(row.slug);
    setEditCategoryId(row.category?.id ?? "");
    setEditStatus(row.status);
    setEditBody("");
    setSheetOpen(true);
    void (async () => {
      try {
        const { post } = await hubAdminPostById(row.id);
        setEditBody(post.body);
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
    setSaving(true);
    try {
      const { post } = await hubAdminPatchPost(editing.id, {
        title: editTitle.trim(),
        slug: editSlug.trim(),
        body: editBody,
        categoryId: editCategoryId.trim() ? editCategoryId.trim() : null,
        status: editStatus,
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

  async function remove(row: HubPostListItem) {
    if (!window.confirm(`Xóa mềm bài "${row.title}"?`)) return;
    try {
      await hubAdminDeletePost(row.id);
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
      await hubAdminCreatePost({
        authorId: createAuthorId.trim(),
        title: createTitle.trim(),
        body: createBody,
        categoryId: createCategoryId.trim() ? createCategoryId.trim() : null,
        slug: createSlug.trim() || undefined,
      });
      toast.success("Đã tạo bài.");
      setCreateOpen(false);
      setCreateAuthorId("");
      setCreateTitle("");
      setCreateBody("");
      setCreateCategoryId("");
      setCreateSlug("");
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
              <option value="PUBLISHED">Đăng</option>
              <option value="HIDDEN">Ẩn</option>
            </select>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="h-10"
            onClick={() => {
              setQ(qDraft);
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
                <TableHead>Danh mục</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Trạng thái</TableHead>
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
                    {row.category?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.author.username}
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.status === "PUBLISHED" ? "default" : "secondary"}>
                      {statusLabel(row.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums text-xs text-muted-foreground">
                    {new Date(row.updatedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        render={<Link href={`/hub/${row.slug}`} />}
                      >
                        <ExternalLinkIcon className="size-3.5" />
                      </Button>
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
                {(page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + items.length}
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
          ariaLabel="Phân trang Hub admin"
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
            <SheetTitle>Chỉnh sửa Hub (admin)</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            <div>
              <label className="text-sm font-medium" htmlFor="adm-slug">
                Slug
              </label>
              <Input
                id="adm-slug"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className="mt-1.5 h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="adm-title">
                Tiêu đề
              </label>
              <Input
                id="adm-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-1.5 h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="adm-cat">
                Danh mục
              </label>
              <select
                id="adm-cat"
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="adm-status">
                Trạng thái
              </label>
              <select
                id="adm-status"
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value as HubPostListItem["status"])
                }
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="PUBLISHED">Đăng</option>
                <option value="HIDDEN">Ẩn</option>
              </select>
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
            <SheetTitle>Tạo bài Hub (admin)</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            <div>
              <label className="text-sm font-medium" htmlFor="cr-author">
                Author user id (cuid)
              </label>
              <Input
                id="cr-author"
                value={createAuthorId}
                onChange={(e) => setCreateAuthorId(e.target.value)}
                className="mt-1.5 h-10 font-mono text-xs"
                placeholder="clx…"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="cr-slug">
                Slug (tuỳ chọn)
              </label>
              <Input
                id="cr-slug"
                value={createSlug}
                onChange={(e) => setCreateSlug(e.target.value)}
                className="mt-1.5 h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="cr-title">
                Tiêu đề
              </label>
              <Input
                id="cr-title"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                className="mt-1.5 h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="cr-cat">
                Danh mục
              </label>
              <select
                id="cr-cat"
                value={createCategoryId}
                onChange={(e) => setCreateCategoryId(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
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
