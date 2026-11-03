"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bus,
  Plus,
  Route,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { formatCurrency } from "@/lib/format-currency";

export default function ProviderBusHubPage() {
  const { busRoutes, busSchedules } = useProviderStore();

  const totalSeatsActive = busSchedules.reduce((acc, curr) => acc + curr.totalSeats, 0);
  const totalSeatsAvailable = busSchedules.reduce((acc, curr) => acc + curr.availableSeats, 0);
  const seatsOccupied = totalSeatsActive - totalSeatsAvailable;
  const occupancyRate = totalSeatsActive > 0 ? Math.round((seatsOccupied / totalSeatsActive) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/provider" className="hover:text-[#B45309]">
              Provider Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0F172A] dark:text-white">Bus Fleet Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Intercity Coach & Route Operations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage highway destinations, Scania/Yutong coach schedules, departure terminals, and seat reservations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/provider/bus/routes"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Route className="w-3.5 h-3.5" />
            <span>Manage Routes ({busRoutes.length})</span>
          </Link>

          <Link
            href="/provider/bus/schedules"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Schedule</span>
          </Link>
        </div>
      </div>

      {/* Fleet Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Highway Routes</span>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white">
            {busRoutes.length} Routes
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            All licensed & operational
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Scheduled Departures</span>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white">
            {busSchedules.length} Trips Today
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Autobus Tera & Lamberet</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Coach Seat Occupancy</span>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white">
            {occupancyRate}%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {seatsOccupied} / {totalSeatsActive} seats booked
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Live Active On-Trip</span>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white">
            {busSchedules.filter((s) => s.status === "BOARDING" || s.status === "ON_TRIP").length} Coaches
          </div>
          <Link
            href="/provider/bus/trips"
            className="text-[10px] font-bold text-[#B45309] dark:text-amber-400 hover:underline flex items-center gap-0.5"
          >
            <span>Live Trip Radar</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Operational Routes Grid */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] dark:text-white">
              Primary Highway Segments
            </h2>
            <p className="text-xs text-slate-400">Fixed fares and scheduled daily luxury coach runs</p>
          </div>
          <Link
            href="/provider/bus/routes"
            className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline"
          >
            Manage All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {busRoutes.map((rt) => (
            <div
              key={rt.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:border-[#B45309]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {rt.dailyTrips} Daily Trips
                </span>
                <span className="text-xs font-black text-[#B45309] dark:text-amber-400">
                  {formatCurrency(rt.fare)}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                  <span>{rt.origin}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B45309]" />
                  <span>{rt.destination}</span>
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Duration: {rt.duration} • {rt.busType}
                </span>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1">
                <div>Boarding: {rt.boardingStation}</div>
                <div>Dropoff: {rt.dropoffStation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Scheduled Departures List */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
              Upcoming Trip Schedules
            </h3>
            <p className="text-xs text-slate-400">Assigned coaches and driver dispatch info</p>
          </div>
          <Link
            href="/provider/bus/schedules"
            className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline"
          >
            Full Schedule Planner →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-50/50 dark:bg-slate-800/20">
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Departure Time</th>
                <th className="py-3 px-4">Coach Plate / Model</th>
                <th className="py-3 px-4">Assigned Driver</th>
                <th className="py-3 px-4">Seats Left</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {busSchedules.map((sch) => (
                <tr key={sch.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F172A] dark:text-white">
                    {sch.routeTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {sch.departureTime}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{sch.departureDate}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {sch.busPlateNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{sch.busType}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{sch.driverName}</span>
                    <span className="text-[10px] text-slate-400 block">{sch.driverPhone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#B45309] dark:text-amber-400">
                      {sch.availableSeats}
                    </span>
                    <span className="text-slate-400"> / {sch.totalSeats} seats</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        sch.status === "BOARDING"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                          : sch.status === "SCHEDULED"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {sch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
