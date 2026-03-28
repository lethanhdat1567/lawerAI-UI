import { getApiBaseUrl } from "@/lib/api/config";
import type { ApiFailure, ApiSuccess } from "@/lib/api/types";
import type { TokenPair } from "@/services/authTypes";

/** Server-side: gọi BE refresh (không qua cookie). */
export async function beRefresh(refreshToken: string): Promise<TokenPair> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const json = (await res.json()) as ApiSuccess<TokenPair> | ApiFailure;
  if (!res.ok || !json.success) {
    const err = json.success === false ? json.error : null;
    throw new Error(err?.message ?? `Refresh failed (${res.status})`);
  }
  return json.data;
}

/** Server-side: BE logout. */
export async function beLogout(refreshToken: string): Promise<void> {
  await fetch(`${getApiBaseUrl()}/api/v1/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
}
