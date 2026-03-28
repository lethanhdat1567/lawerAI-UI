// src/app/(marketing)/blog/_components/blog-post-card.tsx
import Link from "next/link";
import { BadgeCheckIcon } from "lucide-react";

import type { BlogPostListItem } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogPostCard({ post }: { post: BlogPostListItem }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col rounded-2xl border border-border bg-card/45 p-5 backdrop-blur-md transition-[border-color,box-shadow] sm:p-6",
        "hover:border-primary/30 hover:shadow-[0_0_40px_-16px_oklch(0.55_0.18_285/0.35)]"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
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
      <h2 className="mt-3 font-heading text-lg font-bold leading-snug tracking-tight text-foreground group-hover:text-primary sm:text-xl">
        {post.title}
      </h2>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-primary/15 text-xs font-bold text-primary">
            {(post.author.displayName ?? post.author.username)
              .slice(0, 1)
              .toUpperCase()}
          </span>
          <span className="truncate text-sm font-medium text-foreground/90">
            {post.author.displayName ?? post.author.username}
          </span>
        </div>
        <time
          className="shrink-0 text-xs text-muted-foreground"
          dateTime={post.updatedAt}
        >
          {formatDate(post.updatedAt)}
        </time>
      </div>
    </Link>
  );
}
