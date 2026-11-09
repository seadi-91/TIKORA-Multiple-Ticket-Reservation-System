"use client";

import React from "react";
import Link from "next/link";
import {
  Ticket,
  Bus,
  Film,
  Calendar,
  Trophy,
  ShieldCheck,
  QrCode,
  Sparkles,
  Zap,
  Home,
  ArrowLeft,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAdminStore } from "@/stores/admin.store";
import { useLanguage } from "@/providers/language-provider";
import { LanguageSelector } from "@/components/navigation/language-selector";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useAdminStore();
  const { t } = useLanguage();
  const brandName = settings?.siteName || settings?.platformName || "TIKORA";
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-[#F8FAFC] font-sans selection:bg-amber-600 selection:text-white transition-colors duration-200 relative overflow-hidden">
      {/* =========================================================================
          LEFT / BRANDING SIDEBAR (Facing the Input Form on Desktop)
          Supports Light, Dark, System Themes with Minimal, Refined Brand Accents
          ========================================================================= */}
      <aside className="hidden lg:flex lg:w-5/12 xl:w-[48%] 2xl:w-1/2 flex-col justify-between p-10 xl:p-14 2xl:p-16 relative overflow-hidden border-r border-slate-200/80 dark:border-white/10 bg-gradient-to-br from-slate-100/90 via-white to-slate-50/80 dark:from-[#0E121B] dark:via-[#0B0D13] dark:to-[#120F0D] text-slate-900 dark:text-white transition-colors duration-200">
        {/* Subtle, restrained ambient background glows (minimized brand saturation) */}
        <div className="absolute -top-28 -left-28 w-[450px] h-[450px] bg-slate-200/60 dark:bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-[380px] h-[380px] bg-slate-200/40 dark:bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-28 -left-20 w-[420px] h-[420px] bg-slate-300/30 dark:bg-slate-800/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Minimalist dot mesh background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Top: Logo & Platform Identity */}
        <div className="relative z-10 space-y-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={brandName}
                className="w-11 h-11 rounded-2xl object-contain bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-md ring-1 ring-black/5 dark:ring-white/20 group-hover:scale-105 transition-all duration-300 shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center shadow-md ring-1 ring-black/5 dark:ring-white/20 group-hover:scale-105 transition-all duration-300 shrink-0">
                <Ticket className="w-5 h-5 transform -rotate-12" />
              </div>
            )}
            <div>
              <span suppressHydrationWarning className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                {brandName}
              </span>
              <span suppressHydrationWarning className="block text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                {settings?.tagline || "Ethiopian Multi-Category Reservation"}
              </span>
            </div>
          </Link>

          <div className="space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md bg-white/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t("Unified Ticketing Platform")}</span>
            </div>
            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white">
              {t("Every ticket you need,")} <br />
              <span className="text-slate-600 dark:text-slate-300">
                {t("instant, verified & digital.")}
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs xl:text-sm leading-relaxed max-w-md">
              {t("Automated seat allocation for intercity buses, cinema halls, concert arenas, and stadium sports with instant Telebirr digital QR passes.")}
            </p>
          </div>
        </div>

        {/* Middle: Clean Frosted Glass Digital Pass Preview */}
        <div className="relative z-10 my-6 max-w-lg">
          <div className="relative rounded-3xl p-5 border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-2xl shadow-[0_15px_40px_rgba(15,23,42,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden">
            {/* Subtle specular line */}
            <div className="absolute -inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/80 dark:via-white/20 to-transparent pointer-events-none" />

            {/* Pass Top Bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white tracking-wide">
                    {t("TIKORA VIP PASS")}
                  </span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                    {t("Intercity Express Bus • Selam Fleet")}
                  </span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t("ACTIVE VERIFIED")}</span>
              </div>
            </div>

            {/* Route & Departure Visual */}
            <div className="py-3.5 flex items-center justify-between gap-3">
              <div>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  {t("Boarding Terminal")}
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {t("Addis Ababa")}
                </span>
                <span className="block text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                  {t("Meskel Sq Terminal")}
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center px-2">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                  <Bus className="w-3.5 h-3.5" />
                  <span>5h 30m</span>
                </div>
                <div className="w-full flex items-center">
                  <div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-white" />
                  <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700 border-t border-dashed border-slate-300 dark:border-slate-600" />
                  <div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-white" />
                </div>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 font-mono">06:30 AM {t("DEPARTURE")}</span>
              </div>

              <div className="text-right">
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  {t("Destination")}
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {t("Hawassa")}
                </span>
                <span className="block text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                  {t("Lake View Park")}
                </span>
              </div>
            </div>

            {/* Perforated ticket cutout divider */}
            <div className="relative py-2">
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 dark:bg-[#0E121B] border-r border-slate-200/90 dark:border-white/10" />
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 dark:bg-[#0E121B] border-l border-slate-200/90 dark:border-white/10" />
              <div className="w-full border-t border-dashed border-slate-200 dark:border-white/15" />
            </div>

            {/* Digital Pass Details & Encrypted QR Stamp */}
            <div className="pt-2 flex items-center justify-between">
              <div className="grid grid-cols-3 gap-3 text-left">
                <div>
                  <span className="block text-[9px] text-slate-500 dark:text-slate-400 uppercase">{t("Seat")}</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">14A (VIP)</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 dark:text-slate-400 uppercase">{t("Gate")}</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Gate 02</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 dark:text-slate-400 uppercase">{t("Pass Ref")}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">TK-8941</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-100 dark:border-white/10">
                <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.08] border border-slate-200 dark:border-white/15 shadow-2xs">
                  <QrCode className="w-7 h-7 text-slate-900 dark:text-white" />
                </div>
                <div className="text-right">
                  <span className="block text-[8px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                    {t("Telebirr Paid")}
                  </span>
                  <span className="block text-[8px] text-slate-500 dark:text-slate-400">
                    {t("Offline Valid")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Category Glass Micro-Cards */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl backdrop-blur-md bg-white/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 group">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200 text-xs font-bold mb-1">
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Bus className="w-3.5 h-3.5" />
                </div>
                <span>{t("Intercity Buses")}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {t("categories.busDesc", "Selam, Abay & Golden Bus fleets with seat matrices.")}
              </p>
            </div>

            <div className="p-3 rounded-2xl backdrop-blur-md bg-white/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 group">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200 text-xs font-bold mb-1">
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Film className="w-3.5 h-3.5" />
                </div>
                <span>{t("Cinema & IMAX")}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {t("categories.cinemaDesc", "Century & Edna Mall premier halls with Dolby Atmos.")}
              </p>
            </div>

            <div className="p-3 rounded-2xl backdrop-blur-md bg-white/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 group">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200 text-xs font-bold mb-1">
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span>{t("Concerts & Events")}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {t("categories.eventDesc", "Addis Jazz festivals, comedy nights & conventions.")}
              </p>
            </div>

            <div className="p-3 rounded-2xl backdrop-blur-md bg-white/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 group">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200 text-xs font-bold mb-1">
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <span>{t("Stadium Sports")}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {t("categories.sportsDesc", "Sheger Derby & Premier League digital turnstiles.")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="relative z-10 pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t("100% Certified Ticketing")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span>{t("Telebirr & CBE Birr")}</span>
          </div>
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span>{t("Encrypted Pass")}</span>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          RIGHT / FORM CONTAINER
          Supports Light, Dark, System Modes with Top Navigation Bar
          ========================================================================= */}
      <main className="flex-1 flex flex-col justify-center items-center p-4 pt-20 sm:p-8 sm:pt-24 lg:p-12 xl:p-16 relative bg-slate-50/60 dark:bg-[#0F1117] transition-colors duration-200 overflow-hidden">
        {/* Top Navigation Bar: Home Link on Left, Language Dropdown & Theme on Right */}
        <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 lg:inset-x-12 flex items-center justify-between z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 text-xs font-semibold backdrop-blur-md transition-all shadow-2xs group cursor-pointer"
            title="Return to Home Page"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <Home className="w-3.5 h-3.5" />
            <span>{t("nav.home", "Home")}</span>
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSelector variant="navbar" />
            <ThemeToggle />
          </div>
        </div>

        {/* Ambient Subtle Background Lights */}
        <div className="absolute -top-32 right-0 w-[400px] h-[400px] bg-slate-200/50 dark:bg-slate-800/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] bg-slate-200/50 dark:bg-slate-800/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.03)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="w-full max-w-md sm:max-w-xl lg:max-w-2xl relative z-10 space-y-6">
          {/* Mobile Logo Header */}
          <div className="lg:hidden text-center space-y-2 mb-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={brandName}
                  className="w-10 h-10 rounded-xl object-contain bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-md ring-1 ring-black/5 dark:ring-white/20 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center shadow-md ring-1 ring-black/5 dark:ring-white/20">
                  <Ticket className="w-5 h-5 transform -rotate-12" />
                </div>
              )}
              <span suppressHydrationWarning className="text-xl font-black text-slate-900 dark:text-white">
                {brandName}
              </span>
            </Link>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
