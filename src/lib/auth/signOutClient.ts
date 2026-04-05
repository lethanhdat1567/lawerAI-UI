import { clearSessionCookies } from "@/lib/session/persistSession";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export async function signOutClient(): Promise<void> {
  useAuthStore.getState().clearSession();
  try {
    await clearSessionCookies();
  } catch {
    /* best-effort */
  } finally {
    toast.success("Đăng xuất thành công");
  }
}
