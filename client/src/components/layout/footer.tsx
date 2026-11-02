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
  Zap,
  ArrowRight,
} from "lucide-react";
import { AUTH_ROUTES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200">
      {/* Top Banner: For Ticket Providers */}
      <div className="border-b border-slate-200 dark:border-slate-800/60 bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Are you a Bus Operator, Cinema Hall, or Event Organizer?</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl">
              Sell tickets on Tikora. Gain automated seat maps, real-time ticket scanner apps, and instant financial settlements.
            </p>
          </div>

          <Link
            href={AUTH_ROUTES.REGISTER_ORGANIZATION}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-600/30 shrink-0"
          >
            <span>Partner with Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="col-span-2 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <Ticket className="w-5 h-5 transform -rotate-12" />
            </div>
            <span className="text-lg font-black tracking-wider text-slate-900 dark:text-white">
              TIKORA
            </span>
          </Link>

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
            Ethiopia&apos;s unified multi-ticket reservation engine. Secure, instant digital passes for intercity travel, movie theaters, concerts, and stadium sports.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 shadow-xs">
              <QrCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold text-[11px]">Instant QR Pass</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-[11px]">Verified Partners</span>
            </div>
          </div>
        </div>

        {/* Column 1: Ticketing Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Categories
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/bus" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-cyan-500" /> Intercity Buses
              </Link>
            </li>
            <li>
              <Link href="/cinema" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-purple-500" /> Cinema & Movies
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" /> Live Events
              </Link>
            </li>
            <li>
              <Link href="/sports" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-500" /> Stadium Sports
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Account Portals */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Account Portals
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href={AUTH_ROUTES.LOGIN} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Unified Sign In
              </Link>
            </li>
            <li>
              <Link href={AUTH_ROUTES.REGISTER_CUSTOMER} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Customer Sign Up
              </Link>
            </li>
            <li>
              <Link href={AUTH_ROUTES.REGISTER_ORGANIZATION} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Provider Registration
              </Link>
            </li>
            <li>
              <Link href={AUTH_ROUTES.FORGOT_PASSWORD} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Password Recovery
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Payment Partners */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Payments Accepted
          </h4>
          <div className="space-y-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Pay securely via local mobile money and bank cards:
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                Telebirr
              </span>
              <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                CBE Birr
              </span>
              <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                Chapa
              </span>
              <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                Visa / MC
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-slate-200 dark:border-slate-800/80 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>© {new Date().getFullYear()} TIKORA Ticketing Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#terms" className="hover:text-slate-600 dark:hover:text-slate-200">Terms of Service</Link>
            <Link href="#privacy" className="hover:text-slate-600 dark:hover:text-slate-200">Privacy Policy</Link>
            <Link href="#contact" className="hover:text-slate-600 dark:hover:text-slate-200">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
