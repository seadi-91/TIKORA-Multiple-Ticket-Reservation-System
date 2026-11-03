"use client";

import React, { use } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  ShieldCheck,
  ChevronLeft,
  Printer,
  Download,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { useBookingStore } from "@/stores/booking.store";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";

export default function FullscreenTicketPassPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const resolvedParams = use(params);
  const { bookings } = useBookingStore();

  const booking =
    bookings.find((b) => b.id === resolvedParams.ticketId) || bookings[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageContainer
      title="Digital Boarding Pass"
      subtitle="Present this official encrypted QR pass to the scanner at turnstiles or gate entrance."
      breadcrumbs={[
        { label: "Customer Dashboard", href: "/customer" },
        { label: "Ticket Wallet", href: "/customer/tickets" },
        { label: booking.bookingReference },
      ]}
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-gray-50 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
        </div>
      }
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Boarding Pass Container */}
        <div className="relative rounded-3xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] p-6 shadow-2xl space-y-6 overflow-hidden">
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F59E0B] text-white flex items-center justify-center font-bold text-xs">
                TK
              </div>
              <div>
                <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                  TIKORA Ethiopia
                </span>
                <span className="text-[10px] text-[#F59E0B] dark:text-amber-400 font-semibold block">
                  Verified Digital Pass
                </span>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-[#0F172A] dark:text-white bg-[#F8FAFC] dark:bg-[#0C0E14] px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-slate-800">
              {booking.bookingReference}
            </span>
          </div>

          {/* Event / Trip Title */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-amber-400/60 block">
              {booking.category} • {booking.ticket.organizer}
            </span>
            <h2 className="text-lg font-black text-[#0F172A] dark:text-white mt-0.5">
              {booking.ticket.title}
            </h2>
          </div>

          {/* QR Code Highlight with scanning pulse */}
          <div className="p-6 rounded-3xl bg-[#F8FAFC] dark:bg-[#0C0E14] border-2 border-dashed border-[#F59E0B]/40 text-center relative space-y-3">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-md border border-gray-100">
              <QRCodeSVG value={booking.qrCodeData} size={180} level="H" />
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#F59E0B] dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
              <span>Cryptographically Active & Ready to Scan</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-3 text-xs text-[#64748B] dark:text-slate-400 border-t border-[#E2E8F0] dark:border-slate-800 pt-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">Passenger Name</span>
              <strong className="text-sm font-bold text-[#0F172A] dark:text-white block">
                {booking.customerName}
              </strong>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">Assigned Seats</span>
              <strong className="text-sm font-bold text-[#F59E0B] dark:text-amber-400 block">
                {booking.selectedSeats.length > 0 ? booking.selectedSeats.join(", ") : booking.selectedTier || "Pass"}
              </strong>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">Departure / Showtime</span>
              <span className="font-semibold text-[#0F172A] dark:text-white block">
                {formatDate(booking.ticket.date)} at {booking.ticket.time}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">Gate / Venue</span>
              <span className="font-semibold text-[#0F172A] dark:text-white block truncate">
                {booking.ticket.location}
              </span>
            </div>
          </div>

          {/* Barcode Mock Footer */}
          <div className="border-t border-[#E2E8F0] dark:border-slate-800 pt-4 text-center">
            <div className="h-10 w-full bg-[repeating-linear-gradient(90deg,#0F172A,#0F172A_2px,transparent_2px,transparent_6px,#0F172A_6px,#0F172A_10px,transparent_10px,transparent_14px)] dark:bg-[repeating-linear-gradient(90deg,#F8FAFC,#F8FAFC_2px,transparent_2px,transparent_6px,#F8FAFC_6px,#F8FAFC_10px,transparent_10px,transparent_14px)] opacity-70 rounded-md" />
            <span className="text-[10px] font-mono tracking-widest text-[#64748B] block mt-1">
              *TH-{booking.id.toUpperCase()}-VERIFIED*
            </span>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/customer/tickets"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] dark:text-amber-400 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Ticket Wallet</span>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
