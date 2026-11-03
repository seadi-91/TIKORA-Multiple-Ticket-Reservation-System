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
} from "lucide-react";
import { BookingRecord } from "@/types/booking.types";
import { BookingStatusBadge } from "./booking-status";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { useBookingStore } from "@/stores/booking.store";

interface BookingCardProps {
  booking: BookingRecord;
  onViewTicket?: (booking: BookingRecord) => void;
}

export function BookingCard({ booking, onViewTicket }: BookingCardProps) {
  const { cancelBooking } = useBookingStore();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const getCategoryIcon = () => {
    switch (booking.category) {
      case "BUS":
        return <Bus className="w-5 h-5 text-emerald-600" />;
      case "CINEMA":
        return <Film className="w-5 h-5 text-purple-600" />;
      case "EVENT":
        return <Calendar className="w-5 h-5 text-amber-600" />;
      case "SPORTS":
        return <Trophy className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleDownload = () => {
    alert(`Downloading digital pass for ${booking.bookingReference}...`);
  };

  return (
    <>
      <div className="rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all space-y-2.5">
        {/* Header: Reference and Status */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[#E2E8F0] dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-amber-950/60 flex items-center justify-center shrink-0">
              {getCategoryIcon()}
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-[#64748B] dark:text-slate-400 tracking-wider">
                Ref: {booking.bookingReference}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white line-clamp-1">
                {booking.ticket.title}
              </h4>
            </div>
          </div>

          <BookingStatusBadge status={booking.bookingStatus} />
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#64748B] dark:text-slate-400">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-semibold text-[#64748B] dark:text-slate-400 block">Date & Time</span>
            <div className="flex items-center gap-1.5 font-medium text-[#0F172A] dark:text-slate-200">
              <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span>{formatDate(booking.ticket.date)} • {booking.ticket.time}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-semibold text-[#64748B] dark:text-slate-400 block">Location / Venue</span>
            <div className="flex items-center gap-1.5 font-medium text-[#0F172A] dark:text-slate-200">
              <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span className="truncate">{booking.ticket.location}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-semibold text-[#64748B] dark:text-slate-400 block">Seats & Fare</span>
            <div className="font-medium text-[#0F172A] dark:text-slate-200">
              {booking.selectedSeats.length > 0 ? (
                <span>Seat(s): <strong className="font-bold text-[#0F172A] dark:text-white">{booking.selectedSeats.join(", ")}</strong></span>
              ) : (
                <span>Qty: {booking.quantity} ({booking.selectedTier || "Standard Pass"})</span>
              )}
              <span className="block text-xs sm:text-sm font-black text-[#0F172A] dark:text-white mt-0.5">
                {formatCurrency(booking.pricing.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="border-t border-[#E2E8F0] dark:border-slate-800 pt-2 flex flex-wrap items-center justify-between gap-1.5">
          <Link
            href={`/customer/bookings/${booking.id}`}
            className="text-xs font-semibold text-[#64748B] dark:text-slate-300 hover:text-[#B45309] inline-flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            <span>Details & Receipt</span>
          </Link>

          <div className="flex items-center gap-2">
            {booking.bookingStatus === "CONFIRMED" && (
              <>
                <Link
                  href={`/customer/tickets/${booking.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold transition-all shadow-xs active:scale-95 touch-manipulation min-h-[36px]"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Show QR</span>
                </Link>

                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-800 text-[#64748B] hover:text-[#B45309] dark:text-slate-300 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation"
                  title="Download PDF Ticket"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation"
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
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Cancel This Booking?</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Are you sure you want to cancel booking <strong className="text-[#0F172A] dark:text-white">{booking.bookingReference}</strong> for {booking.ticket.title}?
              </p>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-[11px] text-left mt-2">
                <strong>TicketHub Refund Policy:</strong> Cancellations made more than 24 hours prior to departure/screening receive a 90% instant credit refund.
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-[#64748B] dark:text-amber-300 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  cancelBooking(booking.id);
                  setShowCancelDialog(false);
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

