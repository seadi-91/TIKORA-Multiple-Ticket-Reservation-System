"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Users,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  User,
  Phone,
  Mail,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EventService } from "@/services/event.service";
import { BookingService } from "@/services/booking.service";
import { BookingSummary } from "@/components/booking/booking-summary";
import { PaymentMethodSelector } from "@/components/payment/payment-method";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { useBookingStore } from "@/stores/booking.store";
import { useAuthStore } from "@/stores/auth.store";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { BookingRecord } from "@/types/booking.types";

export default function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuthStore();
  const event = EventService.getEventById(resolvedParams.eventId);

  const { addBooking } = useBookingStore();

  const tiers = event?.tiers || (event ? [
    { id: "reg", name: "Regular Admission", price: event.price, available: 500, perks: ["General Entry", "Food Village Access"] },
    { id: "vip", name: "VIP Pass", price: event.price * 2, available: 100, perks: ["Priority Front Zone", "VIP Bar", "Fast Gate"] },
  ] : []);

  const [selectedTier, setSelectedTier] = useState(tiers[0]);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [paymentMethod, setPaymentMethod] = useState("TELEBIRR");
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
        <Header />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="p-10 rounded-3xl bg-white dark:bg-[#161922] border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <h2 className="text-base font-bold text-foreground">Event Not Found</h2>
            <p className="text-xs text-muted-foreground">
              The requested concert, festival, or event could not be found.
            </p>
            <Link
              href="/events"
              className="inline-block px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Browse Upcoming Events
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pricing = BookingService.calculatePricing(selectedTier.price, quantity);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalBooking = () => {
    const newBooking: BookingRecord = {
      id: `BKG-${Date.now()}`,
      bookingReference: BookingService.generateBookingReference("EVENT"),
      ticketId: event.id,
      ticket: event,
      category: "EVENT",
      customerName,
      customerEmail,
      customerPhone,
      passengers: Array.from({ length: quantity }).map((_, i) => ({
        fullName: i === 0 ? customerName : `Guest ${i + 1}`,
        phone: customerPhone,
        email: customerEmail,
        seatNumber: `${selectedTier.name} #${i + 1}`,
      })),
      selectedSeats: [`${selectedTier.name} (x${quantity})`],
      selectedTier: selectedTier.name,
      quantity,
      pricing,
      paymentMethod,
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
      createdAt: new Date().toISOString(),
      qrCodeData: `TH-EVENT:${event.id}:${selectedTier.id}:${quantity}:${customerPhone}`,
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
        <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-amber-300/60">
          <Link href="/events" className="hover:text-[#F59E0B] flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0F172A] dark:text-white truncate">{event.title}</span>
        </div>

        {step === 3 && confirmedBooking ? (
          <BookingConfirmation booking={confirmedBooking} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols */}
            <div className="lg:col-span-8 space-y-6">
              {/* Event Overview Card */}
              <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950">
                      {event.categoryDetails?.eventCategory || "Live Event"}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white mt-1">
                      {event.title}
                    </h1>
                    <p className="text-xs text-[#64748B] dark:text-amber-300/70 mt-1">
                      Organized by <strong className="text-[#0F172A] dark:text-white">{event.organizer}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 block">
                      Starting At
                    </span>
                    <span className="text-2xl font-black text-[#F59E0B] dark:text-amber-400">
                      {formatCurrency(tiers[0].price)}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-300 leading-relaxed">
                  {event.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#64748B] dark:text-slate-400 pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
                  <div className="flex items-center gap-2 font-medium text-[#0F172A] dark:text-white">
                    <Calendar className="w-4 h-4 text-[#F59E0B]" />
                    <span>{formatDate(event.date)} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-[#0F172A] dark:text-white">
                    <MapPin className="w-4 h-4 text-[#F59E0B]" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {step === 1 ? (
                <>
                  {/* Ticket Tier Picker */}
                  <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
                    <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                      1. Select Ticket Tier
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {tiers.map((tier) => {
                        const isSelected = selectedTier.id === tier.id;
                        return (
                          <div
                            key={tier.id}
                            onClick={() => setSelectedTier(tier)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "border-[#F59E0B] bg-[#FFFBEB]/60 dark:bg-amber-950/40 ring-1 ring-[#F59E0B]"
                                : "border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14]"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">{tier.name}</h4>
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isSelected
                                      ? "border-[#F59E0B] bg-[#F59E0B] text-white"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </div>
                              </div>
                              <span className="text-base font-black text-[#F59E0B] dark:text-amber-400 block">
                                {formatCurrency(tier.price)}
                              </span>
                              <ul className="text-[11px] text-[#64748B] dark:text-amber-300/70 space-y-1">
                                {tier.perks.map((p, i) => (
                                  <li key={i} className="flex items-center gap-1">
                                    <span className="text-[#F59E0B]">•</span>
                                    <span>{p}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quantity Picker */}
                    <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                        Quantity of Passes:
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-xl border border-[#E2E8F0] dark:border-slate-800 flex items-center justify-center cursor-pointer text-[#0F172A] dark:text-white hover:bg-gray-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-base font-bold text-[#0F172A] dark:text-white w-6 text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="w-8 h-8 rounded-xl border border-[#E2E8F0] dark:border-slate-800 flex items-center justify-center cursor-pointer text-[#0F172A] dark:text-white hover:bg-gray-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Form */}
                  <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-xs space-y-4">
                    <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                      2. Guest Contact Information
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
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
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
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
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
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3 pt-2">
                        <button
                          type="submit"
                          className="w-full py-3 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Proceed to Payment ({quantity} × {selectedTier.name})</span>
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
                        Complete Event Pass Payment
                      </h2>
                      <p className="text-xs text-[#64748B] dark:text-slate-400">
                        {event.title} • {selectedTier.name} (Qty: {quantity})
                      </p>
                    </div>

                    <button
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-[#F59E0B] dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      Change Tier
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
                selectedTier={`${selectedTier.name} (x${quantity})`}
                ticketTitle={event.title}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
