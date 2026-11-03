import React from "react";
import { BookingPriceBreakdown } from "@/types/booking.types";
import { formatCurrency } from "@/lib/format-currency";
import { ShieldCheck, Info } from "lucide-react";

interface BookingSummaryProps {
  pricing: BookingPriceBreakdown;
  selectedSeats?: string[];
  selectedTier?: string;
  ticketTitle?: string;
}

export function BookingSummary({
  pricing,
  selectedSeats = [],
  selectedTier,
  ticketTitle,
}: BookingSummaryProps) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] p-5 space-y-4 shadow-xs">
      <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
        <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Price Summary</h4>
        {ticketTitle && (
          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5 line-clamp-1">{ticketTitle}</p>
        )}
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between text-[#64748B] dark:text-slate-400">
          <span>
            Base Fare ({pricing.quantity} {pricing.quantity > 1 ? "Tickets" : "Ticket"} × {formatCurrency(pricing.basePrice)})
          </span>
          <span className="font-semibold text-[#0F172A] dark:text-white">
            {formatCurrency(pricing.subtotal)}
          </span>
        </div>

        {selectedTier && (
          <div className="flex justify-between text-[#64748B] dark:text-slate-400">
            <span>Pass Tier</span>
            <span className="font-semibold text-[#F59E0B] dark:text-amber-400">{selectedTier}</span>
          </div>
        )}

        {selectedSeats.length > 0 && (
          <div className="flex justify-between text-[#64748B] dark:text-slate-400">
            <span>Assigned Seats</span>
            <span className="font-bold text-[#F59E0B] dark:text-amber-400">
              {selectedSeats.join(", ")}
            </span>
          </div>
        )}

        <div className="flex justify-between text-[#64748B] dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span>Service & Payment Platform Fee (5%)</span>
            <Info className="w-3 h-3 text-[#64748B]" />
          </span>
          <span className="font-medium text-[#0F172A] dark:text-white">
            {formatCurrency(pricing.serviceFee)}
          </span>
        </div>

        <div className="flex justify-between text-[#64748B] dark:text-slate-400">
          <span>VAT & Regional Tourism Tax (15%)</span>
          <span className="font-medium text-[#0F172A] dark:text-white">
            {formatCurrency(pricing.tax)}
          </span>
        </div>

        {pricing.discount > 0 && (
          <div className="flex justify-between text-[#F59E0B] dark:text-amber-400 font-semibold">
            <span>Loyalty Promo Discount</span>
            <span>-{formatCurrency(pricing.discount)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-[#E2E8F0] dark:border-slate-800 pt-3 flex justify-between items-baseline">
        <span className="text-sm font-bold text-[#0F172A] dark:text-white">Total Amount</span>
        <span className="text-xl font-black text-[#F59E0B] dark:text-amber-400">
          {formatCurrency(pricing.total)}
        </span>
      </div>

      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFFBEB] dark:bg-amber-950/40 text-[11px] text-[#F59E0B] dark:text-amber-300">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>100% Guaranteed Digital QR Pass with Instant Delivery</span>
      </div>
    </div>
  );
}

export default BookingSummary;

