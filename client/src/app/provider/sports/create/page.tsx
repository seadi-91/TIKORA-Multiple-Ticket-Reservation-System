"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy,
  MapPin,
  Clock,
  Ticket,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { ETHIOPIAN_CITIES } from "@/lib/constants";

export default function CreateSportsPage() {
  const router = useRouter();

  const [tournament, setTournament] = useState("Ethiopian Premier League 2026");
  const [sportType, setSportType] = useState("Football");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [venue, setVenue] = useState("Addis Ababa Stadium");
  const [city, setCity] = useState("Addis Ababa");
  const [gate, setGate] = useState("Gate 1 (Grandstand Entry)");
  const [date, setDate] = useState("2026-11-25");
  const [time, setTime] = useState("04:00 PM");
  const [description, setDescription] = useState("");
  const [tiers, setTiers] = useState([
    { name: "Upper Bleachers (General)", price: 100, capacity: 8000 },
    { name: "Covered Grandstand Tribune", price: 250, capacity: 2000 },
    { name: "VIP President Lounge", price: 600, capacity: 150 },
  ]);

  const handleAddTier = () => {
    setTiers([...tiers, { name: "Special Tribune", price: 300, capacity: 500 }]);
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
    alert(`Match fixture "${homeTeam} vs ${awayTeam}" scheduled successfully!`);
    router.push("/provider/sports");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Link href="/provider/sports" className="hover:text-[#B45309] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sports</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0F172A] dark:text-white">Schedule Fixture</span>
        </div>
        <h1 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
          Create Stadium Matchday Pass
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Assign competing clubs, electronic gate turnstiles, and tribune seating tiers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#B45309]" />
            <span>Match & Tournament Particulars</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Tournament / League
              </label>
              <input
                type="text"
                required
                value={tournament}
                onChange={(e) => setTournament(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#B45309]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Sport Type
              </label>
              <select
                value={sportType}
                onChange={(e) => setSportType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
              >
                <option value="Football">Soccer / Football</option>
                <option value="Basketball">Basketball League</option>
                <option value="Athletics">Track & Field Athletics</option>
                <option value="Volleyball">Volleyball Championship</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Home Club / Team
              </label>
              <input
                type="text"
                required
                placeholder="e.g. St. George SC"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Away Club / Team
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ethiopian Coffee SC"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Stadium / Arena Venue
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Abebe Bikila Stadium"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
              />
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

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Turnstile Gate Entry
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Gate 2 (Indoor Arena Entry)"
                value={gate}
                onChange={(e) => setGate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Kickoff Date
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
                  Kickoff Time
                </label>
                <input
                  type="text"
                  required
                  placeholder="04:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tribune Tier Allocations */}
        <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#B45309]" />
                <span>Stadium Tribune Passes & Pricing</span>
              </h2>
              <p className="text-xs text-slate-400">Configure bleachers, grandstand, and VIP enclosures</p>
            </div>

            <button
              type="button"
              onClick={handleAddTier}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-[#B45309] hover:bg-[#B45309]/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tribune</span>
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
                    Tribune Category
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
                    Seats Capacity
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
            href="/provider/sports"
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Schedule Fixture</span>
          </button>
        </div>
      </form>
    </div>
  );
}
