"use client";

import React, { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { SportsService } from "@/services/sports.service";
import { TicketService } from "@/services/ticket.service";
import { TicketItem } from "@/types/ticket.types";

export default function SportsLandingPage() {
  const [mounted, setMounted] = useState(false);
  const [matches, setMatches] = useState<TicketItem[]>([]);

  useEffect(() => {
    setMounted(true);
    const cached = SportsService.getAllMatches();
    if (cached && cached.length > 0) {
      setMatches(cached);
    }
    TicketService.fetchTickets().then(() => {
      setMatches(SportsService.getAllMatches());
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0D13] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-4">
        {/* Direct Compact Ticket Grid */}
        {!mounted ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-2xl aspect-[4/3] bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200/50 dark:border-slate-800/50 min-h-[220px]"
              />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#161922] border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Trophy className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">
                {!TicketService.isCategoryActive("SPORTS")
                  ? "Stadium Sports Sector Temporarily Deactivated"
                  : "No matches scheduled"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {!TicketService.isCategoryActive("SPORTS")
                  ? "This sector has been deactivated by platform administrators. Stadium tickets and tournament fixtures are currently paused."
                  : "No stadium fixtures are currently open for booking. Premier League derbies and athletics matchday passes will appear here once published."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {matches.map((m) => (
              <TicketCard key={m.id} ticket={m} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
