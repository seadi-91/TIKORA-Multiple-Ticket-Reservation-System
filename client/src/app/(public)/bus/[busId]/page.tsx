"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bus,
  MapPin,
  Clock,
  ShieldCheck,
  Wifi,
  Zap,
  ArrowRight,
  User,
  Phone,
  Mail,
  AlertCircle,
  Armchair,
  Check,
  ChevronLeft,
  Loader2,
  Lock,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BusService } from "@/services/bus.service";
import { BookingService } from "@/services/booking.service";
import { BookingSummary } from "@/components/booking/booking-summary";
import { PaymentMethodSelector } from "@/components/payment/payment-method";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { useBookingStore } from "@/stores/booking.store";
import { useAuthStore } from "@/stores/auth.store";
import { userService } from "@/services/user.service";
import { PaymentService } from "@/services/payment.service";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { SeatInfo, BookingRecord } from "@/types/booking.types";
import { TicketItem } from "@/types/ticket.types";

export default function BusDetailPage({ params }: { params: Promise<{ busId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [bus, setBus] = useState<TicketItem | null>(() => BusService.getBusById(resolvedParams.busId) || null);
  const [loading, setLoading] = useState(!bus);

  const { addBooking } = useBookingStore();

  const [seats, setSeats] = useState<SeatInfo[]>(() => BusService.generateBusSeats());
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(["4A"]);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Seats & Info, 2: Payment, 3: Confirmation
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    let isMounted = true;
    BusService.fetchBusById(resolvedParams.busId).then((fetched) => {
      if (isMounted) {
        if (fetched) setBus(fetched);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [resolvedParams.busId]);

  const [passengerName, setPassengerName] = useState(user?.name || "");
  const [passengerPhone, setPassengerPhone] = useState(user?.phone || "");
  const [passengerEmail, setPassengerEmail] = useState(user?.email || "");
  const [paymentMethod, setPaymentMethod] = useState("CHAPA");
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Auto-populate customer info from DB & user store
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.name && !passengerName) setPassengerName(user.name);
      if (user?.phone && !passengerPhone) setPassengerPhone(user.phone);
      if (user?.email && !passengerEmail) setPassengerEmail(user.email);

      userService
        .getProfile()
        .then((profile) => {
          if (profile) {
            if (profile.name) setPassengerName(profile.name);
            if (profile.phone) setPassengerPhone(profile.phone);
            if (profile.email) setPassengerEmail(profile.email);
          }
        })
        .catch((err) => {
          console.warn("Could not fetch user profile from DB:", err);
        });
    }
  }, [isAuthenticated, user]);

  if (loading && !bus) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <p className="text-xs font-semibold text-muted-foreground">Loading bus trip details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
        <Header />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="p-10 rounded-3xl bg-white dark:bg-[#161922] border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <Bus className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <h2 className="text-base font-bold text-foreground">Bus Route Not Found</h2>
            <p className="text-xs text-muted-foreground">
              The requested coach departure could not be found or has already departed.
            </p>
            <Link
              href="/bus"
              className="inline-block px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Browse Bus Routes
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const toggleSeat = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat || !seat.isAvailable) return;

    if (selectedSeatIds.includes(seatId)) {
      if (selectedSeatIds.length === 1) return; // Keep at least one
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seatId));
    } else {
      if (selectedSeatIds.length >= 6) {
        alert("Maximum 6 seats per customer booking.");
        return;
      }
      setSelectedSeatIds([...selectedSeatIds, seatId]);
    }
  };

  const pricing = BookingService.calculatePricing(bus.price, selectedSeatIds.length);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : `/bus/${bus.id}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (!passengerName || !passengerPhone || !passengerEmail) {
      alert("Please complete passenger contact details.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalBooking = async () => {
    if (!isAuthenticated) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : `/bus/${bus.id}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (paymentMethod === "CHAPA") {
      try {
        setIsProcessingPayment(true);
        const returnUrl = typeof window !== "undefined"
          ? `${window.location.origin}/payments/callback?category=BUS&ticketId=${bus.id}`
          : undefined;

        const res = await PaymentService.initializeChapaPayment({
          amount: pricing.total,
          currency: "ETB",
          email: passengerEmail || user?.email || "customer@tikora.et",
          firstName: passengerName.split(" ")[0] || "Passenger",
          lastName: passengerName.split(" ").slice(1).join(" ") || "Guest",
          phone: passengerPhone || user?.phone || "+251911000000",
          ticketId: bus.id,
          ticketTitle: bus.title,
          category: "BUS",
          selectedSeats: selectedSeatIds,
          quantity: selectedSeatIds.length,
          returnUrl,
        });

        if (res.checkoutUrl) {
          const pendingBooking: BookingRecord = {
            id: res.bookingNumber || `BKG-${Date.now()}`,
            bookingReference: res.txRef,
            ticketId: bus.id,
            ticket: bus,
            category: "BUS",
            customerName: passengerName,
            customerEmail: passengerEmail,
            customerPhone: passengerPhone,
            passengers: selectedSeatIds.map((seatId) => ({
              fullName: passengerName,
              phone: passengerPhone,
              email: passengerEmail,
              seatNumber: seatId,
            })),
            selectedSeats: selectedSeatIds,
            quantity: selectedSeatIds.length,
            pricing,
            paymentMethod: "CHAPA",
            paymentStatus: "PENDING",
            bookingStatus: "PENDING",
            createdAt: new Date().toISOString(),
            qrCodeData: `TIKORA-PASS:${res.txRef}:${pricing.total}:PENDING`,
          };
          addBooking(pendingBooking);

          // Persist pending reference and pending booking to storage before redirecting to Chapa
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("tikora_pending_tx_ref", res.txRef);
              localStorage.setItem("tikora_pending_booking", JSON.stringify(pendingBooking));
              sessionStorage.setItem("tikora_pending_tx_ref", res.txRef);
              sessionStorage.setItem("tikora_pending_booking", JSON.stringify(pendingBooking));

              fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ booking: pendingBooking, txRef: res.txRef }),
              }).catch(() => {});
            } catch (storageErr) {
              console.warn("Storage error saving pending booking:", storageErr);
            }
          }

          // Direct browser redirect to Chapa hosted checkout
          window.location.href = res.checkoutUrl;
          return;
        }
      } catch (err: any) {
        alert(err.message || "Failed to initialize payment with Chapa.");
        setIsProcessingPayment(false);
        return;
      }
    }

    const newBooking: BookingRecord = {
      id: `BKG-${Date.now()}`,
      bookingReference: BookingService.generateBookingReference("BUS"),
      ticketId: bus.id,
      ticket: bus,
      category: "BUS",
      customerName: passengerName,
      customerEmail: passengerEmail,
      customerPhone: passengerPhone,
      passengers: selectedSeatIds.map((seatId) => ({
        fullName: passengerName,
        phone: passengerPhone,
        email: passengerEmail,
        seatNumber: seatId,
      })),
      selectedSeats: selectedSeatIds,
      quantity: selectedSeatIds.length,
      pricing,
      paymentMethod,
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
      createdAt: new Date().toISOString(),
      qrCodeData: `TH-PASS:${bus.id}:${selectedSeatIds.join(",")}:${passengerPhone}`,
    };

    addBooking(newBooking);
    setConfirmedBooking(newBooking);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-amber-300/60">
          <Link href="/bus" className="hover:text-[#F59E0B] flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Bus Search</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0F172A] dark:text-white truncate">{bus.title}</span>
        </div>

        {step === 3 && confirmedBooking ? (
          <BookingConfirmation booking={confirmedBooking} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Trip Details & Seat Map or Payment */}
            <div className="lg:col-span-8 space-y-6">
              {/* Trip Overview Card */}
              <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
                {/* Hero Coach Banner if image available */}
                {bus.imageUrl && (
                  <div className="relative w-full h-44 sm:h-60 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bus.imageUrl}
                      alt={bus.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-bold flex items-center gap-1.5 drop-shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{bus.location} • {bus.city}</span>
                      </span>
                      <span className="font-bold px-2 py-0.5 rounded-md bg-amber-600 text-white shadow-xs">
                        {bus.badge || "Verified Route"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#F59E0B] dark:text-amber-300 px-2.5 py-1 rounded-md bg-[#FFFBEB] dark:bg-amber-950">
                      {bus.organizer}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white mt-1">
                      {bus.title}
                    </h1>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 block">
                      Single Seat Fare
                    </span>
                    <span className="text-2xl font-black text-[#F59E0B] dark:text-amber-400">
                      {formatCurrency(bus.price)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#64748B] dark:text-slate-400">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 block">
                      Departure Time (የሚነሳበት ሰዓት)
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-[#0F172A] dark:text-white">
                      <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>{formatDate(bus.date)} at {bus.time}</span>
                    </div>
                    <span>Boarding: {bus.categoryDetails?.boardingStation || bus.location}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 block">Destination</span>
                    <div className="flex items-center gap-1.5 font-bold text-[#0F172A] dark:text-white">
                      <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>{bus.city}</span>
                    </div>
                    <span>Terminal: {bus.categoryDetails?.dropoffStation || `${bus.city} Central Terminal`}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 block">Coach Specs</span>
                    <div className="font-bold text-[#0F172A] dark:text-white">
                      {bus.categoryDetails?.busType || "Luxury Express Coach"}
                    </div>
                    <span>Travel Duration: {bus.duration || "4h 30m"}</span>
                  </div>
                </div>

                {/* Amenities Badges */}
                {bus.amenities && (
                  <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-wrap gap-2">
                    {bus.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-[#0C0E14] border border-[#E2E8F0] dark:border-slate-800 text-[11px] font-semibold text-[#0F172A] dark:text-slate-300"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {step === 1 ? (
                <>
                  {/* Interactive 2x2 Coach Seat Map */}
                  <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
                      <div>
                        <h2 className="text-base font-bold text-[#0F172A] dark:text-white">
                          Select Your Bus Seats (2×2 Layout)
                        </h2>
                        <p className="text-xs text-[#64748B] dark:text-slate-400">
                          Click available seats to reserve. Currently selected:{" "}
                          <strong className="text-[#B45309] dark:text-[#D97706]">{selectedSeatIds.join(", ")}</strong>
                        </p>
                      </div>

                      {/* Seat Map Legend */}
                      <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-md border border-[#E2E8F0] dark:border-slate-800/60 bg-white dark:bg-[#0F1117]" />
                          <span>Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-md bg-[#B45309] text-white flex items-center justify-center text-[9px] font-bold">
                            ✓
                          </div>
                          <span>Selected</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-md bg-gray-200 dark:bg-slate-800 text-gray-400" />
                          <span>Occupied</span>
                        </div>
                      </div>
                    </div>

                    {/* Bus Cabin Visual Layout */}
                    <div className="max-w-md mx-auto p-6 rounded-3xl bg-[#F8FAFC] dark:bg-[#0F1117] border border-[#E2E8F0] dark:border-slate-800 space-y-5">
                      {/* Driver Cockpit Front */}
                      <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-800 text-xs font-bold text-[#64748B] dark:text-slate-300">
                        <span>🚌 Front / Windshield</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <span>Driver Cab</span>
                        </div>
                      </div>

                      {/* Rows Matrix */}
                      <div className="space-y-2.5">
                        {Array.from({ length: 12 }).map((_, rIdx) => {
                          const rowNum = rIdx + 1;
                          const seatA = seats.find((s) => s.id === `${rowNum}A`);
                          const seatB = seats.find((s) => s.id === `${rowNum}B`);
                          const seatC = seats.find((s) => s.id === `${rowNum}C`);
                          const seatD = seats.find((s) => s.id === `${rowNum}D`);

                          const renderSeatBtn = (seat?: SeatInfo) => {
                            if (!seat) return <div className="w-9 h-9" />;
                            const isSelected = selectedSeatIds.includes(seat.id);

                            return (
                              <button
                                type="button"
                                disabled={!seat.isAvailable}
                                onClick={() => toggleSeat(seat.id)}
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                                  isSelected
                                    ? "bg-[#B45309] text-white shadow-xs scale-105"
                                    : seat.isAvailable
                                    ? "bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-slate-300 hover:border-[#B45309]"
                                    : "bg-gray-200 dark:bg-slate-800/40 text-gray-400 dark:text-slate-600/40 cursor-not-allowed"
                                }`}
                                title={`Seat ${seat.id} (${seat.type}) - ${formatCurrency(seat.price)}`}
                              >
                                {seat.id}
                              </button>
                            );
                          };

                          return (
                            <div key={rowNum} className="flex items-center justify-between gap-2">
                              {/* Left Pair (A & B) */}
                              <div className="flex items-center gap-2">
                                {renderSeatBtn(seatA)}
                                {renderSeatBtn(seatB)}
                              </div>

                              {/* Aisle Walkway */}
                              <span className="text-[10px] font-mono text-gray-400 dark:text-emerald-900/60 w-6 text-center">
                                {rowNum}
                              </span>

                              {/* Right Pair (C & D) */}
                              <div className="flex items-center gap-2">
                                {renderSeatBtn(seatC)}
                                {renderSeatBtn(seatD)}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Back of Bus */}
                      <div className="text-center text-[10px] text-gray-400 dark:text-amber-400/40 uppercase tracking-widest pt-2">
                        Rear / Emergency Exit
                      </div>
                    </div>
                  </div>

                  {/* Passenger Information Form */}
                  <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                          Passenger & Contact Information
                        </h3>
                        <p className="text-xs text-[#64748B] dark:text-slate-400">
                          Your digital QR pass and trip SMS alerts will be sent to these details.
                        </p>
                      </div>
                      {isAuthenticated && (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1.5 shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Auto-Filled from Profile</span>
                        </span>
                      )}
                    </div>

                    {!isAuthenticated && (
                      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Please sign in first to book this coach ticket and auto-fill your contact details.</span>
                        </div>
                        <Link
                          href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : `/bus/${bus.id}`)}`}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 transition-colors"
                        >
                          Sign In Now
                        </Link>
                      </div>
                    )}

                    <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                          Lead Passenger Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={passengerName}
                            onChange={(e) => setPassengerName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#B45309]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                          Mobile Phone (Telebirr / SMS)
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={passengerPhone}
                            onChange={(e) => setPassengerPhone(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#B45309]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={passengerEmail}
                            onChange={(e) => setPassengerEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#B45309]"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3 pt-2">
                        <button
                          type="submit"
                          className="w-full py-3 rounded-2xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {!isAuthenticated ? (
                            <>
                              <Lock className="w-4 h-4" />
                              <span>Sign In to Continue & Book ({selectedSeatIds.length} Seats)</span>
                            </>
                          ) : (
                            <>
                              <span>Proceed to Payment ({selectedSeatIds.length} Seats)</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                /* Step 2: Payment Step */
                <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
                    <div>
                      <h2 className="text-base font-bold text-[#0F172A] dark:text-white">
                        Complete Payment Checkout
                      </h2>
                      <p className="text-xs text-[#64748B] dark:text-slate-400">
                        Choose your verified Ethiopian digital wallet or bank card.
                      </p>
                    </div>

                    <button
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-[#B45309] dark:text-[#D97706] hover:underline cursor-pointer"
                    >
                      Change Seats
                    </button>
                  </div>

                  <PaymentMethodSelector
                    selectedMethod={paymentMethod}
                    onSelectMethod={setPaymentMethod}
                    customerPhone={passengerPhone}
                  />

                  <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-gray-50 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleFinalBooking}
                      disabled={isProcessingPayment}
                      className="flex-1 py-3 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Redirecting to Chapa Gateway...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {paymentMethod === "CHAPA"
                              ? `Pay with Chapa (${formatCurrency(pricing.total)})`
                              : `Authorize Payment (${formatCurrency(pricing.total)})`}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Order Summary Sticky Card */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              <BookingSummary
                pricing={pricing}
                selectedSeats={selectedSeatIds}
                ticketTitle={bus.title}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
