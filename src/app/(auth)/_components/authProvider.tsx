"use client";

import { useCallback, useEffect, useRef } from "react";

import { signOutClient } from "@/lib/auth/signOutClient";
import { authService } from "@/services/auth/authService";
import { useAuthStore } from "@/stores/auth-store";

const REFRESH_BUFFER_MS = 60_000;
const MIN_REFRESH_DELAY_MS = 5_000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const accessTokenExpiresAt = useAuthStore((s) => s.accessTokenExpiresAt);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const setSession = useAuthStore((s) => s.setSession);
  const setUser = useAuthStore((s) => s.setUser);
  const ran = useRef(false);
  const isRefreshingRef = useRef(false);

  const refreshSession = useCallback(
    async (options?: {
      syncUser?: boolean;
      clearOnFailure?: boolean;
    }): Promise<boolean> => {
      if (isRefreshingRef.current) return false;
      isRefreshingRef.current = true;

      try {
        const r = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!r.ok) {
          if (options?.clearOnFailure) {
            await signOutClient();
          }
          return false;
        }

        const j = (await r.json()) as {
          accessToken: string;
          accessTokenExpiresAt: string;
        };

        setSession({
          accessToken: j.accessToken,
          accessTokenExpiresAt: j.accessTokenExpiresAt,
        });

        if (options?.syncUser) {
          try {
            const { user } = await authService.me();
            setUser(user);
          } catch {
            /* me optional */
          }
        }

        return true;
      } catch {
        if (options?.clearOnFailure) {
          await signOutClient();
        }
        return false;
      } finally {
        isRefreshingRef.current = false;
      }
    },
    [setSession, setUser],
  );

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        await refreshSession({ syncUser: true, clearOnFailure: false });
      } catch {
        /* offline / no cookie */
      } finally {
        setHydrated(true);
      }
    })();
  }, [refreshSession, setHydrated]);

  useEffect(() => {
    if (!accessTokenExpiresAt) return;

    const expiresAtMs = new Date(accessTokenExpiresAt).getTime();
    if (Number.isNaN(expiresAtMs)) return;

    const delay = Math.max(
      MIN_REFRESH_DELAY_MS,
      expiresAtMs - Date.now() - REFRESH_BUFFER_MS,
    );

    const timerId = window.setTimeout(() => {
      void refreshSession({ syncUser: true, clearOnFailure: true });
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [accessTokenExpiresAt, refreshSession]);

  return <>{children}</>;
}
