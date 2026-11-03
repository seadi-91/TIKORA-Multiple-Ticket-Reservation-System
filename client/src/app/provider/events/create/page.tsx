"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { ETHIOPIAN_CITIES } from "@/lib/constants";

export default function CreateEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [eventCategory, setEventCategory] = useState("Music & Concert");
  const [city, setCity] = useState("Addis Ababa");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("2026-11-20");
  const [time, setTime] = useState("06:00 PM");
  const [description, setDescription] = useState("");
  const [tiers, setTiers] = useState([
    { name: "Early Bird General Pass", price: 350, capacity: 500 },
    { name: "VIP Front Stage Pass", price: 850, capacity: 200 },
    { name: "VVIP Reserved Table", price: 2500, capacity: 40 },
  ]);

  const handleAddTier = () => {
    setTiers([...tiers, { name: "Special Pass", price: 500, capacity: 100 }]);
  };

  const handleRemoveTier = (idx: number) => {
    setTiers(tiers.filter((_, i) => i !== idx));
  };

  const handleTierChange = (index: number, field: string, val: any) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: val };
    setTiers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Event "${title}" published successfully!`);
    router.push("/provider/events");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Link href="/provider/events" className="hover:text-[#B45309] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Events</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0F172A] dark:text-white">Create New Event</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
          Publish Concert, Festival or Conference
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Define venue logistics, date/time, tiered ticket allocations, and automated QR gate access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B45309]" />
            <span>Event General Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Event Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Addis International Jazz & Afrobeat Festival"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#B45309]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Category
              </label>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
              >
                <option value="Music & Concert">Music & Live Concert</option>
                <option value="Technology & Summit">Technology & Summit</option>
                <option value="Cultural Festival">Cultural Festival</option>
                <option value="Comedy Show">Standup Comedy Show</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Host City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
              >
                {ETHIOPIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Venue Name & Precise Address
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Millennium Hall Main Arena, Bole Subcity"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Event Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Gate Opening Time
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 05:00 PM Gates Open"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Event Description & Artist Lineup
              </label>
              <textarea
                rows={3}
                placeholder="Highlight performing musicians, speakers, agenda, and gate policies..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Tier Pass Allocations */}
        <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#B45309]" />
                <span>Ticket Tier Tiers & Capacity Allocation</span>
              </h2>
              <p className="text-xs text-slate-400">Configure multiple pricing tiers for attendees</p>
            </div>

            <button
              type="button"
              onClick={handleAddTier}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-[#B45309] hover:bg-[#B45309]/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tier</span>
            </button>
          </div>

          <div className="space-y-3">
            {tiers.map((t, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3"
              >
                <div className="flex-1 w-full">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Tier Name
                  </label>
                  <input
                    type="text"
                    required
                    value={t.name}
                    onChange={(e) => handleTierChange(idx, "name", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>

                <div className="w-full sm:w-36">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Price (ETB)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={t.price}
                    onChange={(e) => handleTierChange(idx, "price", Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-[#B45309] dark:text-amber-400"
                  />
                </div>

                <div className="w-full sm:w-36">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={t.capacity}
                    onChange={(e) => handleTierChange(idx, "capacity", Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                  />
                </div>

                {tiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTier(idx)}
                    className="sm:mt-5 p-2 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/provider/events"
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Live Event</span>
          </button>
        </div>
      </form>
    </div>
  );
}
