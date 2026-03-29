"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ExternalLinkIcon,
  Loader2Icon,
  PenSquareIcon,
  ShieldCheckIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { blogMeDeletePost, blogMePosts } from "@/lib/blog/blogApi";
import type { BlogPostListItem } from "@/lib/blog/types";
import { useAuthStore } from "@/stores/auth-store";

import { formatPostDate } from "./myFormat";

const PAGE_SIZE = 10;

function blogStatusLabel(status: BlogPostListItem["status"]): string {
  if (status === "PUBLISHED") return "Đã xuất bản";
  return "Nháp";
}

function blogStatusBadgeVariant(
  status: BlogPostListItem["status"],
): "default" | "secondary" {
  return status === "PUBLISHED" ? "default" : "secondary";
}

export function MyBlogManage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);
  const signedIn = Boolean(user ?? token);
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<BlogPostListItem | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!signedIn) {
      setPosts([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { items, total: t } = await blogMePosts({
        page,
        pageSize: PAGE_SIZE,
      });
      setPosts(items);
      setTotal(t);
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : "Không tải được danh sách blog.";
      toast.error(msg);
      setPosts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [signedIn, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (page > maxPage) setPage(maxPage);
  }, [total, page]);

  async function confirmDelete() {
    if (!postToDelete) return;
    setDeleting(true);
    try {
      await blogMeDeletePost(postToDelete.id);
      toast.success("Đã xóa bài blog.");
      setPostToDelete(null);
      await load();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Không xóa được bài.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  }

  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-border px-6 py-14 text-center">
        <p className="text-muted-foreground">Đăng nhập để quản lý blog.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Blog của bạn
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Theo dõi bản nháp, bài đã xuất bản và trạng thái xác minh.
          </p>
        </div>
        <Button render={<Link href="/blog/new" />}>
          <PenSquareIcon className="size-4" aria-hidden />
          Bài mới
        </Button>
      </header>

      {!loading && posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <p className="text-muted-foreground">Chưa có bài blog nào.</p>
          <Button className="mt-4" render={<Link href="/blog/new" />}>
            Viết bài đầu tiên
          </Button>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2Icon className="size-8 animate-spin" aria-hidden />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/30">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Tiêu đề</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Xác minh</TableHead>
                  <TableHead>Thẻ</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead className="w-[200px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="max-w-[280px] whitespace-normal font-medium">
                      <span className="line-clamp-2">{p.title}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={blogStatusBadgeVariant(p.status)}>
                        {blogStatusLabel(p.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {p.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <ShieldCheckIcon className="size-3.5" aria-hidden />
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[160px] whitespace-normal text-muted-foreground">
                      <span className="line-clamp-2">
                        {p.tags.length
                          ? p.tags.map((t) => t.name).join(", ")
                          : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {formatPostDate(p.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center justify-end gap-1">
                        {p.status === "PUBLISHED" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            render={<Link href={`/blog/${p.slug}`} />}
                          >
                            <ExternalLinkIcon className="size-3.5" aria-hidden />
                            Xem
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          render={<Link href={`/blog/edit/${p.id}`} />}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-destructive hover:text-destructive"
                          onClick={() => setPostToDelete(p)}
                        >
                          <Trash2Icon className="size-3.5" aria-hidden />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-center gap-3 border-t border-border pt-4 sm:flex-row sm:justify-between">
            <p className="order-2 text-center text-xs text-muted-foreground sm:order-1 sm:text-left">
              {total > 0 ? (
                <>
                  Hiển thị{" "}
                  <span className="font-medium text-foreground">
                    {(page - 1) * PAGE_SIZE + 1}–
                    {(page - 1) * PAGE_SIZE + posts.length}
                  </span>{" "}
                  trong{" "}
                  <span className="font-medium text-foreground">{total}</span>{" "}
                  bài
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
              onPageChange={(p) => setPage(p)}
              ariaLabel="Phân trang blog của tôi"
            />
          </div>
        </div>
      )}

      <AlertDialog
        open={postToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPostToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bài blog?</AlertDialogTitle>
            <AlertDialogDescription>
              {postToDelete
                ? `Xóa bài “${postToDelete.title}”? Hành động không thể hoàn tác.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={() => void confirmDelete()}
            >
              {deleting ? (
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
              ) : null}
              Xóa
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
