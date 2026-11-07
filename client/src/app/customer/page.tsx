"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  QrCode,
  Heart,
  CreditCard,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Bus,
  Film,
  Trophy,
  Music,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Search,
  Compass,
  Phone,
  FileText,
  ChevronRight,
  Download,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useBookingStore } from "@/stores/booking.store";
import { useAuthStore } from "@/stores/auth.store";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";

export default function CustomerDashboardOverview() {
  const { bookings, favorites, payments } = useBookingStore();
  const { user } = useAuthStore();

  const customerName = user?.name || "Customer";

  // Filter confirmed vs past
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === "CONFIRMED");
  const nextUpcomingBooking = confirmedBookings[0];
  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

  // Booking tab filter
  const [bookingFilter, setBookingFilter] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === "UPCOMING") return b.bookingStatus === "CONFIRMED";
    if (bookingFilter === "PAST") return b.bookingStatus === "COMPLETED" || b.bookingStatus === "CANCELLED";
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BUS":
        return <Bus className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "CINEMA":
        return <Film className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "SPORTS":
        return <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Music className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    }
  };

  const stats = [
    {
      label: "Active Bookings",
      value: confirmedBookings.length,
      subtext: "Ready for travel",
      icon: Ticket,
      color: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
      href: "/customer/bookings",
    },
    {
      label: "Digital QR Passes",
      value: confirmedBookings.length,
      subtext: "Offline wallet ready",
      icon: QrCode,
      color: "text-blue-600 bg-blue-500/10 dark:text-blue-400",
      href: "/customer/tickets",
    },
    {
      label: "Saved Wishlist",
      value: favorites.length,
      subtext: "Saved events & routes",
      icon: Heart,
      color: "text-rose-600 bg-rose-500/10 dark:text-rose-400",
      href: "/customer/favorites",
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      subtext: `${payments.length} transactions`,
      icon: CreditCard,
      color: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
      href: "/customer/payments",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Welcome Hero Card with Ambient Glow */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/[0.03] to-card border border-amber-500/20 p-5 sm:p-7 shadow-xs">
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-bold ring-1 ring-amber-500/20">
                <Sparkles className="w-3 h-3 text-amber-600" />
                TIKORA Gold Member
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Account
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Welcome back, {customerName}!
            </h1>

            <p className="text-xs text-muted-foreground">
              Manage your upcoming reservations, access verified digital QR boarding passes, and explore top Ethiopian travel routes and entertainment.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/customer/tickets"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/25 transition-all hover:scale-102"
            >
              <QrCode className="w-4 h-4" />
              <span>My QR Passes</span>
            </Link>

            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-foreground transition-all"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>Book Tickets</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Grid (2x2 on Mobile, 4-Col on Desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              href={s.href}
              className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 shadow-xs hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                  {s.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform ${s.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-black text-foreground truncate">
                  {s.value}
                </div>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 block truncate">
                  {s.subtext}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Next Upcoming Journey Showcase Hero Card */}
      {nextUpcomingBooking && (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white border border-slate-800 p-5 sm:p-7 shadow-md">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                Next Upcoming Journey
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-white/10 text-slate-300 px-2.5 py-0.5 rounded-md">
              Ref: {nextUpcomingBooking.bookingReference}
            </span>
          </div>

          <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                  {nextUpcomingBooking.category}
                </span>
                <span className="text-xs font-semibold text-slate-300 truncate">
                  {nextUpcomingBooking.ticket.organizer}
                </span>
              </div>

              <h3 className="text-base sm:text-xl font-bold leading-snug text-white">
                {nextUpcomingBooking.ticket.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {formatDate(nextUpcomingBooking.ticket.date)} at {nextUpcomingBooking.ticket.time}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate max-w-[200px]">{nextUpcomingBooking.ticket.location}</span>
                </span>
                {nextUpcomingBooking.selectedSeats.length > 0 && (
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">
                    Seats: <strong className="text-white font-mono">{nextUpcomingBooking.selectedSeats.join(", ")}</strong>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
              <Link
                href={`/customer/tickets/${nextUpcomingBooking.id}`}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/30 flex items-center gap-2 hover:scale-102"
              >
                <QrCode className="w-4 h-4" />
                <span>Show QR Pass</span>
              </Link>

              <Link
                href={`/customer/bookings/${nextUpcomingBooking.id}`}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
              >
                Booking Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Booking Shortcuts - 4 Categories */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Explore & Book Tickets
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Direct access to verified Ethiopian bus operators, cinema screenings, and match tickets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          {[
            {
              label: "Intercity Bus",
              sub: "Selam, Sky, Golden",
              href: "/bus",
              icon: Bus,
              color: "text-blue-600 bg-blue-500/10 dark:text-blue-400",
            },
            {
              label: "Cinema Screenings",
              sub: "Century, Edna, Alem",
              href: "/cinema",
              icon: Film,
              color: "text-purple-600 bg-purple-500/10 dark:text-purple-400",
            },
            {
              label: "Concerts & Shows",
              sub: "Millennium, Ghion",
              href: "/events",
              icon: Music,
              color: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
            },
            {
              label: "Premier League",
              sub: "Addis Ababa Stadium",
              href: "/sports",
              icon: Trophy,
              color: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
            },
          ].map((sc, i) => {
            const Icon = sc.icon;
            return (
              <Link
                key={i}
                href={sc.href}
                className="p-3 sm:p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-amber-500/40 hover:bg-amber-500/[0.02] flex items-center gap-3 transition-all group"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${sc.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-foreground block truncate">{sc.label}</span>
                  <span className="text-[10px] text-muted-foreground block truncate">{sc.sub}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Bookings & Passes Feed with Tab Switcher */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Recent Bookings & Activity</h3>
            <p className="text-xs text-muted-foreground">View and manage your digital reservations</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg">
              {(["ALL", "UPCOMING", "PAST"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setBookingFilter(tab)}
                  className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                    bookingFilter === tab
                      ? "bg-white dark:bg-slate-700 text-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "ALL" ? "All" : tab === "UPCOMING" ? "Upcoming" : "Past"}
                </button>
              ))}
            </div>

            <Link
              href="/customer/bookings"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 ml-2"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <Ticket className="w-8 h-8 text-muted-foreground/40 mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-foreground text-xs">No reservations found</p>
                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                  You haven&apos;t booked any tickets yet. Explore buses, cinema releases, concerts, and matchdays.
                </p>
              </div>
              <Link
                href="/search"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Tickets</span>
              </Link>
            </div>
          ) : (
            filteredBookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-amber-500/30 bg-slate-50/50 dark:bg-slate-900/30 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0 mt-0.5">
                    {getCategoryIcon(b.category)}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground text-xs truncate">
                        {b.ticket.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.bookingStatus === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20"
                            : b.bookingStatus === "COMPLETED"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {b.bookingReference}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground text-[11px] flex-wrap">
                      <span>{formatDate(b.ticket.date)} at {b.ticket.time}</span>
                      <span>•</span>
                      <span className="truncate">{b.ticket.location}</span>
                      {b.selectedSeats.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="font-mono font-semibold text-foreground">
                            Seat: {b.selectedSeats.join(", ")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <span className="font-black text-xs text-foreground font-mono">
                    {formatCurrency(b.pricing.total)}
                  </span>

                  <Link
                    href={`/customer/tickets/${b.id}`}
                    className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/customer/bookings/${b.id}`}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-foreground font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Customer Support & Ethiopian Payment Guarantee Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-foreground block">
              24/7 TIKORA Passenger & Customer Helpline
            </span>
            <span className="text-[11px] text-muted-foreground">
              Questions about seat transfers, bus departure stations, or instant Telebirr refunds?
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:+251911000000"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400 font-bold font-mono text-xs shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+251 911 000 000</span>
          </a>
        </div>
      </div>
    </div>
  );
}
