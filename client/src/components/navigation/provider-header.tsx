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
import { useLanguage } from "@/providers/language-provider";
import { LanguageSelector } from "@/components/navigation/language-selector";
import { TicketCategory } from "@/types/ticket.types";
import { toast } from "sonner";

interface ProviderHeaderProps {
  onToggleMobileMenu?: () => void;
}

const SECTORS: { id: TicketCategory; label: string; orgName: string; icon: any }[] = [
  { id: "CINEMA", label: "Cinema Multiplex", orgName: "Century Cinema Addis", icon: Film },
  { id: "BUS", label: "Intercity Bus Lines", orgName: "Selam Bus Lines S.C.", icon: Bus },
  { id: "EVENT", label: "Live Events & Concerts", orgName: "Addis Live Events & Concerts", icon: Calendar },
  { id: "SPORTS", label: "Stadium Sports Club", orgName: "St. George Stadium Club", icon: Trophy },
];

export function ProviderHeader({ onToggleMobileMenu }: ProviderHeaderProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const {
    organization,
    notifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    setOrganizationCategory,
  } = useProviderStore();
  const { logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [showSectorMenu, setShowSectorMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);
  const sectorRef = useRef<HTMLDivElement>(null);
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
      if (sectorRef.current && !sectorRef.current.contains(e.target as Node)) {
        setShowSectorMenu(false);
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

  const getSectorIcon = (cat: TicketCategory) => {
    switch (cat) {
      case "CINEMA":
        return <Film className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      case "EVENT":
        return <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case "SPORTS":
        return <Trophy className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case "BUS":
      default:
        return <Bus className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
    }
  };

  // Strictly sector-isolated quick actions
  const getSectorQuickActions = () => {
    switch (organization.category) {
      case "CINEMA":
        return [
          {
            href: "/provider/cinema/showtimes",
            label: "Schedule Movie Screening",
            desc: "Hall showtimes & seat matrix",
            icon: Film,
            color: "text-purple-600 bg-purple-50 dark:bg-purple-950",
          },
          {
            href: "/provider/cinema/movies",
            label: "Movie Catalog",
            desc: "Manage titles & posters",
            icon: Film,
            color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950",
          },
          {
            href: "/provider/tickets/create",
            label: "New Cinema Box Office Pass",
            desc: "VIP laser or 3D hall ticket",
            icon: Ticket,
            color: "text-amber-600 bg-amber-50 dark:bg-amber-950",
          },
        ];
      case "EVENT":
        return [
          {
            href: "/provider/events/create",
            label: "Publish New Live Event",
            desc: "Concert or festival passes",
            icon: Calendar,
            color: "text-amber-600 bg-amber-50 dark:bg-amber-950",
          },
          {
            href: "/provider/events",
            label: "Festival Staging & Lineup",
            desc: "Manage artists & stages",
            icon: Calendar,
            color: "text-orange-600 bg-orange-50 dark:bg-orange-950",
          },
          {
            href: "/provider/tickets/create",
            label: "New VIP / Festival Pass",
            desc: "Table lounge & wristband pass",
            icon: Ticket,
            color: "text-amber-600 bg-amber-50 dark:bg-amber-950",
          },
        ];
      case "SPORTS":
        return [
          {
            href: "/provider/sports/create",
            label: "Schedule Match Fixture",
            desc: "Stadium tribune & gate passes",
            icon: Trophy,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950",
          },
          {
            href: "/provider/sports",
            label: "All Stadium Derbies",
            desc: "Match calendar & gates",
            icon: Trophy,
            color: "text-teal-600 bg-teal-50 dark:bg-teal-950",
          },
          {
            href: "/provider/tickets/create",
            label: "New Stadium Gate Ticket",
            desc: "Grandstand VIP & bleachers pass",
            icon: Ticket,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950",
          },
        ];
      case "BUS":
      default:
        return [
          {
            href: "/provider/bus/routes",
            label: "New Bus Route",
            desc: "Add express schedule & fare",
            icon: Bus,
            color: "text-blue-600 bg-blue-50 dark:bg-blue-950",
          },
          {
            href: "/provider/bus/schedules",
            label: "New Fleet Schedule",
            desc: "Coach departure assignment",
            icon: Clock,
            color: "text-sky-600 bg-sky-50 dark:bg-sky-950",
          },
          {
            href: "/provider/tickets/create",
            label: "New Intercity Bus Pass",
            desc: "Highway seat reservation pass",
            icon: Ticket,
            color: "text-amber-600 bg-amber-50 dark:bg-amber-950",
          },
        ];
    }
  };

  return (
    <header className="h-16 border-b border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs w-full transition-colors">
      {/* Left: Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <form onSubmit={handleGlobalSearch} className="relative w-full max-w-sm hidden sm:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t("Search bookings, tickets, listings...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1117] text-xs text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#B45309] dark:focus:border-amber-400 focus:bg-white dark:focus:bg-[#161922] transition-all"
          />
        </form>
      </div>

      {/* Right: Sector Switcher, Quick Actions, Theme, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Provider Sector Switcher (Allows testing all 4 sectors) */}
        <div className="relative" ref={sectorRef}>
          <button
            type="button"
            onClick={() => setShowSectorMenu(!showSectorMenu)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title={t("Switch Provider Sector")}
          >
            {getSectorIcon(organization.category)}
            <span className="uppercase text-[11px] font-black">{organization.category}</span>
            <span className="text-[10px] text-muted-foreground font-normal hidden md:inline">
              ({t("Switch")})
            </span>
            <ChevronDown className="w-3 h-3 text-amber-600" />
          </button>

          {showSectorMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-xl p-2 z-50 space-y-1 animate-in fade-in-50 zoom-in-95">
              <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  {t("Switch Provider Sector")}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {t("Isolated reports, analytics & catalog")}
                </span>
              </div>

              {SECTORS.map((s) => {
                const Icon = s.icon;
                const isCurrent = organization.category === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setOrganizationCategory(s.id);
                      setShowSectorMenu(false);
                      toast.success(
                        `Provider sector switched to ${s.label} (${s.orgName}). All reports, analytics, and listings are now strictly ${s.id} isolated.`
                      );
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isCurrent
                        ? "bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold leading-tight">{t(s.label)}</span>
                        <span className="text-[10px] text-muted-foreground block truncate max-w-[130px]">
                          {s.orgName}
                        </span>
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Verification Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t("Verified Merchant")}</span>
        </div>

        {/* Quick Create Dropdown - Strictly Sector Isolated */}
        <div className="relative" ref={quickRef}>
          <button
            onClick={() => setShowQuickCreate(!showQuickCreate)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">{t("Add Service")}</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>

          {showQuickCreate && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-xl p-1.5 z-40 space-y-1 animate-in fade-in-50 zoom-in-95">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 block">
                {organization.category} {t("Service Actions")}
              </span>

              {getSectorQuickActions().map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={idx}
                    href={action.href}
                    onClick={() => setShowQuickCreate(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#B45309] transition-colors"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${action.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold">{t(action.label)}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{t(action.desc)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Multi-Language Dropdown */}
        <LanguageSelector variant="navbar" />

        {/* Theme Mode Toggle Dropdown */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
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
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
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
                    {t("Operations Dispatch Alerts")}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {unreadNotifs.length} {t("unread updates")}
                  </span>
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] font-bold text-[#B45309] dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    {t("Mark all read")}
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
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                        n.isRead
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
                <span>{t("Organization Profile", "Organization Details")}</span>
              </Link>

              <Link
                href="/provider/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>{t("Account Settings")}</span>
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
                  <span>{t("nav.logout", "Sign Out")}</span>
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
