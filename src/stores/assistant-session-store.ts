// src/stores/assistant-session-store.ts — demo auth cho /assistant tới khi có JWT thật
import { create } from "zustand";

const STORAGE_KEY = "lawyerai-assistant-demo-auth";

interface AssistantSessionStore {
  isDemoLoggedIn: boolean;
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  setDemoLoggedIn: (value: boolean) => void;
  toggleDemoLoggedIn: () => void;
}

export const useAssistantSessionStore = create<AssistantSessionStore>((set, get) => ({
  isDemoLoggedIn: false,
  hydrated: false,
  setHydrated: (hydrated) => set({ hydrated }),
  setDemoLoggedIn: (value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    }
    set({ isDemoLoggedIn: value });
  },
  toggleDemoLoggedIn: () => {
    get().setDemoLoggedIn(!get().isDemoLoggedIn);
  },
}));

export function readAssistantDemoAuthFromStorage(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "1";
}
