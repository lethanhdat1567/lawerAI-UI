// src/app/(marketing)/hub/_components/hubPostDetailHeader.tsx
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import { HubAuthorAvatar } from "@/app/(marketing)/hub/_components/hubAuthorAvatar";
import type { HubPostDetail } from "@/lib/hub/types";
import { userProfilePath } from "@/lib/user/profilePath";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function HubPostDetailHeader({ post }: { post: HubPostDetail }) {
  return (
    <header className="border-b border-border pb-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/hub" className="hover:text-primary">
          Hub
        </Link>
        <ChevronRightIcon className="size-3.5 shrink-0 opacity-60" aria-hidden />
        {post.category ? (
          <>
            <Link
              href={`/hub?category=${encodeURIComponent(post.category.slug)}`}
              className="hover:text-primary"
            >
              {post.category.name}
            </Link>
            <ChevronRightIcon className="size-3.5 shrink-0 opacity-60" aria-hidden />
          </>
        ) : null}
        <span className="line-clamp-2 text-foreground/80">{post.title}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2">
        {post.category ? (
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
            {post.category.name}
          </span>
        ) : null}
      </div>

      <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <Link
          href={userProfilePath(post.author.username)}
          className="flex items-center gap-2 rounded-lg outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <HubAuthorAvatar author={post.author} className="size-9" size="lg" />
          <span className="font-medium text-foreground/90">
            {post.author.displayName ?? post.author.username}
          </span>
          <span className="text-muted-foreground/80">@{post.author.username}</span>
        </Link>
        <span aria-hidden className="hidden text-muted-foreground/35 dark:text-white/20 sm:inline">
          ·
        </span>
        <time dateTime={post.createdAt}>Đăng {formatDate(post.createdAt)}</time>
        {post.updatedAt !== post.createdAt ? (
          <>
            <span aria-hidden className="text-muted-foreground/35 dark:text-white/20">
              ·
            </span>
            <time dateTime={post.updatedAt}>
              Cập nhật {formatDate(post.updatedAt)}
            </time>
          </>
        ) : null}
      </div>
    </header>
  );
}
