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
  Menu,
} from "lucide-react";
import { useInspectorStore } from "@/stores/inspector.store";
import { useAuthStore } from "@/stores/auth.store";
import { useTheme } from "@/providers/theme-provider";
import { toast } from "sonner";

interface InspectorHeaderProps {
  onToggleMobileMenu?: () => void;
}

export function InspectorHeader({ onToggleMobileMenu }: InspectorHeaderProps = {}) {
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
    <header
      className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#161922] px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-xs w-full transition-colors"
    >
      {/* Left: Page Title & Current Gate Assignment */}
      <div className="flex items-center gap-2.5 truncate">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 -ml-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-xs sm:text-sm font-extrabold text-foreground tracking-tight truncate">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
            <span className="font-bold text-amber-600 dark:text-amber-400">{profile.organizationName}</span>
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
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
          title="Current Active Gate Assignment"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate max-w-[150px]">{activeAssignment.gate}</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-card animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xl py-2 z-50">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                <span className="text-xs font-bold text-foreground">Notifications</span>
                {unreadNotifs.length > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-border/20 text-xs">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="p-3 hover:bg-muted/40 transition-colors">
                    <p className="font-semibold text-foreground truncate">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{n.message}</p>
                    <span className="text-[9px] text-muted-foreground font-mono mt-1 block">
                      {n.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <div className="relative" ref={themeRef}>
          <button
            type="button"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Switch Theme"
          >
            {theme === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-32 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xl py-1 z-50 text-xs">
              <button
                type="button"
                onClick={() => {
                  setTheme("light");
                  setShowThemeMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-muted/60 transition-colors"
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme("dark");
                  setShowThemeMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-muted/60 transition-colors"
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme("system");
                  setShowThemeMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-muted/60 transition-colors"
              >
                System
              </button>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-muted/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {profile.fullName.charAt(0)}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[120px]">
                {profile.fullName}
              </span>
              <span className="text-[10px] text-muted-foreground">Officer</span>
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                <p className="font-bold text-foreground truncate">{profile.fullName}</p>
                <p className="text-[10px] text-muted-foreground truncate font-mono">
                  {profile.inspectorId}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/inspector/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Personnel Profile</span>
                </Link>

                <Link
                  href="/inspector/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Scanner Settings</span>
                </Link>

                <div className="my-1 border-t border-slate-200/40 dark:border-slate-800/40" />

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    toast.success("Signed out successfully");
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
