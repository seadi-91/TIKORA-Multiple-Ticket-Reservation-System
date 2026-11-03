"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Bus,
  Film,
  Calendar,
  Trophy,
  Ticket,
  Boxes,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  Users,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
  LogOut,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  Menu,
  X,
  Clock,
  MapPin,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { useAuthStore } from "@/stores/auth.store";

interface ProviderSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function ProviderSidebar({
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}: ProviderSidebarProps) {
  const pathname = usePathname();
  const { organization, notifications, refunds } = useProviderStore();
  const { logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const [busExpanded, setBusExpanded] = useState(pathname.startsWith("/provider/bus"));
  const [cinemaExpanded, setCinemaExpanded] = useState(pathname.startsWith("/provider/cinema"));

  const pendingRefunds = refunds.filter((r) => r.status === "PENDING").length;

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navGroups = [
    {
      group: "MAIN",
      items: [
        {
          label: "Overview",
          href: "/provider",
          exact: true,
          icon: LayoutDashboard,
        },
        {
          label: "Organization Profile",
          href: "/provider/organization",
          icon: Building2,
          badge: organization.verified ? "Verified" : "Pending",
          badgeColor: organization.verified
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        },
      ],
    },
    {
      group: "SERVICES",
      items: [
        {
          label: "Bus Operations",
          href: "/provider/bus",
          icon: Bus,
          hasSubmenu: true,
          isExpanded: busExpanded,
          onToggle: () => setBusExpanded(!busExpanded),
          subItems: [
            { label: "Fleet Hub", href: "/provider/bus", exact: true },
            { label: "Routes & Fares", href: "/provider/bus/routes" },
            { label: "Schedules", href: "/provider/bus/schedules" },
            { label: "Daily Trips", href: "/provider/bus/trips" },
          ],
        },
        {
          label: "Events & Concerts",
          href: "/provider/events",
          icon: Calendar,
        },
        {
          label: "Stadium Sports",
          href: "/provider/sports",
          icon: Trophy,
        },
        {
          label: "Cinema & Movies",
          href: "/provider/cinema",
          icon: Film,
          hasSubmenu: true,
          isExpanded: cinemaExpanded,
          onToggle: () => setCinemaExpanded(!cinemaExpanded),
          subItems: [
            { label: "Screenings Hub", href: "/provider/cinema", exact: true },
            { label: "Movie Catalog", href: "/provider/cinema/movies" },
            { label: "Showtimes", href: "/provider/cinema/showtimes" },
          ],
        },
      ],
    },
    {
      group: "INVENTORY & SALES",
      items: [
        {
          label: "Tickets Management",
          href: "/provider/tickets",
          icon: Ticket,
        },
        {
          label: "Seat Inventory",
          href: "/provider/inventory",
          icon: Boxes,
          badge: `${organization.stats.availableSeats} left`,
        },
        {
          label: "Customer Bookings",
          href: "/provider/bookings",
          icon: ShoppingBag,
          badge: `${organization.stats.totalBookings}`,
        },
      ],
    },
    {
      group: "FINANCIALS",
      items: [
        {
          label: "Sales & Revenue",
          href: "/provider/payments",
          icon: CreditCard,
        },
        {
          label: "Refund Requests",
          href: "/provider/refunds",
          icon: RotateCcw,
          badge: pendingRefunds > 0 ? `${pendingRefunds}` : undefined,
          badgeColor: "bg-rose-500 text-white font-bold",
        },
      ],
    },
    {
      group: "TEAM & GATE CONTROL",
      items: [
        {
          label: "Staff & Inspectors",
          href: "/provider/staff",
          icon: Users,
        },
      ],
    },
    {
      group: "ANALYTICS & SETTINGS",
      items: [
        {
          label: "Reports & Insights",
          href: "/provider/reports",
          icon: BarChart3,
        },
        {
          label: "Provider Settings",
          href: "/provider/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#161922] border-r border-[#E2E8F0] dark:border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 shrink-0">
        <Link href="/provider" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#B45309] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <Ticket className="w-4 h-4 fill-white" />
          </div>
          {!collapsed && (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-[#0F172A] dark:text-white">
                  TIKORA
                </span>
                <span className="text-[9px] uppercase font-extrabold tracking-widest px-1.5 py-0.5 rounded-md bg-[#B45309]/10 text-[#B45309] dark:text-amber-400">
                  Provider
                </span>
              </div>
              <span className="text-[10px] text-[#64748B] dark:text-slate-400 block -mt-0.5">
                Merchant Operations
              </span>
            </div>
          )}
        </Link>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        )}

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Organization Badge Widget */}
      {!collapsed && (
        <div className="p-3 mx-3 mt-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {organization.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                {organization.name}
              </h4>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {organization.approvalStatus === "APPROVED" ? "Approved Provider" : "Pending Review"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-thin">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <span className="px-2 text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
                {group.group}
              </span>
            )}

            {group.items.map((item: any, iIdx) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;

              if (item.hasSubmenu && !collapsed) {
                return (
                  <div key={iIdx} className="space-y-0.5">
                    <button
                      onClick={item.onToggle}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${active
                          ? "bg-[#B45309]/10 text-[#B45309] dark:text-amber-400 font-bold"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#B45309] dark:text-amber-400" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${item.isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    {item.isExpanded && (
                      <div className="pl-8 pr-1 space-y-0.5 pt-0.5">
                        {item.subItems.map((sub: any, sIdx: number) => {
                          const subActive = isActive(sub.href, sub.exact);
                          return (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              onClick={onCloseMobile}
                              className={`block px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${subActive
                                  ? "text-[#B45309] dark:text-amber-400 font-bold bg-[#B45309]/5"
                                  : "text-slate-500 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white"
                                }`}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={iIdx}
                  href={item.href}
                  onClick={onCloseMobile}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${active
                      ? "bg-[#B45309]/10 text-[#B45309] dark:text-amber-400 font-bold border-r-2 border-[#B45309]"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#B45309] dark:text-amber-400" : "text-slate-400"}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${item.badgeColor || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-[#E2E8F0] dark:border-slate-800 space-y-1 shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          {!collapsed && <span>View Customer Site</span>}
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ${collapsed ? "w-18" : "w-64"
          }`}
      >
        <div className={`fixed top-0 bottom-0 z-30 transition-all duration-300 ${collapsed ? "w-18" : "w-64"}`}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer via Portal */}
      {mounted &&
        mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={onCloseMobile}
              aria-label="Close menu backdrop"
            />
            {/* Drawer */}
            <div className="relative z-10 w-72 max-w-[85vw] h-full bg-white dark:bg-[#161922] border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-left duration-200">
              {sidebarContent}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default ProviderSidebar;

