"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Bus,
  MapPin,
  Clock,
  Wifi,
  ShieldCheck,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  Armchair,
  Check,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { BusService } from "@/services/bus.service";
import { TicketService } from "@/services/ticket.service";
import { TicketItem } from "@/types/ticket.types";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";

function BusSearchContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "Addis Ababa";
  const to = searchParams.get("to") || "Hawassa";
  const date = searchParams.get("date") || "2026-11-15";

  const [mounted, setMounted] = useState(false);
  const [buses, setBuses] = useState<TicketItem[]>([]);
  const [operatorFilter, setOperatorFilter] = useState("ALL");

  useEffect(() => {
    setMounted(true);
    const cached = BusService.getAllBuses();
    if (cached && cached.length > 0) {
      setBuses(cached);
    }
    TicketService.fetchTickets().then(() => {
      setBuses(BusService.getAllBuses());
    });
  }, []);

  const filteredBuses = buses.filter((b) => {
    if (operatorFilter !== "ALL" && b.organizer !== operatorFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6 w-full">
      {/* Search Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200/60 dark:border-blue-800/40">
            <Bus className="w-3.5 h-3.5" />
            <span>Bus Search Results</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <span>{from}</span>
            <ArrowRight className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{to}</span>
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Departure Date: <strong className="text-slate-800 dark:text-slate-200">{formatDate(date)}</strong> •{" "}
            <span className="text-amber-600 dark:text-amber-400 font-semibold">{filteredBuses.length} Coaches Available</span>
          </p>
        </div>

        <Link
          href="/bus"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Modify Route Search</span>
        </Link>
      </div>

      {/* Operator Filter Chips */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 shrink-0">
          Operator:
        </span>
        {["ALL", "Selam Bus Line SC", "Abay Bus Transport", "Golden Bus Transport", "Sky Bus Ethiopia"].map((op) => (
          <button
            key={op}
            onClick={() => setOperatorFilter(op)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all shrink-0 cursor-pointer ${
              operatorFilter === op
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs"
                : "bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            {op === "ALL" ? "All Fleets" : op}
          </button>
        ))}
      </div>

      {/* Bus Cards Compact Grid */}
      {!mounted ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-2xl aspect-[4/3] bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200/50 dark:border-slate-800/50 min-h-[220px]"
            />
          ))}
        </div>
      ) : filteredBuses.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-white dark:bg-[#161922] border border-dashed border-slate-300 dark:border-slate-800 space-y-1">
          <p className="text-xs font-bold text-slate-800 dark:text-white">No buses found</p>
          <p className="text-[10px] text-slate-500">Try selecting another operator or reset filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredBuses.map((bus) => (
            <TicketCard key={bus.id} ticket={bus} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BusSearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0D13] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading bus routes...</div>}>
          <BusSearchContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
