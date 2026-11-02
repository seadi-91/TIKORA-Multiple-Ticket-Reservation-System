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
} from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Brand & Value Proposition Sidebar (Desktop) */}
      <aside className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between bg-gradient-to-br from-indigo-950 via-slate-950 to-black p-12 xl:p-16 text-white relative overflow-hidden border-r border-slate-800/60">
        {/* Radiant Ambient Mesh Blurs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Top: Logo & Platform Identity */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 group-hover:scale-105 group-hover:rotate-1 transition-all duration-300 ring-1 ring-white/20">
              <Ticket className="w-6 h-6 transform -rotate-12" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                TIKORA
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-indigo-400 font-bold">
                Unified Ticketing Engine
              </span>
            </div>
          </Link>

          <div className="mt-14 space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen Multi-Industry Reservations</span>
            </div>
            <h1 className="text-3xl xl:text-5xl font-black tracking-tight leading-[1.15] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Every ticket you need, <br />
              in one single place.
            </h1>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed">
              Book long-distance buses, cinema blockbusters, music festivals, and stadium matches with instant digital QR passes and real-time seat locks.
            </p>
          </div>
        </div>

        {/* Middle: Supported Ticket Categories Showcase Cards */}
        <div className="relative z-10 my-8 grid grid-cols-2 gap-3.5 max-w-lg">
          <div className="group p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-indigo-500/40 hover:bg-white/[0.08] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2.5 group-hover:scale-110 transition-transform">
              <Bus className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-white">Intercity Buses</p>
            <p className="text-xs text-slate-400 mt-0.5">Fleet routes & seat maps</p>
          </div>

          <div className="group p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-purple-500/40 hover:bg-white/[0.08] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2.5 group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-white">Cinema & Movies</p>
            <p className="text-xs text-slate-400 mt-0.5">Halls & premiere times</p>
          </div>

          <div className="group p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-amber-500/40 hover:bg-white/[0.08] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2.5 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-white">Live Events</p>
            <p className="text-xs text-slate-400 mt-0.5">Concerts & VIP packages</p>
          </div>

          <div className="group p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 hover:bg-white/[0.08] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-white">Sports & Games</p>
            <p className="text-xs text-slate-400 mt-0.5">Stadium tribune passes</p>
          </div>
        </div>

        {/* Bottom: Trust & Security Badges */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span>Digital QR Passes</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Partners</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Instant Confirmation</span>
          </div>
        </div>
      </aside>

      {/* Main Form Content Area */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto bg-slate-950 relative">
        {/* Subtle Ambient Light in form area */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-slate-800 relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-wider text-white">
              TIKORA
            </span>
          </Link>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Multi-Ticket System
          </span>
        </div>

        {/* Center container for auth views */}
        <div className="w-full max-w-lg mx-auto my-auto py-6 relative z-10">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500 relative z-10">
          <p>© {new Date().getFullYear()} TIKORA Multi-Ticket Reservation Platform. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
