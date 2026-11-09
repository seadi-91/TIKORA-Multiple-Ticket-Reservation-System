"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Film,
  Calendar,
  Clock,
  Star,
  MapPin,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Sparkles,
  Loader2,
  Lock,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CinemaService } from "@/services/cinema.service";
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

export default function MovieDetailPage({ params }: { params: Promise<{ movieId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [movie, setMovie] = useState<TicketItem | null>(() => CinemaService.getMovieById(resolvedParams.movieId) || null);
  const [loading, setLoading] = useState(!movie);

  const { addBooking } = useBookingStore();

  const [seats, setSeats] = useState<SeatInfo[]>(() => CinemaService.generateCinemaSeats());
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(["D-6"]);
  const [selectedTime, setSelectedTime] = useState(movie?.time || "08:15 PM");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    let isMounted = true;
    CinemaService.fetchMovieById(resolvedParams.movieId).then((fetched) => {
      if (isMounted) {
        if (fetched) {
          setMovie(fetched);
          if (fetched.time) setSelectedTime(fetched.time);
        }
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [resolvedParams.movieId]);

  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [paymentMethod, setPaymentMethod] = useState("CHAPA");
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Auto-populate customer info from DB & user store
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.name && !customerName) setCustomerName(user.name);
      if (user?.phone && !customerPhone) setCustomerPhone(user.phone);
      if (user?.email && !customerEmail) setCustomerEmail(user.email);

      userService
        .getProfile()
        .then((profile) => {
          if (profile) {
            if (profile.name) setCustomerName(profile.name);
            if (profile.phone) setCustomerPhone(profile.phone);
            if (profile.email) setCustomerEmail(profile.email);
          }
        })
        .catch((err) => {
          console.warn("Could not fetch user profile from DB:", err);
        });
    }
  }, [isAuthenticated, user]);

  if (loading && !movie) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <p className="text-xs font-semibold text-muted-foreground">Loading cinema screening details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
        <Header />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="p-10 rounded-3xl bg-white dark:bg-[#161922] border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <Film className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <h2 className="text-base font-bold text-foreground">Movie Screening Not Found</h2>
            <p className="text-xs text-muted-foreground">
              The requested movie title or screening time could not be found.
            </p>
            <Link
              href="/cinema"
              className="inline-block px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Browse Cinema Showtimes
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
      if (selectedSeatIds.length === 1) return;
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seatId));
    } else {
      if (selectedSeatIds.length >= 8) {
        alert("Maximum 8 seats per movie reservation.");
        return;
      }
      setSelectedSeatIds([...selectedSeatIds, seatId]);
    }
  };

  // Calculate sum of individual selected seat prices
  const baseTotal = selectedSeatIds.reduce((sum, id) => {
    const s = seats.find((seat) => seat.id === id);
    return sum + (s ? s.price : movie.price);
  }, 0);

  const averagePrice = Math.round(baseTotal / selectedSeatIds.length);
  const pricing = BookingService.calculatePricing(averagePrice, selectedSeatIds.length, 0, "CINEMA");

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : `/cinema/${movie.id}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalBooking = async () => {
    if (!isAuthenticated) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : `/cinema/${movie.id}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (paymentMethod === "CHAPA") {
      try {
        setIsProcessingPayment(true);
        const returnUrl = typeof window !== "undefined"
          ? `${window.location.origin}/payments/callback`
          : undefined;

        const res = await PaymentService.initializeChapaPayment({
          amount: pricing.total,
          currency: "ETB",
          email: customerEmail || user?.email || "customer@tikora.et",
          firstName: customerName.split(" ")[0] || "Customer",
          lastName: customerName.split(" ").slice(1).join(" ") || "Guest",
          phone: customerPhone || user?.phone || "+251911000000",
          ticketId: movie.id,
          ticketTitle: movie.title,
          category: "CINEMA",
          selectedSeats: selectedSeatIds,
          quantity: selectedSeatIds.length,
          returnUrl,
        });

        if (res.checkoutUrl) {
          const pendingBooking: BookingRecord = {
            id: res.bookingNumber || `BKG-${Date.now()}`,
            bookingReference: res.txRef,
            ticketId: movie.id,
            ticket: movie,
            category: "CINEMA",
            customerName,
            customerEmail,
            customerPhone,
            passengers: selectedSeatIds.map((seatId) => ({
              fullName: customerName,
              phone: customerPhone,
              email: customerEmail,
              seatNumber: seatId,
            })),
            selectedSeats: selectedSeatIds,
            quantity: selectedSeatIds.length,
            pricing,
            subtotal: pricing.subtotal,
            customerPaid: pricing.total,
            totalAmount: pricing.total,
            vatAmount: pricing.tax,
            vatRate: pricing.vatRate,
            commissionRate: pricing.commissionRate,
            platformFee: pricing.platformCommission,
            providerNet: pricing.providerNet,
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
      bookingReference: BookingService.generateBookingReference("CINEMA"),
      ticketId: movie.id,
      ticket: movie,
      category: "CINEMA",
      customerName,
      customerEmail,
      customerPhone,
      passengers: selectedSeatIds.map((seatId) => ({
        fullName: customerName,
        phone: customerPhone,
        email: customerEmail,
        seatNumber: seatId,
      })),
      selectedSeats: selectedSeatIds,
      quantity: selectedSeatIds.length,
      pricing,
      subtotal: pricing.subtotal,
      customerPaid: pricing.total,
      totalAmount: pricing.total,
      vatAmount: pricing.tax,
      vatRate: pricing.vatRate,
      commissionRate: pricing.commissionRate,
      platformFee: pricing.platformCommission,
      providerNet: pricing.providerNet,
      paymentMethod,
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
      createdAt: new Date().toISOString(),
      qrCodeData: `TH-CINEMA:${movie.id}:${selectedSeatIds.join(",")}:${selectedTime}`,
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
          <Link href="/cinema" className="hover:text-[#F59E0B] flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Movies</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0F172A] dark:text-white truncate">{movie.title}</span>
        </div>

        {step === 3 && confirmedBooking ? (
          <BookingConfirmation booking={confirmedBooking} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols */}
            <div className="lg:col-span-8 space-y-6">
              {/* Movie Header Card */}
              <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
                {/* Hero Screening Banner if image available */}
                {movie.imageUrl && (
                  <div className="relative w-full h-44 sm:h-60 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={movie.imageUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-bold flex items-center gap-1.5 drop-shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{movie.location}</span>
                      </span>
                      <span className="font-bold px-2 py-0.5 rounded-md bg-amber-600 text-white shadow-xs">
                        {movie.badge || "Now Screening"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950">
                      {movie.categoryDetails?.screenFormat || movie.badge || "Laser 4K Atmos"}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white mt-1">
                      {movie.title}
                    </h1>
                    <p className="text-xs text-[#64748B] dark:text-amber-300/70 mt-1">
                      {movie.categoryDetails?.movieGenre || "Cinema Premiere"} • {movie.duration || "2h 30m"} • Rated {movie.categoryDetails?.movieRating || "PG-13"}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 block">
                      Screening Hall
                    </span>
                    <span className="text-sm font-bold text-[#0F172A] dark:text-white">
                      {movie.organizer}
                    </span>
                    <span className="text-xs text-[#F59E0B] dark:text-amber-400 font-semibold block">
                      {movie.categoryDetails?.movieHall || movie.location}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold font-mono mt-1">
                      {seats.filter((s) => s.isAvailable).length} seats left
                    </span>
                  </div>
                </div>

                {/* Showtimes Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Showtime / Starts At:</span>
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      {selectedTime}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {Array.from(new Set([movie.time, "02:30 PM", "05:00 PM", "08:15 PM"].filter(Boolean))).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedTime === t
                            ? "bg-[#F59E0B] text-white shadow-xs"
                            : "bg-gray-100 dark:bg-[#0C0E14] text-[#64748B] dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-800"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {step === 1 ? (
                <>
                  {/* Interactive Cinema Hall Seat Grid */}
                  <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
                      <div>
                        <h2 className="text-base font-bold text-[#0F172A] dark:text-white">
                          Select Your Seats in {movie.categoryDetails?.movieHall || movie.organizer}
                        </h2>
                        <p className="text-xs text-[#64748B] dark:text-slate-400">
                          Selected Seats: <strong className="text-[#F59E0B] dark:text-amber-400">{selectedSeatIds.join(", ")}</strong>
                          {" • "}
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                            {seats.filter((s) => s.isAvailable).length} seats left
                          </span>
                        </p>
                      </div>

                      {/* Legend */}
                      <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-amber-300">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-md border border-[#E2E8F0] dark:border-slate-800/60 bg-white dark:bg-[#0C0E14]" />
                          <span>Standard (280 ETB)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-md bg-purple-100 dark:bg-purple-950/60 border border-purple-300" />
                          <span>VIP (380 ETB)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-md bg-[#F59E0B] text-white text-[9px] font-bold flex items-center justify-center">
                            ✓
                          </div>
                          <span>Selected</span>
                        </div>
                      </div>
                    </div>

                    {/* Cinema Hall Visual Screen & Seats */}
                    <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[#F8FAFC] dark:bg-[#0C0E14] border border-[#E2E8F0] dark:border-slate-800 space-y-6">
                      {/* Curved Screen Banner */}
                      <div className="text-center space-y-1">
                        <div className="w-3/4 mx-auto h-2.5 rounded-full bg-gradient-to-r from-purple-400 via-emerald-400 to-purple-400 shadow-md shadow-emerald-400/20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-amber-300/60">
                          CURVED 4K LASER IMAX SCREEN
                        </span>
                      </div>

                      {/* Seat Rows Matrix */}
                      <div className="space-y-2 pt-2">
                        {["A", "B", "C", "D", "E", "F", "G", "H"].map((rowLetter) => {
                          const isVip = rowLetter === "F" || rowLetter === "G";
                          const isCouple = rowLetter === "H";
                          const rowSeats = seats.filter((s) => s.row === rowLetter);

                          return (
                            <div key={rowLetter} className="flex items-center justify-center gap-1.5 sm:gap-2">
                              <span className="w-5 text-[10px] font-bold text-gray-400 dark:text-amber-400/50 text-center">
                                {rowLetter}
                              </span>

                              <div className="flex items-center gap-1.5 sm:gap-2">
                                {rowSeats.map((seat) => {
                                  const isSelected = selectedSeatIds.includes(seat.id);

                                  return (
                                    <button
                                      key={seat.id}
                                      type="button"
                                      disabled={!seat.isAvailable}
                                      onClick={() => toggleSeat(seat.id)}
                                      className={`rounded-lg text-[10px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                                        isCouple ? "w-14 h-8" : "w-7 h-7 sm:w-8 sm:h-8"
                                      } ${
                                        isSelected
                                          ? "bg-[#B45309] text-white shadow-xs scale-105"
                                          : seat.isAvailable
                                          ? isVip
                                            ? "bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 hover:border-[#B45309]"
                                            : isCouple
                                            ? "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:border-[#B45309]"
                                            : "bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-slate-300 hover:border-[#B45309]"
                                          : "bg-gray-200 dark:bg-slate-800/40 text-gray-400 dark:text-slate-600/40 cursor-not-allowed"
                                      }`}
                                      title={`Seat ${seat.id} (${seat.type}) - ${formatCurrency(seat.price)}`}
                                    >
                                      {seat.number}
                                    </button>
                                  );
                                })}
                              </div>

                              <span className="w-5 text-[10px] font-bold text-gray-400 dark:text-slate-500 text-center">
                                {rowLetter}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-center text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wider pt-2">
                        Row H: Couple Loungers • Rows F-G: VIP Balcony • Rows A-E: Standard Seating
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Card */}
                  <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                        Customer Contact Details
                      </h3>
                      {isAuthenticated && (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Auto-Filled from Profile</span>
                        </span>
                      )}
                    </div>

                    {!isAuthenticated && (
                      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Please sign in first to book this ticket and auto-fill your contact details.</span>
                        </div>
                        <Link
                          href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : `/cinema/${movie.id}`)}`}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 transition-colors"
                        >
                          Sign In Now
                        </Link>
                      </div>
                    )}

                    <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#B45309]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                          Mobile Phone
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
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
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
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
                /* Step 2: Payment */
                <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
                    <div>
                      <h2 className="text-base font-bold text-[#0F172A] dark:text-white">
                        Complete Movie Ticket Payment
                      </h2>
                      <p className="text-xs text-[#64748B] dark:text-slate-400">
                        {movie.title} • {selectedTime} • {selectedSeatIds.join(", ")}
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
                    customerPhone={customerPhone}
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

            {/* Right 4 Cols */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              <BookingSummary
                pricing={pricing}
                selectedSeats={selectedSeatIds}
                ticketTitle={`${movie.title} (${selectedTime})`}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
