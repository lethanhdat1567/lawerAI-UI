// src/lib/blog/queries.ts

import {
  getBlogAuthorById,
  mockBlogPosts,
  resolveBlogTags,
} from "@/lib/blog/mock-data";
import type {
  BlogPostDetail,
  BlogPostListItem,
  BlogSortMode,
} from "@/lib/blog/types";

function recordToListItem(p: (typeof mockBlogPosts)[0]): BlogPostListItem {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    status: p.status,
    isVerified: p.isVerified,
    tags: resolveBlogTags(p.tagSlugs),
    author: getBlogAuthorById(p.authorId),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

/** Bài blog của tác giả (gồm DRAFT — demo theo username mock). */
export function listMyBlogPosts(
  username: string | null | undefined,
): BlogPostListItem[] {
  const u = username?.trim();
  if (!u) return [];
  const rows = mockBlogPosts.filter((p) => {
    const a = getBlogAuthorById(p.authorId);
    return a.username === u;
  });
  return [...rows]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(recordToListItem);
}

export function listBlogPosts(filters: {
  q?: string;
  tagSlug?: string | null;
  sort: BlogSortMode;
  verifiedOnly?: boolean;
}): BlogPostListItem[] {
  const q = (filters.q ?? "").trim().toLowerCase();
  const tagSlug = filters.tagSlug?.trim() || null;
  const verifiedOnly = Boolean(filters.verifiedOnly);

  let rows = mockBlogPosts.filter((p) => p.status === "PUBLISHED");

  if (verifiedOnly) {
    rows = rows.filter((p) => p.isVerified);
  }

  if (tagSlug) {
    rows = rows.filter((p) => p.tagSlugs.includes(tagSlug));
  }

  if (q) {
    rows = rows.filter((p) => {
      const hay = `${p.title} ${p.excerpt} ${p.body}`.toLowerCase();
      return hay.includes(q);
    });
  }

  const sorted = [...rows].sort((a, b) => {
    const da = filters.sort === "updated" ? a.updatedAt : a.createdAt;
    const db = filters.sort === "updated" ? b.updatedAt : b.createdAt;
    return db.localeCompare(da);
  });

  return sorted.map(recordToListItem);
}

export function getBlogPostBySlug(slug: string): BlogPostDetail | null {
  const p = mockBlogPosts.find((x) => x.slug === slug);
  if (!p || p.status !== "PUBLISHED") return null;
  return {
    ...recordToListItem(p),
    body: p.body,
    verifiedAt: p.verifiedAt,
    verificationNotes: p.verificationNotes,
    legalCorpusVersion: p.legalCorpusVersion,
  };
}
