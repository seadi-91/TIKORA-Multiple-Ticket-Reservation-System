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
  const { logout } = useAuthStore();

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
      className="w-full lg:w-64 shrink-0 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#161922] p-4 sm:p-5 shadow-sm space-y-5"
    >
      {/* Customer Profile Widget - Refined & Calm */}
      <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
        <div className="w-11 h-11 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
          AB
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-[#0F172A] dark:text-white truncate">
              Abebe Bekele
            </h4>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Verified Customer</span>
          </span>
        </div>
      </div>

      {/* Navigation List - Beautiful & Subdued */}
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all gap-3 ${
                isActive
                  ? "bg-[#B45309] text-white shadow-xs font-bold"
                  : "text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
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
      <div className="border-t border-[#E2E8F0] dark:border-slate-800 pt-3">
        <button
          type="button"
          onClick={() => {
            logout();
            toast.success("Signed out successfully");
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default CustomerSidebar;
