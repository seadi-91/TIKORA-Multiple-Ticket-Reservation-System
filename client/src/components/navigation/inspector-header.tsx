"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Moon,
  QrCode,
  Sun,
  User,
  Settings,
  LogOut,
  Menu,
  Film,
  Bus,
  Calendar,
  Trophy,
  Check,
  Building2,
} from "lucide-react";
import { useInspectorStore } from "@/stores/inspector.store";
import { useAuthStore } from "@/stores/auth.store";
import { useTheme } from "@/providers/theme-provider";
import { useLanguage } from "@/providers/language-provider";
import { LanguageSelector } from "@/components/navigation/language-selector";
import { TicketCategory } from "@/types/ticket.types";
import { toast } from "sonner";

interface InspectorHeaderProps {
  onToggleMobileMenu?: () => void;
}

export function InspectorHeader({ onToggleMobileMenu }: InspectorHeaderProps = {}) {
  const pathname = usePathname();
  const {
    profile,
    notifications,
    assignments,
    currentAssignmentId,
    markAllNotificationsAsRead,
    setInspectorCategory,
  } = useInspectorStore();
  const { logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showSectorMenu, setShowSectorMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const sectorRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.isRead);
  const activeAssignment =
    assignments.find((a) => a.id === currentAssignmentId) || assignments[0] || { gate: "Active Gate" };

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
      if (sectorRef.current && !sectorRef.current.contains(e.target as Node)) {
        setShowSectorMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (pathname === "/inspector" || pathname === "/inspector/dashboard") {
      return profile.category === "CINEMA"
        ? "Cinema Usher Console"
        : profile.category === "BUS"
        ? "Bus Fleet Boarding Console"
        : profile.category === "EVENT"
        ? "Festival Gate Console"
        : "Stadium Turnstile Console";
    }
    if (pathname.startsWith("/inspector/scanner")) return "Live Ticket QR Scanner";
    if (pathname.startsWith("/inspector/assigned")) {
      return profile.category === "CINEMA"
        ? "Auditorium Gate Shifts"
        : profile.category === "BUS"
        ? "Platform Boarding Sessions"
        : "Assigned Gate Sessions";
    }
    if (pathname.startsWith("/inspector/history")) return "Verification Audit History";
    if (pathname.startsWith("/inspector/services")) {
      return profile.category === "CINEMA"
        ? "Movie Showtimes & Screenings"
        : profile.category === "BUS"
        ? "Bus Trips & Routes"
        : "Assigned Services";
    }
    if (pathname.startsWith("/inspector/notifications")) return "Inspector Notifications";
    if (pathname.startsWith("/inspector/profile")) return "Inspector Personnel Profile";
    if (pathname.startsWith("/inspector/settings")) return "Device & Scan Settings";
    if (pathname.startsWith("/inspector/help")) return "Inspector Field Manual";
    return "Inspector Portal";
  };

  const getCategoryIcon = (cat: TicketCategory) => {
    switch (cat) {
      case "CINEMA":
        return <Film className="w-3.5 h-3.5 text-amber-500" />;
      case "BUS":
        return <Bus className="w-3.5 h-3.5 text-amber-500" />;
      case "EVENT":
        return <Calendar className="w-3.5 h-3.5 text-amber-500" />;
      case "SPORTS":
        return <Trophy className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const handleSwitchCategory = (cat: TicketCategory) => {
    setInspectorCategory(cat);
    setShowSectorMenu(false);
    toast.success(
      `Switched to ${cat === "CINEMA" ? "Century Cinema" : cat === "BUS" ? "Selam Bus" : cat} provider portal.`
    );
  };

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#161922] px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-xs w-full transition-colors">
      {/* Left: Page Title & Provider Details */}
      <div className="flex items-center gap-2.5 truncate">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="truncate">
          <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
            {t(getPageTitle(), getPageTitle())}
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
            <span className="font-bold text-amber-600 dark:text-amber-400 truncate">
              {profile.organizationName}
            </span>
            <span>•</span>
            <span className="truncate">{profile.assignedStation}</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Provider Sector Pill + Quick Controls */}
      <div className="flex items-center gap-2">
        {/* Provider Sector Switcher (Testing & Demonstration) */}
        <div className="relative" ref={sectorRef}>
          <button
            type="button"
            onClick={() => setShowSectorMenu(!showSectorMenu)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/25 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Provider Organization & Sector"
          >
            {getCategoryIcon(profile.category)}
            <span className="hidden md:inline font-semibold">Provider:</span>
            <span className="truncate max-w-[120px]">{profile.organizationName.split(" ")[0]}</span>
            <ChevronDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </button>

          {showSectorMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Assigned Provider Sector
                </p>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Inspectors manage only their provider&apos;s business
                </p>
              </div>

              <div className="py-1">
                {(["CINEMA", "BUS", "EVENT", "SPORTS"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSwitchCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                      profile.category === cat
                        ? "text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(cat)}
                      <div>
                        <p className="font-bold leading-tight">
                          {cat === "CINEMA"
                            ? "Century Cinema Addis"
                            : cat === "BUS"
                            ? "Selam Bus Lines S.C."
                            : cat === "EVENT"
                            ? "Addis Live Events"
                            : "St. George Stadium Club"}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {cat === "CINEMA"
                            ? "Screening Halls & Ushers"
                            : cat === "BUS"
                            ? "Coach Fleet & Boarding"
                            : cat === "EVENT"
                            ? "Concerts & Festivals"
                            : "Stadium Turnstiles"}
                        </p>
                      </div>
                    </div>
                    {profile.category === cat && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Session Indicator Pill */}
        <Link
          href="/inspector/assigned"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
          title="Current Active Gate Assignment"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate max-w-[130px]">{activeAssignment.gate}</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#161922] animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{t("Notifications", "Notifications")}</span>
                {unreadNotifs.length > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                  >
                    {t("Mark all read", "Mark all read")}
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{n.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                    <span className="text-[9px] text-slate-400 font-mono mt-1 block">{n.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Multi-Language Dropdown */}
        <LanguageSelector variant="navbar" />

        {/* Theme Toggle Button */}
        <div className="relative" ref={themeRef}>
          <button
            type="button"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Switch Theme"
          >
            {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-32 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 text-xs">
              <button
                type="button"
                onClick={() => {
                  setTheme("light");
                  setShowThemeMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t("Light", "Light")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme("dark");
                  setShowThemeMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t("Dark", "Dark")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme("system");
                  setShowThemeMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t("System", "System")}
              </button>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {profile.fullName.charAt(0)}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                {profile.fullName}
              </span>
              <span className="text-[10px] text-slate-500">{profile.role.split(" ")[0]}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white truncate">{profile.fullName}</p>
                <p className="text-[10px] text-slate-500 truncate font-mono">{profile.inspectorId}</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold truncate mt-0.5">
                  {profile.organizationName}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/inspector/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t("Personnel Profile", "Personnel Profile")}</span>
                </Link>

                <Link
                  href="/inspector/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{t("Scanner Settings", "Scanner Settings")}</span>
                </Link>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

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
                  <span>{t("Sign Out", "Sign Out")}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default InspectorHeader;
