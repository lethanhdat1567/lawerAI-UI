import type { AuthTokensResponse } from "@/services/auth/authTypes";

export async function persistSessionCookies(
  data: Pick<
    AuthTokensResponse,
    "accessToken" | "refreshToken" | "accessTokenExpiresAt"
  >,
): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpiresAt: data.accessTokenExpiresAt,
    }),
  });
  if (!res.ok) {
    throw new Error("Không lưu được phiên (cookie session).");
  }
}

export async function clearSessionCookies(): Promise<void> {
  await fetch("/api/auth/session", {
    method: "DELETE",
    credentials: "include",
  });
}
