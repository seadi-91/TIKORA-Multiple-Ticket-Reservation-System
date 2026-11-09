"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bus,
  Film,
  Calendar,
  Trophy,
  MapPin,
  Clock,
  QrCode,
  Download,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { BookingRecord } from "@/types/booking.types";
import { BookingStatusBadge } from "./booking-status";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { useBookingStore } from "@/stores/booking.store";
import { useLanguage } from "@/providers/language-provider";
import { toast } from "sonner";

interface BookingCardProps {
  booking: BookingRecord;
  onViewTicket?: (booking: BookingRecord) => void;
}

export function BookingCard({ booking, onViewTicket }: BookingCardProps) {
  const { cancelBooking } = useBookingStore();
  const { t } = useLanguage();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const getCategoryMeta = () => {
    switch (booking.category) {
      case "BUS":
        return {
          icon: Bus,
          bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        };
      case "CINEMA":
        return {
          icon: Film,
          bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        };
      case "EVENT":
        return {
          icon: Calendar,
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        };
      case "SPORTS":
        return {
          icon: Trophy,
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        };
    }
  };

  const meta = getCategoryMeta();
  const Icon = meta.icon;

  const handleDownload = () => {
    toast.success(`Digital pass for ${booking.bookingReference} ready for download.`);
  };

  return (
    <>
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#161922] p-4 sm:p-5 shadow-xs hover:border-amber-500/30 transition-all space-y-3">
        {/* Header: Reference and Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">
                Ref: {booking.bookingReference}
              </span>
              <h4 className="text-xs sm:text-sm font-extrabold text-foreground truncate">
                {booking.ticket.title}
              </h4>
            </div>
          </div>

          <BookingStatusBadge status={booking.bookingStatus} />
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Date & Time</span>
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{formatDate(booking.ticket.date)} • {booking.ticket.time}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Location / Venue</span>
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate">{booking.ticket.location}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Seats & Total Paid</span>
            <div className="font-semibold text-foreground flex items-center justify-between sm:block">
              {booking.selectedSeats.length > 0 ? (
                <span className="text-[11px]">Seat: <strong className="font-bold text-foreground font-mono">{booking.selectedSeats.join(", ")}</strong></span>
              ) : (
                <span className="text-[11px]">Qty: {booking.quantity} ({booking.selectedTier || "Standard Pass"})</span>
              )}
              <span className="text-xs sm:text-sm font-black text-foreground font-mono block sm:mt-0.5">
                {formatCurrency(booking.pricing.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="border-t border-slate-200/60 dark:border-slate-800/60 pt-3 flex flex-wrap items-center justify-between gap-2">
          <Link
            href={`/customer/bookings/${booking.id}`}
            className="text-xs font-bold text-muted-foreground hover:text-amber-600 inline-flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t("orders.viewDetails", "Details & Tax E-Receipt")}</span>
          </Link>

          <div className="flex items-center gap-2">
            {booking.bookingStatus === "CONFIRMED" && (
              <>
                <Link
                  href={`/customer/tickets/${booking.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 touch-manipulation min-h-[34px]"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{t("orders.showQr", "Show QR Pass")}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-w-[34px] min-h-[34px] flex items-center justify-center touch-manipulation"
                  title={t("orders.downloadPass", "Download PDF Pass")}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowCancelDialog(true)}
                  className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors cursor-pointer min-w-[34px] min-h-[34px] flex items-center justify-center touch-manipulation"
                  title="Cancel Booking"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Cancellation */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-foreground">Cancel This Booking?</h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to cancel booking <strong className="text-foreground font-mono">{booking.bookingReference}</strong> for {booking.ticket.title}?
              </p>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px] text-left mt-2">
                <strong>TIKORA Refund Policy:</strong> Cancellations made more than 24 hours prior to departure receive a 90% instant credit refund via Telebirr or CBE Birr.
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-muted-foreground text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelBooking(booking.id);
                  setShowCancelDialog(false);
                  toast.success("Booking cancelled successfully.");
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookingCard;
