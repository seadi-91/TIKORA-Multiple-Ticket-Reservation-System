"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  Download,
  Printer,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ExternalLink,
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { useBookingStore } from "@/stores/booking.store";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";

export default function CustomerTicketsWalletPage() {
  const { bookings } = useBookingStore();
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === "CONFIRMED");

  const handlePrint = (ref: string) => {
    window.print();
  };

  const handleDownload = (ref: string) => {
    alert(`Downloading digital pass PDF for ${ref}...`);
  };

  return (
    <PageContainer
      title="Digital Ticket Wallet"
      subtitle="Present these cryptographic QR boarding passes directly to station or gate scanners."
      breadcrumbs={[{ label: "Customer Dashboard", href: "/customer" }, { label: "My Digital Tickets" }]}
    >
      <div className="space-y-6">
        {/* Verification Instruction Banner */}
        <div className="p-4 rounded-2xl bg-[#FFFBEB] dark:bg-amber-950/40 border border-amber-200 dark:border-slate-700/60 text-[#F59E0B] dark:text-amber-300 text-xs flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>
            <strong>How to Board:</strong> Keep your screen brightness up when presenting this QR code to the turnstile or mobile scanner at your station or venue gate.
          </span>
        </div>

        {confirmedBookings.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#161922] border border-dashed border-[#E2E8F0] dark:border-slate-800 space-y-3">
            <QrCode className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">No active passes in your wallet</h3>
            <p className="text-xs text-[#64748B] dark:text-amber-300/70 max-w-sm mx-auto">
              Book a bus seat, cinema ticket, or festival pass to view it here.
            </p>
            <Link
              href="/search"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#F59E0B] text-white text-xs font-bold shadow-md"
            >
              Explore Tickets
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {confirmedBookings.map((b) => (
              <div
                key={b.id}
                className="relative rounded-3xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161922] p-6 shadow-md hover:shadow-xl transition-all space-y-5 overflow-hidden flex flex-col justify-between"
              >
                {/* Top Notch & Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] dark:text-amber-300">
                        {b.category} Pass
                      </span>
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                        {b.ticket.organizer}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#F59E0B] dark:text-amber-400 bg-gray-50 dark:bg-[#0C0E14] px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-slate-800">
                      {b.bookingReference}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white line-clamp-1">
                      {b.ticket.title}
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-amber-300/70 mt-0.5 line-clamp-1">
                      {b.ticket.location}
                    </p>
                  </div>

                  {/* Date, Time & Seat Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#0F172A] dark:text-white pt-1">
                    <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0C0E14] border border-[#E2E8F0] dark:border-slate-800/20">
                      <span className="text-[10px] uppercase font-bold text-[#64748B] block">Departure / Showtime</span>
                      <strong className="text-xs block mt-0.5">
                        {formatDate(b.ticket.date)} • {b.ticket.time}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0C0E14] border border-[#E2E8F0] dark:border-slate-800/20">
                      <span className="text-[10px] uppercase font-bold text-[#64748B] block">Seat / Pass Tier</span>
                      <strong className="text-xs text-[#F59E0B] dark:text-amber-400 block mt-0.5">
                        {b.selectedSeats.length > 0 ? b.selectedSeats.join(", ") : b.selectedTier || "Pass"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Center QR Code Section */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0C0E14] border border-dashed border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] block">Passenger Name</span>
                    <strong className="text-sm font-bold text-[#0F172A] dark:text-white block">
                      {b.customerName}
                    </strong>
                    <span className="text-[11px] text-[#64748B] dark:text-amber-400/60 block">
                      Issued: {formatDate(b.createdAt)}
                    </span>
                    <Link
                      href={`/customer/tickets/${b.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#F59E0B] dark:text-amber-400 hover:underline pt-2"
                    >
                      <span>Fullscreen Gate Pass</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl shadow-xs border border-gray-100 shrink-0 text-center">
                    <QRCodeSVG value={b.qrCodeData} size={95} level="H" />
                    <span className="text-[8px] font-mono text-gray-500 block mt-1">TIKORA Certified</span>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="border-t border-[#E2E8F0] dark:border-slate-800 pt-3 flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-[#F59E0B] dark:text-amber-400">
                    Paid: {formatCurrency(b.pricing.total)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrint(b.bookingReference)}
                      className="p-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-[#64748B] hover:text-[#F59E0B] transition-colors cursor-pointer"
                      title="Print Pass"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(b.bookingReference)}
                      className="p-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-[#64748B] hover:text-[#F59E0B] transition-colors cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
