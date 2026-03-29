import "server-only";

import { getApiBaseUrl } from "@/lib/api/config";
import type { ApiFailure, ApiSuccess } from "@/lib/api/types";
import type { HubPostDetail } from "@/lib/hub/types";

export async function fetchHubPostDetailPublic(
  slug: string,
): Promise<HubPostDetail | null> {
  const url = `${getApiBaseUrl()}/api/v1/hub/posts/slug/${encodeURIComponent(slug)}`;
  /* Always fresh: avoid stale post body/title after create or edit (client navigation). */
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  if (!text || res.status === 404) return null;
  let parsed: ApiSuccess<{ post: HubPostDetail }> | ApiFailure;
  try {
    parsed = JSON.parse(text) as ApiSuccess<{ post: HubPostDetail }> | ApiFailure;
  } catch {
    return null;
  }
  if (!parsed.success || !res.ok) return null;
  return parsed.data.post;
}
