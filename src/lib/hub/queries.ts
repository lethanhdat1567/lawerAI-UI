// src/lib/hub/queries.ts — client-side queries over mock data

import {
  getAuthorById,
  getCategoryById,
  mockCategories,
  mockPosts,
} from "@/lib/hub/mock-data";
import { buildCommentTree } from "@/lib/hub/buildCommentTree";
import type {
  HubCommentWithAuthor,
  HubPostDetail,
  HubPostListItem,
  HubSortMode,
} from "@/lib/hub/types";

export { buildCommentTree };

const EXCERPT_LEN = 180;

function excerptFromBody(body: string): string {
  const flat = body
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
  if (flat.length <= EXCERPT_LEN) return flat;
  return `${flat.slice(0, EXCERPT_LEN).trim()}…`;
}

function recordToListItem(p: (typeof mockPosts)[0]): HubPostListItem {
  const author = getAuthorById(p.authorId);
  const category = getCategoryById(p.categoryId);
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: excerptFromBody(p.body),
    status: p.status,
    category,
    author,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    commentCount: p.comments.length,
  };
}

/** Bài Hub của tác giả (demo: lọc theo `username` trùng mock author). */
export function listMyHubPosts(
  username: string | null | undefined,
): HubPostListItem[] {
  const u = username?.trim();
  if (!u) return [];
  const rows = mockPosts.filter((p) => {
    const a = getAuthorById(p.authorId);
    return a.username === u;
  });
  return [...rows]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(recordToListItem);
}

export function listHubPosts(filters: {
  q?: string;
  categorySlug?: string | null;
  sort: HubSortMode;
}): HubPostListItem[] {
  const q = (filters.q ?? "").trim().toLowerCase();
  const catSlug = filters.categorySlug?.trim() || null;

  let rows = mockPosts.filter((p) => p.status === "PUBLISHED");

  if (catSlug) {
    const cat = mockCategories.find((c) => c.slug === catSlug);
    if (cat) {
      rows = rows.filter((p) => p.categoryId === cat.id);
    } else {
      rows = [];
    }
  }

  if (q) {
    rows = rows.filter((p) => {
      const hay = `${p.title} ${p.body}`.toLowerCase();
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

export function getPostBySlug(slug: string): HubPostDetail | null {
  const p = mockPosts.find((x) => x.slug === slug);
  if (!p || p.status !== "PUBLISHED") return null;
  const base = recordToListItem(p);
  const comments: HubCommentWithAuthor[] = p.comments.map((c) => ({
    ...c,
    author: getAuthorById(c.authorId),
  }));
  return {
    ...base,
    body: p.body,
    comments,
    aiFeedback: p.aiFeedback ?? null,
  };
}
