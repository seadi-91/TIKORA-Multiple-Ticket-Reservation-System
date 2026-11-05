"use client";

import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { SportsService } from "@/services/sports.service";

export default function SportsLandingPage() {
  const matches = SportsService.getAllMatches();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0D13] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-5 w-full space-y-4">
        {/* Direct Compact Ticket Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {matches.map((m) => (
            <TicketCard key={m.id} ticket={m} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
