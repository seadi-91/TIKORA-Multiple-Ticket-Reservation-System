"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ticket,
  Compass,
  QrCode,
  Heart,
  User,
} from "lucide-react";
import { useBookingStore } from "@/stores/booking.store";
import { useAuthStore } from "@/stores/auth.store";

export function GuestBottomNav() {
  const pathname = usePathname();
  const { favorites } = useBookingStore();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Do not show on admin, provider, or inspector views
  if (
    !pathname ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/provider") ||
    pathname.startsWith("/inspector") ||
    pathname.startsWith("/customer")
  ) {
    return null;
  }

  const isAuth = mounted && isAuthenticated;

  const accountHref = isAuth
    ? user?.role === "ADMIN"
      ? "/admin/dashboard"
      : user?.role === "ORGANIZATION"
      ? "/provider"
      : user?.role === "INSPECTOR"
      ? "/inspector"
      : "/customer"
    : "/login";

  const navItems = [
    {
      id: "home",
      label: "Home",
      href: "/",
      icon: Ticket,
      isActive: pathname === "/",
    },
    {
      id: "explore",
      label: "Explore",
      href: "/search",
      icon: Compass,
      isActive: pathname.startsWith("/search"),
    },
    {
      id: "passes",
      label: "My Passes",
      href: isAuth ? "/customer/tickets" : "/login",
      icon: QrCode,
      isActive: pathname === "/customer/tickets",
    },
    {
      id: "saved",
      label: "Saved",
      href: isAuth ? "/customer/favorites" : "/login",
      icon: Heart,
      badge: mounted && favorites.length > 0 ? favorites.length : undefined,
      isActive: pathname === "/customer/favorites",
    },
    {
      id: "account",
      label: isAuth ? "Account" : "Sign In",
      href: accountHref,
      icon: User,
      isActive: pathname === "/login" || pathname === "/register" || pathname.startsWith("/customer"),
    },
  ];

  return (
    <nav
      aria-label="Public Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 shadow-lg pb-safe"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] transition-all touch-manipulation ${
                item.isActive
                  ? "text-amber-600 dark:text-amber-400 font-bold scale-105"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-amber-600 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white dark:ring-[#161922]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default GuestBottomNav;
