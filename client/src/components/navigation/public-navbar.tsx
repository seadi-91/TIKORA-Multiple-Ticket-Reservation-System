"use client";

import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { AUTH_ROUTES, CUSTOMER_ROUTES } from "@/lib/constants";
import { useTheme, Theme } from "@/providers/theme-provider";
import { useBookingStore } from "@/stores/booking.store";
import { useAuthStore } from "@/stores/auth.store";

interface PublicNavbarProps {
  onSearchClick?: () => void;
}

export function PublicNavbar({ onSearchClick }: PublicNavbarProps) {
  const pathname = usePathname();
  const { theme, systemIsDark, setTheme } = useTheme();
  const { favorites, notifications } = useBookingStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "Home", href: "/", icon: Ticket },
    { label: "Explore", href: "/search", icon: Compass },
    { label: "Buses", href: "/bus", icon: Bus },
    { label: "Cinema", href: "/cinema", icon: Film },
    { label: "Events", href: "/events", icon: Calendar },
    { label: "Sports", href: "/sports", icon: Trophy },
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
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-slate-800 shadow-xs"
          : "bg-transparent border-b border-transparent shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between gap-3">
        {/* Brand Logo - Compact */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#B45309] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Ticket className="w-4 h-4 transform -rotate-12" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-[#0F172A] dark:text-white flex items-center gap-0.5">
              Ticket<span className="text-[#B45309] dark:text-[#D97706]">Hub</span>
            </span>
            <span className="text-[8px] uppercase tracking-widest text-[#64748B] dark:text-slate-400 font-semibold block -mt-1 hidden sm:block">
              Multi-Ticket Ethiopia
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation - Compact */}
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

        {/* Right Customer Controls - Compact */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Wishlist Link */}
          <Link
            href={CUSTOMER_ROUTES.FAVORITES}
            className="relative p-1.5 sm:p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-white/70 dark:bg-[#161922] text-[#64748B] hover:text-[#B45309] dark:text-slate-300 transition-colors"
            title="My Saved Wishlist"
          >
            <Heart className="w-3.5 h-3.5" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#B45309] text-white text-[8px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Notifications Link */}
          <Link
            href={CUSTOMER_ROUTES.NOTIFICATIONS}
            className="relative p-1.5 sm:p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-white/70 dark:bg-[#161922] text-[#64748B] hover:text-[#B45309] dark:text-slate-300 transition-colors"
            title="Notification Center"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#B45309] text-white text-[8px] font-bold flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </Link>

          {/* Theme Dropdown */}
          <div className="relative" ref={themeDropdownRef}>
            <button
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

          {/* User Profile / Dashboard Actions */}
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-white/70 dark:bg-[#161922] hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-md bg-slate-900 dark:bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                A
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-[#0F172A] dark:text-white">
                Customer
              </span>
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] p-1.5 shadow-xl z-50 space-y-0.5">
                <div className="p-2 border-b border-[#E2E8F0] dark:border-slate-800 mb-1">
                  <p className="text-xs font-bold text-[#0F172A] dark:text-white">Abebe Bekele</p>
                  <p className="text-[10px] text-[#64748B] dark:text-slate-400">abebe.customer@tickethub.et</p>
                </div>

                <Link
                  href={CUSTOMER_ROUTES.OVERVIEW}
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>Dashboard Overview</span>
                </Link>

                <Link
                  href={CUSTOMER_ROUTES.BOOKINGS}
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                >
                  <Ticket className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>My Bookings</span>
                </Link>

                <Link
                  href={CUSTOMER_ROUTES.TICKETS}
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>Digital Ticket Wallet</span>
                </Link>

                <Link
                  href={CUSTOMER_ROUTES.PAYMENTS}
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                >
                  <CreditCard className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>Payment History</span>
                </Link>

                <Link
                  href={CUSTOMER_ROUTES.SETTINGS}
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>Account Settings</span>
                </Link>

                <div className="border-t border-[#E2E8F0] dark:border-slate-800 pt-1 mt-1">
                  <Link
                    href={AUTH_ROUTES.LOGIN}
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white"
            aria-label="Open Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer - Compact */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] px-3 pt-2 pb-4 space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-800 text-xs font-semibold text-[#0F172A] dark:text-white"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 space-y-1.5">
            <Link
              href={CUSTOMER_ROUTES.BOOKINGS}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <Ticket className="w-3.5 h-3.5" />
                <span>My Bookings</span>
              </span>
              <span className="text-[9px] bg-[#B45309] text-white px-2 py-0.5 rounded-full font-bold">
                Active
              </span>
            </Link>

            <Link
              href={CUSTOMER_ROUTES.TICKETS}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white text-xs font-semibold"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>Digital Ticket Wallet</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default PublicNavbar;
