// src/app/(marketing)/blog/_components/blogPostDetailHeader.tsx
import Link from "next/link";
import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react";

import type { BlogPostDetail } from "@/lib/blog/types";
import { resolveApiAssetUrl } from "@/lib/media/resolveApiAssetUrl";
import { userProfilePath } from "@/lib/user/profilePath";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogPostDetailHeader({ post }: { post: BlogPostDetail }) {
  const firstTag = post.tags[0];
  const coverSrc = resolveApiAssetUrl(post.thumbnailUrl);

  return (
    <header className="border-b border-border pb-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/blog" className="hover:text-primary">
          Blog
        </Link>
        <ChevronRightIcon className="size-3.5 shrink-0 opacity-60" aria-hidden />
        {firstTag ? (
          <>
            <Link
              href={`/blog?tag=${encodeURIComponent(firstTag.slug)}`}
              className="hover:text-primary"
            >
              {firstTag.name}
            </Link>
            <ChevronRightIcon
              className="size-3.5 shrink-0 opacity-60"
              aria-hidden
            />
          </>
        ) : null}
        <span className="line-clamp-2 text-foreground/80">{post.title}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2">
        {post.isVerified ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/35 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary">
            <BadgeCheckIcon className="size-3.5" aria-hidden />
            Verified
          </span>
        ) : null}
        {post.tags.map((t) => (
          <Link
            key={t.id}
            href={`/blog?tag=${encodeURIComponent(t.slug)}`}
            className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            {t.name}
          </Link>
        ))}
      </div>

      <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
        {post.title}
      </h1>

      {coverSrc ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverSrc}
            alt=""
            className="aspect-[21/9] w-full object-cover"
          />
        </div>
      ) : null}

      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <Link
          href={userProfilePath(post.author.username)}
          className="flex items-center gap-2 rounded-lg outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="flex size-9 items-center justify-center rounded-full border border-border bg-primary/15 text-sm font-bold text-primary">
            {(post.author.displayName ?? post.author.username)
              .slice(0, 1)
              .toUpperCase()}
          </span>
          <span className="font-medium text-foreground/90">
            {post.author.displayName ?? post.author.username}
          </span>
          <span className="text-muted-foreground/80">
            @{post.author.username}
          </span>
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
