"use client";

import React, { useState, useEffect } from "react";
import { Film } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { CinemaService } from "@/services/cinema.service";
import { TicketService } from "@/services/ticket.service";
import { TicketItem } from "@/types/ticket.types";

export default function CinemaLandingPage() {
  const [mounted, setMounted] = useState(false);
  const [movies, setMovies] = useState<TicketItem[]>([]);

  useEffect(() => {
    setMounted(true);
    const cached = CinemaService.getAllMovies();
    if (cached && cached.length > 0) {
      setMovies(cached);
    }
    TicketService.fetchTickets().then(() => {
      setMovies(CinemaService.getAllMovies());
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
        ) : movies.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#161922] border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Film className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">
                {!TicketService.isCategoryActive("CINEMA")
                  ? "Cinema Sector Temporarily Deactivated"
                  : "No movies currently showing"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {!TicketService.isCategoryActive("CINEMA")
                  ? "This sector has been deactivated by platform administrators. Showtimes and cinema passes are temporarily hidden from reservations."
                  : "Check back soon! Cinema partners like Century Cinema, Alem Cinema, and Edna Mall publish showtimes daily."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {movies.map((movie) => (
              <TicketCard key={movie.id} ticket={movie} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
