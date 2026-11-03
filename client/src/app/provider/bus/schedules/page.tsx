"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Plus,
  Bus,
  Search,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X,
  Phone,
  Filter,
} from "lucide-react";
import { useProviderStore, BusScheduleItem } from "@/stores/provider.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function BusSchedulesPage() {
  const { busRoutes, busSchedules, addBusSchedule, updateBusSchedule } = useProviderStore();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    routeId: busRoutes[0]?.id || "rt-1",
    busPlateNumber: "ET-3-88910-AA",
    busType: "Scania VIP (48 Seats)",
    departureDate: "2026-11-15",
    departureTime: "06:00 AM",
    totalSeats: 48,
    availableSeats: 48,
    driverName: "Yonas Gebre",
    driverPhone: "+251 91 122 3344",
    status: "SCHEDULED" as const,
  });

  const filteredSchedules = busSchedules.filter(
    (s) =>
      s.routeTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.busPlateNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.driverName.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const route = busRoutes.find((r) => r.id === formData.routeId);
    const routeTitle = route ? `${route.origin} → ${route.destination}` : "Custom Route";

    addBusSchedule({
      ...formData,
      routeTitle,
    });

    setModalOpen(false);
  };

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
            <span className="font-semibold text-[#0F172A] dark:text-white">Trip Schedules</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Daily Coach Dispatch Schedules
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Assign licensed drivers, vehicle plate numbers, and seat capacity to specific departure dates.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Daily Schedule</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-3 sm:p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search route, driver or plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#B45309]"
          />
        </div>

        <span className="text-xs text-slate-400">
          <strong>{filteredSchedules.length}</strong> departures scheduled
        </span>
      </div>

      {/* Schedules Table */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                <th className="py-3.5 px-4">Highway Route</th>
                <th className="py-3.5 px-4">Departure Timing</th>
                <th className="py-3.5 px-4">Coach Vehicle</th>
                <th className="py-3.5 px-4">Driver Contact</th>
                <th className="py-3.5 px-4">Seat Inventory</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
              {filteredSchedules.map((sch) => (
                <tr key={sch.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {sch.routeTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-foreground block">
                      {sch.departureTime}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{sch.departureDate}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-bold text-foreground block">
                      {sch.busPlateNumber}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{sch.busType}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-foreground block">
                      {sch.driverName}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{sch.driverPhone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-600 rounded-full"
                          style={{
                            width: `${Math.round(
                              ((sch.totalSeats - sch.availableSeats) / sch.totalSeats) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="font-bold text-xs text-amber-600 dark:text-amber-400 font-mono">
                        {sch.availableSeats} left
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                        sch.status === "BOARDING"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60"
                      }`}
                    >
                      {sch.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end">
                      <ActionDropdown
                        items={[
                          {
                            label:
                              sch.status === "SCHEDULED"
                                ? "Open Boarding Gate"
                                : "Mark As Scheduled",
                            icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                            variant: sch.status === "SCHEDULED" ? "success" : "warning",
                            onClick: () => {
                              const newStatus =
                                sch.status === "SCHEDULED" ? "BOARDING" : "SCHEDULED";
                              updateBusSchedule(sch.id, { status: newStatus });
                            },
                          },
                          {
                            label: "View Trip Radar",
                            icon: <Bus className="w-3.5 h-3.5" />,
                            href: `/provider/bus/trips`,
                          },
                          {
                            label: "Route Details",
                            icon: <Clock className="w-3.5 h-3.5" />,
                            href: `/provider/bus/routes`,
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                Add Trip Schedule
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Select Highway Route
                </label>
                <select
                  value={formData.routeId}
                  onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                >
                  {busRoutes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.origin} → {r.destination} ({r.departureTime})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Bus Plate Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ET-3-88910-AA"
                    value={formData.busPlateNumber}
                    onChange={(e) => setFormData({ ...formData, busPlateNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Coach Capacity
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={70}
                    value={formData.totalSeats}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalSeats: Number(e.target.value),
                        availableSeats: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Departure Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="06:00 AM"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Driver Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yonas Gebre"
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Driver Phone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+251 91 122 3344"
                    value={formData.driverPhone}
                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
