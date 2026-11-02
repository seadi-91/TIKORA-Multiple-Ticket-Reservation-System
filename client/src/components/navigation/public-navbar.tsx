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
  LogIn,
  UserPlus,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Laptop,
  Check,
  ChevronDown,
} from "lucide-react";
import { AUTH_ROUTES } from "@/lib/constants";
import { useTheme, Theme } from "@/providers/theme-provider";

interface PublicNavbarProps {
  onSearchClick?: () => void;
}

export function PublicNavbar({ onSearchClick }: PublicNavbarProps) {
  const pathname = usePathname();
  const { theme, resolvedTheme, systemIsDark, setTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll detection: before scroll transparent with no border; after scroll frosted glass with border
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 12) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "All Tickets", href: "/", icon: Ticket },
    { label: "Buses", href: "/bus", icon: Bus, badge: "Popular" },
    { label: "Cinema", href: "/cinema", icon: Film },
    { label: "Events", href: "/events", icon: Calendar, badge: "Hot" },
    { label: "Sports", href: "/sports", icon: Trophy },
  ];

  const themeOptions: {
    value: Theme;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      value: "light",
      label: "Light",
      description: "Clean & bright daylight mode",
      icon: Sun,
      accentColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      value: "dark",
      label: "Dark",
      description: "Midnight obsidian mode",
      icon: Moon,
      accentColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      value: "system",
      label: "System",
      description: `Follows OS (${systemIsDark ? "Dark" : "Light"})`,
      icon: Laptop,
      accentColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-200/90 dark:border-slate-800/90 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-xs dark:shadow-md dark:shadow-black/20"
          : "border-b border-transparent bg-transparent shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 ring-1 ring-white/20">
            <Ticket className="w-5 h-5 transform -rotate-12" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider text-slate-900 dark:text-white">
              TIKORA
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold leading-none">
              Ticketing Platform
            </span>
          </div>
        </Link>

        {/* Desktop Category Navigation */}
        <nav
          className={`hidden md:flex items-center gap-1 p-1.5 rounded-2xl transition-all duration-300 ${
            isScrolled
              ? "bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md"
              : "bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-slate-800/50 backdrop-blur-sm"
          }`}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge && !isActive && (
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Theme Switcher */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Theme Dropdown Toggle */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 border shadow-xs ${
                isScrolled
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200/80 border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:border-slate-800"
                  : "bg-white/60 text-slate-800 hover:bg-white/90 border-slate-200/80 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900 dark:border-slate-800/80 backdrop-blur-sm"
              }`}
              title="Change Theme (Dark, Light, System)"
              aria-label="Theme Selector"
            >
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              ) : theme === "light" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Laptop className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              )}
              <span className="capitalize text-xs font-bold">
                {theme}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                  themeDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/60 p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                  Appearance Theme
                </div>
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
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all my-0.5 text-left ${
                        isSelected
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${opt.accentColor}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold leading-tight">{opt.label}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                            {opt.description}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
              title="Search Tickets"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <Link
            href={AUTH_ROUTES.LOGIN}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isScrolled
                ? "text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80"
                : "text-slate-800 hover:text-black bg-white/70 hover:bg-white dark:text-slate-200 dark:hover:text-white dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 shadow-2xs"
            }`}
          >
            <LogIn className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Sign In</span>
          </Link>

          <Link
            href={AUTH_ROUTES.REGISTER}
            className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-md shadow-indigo-600/30 transition-all duration-200 active:scale-[0.99]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join Tikora</span>
          </Link>
        </div>

        {/* Mobile Header Buttons (Theme Toggle + Menu) */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile Quick Theme Toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={`p-2 rounded-xl border text-xs ${
              isScrolled
                ? "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                : "bg-white/60 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border-slate-200/70 dark:border-slate-800/70"
            }`}
            aria-label="Toggle Theme"
          >
            {resolvedTheme === "dark" ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2.5 rounded-xl border ${
              isScrolled
                ? "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                : "bg-white/60 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border-slate-200/70 dark:border-slate-800/70"
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-5 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/70 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/50"
                >
                  <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Theme Selector inside mobile drawer */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Appearance Theme
            </span>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
            <Link
              href={AUTH_ROUTES.LOGIN}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              <LogIn className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Sign In</span>
            </Link>

            <Link
              href={AUTH_ROUTES.REGISTER}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-xs font-bold text-white shadow-md shadow-indigo-600/30"
            >
              <UserPlus className="w-4 h-4" />
              <span>Join Tikora</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default PublicNavbar;
