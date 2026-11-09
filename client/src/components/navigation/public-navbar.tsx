"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ticket,
  Bus,
  Film,
  Calendar,
  Trophy,
  Compass,
  Heart,
  Bell,
  Sun,
  Moon,
  Laptop,
  Check,
  ChevronDown,
  LayoutDashboard,
  QrCode,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  LogIn,
  UserPlus,
  Building2,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Info,
  ArrowRight,
} from "lucide-react";
import { AUTH_ROUTES, CUSTOMER_ROUTES } from "@/lib/constants";
import { useTheme, Theme } from "@/providers/theme-provider";
import { useBookingStore } from "@/stores/booking.store";
import { useAuthStore } from "@/stores/auth.store";
import { useAdminStore } from "@/stores/admin.store";
import { useLanguage } from "@/providers/language-provider";
import { LanguageSelector } from "@/components/navigation/language-selector";
import { toast } from "sonner";

interface PublicNavbarProps {
  onSearchClick?: () => void;
}

export function PublicNavbar({ onSearchClick }: PublicNavbarProps) {
  const pathname = usePathname();
  const { theme, systemIsDark, setTheme } = useTheme();
  const { favorites, notifications, bookings } = useBookingStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { settings } = useAdminStore();
  const { t } = useLanguage();
  const brandName = settings.siteName || settings.platformName || "TIKORA";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const authDropdownRef = useRef<HTMLDivElement>(null);

  const unreadNotifsCount = notifications ? notifications.filter((n) => !n.isRead).length : 0;
  const activeBookingsCount = bookings ? bookings.filter((b) => b.bookingStatus === "CONFIRMED").length : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setAuthDropdownOpen(false);
    setUserDropdownOpen(false);
    setThemeDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
        setAuthDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: t("nav.home", "Home"), href: "/", icon: Ticket },
    { label: t("nav.tickets", "Explore"), href: "/search", icon: Compass },
    { label: t("nav.bus", "Buses"), href: "/bus", icon: Bus },
    { label: t("nav.cinema", "Cinema"), href: "/cinema", icon: Film },
    { label: t("nav.events", "Events"), href: "/events", icon: Calendar },
    { label: t("nav.sports", "Sports"), href: "/sports", icon: Trophy },
  ];

  const themeOptions: {
    value: Theme;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      value: "light",
      label: "Light",
      description: "Crisp daylight",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      description: "Midnight obsidian",
      icon: Moon,
    },
    {
      value: "system",
      label: "System",
      description: `Follows OS (${systemIsDark ? "Dark" : "Light"})`,
      icon: Laptop,
    },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled || pathname !== "/"
          ? "bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-slate-800 shadow-xs"
          : "bg-transparent border-b border-transparent shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between gap-3">
        {/* Left Side: 3-line Hamburger Menu Button First, then Logo Icon (Name text hidden on mobile, shown on sm/lg) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 3-line Hamburger Menu Button on Mobile (< lg) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-white/80 dark:bg-[#161922] text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center touch-manipulation shadow-2xs"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
          </button>

          {/* Logo - Icon displays always; Name text is hidden on mobile, visible on sm and desktop */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" title={`${brandName} Home`}>
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={brandName}
                className="w-8 h-8 rounded-lg object-contain shadow-xs group-hover:scale-105 transition-transform shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#B45309] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Ticket className="w-4 h-4 transform -rotate-12" />
              </div>
            )}
            {/* Brand name text hidden on mobile, shown on sm/desktop */}
            <div className="hidden sm:block">
              <span
                suppressHydrationWarning
                className="text-base sm:text-lg font-black tracking-tight text-[#0F172A] dark:text-white flex items-center gap-0.5 leading-none"
              >
                {brandName}
              </span>
              <span
                suppressHydrationWarning
                className="text-[8px] uppercase tracking-widest text-[#64748B] dark:text-slate-400 font-semibold block mt-0.5"
              >
                {settings.tagline || "Multi-Ticket Ethiopia"}
              </span>
            </div>
          </Link>
        </div>

        {/* Center Desktop Navigation - Hidden on Mobile */}
        <nav className="hidden lg:flex items-center gap-0.5 bg-[#F8FAFC] dark:bg-[#161922] p-1 rounded-xl border border-[#E2E8F0] dark:border-slate-800">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#B45309] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Wishlist, Notifications, Theme & Profile/Sign In */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Wishlist Link - Hidden on mobile view as requested */}
          <Link
            href={CUSTOMER_ROUTES.FAVORITES}
            className="hidden sm:inline-flex relative p-1.5 sm:p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-white/70 dark:bg-[#161922] text-[#64748B] hover:text-[#B45309] dark:text-slate-300 transition-colors"
            title="My Saved Wishlist"
          >
            <Heart className="w-3.5 h-3.5" />
            {mounted && favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#B45309] text-white text-[8px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Notifications Link - Hidden on mobile view */}
          <Link
            href={CUSTOMER_ROUTES.NOTIFICATIONS}
            className="hidden sm:inline-flex relative p-1.5 sm:p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-white/70 dark:bg-[#161922] text-[#64748B] hover:text-[#B45309] dark:text-slate-300 transition-colors"
            title="Notification Center"
          >
            <Bell className="w-3.5 h-3.5" />
            {mounted && unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#B45309] text-white text-[8px] font-bold flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </Link>

          {/* Language Selector Dropdown */}
          <LanguageSelector variant="navbar" />

          {/* Theme Dropdown */}
          <div className="relative" ref={themeDropdownRef}>
            <button
              type="button"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="p-1.5 sm:p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-white/70 dark:bg-[#161922] text-[#64748B] hover:text-[#B45309] dark:text-slate-300 transition-colors cursor-pointer"
              title="Change Color Theme"
            >
              {theme === "dark" || (theme === "system" && systemIsDark) ? (
                <Moon className="w-3.5 h-3.5 text-slate-300" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] p-1.5 shadow-xl z-50 space-y-0.5">
                {themeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = theme === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setTheme(opt.value);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                          : "text-[#64748B] hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        <div className="text-left">
                          <span className="block font-bold leading-tight">{opt.label}</span>
                          <span className="text-[9px] text-[#64748B] dark:text-slate-400 block">{opt.description}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#B45309] dark:text-[#D97706]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Profile Dropdown or Sign In Button */}
          {mounted && isAuthenticated ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-white/70 dark:bg-[#161922] hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-slate-900 dark:bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold text-[#0F172A] dark:text-white">
                  {user?.role === "ADMIN" ? "Admin" : user?.role === "ORGANIZATION" ? "Provider" : "Customer"}
                </span>
                <ChevronDown className="w-3 h-3 text-[#64748B] hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] p-1.5 shadow-xl z-50 space-y-0.5">
                  <div className="p-2 border-b border-[#E2E8F0] dark:border-slate-800 mb-1">
                    <p className="text-xs font-bold text-[#0F172A] dark:text-white">{user?.name || "Customer"}</p>
                    <p className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">{user?.email || "customer@tikora.et"}</p>
                  </div>

                  <Link
                    href={CUSTOMER_ROUTES.OVERVIEW}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{t("Dashboard Overview")}</span>
                  </Link>

                  <Link
                    href={CUSTOMER_ROUTES.BOOKINGS}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  >
                    <Ticket className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{t("My Bookings")}</span>
                  </Link>

                  <Link
                    href={CUSTOMER_ROUTES.TICKETS}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  >
                    <QrCode className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{t("Digital Ticket Wallet")}</span>
                  </Link>

                  <Link
                    href={CUSTOMER_ROUTES.PAYMENTS}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{t("Payment History")}</span>
                  </Link>

                  <Link
                    href={CUSTOMER_ROUTES.SETTINGS}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{t("Account Settings")}</span>
                  </Link>

                  <div className="border-t border-[#E2E8F0] dark:border-slate-800 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        toast.success("Signed out successfully");
                        window.location.href = "/login";
                      }}
                      className="w-full flex items-center gap-2 p-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t("Sign Out")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative" ref={authDropdownRef}>
              <button
                type="button"
                onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer touch-manipulation"
                aria-haspopup="true"
                aria-expanded={authDropdownOpen}
              >
                <span>{t("nav.signIn", "Sign In")}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${authDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {authDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#161922]/95 p-1.5 shadow-xl shadow-slate-900/10 dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-white/5 mb-1">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      {t("nav.signIn", "Account Access")}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                      {t("nav.signUp", "Sign in or create a new account")}
                    </p>
                  </div>

                  <Link
                    href="/login"
                    onClick={() => setAuthDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
                      <LogIn className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold">{t("nav.signIn", "Sign In")}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">{t("Existing customer or provider")}</span>
                    </div>
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setAuthDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <UserPlus className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900 dark:text-white">{t("nav.register", "Create Account")}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">{t("New customer or provider")}</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>

      {/* Modern Slide-Out Left Sidebar Drawer for Mobile Rendered at Root Portal */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="lg:hidden fixed inset-0 z-[9999]">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Left Drawer Panel - Solid Opaque Background */}
          <aside
            aria-label="Mobile Navigation Drawer"
            className="fixed top-0 bottom-0 left-0 z-10 w-[310px] max-w-[85vw] h-full bg-white dark:bg-[#161922] border-r border-[#E2E8F0] dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Drawer Top Header: Logo + Close Button */}
            <div
              className="p-4 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-[#161922]"
            >
              <div className="flex items-center gap-2.5">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={brandName}
                    className="w-8 h-8 rounded-lg object-contain shadow-xs shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#B45309] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Ticket className="w-4 h-4 transform -rotate-12" />
                  </div>
                )}
                <div>
                  <span className="text-base font-black tracking-tight text-[#0F172A] dark:text-white leading-none block">
                    {brandName}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#64748B] dark:text-slate-400 font-semibold block mt-0.5">
                    {settings.tagline || "Verified Ticket Hub"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Center Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {/* Language Selector for Mobile Drawer */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <LanguageSelector variant="mobile" />
              </div>

              {isAuthenticated && user ? (
                /* -------------------------------------------------------------
                   CASE 1: LOGGED-IN USER VIEW
                   - Welcome with User Name & Email
                   - Role badge
                   - Full list of all features & portal switchers
                   ------------------------------------------------------------- */
                <>
                  {/* User Profile Welcome Card */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#B45309] text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider block">
                          Welcome Back
                        </span>
                        <h4 className="text-sm font-bold text-[#0F172A] dark:text-white truncate">
                          {user.name}
                        </h4>
                        <p className="text-[11px] text-muted-foreground truncate font-mono">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-amber-500/15 text-[11px]">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {user.role === "ADMIN"
                          ? "Super Admin"
                          : user.role === "ORGANIZATION"
                          ? "Provider Operator"
                          : user.role === "INSPECTOR"
                          ? "Ticket Inspector"
                          : "Verified Passenger"}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        Active Account
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats: Active Wallet & Saved */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <Link
                      href={CUSTOMER_ROUTES.TICKETS}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-xs">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{activeBookingsCount} Passes</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">Digital Wallet</span>
                    </Link>

                    <Link
                      href={CUSTOMER_ROUTES.FAVORITES}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-1 text-rose-600 dark:text-rose-400 font-bold text-xs">
                        <Heart className="w-3.5 h-3.5 fill-rose-500/30" />
                        <span>{favorites.length} Saved</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">Wishlist</span>
                    </Link>
                  </div>

                  {/* Switch to Management Console if Privileged Role */}
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Super Admin Console</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {user.role === "ORGANIZATION" && (
                    <Link
                      href="/provider"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>Provider Management</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {user.role === "INSPECTOR" && (
                    <Link
                      href="/inspector/scanner"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        <span>Live Gate Scanner</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {/* Customer Portal Features */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 block mb-1">
                      My Account & Services
                    </span>
                    <Link
                      href={CUSTOMER_ROUTES.OVERVIEW}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Dashboard Overview</span>
                    </Link>
                    <Link
                      href={CUSTOMER_ROUTES.BOOKINGS}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Ticket className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>My Bookings</span>
                      </div>
                      {activeBookingsCount > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                          {activeBookingsCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href={CUSTOMER_ROUTES.TICKETS}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{t("Digital Ticket Wallet")}</span>
                    </Link>
                    <Link
                      href={CUSTOMER_ROUTES.PAYMENTS}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span>{t("Payment & Receipt History")}</span>
                    </Link>
                    <Link
                      href="/customer/refunds"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                      <span>{t("Refund Claims & Policy")}</span>
                    </Link>
                    <Link
                      href={CUSTOMER_ROUTES.SETTINGS}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>{t("Account Settings")}</span>
                    </Link>
                  </div>

                  {/* Ticket Sectors */}
                  <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 block mb-1">
                      {t("Explore Ticket Sectors")}
                    </span>
                    <Link
                      href="/bus"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Bus className="w-4 h-4 text-blue-600" />
                      <span>{t("Intercity Buses")}</span>
                    </Link>
                    <Link
                      href="/cinema"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Film className="w-4 h-4 text-purple-600" />
                      <span>{t("Cinema & IMAX")}</span>
                    </Link>
                    <Link
                      href="/events"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>{t("Concerts & Festivals")}</span>
                    </Link>
                    <Link
                      href="/sports"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-emerald-600" />
                      <span>{t("Stadium Sports")}</span>
                    </Link>
                  </div>
                </>
              ) : (
                /* -------------------------------------------------------------
                   CASE 2: NOT LOGGED-IN GUEST VIEW
                   - Prominent Login & Register Action Box
                   - List of accessible authorized public features
                   - Official trust verification notice
                   ------------------------------------------------------------- */
                <>
                  {/* Login & Register Action Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
                        {t("Welcome to TIKORA")}
                      </span>
                      <h4 className="text-sm font-bold text-foreground">
                        {t("Sign in to your digital ticket wallet")}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                        {t("Access verified QR boarding passes, reserve seating, and enjoy instant entry across Ethiopia.")}
                      </p>
                    </div>

                    {/* Prominent Login & Register Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 px-3 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>{t("Sign In")}</span>
                      </Link>

                      <Link
                        href="/register/customer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 px-3 rounded-xl border border-[#B45309]/30 text-[#B45309] dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30 text-xs font-bold text-center transition-all hover:bg-amber-100/50 active:scale-95 touch-manipulation"
                      >
                        <span>{t("Register")}</span>
                      </Link>
                    </div>

                    {/* Provider registration link */}
                    <div className="pt-1.5 text-center border-t border-amber-500/15">
                      <Link
                        href="/register/organization"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[11px] font-semibold text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 inline-flex items-center gap-1"
                      >
                        <Building2 className="w-3 h-3 text-amber-600" />
                        <span>{t("Are you an operator? Partner with us")}</span>
                      </Link>
                    </div>
                  </div>

                  {/* Accessible Public Features & Sectors */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 block mb-1">
                      {t("Accessible Authorized Features")}
                    </span>
                    <Link
                      href="/search"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{t("Explore All Tickets")}</span>
                    </Link>
                    <Link
                      href="/bus"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Bus className="w-4 h-4 text-blue-600" />
                      <span>{t("Intercity Bus Routes & Fleets")}</span>
                    </Link>
                    <Link
                      href="/cinema"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Film className="w-4 h-4 text-purple-600" />
                      <span>{t("Cinema & 4K IMAX Showtimes")}</span>
                    </Link>
                    <Link
                      href="/events"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>{t("Concerts, Festivals & VIP Passes")}</span>
                    </Link>
                    <Link
                      href="/sports"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-emerald-600" />
                      <span>{t("Premier League Stadium Sports")}</span>
                    </Link>
                  </div>

                  {/* Informational Pages */}
                  <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 block mb-1">
                      {t("Information & Support")}
                    </span>
                    <Link
                      href="/about"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Info className="w-4 h-4 text-slate-400" />
                      <span>{t("About TIKORA Ethiopia")}</span>
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>{t("footer.helpCenter", "Help Center & 24/7 Support")}</span>
                    </Link>
                  </div>

                  {/* Security & Verification Credentials */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-[11px] text-muted-foreground space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{t("100% Certified Ticketing")}</span>
                    </div>
                    <p className="text-[10px] leading-relaxed">
                      All tickets are cryptographically signed. Instant QR boarding valid on Telebirr, CBE Birr & Chapa payments.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Drawer Bottom Actions: Sign Out or Officer Login */}
            <div
              className="p-4 border-t border-[#E2E8F0] dark:border-slate-800 space-y-2 bg-slate-50 dark:bg-slate-900 shrink-0"
            >
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    toast.success("Signed out successfully");
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="text-[11px]">TIKORA Platform v2.4</span>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-bold text-amber-600 hover:underline"
                  >
                    Officer Login →
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}

export default PublicNavbar;
