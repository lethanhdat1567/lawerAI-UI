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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  blogAdminDeletePost,
  blogAdminPatchPostVerification,
  blogAdminPostById,
  blogAdminPosts,
} from "@/lib/blog/blogApi";
import type { BlogPostDetail, BlogPostListItem } from "@/lib/blog/types";

const PAGE_SIZE = 12;

function statusLabel(s: BlogPostListItem["status"]): string {
  return s === "PUBLISHED" ? "Xuất bản" : "Nháp";
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
  const [saving, setSaving] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationTarget, setVerificationTarget] = useState<BlogPostListItem | null>(
    null,
  );
  const [verificationNotes, setVerificationNotes] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationSaving, setVerificationSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogPostListItem | null>(null);

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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQ(qDraft);
      setAuthorIdFilter(authorIdFilterDraft);
      setPage(1);
    }, 350);
    return () => {
      window.clearTimeout(timer);
    };
  }, [qDraft, authorIdFilterDraft]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (page > maxPage) setPage(maxPage);
  }, [total, page]);

  function syncRowFromDetail(post: BlogPostDetail) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === post.id
          ? {
              id: post.id,
              slug: post.slug,
              title: post.title,
              thumbnailUrl: post.thumbnailUrl,
              excerpt: post.excerpt,
              status: post.status,
              isVerified: post.isVerified,
              tags: post.tags,
              author: post.author,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
              commentCount: post.commentCount,
              likeCount: post.likeCount,
            }
          : item,
      ),
    );
  }

  function openVerification(row: BlogPostListItem) {
    setVerificationTarget(row);
    setVerificationNotes("");
    setVerificationLoading(true);
    setVerificationOpen(true);
    void (async () => {
      try {
        const { post } = await blogAdminPostById(row.id);
        setVerificationNotes(post.verificationNotes ?? "");
      } catch (e) {
        toast.error(
          e instanceof ApiError ? e.message : "Không tải dữ liệu kiểm chứng.",
        );
        setVerificationOpen(false);
        setVerificationTarget(null);
      } finally {
        setVerificationLoading(false);
      }
    })();
  }

  async function submitVerification(nextVerified: boolean) {
    if (!verificationTarget) return;
    setVerificationSaving(true);
    try {
      const { post } = await blogAdminPatchPostVerification(verificationTarget.id, {
        isVerified: nextVerified,
        verificationNotes: nextVerified
          ? verificationNotes.trim() || null
          : null,
      });
      syncRowFromDetail(post);
      toast.success(nextVerified ? "Đã verify bài viết." : "Đã hủy verify bài viết.");
      setVerificationOpen(false);
      setVerificationTarget(null);
      if (!nextVerified) {
        setVerificationNotes("");
      }
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Cập nhật verify thất bại.");
    } finally {
      setVerificationSaving(false);
    }
  }

  async function remove(row: BlogPostListItem) {
    setSaving(true);
    try {
      await blogAdminDeletePost(row.id);
      toast.success("Đã xóa bài.");
      void load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Xóa thất bại.");
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
        </div>
        <Button type="button" className="h-10" render={<Link href="/blog/new" />}>
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
                        variant={row.isVerified ? "outline" : "ghost"}
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => openVerification(row)}
                      >
                        {row.isVerified ? "Hủy verify" : "Verify"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        render={<Link href={`/blog/edit/${row.id}`} />}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-destructive"
                        onClick={() => setDeleteTarget(row)}
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

      <AlertDialog
        open={verificationOpen}
        onOpenChange={(open) => {
          setVerificationOpen(open);
          if (!open) {
            setVerificationTarget(null);
            setVerificationNotes("");
            setVerificationLoading(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {verificationTarget?.isVerified ? "Hủy verify bài viết?" : "Verify bài viết?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {verificationTarget
                ? verificationTarget.isVerified
                  ? `Bài "${verificationTarget.title}" sẽ bị gỡ trạng thái verified và note hiện tại sẽ bị xóa.`
                  : `Xác nhận verify bài "${verificationTarget.title}". Bạn có thể nhập note cho lần kiểm chứng này.`
                : "Chọn bài viết cần cập nhật trạng thái verify."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="ab-verify-notes">
              Ghi chú kiểm chứng
            </label>
            <textarea
              id="ab-verify-notes"
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              rows={4}
              disabled={verificationLoading || verificationSaving}
              placeholder="Nhập ghi chú cho admin..."
              className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-60"
            />
            {verificationTarget?.isVerified ? (
              <p className="text-xs text-muted-foreground">
                Khi hủy verify, backend sẽ xóa note hiện tại theo nghiệp vụ đã chốt.
              </p>
            ) : null}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={verificationSaving}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={verificationLoading || verificationSaving || !verificationTarget}
              onClick={(e) => {
                e.preventDefault();
                void submitVerification(!Boolean(verificationTarget?.isVerified));
              }}
            >
              {verificationSaving
                ? "Đang xử lý…"
                : verificationTarget?.isVerified
                  ? "Hủy verify"
                  : "Xác nhận verify"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteTarget != null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bài viết?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Bài "${deleteTarget.title}" sẽ bị xóa mềm khỏi hệ thống.`
                : "Bài viết này sẽ bị xóa mềm khỏi hệ thống."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={() => {
                if (!deleteTarget) return;
                void remove(deleteTarget);
                setDeleteTarget(null);
              }}
            >
              {saving ? "Đang xóa…" : "Xóa bài"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
