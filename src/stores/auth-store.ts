import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { PublicUser } from "@/services/authTypes";

const AUTH_STORAGE_KEY = "lawyerai-auth-v2";

type AuthState = {
  accessToken: string | null;
  accessTokenExpiresAt: string | null;
  user: PublicUser | null;
  hydrated: boolean;
  setSession: (p: {
    accessToken: string;
    accessTokenExpiresAt: string;
    user?: PublicUser | null;
  }) => void;
  clearSession: () => void;
  setHydrated: (v: boolean) => void;
  setUser: (u: PublicUser | null) => void;
};

const ssrStorage = {
  getItem: () => null as string | null,
  setItem: () => {},
  removeItem: () => {},
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      accessTokenExpiresAt: null,
      user: null,
      hydrated: false,
      setSession: (p) =>
        set({
          accessToken: p.accessToken,
          accessTokenExpiresAt: p.accessTokenExpiresAt,
          user: p.user ?? null,
        }),
      clearSession: () =>
        set({
          accessToken: null,
          accessTokenExpiresAt: null,
          user: null,
        }),
      setHydrated: (v) => set({ hydrated: v }),
      setUser: (u) => set({ user: u }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : ssrStorage,
      ),
      partialize: (s) => ({
        accessToken: s.accessToken,
        accessTokenExpiresAt: s.accessTokenExpiresAt,
        user: s.user,
      }),
    },
  ),
);
