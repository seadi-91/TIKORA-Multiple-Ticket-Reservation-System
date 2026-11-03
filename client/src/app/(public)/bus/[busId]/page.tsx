"use client";

import React, { useState, use } from "react";
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
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BusService } from "@/services/bus.service";
import { BookingService } from "@/services/booking.service";
import { BookingSummary } from "@/components/booking/booking-summary";
import { PaymentMethodSelector } from "@/components/payment/payment-method";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { useBookingStore } from "@/stores/booking.store";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { SeatInfo, BookingRecord } from "@/types/booking.types";

export default function BusDetailPage({ params }: { params: Promise<{ busId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const bus = BusService.getBusById(resolvedParams.busId) || BusService.getAllBuses()[0];

  const { addBooking } = useBookingStore();

  const [seats, setSeats] = useState<SeatInfo[]>(() => BusService.generateBusSeats());
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(["4A"]);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Seats & Info, 2: Payment, 3: Confirmation

  const [passengerName, setPassengerName] = useState("Abebe Bekele");
  const [passengerPhone, setPassengerPhone] = useState("+251 91 123 4567");
  const [passengerEmail, setPassengerEmail] = useState("abebe.customer@tickethub.et");
  const [paymentMethod, setPaymentMethod] = useState("TELEBIRR");
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

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
    if (!passengerName || !passengerPhone || !passengerEmail) {
      alert("Please complete passenger contact details.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalBooking = () => {
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
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 block">Departure</span>
                    <div className="flex items-center gap-1.5 font-bold text-[#0F172A] dark:text-white">
                      <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>{formatDate(bus.date)} at {bus.time}</span>
                    </div>
                    <span>Boarding: {bus.categoryDetails?.boardingStation}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 block">Destination</span>
                    <div className="flex items-center gap-1.5 font-bold text-[#0F172A] dark:text-white">
                      <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>{bus.city}</span>
                    </div>
                    <span>Terminal: {bus.categoryDetails?.dropoffStation}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 block">Coach Specs</span>
                    <div className="font-bold text-[#0F172A] dark:text-white">
                      {bus.categoryDetails?.busType}
                    </div>
                    <span>Travel Duration: {bus.duration}</span>
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
                    <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                      Passenger & Contact Information
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-slate-400">
                      Your digital QR pass and trip SMS alerts will be sent to these details.
                    </p>

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
                          <span>Proceed to Payment ({selectedSeatIds.length} Seats)</span>
                          <ArrowRight className="w-4 h-4" />
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
                      className="flex-1 py-3 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Authorize Payment ({formatCurrency(pricing.total)})</span>
                      <ArrowRight className="w-4 h-4" />
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
