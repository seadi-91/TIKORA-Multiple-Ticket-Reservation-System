"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  HelpCircle,
  History,
  LayoutDashboard,
  LogOut,
  QrCode,
  Shield,
  ShieldCheck,
  User,
  X,
  Bell,
  Settings,
  Film,
  Bus,
  Trophy,
} from "lucide-react";
import { useInspectorStore } from "@/stores/inspector.store";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

interface InspectorSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function InspectorSidebar({
  collapsed: propCollapsed,
  onToggleCollapse,
  mobileOpen: propMobileOpen,
  onCloseMobile,
}: InspectorSidebarProps = {}) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const collapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;
  const mobileOpen = propMobileOpen !== undefined ? propMobileOpen : internalMobileOpen;

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

  const handleCloseMobile = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
    setInternalMobileOpen(false);
  };

  const { profile, notifications, assignments } = useInspectorStore();
  const { logout } = useAuthStore();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const activeAssignmentsCount = assignments.filter((a) => a.status === "ACTIVE_NOW").length;

  const getNavItems = (): NavItem[] => {
    switch (profile.category) {
      case "CINEMA":
        return [
          { label: "Dashboard", href: "/inspector", icon: LayoutDashboard },
          { label: "Scan Movie Passes", href: "/inspector/scanner", icon: QrCode, highlight: true, badge: "Live" },
          {
            label: "Screening Shifts",
            href: "/inspector/assigned",
            icon: ClipboardList,
            badge: activeAssignmentsCount > 0 ? `${activeAssignmentsCount} Live` : undefined,
          },
          { label: "Movie Showtimes", href: "/inspector/services", icon: Film },
          { label: "Patron Audit Logs", href: "/inspector/history", icon: History },
          {
            label: "Notifications",
            href: "/inspector/notifications",
            icon: Bell,
            badge: unreadNotifs > 0 ? String(unreadNotifs) : undefined,
          },
          { label: "Usher Profile", href: "/inspector/profile", icon: User },
          { label: "Scanner Settings", href: "/inspector/settings", icon: Settings },
          { label: "Auditorium Manual", href: "/inspector/help", icon: HelpCircle },
        ];
      case "BUS":
        return [
          { label: "Dashboard", href: "/inspector", icon: LayoutDashboard },
          { label: "Scan Boarding Passes", href: "/inspector/scanner", icon: QrCode, highlight: true, badge: "Live" },
          {
            label: "Boarding Shifts",
            href: "/inspector/assigned",
            icon: ClipboardList,
            badge: activeAssignmentsCount > 0 ? `${activeAssignmentsCount} Live` : undefined,
          },
          { label: "Bus Trips & Routes", href: "/inspector/services", icon: Bus },
          { label: "Passenger Audit Logs", href: "/inspector/history", icon: History },
          {
            label: "Notifications",
            href: "/inspector/notifications",
            icon: Bell,
            badge: unreadNotifs > 0 ? String(unreadNotifs) : undefined,
          },
          { label: "Inspector Profile", href: "/inspector/profile", icon: User },
          { label: "Scanner Settings", href: "/inspector/settings", icon: Settings },
          { label: "Boarding Manual", href: "/inspector/help", icon: HelpCircle },
        ];
      case "EVENT":
        return [
          { label: "Dashboard", href: "/inspector", icon: LayoutDashboard },
          { label: "Scan Festival Passes", href: "/inspector/scanner", icon: QrCode, highlight: true, badge: "Live" },
          {
            label: "Turnstile Shifts",
            href: "/inspector/assigned",
            icon: ClipboardList,
            badge: activeAssignmentsCount > 0 ? `${activeAssignmentsCount} Live` : undefined,
          },
          { label: "Event Sessions", href: "/inspector/services", icon: Calendar },
          { label: "Guest Audit Logs", href: "/inspector/history", icon: History },
          {
            label: "Notifications",
            href: "/inspector/notifications",
            icon: Bell,
            badge: unreadNotifs > 0 ? String(unreadNotifs) : undefined,
          },
          { label: "Inspector Profile", href: "/inspector/profile", icon: User },
          { label: "Scanner Settings", href: "/inspector/settings", icon: Settings },
          { label: "Field Manual", href: "/inspector/help", icon: HelpCircle },
        ];
      case "SPORTS":
        return [
          { label: "Dashboard", href: "/inspector", icon: LayoutDashboard },
          { label: "Scan Match Passes", href: "/inspector/scanner", icon: QrCode, highlight: true, badge: "Live" },
          {
            label: "Tribune Shifts",
            href: "/inspector/assigned",
            icon: ClipboardList,
            badge: activeAssignmentsCount > 0 ? `${activeAssignmentsCount} Live` : undefined,
          },
          { label: "Matchday Fixtures", href: "/inspector/services", icon: Trophy },
          { label: "Fan Audit Logs", href: "/inspector/history", icon: History },
          {
            label: "Notifications",
            href: "/inspector/notifications",
            icon: Bell,
            badge: unreadNotifs > 0 ? String(unreadNotifs) : undefined,
          },
          { label: "Inspector Profile", href: "/inspector/profile", icon: User },
          { label: "Scanner Settings", href: "/inspector/settings", icon: Settings },
          { label: "Stadium Manual", href: "/inspector/help", icon: HelpCircle },
        ];
    }
  };

  const navItems = getNavItems();

  const getBrandIcon = () => {
    switch (profile.category) {
      case "CINEMA":
        return <Film className="w-4.5 h-4.5" />;
      case "BUS":
        return <Bus className="w-4.5 h-4.5" />;
      case "EVENT":
        return <Calendar className="w-4.5 h-4.5" />;
      case "SPORTS":
        return <Trophy className="w-4.5 h-4.5" />;
    }
  };

  const getSubtitle = () => {
    switch (profile.category) {
      case "CINEMA":
        return "Cinema Usher Terminal";
      case "BUS":
        return "Bus Fleet Terminal";
      case "EVENT":
        return "Festival Gate Terminal";
      case "SPORTS":
        return "Stadium Gate Terminal";
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    window.location.href = "/login";
  };

  const sidebarContent = (
    <div className="flex flex-col h-full max-h-screen overflow-hidden bg-white dark:bg-[#161922] text-[#0F172A] dark:text-[#F8FAFC] select-none">
      {/* Header / Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
        <Link
          href="/inspector"
          className="flex items-center gap-2.5 truncate"
          onClick={handleCloseMobile}
        >
          <div className="w-9 h-9 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {getBrandIcon()}
          </div>
          {!collapsed && (
            <div className="truncate">
              <p className="text-sm font-black text-[#0F172A] dark:text-white tracking-tight leading-none">
                TIKORA
              </p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wider mt-1 truncate">
                {getSubtitle()}
              </p>
            </div>
          )}
        </Link>

        <div className="flex items-center gap-1">
          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => {
              if (onToggleCollapse) onToggleCollapse();
              else setInternalCollapsed(!internalCollapsed);
            }}
            className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={handleCloseMobile}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Assigned Provider Badge */}
      {!collapsed && (
        <div className="p-3 mx-3 my-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="truncate">{profile.organizationName}</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">
            Station: {profile.assignedStation}
          </p>
          <span className="inline-block mt-1 text-[9px] uppercase tracking-wider font-extrabold text-amber-600 dark:text-amber-400">
            Added by Provider
          </span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-3 py-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/inspector"
              ? pathname === "/inspector" || pathname === "/inspector/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? item.highlight
                    ? "bg-amber-600 text-white font-bold shadow-xs"
                    : "bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold"
                  : item.highlight
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-600 hover:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive
                    ? item.highlight
                      ? "text-white"
                      : "text-amber-600 dark:text-amber-400"
                    : "text-slate-400"
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span
                  className={`ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold ${
                    isActive && item.highlight
                      ? "bg-white/25 text-white"
                      : "bg-amber-500/20 text-amber-800 dark:text-amber-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer & Personnel ID */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5 shrink-0">
        {!collapsed && (
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate font-mono">{profile.inspectorId}</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-600">Active</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#161922] transition-all duration-300 sticky top-0 h-screen shrink-0 z-40 select-none ${
          collapsed ? "w-18" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={handleCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#161922] shadow-2xl z-10 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default InspectorSidebar;
