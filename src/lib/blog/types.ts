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

export interface BlogCommentUI {
  id: string;
  blogPostId: string;
  parentId: string | null;
  authorId: string;
  body: string;
  createdAt: string;
  likeCount: number;
}

export interface BlogCommentWithAuthor extends BlogCommentUI {
  author: BlogAuthor;
}

export interface BlogCommentNode extends BlogCommentWithAuthor {
  replies: BlogCommentNode[];
}

export interface BlogPostListItem {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  excerpt: string;
  status: BlogPostStatusUI;
  isVerified: boolean;
  tags: BlogTag[];
  author: BlogAuthor;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  likeCount: number;
}

export interface BlogPostDetail extends BlogPostListItem {
  body: string;
  verifiedAt: string | null;
  verificationNotes: string | null;
  legalCorpusVersion: string | null;
  comments: BlogCommentWithAuthor[];
  savedCount: number;
}

export type BlogSortMode = "new" | "updated";
