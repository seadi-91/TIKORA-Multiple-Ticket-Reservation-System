"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bus,
  MapPin,
  Calendar,
  Search,
  ShieldCheck,
  Wifi,
  Zap,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { BusService } from "@/services/bus.service";
import { ETHIOPIAN_CITIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/format-currency";

export default function BusLandingPage() {
  const router = useRouter();
  const [fromCity, setFromCity] = useState("Addis Ababa");
  const [toCity, setToCity] = useState("Hawassa");
  const [departureDate, setDepartureDate] = useState("2026-11-15");
  const [passengers, setPassengers] = useState(1);

  const buses = BusService.getAllBuses();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/bus/search?from=${fromCity}&to=${toCity}&date=${departureDate}&pax=${passengers}`);
  };

  const popularRoutes = [
    { from: "Addis Ababa", to: "Hawassa", duration: "4h 30m", price: 650, operator: "Selam Bus", dailyTrips: "8 Trips/Day" },
    { from: "Addis Ababa", to: "Bahir Dar", duration: "9h 15m", price: 950, operator: "Abay Bus", dailyTrips: "6 Trips/Day" },
    { from: "Addis Ababa", to: "Dire Dawa", duration: "7h 45m", price: 850, operator: "Golden Bus", dailyTrips: "4 Trips/Day" },
    { from: "Addis Ababa", to: "Adama", duration: "1h 15m", price: 250, operator: "Sky Bus", dailyTrips: "Hourly Express" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      {/* Hero Bus Search */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-[#FFFBEB]/60 dark:from-emerald-950/20 to-transparent border-b border-[#E2E8F0] dark:border-slate-800">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFBEB] dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-slate-700/60">
            <Bus className="w-4 h-4" />
            <span>Intercity Bus Fleet Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Book Intercity Express Bus Tickets Across Ethiopia
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-2xl mx-auto">
            Choose your window or aisle seat, review amenities, and travel comfortably with Ethiopia&apos;s most reputable licensed operators.
          </p>

          {/* Bus Search Box */}
          <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-5 sm:p-6 shadow-xl max-w-4xl mx-auto text-left">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              {/* Origin */}
              <div className="sm:col-span-3">
                <label className="block text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 mb-1">
                  From (Origin)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#F59E0B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                  >
                    {ETHIOPIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination */}
              <div className="sm:col-span-3">
                <label className="block text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 mb-1">
                  To (Destination)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#F59E0B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                  >
                    {ETHIOPIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="sm:col-span-3">
                <label className="block text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 mb-1">
                  Departure Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              {/* CTA */}
              <div className="sm:col-span-3 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Buses</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Bus Routes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full space-y-6">
        <div>
          <span className="text-xs font-bold text-[#F59E0B] dark:text-amber-400 uppercase tracking-wider">
            Most Traveled Highways
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white mt-1">
            Popular Intercity Bus Routes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRoutes.map((route, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 hover:border-[#F59E0B] transition-all shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] dark:text-amber-300">
                  {route.operator}
                </span>
                <span className="text-[10px] text-[#64748B] dark:text-amber-400/60 font-semibold">{route.dailyTrips}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                  <span>{route.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{route.to}</span>
                </h3>
                <span className="text-xs text-[#64748B] dark:text-amber-300/70 block mt-1">Duration: {route.duration}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
                <span className="text-sm font-bold text-[#F59E0B] dark:text-amber-400">
                  {formatCurrency(route.price)}
                </span>
                <Link
                  href={`/bus/search?from=${route.from}&to=${route.to}`}
                  className="text-xs font-bold text-[#F59E0B] dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Book</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available Daily Express Buses */}
      <section className="bg-white dark:bg-[#12141C] border-t border-[#E2E8F0] dark:border-slate-800 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#F59E0B] dark:text-amber-400 uppercase tracking-wider">
                Daily Departures
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white mt-1">
                Featured Coach Services
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {buses.map((bus) => (
              <TicketCard key={bus.id} ticket={bus} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
