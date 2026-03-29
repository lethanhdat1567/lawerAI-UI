import "server-only";

import { getApiBaseUrl } from "@/lib/api/config";
import type { ApiFailure, ApiSuccess } from "@/lib/api/types";
import type { BlogPostDetail } from "@/lib/blog/types";

export async function fetchBlogPostBySlugPublic(
  slug: string,
): Promise<BlogPostDetail | null> {
  const url = `${getApiBaseUrl()}/api/v1/blog/posts/slug/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  if (!text || res.status === 404) return null;
  let parsed: ApiSuccess<{ post: BlogPostDetail }> | ApiFailure;
  try {
    parsed = JSON.parse(text) as ApiSuccess<{ post: BlogPostDetail }> | ApiFailure;
  } catch {
    return null;
  }
  if (!parsed.success || !res.ok) return null;
  return parsed.data.post;
}
