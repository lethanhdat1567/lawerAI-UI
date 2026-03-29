// src/lib/hub/types.ts — UI types aligned with Prisma Hub models

export type HubPostStatusUI = "PUBLISHED" | "HIDDEN";

export interface HubAuthor {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface HubCategoryUI {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
}

export interface HubOversightVersionUI {
  id: string;
  postId: string;
  version: number;
  summaryText: string;
  suggestionsJson: unknown;
  legalCorpusVersion: string | null;
  modelVersion: string | null;
  isCurrent: boolean;
  createdAt: string;
}

export interface HubCommentUI {
  id: string;
  postId: string;
  parentId: string | null;
  authorId: string;
  body: string;
  createdAt: string;
  likeCount: number;
}

/** Bình luận từ API kèm tác giả (mock có thể bổ sung khi build cây). */
export interface HubCommentWithAuthor extends HubCommentUI {
  author: HubAuthor;
}

export interface HubCommentNode extends HubCommentWithAuthor {
  replies: HubCommentNode[];
}

export interface HubPostRecord {
  id: string;
  categoryId: string | null;
  authorId: string;
  slug: string;
  title: string;
  body: string;
  status: HubPostStatusUI;
  createdAt: string;
  updatedAt: string;
  comments: HubCommentUI[];
  oversightVersions: HubOversightVersionUI[];
}

export interface HubPostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: HubPostStatusUI;
  category: HubCategoryUI | null;
  author: HubAuthor;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
}

export interface HubPostDetail extends HubPostListItem {
  body: string;
  comments: HubCommentWithAuthor[];
  oversightVersions: HubOversightVersionUI[];
}

export type HubSortMode = "new" | "updated";
