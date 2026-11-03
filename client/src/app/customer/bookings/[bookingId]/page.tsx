"use client";

import React, { use } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Ticket,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  ChevronLeft,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  CreditCard,
  User,
  ArrowRight,
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { BookingStatusBadge } from "@/components/booking/booking-status";
import { useBookingStore } from "@/stores/booking.store";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";

export default function BookingDetailPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = use(params);
  const { bookings } = useBookingStore();

  const booking =
    bookings.find((b) => b.id === resolvedParams.bookingId) || bookings[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageContainer
      title={`Booking Details: ${booking.bookingReference}`}
      subtitle="Complete reservation itinerary, passenger allocations, and payment receipt."
      breadcrumbs={[
        { label: "Customer Dashboard", href: "/customer" },
        { label: "My Bookings", href: "/customer/bookings" },
        { label: booking.bookingReference },
      ]}
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-gray-50 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <Link
            href={`/customer/tickets/${booking.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>View QR Pass</span>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Timeline, Itinerary, Passengers */}
        <div className="lg:col-span-8 space-y-6">
          {/* Status Progression Timeline */}
          <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-amber-400/60">
                Reservation Timeline
              </span>
              <BookingStatusBadge status={booking.bookingStatus} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <strong className="block text-[#0F172A] dark:text-white">Created</strong>
                  <span className="text-[10px] text-[#64748B] dark:text-amber-400/60">Reservation Logged</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <strong className="block text-[#0F172A] dark:text-white">Payment Verified</strong>
                  <span className="text-[10px] text-[#64748B] dark:text-amber-400/60">{booking.paymentMethod}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <strong className="block text-[#0F172A] dark:text-white">QR Pass Active</strong>
                  <span className="text-[10px] text-[#64748B] dark:text-amber-400/60">Ready at Gate</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 opacity-60">
                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-amber-950 text-gray-500 flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <strong className="block text-[#0F172A] dark:text-white">Boarded / Completed</strong>
                  <span className="text-[10px] text-[#64748B] dark:text-amber-400/60">Awaiting Entry</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Details Card */}
          <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#F59E0B] dark:text-amber-300 px-2 py-0.5 rounded-md bg-[#FFFBEB] dark:bg-amber-950">
                  {booking.category}
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mt-1">
                  {booking.ticket.title}
                </h3>
                <span className="text-xs text-[#64748B] dark:text-amber-300/70 block mt-0.5">
                  Organized by {booking.ticket.organizer}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#64748B] dark:text-slate-400 border-t border-[#E2E8F0] dark:border-slate-800 pt-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#64748B]">Date & Time</span>
                <div className="font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{formatDate(booking.ticket.date)} • {booking.ticket.time}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#64748B]">Location / Venue</span>
                <div className="font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{booking.ticket.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Passengers & Assigned Seats */}
          <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
              Passenger & Seat Assignments ({booking.quantity} Total)
            </h3>

            <div className="space-y-2">
              {booking.passengers.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0C0E14] border border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] dark:text-white">{p.fullName}</h4>
                      <span className="text-[11px] text-[#64748B] dark:text-amber-400/60">{p.phone}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] block">Seat / Pass</span>
                    <strong className="text-sm font-bold text-[#F59E0B] dark:text-amber-400">
                      {p.seatNumber || booking.selectedSeats[idx] || "Standard"}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Official Receipt */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-5">
            <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 block">
                Official E-Receipt
              </span>
              <h4 className="text-base font-bold text-[#0F172A] dark:text-white">
                Payment Breakdown
              </h4>
            </div>

            <div className="space-y-2.5 text-xs text-[#64748B] dark:text-slate-400">
              <div className="flex justify-between">
                <span>Base Fare ({booking.quantity} Tickets)</span>
                <span className="font-semibold text-[#0F172A] dark:text-white">
                  {formatCurrency(booking.pricing.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Platform Service Charge (5%)</span>
                <span>{formatCurrency(booking.pricing.serviceFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT & Tourism Tax (15%)</span>
                <span>{formatCurrency(booking.pricing.tax)}</span>
              </div>

              <div className="border-t border-[#E2E8F0] dark:border-slate-800 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-[#0F172A] dark:text-white">Total Paid</span>
                <span className="text-xl font-black text-[#F59E0B] dark:text-amber-400">
                  {formatCurrency(booking.pricing.total)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0C0E14] text-[11px] text-[#64748B] dark:text-amber-300 space-y-1">
              <div className="flex justify-between">
                <span>Method:</span>
                <strong className="text-[#0F172A] dark:text-white">{booking.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <strong className="text-[#F59E0B] dark:text-amber-400">{booking.paymentStatus}</strong>
              </div>
              <div className="flex justify-between">
                <span>Issued:</span>
                <span>{formatDate(booking.createdAt)}</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <QRCodeSVG value={booking.qrCodeData} size={130} className="mx-auto" />
              <span className="text-[10px] font-mono text-[#64748B] block mt-2">
                Turnstile Code: {booking.bookingReference}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
