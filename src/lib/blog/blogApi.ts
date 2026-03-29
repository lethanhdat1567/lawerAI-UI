import { apiRequest } from "@/lib/api/http.client";
import type {
  BlogCommentWithAuthor,
  BlogPostDetail,
  BlogPostListItem,
  BlogSortMode,
  BlogTag,
} from "@/lib/blog/types";

export async function blogPublicTags() {
  return apiRequest<{ tags: BlogTag[] }>("/api/v1/blog/tags", {
    skipRefreshRetry: true,
  });
}

export async function blogPublicPosts(params: {
  q?: string;
  tagSlug?: string | null;
  sort: BlogSortMode;
  verifiedOnly: boolean;
  page: number;
  pageSize: number;
  authorId?: string | null;
}) {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.tagSlug?.trim()) sp.set("tagSlug", params.tagSlug.trim());
  sp.set("sort", params.sort);
  sp.set("page", String(params.page));
  sp.set("pageSize", String(params.pageSize));
  if (params.verifiedOnly) sp.set("verifiedOnly", "true");
  if (params.authorId?.trim()) sp.set("authorId", params.authorId.trim());
  return apiRequest<{
    items: BlogPostListItem[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/api/v1/blog/posts?${sp.toString()}`, { skipRefreshRetry: true });
}

export async function blogPublicPostBySlug(slug: string) {
  return apiRequest<{ post: BlogPostDetail }>(
    `/api/v1/blog/posts/slug/${encodeURIComponent(slug)}`,
    { skipRefreshRetry: true },
  );
}

export async function blogMePosts(params: { page?: number; pageSize?: number }) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page ?? 1));
  sp.set("pageSize", String(params.pageSize ?? 24));
  return apiRequest<{
    items: BlogPostListItem[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/api/v1/blog/me/posts?${sp.toString()}`);
}

export async function blogMeSavedPosts(params: {
  page?: number;
  pageSize?: number;
}) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page ?? 1));
  sp.set("pageSize", String(params.pageSize ?? 24));
  return apiRequest<{
    items: BlogPostListItem[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/api/v1/blog/me/saved-posts?${sp.toString()}`);
}

export async function blogMeEngagementBatch(postIds: string[]) {
  const unique = [...new Set(postIds)].slice(0, 48);
  const sp = new URLSearchParams();
  if (unique.length) sp.set("ids", unique.join(","));
  return apiRequest<{
    items: { postId: string; liked: boolean; saved: boolean }[];
  }>(`/api/v1/blog/me/engagement-batch?${sp.toString()}`);
}

export async function blogMePostById(id: string) {
  return apiRequest<{ post: BlogPostDetail }>(`/api/v1/blog/me/posts/${id}`);
}

export async function blogMeCreatePost(body: {
  title: string;
  body: string;
  excerpt?: string | null;
  thumbnailUrl?: string | null;
  status?: "DRAFT" | "PUBLISHED";
  slug?: string | null;
  tagIds?: string[];
}) {
  return apiRequest<{ post: BlogPostListItem }>("/api/v1/blog/me/posts", {
    method: "POST",
    body,
  });
}

export async function blogMePatchPost(
  id: string,
  body: Partial<{
    title: string;
    body: string;
    excerpt: string | null;
    thumbnailUrl: string | null;
    status: "DRAFT" | "PUBLISHED";
    slug: string | null;
    tagIds: string[];
  }>,
) {
  return apiRequest<{ post: BlogPostListItem }>(
    `/api/v1/blog/me/posts/${id}`,
    {
      method: "PATCH",
      body,
    },
  );
}

export async function blogMeDeletePost(id: string) {
  return apiRequest<{ ok: boolean }>(`/api/v1/blog/me/posts/${id}`, {
    method: "DELETE",
  });
}

export async function blogMeCreateComment(
  postId: string,
  body: { body: string; parentId?: string | null },
) {
  const path = `/api/v1/blog/me/posts/${encodeURIComponent(postId)}/comments`;
  return apiRequest<{ comment: BlogCommentWithAuthor }>(path, {
    method: "POST",
    body,
  });
}

export async function blogMePatchComment(
  postId: string,
  commentId: string,
  body: { body: string },
) {
  const path = `/api/v1/blog/me/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`;
  return apiRequest<{ comment: BlogCommentWithAuthor }>(path, {
    method: "PATCH",
    body,
  });
}

export async function blogMeDeleteComment(postId: string, commentId: string) {
  const path = `/api/v1/blog/me/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`;
  return apiRequest<{ ok: boolean }>(path, { method: "DELETE" });
}

export async function blogMeEngagement(postId: string) {
  return apiRequest<{ liked: boolean; saved: boolean }>(
    `/api/v1/blog/me/posts/${encodeURIComponent(postId)}/engagement`,
  );
}

export async function blogMeToggleLike(postId: string) {
  return apiRequest<{ liked: boolean; likeCount: number }>(
    `/api/v1/blog/me/posts/${encodeURIComponent(postId)}/like`,
    { method: "POST", body: {} },
  );
}

export async function blogMeToggleSave(postId: string) {
  return apiRequest<{ saved: boolean; savedCount: number }>(
    `/api/v1/blog/me/posts/${encodeURIComponent(postId)}/save`,
    { method: "POST", body: {} },
  );
}

export async function blogMeCommentLikesBatch(commentIds: string[]) {
  const unique = [...new Set(commentIds)].slice(0, 48);
  const sp = new URLSearchParams();
  if (unique.length) sp.set("ids", unique.join(","));
  return apiRequest<{ items: { commentId: string; liked: boolean }[] }>(
    `/api/v1/blog/me/comment-likes-batch?${sp.toString()}`,
  );
}

export async function blogMeToggleCommentLike(
  postId: string,
  commentId: string,
) {
  return apiRequest<{ liked: boolean; likeCount: number }>(
    `/api/v1/blog/me/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}/like`,
    { method: "POST", body: {} },
  );
}

export async function blogAdminPostById(id: string) {
  return apiRequest<{ post: BlogPostDetail }>(
    `/api/v1/admin/blog/posts/${id}`,
  );
}

export async function blogAdminPosts(params: {
  q?: string;
  tagSlug?: string | null;
  sort: BlogSortMode;
  page: number;
  pageSize: number;
  status?: "DRAFT" | "PUBLISHED" | "";
  verifiedOnly?: boolean;
  authorId?: string;
}) {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.tagSlug?.trim()) sp.set("tagSlug", params.tagSlug.trim());
  sp.set("sort", params.sort);
  sp.set("page", String(params.page));
  sp.set("pageSize", String(params.pageSize));
  if (params.status) sp.set("status", params.status);
  if (params.authorId?.trim()) sp.set("authorId", params.authorId.trim());
  if (params.verifiedOnly) sp.set("verifiedOnly", "true");
  return apiRequest<{
    items: BlogPostListItem[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/api/v1/admin/blog/posts?${sp.toString()}`);
}

export async function blogAdminCreatePost(body: {
  authorId: string;
  title: string;
  body: string;
  excerpt?: string | null;
  thumbnailUrl?: string | null;
  status?: "DRAFT" | "PUBLISHED";
  slug?: string | null;
  tagIds?: string[];
}) {
  return apiRequest<{ post: BlogPostListItem }>("/api/v1/admin/blog/posts", {
    method: "POST",
    body,
  });
}

export async function blogAdminPatchPost(
  id: string,
  body: Partial<{
    title: string;
    body: string;
    excerpt: string | null;
    thumbnailUrl: string | null;
    status: "DRAFT" | "PUBLISHED";
    slug: string | null;
    authorId: string;
    tagIds: string[];
    isVerified: boolean;
    verificationNotes: string | null;
    legalCorpusVersion: string | null;
  }>,
) {
  return apiRequest<{ post: BlogPostListItem }>(
    `/api/v1/admin/blog/posts/${id}`,
    {
      method: "PATCH",
      body,
    },
  );
}

export async function blogAdminDeletePost(id: string) {
  return apiRequest<{ ok: boolean }>(`/api/v1/admin/blog/posts/${id}`, {
    method: "DELETE",
  });
}
