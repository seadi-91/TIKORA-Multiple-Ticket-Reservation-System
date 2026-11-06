"use client";

import React from "react";
import Link from "next/link";
import { Heart, Ticket } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { TicketCard } from "@/components/tickets/ticket-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { useBookingStore } from "@/stores/booking.store";
import { TicketService } from "@/services/ticket.service";

export default function CustomerFavoritesPage() {
  const { favorites } = useBookingStore();
  const allTickets = TicketService.getAllTickets();

  const savedTickets = allTickets.filter((t) => favorites.includes(t.id));

  return (
    <PageContainer
      title="Saved Wishlist & Favorites"
      subtitle="Quick access to events, movies, matches, and bus lines you've saved for later."
      breadcrumbs={[{ label: "Customer Dashboard", href: "/customer" }, { label: "Favorites" }]}
    >
      <div className="space-y-6">
        {savedTickets.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Explore tickets for bus routes, cinema premieres, live concerts, or soccer derbies and click the heart icon to save them here."
            actionLabel="Discover Tickets"
            actionHref="/search"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {savedTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
