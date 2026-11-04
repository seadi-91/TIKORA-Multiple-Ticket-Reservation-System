"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bus,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Navigation,
  RefreshCw,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";

export default function BusTripsPage() {
  const { busSchedules, updateBusSchedule } = useProviderStore();

  const [filter, setFilter] = useState<string>("ALL");

  const filtered = busSchedules.filter((s) => (filter === "ALL" ? true : s.status === filter));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/provider/bus" className="hover:text-[#B45309] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Bus Fleet</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0F172A] dark:text-white">Active Trips</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
            Live Highway Trip Radar & Gate Dispatch
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor real-time coach boarding, highway transit progress, and terminal arrival timings.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {["ALL", "SCHEDULED", "BOARDING", "ON_TRIP", "DELAYED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab
                  ? "bg-white dark:bg-[#161922] text-[#B45309] dark:text-amber-400 shadow-2xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-[#0F172A]"
              }`}
            >
              {tab === "ALL" ? "All Trips" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((trip) => {
          const bookedSeats = trip.totalSeats - trip.availableSeats;
          const pct = Math.round((bookedSeats / trip.totalSeats) * 100);

          return (
            <div
              key={trip.id}
              className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  {trip.busPlateNumber}
                </span>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    trip.status === "BOARDING"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200"
                      : trip.status === "ON_TRIP"
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"
                      : trip.status === "DELAYED"
                      ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                  }`}
                >
                  {trip.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                  {trip.routeTitle}
                </h3>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Departure: {trip.departureTime} • {trip.departureDate}
                </span>
              </div>

              {/* Passenger Gate Progress */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Boarding Check-In</span>
                  <span className="font-bold text-[#0F172A] dark:text-white">
                    {bookedSeats} / {trip.totalSeats} Checked ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B45309] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Driver Contact */}
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                <span>Driver: {trip.driverName}</span>
                <span className="font-mono text-slate-400">{trip.driverPhone}</span>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => updateBusSchedule(trip.id, { status: "BOARDING" })}
                  className="flex-1 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:border-[#B45309] transition-colors"
                >
                  Boarding Gate
                </button>
                <button
                  onClick={() => updateBusSchedule(trip.id, { status: "ON_TRIP" })}
                  className="flex-1 py-1.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-[11px] font-bold text-white transition-colors"
                >
                  Depart Coach
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
