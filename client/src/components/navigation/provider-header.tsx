"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Plus,
  Moon,
  Sun,
  Monitor,
  Check,
  ChevronDown,
  Building2,
  Settings,
  LogOut,
  Menu,
  ShieldCheck,
  Bus,
  Calendar,
  Trophy,
  Film,
  Ticket,
  Clock,
  Sparkles,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { useAuthStore } from "@/stores/auth.store";
import { useTheme } from "@/providers/theme-provider";
import { toast } from "sonner";

interface ProviderHeaderProps {
  onToggleMobileMenu?: () => void;
}

export function ProviderHeader({ onToggleMobileMenu }: ProviderHeaderProps) {
  const router = useRouter();
  const { organization, notifications, markAllNotificationsAsRead, markNotificationAsRead } =
    useProviderStore();
  const { logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) {
        setShowQuickCreate(false);
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

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/provider/bookings?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className="h-16 border-b border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs w-full transition-colors"
    >
      {/* Left: Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <form onSubmit={handleGlobalSearch} className="relative w-full max-w-sm hidden sm:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bookings, routes, tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1117] text-xs text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#B45309] dark:focus:border-amber-400 focus:bg-white dark:focus:bg-[#161922] transition-all"
          />
        </form>
      </div>

      {/* Right: Quick Actions, Theme, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Verification Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Verified Merchant</span>
        </div>

        {/* Quick Create Dropdown */}
        <div className="relative" ref={quickRef}>
          <button
            onClick={() => setShowQuickCreate(!showQuickCreate)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Service</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>

          {showQuickCreate && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-xl p-1.5 z-40 space-y-1 animate-in fade-in-50 zoom-in-95">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 block">
                Quick Action Dispatch
              </span>
              <Link
                href="/provider/bus/routes"
                onClick={() => setShowQuickCreate(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#B45309] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                  <Bus className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block font-bold">New Bus Route</span>
                  <span className="text-[10px] text-slate-400 font-normal">Add express schedule & fare</span>
                </div>
              </Link>
              <Link
                href="/provider/events/create"
                onClick={() => setShowQuickCreate(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#B45309] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block font-bold">New Live Event</span>
                  <span className="text-[10px] text-slate-400 font-normal">Concert or festival passes</span>
                </div>
              </Link>
              <Link
                href="/provider/sports/create"
                onClick={() => setShowQuickCreate(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#B45309] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block font-bold">New Match Fixture</span>
                  <span className="text-[10px] text-slate-400 font-normal">Stadium tribune & gate passes</span>
                </div>
              </Link>
              <Link
                href="/provider/cinema/showtimes"
                onClick={() => setShowQuickCreate(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#B45309] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0">
                  <Film className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block font-bold">Schedule Movie Screening</span>
                  <span className="text-[10px] text-slate-400 font-normal">Hall showtimes & seat matrix</span>
                </div>
              </Link>
              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/provider/tickets/create"
                  onClick={() => setShowQuickCreate(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#B45309] dark:text-amber-400 hover:bg-[#B45309]/10 transition-colors"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Custom Ticket Listing</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Theme Mode Toggle Dropdown */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Theme Selection"
          >
            {theme === "dark" ? (
              <Moon className="w-4 h-4 text-amber-400" />
            ) : theme === "light" ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Monitor className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-xl p-1 z-40 space-y-0.5">
              {[
                { id: "light", label: "Light Mode", icon: Sun },
                { id: "dark", label: "Dark Mode", icon: Moon },
                { id: "system", label: "System Sync", icon: Monitor },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = theme === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setTheme(m.id as "light" | "dark" | "system");
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${isSelected
                        ? "text-[#B45309] dark:text-amber-400 font-bold bg-[#B45309]/10"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{m.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications Center Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xl p-3 z-40 space-y-2 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    Operations Dispatch Alerts
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {unreadNotifs.length} unread updates
                  </span>
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] font-bold text-[#B45309] dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1.5 scrollbar-thin">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No notifications.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${n.isRead
                          ? "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          : "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.createdAt}</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] dark:text-slate-300 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#B45309] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {organization.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-[#0F172A] dark:text-white block leading-tight truncate max-w-[110px]">
                {organization.name}
              </span>
              <span className="text-[9px] text-[#64748B] dark:text-slate-400 block leading-none">
                {organization.contactPerson.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-xl p-1.5 z-40 space-y-1">
              <div className="px-2.5 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-[#0F172A] dark:text-white block truncate">
                  {organization.contactPerson.fullName}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {organization.email}
                </span>
              </div>

              <Link
                href="/provider/organization"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Organization Details</span>
              </Link>

              <Link
                href="/provider/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Settings</span>
              </Link>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    toast.success("Signed out successfully");
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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

export default ProviderHeader;

