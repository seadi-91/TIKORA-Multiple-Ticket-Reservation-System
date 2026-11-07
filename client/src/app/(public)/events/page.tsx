"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketCard } from "@/components/tickets/ticket-card";
import { EventService } from "@/services/event.service";

export default function EventsLandingPage() {
  const events = EventService.getAllEvents();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0D13] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-4">
        {/* Direct Compact Ticket Grid */}
        {events.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#161922] border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">No upcoming concerts or events</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No events are listed right now. Music festivals, holiday cultural shows, and exhibitions will be posted here once announced.
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
