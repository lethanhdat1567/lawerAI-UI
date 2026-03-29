"use client";

import { useEffect, useRef } from "react";

import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const setSession = useAuthStore((s) => s.setSession);
  const setUser = useAuthStore((s) => s.setUser);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const r = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (r.ok) {
          const j = (await r.json()) as {
            accessToken: string;
            accessTokenExpiresAt: string;
          };
          setSession({
            accessToken: j.accessToken,
            accessTokenExpiresAt: j.accessTokenExpiresAt,
          });
          try {
            const { user } = await authService.me();
            setUser(user);
          } catch {
            /* me optional */
          }
        }
      } catch {
        /* offline / no cookie */
      } finally {
        setHydrated(true);
      }
    })();
  }, [setHydrated, setSession, setUser]);

  return <>{children}</>;
}
