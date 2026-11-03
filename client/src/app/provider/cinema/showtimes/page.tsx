"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Film,
  Plus,
  Clock,
  Calendar,
  Search,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { formatCurrency } from "@/lib/format-currency";

export default function CinemaShowtimesPage() {
  const { movieShowtimes, addMovieShowtime, updateMovieShowtime } = useProviderStore();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    movieTitle: "Gladiator II: Ethiopian Premiere",
    genre: "Historical Action / Drama",
    duration: "2h 28m",
    rating: "PG-13",
    hallName: "Hall 1 (Century Cinema Megaplex)",
    screenFormat: "4K Laser Dolby Atmos",
    date: "2026-11-15",
    time: "08:15 PM",
    price: 320,
    vipPrice: 450,
    totalSeats: 120,
    bookedSeats: 0,
    status: "ACTIVE" as const,
  });

  const filtered = movieShowtimes.filter(
    (s) =>
      s.movieTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.hallName.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateShowtime = (e: React.FormEvent) => {
    e.preventDefault();
    addMovieShowtime(formData);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/provider/cinema" className="hover:text-[#B45309] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cinema</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0F172A] dark:text-white">Showtimes Scheduler</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Daily Cinema Showtimes & Screen Schedule
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Assign movie premieres to theater halls, set timeslots, and track seat matrix occupancy.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Showtime Schedule</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-3 sm:p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search movie or hall..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#B45309]"
          />
        </div>

        <span className="text-xs text-slate-400">
          <strong>{filtered.length}</strong> showtimes scheduled
        </span>
      </div>

      {/* Showtimes Table */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-50/50 dark:bg-slate-800/20">
                <th className="py-3 px-4">Movie Title</th>
                <th className="py-3 px-4">Theater Hall / Format</th>
                <th className="py-3 px-4">Screening Date & Time</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Booked Capacity</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F172A] dark:text-white">
                    {s.movieTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                      {s.hallName}
                    </span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                      {s.screenFormat}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0F172A] dark:text-white block">
                      {s.time}
                    </span>
                    <span className="text-[10px] text-slate-400">{s.date}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#B45309] dark:text-amber-400 block">
                      Standard: {formatCurrency(s.price)}
                    </span>
                    <span className="text-[10px] text-slate-400">VIP: {formatCurrency(s.vipPrice)}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{
                            width: `${Math.round((s.bookedSeats / s.totalSeats) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="font-bold text-xs">
                        {s.bookedSeats}/{s.totalSeats}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        const newStatus = s.status === "ACTIVE" ? "SOLD_OUT" : "ACTIVE";
                        updateMovieShowtime(s.id, { status: newStatus });
                      }}
                      className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      Toggle
                    </button>
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
                Add Movie Showtime
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateShowtime} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Movie Feature
                </label>
                <input
                  type="text"
                  required
                  value={formData.movieTitle}
                  onChange={(e) => setFormData({ ...formData, movieTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Screen Hall
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hallName}
                    onChange={(e) => setFormData({ ...formData, hallName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Screen Format
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.screenFormat}
                    onChange={(e) => setFormData({ ...formData, screenFormat: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Standard Price (ETB)
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-[#B45309]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    VIP Price (ETB)
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={formData.vipPrice}
                    onChange={(e) => setFormData({ ...formData, vipPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-purple-600"
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
                  Schedule Showtime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
