"use client";

import React, { useState, Suspense } from "react";
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
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BusService } from "@/services/bus.service";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";

function BusSearchContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "Addis Ababa";
  const to = searchParams.get("to") || "Hawassa";
  const date = searchParams.get("date") || "2026-11-15";

  const allBuses = BusService.getAllBuses();
  const [operatorFilter, setOperatorFilter] = useState("ALL");

  const filteredBuses = allBuses.filter((b) => {
    if (operatorFilter !== "ALL" && b.organizer !== operatorFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 w-full">
      {/* Search Header */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#F59E0B] dark:text-amber-400 uppercase tracking-wider">
            Bus Search Results
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white flex items-center gap-2 mt-1">
            <span>{from}</span>
            <ArrowRight className="w-5 h-5 text-[#F59E0B]" />
            <span>{to}</span>
          </h1>
          <p className="text-xs text-[#64748B] dark:text-amber-300/70 mt-1">
            Departure Date: <strong className="text-[#0F172A] dark:text-white">{formatDate(date)}</strong> • {filteredBuses.length} Coaches Available
          </p>
        </div>

        <Link
          href="/bus"
          className="text-xs font-bold text-[#F59E0B] dark:text-amber-400 hover:underline"
        >
          Modify Route Search
        </Link>
      </div>

      {/* Operator Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-[#64748B] dark:text-amber-400/60 flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Operator:</span>
        </span>
        {["ALL", "Selam Bus Line SC", "Abay Bus Transport", "Golden Bus Transport", "Sky Bus Ethiopia"].map((op) => (
          <button
            key={op}
            onClick={() => setOperatorFilter(op)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              operatorFilter === op
                ? "bg-[#F59E0B] text-white shadow-xs"
                : "bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-[#64748B] hover:text-[#0F172A] dark:text-amber-300"
            }`}
          >
            {op === "ALL" ? "All Operators" : op}
          </button>
        ))}
      </div>

      {/* Bus Cards List */}
      <div className="space-y-4">
        {filteredBuses.map((bus) => (
          <div
            key={bus.id}
            className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            {/* Left: Operator & Route */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#F59E0B] dark:text-amber-300 px-2.5 py-1 rounded-md bg-[#FFFBEB] dark:bg-amber-950">
                  {bus.organizer}
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-amber-400/70 font-semibold">
                  {bus.categoryDetails?.busType}
                </span>
                {bus.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                    {bus.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                  {bus.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B] dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1 font-semibold text-[#0F172A] dark:text-white">
                    <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Departure: {bus.time}</span>
                  </span>
                  <span>Duration: {bus.duration}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Boarding: {bus.categoryDetails?.boardingStation}</span>
                  </span>
                </div>
              </div>

              {/* Amenities */}
              {bus.amenities && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {bus.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 dark:bg-[#0C0E14] text-[#64748B] dark:text-amber-300/80 border border-[#E2E8F0] dark:border-slate-800"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Fare & Seat Selection CTA */}
            <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-[#E2E8F0] dark:border-slate-800 gap-3">
              <div className="text-left md:text-right">
                <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 block">
                  Per Passenger Fare
                </span>
                <span className="text-2xl font-black text-[#F59E0B] dark:text-amber-400">
                  {formatCurrency(bus.price)}
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-amber-300 block font-medium">
                  {bus.availableSeats} seats remaining
                </span>
              </div>

              <Link
                href={`/bus/${bus.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <span>Select Seats</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BusSearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-xs text-[#64748B]">Loading bus routes...</div>}>
          <BusSearchContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
