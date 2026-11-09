"use client";

import React from "react";
import { TicketItem } from "@/types/ticket.types";
import { TicketCard } from "./ticket-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { Ticket as TicketIcon } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

interface TicketListProps {
  tickets: TicketItem[];
  viewMode?: "grid" | "list";
  onBookClick?: (ticket: TicketItem) => void;
  onResetFilters?: () => void;
}

export function TicketList({
  tickets,
  viewMode = "grid",
  onBookClick,
  onResetFilters,
}: TicketListProps) {
  const { t } = useLanguage();

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={TicketIcon}
        title={t("No matching tickets found")}
        description={t("We couldn't find any tickets matching your selected criteria. Try adjusting your search query, destination city, or category filter.")}
        actionLabel={t("Reset Search Filters")}
        onActionClick={onResetFilters}
      />
    );
  }

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-3">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} viewMode="list" onBookClick={onBookClick} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} viewMode="grid" onBookClick={onBookClick} />
      ))}
    </div>
  );
}

export default TicketList;

