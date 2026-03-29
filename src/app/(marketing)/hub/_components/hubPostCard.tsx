// src/app/(marketing)/hub/_components/hubPostCard.tsx
import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";

import { HubAuthorAvatar } from "@/app/(marketing)/hub/_components/hubAuthorAvatar";
import type { HubPostListItem } from "@/lib/hub/types";
import { userProfilePath } from "@/lib/user/profilePath";
import { cn } from "@/lib/utils";

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const day = 86400000;
  if (diff < day) return "Hôm nay";
  if (diff < 2 * day) return "Hôm qua";
  if (diff < 7 * day) return `${Math.floor(diff / day)} ngày trước`;
  return d.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function HubPostCard({
  post,
  variant = "default",
}: {
  post: HubPostListItem;
  variant?: "default" | "onProfile";
}) {
  const profileHref = userProfilePath(post.author.username);
  const onProfile = variant === "onProfile";

  if (onProfile) {
    return (
      <article
        className={cn(
          "flex flex-col overflow-hidden rounded-2xl border border-border bg-card/45 backdrop-blur-md transition-[border-color,box-shadow]",
          "hover:border-primary/30 hover:shadow-[0_0_40px_-16px_oklch(0.55_0.18_285/0.35)]",
        )}
      >
        <Link
          href={`/hub/${post.slug}`}
          className="group flex flex-col p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            {post.category ? (
              <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                {post.category.name}
              </span>
            ) : null}
            <span className="text-xs text-muted-foreground">
              {formatRelative(post.createdAt)}
            </span>
          </div>
          <h2 className="mt-3 font-heading text-lg font-bold leading-snug tracking-tight text-foreground group-hover:text-primary sm:text-xl">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center justify-end border-t border-border pt-4">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircleIcon className="size-3.5" aria-hidden />
              {post.commentCount}
            </span>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card/45 backdrop-blur-md transition-[border-color,box-shadow]",
        "hover:border-primary/30 hover:shadow-[0_0_40px_-16px_oklch(0.55_0.18_285/0.35)]",
      )}
    >
      <Link
        href={`/hub/${post.slug}`}
        className="group flex flex-col p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          {post.category ? (
            <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
              {post.category.name}
            </span>
          ) : null}
          <span className="text-xs text-muted-foreground">
            {formatRelative(post.createdAt)}
          </span>
        </div>
        <h2 className="mt-3 font-heading text-lg font-bold leading-snug tracking-tight text-foreground group-hover:text-primary sm:text-xl">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </Link>

      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-6">
        <Link
          href={profileHref}
          className="flex min-w-0 items-center gap-2 rounded-lg outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <HubAuthorAvatar author={post.author} />
          <span className="truncate text-sm font-medium text-foreground/90">
            {post.author.displayName ?? post.author.username}
          </span>
        </Link>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <MessageCircleIcon className="size-3.5" aria-hidden />
          {post.commentCount}
        </span>
      </div>
    </article>
  );
}
