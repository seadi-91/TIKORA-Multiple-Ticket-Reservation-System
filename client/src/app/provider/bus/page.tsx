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
  Copy,
  Eye,
  MoreVertical,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { formatCurrency } from "@/lib/format-currency";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { toast } from "sonner";

export default function ProviderBusHubPage() {
  const { busRoutes, busSchedules } = useProviderStore();

  const totalSeatsActive = busSchedules.reduce((acc, curr) => acc + curr.totalSeats, 0);
  const totalSeatsAvailable = busSchedules.reduce((acc, curr) => acc + curr.availableSeats, 0);
  const seatsOccupied = totalSeatsActive - totalSeatsAvailable;
  const occupancyRate = totalSeatsActive > 0 ? Math.round((seatsOccupied / totalSeatsActive) * 100) : 0;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
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
            Manage highway destinations, coach schedules, departure terminals, and seat reservations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

      {/* Fleet Metric Stats - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 truncate">
              Active Routes
            </span>
            <Route className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#0F172A] dark:text-white">
            {busRoutes.length} Routes
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block truncate">
            All licensed & operational
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 truncate">
              Departures
            </span>
            <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#0F172A] dark:text-white">
            {busSchedules.length} Trips
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate">
            Autobus Tera & Lamberet
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 truncate">
              Occupancy Rate
            </span>
            <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#0F172A] dark:text-white">
            {occupancyRate}%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block truncate">
            {seatsOccupied} / {totalSeatsActive} booked
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 truncate">
              Active On-Trip
            </span>
            <Bus className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#0F172A] dark:text-white">
            {busSchedules.filter((s) => s.status === "BOARDING" || s.status === "ON_TRIP").length} Coaches
          </div>
          <Link
            href="/provider/bus/trips"
            className="text-[10px] font-bold text-[#B45309] dark:text-amber-400 hover:underline flex items-center gap-0.5 truncate"
          >
            <span>Trip Radar</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Operational Routes Grid */}
      <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] dark:text-white">
              Primary Highway Segments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fixed fares and scheduled daily luxury coach runs
            </p>
          </div>
          <Link
            href="/provider/bus/routes"
            className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline"
          >
            Manage All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {busRoutes.map((rt) => (
            <div
              key={rt.id}
              className="p-4 rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40 space-y-3 hover:border-[#B45309]/30 transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300">
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

              <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 space-y-1">
                <div className="truncate">Boarding: {rt.boardingStation}</div>
                <div className="truncate">Dropoff: {rt.dropoffStation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Scheduled Departures List */}
      <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-white">
              Upcoming Trip Schedules
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assigned coaches and driver dispatch info
            </p>
          </div>
          <Link
            href="/provider/bus/schedules"
            className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline"
          >
            Full Planner →
          </Link>
        </div>

        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider bg-slate-50/50 dark:bg-slate-800/20">
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Departure Time</th>
                <th className="py-3 px-4">Coach Plate / Model</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Seats Left</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs">
              {busSchedules.map((sch) => (
                <tr
                  key={sch.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-[#0F172A] dark:text-white">
                    {sch.routeTitle}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {sch.departureTime}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{sch.departureDate}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {sch.busPlateNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{sch.busType}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {sch.driverName}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{sch.driverPhone}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#B45309] dark:text-amber-400">
                      {sch.availableSeats}
                    </span>
                    <span className="text-slate-400"> / {sch.totalSeats} seats</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                        sch.status === "BOARDING"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : sch.status === "SCHEDULED"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {sch.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <ActionDropdown
                      items={[
                        {
                          label: "View Schedule",
                          icon: <Eye className="w-3.5 h-3.5" />,
                          href: `/provider/bus/schedules`,
                        },
                        {
                          label: "Copy Plate Number",
                          icon: <Copy className="w-3.5 h-3.5" />,
                          onClick: () => handleCopy(sch.busPlateNumber, "Plate number"),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: High-End Trip Cards */}
        <div className="block md:hidden p-3 space-y-2.5">
          {busSchedules.map((sch) => (
            <div
              key={sch.id}
              className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-[#0F172A] dark:text-white">
                  {sch.routeTitle}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    sch.status === "BOARDING"
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      : sch.status === "SCHEDULED"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {sch.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Departure</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{sch.departureTime}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Coach / Plate</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{sch.busPlateNumber}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Driver</span>
                  <span>{sch.driverName}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Seats Available</span>
                  <span className="font-bold text-[#B45309] dark:text-amber-400">{sch.availableSeats}</span>
                  <span className="text-[10px]"> / {sch.totalSeats}</span>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                <ActionDropdown
                  items={[
                    {
                      label: "View Schedule",
                      icon: <Eye className="w-3.5 h-3.5" />,
                      href: `/provider/bus/schedules`,
                    },
                    {
                      label: "Copy Plate Number",
                      icon: <Copy className="w-3.5 h-3.5" />,
                      onClick: () => handleCopy(sch.busPlateNumber, "Plate number"),
                    },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
