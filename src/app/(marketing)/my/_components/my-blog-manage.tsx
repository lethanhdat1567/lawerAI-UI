"use client";

import Link from "next/link";
import {
  ExternalLinkIcon,
  PenSquareIcon,
  ShieldCheckIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

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
import { listMyBlogPosts } from "@/lib/blog/queries";
import type { BlogPostListItem } from "@/lib/blog/types";
import { useAuthStore } from "@/stores/auth-store";

import { formatPostDate } from "./my-format";

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
  const un = user?.username ?? null;
  const posts = listMyBlogPosts(un);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Blog của bạn
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Theo dõi bản nháp, bài đã đăng và trạng thái xác minh.
          </p>
        </div>
        <Button
          disabled
          title="Sắp có"
          className="cursor-not-allowed"
        >
          <PenSquareIcon className="size-4" aria-hidden />
          Bài mới
        </Button>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <p className="text-muted-foreground">Chưa có bài blog nào.</p>
          <Button disabled className="mt-4 cursor-not-allowed opacity-70">
            Tạo bài (sắp có)
          </Button>
        </div>
      ) : (
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
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() =>
                            toast.message("Bài nháp", {
                              description:
                                "Chưa có URL công khai. Mở trang soạn khi API sẵn sàng.",
                            })
                          }
                        >
                          Xem
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() =>
                          toast.message("Sửa bài", {
                            description: "Tính năng đang được hoàn thiện.",
                          })
                        }
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-destructive hover:text-destructive"
                        onClick={() =>
                          toast.message("Gỡ bài", {
                            description: "Tính năng đang được hoàn thiện.",
                          })
                        }
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
      )}
    </div>
  );
}
