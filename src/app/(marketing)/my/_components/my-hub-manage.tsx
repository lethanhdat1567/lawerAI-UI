"use client";

import Link from "next/link";
import { ExternalLinkIcon, PenSquareIcon, Trash2Icon } from "lucide-react";
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
import { listMyHubPosts } from "@/lib/hub/queries";
import type { HubPostListItem } from "@/lib/hub/types";
import { useAuthStore } from "@/stores/auth-store";

import { formatPostDate } from "./my-format";

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
  const un = user?.username ?? null;
  const posts = listMyHubPosts(un);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Thảo luận Hub của bạn
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

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <p className="text-muted-foreground">Chưa có bài Hub nào.</p>
          <Button className="mt-4" render={<Link href="/hub/new" />}>
            Tạo bài đầu tiên
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card/30">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Tiêu đề</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="text-right">Bình luận</TableHead>
                <TableHead className="w-[200px] text-right">Thao tác</TableHead>
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
                  <TableCell className="text-muted-foreground tabular-nums">
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
                        onClick={() =>
                          toast.message("Chức năng sửa bài", {
                            description:
                              "Sẽ kết nối API chỉnh sửa bài Hub trong bản cập nhật sau.",
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
