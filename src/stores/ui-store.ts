// src/stores/ui-store.ts
import { create } from "zustand";

interface UiStore {
  mobileNavOpen: boolean;
  setMobileNavOpen(open: boolean): void;
}

export const useUiStore = create<UiStore>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
}));
