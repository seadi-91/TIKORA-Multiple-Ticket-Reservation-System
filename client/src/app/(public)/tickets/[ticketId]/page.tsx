"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  ChevronLeft,
  ArrowRight,
  Bus,
  Film,
  Music,
  Trophy,
  Ticket,
  Sparkles,
  CheckCircle2,
  Armchair,
  Loader2,
  Share2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TicketService } from "@/services/ticket.service";
import { TicketItem } from "@/types/ticket.types";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { useAuthStore } from "@/stores/auth.store";

export default function UniversalTicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.ticketId;
  const { isAuthenticated } = useAuthStore();

  const [ticket, setTicket] = useState<TicketItem | null>(() => TicketService.getTicketById(ticketId) || null);
  const [loading, setLoading] = useState(!ticket);

  useEffect(() => {
    let isMounted = true;
    TicketService.fetchTicketById(ticketId, true).then((fetched) => {
      if (isMounted) {
        if (fetched) {
          setTicket(fetched);
        }
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [ticketId]);

  const getTimeLabel = (cat: string) => {
    switch (cat) {
      case "CINEMA":
        return "Showtime / Starts At (የሚጀምርበት ሰዓት)";
      case "BUS":
        return "Departure Time (የሚነሳበት ሰዓት)";
      case "SPORTS":
        return "Match Kickoff (የሚጀምርበት ሰዓት)";
      default:
        return "Gate Opens / Starts (የሚጀምርበት ሰዓት)";
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "BUS":
        return <Bus className="w-4 h-4 text-amber-500" />;
      case "CINEMA":
        return <Film className="w-4 h-4 text-purple-500" />;
      case "SPORTS":
        return <Trophy className="w-4 h-4 text-emerald-500" />;
      default:
        return <Music className="w-4 h-4 text-amber-500" />;
    }
  };

  const getDedicatedBookingRoute = (item: TicketItem) => {
    switch (item.category) {
      case "CINEMA":
        return `/cinema/${item.id}`;
      case "BUS":
        return `/bus/${item.id}`;
      case "EVENT":
        return `/events/${item.id}`;
      case "SPORTS":
        return `/sports/${item.id}`;
      default:
        return `/cinema/${item.id}`;
    }
  };

  const getBookingActionText = (cat: string) => {
    switch (cat) {
      case "CINEMA":
        return "Select Seats in Cinema Hall";
      case "BUS":
        return "Select Coach Seats";
      case "SPORTS":
        return "Select Stadium Tribune Passes";
      default:
        return "Select Passes & Book Now";
    }
  };

  if (loading && !ticket) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <p className="text-xs font-semibold text-muted-foreground">Loading ticket listing details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
        <Header />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="p-10 rounded-3xl bg-white dark:bg-[#161922] border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <Ticket className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <h2 className="text-base font-bold text-foreground">Ticket Listing Not Found</h2>
            <p className="text-xs text-muted-foreground">
              The requested pass, cinema screening, or coach journey could not be found or has concluded.
            </p>
            <Link
              href="/search"
              className="inline-block px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Explore All Available Tickets
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const bookedSeats = ticket.totalSeats - ticket.availableSeats;
  const occupancyRate = Math.round((bookedSeats / (ticket.totalSeats || 1)) * 100);

  const isDeactivated =
    ticket.categoryIsActive === false ||
    !TicketService.isCategoryActive(ticket.category);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/search" className="hover:text-amber-600 transition-colors">
              Tickets
            </Link>
            <span>/</span>
            <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-md">
              {ticket.title}
            </span>
          </div>

          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </Link>
        </div>

        {/* Sector Deactivated Alert Banner */}
        {isDeactivated && (
          <div className="rounded-2xl p-4 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                Operating Sector Deactivated by Platform Administration
              </h4>
              <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 leading-relaxed">
                This pass belongs to the <strong>{ticket.category}</strong> category, which has been temporarily deactivated by platform administrators. Customer reservations are currently disabled.
              </p>
            </div>
          </div>
        )}

        {/* Hero Cover Banner: Cloudinary Upload or Selected Default Asset */}
        <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-md bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ticket.imageUrl}
            alt={ticket.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/20" />

          {/* Banner Overlays */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {getCategoryIcon(ticket.category)}
              <span>{ticket.category}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{ticket.rating || 4.9}</span>
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{ticket.organizer}</span>
                </span>
                <span className="text-white/60 text-xs">•</span>
                <span className="text-xs text-white/80 font-medium">Verified Merchant</span>
              </div>

              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-md leading-tight">
                {ticket.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 pt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{ticket.location} • {ticket.city}</span>
                </span>
                {ticket.duration && (
                  <>
                    <span className="text-white/40">•</span>
                    <span>Duration: {ticket.duration}</span>
                  </>
                )}
              </div>
            </div>

            {/* Price Badge */}
            <div className="bg-white/10 dark:bg-black/50 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-left sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                Starting From
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {formatCurrency(ticket.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Primary Schedule & Time Card */}
            <div className="rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Schedule & Departure Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/15 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">
                    {getTimeLabel(ticket.category)}
                  </span>
                  <div className="flex items-center gap-2 text-foreground font-black text-lg sm:text-xl">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <span>{ticket.time}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    {ticket.category === "CINEMA"
                      ? "Auditorium doors open 15 minutes before screening"
                      : "Check-in begins 30 minutes prior to departure"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Date & Day
                  </span>
                  <div className="flex items-center gap-2 text-foreground font-bold text-lg sm:text-xl">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <span>{formatDate(ticket.date)}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    Official scheduled slot
                  </span>
                </div>
              </div>

              {/* Station / Venue Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/50 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Location & Boarding Terminal
                </span>
                <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{ticket.location}</span>
                </p>
                <p className="text-muted-foreground text-[11px] pl-5">
                  City Destination / Venue: {ticket.city}
                </p>
              </div>
            </div>

            {/* Description & Overview */}
            {ticket.description && (
              <div className="rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 shadow-xs space-y-3">
                <h2 className="text-sm font-bold text-foreground">Overview & Details</h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {ticket.description}
                </p>
              </div>
            )}

            {/* Pricing Tiers (if available) */}
            {ticket.tiers && ticket.tiers.length > 0 && (
              <div className="rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-foreground">Ticket Classes & Pricing</h2>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {ticket.tiers.length} Admission Tiers
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ticket.tiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 space-y-2 hover:border-amber-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-foreground text-sm">{tier.name}</h3>
                        <span className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">
                          {formatCurrency(tier.price)}
                        </span>
                      </div>
                      {tier.perks && tier.perks.length > 0 && (
                        <div className="space-y-1 pt-1">
                          {tier.perks.map((perk, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included Amenities & Perks */}
            {ticket.amenities && ticket.amenities.length > 0 && (
              <div className="rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6 shadow-xs space-y-3">
                <h2 className="text-sm font-bold text-foreground">Included Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ticket.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-2 text-xs font-semibold text-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Reservation & Instant Checkout Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-5 sticky top-24">
            <div className="rounded-3xl bg-card border border-slate-200/70 dark:border-slate-800/70 p-6 shadow-md space-y-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Official Reservation Pass
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                    {formatCurrency(ticket.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">per ticket / pass</span>
                </div>
              </div>

              {/* Seat Capacity Progress */}
              <div className="p-3.5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/15 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {ticket.availableSeats} of {ticket.totalSeats} seats open
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${Math.max(5, Math.min(100, Math.round((ticket.availableSeats / (ticket.totalSeats || 1)) * 100)))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Primary Booking Action Button */}
              {isDeactivated ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-extrabold text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-2 text-center"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Sector Deactivated - Booking Disabled</span>
                </button>
              ) : (
                <Link
                  href={
                    isAuthenticated
                      ? getDedicatedBookingRoute(ticket)
                      : `/login?redirect=${encodeURIComponent(getDedicatedBookingRoute(ticket))}`
                  }
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99] text-center"
                >
                  <Armchair className="w-4 h-4" />
                  <span>
                    {!isAuthenticated ? "Sign In to Book" : getBookingActionText(ticket.category)}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {/* Security & Guarantees */}
              <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant verified QR pass delivered to your phone & email</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Accepts Telebirr, CBE Birr, and Chapa with 0% hidden fee</span>
                </div>
              </div>
            </div>

            {/* Provider Contact Micro-Card */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-slate-200/50 dark:border-slate-800/50 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Issued By
              </span>
              <p className="font-bold text-foreground">{ticket.organizer}</p>
              <p className="text-[11px] text-muted-foreground">
                Official ticket provider licensed on the TIKORA central exchange.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
