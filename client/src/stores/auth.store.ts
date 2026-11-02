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

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tikora_auth_token", token);
      localStorage.setItem("tikora_auth_user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, error: null });
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tikora_auth_token");
      localStorage.removeItem("tikora_auth_user");
    }
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },
}));

