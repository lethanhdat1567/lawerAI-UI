import "server-only";

import { getApiBaseUrl } from "@/lib/api/config";
import type { ApiFailure, ApiSuccess } from "@/lib/api/types";

export type PublicProfile = {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
};

export async function fetchPublicProfileByUsername(
  usernameParam: string,
): Promise<PublicProfile | null> {
  const username = decodeURIComponent(usernameParam).trim();
  if (!username) return null;

  const url = `${getApiBaseUrl()}/api/v1/profiles/${encodeURIComponent(username)}`;
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  if (!text || res.status === 404) return null;

  let parsed: ApiSuccess<{ profile: PublicProfile }> | ApiFailure;
  try {
    parsed = JSON.parse(text) as ApiSuccess<{ profile: PublicProfile }> | ApiFailure;
  } catch {
    return null;
  }
  if (!parsed.success || !res.ok) return null;
  return parsed.data.profile;
}
