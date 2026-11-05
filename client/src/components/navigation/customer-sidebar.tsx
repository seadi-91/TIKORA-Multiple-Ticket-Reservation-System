"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  QrCode,
  Heart,
  Bell,
  CreditCard,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CUSTOMER_ROUTES, AUTH_ROUTES } from "@/lib/constants";
import { useBookingStore } from "@/stores/booking.store";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export function CustomerSidebar() {
  const pathname = usePathname();
  const { bookings, favorites, notifications } = useBookingStore();
  const { user, logout } = useAuthStore();
  const displayName = user?.name || "Abebe Bekele";
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const activeBookings = bookings.filter((b) => b.bookingStatus === "CONFIRMED").length;

  const navItems = [
    {
      label: "Overview",
      href: CUSTOMER_ROUTES.OVERVIEW,
      icon: LayoutDashboard,
    },
    {
      label: "My Bookings",
      href: CUSTOMER_ROUTES.BOOKINGS,
      icon: Ticket,
      badge: activeBookings > 0 ? `${activeBookings} active` : undefined,
    },
    {
      label: "Digital QR Passes",
      href: CUSTOMER_ROUTES.TICKETS,
      icon: QrCode,
      badge: "Wallet",
    },
    {
      label: "Saved Wishlist",
      href: CUSTOMER_ROUTES.FAVORITES,
      icon: Heart,
      badge: favorites.length > 0 ? `${favorites.length}` : undefined,
    },
    {
      label: "Notifications",
      href: CUSTOMER_ROUTES.NOTIFICATIONS,
      icon: Bell,
      badge: unreadNotifs > 0 ? `${unreadNotifs} new` : undefined,
      badgeColor: "bg-amber-500 text-slate-950 font-black",
    },
    {
      label: "Payment History",
      href: CUSTOMER_ROUTES.PAYMENTS,
      icon: CreditCard,
    },
    {
      label: "Customer Profile",
      href: CUSTOMER_ROUTES.PROFILE,
      icon: User,
    },
    {
      label: "Account Settings",
      href: CUSTOMER_ROUTES.SETTINGS,
      icon: Settings,
    },
    {
      label: "Help & Support Desk",
      href: "/contact",
      icon: HelpCircle,
    },
  ];

  return (
    <aside
      className="w-full lg:w-64 shrink-0 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#161922] p-4 shadow-xs space-y-4 overflow-hidden select-none"
    >
      {/* Customer Profile Widget - Refined & Spacious */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
          {userInitials}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
            {displayName}
          </h4>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Verified Customer</span>
          </span>
        </div>
      </div>

      {/* Navigation List - Non-scrollable, Spacious & Elegant */}
      <nav className="space-y-1 overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all gap-3 ${
                isActive
                  ? "bg-amber-600 text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge ? (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className={`w-3.5 h-3.5 opacity-40 shrink-0 ${isActive ? "text-white" : ""}`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 pt-2.5">
        <button
          type="button"
          onClick={() => {
            logout();
            toast.success("Signed out successfully");
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default CustomerSidebar;
