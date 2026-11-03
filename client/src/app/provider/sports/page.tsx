"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Plus,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  ArrowRight,
  Search,
  Filter,
  Eye,
  Boxes,
  Ticket,
} from "lucide-react";
import { SportsService } from "@/services/sports.service";
import { formatCurrency } from "@/lib/format-currency";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function ProviderSportsPage() {
  const matches = SportsService.getAllMatches();
  const [search, setSearch] = useState("");

  const filtered = matches.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase())
  );

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
            <span className="font-semibold text-[#0F172A] dark:text-white">Stadium Sports</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Stadium Tournaments & Matchday Fixtures
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure turnstile gate entrances, tribune tiers (Bleachers, Covered, VIP), and team derbies.
          </p>
        </div>

        <Link
          href="/provider/sports/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule New Match</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-3 sm:p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search team, tournament or stadium..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#B45309]"
          />
        </div>

        <span className="text-xs text-slate-400">
          <strong>{filtered.length}</strong> fixtures scheduled
        </span>
      </div>

      {/* Fixtures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((match) => (
          <div
            key={match.id}
            className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {match.categoryDetails?.tournament || "League Fixture"}
                </span>
                <span className="text-xs font-black text-[#B45309] dark:text-amber-400">
                  From {formatCurrency(match.price)}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white line-clamp-1">
                  {match.title}
                </h3>
                {match.categoryDetails?.homeTeam && match.categoryDetails?.awayTeam && (
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mt-1">
                    {match.categoryDetails.homeTeam} vs {match.categoryDetails.awayTeam}
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{match.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{match.date} • {match.time}</span>
                </div>
                {match.categoryDetails?.stadiumGate && (
                  <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                    Turnstile: {match.categoryDetails.stadiumGate}
                  </div>
                )}
              </div>

              {/* Tiers Preview */}
              {match.tiers && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Tribune Passes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {match.tiers.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {t.name}: {formatCurrency(t.price)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-emerald-600">
                {match.availableSeats} Seats Available
              </span>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`/sports/${match.id}`}
                  target="_blank"
                  className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Preview</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <ActionDropdown
                  items={[
                    {
                      label: "View Fixture Listing",
                      icon: <Eye className="w-3.5 h-3.5" />,
                      href: `/provider/tickets/${match.id}`,
                    },
                    {
                      label: "Tribune Seat Inventory",
                      icon: <Boxes className="w-3.5 h-3.5" />,
                      href: `/provider/inventory`,
                    },
                    {
                      label: "Edit Match Passes",
                      icon: <Ticket className="w-3.5 h-3.5" />,
                      href: `/provider/tickets/${match.id}/edit`,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
