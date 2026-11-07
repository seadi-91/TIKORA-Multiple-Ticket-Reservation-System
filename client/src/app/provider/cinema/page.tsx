"use client";

import React from "react";
import Link from "next/link";
import {
  Film,
  Plus,
  Clock,
  MapPin,
  Star,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Ticket,
} from "lucide-react";
import { CinemaService } from "@/services/cinema.service";
import { formatCurrency } from "@/lib/format-currency";
import { useProviderStore } from "@/stores/provider.store";

export default function ProviderCinemaPage() {
  const movies = CinemaService.getAllMovies();
  const { movieShowtimes } = useProviderStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/provider" className="hover:text-[#B45309]">
              Provider Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0F172A] dark:text-white">Cinema Operations</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
            Movie Screening & Theater Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage movie listings, laser projection formats, interactive seat matrices, and showtime schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/provider/cinema/movies"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movie Catalog ({movies.length})</span>
          </Link>

          <Link
            href="/provider/cinema/showtimes"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Showtime</span>
          </Link>
        </div>
      </div>

      {/* Cinema Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Movies</span>
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
            {movies.length} Premieres
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Now Showing</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Laser Halls & Screens</span>
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
            {movies.length > 0 ? "4 Screens" : "0 Screens"}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">IMAX 4K + Dolby Atmos</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Daily Showtimes</span>
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
            {movieShowtimes.length} Screenings
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Scheduled runs</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Seating Classes</span>
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
            3 Tiers
          </div>
          <span className="text-[10px] text-slate-400">Standard, VIP & Couple Loungers</span>
        </div>
      </div>

      {/* Movies Catalog Grid */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
              Current Screening Features
            </h2>
            <p className="text-xs text-slate-400">Blockbusters scheduled across theater halls</p>
          </div>
          <Link
            href="/provider/cinema/movies"
            className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline"
          >
            Manage Catalog →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {movies.length === 0 ? (
            <div className="col-span-full py-16 px-4 text-center text-xs text-muted-foreground">
              <Film className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="font-semibold text-foreground text-sm">No cinema features scheduled</p>
              <p className="text-[11px] mt-1 max-w-sm mx-auto text-muted-foreground">
                No movie premieres are currently active in your theater catalog. Click &quot;Schedule Showtime&quot; to list a screening.
              </p>
            </div>
          ) : (
            movies.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {m.categoryDetails?.screenFormat || "IMAX"}
                  </span>
                  <span className="text-xs font-black text-[#B45309] dark:text-amber-400">
                    From {formatCurrency(m.price)}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0F172A] dark:text-white line-clamp-1">
                    {m.title}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                    {m.categoryDetails?.movieGenre} • {m.duration} • Rated {m.categoryDetails?.movieRating}
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{m.organizer} ({m.categoryDetails?.movieHall})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Next Screening: {m.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <span className="text-xs font-bold text-emerald-600">
                  {m.availableSeats} Seats Available
                </span>

                <Link
                  href={`/cinema/${m.id}`}
                  target="_blank"
                  className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Preview</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
}
