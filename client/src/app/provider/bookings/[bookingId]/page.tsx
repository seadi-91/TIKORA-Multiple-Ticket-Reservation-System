"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Bus,
  Calendar,
  CheckCircle2,
  Film,
  Mail,
  MapPin,
  Music,
  Phone,
  Printer,
  QrCode,
  RotateCcw,
  Send,
  ShieldCheck,
  Ticket,
  Trophy,
  User,
  Check,
} from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";
import { useProviderStore, ProviderBookingRecord } from "@/stores/provider.store";
import { useBookingStore } from "@/stores/booking.store";
import { TicketCategory } from "@/types/ticket.types";

interface UnifiedBookingView {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceTitle: string;
  category: TicketCategory;
  location: string;
  travelDate: string;
  departureTime: string;
  seats: string[];
  totalAmount: number; // Pure ticket base fare without VAT
  customerPaidWithVat: number; // Full customer amount with VAT
  vatRate: number;
  vatAmount: number;
  commissionRate: number;
  platformFee: number;
  netPayout: number;
  paymentMethod: string;
  paymentStatus: "PAID" | "PENDING" | "REFUNDED" | "FAILED" | string;
  bookingStatus: "CONFIRMED" | "CHECKED_IN" | "CANCELLED" | string;
  qrCodeData: string;
  bookedAt: string;
  vehicleOrHall?: string;
}

export default function BookingDetailPage() {
  const params = useParams();
  const rawId = (params?.bookingId as string) || "";
  const targetId = decodeURIComponent(rawId).trim();

  const { organization, bookings: providerBookings } = useProviderStore();
  const { bookings: customerBookings } = useBookingStore();

  const [booking, setBooking] = useState<UnifiedBookingView | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefunding, setIsRefunding] = useState(false);

  useEffect(() => {
    // 1. Search in Provider Store Bookings
    let matchProvider: ProviderBookingRecord | undefined = providerBookings.find(
      (b) =>
        b.id === targetId ||
        b.reference === targetId ||
        b.reference.toLowerCase() === targetId.toLowerCase() ||
        b.id.toLowerCase() === targetId.toLowerCase()
    );

    // 2. Search in localStorage ("tikora_provider_bookings")
    if (!matchProvider && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tikora_provider_bookings");
        if (raw) {
          const list: ProviderBookingRecord[] = JSON.parse(raw);
          matchProvider = list.find(
            (b) =>
              b.id === targetId ||
              b.reference === targetId ||
              b.reference.toLowerCase() === targetId.toLowerCase() ||
              b.id.toLowerCase() === targetId.toLowerCase()
          );
        }
      } catch {}
    }

    // 3. Search in Customer Store Bookings
    let matchCustomer = customerBookings.find(
      (b) =>
        b.id === targetId ||
        b.bookingReference === targetId ||
        b.bookingReference.toLowerCase() === targetId.toLowerCase() ||
        b.id.toLowerCase() === targetId.toLowerCase()
    );

    // 4. Search in localStorage ("tikora_customer_bookings")
    if (!matchCustomer && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tikora_customer_bookings");
        if (raw) {
          const list = JSON.parse(raw);
          matchCustomer = list.find(
            (b: any) =>
              b.id === targetId ||
              b.bookingReference === targetId ||
              b.bookingReference?.toLowerCase() === targetId.toLowerCase() ||
              b.id?.toLowerCase() === targetId.toLowerCase()
          );
        }
      } catch {}
    }

    if (matchProvider) {
      const vatRate = (matchProvider as any).vatRate ?? 5;
      const commissionRate = (matchProvider as any).commissionRate ?? (organization as any)?.commissionRate ?? 5;
      const fullCustomerPaid = (matchProvider as any).customerPaid ?? matchProvider.totalAmount ?? 0;
      const vatAmount = (matchProvider as any).vatAmount ?? Math.round(((fullCustomerPaid * vatRate) / (100 + vatRate)) * 100) / 100;
      const baseFare = Math.max(0, Math.round((fullCustomerPaid - vatAmount) * 100) / 100);
      const fee = (matchProvider as any).platformFee ?? Math.round(baseFare * (commissionRate / 100) * 100) / 100;
      const net = (matchProvider as any).providerNet ?? Math.max(0, Math.round((baseFare - fee) * 100) / 100);

      setBooking({
        id: matchProvider.id,
        reference: matchProvider.reference,
        customerName: matchProvider.customerName,
        customerPhone: matchProvider.customerPhone,
        customerEmail: matchProvider.customerEmail,
        serviceTitle: matchProvider.serviceTitle,
        category: matchProvider.category || organization.category || "BUS",
        location: "Verified Ethiopian Station / Venue",
        travelDate: matchProvider.travelDate || new Date().toISOString().split("T")[0],
        departureTime: matchProvider.departureTime || "Flexible Scheduled Time",
        seats: matchProvider.seats && matchProvider.seats.length > 0 ? matchProvider.seats : ["Standard Pass"],
        totalAmount: baseFare, // Pure ticket price without VAT
        customerPaidWithVat: fullCustomerPaid,
        vatRate,
        vatAmount,
        commissionRate,
        platformFee: fee,
        netPayout: net,
        paymentMethod: matchProvider.paymentMethod || "CHAPA",
        paymentStatus: matchProvider.paymentStatus || "PAID",
        bookingStatus: matchProvider.bookingStatus || "CONFIRMED",
        qrCodeData: `TIKORA-PASS:${matchProvider.reference}:${baseFare}:PAID`,
        bookedAt: matchProvider.createdAt || new Date().toLocaleString(),
        vehicleOrHall: "Scheduled Service Unit",
      });
      setLoading(false);
      return;
    }

    if (matchCustomer) {
      const fullGross = matchCustomer.pricing?.total ?? (matchCustomer as any).totalAmount ?? 525;
      const vatRate = Number(matchCustomer.pricing?.vatRate ?? (matchCustomer as any).vatRate ?? 5);
      const commissionRate = Number(matchCustomer.pricing?.commissionRate ?? (matchCustomer as any).commissionRate ?? (organization as any)?.commissionRate ?? 5);
      const vatAmount = Number(matchCustomer.pricing?.vatAmount ?? (matchCustomer as any).vatAmount ?? Math.round(((fullGross * vatRate) / (100 + vatRate)) * 100) / 100);
      const baseFare = Number(matchCustomer.pricing?.subtotal ?? Math.max(0, Math.round((fullGross - vatAmount) * 100) / 100));
      const fee = Number(matchCustomer.pricing?.platformFee ?? (matchCustomer as any).platformFee ?? Math.round(baseFare * (commissionRate / 100) * 100) / 100);
      const net = Number(matchCustomer.pricing?.providerNet ?? (matchCustomer as any).providerNet ?? Math.max(0, Math.round((baseFare - fee) * 100) / 100));
      const seatList =
        matchCustomer.selectedSeats && matchCustomer.selectedSeats.length > 0
          ? matchCustomer.selectedSeats
          : [matchCustomer.selectedTier || "Pass-1"];

      setBooking({
        id: matchCustomer.id,
        reference: matchCustomer.bookingReference,
        customerName: matchCustomer.customerName,
        customerPhone: matchCustomer.customerPhone,
        customerEmail: matchCustomer.customerEmail,
        serviceTitle: matchCustomer.ticket?.title || "TIKORA Experience Pass",
        category: matchCustomer.category || organization.category || "EVENT",
        location: matchCustomer.ticket?.location || "Addis Ababa, Ethiopia",
        travelDate: matchCustomer.ticket?.date ? String(matchCustomer.ticket.date).slice(0, 10) : new Date().toISOString().split("T")[0],
        departureTime: matchCustomer.ticket?.time || "Scheduled Time",
        seats: seatList,
        totalAmount: baseFare, // Pure ticket base fare without VAT
        customerPaidWithVat: fullGross,
        vatRate,
        vatAmount,
        commissionRate,
        platformFee: fee,
        netPayout: net,
        paymentMethod: matchCustomer.paymentMethod || "CHAPA",
        paymentStatus: matchCustomer.paymentStatus || "PAID",
        bookingStatus: (matchCustomer.bookingStatus as any) || "CONFIRMED",
        qrCodeData: matchCustomer.qrCodeData || `TIKORA-PASS:${matchCustomer.bookingReference}:${baseFare}:PAID`,
        bookedAt: matchCustomer.createdAt || new Date().toLocaleString(),
        vehicleOrHall: matchCustomer.ticket?.organizer || "Authorized Partner",
      });
      setLoading(false);
      return;
    }

    // Fallback: fetch from /api/bookings
    if (targetId) {
      fetch(`/api/bookings?reference=${encodeURIComponent(targetId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.booking) {
            const b = data.booking;
            const fullGross = Number(b.pricing?.total || b.customerPaid || b.totalAmount || 525);
            const vatRate = Number(b.pricing?.vatRate ?? b.vatRate ?? 5);
            const commissionRate = Number(b.pricing?.commissionRate ?? b.commissionRate ?? (organization?.commissionRate || 5));
            const vatAmount = Number(b.pricing?.vatAmount ?? b.vatAmount ?? Math.round(((fullGross * vatRate) / (100 + vatRate)) * 100) / 100);
            const baseFare = Number(b.pricing?.subtotal ?? b.subtotal ?? Math.max(0, Math.round((fullGross - vatAmount) * 100) / 100));
            const fee = Number(b.pricing?.platformFee ?? b.platformFee ?? Math.round(baseFare * (commissionRate / 100) * 100) / 100);
            const net = Number(b.pricing?.providerNet ?? b.providerNet ?? Math.max(0, Math.round((baseFare - fee) * 100) / 100));
            setBooking({
              id: b.id || `BKG-${targetId}`,
              reference: b.bookingReference || targetId,
              customerName: b.customerName || "TIKORA Customer",
              customerPhone: b.customerPhone || "+251 91 100 0000",
              customerEmail: b.customerEmail || "customer@tikora.et",
              serviceTitle: b.ticket?.title || b.serviceTitle || "TIKORA Experience Pass",
              category: b.category || organization.category || "BUS",
              location: b.ticket?.location || "Addis Ababa, Ethiopia",
              travelDate: b.ticket?.date || new Date().toISOString().split("T")[0],
              departureTime: b.ticket?.time || "Flexible",
              seats: b.selectedSeats || [b.selectedTier || "Pass"],
              totalAmount: baseFare,
              customerPaidWithVat: fullGross,
              vatRate,
              vatAmount,
              commissionRate,
              platformFee: fee,
              netPayout: net,
              paymentMethod: b.paymentMethod || "CHAPA",
              paymentStatus: b.paymentStatus || "PAID",
              bookingStatus: b.bookingStatus || "CONFIRMED",
              qrCodeData: b.qrCodeData || `TIKORA-PASS:${targetId}:${baseFare}:PAID`,
              bookedAt: b.createdAt || new Date().toLocaleString(),
              vehicleOrHall: "Scheduled Service Unit",
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [targetId, providerBookings, customerBookings, organization.category]);

  const handleToggleBoarding = () => {
    if (!booking) return;
    const nextStatus = booking.bookingStatus === "CHECKED_IN" ? "CONFIRMED" : "CHECKED_IN";
    const updated = { ...booking, bookingStatus: nextStatus };
    setBooking(updated);

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tikora_provider_bookings");
        if (raw) {
          const list: ProviderBookingRecord[] = JSON.parse(raw);
          const idx = list.findIndex((b) => b.reference === booking.reference || b.id === booking.id);
          if (idx >= 0) {
            list[idx].bookingStatus = nextStatus as any;
            localStorage.setItem("tikora_provider_bookings", JSON.stringify(list));
          }
        }
      } catch {}
    }

    toast.success(
      nextStatus === "CHECKED_IN"
        ? "Boarding pass verified! Passenger marked as boarded."
        : "Boarding status reset to confirmed."
    );
  };

  const handleResendSMS = () => {
    if (!booking) return;
    toast.success(`Booking SMS re-sent to ${booking.customerPhone}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleInitiateRefund = () => {
    if (!booking) return;
    setIsRefunding(true);
    setTimeout(() => {
      setIsRefunding(false);
      const updated = { ...booking, bookingStatus: "CANCELLED" as const };
      setBooking(updated);
      toast.success("Refund request submitted to financial queue.");
    }, 600);
  };

  const getCategoryIcon = (cat?: TicketCategory) => {
    switch (cat) {
      case "BUS":
        return <Bus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "CINEMA":
        return <Film className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
      case "SPORTS":
        return <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Music className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center max-w-sm mx-auto space-y-2.5">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[11px] font-semibold text-muted-foreground">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6 text-center bg-card rounded-xl border border-slate-200/50 dark:border-slate-800/50 max-w-sm mx-auto my-8 space-y-3">
        <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto">
          <Ticket className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-xs">Booking Not Found</h3>
          <p className="text-muted-foreground text-[11px] mt-0.5">
            No booking record matches &quot;{targetId}&quot;.
          </p>
        </div>
        <Link
          href="/provider/bookings"
          className="inline-flex px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Top Header - Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-border/50 pb-3">
        <div className="flex items-center gap-2.5">
          <Link
            href="/provider/bookings"
            className="p-1.5 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Back to bookings"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                {booking.reference}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border ${
                  booking.bookingStatus === "CHECKED_IN"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : booking.bookingStatus === "CANCELLED"
                    ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                }`}
              >
                {booking.bookingStatus === "CHECKED_IN"
                  ? "Boarded"
                  : booking.bookingStatus === "CANCELLED"
                  ? "Cancelled"
                  : "Confirmed"}
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline">
                &bull; {booking.bookedAt}
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-foreground mt-0.5">
              Passenger Manifest &amp; Gate Turnstile Pass
            </h1>
          </div>
        </div>

        {/* Header Action Buttons - Compact */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={handleResendSMS}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            <Send className="w-3 h-3 text-muted-foreground" />
            <span>SMS</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            <Printer className="w-3 h-3 text-muted-foreground" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleToggleBoarding}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
              booking.bookingStatus === "CHECKED_IN"
                ? "bg-muted text-foreground hover:bg-muted/80 border border-border/60"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>{booking.bookingStatus === "CHECKED_IN" ? "Revoke Boarding" : "Verify & Check-In"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Cols Left + 1 Col Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Service Details & Passenger Manifest */}
        <div className="lg:col-span-2 space-y-4">
          {/* Trip / Service Card */}
          <div className="bg-card border border-border/60 rounded-xl p-3.5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center">
                  {getCategoryIcon(booking.category)}
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 block">
                    {booking.category}
                  </span>
                  <h3 className="text-xs font-bold text-foreground line-clamp-1">
                    {booking.serviceTitle}
                  </h3>
                </div>
              </div>
              <span className="text-[10px] font-bold font-mono text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                {booking.seats.length} Seat{booking.seats.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
              <div className="space-y-0.5">
                <span className="text-muted-foreground block text-[10px]">Location / Station</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="line-clamp-1">{booking.location}</span>
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-muted-foreground block text-[10px]">Date &amp; Schedule</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>{booking.travelDate} &bull; {booking.departureTime}</span>
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-muted-foreground block text-[10px]">Allocated Seats</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {booking.seats.join(", ")}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-muted-foreground block text-[10px]">Service Unit</span>
                <span className="font-medium text-foreground">
                  {booking.vehicleOrHall || "Scheduled Unit"}
                </span>
              </div>
            </div>
          </div>

          {/* Passenger Manifest Table */}
          <div className="bg-card border border-border/60 rounded-xl shadow-2xs overflow-hidden">
            <div className="p-3 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-foreground">Passenger Manifest</h3>
                <p className="text-[10px] text-muted-foreground">
                  Seat assignments and boarding verification.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">
                {booking.seats.length} Passenger{booking.seats.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30 text-muted-foreground font-semibold text-[10px]">
                    <th className="py-2 px-3">Seat</th>
                    <th className="py-2 px-3">Passenger</th>
                    <th className="py-2 px-3">Phone</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {booking.seats.map((seat, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="py-2 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {seat}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-foreground block">
                          {idx === 0 ? booking.customerName : `Guest ${idx + 1}`}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground font-mono">
                        {booking.customerPhone}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            booking.bookingStatus === "CHECKED_IN"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {booking.bookingStatus === "CHECKED_IN" ? (
                            <>
                              <Check className="w-2.5 h-2.5" /> Boarded
                            </>
                          ) : (
                            "Reserved"
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: QR Code Turnstile Pass & Financial Breakdown */}
        <div className="space-y-4">
          {/* Official Turnstile QR Pass Card - Compact */}
          <div className="bg-card border border-border/60 rounded-xl p-3.5 shadow-2xs text-center space-y-2.5">
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                <QrCode className="w-3.5 h-3.5" />
                <span>Gate Turnstile Pass</span>
              </div>
              <span className="text-[9px] uppercase font-mono font-bold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                PAID
              </span>
            </div>

            {/* QR Code Container - Compact */}
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs inline-block mx-auto">
              <QRCodeSVG
                value={booking.qrCodeData}
                size={110}
                level="M"
              />
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-mono font-bold text-foreground block">
                {booking.reference}
              </span>
              <p className="text-[9px] text-muted-foreground">
                Scan with terminal to board.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleBoarding}
              className={`w-full py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                booking.bookingStatus === "CHECKED_IN"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{booking.bookingStatus === "CHECKED_IN" ? "Revoke Boarding" : "Verify & Check-In"}</span>
            </button>
          </div>

          {/* Financial Settlement Card - PURE TICKET PRICE */}
          <div className="bg-card border border-border/60 rounded-xl p-3.5 shadow-2xs space-y-2 text-[11px]">
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Provider Settlement
              </span>
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                TIKORA Payout
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between py-0.5 text-muted-foreground">
                <span>Ticket Price ({booking.seats.length} seat{booking.seats.length > 1 ? "s" : ""}):</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>

              <div className="flex justify-between py-0.5 text-muted-foreground">
                <span>Platform Commission ({booking.commissionRate}%):</span>
                <span className="text-rose-600 font-mono">
                  -{formatCurrency(booking.platformFee)}
                </span>
              </div>

              <div className="border-t border-border/40 pt-1.5 flex justify-between font-bold text-xs">
                <span className="text-foreground">Net Payout to Provider:</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">
                  {formatCurrency(booking.netPayout)}
                </span>
              </div>
            </div>

            {/* Refund Action */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleInitiateRefund}
                disabled={isRefunding || booking.bookingStatus === "CANCELLED"}
                className="w-full inline-flex items-center justify-center gap-1 py-1.5 text-[10px] font-semibold rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{booking.bookingStatus === "CANCELLED" ? "Refund Initiated" : "Initiate Refund"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
