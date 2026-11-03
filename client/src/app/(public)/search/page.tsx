"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketFilter } from "@/components/tickets/ticket-filter";
import { TicketList } from "@/components/tickets/ticket-list";
import { TicketService } from "@/services/ticket.service";
import { TicketFilterState } from "@/types/ticket.types";

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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 w-full">
      {/* Top Header */}
      <div>
        <span className="text-[10px] font-bold text-[#F59E0B] dark:text-amber-400 uppercase tracking-wider">
          Explore Tickets
        </span>
        <h1 className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-white mt-0.5">
          Ticket Discovery Engine
        </h1>
        <p className="text-xs text-[#64748B] dark:text-slate-400">
          Showing <strong className="text-[#F59E0B] dark:text-amber-400">{results.length}</strong> available passes across Ethiopia.
        </p>
      </div>

      {/* Filter Component */}
      <TicketFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Ticket List / Grid */}
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
        <Suspense fallback={<div className="p-12 text-center text-xs text-[#64748B]">Loading search...</div>}>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
