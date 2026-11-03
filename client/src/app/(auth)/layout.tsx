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
} from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0F1117] text-[#F8FAFC] font-sans selection:bg-[#B45309] selection:text-white">
      {/* Brand & Value Proposition Sidebar (Desktop) */}
      <aside className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between bg-gradient-to-br from-[#161922] via-[#0F1117] to-black p-12 xl:p-16 text-white relative overflow-hidden border-r border-slate-800">
        {/* Subtle Ambient Mesh Blurs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#B45309]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[140px] pointer-events-none" />

        {/* Top: Logo & Platform Identity */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-[#B45309] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-all duration-300 ring-1 ring-white/20">
              <Ticket className="w-6 h-6 transform -rotate-12" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                Ticket<span className="text-[#B45309] dark:text-[#D97706]">Hub</span>
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                Multi-Category Ticketing
              </span>
            </div>
          </Link>

          <div className="mt-14 space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#B45309] dark:text-[#D97706]" />
              <span>Modern Ethiopian Ticketing Platform</span>
            </div>
            <h1 className="text-3xl xl:text-5xl font-black tracking-tight leading-[1.15] text-white">
              Every ticket you need, <br />
              in one single place.
            </h1>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed">
              Book long-distance buses, cinema blockbusters, live concerts, and stadium sports with instant Telebirr digital QR passes.
            </p>
          </div>
        </div>

        {/* Middle: Supported Ticket Categories Showcase Cards */}
        <div className="relative z-10 my-10 grid grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl bg-white/5 border border-slate-800 backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <Bus className="w-4 h-4" />
              <span>Intercity Buses</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Selam, Abay & Golden Bus fleets with real-time seat matrices.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-slate-800 backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
              <Film className="w-4 h-4" />
              <span>Cinema & IMAX</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Century & Edna Mall premier screening halls and couple loungers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-slate-800 backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold">
              <Calendar className="w-4 h-4" />
              <span>Concerts & Events</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Addis Jazz festivals, comedy nights & tech conventions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-slate-800 backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
              <Trophy className="w-4 h-4" />
              <span>Stadium Sports</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Sheger Derby & Ethiopian Premier League turnstile gate passes.
            </p>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Certified Ticketing</span>
          </div>
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-slate-400" />
            <span>Encrypted QR Technology</span>
          </div>
        </div>
      </aside>

      {/* Main Form Content Container */}
      <main className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 xl:p-20 bg-[#F8FAFC] dark:bg-[#0F1117]">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo Header */}
          <div className="lg:hidden text-center space-y-2 mb-6">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#B45309] flex items-center justify-center text-white shadow-md">
                <Ticket className="w-5 h-5 transform -rotate-12" />
              </div>
              <span className="text-xl font-black text-[#0F172A] dark:text-white">
                Ticket<span className="text-[#B45309] dark:text-[#D97706]">Hub</span>
              </span>
            </Link>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
