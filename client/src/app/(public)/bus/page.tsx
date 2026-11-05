"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Search,
  ArrowLeftRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { BusService } from "@/services/bus.service";
import { ETHIOPIAN_CITIES } from "@/lib/constants";

export default function BusLandingPage() {
  const router = useRouter();
  const [fromCity, setFromCity] = useState("Addis Ababa");
  const [toCity, setToCity] = useState("Hawassa");
  const [departureDate, setDepartureDate] = useState("2026-11-15");
  const [selectedOperator, setSelectedOperator] = useState<string>("ALL");

  const buses = BusService.getAllBuses();

  const handleSwapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/bus/search?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(
        toCity
      )}&date=${departureDate}`
    );
  };

  const operators = ["ALL", "Selam Bus Line SC", "Abay Bus Transport", "Golden Bus Transport", "Sky Bus Ethiopia"];

  const filteredBuses = buses.filter((b) => {
    if (selectedOperator !== "ALL" && b.organizer !== selectedOperator) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0D13] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-5 w-full space-y-4">
        {/* Compact Search Bar */}
        <div className="rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-xs">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
            {/* Origin */}
            <div className="sm:col-span-4">
              <label className="block text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                From
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-[#0C0E14] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                >
                  {ETHIOPIAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap */}
            <div className="sm:col-span-1 flex items-center justify-center">
              <button
                type="button"
                onClick={handleSwapCities}
                title="Swap"
                className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Destination */}
            <div className="sm:col-span-4">
              <label className="block text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                To
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-[#0C0E14] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                >
                  {ETHIOPIAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="sm:col-span-2">
              <label className="block text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-[#0C0E14] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Search CTA */}
            <div className="sm:col-span-1">
              <button
                type="submit"
                aria-label="Search Buses"
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center cursor-pointer h-[35px]"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Filter Chips & Live Count */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {operators.map((op) => (
              <button
                key={op}
                onClick={() => setSelectedOperator(op)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all shrink-0 cursor-pointer ${
                  selectedOperator === op
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs"
                    : "bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                {op === "ALL" ? "All Fleets" : op.split(" ")[0]}
              </button>
            ))}
          </div>

          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold shrink-0">
            {filteredBuses.length} Buses
          </span>
        </div>

        {/* Direct Compact Ticket Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
          {filteredBuses.map((bus) => (
            <TicketCard key={bus.id} ticket={bus} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
