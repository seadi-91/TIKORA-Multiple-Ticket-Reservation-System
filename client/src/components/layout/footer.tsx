"use client";

import React, { useState } from "react";
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

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="border-t border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#0F1117] text-[#64748B] dark:text-slate-400 text-xs transition-colors duration-200">
      {/* Top Banner - Compact */}
      <div className="border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50 dark:bg-[#161922] py-4 sm:py-5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#B45309] dark:text-[#D97706]" />
              <span>Are you a Bus Operator, Cinema Hall, or Event Organizer?</span>
            </h3>
            <p className="text-[11px] text-[#64748B] dark:text-slate-400 max-w-xl">
              Partner with TicketHub for automated seat allocation, real-time ticket scanning, and instant local payouts.
            </p>
          </div>

          <Link
            href={AUTH_ROUTES.REGISTER_ORGANIZATION}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold transition-all shadow-xs shrink-0 active:scale-95"
          >
            <span>Partner with Us</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links - Compact */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#B45309] flex items-center justify-center text-white shadow-xs">
              <Ticket className="w-4 h-4 transform -rotate-12" />
            </div>
            <span className="text-base font-black tracking-tight text-[#0F172A] dark:text-white">
              Ticket<span className="text-[#B45309] dark:text-[#D97706]">Hub</span>
            </span>
          </Link>

          <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-relaxed max-w-sm">
            Ethiopia&apos;s unified multi-category reservation platform. Secure, instant digital QR passes for buses, movies, concerts, and stadium sports.
          </p>

          <div className="flex flex-col gap-1.5 pt-0.5 text-[11px]">
            <div className="flex items-center gap-2 text-[#0F172A] dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>Bole Medhanialem, Edna Mall Tower, 6th Fl, Addis Ababa</span>
            </div>
            <div className="flex items-center gap-2 text-[#0F172A] dark:text-slate-300">
              <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>+251 11 667 8900 / +251 91 100 2233</span>
            </div>
            <div className="flex items-center gap-2 text-[#0F172A] dark:text-slate-300">
              <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>support@tickethub.et</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
            Categories
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href="/bus" className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors flex items-center gap-1.5">
                <Bus className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span>Intercity Buses</span>
              </Link>
            </li>
            <li>
              <Link href="/cinema" className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors flex items-center gap-1.5">
                <Film className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span>Cinema & IMAX</span>
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span>Concerts & Festivals</span>
              </Link>
            </li>
            <li>
              <Link href="/sports" className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors flex items-center gap-1.5">
                <Trophy className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span>Premier League Sports</span>
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors flex items-center gap-1.5">
                <QrCode className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span>All Tickets</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Portal */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
            Customer Hub
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href={CUSTOMER_ROUTES.OVERVIEW} className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors">
                Dashboard Overview
              </Link>
            </li>
            <li>
              <Link href={CUSTOMER_ROUTES.BOOKINGS} className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors">
                My Bookings
              </Link>
            </li>
            <li>
              <Link href={CUSTOMER_ROUTES.TICKETS} className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors">
                Digital Wallet
              </Link>
            </li>
            <li>
              <Link href={CUSTOMER_ROUTES.FAVORITES} className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors">
                Saved Wishlist
              </Link>
            </li>
            <li>
              <Link href={CUSTOMER_ROUTES.PAYMENTS} className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors">
                Payment History
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#B45309] dark:hover:text-[#D97706] transition-colors">
                Help & FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter & Payment Badges */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
            Newsletter
          </h4>
          <p className="text-[11px] text-[#64748B] dark:text-slate-400">
            Get early alerts on movie releases and concert presales.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-1.5">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#161922] text-[#0F172A] dark:text-white placeholder-[#64748B] text-xs focus:outline-none focus:border-[#B45309]"
              />
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}

          <div className="pt-1.5">
            <span className="text-[9px] uppercase font-bold text-[#64748B] dark:text-slate-400 block mb-1">
              Local Payment Gateways
            </span>
            <div className="flex flex-wrap gap-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161922] text-[10px] font-semibold text-[#0F172A] dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-800">
                Telebirr
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161922] text-[10px] font-semibold text-[#0F172A] dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-800">
                CBE Birr
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161922] text-[10px] font-semibold text-[#0F172A] dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-800">
                Chapa
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161922] text-[10px] font-semibold text-[#0F172A] dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-800">
                Cards
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar - Compact */}
      <div className="border-t border-[#E2E8F0] dark:border-slate-800 py-3.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-[#64748B] dark:text-slate-400">
          <p>© {new Date().getFullYear()} TicketHub Ethiopia Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/about" className="hover:text-[#B45309] dark:hover:text-[#D97706]">About</Link>
            <Link href="/contact" className="hover:text-[#B45309] dark:hover:text-[#D97706]">Terms</Link>
            <Link href="/contact" className="hover:text-[#B45309] dark:hover:text-[#D97706]">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
