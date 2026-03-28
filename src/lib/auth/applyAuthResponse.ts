import { persistSessionCookies } from "@/lib/session/persistSession";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthTokensResponse } from "@/services/authTypes";

export async function applyAuthResponse(
  data: AuthTokensResponse,
): Promise<void> {
  useAuthStore.getState().setSession({
    accessToken: data.accessToken,
    accessTokenExpiresAt: data.accessTokenExpiresAt,
    user: data.user,
  });
  await persistSessionCookies(data);
}
