import { clearSessionCookies } from "@/lib/session/persistSession";
import { useAuthStore } from "@/stores/auth-store";

export async function signOutClient(): Promise<void> {
  useAuthStore.getState().clearSession();
  try {
    await clearSessionCookies();
  } catch {
    /* best-effort */
  }
}
