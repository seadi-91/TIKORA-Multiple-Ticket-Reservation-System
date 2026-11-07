"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Ticket, Filter } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { BookingCard } from "@/components/booking/booking-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { useBookingStore } from "@/stores/booking.store";

export default function CustomerBookingsPage() {
  const { bookings } = useBookingStore();
  const [activeTab, setActiveTab] = useState<"ALL" | "CONFIRMED" | "COMPLETED" | "CANCELLED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = bookings.filter((b) => {
    if (activeTab !== "ALL" && b.bookingStatus !== activeTab) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        b.bookingReference.toLowerCase().includes(q) ||
        b.ticket.title.toLowerCase().includes(q) ||
        b.ticket.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <PageContainer
      title="My Bookings Hub"
      subtitle="Manage all your active reservations, digital passes, past trips, and receipts."
      breadcrumbs={[{ label: "Customer Dashboard", href: "/customer" }, { label: "My Bookings" }]}
    >
      <div className="space-y-4">
        {/* Search & Tabs Controls */}
        <div className="rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 p-2.5 sm:p-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Status Tabs */}
            <div className="inline-flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg overflow-x-auto scrollbar-none">
              {[
                { id: "ALL", label: "All", count: bookings.length },
                {
                  id: "CONFIRMED",
                  label: "Upcoming",
                  count: bookings.filter((b) => b.bookingStatus === "CONFIRMED").length,
                },
                {
                  id: "COMPLETED",
                  label: "Completed",
                  count: bookings.filter((b) => b.bookingStatus === "COMPLETED").length,
                },
                {
                  id: "CANCELLED",
                  label: "Cancelled",
                  count: bookings.filter((b) => b.bookingStatus === "CANCELLED").length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-700 text-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] font-mono opacity-75">({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reference or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/30"
              />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="No bookings found"
            description="You don't have any reservations matching this status filter. Explore tickets to plan your next experience!"
            actionLabel="Discover Tickets"
            actionHref="/search"
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
