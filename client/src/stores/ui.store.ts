"use client";

import { create } from "zustand";

interface UiState {
  theme: "light" | "dark" | "system";
  isMobileMenuOpen: boolean;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  theme: "dark",
  isMobileMenuOpen: false,
  setTheme: (theme) => set({ theme }),
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));

export default useUiStore;

