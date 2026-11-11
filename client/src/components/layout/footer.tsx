"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Ticket,
  Bus,
  Film,
  Calendar,
  Trophy,
  Zap,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  QrCode,
} from "lucide-react";
import { AUTH_ROUTES, CUSTOMER_ROUTES } from "@/lib/constants";
import { useAdminStore } from "@/stores/admin.store";
import { useLanguage } from "@/providers/language-provider";
import { LanguageSelector } from "@/components/navigation/language-selector";

export function Footer() {
  const { settings } = useAdminStore();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const brandName = mounted ? (settings.siteName || settings.platformName || "TIKORA") : "TIKORA";
  const brandLocation = mounted
    ? (settings.footerLocation || settings.headquartersAddress || "Edna Mall Tower, Bole Sub-City, Addis Ababa, Ethiopia")
    : "Edna Mall Tower, Bole Sub-City, Addis Ababa, Ethiopia";
  const brandPhone = mounted ? (settings.footerPhone || settings.supportPhone || "+251 11 667 8900") : "+251 11 667 8900";
  const brandEmail = mounted ? (settings.footerEmail || settings.supportEmail || "support@tikora.et") : "support@tikora.et";
  const copyrightNotice = mounted
    ? (settings.copyrightText || `© ${new Date().getFullYear()} ${brandName} Ethiopia Inc. All Rights Reserved.`)
    : `© ${new Date().getFullYear()} TIKORA Ethiopia Inc. All Rights Reserved.`;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="border-t border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#0F1117] text-[#64748B] dark:text-slate-400 text-xs transition-colors duration-200">
      {/* Top Banner - Space-Efficient on Mobile */}
      <div className="border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50 dark:bg-[#161922] py-2.5 sm:py-4 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#B45309] dark:text-[#D97706]" />
              <span>{t("footer.partnerBanner", "Are you a Bus Operator, Cinema Hall, or Organizer?")}</span>
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#64748B] dark:text-slate-400 max-w-xl">
              {t("footer.partnerDesc", "Partner with TIKORA for automated seat allocation, instant QR scanning, and local payouts.")}
            </p>
          </div>

          <Link
            href={AUTH_ROUTES.REGISTER_ORGANIZATION}
            className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs shrink-0 active:scale-95"
          >
            <span>{t("footer.partnerButton", "Partner with Us")}</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links - 2 Columns on Mobile, 3 on Tablet, 5 on Desktop */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
        {/* Brand Column - Compact & 2-Col Span on Mobile */}
        <div className="col-span-2 md:col-span-2 space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={brandName}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain shadow-xs"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#B45309] flex items-center justify-center text-white shadow-xs">
                <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform -rotate-12" />
              </div>
            )}
            <span
              suppressHydrationWarning
              className="text-sm sm:text-base font-black tracking-tight text-[#0F172A] dark:text-white"
            >
              {brandName}
            </span>
          </Link>

          <p
            suppressHydrationWarning
            className="text-[10px] sm:text-[11px] text-[#64748B] dark:text-slate-400 leading-relaxed max-w-sm"
          >
            {mounted && settings.tagline
              ? settings.tagline
              : "Ethiopia's unified multi-category reservation platform. Secure, instant digital QR passes for buses, movies, concerts, and stadium sports."}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[10px] sm:text-[11px] text-[#0F172A] dark:text-slate-300">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span suppressHydrationWarning>{brandLocation}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span suppressHydrationWarning>{brandPhone}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span suppressHydrationWarning>{brandEmail}</span>
            </div>
          </div>
        </div>

        {/* Categories Column */}
        <div className="col-span-1 space-y-1.5 sm:space-y-2.5">
          <h4 className="text-[11px] sm:text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
            {t("footer.explore", "Categories")}
          </h4>
          <ul className="space-y-1 text-[11px] sm:text-xs">
            <li>
              <Link href="/bus" className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors flex items-center gap-1">
                <Bus className="w-3 h-3 text-slate-400" />
                <span>{t("nav.bus", "Intercity Buses")}</span>
              </Link>
            </li>
            <li>
              <Link href="/cinema" className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors flex items-center gap-1">
                <Film className="w-3 h-3 text-slate-400" />
                <span>{t("nav.cinema", "Cinema & IMAX")}</span>
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{t("nav.events", "Concerts & Festivals")}</span>
              </Link>
            </li>
            <li>
              <Link href="/sports" className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors flex items-center gap-1">
                <Trophy className="w-3 h-3 text-slate-400" />
                <span>{t("nav.sports", "Premier League")}</span>
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors flex items-center gap-1">
                <QrCode className="w-3 h-3 text-slate-400" />
                <span>{t("nav.tickets", "All Tickets")}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Portal Column */}
        <div className="col-span-1 space-y-1.5 sm:space-y-2.5">
          <h4 className="text-[11px] sm:text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
            {t("nav.dashboard", "Customer Hub")}
          </h4>
          <ul className="space-y-1 text-[11px] sm:text-xs">
            <li>
              <Link href={CUSTOMER_ROUTES.OVERVIEW} className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors">
                {t("nav.dashboard", "Dashboard Overview")}
              </Link>
            </li>
            <li>
              <Link href={CUSTOMER_ROUTES.BOOKINGS} className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors">
                {t("nav.myBookings", "My Bookings")}
              </Link>
            </li>
            <li>
              <Link href={CUSTOMER_ROUTES.TICKETS} className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors">
                {t("orders.title", "Digital Wallet")}
              </Link>
            </li>
            <li>
              <Link href={CUSTOMER_ROUTES.FAVORITES} className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors">
                {t("nav.wishlist", "Saved Wishlist")}
              </Link>
            </li>
            <li>
              <Link href={CUSTOMER_ROUTES.PAYMENTS} className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors">
                {t("orders.paymentStatus", "Payment History")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors">
                {t("footer.helpCenter", "Help & FAQs")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter & Payment Badges - 2-Col Span on Mobile */}
        <div className="col-span-2 sm:col-span-1 space-y-2">
          <h4 className="text-[11px] sm:text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
            {t("footer.newsletter", "Newsletter")}
          </h4>
          <p className="text-[10px] sm:text-[11px] text-[#64748B] dark:text-slate-400">
            {t("footer.newsletterDesc", "Get early alerts on movie releases and concert presales.")}
          </p>

          {subscribed ? (
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t("footer.subscribed", "Subscribed!")}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-1.5">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t("footer.enterEmail", "Enter email")}
                className="flex-1 px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#161922] text-[#0F172A] dark:text-white placeholder-[#64748B] text-[11px] focus:outline-none focus:border-[#B45309]"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer shrink-0"
              >
                {t("footer.join", "Join")}
              </button>
            </form>
          )}

          <div className="pt-1">
            <span className="text-[9px] uppercase font-bold text-[#64748B] dark:text-slate-400 block mb-1">
              {t("footer.verifiedGateways", "Verified Gateways")}
            </span>
            <div className="flex flex-wrap gap-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161922] text-[9px] font-semibold text-[#0F172A] dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-800">
                Telebirr
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161922] text-[9px] font-semibold text-[#0F172A] dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-800">
                CBE Birr
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161922] text-[9px] font-semibold text-[#0F172A] dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-800">
                Chapa
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161922] text-[9px] font-semibold text-[#0F172A] dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-800">
                Cards
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar - Compact */}
      <div className="border-t border-[#E2E8F0] dark:border-slate-800 py-2.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left text-[10px] sm:text-[11px] text-[#64748B] dark:text-slate-400">
          <p suppressHydrationWarning>{copyrightNotice}</p>
          <div className="flex items-center justify-center gap-3">
            <LanguageSelector variant="footer" />
            <Link href="/about" className="hover:text-[#B45309] dark:hover:text-[#D97706]">{t("footer.aboutTitle", "About")}</Link>
            <Link href="/contact" className="hover:text-[#B45309] dark:hover:text-[#D97706]">{t("footer.termsOfService", "Terms")}</Link>
            <Link href="/contact" className="hover:text-[#B45309] dark:hover:text-[#D97706]">{t("footer.privacyPolicy", "Privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
