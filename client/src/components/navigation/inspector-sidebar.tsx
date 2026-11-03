"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  HelpCircle,
  History,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  QrCode,
  Shield,
  ShieldCheck,
  User,
  X,
  Bell,
  Settings,
} from "lucide-react";
import { useInspectorStore } from "@/stores/inspector.store";
import { useAuthStore } from "@/stores/auth.store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export function InspectorSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { profile, notifications, assignments } = useInspectorStore();
  const { logout } = useAuthStore();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const activeAssignmentsCount = assignments.filter((a) => a.status === "ACTIVE_NOW").length;

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/inspector",
      icon: LayoutDashboard,
    },
    {
      label: "Scan Tickets",
      href: "/inspector/scanner",
      icon: QrCode,
      highlight: true,
      badge: "Scanner",
    },
    {
      label: "My Assignments",
      href: "/inspector/assigned",
      icon: ClipboardList,
      badge: activeAssignmentsCount > 0 ? `${activeAssignmentsCount} Live` : undefined,
    },
    {
      label: "Verification History",
      href: "/inspector/history",
      icon: History,
    },
    {
      label: "Assigned Services",
      href: "/inspector/services",
      icon: Layers,
    },
    {
      label: "Notifications",
      href: "/inspector/notifications",
      icon: Bell,
      badge: unreadNotifs > 0 ? String(unreadNotifs) : undefined,
    },
    {
      label: "Inspector Profile",
      href: "/inspector/profile",
      icon: User,
    },
    {
      label: "Settings",
      href: "/inspector/settings",
      icon: Settings,
    },
    {
      label: "Help & Support",
      href: "/inspector/help",
      icon: HelpCircle,
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Drawer Toggle Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-amber-600 text-white shadow-lg flex items-center justify-center hover:bg-amber-700 transition-transform active:scale-95"
        aria-label="Open Navigation"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-card border-r border-border/70 flex flex-col transition-all duration-200 select-none ${
          collapsed ? "md:w-16" : "md:w-64"
        } ${
          mobileOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Header / Branding */}
        <div className="h-14 px-3.5 border-b border-border/60 flex items-center justify-between gap-2">
          <Link href="/inspector" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm text-foreground tracking-tight flex items-center gap-1.5">
                  TicketHub
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 font-semibold border border-amber-600/20">
                    Inspector
                  </span>
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {profile.organizationName}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Assigned Provider Badge */}
        {!collapsed && (
          <div className="p-3 mx-2 my-2 rounded-xl bg-amber-500/10 border border-amber-600/20 text-xs">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{profile.organizationName}</span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {profile.assignedStation} • {profile.terminalGate}
            </p>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
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
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? item.highlight
                      ? "bg-amber-600 text-white font-semibold shadow-xs"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold border border-amber-600/20"
                    : item.highlight
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-600 hover:text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${collapsed ? "justify-center px-2" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? item.highlight
                        ? "text-white"
                        : "text-amber-600"
                      : "text-muted-foreground"
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span
                    className={`ml-auto text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive && item.highlight
                        ? "bg-white/20 text-white"
                        : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Inspector Footer & Security Restriction Notice */}
        <div className="p-2 border-t border-border/60 space-y-1">
          {!collapsed && (
            <div className="px-2 py-1.5 text-[10px] text-muted-foreground flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="truncate">Inspector ID: {profile.inspectorId}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ${
              collapsed ? "justify-center px-2" : ""
            }`}
            title="Log out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

