"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Loader2,
  Lock,
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
import { userService } from "@/services/user.service";
import { PaymentService } from "@/services/payment.service";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { BookingRecord } from "@/types/booking.types";
import { TicketItem, TicketTier } from "@/types/ticket.types";

export default function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [event, setEvent] = useState<TicketItem | null>(() => EventService.getEventById(resolvedParams.eventId) || null);
  const [loading, setLoading] = useState(!event);

  const { addBooking } = useBookingStore();

  useEffect(() => {
    let isMounted = true;
    EventService.fetchEventById(resolvedParams.eventId).then((fetched) => {
      if (isMounted) {
        if (fetched) setEvent(fetched);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [resolvedParams.eventId]);

  const tiers = event?.tiers || (event ? [
    { id: "reg", name: "Regular Admission", price: event.price, available: 500, perks: ["General Entry", "Food Village Access"] },
    { id: "vip", name: "VIP Pass", price: event.price * 2, available: 100, perks: ["Priority Front Zone", "VIP Bar", "Fast Gate"] },
  ] : []);

  const [selectedTierId, setSelectedTierId] = useState<string>("reg");

  const activeTier =
    tiers.find((t) => t.id === selectedTierId) ||
    tiers[0] || {
      id: "reg",
      name: "Regular Admission",
      price: event?.price || 0,
      available: 500,
      perks: ["General Entry"],
    };

  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  if (loading && !event) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <p className="text-xs font-semibold text-muted-foreground">Loading event details...</p>
        </main>
        <Footer />
      </div>
    );
  }

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

  const pricing = BookingService.calculatePricing(activeTier.price, quantity);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : `/events/${event.id}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalBooking = async () => {
    if (!isAuthenticated) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : `/events/${event.id}`;
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
          firstName: customerName.split(" ")[0] || "Guest",
          lastName: customerName.split(" ").slice(1).join(" ") || "Customer",
          phone: customerPhone || user?.phone || "+251911000000",
          ticketId: event.id,
          ticketTitle: event.title,
          category: "EVENT",
          selectedTier: activeTier.name,
          quantity,
          returnUrl,
        });

        if (res.checkoutUrl) {
          const pendingBooking: BookingRecord = {
            id: res.bookingNumber || `BKG-${Date.now()}`,
            bookingReference: res.txRef,
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
              seatNumber: `${activeTier.name} #${i + 1}`,
            })),
            selectedSeats: [`${activeTier.name} (x${quantity})`],
            selectedTier: activeTier.name,
            quantity,
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
        seatNumber: `${activeTier.name} #${i + 1}`,
      })),
      selectedSeats: [`${activeTier.name} (x${quantity})`],
      selectedTier: activeTier.name,
      quantity,
      pricing,
      paymentMethod,
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
      createdAt: new Date().toISOString(),
      qrCodeData: `TH-EVENT:${event.id}:${activeTier.id}:${quantity}:${customerPhone}`,
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
                {/* Hero Event Banner if image available */}
                {event.imageUrl && (
                  <div className="relative w-full h-44 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-bold flex items-center gap-1.5 drop-shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{event.location} • {event.city}</span>
                      </span>
                      <span className="font-bold px-2 py-0.5 rounded-md bg-amber-600 text-white shadow-xs">
                        {event.badge || "Live Event"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950">
                      {event.categoryDetails?.eventCategory || "Live Concert & Event"}
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
                    <span className="text-2xl font-black text-[#F59E0B] dark:text-amber-400 block">
                      {formatCurrency(tiers[0]?.price || event.price)}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold font-mono mt-1">
                      {event.availableSeats !== undefined ? event.availableSeats : 185} passes left
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-300 leading-relaxed">
                  {event.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#64748B] dark:text-slate-400 pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Event Starts / Gate Opens
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-[#0F172A] dark:text-white">
                      <Clock className="w-4 h-4 text-[#F59E0B]" />
                      <span>{formatDate(event.date)} at {event.time}</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Venue & Location
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-[#0F172A] dark:text-white">
                      <MapPin className="w-4 h-4 text-[#F59E0B]" />
                      <span>{event.location}</span>
                    </div>
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
                        const isSelected = activeTier.id === tier.id;
                        return (
                          <div
                            key={tier.id}
                            onClick={() => setSelectedTierId(tier.id)}
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
                                {tier.perks.map((p: string, i: number) => (
                                  <li key={i} className="flex items-center gap-1">
                                    <span className="text-[#F59E0B]">•</span>
                                    <span>{p}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                                  {tier.available !== undefined ? tier.available : Math.floor((event.availableSeats || 185) / tiers.length)} tickets left
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium">In stock</span>
                              </div>
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
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                        2. Guest Contact Information
                      </h3>
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
                          <span>Please sign in first to book this event ticket and auto-fill your contact details.</span>
                        </div>
                        <Link
                          href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : `/events/${event.id}`)}`}
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
                          {!isAuthenticated ? (
                            <>
                              <Lock className="w-4 h-4" />
                              <span>Sign In to Continue & Book ({quantity} × {activeTier.name})</span>
                            </>
                          ) : (
                            <>
                              <span>Proceed to Payment ({quantity} × {activeTier.name})</span>
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
                        Complete Event Pass Payment
                      </h2>
                      <p className="text-xs text-[#64748B] dark:text-slate-400">
                        {event.title} • {activeTier.name} (Qty: {quantity})
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
                selectedTier={`${activeTier.name} (x${quantity})`}
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
