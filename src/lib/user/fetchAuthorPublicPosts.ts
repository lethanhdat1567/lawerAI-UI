import "server-only";

import { getApiBaseUrl } from "@/lib/api/config";
import type { ApiFailure, ApiSuccess } from "@/lib/api/types";
import type { BlogPostListItem } from "@/lib/blog/types";
import type { HubPostListItem } from "@/lib/hub/types";

const PROFILE_POSTS_PAGE_SIZE = 12;

function parseList<T>(
  text: string,
  res: Response,
): { items: T[]; total: number } | null {
  if (!text || res.status !== 200) return null;
  let parsed: ApiSuccess<{ items: T[]; total: number }> | ApiFailure;
  try {
    parsed = JSON.parse(text) as ApiSuccess<{
      items: T[];
      total: number;
    }> | ApiFailure;
  } catch {
    return null;
  }
  if (!parsed.success || !res.ok) return null;
  return { items: parsed.data.items, total: parsed.data.total };
}

/** Bài blog đã xuất bản của user (trang hồ sơ công khai). */
export async function fetchPublicBlogPostsByAuthorId(
  authorId: string,
): Promise<{ items: BlogPostListItem[]; total: number }> {
  const sp = new URLSearchParams();
  sp.set("authorId", authorId);
  sp.set("sort", "new");
  sp.set("page", "1");
  sp.set("pageSize", String(PROFILE_POSTS_PAGE_SIZE));
  const url = `${getApiBaseUrl()}/api/v1/blog/posts?${sp.toString()}`;
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  const data = parseList<BlogPostListItem>(text, res);
  return data ?? { items: [], total: 0 };
}

/** Bài Hub đã xuất bản của user (trang hồ sơ công khai). */
export async function fetchPublicHubPostsByAuthorId(
  authorId: string,
): Promise<{ items: HubPostListItem[]; total: number }> {
  const sp = new URLSearchParams();
  sp.set("authorId", authorId);
  sp.set("sort", "new");
  sp.set("page", "1");
  sp.set("pageSize", String(PROFILE_POSTS_PAGE_SIZE));
  const url = `${getApiBaseUrl()}/api/v1/hub/posts?${sp.toString()}`;
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  const data = parseList<HubPostListItem>(text, res);
  return data ?? { items: [], total: 0 };
}
