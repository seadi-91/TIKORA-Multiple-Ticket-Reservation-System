"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Ticket,
  FolderTree,
  CreditCard,
  Percent,
  RotateCcw,
  BookOpen,
  Headphones,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Crown,
  Sparkles,
  X,
  LogOut,
  ScanLine,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { useAuthStore } from "@/stores/auth.store";
import { useLanguage } from "@/providers/language-provider";
import { toast } from "sonner";

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  exact?: boolean;
  badge?: number;
  badgeColor?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export function AdminSidebar({
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const {
    organizations,
    refunds,
    supportTickets,
    bookings,
    users,
    inspectors,
    services,
    auditLogs,
    settings,
    fetchPlatformData,
  } = useAdminStore();
  const brandName = settings?.siteName || settings?.platformName || "TIKORA";
  const { logout } = useAuthStore();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPlatformData();
  }, [fetchPlatformData]);

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

  const pendingProvidersCount = organizations.filter((o) => o.status === "PENDING").length;
  const pendingRefundsCount = refunds.filter((r) => r.status === "PENDING").length;
  const openTicketsCount = supportTickets.filter((t) => t.status === "OPEN").length;
  const totalBookingsCount = bookings.length;

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navGroups: NavGroup[] = [
    {
      group: "MAIN",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          exact: true,
          icon: LayoutDashboard,
        },
        {
          label: "Analytics & Reports",
          href: "/admin/reports",
          icon: FileText,
        },
        {
          label: "Audit Logs",
          href: "/admin/audit-logs",
          icon: ShieldCheck,
          badge: auditLogs.length > 0 ? auditLogs.length : undefined,
          badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
        },
      ],
    },
    {
      group: "ORGANIZATIONS",
      items: [
        {
          label: "Providers",
          href: "/admin/providers",
          icon: Building2,
          badge: pendingProvidersCount > 0 ? pendingProvidersCount : undefined,
          badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
        },
        {
          label: "Verifications",
          href: "/admin/verifications",
          icon: ShieldCheck,
          badge: pendingProvidersCount > 0 ? pendingProvidersCount : undefined,
          badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
        },
      ],
    },
    {
      group: "PEOPLE & SERVICES",
      items: [
        {
          label: "Platform Users",
          href: "/admin/users",
          icon: Users,
          badge: users.length > 0 ? users.length : undefined,
          badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
        },
        {
          label: "Field Inspectors",
          href: "/admin/inspectors",
          icon: ScanLine,
          badge: inspectors.length > 0 ? inspectors.length : undefined,
          badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        },
        {
          label: "Services & Tickets",
          href: "/admin/tickets",
          icon: Ticket,
          badge: services.length > 0 ? services.length : undefined,
          badgeColor: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
        },
        {
          label: "Categories",
          href: "/admin/categories",
          icon: FolderTree,
        },
      ],
    },
    {
      group: "FINANCIALS",
      items: [
        {
          label: "Payouts & Balances",
          href: "/admin/payments",
          icon: CreditCard,
        },
        {
          label: "Commissions",
          href: "/admin/commissions",
          icon: Percent,
        },
        {
          label: "Refund Claims",
          href: "/admin/refunds",
          icon: RotateCcw,
          badge: pendingRefundsCount > 0 ? pendingRefundsCount : undefined,
          badgeColor: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
        },
      ],
    },
    {
      group: "OPERATIONS",
      items: [
        {
          label: "All Bookings",
          href: "/admin/bookings",
          icon: BookOpen,
          badge: totalBookingsCount > 0 ? totalBookingsCount : undefined,
          badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
        },
        {
          label: "Support & Disputes",
          href: "/admin/support",
          icon: Headphones,
          badge: openTicketsCount > 0 ? openTicketsCount : undefined,
          badgeColor: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
        },
        {
          label: "Platform Settings",
          href: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#161922] text-[#0F172A] dark:text-[#F8FAFC] select-none">
      {/* Brand & Organization Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200/40 dark:border-slate-800/40 shrink-0">
        <Link
          href="/admin"
          className="flex items-center gap-3 overflow-hidden group"
          onClick={onCloseMobile}
        >
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={brandName}
              className="w-9 h-9 rounded-xl object-contain bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 shadow-xs shrink-0 ring-1 ring-amber-400/30"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0 ring-1 ring-amber-400/30">
              <Crown className="w-5 h-5 text-white" />
            </div>
          )}
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span suppressHydrationWarning className="font-bold text-sm tracking-tight text-[#0F172A] dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {brandName}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> {t("Super Admin", "Super Admin")}
              </span>
            </div>
          )}
        </Link>

        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-1">
                {t(group.group, group.group)}
              </p>
            )}

            {group.items.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  title={collapsed ? t(item.label, item.label) : undefined}
                  className={`group relative flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-150 ${
                    active
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                      active
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{t(item.label, item.label)}</span>}

                  {!collapsed && item.badge !== undefined && (
                    <span
                      className={`ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active indicator bar */}
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-amber-600 dark:bg-amber-400" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info & Quick Link */}
      <div className="p-3 border-t border-slate-200/40 dark:border-slate-800/40 shrink-0 space-y-2">
        <Link
          href="/"
          target="_blank"
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title={t("Customer Portal", "Customer Portal")}
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
          {!collapsed && <span>{t("Customer Portal", "Customer Portal")}</span>}
        </Link>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            logout();
            toast.success("Signed out successfully");
            window.location.href = "/login";
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title={t("Sign Out", "Sign Out")}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>{t("Sign Out", "Sign Out")}</span>}
        </button>

        {/* Toggle Collapse Button for Desktop */}
        <div className="hidden lg:flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
          {!collapsed ? (
            <div className="flex items-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {t("Operational", "Root Active")}
              </span>
            </div>
          ) : (
            <div className="w-2 h-2 mx-auto rounded-full bg-emerald-500" />
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mx-auto"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 sticky top-0 h-screen bg-white dark:bg-[#161922] border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out select-none ${
          collapsed ? "w-18" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer via Portal */}
      {mounted &&
        mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
              onClick={onCloseMobile}
              aria-label="Close menu backdrop"
            />
            {/* Drawer Panel - Solid Opaque Background */}
            <aside
              className="fixed top-0 bottom-0 left-0 z-10 w-72 max-w-[85vw] h-full bg-white dark:bg-[#161922] border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {sidebarContent}
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}
