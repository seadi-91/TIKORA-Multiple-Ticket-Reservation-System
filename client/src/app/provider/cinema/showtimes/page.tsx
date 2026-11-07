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
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function CinemaShowtimesPage() {
  const { movieShowtimes, addMovieShowtime, updateMovieShowtime, organization } = useProviderStore();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    movieTitle: "",
    genre: "Action / Adventure",
    duration: "2h 00m",
    rating: "PG-13",
    hallName: `Hall 1 (${organization.name})`,
    screenFormat: "4K Laser Dolby Atmos",
    date: "2026-11-20",
    time: "07:30 PM",
    price: 300,
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
          <h1 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
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
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                <th className="py-3.5 px-4">Movie Title</th>
                <th className="py-3.5 px-4">Theater Hall / Format</th>
                <th className="py-3.5 px-4">Screening Date & Time</th>
                <th className="py-3.5 px-4">Pricing</th>
                <th className="py-3.5 px-4">Booked Capacity</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 px-4 text-center text-xs text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="font-semibold text-foreground text-sm">No showtimes scheduled</p>
                    <p className="text-[11px] mt-1 max-w-sm mx-auto text-muted-foreground">
                      No showtimes match your search or none have been assigned yet. Click &quot;Add Showtime&quot; above to schedule movie screenings.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                <tr key={s.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {s.movieTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-foreground block">
                      {s.hallName}
                    </span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                      {s.screenFormat}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-foreground block">
                      {s.time}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{s.date}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-amber-600 dark:text-amber-400 block font-mono">
                      Standard: {formatCurrency(s.price)}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">VIP: {formatCurrency(s.vipPrice)}</span>
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
                      <span className="font-bold text-xs font-mono">
                        {s.bookedSeats}/{s.totalSeats}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end">
                      <ActionDropdown
                        items={[
                          {
                            label:
                              s.status === "ACTIVE"
                                ? "Mark as Sold Out"
                                : "Mark as Active",
                            icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                            variant: s.status === "ACTIVE" ? "warning" : "success",
                            onClick: () => {
                              const newStatus =
                                s.status === "ACTIVE" ? "SOLD_OUT" : "ACTIVE";
                              updateMovieShowtime(s.id, { status: newStatus });
                            },
                          },
                          {
                            label: "Movie Catalog",
                            icon: <Film className="w-3.5 h-3.5" />,
                            href: `/provider/cinema/movies`,
                          },
                          {
                            label: "Cinema Dashboard",
                            icon: <Clock className="w-3.5 h-3.5" />,
                            href: `/provider/cinema`,
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
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
