// src/app/(marketing)/blog/_components/blogPostCard.tsx
import Link from "next/link";
import {
  BadgeCheckIcon,
  BookmarkIcon,
  HeartIcon,
  MessageCircleIcon,
} from "lucide-react";

import type { BlogPostListItem } from "@/lib/blog/types";
import { resolveApiAssetUrl } from "@/lib/media/resolveApiAssetUrl";
import { userProfilePath } from "@/lib/user/profilePath";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export type BlogPostCardUserEngagement = {
  liked: boolean;
  saved: boolean;
};

export function BlogPostCard({
  post,
  userEngagement,
  variant = "default",
}: {
  post: BlogPostListItem;
  userEngagement?: BlogPostCardUserEngagement | null;
  /** Trên trang hồ sơ: ẩn footer tác giả (đã biết là cùng một người). */
  variant?: "default" | "onProfile";
}) {
  const thumbSrc = resolveApiAssetUrl(post.thumbnailUrl);
  const authorProfileHref = userProfilePath(post.author.username);
  const onProfile = variant === "onProfile";

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-card/45 backdrop-blur-md transition-[border-color,box-shadow]",
        "hover:border-primary/30 hover:shadow-[0_0_40px_-16px_oklch(0.55_0.18_285/0.35)]",
      )}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="relative h-32 w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary/20 via-muted/40 to-muted/20 sm:h-36">
          {thumbSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbSrc}
              alt=""
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-3xl font-heading font-bold text-primary/25">
              B
            </div>
          )}
          {userEngagement && (userEngagement.liked || userEngagement.saved) ? (
            <div
              className="pointer-events-none absolute right-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap justify-end gap-1"
              aria-label={
                [
                  userEngagement.liked ? "Bạn đã thích bài này" : null,
                  userEngagement.saved ? "Bạn đã lưu bài này" : null,
                ]
                  .filter(Boolean)
                  .join(". ")
              }
            >
              {userEngagement.liked ? (
                <span className="inline-flex items-center gap-0.5 rounded-full border border-rose-500/35 bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">
                  <HeartIcon className="size-2.5 fill-current" aria-hidden />
                  Đã thích
                </span>
              ) : null}
              {userEngagement.saved ? (
                <span className="inline-flex items-center gap-0.5 rounded-full border border-primary/35 bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  <BookmarkIcon
                    className="size-2.5 fill-current"
                    aria-hidden
                  />
                  Đã lưu
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {post.isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/35 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                <BadgeCheckIcon className="size-3" aria-hidden />
                Verified
              </span>
            ) : null}
            {post.tags.slice(0, 2).map((t) => (
              <span
                key={t.id}
                className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {t.name}
              </span>
            ))}
            {post.tags.length > 2 ? (
              <span className="text-[11px] text-muted-foreground">
                +{post.tags.length - 2}
              </span>
            ) : null}
          </div>
          <h2 className="mt-2 font-heading text-base font-bold leading-snug tracking-tight text-foreground group-hover:text-primary sm:text-lg">
            {post.title}
          </h2>
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-snug text-muted-foreground">
            {post.excerpt}
          </p>
          <div
            className={cn(
              "mt-3 flex items-center gap-3 text-xs text-muted-foreground",
              onProfile && "justify-between",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <MessageCircleIcon className="size-3.5" aria-hidden />
                {post.commentCount}
              </span>
              <span className="inline-flex items-center gap-1">
                <HeartIcon className="size-3.5" aria-hidden />
                {post.likeCount}
              </span>
            </div>
            {onProfile ? (
              <time
                className="shrink-0 text-[11px] sm:text-xs"
                dateTime={post.updatedAt}
              >
                {formatDate(post.updatedAt)}
              </time>
            ) : null}
          </div>
        </div>
      </Link>

      {onProfile ? null : (
        <div className="flex items-center justify-between gap-2 border-t border-border px-4 pb-4 pt-3">
          <Link
            href={authorProfileHref}
            className="flex min-w-0 items-center gap-2 rounded-lg outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-primary/15 text-[11px] font-bold text-primary">
              {(post.author.displayName ?? post.author.username)
                .slice(0, 1)
                .toUpperCase()}
            </span>
            <span className="truncate text-xs font-medium text-foreground/90 sm:text-sm">
              {post.author.displayName ?? post.author.username}
            </span>
          </Link>
          <time
            className="shrink-0 text-[11px] text-muted-foreground sm:text-xs"
            dateTime={post.updatedAt}
          >
            {formatDate(post.updatedAt)}
          </time>
        </div>
      )}
    </article>
  );
}
