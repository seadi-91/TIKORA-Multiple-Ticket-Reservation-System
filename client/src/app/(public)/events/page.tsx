"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { EventService } from "@/services/event.service";
import { TicketService } from "@/services/ticket.service";
import { TicketItem } from "@/types/ticket.types";

export default function EventsLandingPage() {
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<TicketItem[]>([]);

  useEffect(() => {
    setMounted(true);
    const cached = EventService.getAllEvents();
    if (cached && cached.length > 0) {
      setEvents(cached);
    }
    TicketService.fetchTickets().then(() => {
      setEvents(EventService.getAllEvents());
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
        ) : events.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#161922] border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">
                {!TicketService.isCategoryActive("EVENT")
                  ? "Events & Concerts Sector Temporarily Deactivated"
                  : "No upcoming concerts or events"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {!TicketService.isCategoryActive("EVENT")
                  ? "This sector has been deactivated by platform administrators. Concert and festival tickets are currently paused."
                  : "No events are listed right now. Music festivals, holiday cultural shows, and exhibitions will be posted here once announced."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {events.map((evt) => (
              <TicketCard key={evt.id} ticket={evt} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
