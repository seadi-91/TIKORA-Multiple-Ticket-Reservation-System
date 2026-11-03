import React from "react";
import { PaymentStatus as StatusType } from "@/types/payment.types";

interface PaymentStatusProps {
  status: StatusType;
}

export function PaymentStatusBadge({ status }: PaymentStatusProps) {
  switch (status) {
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFFBEB] text-[#F59E0B] dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          <span>Paid</span>
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Pending</span>
        </span>
      );
    case "REFUNDED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span>Refunded</span>
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>Failed</span>
        </span>
      );
    default:
      return null;
  }
}

export default PaymentStatusBadge;

