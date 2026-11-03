"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Film,
  Calendar,
  Clock,
  MapPin,
  Play,
  Ticket,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { CinemaService } from "@/services/cinema.service";

export default function CinemaLandingPage() {
  const [activeTab, setActiveTab] = useState<"NOW_SHOWING" | "COMING_SOON">("NOW_SHOWING");
  const [selectedTheater, setSelectedTheater] = useState("ALL");

  const movies = CinemaService.getAllMovies();

  const theaters = [
    { id: "ALL", name: "All Cinemas in Addis" },
    { id: "Century Cinema Megaplex", name: "Century Mall (Gurd Shola)" },
    { id: "Edna Mall Cinema", name: "Edna Mall (Bole Medhanialem)" },
    { id: "Voda Cinema Bole", name: "Voda Cinema (Atlas Welosefer)" },
  ];

  const filteredMovies = movies.filter((m) => {
    if (selectedTheater !== "ALL" && m.organizer !== selectedTheater) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      {/* Hero Banner */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-purple-50/60 dark:from-purple-950/20 to-transparent border-b border-[#E2E8F0] dark:border-slate-800">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800/40">
            <Film className="w-4 h-4" />
            <span>Cinema & Movie Premiere Theaters</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Watch the Biggest Blockbusters on 4K Laser & IMAX Screens
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-xl mx-auto">
            Book prime standard, VIP, or couple lounger seats in advance with instant digital seat reservations.
          </p>

          {/* Theater Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {theaters.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTheater(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTheater === t.id
                    ? "bg-[#B45309] text-white shadow-xs"
                    : "bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-[#64748B] dark:text-slate-300 hover:text-[#0F172A]"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Now Showing Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("NOW_SHOWING")}
              className={`text-sm sm:text-base font-bold pb-2 transition-all cursor-pointer ${
                activeTab === "NOW_SHOWING"
                  ? "text-[#B45309] dark:text-amber-400 border-b-2 border-[#B45309]"
                  : "text-[#64748B] dark:text-amber-400/60 hover:text-[#0F172A]"
              }`}
            >
              Now Showing
            </button>
            <button
              onClick={() => setActiveTab("COMING_SOON")}
              className={`text-sm sm:text-base font-bold pb-2 transition-all cursor-pointer ${
                activeTab === "COMING_SOON"
                  ? "text-[#B45309] dark:text-amber-400 border-b-2 border-[#B45309]"
                  : "text-[#64748B] dark:text-amber-400/60 hover:text-[#0F172A]"
              }`}
            >
              Coming Soon & Presales
            </button>
          </div>

          <span className="text-xs text-[#64748B] dark:text-amber-300 font-semibold">
            {filteredMovies.length} Screenings Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMovies.map((movie) => (
            <TicketCard key={movie.id} ticket={movie} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
