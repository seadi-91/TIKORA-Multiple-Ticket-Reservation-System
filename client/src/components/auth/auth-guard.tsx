"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { UserRole } from "@/types/auth.types";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Check if user is authenticated and token exists
    if (!isAuthenticated || !token || !user) {
      setAuthorized(false);
      logout();
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. Validate JWT token structure
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        // Mock or invalid token!
        setAuthorized(false);
        logout();
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Check token expiration
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        // Expired token
        setAuthorized(false);
        logout();
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
    } catch {
      setAuthorized(false);
      logout();
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 3. Role-based check
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        setAuthorized(false);
        // Redirect to their own dashboard
        if (user.role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else if (user.role === "ORGANIZATION") {
          router.replace("/provider/dashboard");
        } else if (user.role === "INSPECTOR") {
          router.replace("/inspector/scanner");
        } else {
          router.replace("/customer");
        }
        return;
      }
    }

    // Authorized!
    setAuthorized(true);
  }, [isAuthenticated, token, user, allowedRoles, router, pathname, logout]);

  // While checking, render nothing to avoid jarring flashing screens before redirecting
  if (authorized === null || authorized === false) {
    return null;
  }

  // Authorized
  return <>{children}</>;
}

