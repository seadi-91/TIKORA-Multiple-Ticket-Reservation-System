"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Moon,
  QrCode,
  Shield,
  ShieldCheck,
  Sun,
  User,
  Settings,
  LogOut,
  Laptop,
  Radio,
} from "lucide-react";
import { useInspectorStore } from "@/stores/inspector.store";
import { useAuthStore } from "@/stores/auth.store";
import { useTheme } from "@/providers/theme-provider";

export function InspectorHeader() {
  const pathname = usePathname();
  const { profile, notifications, assignments, currentAssignmentId, markAllNotificationsAsRead } =
    useInspectorStore();
  const { logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.isRead);
  const activeAssignment =
    assignments.find((a) => a.id === currentAssignmentId) || assignments[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (pathname === "/inspector" || pathname === "/inspector/dashboard") return "Inspector Console";
    if (pathname.startsWith("/inspector/scanner")) return "Live Ticket QR Scanner";
    if (pathname.startsWith("/inspector/assigned")) return "Assigned Gate Sessions";
    if (pathname.startsWith("/inspector/history")) return "Verification Audit History";
    if (pathname.startsWith("/inspector/services")) return "Assigned Services";
    if (pathname.startsWith("/inspector/notifications")) return "Inspector Notifications";
    if (pathname.startsWith("/inspector/profile")) return "Inspector Personnel Profile";
    if (pathname.startsWith("/inspector/settings")) return "Device & Scan Settings";
    if (pathname.startsWith("/inspector/help")) return "Inspector Field Manual";
    return "Inspector Portal";
  };

  return (
    <header className="h-14 border-b border-border/70 bg-card/80 backdrop-blur-md px-4 flex items-center justify-between gap-3 sticky top-0 z-30">
      {/* Left: Page Title & Current Gate Assignment */}
      <div className="flex items-center gap-3 truncate">
        <div>
          <h1 className="text-xs sm:text-sm font-bold text-foreground tracking-tight truncate">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
            <span className="font-semibold text-amber-600">{profile.organizationName}</span>
            <span>•</span>
            <span className="truncate">{profile.assignedStation}</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Active Session Indicator Pill */}
        <Link
          href="/inspector/assigned"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
          title="Current Active Gate Assignment"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="truncate max-w-[150px]">{activeAssignment.gate}</span>
        </Link>

        {/* Quick Launch QR Scanner Button */}
        {pathname !== "/inspector/scanner" && (
          <Link
            href="/inspector/scanner"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open Scanner</span>
          </Link>
        )}

        {/* Theme Selector */}
        <div className="relative" ref={themeRef}>
          <button
            type="button"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-lg border border-border/70 hover:bg-muted text-foreground transition-colors"
            title="Switch theme"
          >
            {theme === "dark" ? (
              <Moon className="w-4 h-4 text-amber-500" />
            ) : theme === "light" ? (
              <Sun className="w-4 h-4 text-amber-600" />
            ) : (
              <Laptop className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-36 rounded-xl border border-border/80 bg-card p-1 shadow-lg text-xs z-50">
              {[
                { id: "light" as const, label: "Light", icon: Sun },
                { id: "dark" as const, label: "Dark", icon: Moon },
                { id: "system" as const, label: "System", icon: Laptop },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setTheme(m.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      theme === m.id
                        ? "bg-amber-500/10 text-amber-600 font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg border border-border/70 hover:bg-muted text-foreground transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border/80 bg-card shadow-xl p-3 space-y-2 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="font-bold text-foreground">Inspector Alerts</span>
                {unreadNotifs.length > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-amber-600 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground text-[11px]">
                    No new alerts at this time.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg border transition-colors ${
                        !n.isRead
                          ? "bg-amber-500/10 border-amber-600/30 text-foreground"
                          : "bg-muted/30 border-border/40 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-[11px] text-foreground mb-0.5">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-muted-foreground">{n.createdAt}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-1 border-t border-border/50 text-center">
                <Link
                  href="/inspector/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-amber-600 hover:underline font-semibold"
                >
                  View All Alerts →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Inspector Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
              {profile.fullName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="hidden lg:flex flex-col text-xs leading-tight">
              <span className="font-bold text-foreground truncate max-w-[120px]">
                {profile.fullName}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {profile.inspectorId}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border/80 bg-card p-2 shadow-xl text-xs z-50 animate-in fade-in zoom-in-95 duration-100 space-y-1">
              <div className="px-2.5 py-2 border-b border-border/50">
                <span className="font-bold text-foreground block">{profile.fullName}</span>
                <span className="text-[11px] text-muted-foreground block">{profile.email}</span>
                <span className="text-[10px] font-semibold text-amber-600 block mt-0.5">
                  {profile.organizationName}
                </span>
              </div>

              <Link
                href="/inspector/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/inspector/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Device & Scan Settings</span>
              </Link>

              <div className="pt-1 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

