"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Film,
  Plus,
  Clock,
  Star,
  Search,
  Trash2,
  Edit,
  ArrowLeft,
  X,
  CheckCircle2,
} from "lucide-react";
import { CinemaService } from "@/services/cinema.service";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function ProviderMoviesCatalogPage() {
  const initialMovies = CinemaService.getAllMovies();
  const [moviesList, setMoviesList] = useState(initialMovies);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    genre: "Action / Adventure",
    duration: "2h 15m",
    rating: "PG-13",
    screenFormat: "4K Laser Dolby Atmos",
    description: "",
  });

  const filtered = moviesList.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.categoryDetails?.movieGenre?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    const newMovie: any = {
      id: `mov-${Date.now()}`,
      title: formData.title,
      category: "CINEMA",
      organizer: "Century Cinema Megaplex",
      location: "Century Mall, Gurd Shola",
      city: "Addis Ababa",
      date: "2026-11-15",
      time: "02:30 PM",
      price: 280,
      currency: "ETB",
      availableSeats: 120,
      totalSeats: 120,
      status: "AVAILABLE",
      duration: formData.duration,
      description: formData.description,
      categoryDetails: {
        movieGenre: formData.genre,
        movieRating: formData.rating,
        screenFormat: formData.screenFormat,
        movieHall: "Hall 1",
      },
    };

    setMoviesList([newMovie, ...moviesList]);
    setModalOpen(false);
    setFormData({
      title: "",
      genre: "Action / Adventure",
      duration: "2h 15m",
      rating: "PG-13",
      screenFormat: "4K Laser Dolby Atmos",
      description: "",
    });
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
            <span className="font-semibold text-[#0F172A] dark:text-white">Movie Catalog</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Movie Titles & Screening Features
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage licensed theatrical titles, runtime durations, age ratings, and digital screening formats.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Movie Feature</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-3 sm:p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search movie title or genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#B45309]"
          />
        </div>

        <span className="text-xs text-slate-400">
          <strong>{filtered.length}</strong> movies listed
        </span>
      </div>

      {/* Movie Catalog Table */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                <th className="py-3.5 px-4">Movie Title</th>
                <th className="py-3.5 px-4">Genre & Category</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Screen Format</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {m.title}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {m.categoryDetails?.movieGenre || "Action"}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-muted-foreground">
                    {m.duration}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-[10px] text-foreground">
                      {m.categoryDetails?.movieRating || "PG-13"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {m.categoryDetails?.screenFormat || "4K Laser"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end">
                      <ActionDropdown
                        items={[
                          {
                            label: "Schedule Showtime",
                            icon: <Clock className="w-3.5 h-3.5" />,
                            href: `/provider/cinema/showtimes`,
                          },
                          {
                            label: "Cinema Overview",
                            icon: <Film className="w-3.5 h-3.5" />,
                            href: `/provider/cinema`,
                          },
                          {
                            label: "Remove Movie",
                            icon: <Trash2 className="w-3.5 h-3.5" />,
                            variant: "danger",
                            onClick: () => {
                              if (confirm(`Remove "${m.title}" from catalog?`)) {
                                setMoviesList(moviesList.filter((item) => item.id !== m.id));
                              }
                            },
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
                Add Movie Title to Catalog
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMovie} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Movie Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wicked: Part 1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Genre
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Runtime Duration
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2h 40m"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Audience Rating
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  >
                    <option value="G">General (G)</option>
                    <option value="PG">Parental Guidance (PG)</option>
                    <option value="PG-13">Parents Strongly Cautioned (PG-13)</option>
                    <option value="R">Restricted (R)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Screen Format
                  </label>
                  <select
                    value={formData.screenFormat}
                    onChange={(e) => setFormData({ ...formData, screenFormat: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  >
                    <option value="4K Laser Dolby Atmos">4K Laser Dolby Atmos</option>
                    <option value="IMAX Laser 3D">IMAX Laser 3D</option>
                    <option value="Standard Digital 2D">Standard Digital 2D</option>
                    <option value="VIP Recliner Suite">VIP Recliner Suite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Plot Synopsis
                </label>
                <textarea
                  rows={2}
                  placeholder="Short movie description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
