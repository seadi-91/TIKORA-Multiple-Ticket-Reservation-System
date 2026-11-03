import React from "react";
import { BookingStatus as StatusType } from "@/types/booking.types";

interface BookingStatusProps {
  status: StatusType;
}

export function BookingStatusBadge({ status }: BookingStatusProps) {
  switch (status) {
    case "CONFIRMED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFFBEB] text-[#F59E0B] dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          <span>Confirmed</span>
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Pending Payment</span>
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Journey Completed</span>
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>Cancelled</span>
        </span>
      );
    default:
      return null;
  }
}

export default BookingStatusBadge;

