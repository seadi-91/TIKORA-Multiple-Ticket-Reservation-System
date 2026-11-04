"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bell,
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
  Crown,
  CreditCard,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { useAuthStore } from "@/stores/auth.store";
import { useTheme } from "@/providers/theme-provider";
import { toast } from "sonner";

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

export function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { organizations, refunds, payouts } = useAdminStore();
  const { logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const pendingProviders = organizations.filter((o) => o.status === "PENDING");
  const pendingRefunds = refunds.filter((r) => r.status === "PENDING");
  const pendingPayouts = payouts.filter((p) => p.status === "PENDING");

  const totalAlertsCount =
    pendingProviders.length + pendingRefunds.length + pendingPayouts.length;

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

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/providers?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Generate dynamic breadcrumb title
  const getPageTitle = () => {
    if (pathname === "/admin" || pathname === "/admin/dashboard") return "Platform Dashboard";
    if (pathname.startsWith("/admin/providers")) return "Provider Organizations";
    if (pathname.startsWith("/admin/verifications")) return "Document Verifications";
    if (pathname.startsWith("/admin/users")) return "User & Access Management";
    if (pathname.startsWith("/admin/tickets")) return "Tickets & Service Catalog";
    if (pathname.startsWith("/admin/categories")) return "Platform Categories";
    if (pathname.startsWith("/admin/payments")) return "Payouts & Disbursements";
    if (pathname.startsWith("/admin/commissions")) return "Platform Commissions";
    if (pathname.startsWith("/admin/refunds")) return "Customer Refund Claims";
    if (pathname.startsWith("/admin/bookings")) return "Global Booking Ledger";
    if (pathname.startsWith("/admin/reports")) return "System Analytics & Reports";
    if (pathname.startsWith("/admin/support")) return "Customer & Provider Support";
    if (pathname.startsWith("/admin/audit-logs")) return "Platform Audit Logs";
    if (pathname.startsWith("/admin/settings")) return "Platform Settings";
    return "Super Admin Console";
  };

  return (
    <header
      style={{ backgroundColor: "var(--card-bg, #161922)" }}
      className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-[#161922] border-b border-slate-200/80 dark:border-slate-800 shadow-xs shrink-0 w-full transition-colors"
    >
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 lg:hidden transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
            <span className="text-amber-600 dark:text-amber-400 font-bold">Super Admin</span>
            <span>/</span>
            <span className="capitalize">{pathname.split("/")[2] || "Overview"}</span>
          </div>
          <h1 className="text-sm md:text-base font-extrabold text-foreground tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center / Right: Global Search & Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search Bar */}
        <form
          onSubmit={handleGlobalSearch}
          className="relative hidden sm:flex items-center w-48 md:w-64"
        >
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search providers, TIN, users..."
            className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
        </form>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="System alerts & pending requests"
          >
            <Bell className="w-4 h-4" />
            {totalAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-card animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">Pending Action Items</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {totalAlertsCount}
                  </span>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1 p-2 text-xs">
                {pendingProviders.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/providers/${p.id}`}
                    onClick={() => setShowNotifications(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Applied for {p.category} provider verification
                      </p>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 inline-block font-semibold">
                        Review application →
                      </span>
                    </div>
                  </Link>
                ))}

                {pendingRefunds.map((r) => (
                  <Link
                    key={r.id}
                    href="/admin/refunds"
                    onClick={() => setShowNotifications(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">
                        Refund Request: {r.reference}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {r.customerName} • {r.amount} ETB
                      </p>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 inline-block font-semibold">
                        Review refund →
                      </span>
                    </div>
                  </Link>
                ))}

                {pendingPayouts.map((pay) => (
                  <Link
                    key={pay.id}
                    href="/admin/payments"
                    onClick={() => setShowNotifications(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">
                        Payout: {pay.providerName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {pay.netAmount.toLocaleString()} ETB via {pay.payoutMethod}
                      </p>
                    </div>
                  </Link>
                ))}

                {totalAlertsCount === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-50 text-emerald-500" />
                    <p className="text-xs font-bold text-foreground">All caught up!</p>
                    <p className="text-[11px] text-muted-foreground">
                      No pending verifications or disputes
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Selector Dropdown */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : theme === "light" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Monitor className="w-4 h-4" />
            )}
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xl py-1 z-50">
              <button
                onClick={() => {
                  setTheme("light");
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                  theme === "light" ? "text-amber-600 font-bold" : "text-foreground hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </div>
                {theme === "light" && <Check className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  setTheme("dark");
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                  theme === "dark" ? "text-amber-400 font-bold" : "text-foreground hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </div>
                {theme === "dark" && <Check className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  setTheme("system");
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                  theme === "system" ? "text-amber-500 font-bold" : "text-foreground hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>System</span>
                </div>
                {theme === "system" && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Super Admin Profile Pill Dropdown */}
        <div className="relative pl-1 border-l border-slate-200/40 dark:border-slate-800/40" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-muted/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs ring-1 ring-amber-500/20 shadow-xs">
              <Crown className="w-4 h-4" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-foreground truncate leading-tight">
                Peter Admin
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                Super Admin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-200/40 dark:border-slate-800/40">
                <p className="text-xs font-bold text-foreground">Peter SuperAdmin</p>
                <p className="text-[11px] text-muted-foreground truncate">admin@tikora.et</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    PLATFORM ROOT
                  </span>
                </div>
              </div>

              <div className="py-1 text-xs">
                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Platform Settings</span>
                </Link>

                <Link
                  href="/admin/audit-logs"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Security Audit Logs</span>
                </Link>

                <Link
                  href="/provider"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Switch to Provider UI</span>
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
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
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
