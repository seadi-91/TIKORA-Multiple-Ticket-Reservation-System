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
      <div className="space-y-6">
        {/* Search & Tabs Controls */}
        <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: "ALL", label: `All (${bookings.length})` },
                {
                  id: "CONFIRMED",
                  label: `Upcoming / Active (${bookings.filter((b) => b.bookingStatus === "CONFIRMED").length})`,
                },
                {
                  id: "COMPLETED",
                  label: `Completed (${bookings.filter((b) => b.bookingStatus === "COMPLETED").length})`,
                },
                {
                  id: "CANCELLED",
                  label: `Cancelled (${bookings.filter((b) => b.bookingStatus === "CANCELLED").length})`,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#F59E0B] text-white shadow-xs"
                      : "bg-gray-100 text-[#64748B] hover:text-[#0F172A] dark:bg-[#0C0E14] dark:text-amber-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reference or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
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
