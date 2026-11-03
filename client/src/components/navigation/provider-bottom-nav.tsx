"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  Users,
  Menu,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";

interface ProviderBottomNavProps {
  onOpenMenu?: () => void;
}

export function ProviderBottomNav({ onOpenMenu }: ProviderBottomNavProps) {
  const pathname = usePathname();
  const { refunds, staffMembers } = useProviderStore();

  const pendingRefunds = refunds.filter((r) => r.status === "PENDING").length;

  const navItems = [
    {
      label: "Overview",
      href: "/provider",
      icon: LayoutDashboard,
      isActive: pathname === "/provider",
    },
    {
      label: "Bookings",
      href: "/provider/bookings",
      icon: ShoppingBag,
      isActive: pathname.startsWith("/provider/bookings"),
    },
    {
      label: "Inventory",
      href: "/provider/inventory",
      icon: Boxes,
      badge: pendingRefunds > 0 ? `${pendingRefunds}` : undefined,
      isActive: pathname.startsWith("/provider/inventory") || pathname.startsWith("/provider/tickets"),
    },
    {
      label: "Staff",
      href: "/provider/staff",
      icon: Users,
      badge: staffMembers.length > 0 ? `${staffMembers.length}` : undefined,
      isActive: pathname.startsWith("/provider/staff"),
    },
  ];

  return (
    <nav
      aria-label="Provider Mobile Navigation"
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

        {/* Menu Button to open slide-out full menu */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all touch-manipulation"
        >
          <Menu className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] tracking-tight mt-0.5 leading-none">Menu</span>
        </button>
      </div>
    </nav>
  );
}

export default ProviderBottomNav;

