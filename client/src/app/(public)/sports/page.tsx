"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { SportsService } from "@/services/sports.service";

export default function SportsLandingPage() {
  const matches = SportsService.getAllMatches();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      {/* Hero Header */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-blue-50/60 dark:from-blue-950/20 to-transparent border-b border-[#E2E8F0] dark:border-slate-800">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800/40">
            <Trophy className="w-4 h-4 text-blue-500" />
            <span>Stadium Sports & Tournaments</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Reserve Matchday Stadium Passes for the Ethiopian Premier League
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-xl mx-auto">
            Direct electronic turnstile gate entry passes for Addis Ababa Stadium, Abebe Bikila Stadium, and national championships.
          </p>
        </div>
      </section>

      {/* Matches Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white">
            Upcoming Fixtures & Tournament Matches
          </h2>
          <span className="text-xs text-[#64748B] dark:text-amber-300 font-semibold">
            {matches.length} Matches Scheduled
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {matches.map((m) => (
            <TicketCard key={m.id} ticket={m} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
