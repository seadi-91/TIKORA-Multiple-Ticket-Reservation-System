"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bus,
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Printer,
  RotateCcw,
  Send,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";
import { INITIAL_BOOKINGS } from "../page";

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = (params?.bookingId as string) || "";

  const [bookingStatus, setBookingStatus] = useState<"CONFIRMED" | "CHECKED_IN" | "CANCELLED">(
    "CHECKED_IN"
  );
  const [isRefunding, setIsRefunding] = useState(false);

  const foundBooking = INITIAL_BOOKINGS.find(
    (b) => b.id === bookingId || b.reference.toLowerCase() === bookingId.toLowerCase()
  );

  const booking = foundBooking
    ? {
        id: foundBooking.id,
        reference: foundBooking.reference,
        bookedAt: foundBooking.createdAt,
        customer: {
          name: foundBooking.customerName,
          phone: foundBooking.customerPhone,
          email: foundBooking.customerEmail,
          city: "Addis Ababa",
          verified: true,
          totalOrdersWithProvider: 1,
        },
        service: {
          title: foundBooking.serviceTitle,
          category: foundBooking.category,
          terminal: "Main Station",
          destination: "Destination Terminal",
          date: foundBooking.travelDate,
          time: foundBooking.departureTime,
          vehicle: "Standard Transport",
          driverName: "Assigned Driver",
          driverPhone: "+251 90 000 0000",
        },
        passengers: foundBooking.seats.map((seat) => ({
          seat,
          name: foundBooking.customerName,
          phone: foundBooking.customerPhone,
          gender: "Not specified",
          idDoc: "National ID",
          checkedIn: foundBooking.bookingStatus === "CHECKED_IN",
        })),
        financials: {
          unitPrice:
            foundBooking.seats.length > 0
              ? Math.round(foundBooking.totalAmount / foundBooking.seats.length)
              : foundBooking.totalAmount,
          quantity: foundBooking.seats.length || 1,
          grossTotal: foundBooking.totalAmount,
          platformCommission: Math.round(foundBooking.totalAmount * 0.05),
          netEarnings: Math.round(foundBooking.totalAmount * 0.95),
          paymentMethod: foundBooking.paymentMethod,
          transactionId: `TX-${foundBooking.reference}`,
          paidAt: foundBooking.createdAt,
        },
      }
    : null;

  if (!booking) {
    return (
      <div className="p-8 text-center bg-card rounded-2xl border border-slate-200/50 dark:border-slate-800/50 max-w-md mx-auto my-12 space-y-3">
        <Ticket className="w-10 h-10 text-muted-foreground/40 mx-auto" />
        <p className="font-bold text-foreground text-sm">Booking record not found</p>
        <p className="text-muted-foreground text-xs">
          No passenger booking record matches identifier &quot;{bookingId}&quot;.
        </p>
        <Link
          href="/provider/bookings"
          className="inline-flex mt-2 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 text-white"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  const handleToggleBoarding = () => {
    const nextStatus = bookingStatus === "CHECKED_IN" ? "CONFIRMED" : "CHECKED_IN";
    setBookingStatus(nextStatus);
    toast.success(
      nextStatus === "CHECKED_IN"
        ? "Ticket scanned & verified. Passengers marked as boarded."
        : "Boarding status reset to confirmed."
    );
  };

  const handleResendSMS = () => {
    toast.success(`Confirmation SMS re-dispatched to ${booking.customer.phone}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleInitiateRefund = () => {
    setIsRefunding(true);
    setTimeout(() => {
      setIsRefunding(false);
      setBookingStatus("CANCELLED");
      toast.success("Refund request submitted to financial queue.");
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/provider/bookings"
            className="p-2 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-600">
                {booking.reference}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${bookingStatus === "CHECKED_IN"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : bookingStatus === "CANCELLED"
                    ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  }`}
              >
                {bookingStatus === "CHECKED_IN"
                  ? "Boarded"
                  : bookingStatus === "CANCELLED"
                    ? "Cancelled / Refunded"
                    : "Confirmed"}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Booked on {booking.bookedAt}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground mt-0.5">
              Reservation Manifest
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleResendSMS}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-muted-foreground" /> Resend SMS
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-muted-foreground" /> Print Voucher
          </button>

          <button
            type="button"
            onClick={handleToggleBoarding}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-sm transition-colors ${bookingStatus === "CHECKED_IN"
              ? "bg-muted text-foreground hover:bg-muted/80"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {bookingStatus === "CHECKED_IN" ? "Revoke Boarding" : "Verify & Check-In"}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Service & Passenger Manifest */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip / Service Card */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {booking.service.title}
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Intercity Luxury Passenger Transport
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-amber-600">
                {booking.passengers.length} Seats Reserved
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Departure Origin</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  {booking.service.terminal}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Destination</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  {booking.service.destination}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Date & Time</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  {booking.service.date} • {booking.service.time}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Assigned Coach</span>
                <span className="font-semibold text-foreground">
                  {booking.service.vehicle}
                </span>
              </div>
            </div>
          </div>

          {/* Passenger Manifest Table */}
          <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border/60">
              <h3 className="text-sm font-bold text-foreground">Passenger Manifest</h3>
              <p className="text-xs text-muted-foreground">
                Individual passenger seat assignments and ID records.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">Seat</th>
                    <th className="py-2.5 px-3">Passenger Name</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Identity Document</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {booking.passengers.map((p, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-amber-600">
                        {p.seat}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-foreground block">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground">{p.gender}</span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{p.phone}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground">
                        {p.idDoc}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${bookingStatus === "CHECKED_IN"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600"
                            }`}
                        >
                          {bookingStatus === "CHECKED_IN" ? "Boarded" : "Reserved"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Customer & Financials */}
        <div className="space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Primary Booker
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-600/10 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-sm border border-amber-600/20">
                DH
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {booking.customer.name}
                </h4>
                <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Customer
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs pt-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Mobile
                </span>
                <span className="font-semibold text-foreground">
                  {booking.customer.phone}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </span>
                <span className="font-semibold text-foreground">
                  {booking.customer.email}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5" /> Total Orders
                </span>
                <span className="font-semibold text-foreground">
                  {booking.customer.totalOrdersWithProvider} bookings
                </span>
              </div>
            </div>
          </div>

          {/* Payment Breakdown Card */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Financial Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">
                  Fare ({booking.financials.quantity} seats @ {booking.financials.unitPrice} ETB)
                </span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(booking.financials.grossTotal)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Platform Fee (5%)</span>
                <span className="text-muted-foreground font-mono">
                  -{formatCurrency(booking.financials.platformCommission)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 font-bold text-sm">
                <span className="text-foreground">Net Payout to Provider</span>
                <span className="text-amber-600 font-mono">
                  {formatCurrency(booking.financials.netEarnings)}
                </span>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 text-[11px] space-y-1 border border-border/40">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gateway:</span>
                <span className="font-medium text-foreground">
                  {booking.financials.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tx Reference:</span>
                <span className="font-mono text-muted-foreground">
                  {booking.financials.transactionId}
                </span>
              </div>
            </div>

            {/* Refund Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleInitiateRefund}
                disabled={isRefunding || bookingStatus === "CANCELLED"}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {bookingStatus === "CANCELLED" ? "Refund Initiated" : "Initiate Refund"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
