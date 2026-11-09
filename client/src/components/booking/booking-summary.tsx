import React from "react";
import { BookingPriceBreakdown } from "@/types/booking.types";
import { formatCurrency } from "@/lib/format-currency";
import { ShieldCheck, Info } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

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
  const { t } = useLanguage();
  return (
    <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] p-5 space-y-4 shadow-xs">
      <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
        <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">
          {t("checkout.summaryTitle", "Price Summary")}
        </h4>
        {ticketTitle && (
          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5 line-clamp-1">{ticketTitle}</p>
        )}
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between text-[#64748B] dark:text-slate-400">
          <span>
            {t("checkout.baseFare", "Base Fare")} ({pricing.quantity} {pricing.quantity > 1 ? t("checkout.tickets", "Tickets") : t("checkout.ticket", "Ticket")} × {formatCurrency(pricing.basePrice)})
          </span>
          <span className="font-semibold text-[#0F172A] dark:text-white">
            {formatCurrency(pricing.subtotal)}
          </span>
        </div>

        {selectedTier && (
          <div className="flex justify-between text-[#64748B] dark:text-slate-400">
            <span>{t("checkout.passTier", "Pass Tier")}</span>
            <span className="font-semibold text-[#F59E0B] dark:text-amber-400">{selectedTier}</span>
          </div>
        )}

        {selectedSeats.length > 0 && (
          <div className="flex justify-between text-[#64748B] dark:text-slate-400">
            <span>{t("checkout.assignedSeats", "Assigned Seats")}</span>
            <span className="font-bold text-[#F59E0B] dark:text-amber-400">
              {selectedSeats.join(", ")}
            </span>
          </div>
        )}

        <div className="flex justify-between text-[#64748B] dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span>{t("checkout.platformServiceFee", "Platform Service Fee")}</span>
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-500/20">
              {t("checkout.freeFeeNotice", "0% (Covered by Provider)")}
            </span>
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            0.00 {t("common.etb", "ETB")}
          </span>
        </div>

        <div className="flex justify-between text-[#64748B] dark:text-slate-400">
          <span>{t("checkout.statutoryVat", "Statutory VAT")} ({pricing.vatRate ?? 5}%)</span>
          <span className="font-medium text-[#0F172A] dark:text-white">
            {formatCurrency(pricing.tax)}
          </span>
        </div>

        {pricing.discount > 0 && (
          <div className="flex justify-between text-[#F59E0B] dark:text-amber-400 font-semibold">
            <span>{t("checkout.discount", "Loyalty Promo Discount")}</span>
            <span>-{formatCurrency(pricing.discount)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-[#E2E8F0] dark:border-slate-800 pt-3 flex justify-between items-baseline">
        <span className="text-sm font-bold text-[#0F172A] dark:text-white">
          {t("checkout.totalToPay", "Total Amount")}
        </span>
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

