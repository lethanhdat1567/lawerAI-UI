// src/lib/blog/types.ts — UI types aligned with Prisma BlogPost / Tag

export type BlogPostStatusUI = "PUBLISHED" | "DRAFT";

export interface BlogAuthor {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface BlogTag {
  id: string;
  slug: string;
  name: string;
}

export interface BlogPostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: BlogPostStatusUI;
  isVerified: boolean;
  tags: BlogTag[];
  author: BlogAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostDetail extends BlogPostListItem {
  body: string;
  verifiedAt: string | null;
  verificationNotes: string | null;
  legalCorpusVersion: string | null;
}

export type BlogSortMode = "new" | "updated";
