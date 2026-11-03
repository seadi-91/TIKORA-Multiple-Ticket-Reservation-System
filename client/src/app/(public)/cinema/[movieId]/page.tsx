"use client";

import React, { useState, use } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CinemaService } from "@/services/cinema.service";
import { BookingService } from "@/services/booking.service";
import { BookingSummary } from "@/components/booking/booking-summary";
import { PaymentMethodSelector } from "@/components/payment/payment-method";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { useBookingStore } from "@/stores/booking.store";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { SeatInfo, BookingRecord } from "@/types/booking.types";

export default function MovieDetailPage({ params }: { params: Promise<{ movieId: string }> }) {
  const resolvedParams = use(params);
  const movie = CinemaService.getMovieById(resolvedParams.movieId) || CinemaService.getAllMovies()[0];

  const { addBooking } = useBookingStore();

  const [seats, setSeats] = useState<SeatInfo[]>(() => CinemaService.generateCinemaSeats());
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(["D-6"]);
  const [selectedTime, setSelectedTime] = useState(movie.time || "08:15 PM");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [customerName, setCustomerName] = useState("Abebe Bekele");
  const [customerPhone, setCustomerPhone] = useState("+251 91 123 4567");
  const [customerEmail, setCustomerEmail] = useState("abebe.customer@tikora.et");
  const [paymentMethod, setPaymentMethod] = useState("TELEBIRR");
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

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
  const pricing = BookingService.calculatePricing(averagePrice, selectedSeatIds.length);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalBooking = () => {
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
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950">
                      {movie.categoryDetails?.screenFormat}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white mt-1">
                      {movie.title}
                    </h1>
                    <p className="text-xs text-[#64748B] dark:text-amber-300/70 mt-1">
                      {movie.categoryDetails?.movieGenre} • {movie.duration} • Rated {movie.categoryDetails?.movieRating}
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
                      {movie.categoryDetails?.movieHall}
                    </span>
                  </div>
                </div>

                {/* Showtimes Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                    Select Screening Showtime:
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {["02:30 PM", "05:00 PM", "08:15 PM"].map((t) => (
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
                          Select Your Seats in {movie.categoryDetails?.movieHall}
                        </h2>
                        <p className="text-xs text-[#64748B] dark:text-slate-400">
                          Selected Seats: <strong className="text-[#F59E0B] dark:text-amber-400">{selectedSeatIds.join(", ")}</strong>
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
                    <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                      Customer Contact Details
                    </h3>
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
                          <span>Proceed to Payment ({selectedSeatIds.length} Seats)</span>
                          <ArrowRight className="w-4 h-4" />
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
                      className="flex-1 py-3 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Authorize Payment ({formatCurrency(pricing.total)})</span>
                      <ArrowRight className="w-4 h-4" />
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
