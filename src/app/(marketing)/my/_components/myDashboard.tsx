"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenIcon,
  MessagesSquareIcon,
  PenSquareIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { listMyBlogPosts } from "@/lib/blog/queries";
import { listMyHubPosts } from "@/lib/hub/queries";
import { useAuthStore } from "@/stores/auth-store";

import { formatPostDate } from "./myFormat";

export function MyDashboard() {
  const user = useAuthStore((s) => s.user);
  const un = user?.username ?? null;
  const hubPosts = listMyHubPosts(un);
  const blogPosts = listMyBlogPosts(un);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Xin chào{user?.profile.displayName?.trim() ? `, ${user.profile.displayName.trim()}` : ""}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tổng quan bài đăng Hub và Blog của bạn.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/50 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessagesSquareIcon className="size-4 text-primary" aria-hidden />
            Thảo luận Hub
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums">{hubPosts.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Tổng số bài</p>
          <Button variant="outline" size="sm" className="mt-4" render={<Link href="/my/hub" />}>
            Quản lý
            <ArrowRightIcon className="size-3.5" />
          </Button>
        </div>
        <div className="rounded-2xl border border-border bg-card/50 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpenIcon className="size-4 text-primary" aria-hidden />
            Blog
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums">{blogPosts.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Bài đang có trong demo</p>
          <Button variant="outline" size="sm" className="mt-4" render={<Link href="/my/blog" />}>
            Quản lý
            <ArrowRightIcon className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-semibold">Hub gần đây</h2>
            <Link
              href="/hub/new"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <PenSquareIcon className="size-3.5" aria-hidden />
              Đăng bài
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {hubPosts.slice(0, 4).map((p) => (
              <li key={p.id}>
                <Link
                  href={`/hub/${p.slug}`}
                  className="flex flex-col rounded-xl border border-border/80 bg-background/40 px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/30"
                >
                  <span className="font-medium text-foreground line-clamp-1">
                    {p.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatPostDate(p.updatedAt)} · {p.commentCount} bình luận
                  </span>
                </Link>
              </li>
            ))}
            {hubPosts.length === 0 ? (
              <li className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                Chưa có bài Hub khớp tài khoản.{" "}
                <Link href="/hub/new" className="font-semibold text-primary hover:underline">
                  Đăng bài mới
                </Link>
              </li>
            ) : null}
          </ul>
        </section>

        <section>
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-semibold">Blog gần đây</h2>
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-1 text-xs font-semibold text-muted-foreground opacity-70"
              title="Sắp có"
            >
              <PenSquareIcon className="size-3.5" aria-hidden />
              Bài mới
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {blogPosts.slice(0, 4).map((p) => (
              <li key={p.id}>
                {p.status === "PUBLISHED" ? (
                  <Link
                    href={`/blog/${p.slug}`}
                    className="flex flex-col rounded-xl border border-border/80 bg-background/40 px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/30"
                  >
                    <span className="font-medium text-foreground line-clamp-1">
                      {p.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatPostDate(p.updatedAt)}
                      {p.isVerified ? " · Đã Verified" : ""}
                    </span>
                  </Link>
                ) : (
                  <div className="flex flex-col rounded-xl border border-dashed border-border bg-muted/20 px-3 py-2">
                    <span className="font-medium text-foreground line-clamp-1">
                      {p.title}
                    </span>
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      Bản nháp
                    </span>
                  </div>
                )}
              </li>
            ))}
            {blogPosts.length === 0 ? (
              <li className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                Chưa có bài blog.
              </li>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
