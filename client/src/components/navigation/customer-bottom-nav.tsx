"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  QrCode,
  Heart,
  User,
} from "lucide-react";
import { CUSTOMER_ROUTES } from "@/lib/constants";
import { useBookingStore } from "@/stores/booking.store";
import { useLanguage } from "@/providers/language-provider";

export function CustomerBottomNav() {
  const pathname = usePathname();
  const { bookings, favorites } = useBookingStore();
  const { t } = useLanguage();

  const activeBookings = bookings.filter((b) => b.bookingStatus === "CONFIRMED").length;

  const navItems = [
    {
      label: t("nav.dashboard", "Overview"),
      href: CUSTOMER_ROUTES.OVERVIEW,
      icon: LayoutDashboard,
      isActive: pathname === CUSTOMER_ROUTES.OVERVIEW,
    },
    {
      label: t("nav.myBookings", "Bookings"),
      href: CUSTOMER_ROUTES.BOOKINGS,
      icon: Ticket,
      badge: activeBookings > 0 ? activeBookings : undefined,
      isActive: pathname.startsWith(CUSTOMER_ROUTES.BOOKINGS),
    },
    {
      label: t("customer.digitalPasses", "Wallet"),
      href: CUSTOMER_ROUTES.TICKETS,
      icon: QrCode,
      isActive: pathname.startsWith(CUSTOMER_ROUTES.TICKETS),
    },
    {
      label: t("nav.wishlist", "Wishlist"),
      href: CUSTOMER_ROUTES.FAVORITES,
      icon: Heart,
      badge: favorites.length > 0 ? favorites.length : undefined,
      isActive: pathname.startsWith(CUSTOMER_ROUTES.FAVORITES),
    },
    {
      label: t("customer.accountSettings", "Profile"),
      href: CUSTOMER_ROUTES.PROFILE,
      icon: User,
      isActive: pathname.startsWith(CUSTOMER_ROUTES.PROFILE) || pathname.startsWith(CUSTOMER_ROUTES.SETTINGS),
    },
  ];

  return (
    <nav
      aria-label="Customer Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 shadow-lg pb-safe"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
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

export default CustomerBottomNav;

