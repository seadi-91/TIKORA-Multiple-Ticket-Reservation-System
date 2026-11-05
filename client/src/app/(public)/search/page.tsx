"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketFilter } from "@/components/tickets/ticket-filter";
import { TicketList } from "@/components/tickets/ticket-list";
import { TicketService } from "@/services/ticket.service";
import { TicketFilterState } from "@/types/ticket.types";
import { Sparkles, Compass } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<TicketFilterState>({
    category: (searchParams.get("category") as any) || "ALL",
    searchQuery: searchParams.get("q") || "",
    city: searchParams.get("city") || "",
    date: searchParams.get("date") || "",
    sortBy: "POPULAR",
    viewMode: "grid",
  });

  useEffect(() => {
    const cat = searchParams.get("category");
    const q = searchParams.get("q");
    const city = searchParams.get("city");
    const date = searchParams.get("date");

    if (cat || q || city || date) {
      setFilters((prev) => ({
        ...prev,
        category: (cat as any) || prev.category,
        searchQuery: q || prev.searchQuery,
        city: city || prev.city,
        date: date || prev.date,
      }));
    }
  }, [searchParams]);

  const handleFilterChange = (updated: Partial<TicketFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: "ALL",
      searchQuery: "",
      city: "",
      date: "",
      sortBy: "POPULAR",
      viewMode: "grid",
    });
  };

  const results = TicketService.searchTickets(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-amber-500/[0.03] to-transparent p-5 sm:p-6 rounded-3xl border border-amber-500/20 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-bold ring-1 ring-amber-500/20 mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>TIKORA Explorer Engine</span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-foreground">
            Explore & Discover Verified Passes
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Intercity buses, cinema showtimes, live music concerts, and stadium matchdays.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-xs font-bold text-foreground">
            <span className="text-amber-600 dark:text-amber-400 font-black">{results.length}</span> Active Passes
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <TicketFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Ticket Results Grid */}
      <TicketList
        tickets={results}
        viewMode={filters.viewMode}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading tickets...</div>}>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
