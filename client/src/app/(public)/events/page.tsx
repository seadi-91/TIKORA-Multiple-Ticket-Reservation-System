"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Users,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { EventService } from "@/services/event.service";

export default function EventsLandingPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const events = EventService.getAllEvents();

  const categories = [
    { id: "ALL", label: "All Events" },
    { id: "Music", label: "Music & Jazz Festivals" },
    { id: "Technology", label: "Conferences & Summits" },
    { id: "Comedy", label: "Standup Comedy" },
  ];

  const filteredEvents = events.filter((e) => {
    if (selectedCategory !== "ALL" && !e.categoryDetails?.eventCategory?.includes(selectedCategory)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      {/* Hero Header */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-amber-50/60 dark:from-amber-950/20 to-transparent border-b border-[#E2E8F0] dark:border-slate-800">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/40">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Live Concerts & Festivals</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Experience Ethiopia&apos;s Best Festivals, Live Music & Tech Summits
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-xl mx-auto">
            Secure verified Early Bird, VIP passes, and group tables with automated QR entry.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? "bg-[#B45309] text-white shadow-xs"
                    : "bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-[#64748B] dark:text-slate-300 hover:text-[#0F172A]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white">
            Upcoming Featured Events
          </h2>
          <span className="text-xs text-[#64748B] dark:text-amber-300 font-semibold">
            {filteredEvents.length} Events Listed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredEvents.map((evt) => (
            <TicketCard key={evt.id} ticket={evt} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
