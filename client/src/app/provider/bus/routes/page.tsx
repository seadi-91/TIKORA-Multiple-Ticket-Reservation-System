"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  ArrowRight,
  MapPin,
  Clock,
  Trash2,
  Edit,
  Search,
  ArrowLeft,
  X,
} from "lucide-react";
import { useProviderStore, BusRouteItem } from "@/stores/provider.store";
import { formatCurrency } from "@/lib/format-currency";
import { ETHIOPIAN_CITIES } from "@/lib/constants";

export default function BusRoutesPage() {
  const { busRoutes, addBusRoute, updateBusRoute, deleteBusRoute } = useProviderStore();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<BusRouteItem | null>(null);

  const [formData, setFormData] = useState({
    origin: "Addis Ababa",
    destination: "Hawassa",
    boardingStation: "Autobus Tera Gate 3",
    dropoffStation: "Hawassa Main Piazza",
    departureTime: "06:00 AM",
    arrivalTime: "10:30 AM",
    duration: "4h 30m",
    operatingDays: "Daily Express",
    fare: 650,
    busType: "Scania VIP Luxury Coach",
    dailyTrips: 6,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const filteredRoutes = busRoutes.filter(
    (r) =>
      r.origin.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase()) ||
      r.boardingStation.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingRoute(null);
    setFormData({
      origin: "Addis Ababa",
      destination: "Hawassa",
      boardingStation: "Autobus Tera Gate 3",
      dropoffStation: "Hawassa Main Piazza",
      departureTime: "06:00 AM",
      arrivalTime: "10:30 AM",
      duration: "4h 30m",
      operatingDays: "Daily Express",
      fare: 650,
      busType: "Scania VIP Luxury Coach",
      dailyTrips: 6,
      status: "ACTIVE",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (rt: BusRouteItem) => {
    setEditingRoute(rt);
    setFormData({
      origin: rt.origin,
      destination: rt.destination,
      boardingStation: rt.boardingStation,
      dropoffStation: rt.dropoffStation,
      departureTime: rt.departureTime,
      arrivalTime: rt.arrivalTime,
      duration: rt.duration,
      operatingDays: rt.operatingDays,
      fare: rt.fare,
      busType: rt.busType,
      dailyTrips: rt.dailyTrips,
      status: rt.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoute) {
      updateBusRoute(editingRoute.id, formData);
    } else {
      addBusRoute(formData);
    }
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
            <span className="font-semibold text-[#0F172A] dark:text-white">Routes Catalog</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Intercity Bus Routes & Tariff Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure highway origins, destinations, terminal boarding gates, and ticket prices in ETB.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Highway Route</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search city, terminal or station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#B45309]"
          />
        </div>

        <span className="text-xs text-slate-400">
          Showing <strong>{filteredRoutes.length}</strong> active routes
        </span>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoutes.map((rt) => (
          <div
            key={rt.id}
            className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {rt.dailyTrips} Daily Trips
                </span>
                <span className="text-sm font-black text-[#B45309] dark:text-amber-400">
                  {formatCurrency(rt.fare)}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                  <span>{rt.origin}</span>
                  <ArrowRight className="w-4 h-4 text-[#B45309]" />
                  <span>{rt.destination}</span>
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                  Est. Duration: {rt.duration} • {rt.busType}
                </span>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">Board: {rt.boardingStation}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3 h-3 text-[#B45309] shrink-0" />
                  <span className="truncate">Drop: {rt.dropoffStation}</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Departs: {rt.departureTime}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Active Route
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(rt)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#B45309] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit Route"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete route ${rt.origin} → ${rt.destination}?`)) {
                      deleteBusRoute(rt.id);
                    }
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Delete Route"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Route Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                {editingRoute ? "Edit Highway Route" : "Create New Bus Route"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Origin City
                  </label>
                  <select
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  >
                    {ETHIOPIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Destination City
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  >
                    {ETHIOPIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Boarding Station
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autobus Tera Gate 3"
                    value={formData.boardingStation}
                    onChange={(e) => setFormData({ ...formData, boardingStation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Dropoff Station
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hawassa Piazza Terminal"
                    value={formData.dropoffStation}
                    onChange={(e) => setFormData({ ...formData, dropoffStation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Fare (ETB)
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={formData.fare}
                    onChange={(e) => setFormData({ ...formData, fare: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4h 30m"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Departure Time
                  </label>
                  <input
                    type="text"
                    placeholder="06:00 AM"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Coach Specification / Bus Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. Scania VIP 48-Seat Luxury Coach"
                  value={formData.busType}
                  onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                />
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
                  {editingRoute ? "Save Route Changes" : "Save & Activate Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
