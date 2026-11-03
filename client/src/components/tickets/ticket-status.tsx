import React from "react";
import { TicketStatus as StatusType } from "@/types/ticket.types";

interface TicketStatusProps {
  status: StatusType;
  availableSeats?: number;
}

export function TicketStatusBadge({ status, availableSeats }: TicketStatusProps) {
  switch (status) {
    case "AVAILABLE":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FFFBEB] text-[#F59E0B] dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
          <span>Available{availableSeats !== undefined ? ` (${availableSeats} left)` : ""}</span>
        </span>
      );
    case "SELLING_FAST":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          <span>Selling Fast{availableSeats !== undefined ? ` (${availableSeats} left)` : ""}</span>
        </span>
      );
    case "SOLD_OUT":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>Sold Out</span>
        </span>
      );
    default:
      return null;
  }
}

export default TicketStatusBadge;

