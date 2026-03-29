import { apiRequest } from "@/lib/api/http.client";
import type {
  HubCategoryUI,
  HubCommentWithAuthor,
  HubPostDetail,
  HubPostListItem,
  HubSortMode,
} from "@/lib/hub/types";

export async function hubPublicCategories() {
  return apiRequest<{ categories: HubCategoryUI[] }>(
    "/api/v1/hub/categories",
    { skipRefreshRetry: true },
  );
}

export async function hubPublicPosts(params: {
  q?: string;
  categorySlug?: string | null;
  sort: HubSortMode;
  page: number;
  pageSize: number;
  authorId?: string | null;
}) {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.categorySlug?.trim()) {
    sp.set("categorySlug", params.categorySlug.trim());
  }
  sp.set("sort", params.sort);
  sp.set("page", String(params.page));
  sp.set("pageSize", String(params.pageSize));
  if (params.authorId?.trim()) sp.set("authorId", params.authorId.trim());
  return apiRequest<{
    items: HubPostListItem[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/api/v1/hub/posts?${sp.toString()}`, { skipRefreshRetry: true });
}

export async function hubPublicPostBySlug(slug: string) {
  return apiRequest<{ post: HubPostDetail }>(
    `/api/v1/hub/posts/slug/${encodeURIComponent(slug)}`,
    { skipRefreshRetry: true },
  );
}

export async function hubMePosts(params: { page?: number; pageSize?: number }) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page ?? 1));
  sp.set("pageSize", String(params.pageSize ?? 24));
  return apiRequest<{
    items: HubPostListItem[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/api/v1/hub/me/posts?${sp.toString()}`);
}

export async function hubMePostById(id: string) {
  return apiRequest<{ post: HubPostDetail }>(`/api/v1/hub/me/posts/${id}`);
}

export async function hubMeCreatePost(body: {
  title: string;
  body: string;
  categoryId?: string | null;
  status?: "PUBLISHED" | "HIDDEN";
}) {
  return apiRequest<{ post: HubPostListItem }>("/api/v1/hub/me/posts", {
    method: "POST",
    body,
  });
}

export async function hubMePatchPost(
  id: string,
  body: Partial<{
    title: string;
    body: string;
    categoryId: string | null;
    status: "PUBLISHED" | "HIDDEN";
  }>,
) {
  return apiRequest<{ post: HubPostListItem }>(`/api/v1/hub/me/posts/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function hubMeDeletePost(id: string) {
  return apiRequest<{ ok: boolean }>(`/api/v1/hub/me/posts/${id}`, {
    method: "DELETE",
  });
}

export async function hubMeCreateComment(
  postId: string,
  body: { body: string; parentId?: string | null },
) {
  const path = `/api/v1/hub/me/posts/${encodeURIComponent(postId)}/comments`;
  return apiRequest<{ comment: HubCommentWithAuthor }>(path, {
    method: "POST",
    body,
  });
}

export async function hubMePatchComment(
  postId: string,
  commentId: string,
  body: { body: string },
) {
  const path = `/api/v1/hub/me/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`;
  return apiRequest<{ comment: HubCommentWithAuthor }>(path, {
    method: "PATCH",
    body,
  });
}

export async function hubMeDeleteComment(postId: string, commentId: string) {
  const path = `/api/v1/hub/me/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`;
  return apiRequest<{ ok: boolean }>(path, { method: "DELETE" });
}

export async function hubMeCommentLikesBatch(commentIds: string[]) {
  const unique = [...new Set(commentIds)].slice(0, 48);
  const sp = new URLSearchParams();
  if (unique.length) sp.set("ids", unique.join(","));
  return apiRequest<{ items: { commentId: string; liked: boolean }[] }>(
    `/api/v1/hub/me/comment-likes-batch?${sp.toString()}`,
  );
}

export async function hubMeToggleCommentLike(postId: string, commentId: string) {
  return apiRequest<{ liked: boolean; likeCount: number }>(
    `/api/v1/hub/me/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}/like`,
    { method: "POST", body: {} },
  );
}

export async function hubAdminPostById(id: string) {
  return apiRequest<{ post: HubPostDetail }>(`/api/v1/admin/hub/posts/${id}`);
}

export async function hubAdminPosts(params: {
  q?: string;
  categorySlug?: string | null;
  sort: HubSortMode;
  page: number;
  pageSize: number;
  status?: "PUBLISHED" | "HIDDEN" | "";
  authorId?: string;
}) {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.categorySlug?.trim()) {
    sp.set("categorySlug", params.categorySlug.trim());
  }
  sp.set("sort", params.sort);
  sp.set("page", String(params.page));
  sp.set("pageSize", String(params.pageSize));
  if (params.status) sp.set("status", params.status);
  if (params.authorId?.trim()) sp.set("authorId", params.authorId.trim());
  return apiRequest<{
    items: HubPostListItem[];
    total: number;
    page: number;
    pageSize: number;
  }>(`/api/v1/admin/hub/posts?${sp.toString()}`);
}

export async function hubAdminCreatePost(body: {
  authorId: string;
  title: string;
  body: string;
  categoryId?: string | null;
  status?: "PUBLISHED" | "HIDDEN";
  slug?: string;
}) {
  return apiRequest<{ post: HubPostListItem }>("/api/v1/admin/hub/posts", {
    method: "POST",
    body,
  });
}

export async function hubAdminPatchPost(
  id: string,
  body: Partial<{
    title: string;
    body: string;
    categoryId: string | null;
    status: "PUBLISHED" | "HIDDEN";
    slug: string;
    authorId: string;
  }>,
) {
  return apiRequest<{ post: HubPostListItem }>(
    `/api/v1/admin/hub/posts/${id}`,
    {
      method: "PATCH",
      body,
    },
  );
}

export async function hubAdminDeletePost(id: string) {
  return apiRequest<{ ok: boolean }>(`/api/v1/admin/hub/posts/${id}`, {
    method: "DELETE",
  });
}
