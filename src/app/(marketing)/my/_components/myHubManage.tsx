"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ExternalLinkIcon,
  Loader2Icon,
  PenSquareIcon,
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
import { hubMeDeletePost, hubMePosts } from "@/lib/hub/hubApi";
import type { HubPostListItem } from "@/lib/hub/types";
import { useAuthStore } from "@/stores/auth-store";

import { formatPostDate } from "./myFormat";

const PAGE_SIZE = 12;

function hubStatusLabel(status: HubPostListItem["status"]): string {
  if (status === "PUBLISHED") return "Đã đăng";
  return "Đã ẩn";
}

function hubStatusBadgeVariant(
  status: HubPostListItem["status"],
): "default" | "secondary" {
  return status === "PUBLISHED" ? "default" : "secondary";
}

export function MyHubManage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);
  const signedIn = Boolean(user ?? token);
  const [posts, setPosts] = useState<HubPostListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<HubPostListItem | null>(
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
      const { items, total: t } = await hubMePosts({
        page,
        pageSize: PAGE_SIZE,
      });
      setPosts(items);
      setTotal(t);
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : "Không tải được danh sách bài Hub.";
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
      await hubMeDeletePost(postToDelete.id);
      toast.success("Đã gỡ bài.");
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
        <p className="text-muted-foreground">Đăng nhập để quản lý bài Hub.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Thảo luận cộng đồng của bạn
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Xem và quản lý các bài thảo luận của bạn.
          </p>
        </div>
        <Button render={<Link href="/hub/new" />}>
          <PenSquareIcon className="size-4" aria-hidden />
          Đăng bài mới
        </Button>
      </header>

      {!loading && posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <p className="text-muted-foreground">Chưa có bài Hub nào.</p>
          <Button className="mt-4" render={<Link href="/hub/new" />}>
            Tạo bài đầu tiên
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
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead className="text-right">Bình luận</TableHead>
                  <TableHead className="w-[200px] text-right">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="max-w-[280px] whitespace-normal font-medium">
                      <span className="line-clamp-2">{p.title}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.category?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={hubStatusBadgeVariant(p.status)}>
                        {hubStatusLabel(p.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {formatPostDate(p.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {p.commentCount}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          render={<Link href={`/hub/${p.slug}`} />}
                        >
                          <ExternalLinkIcon className="size-3.5" aria-hidden />
                          Xem
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          render={<Link href={`/hub/edit/${p.id}`} />}
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
              ariaLabel="Phân trang bài Hub của tôi"
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
            <AlertDialogTitle>Gỡ bài Hub?</AlertDialogTitle>
            <AlertDialogDescription>
              {postToDelete
                ? `Gỡ bài “${postToDelete.title}”? Bài sẽ không còn hiển thị công khai.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <Button
              type="button"
              disabled={deleting}
              onClick={() => void confirmDelete()}
            >
              {deleting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" aria-hidden />
                  Đang gỡ…
                </>
              ) : (
                "Xác nhận"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
