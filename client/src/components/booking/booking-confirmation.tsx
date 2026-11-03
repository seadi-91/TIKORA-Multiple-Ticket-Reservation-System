"use client";

import React from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, QrCode, Download, Printer, ArrowRight, ShieldCheck } from "lucide-react";
import { BookingRecord } from "@/types/booking.types";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";

interface BookingConfirmationProps {
  booking: BookingRecord;
  onClose?: () => void;
}

export function BookingConfirmation({ booking, onClose }: BookingConfirmationProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-3xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] p-6 sm:p-8 max-w-xl mx-auto shadow-xl space-y-6">
      {/* Top Success Badge */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-[#FFFBEB] dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold text-[#F59E0B] dark:text-amber-400 uppercase tracking-widest block">
          Reservation Confirmed
        </span>
        <h2 className="text-2xl font-black text-[#0F172A] dark:text-white">
          You&apos;re All Set for the Experience!
        </h2>
        <p className="text-xs text-[#64748B] dark:text-slate-400 max-w-sm mx-auto">
          Your digital ticket has been issued with instant QR boarding verification.
        </p>
      </div>

      {/* Simulated Transaction Notice */}
      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-amber-950/30 border border-amber-200 dark:border-slate-800 text-[11px] text-[#F59E0B] dark:text-amber-300 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold">Simulated Ticket Confirmation (Demo Mode)</strong>
          This reservation has been registered in your TicketHub Customer Wallet with reference{" "}
          <strong className="font-mono">{booking.bookingReference}</strong>. No actual bank charge was made.
        </div>
      </div>

      {/* Realistic Ticket Voucher with QR */}
      <div className="relative rounded-2xl border border-dashed border-[#E2E8F0] dark:border-slate-700/60 bg-[#F8FAFC] dark:bg-[#0C0E14] p-6 space-y-5 overflow-hidden">
        {/* Ticket Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60">TicketHub Official Pass</span>
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-white line-clamp-1">{booking.ticket.title}</h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#F59E0B] dark:text-amber-400 px-2.5 py-1 rounded-md bg-[#FFFBEB] dark:bg-amber-950">
            {booking.bookingReference}
          </span>
        </div>

        {/* Center: Details & QR Code */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-xs text-[#64748B] dark:text-slate-400 flex-1 w-full">
            <div>
              <span className="text-[10px] uppercase font-medium text-[#64748B] block">Passenger / Guest</span>
              <strong className="text-sm font-bold text-[#0F172A] dark:text-white">{booking.customerName}</strong>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] uppercase font-medium text-[#64748B] block">Date & Time</span>
                <span className="font-semibold text-[#0F172A] dark:text-white">
                  {formatDate(booking.ticket.date)} • {booking.ticket.time}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-medium text-[#64748B] block">Seats / Tier</span>
                <span className="font-bold text-[#F59E0B] dark:text-amber-400">
                  {booking.selectedSeats.length > 0 ? booking.selectedSeats.join(", ") : booking.selectedTier || "General"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-medium text-[#64748B] block">Venue / Station</span>
              <span className="font-medium text-[#0F172A] dark:text-white">{booking.ticket.location}</span>
            </div>

            <div className="pt-1">
              <span className="text-[10px] uppercase font-medium text-[#64748B] block">Total Paid</span>
              <span className="text-base font-black text-[#F59E0B] dark:text-amber-400">
                {formatCurrency(booking.pricing.total)}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 dark:border-transparent shrink-0 text-center">
            <QRCodeSVG value={booking.qrCodeData} size={110} level="M" />
            <span className="text-[9px] font-mono text-gray-500 block mt-1">Scan at Gate</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/customer/tickets"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Ticket Wallet</span>
          </Link>

          <Link
            href="/customer/bookings"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white text-xs font-bold hover:bg-gray-50 dark:hover:bg-indigo-950/30 transition-all"
          >
            <span>My Bookings Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-[#64748B] dark:text-amber-300">
          <button onClick={handlePrint} className="flex items-center gap-1.5 hover:text-[#F59E0B] cursor-pointer">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <span>•</span>
          <button onClick={() => alert("Digital pass PDF downloaded!")} className="flex items-center gap-1.5 hover:text-[#F59E0B] cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Download Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;

