"use client";

import { create } from "zustand";
import { AuthUser, AuthState } from "@/types/auth.types";

interface AuthActions {
  setAuth: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

// Initial hydration from localStorage if available
const getStoredAuth = (): { user: AuthUser | null; token: string | null; isAuthenticated: boolean } => {
  if (typeof window === "undefined") {
    return { user: null, token: null, isAuthenticated: false };
  }
  try {
    const token = localStorage.getItem("tikora_auth_token");
    const userJson = localStorage.getItem("tikora_auth_user");
    if (token && userJson) {
      const user = JSON.parse(userJson) as AuthUser;
      return { user, token, isAuthenticated: true };
    }
  } catch (err) {
    console.warn("Failed to restore stored session:", err);
  }
  return { user: null, token: null, isAuthenticated: false };
};

const initialAuth = getStoredAuth();

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: initialAuth.user,
  token: initialAuth.token,
  isAuthenticated: initialAuth.isAuthenticated,
  isLoading: false,
  error: null,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("tikora_auth_token", token);
        localStorage.setItem("tikora_auth_user", JSON.stringify(user));
        document.cookie = `tikora_auth_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
      } catch (err) {
        console.error("Storage error:", err);
      }
    }
    set({ user, token, isAuthenticated: true, error: null });
  },

  setUser: (user) => {
    if (typeof window !== "undefined" && user) {
      localStorage.setItem("tikora_auth_user", JSON.stringify(user));
    }
    set({ user, isAuthenticated: !!user });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  logout: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("tikora_auth_token");
        localStorage.removeItem("tikora_auth_user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
        // Clear all auth cookies
        document.cookie = "tikora_auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } catch (err) {
        console.error("Failed to clean up auth on logout:", err);
      }
    }
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },
}));
