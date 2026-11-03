"use client";

import React from "react";
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
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { BookingCard } from "@/components/booking/booking-card";
import { useBookingStore } from "@/stores/booking.store";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";

export default function CustomerDashboardOverview() {
  const { bookings, favorites, payments } = useBookingStore();

  const confirmedBookings = bookings.filter((b) => b.bookingStatus === "CONFIRMED");
  const nextUpcomingBooking = confirmedBookings[0];
  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    {
      label: "Active Bookings",
      value: confirmedBookings.length,
      icon: Ticket,
      color: "text-[#B45309] bg-[#B45309]/10 dark:text-[#D97706]",
      href: "/customer/bookings",
    },
    {
      label: "Digital QR Passes",
      value: confirmedBookings.length,
      icon: QrCode,
      color: "text-blue-500 bg-blue-500/10 dark:text-blue-400",
      href: "/customer/tickets",
    },
    {
      label: "Saved Wishlist",
      value: favorites.length,
      icon: Heart,
      color: "text-rose-500 bg-rose-500/10 dark:text-rose-400",
      href: "/customer/favorites",
    },
    {
      label: "Total Payments",
      value: formatCurrency(totalSpent),
      icon: CreditCard,
      color: "text-emerald-500 bg-emerald-500/10 dark:text-emerald-400",
      href: "/customer/payments",
    },
  ];

  return (
    <PageContainer
      title="Welcome back, Abebe!"
      subtitle="Here is an overview of your active bookings, digital passes, and wallet transactions."
      breadcrumbs={[{ label: "Customer Dashboard" }]}
    >
      <div className="space-y-6">
        {/* Top 4 Stat Widgets - Multiple 4-Column Display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Link
                key={idx}
                href={s.href}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-sm transition-all flex items-center justify-between gap-2 group"
              >
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 block truncate">
                    {s.label}
                  </span>
                  <span className="text-sm sm:text-2xl font-black text-[#0F172A] dark:text-white mt-0.5 block truncate">
                    {s.value}
                  </span>
                </div>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform ${s.color}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Next Upcoming Journey / Event Hero Card - Refined Midnight Surface */}
        {nextUpcomingBooking && (
          <div className="rounded-3xl bg-[#0F172A] dark:bg-[#161922] p-6 sm:p-7 text-white border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">
                Next Upcoming Journey
              </span>
              <span className="text-xs font-mono font-bold bg-white/10 text-slate-300 px-2.5 py-0.5 rounded-md">
                Ref: {nextUpcomingBooking.bookingReference}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {nextUpcomingBooking.category} • {nextUpcomingBooking.ticket.organizer}
                </span>
                <h3 className="text-xl sm:text-2xl font-black leading-snug text-white">
                  {nextUpcomingBooking.ticket.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{formatDate(nextUpcomingBooking.ticket.date)} at {nextUpcomingBooking.ticket.time}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{nextUpcomingBooking.ticket.location}</span>
                  </span>
                  {nextUpcomingBooking.selectedSeats.length > 0 && (
                    <span>
                      Seats: <strong className="font-bold text-white">{nextUpcomingBooking.selectedSeats.join(", ")}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/customer/tickets/${nextUpcomingBooking.id}`}
                  className="px-4 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show QR Pass</span>
                </Link>

                <Link
                  href={`/customer/bookings/${nextUpcomingBooking.id}`}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Booking Shortcuts - Multiple Column Display */}
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-3 sm:space-y-4">
          <h3 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
            Quick Booking Shortcuts
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5">
            {[
              { label: "Book Express Bus", href: "/bus", icon: Bus, color: "text-blue-500 bg-blue-500/10" },
              { label: "Cinema Showtimes", href: "/cinema", icon: Film, color: "text-purple-500 bg-purple-500/10" },
              { label: "Concerts & Events", href: "/events", icon: Calendar, color: "text-amber-500 bg-amber-500/10" },
              { label: "Matchday Sports", href: "/sports", icon: Trophy, color: "text-emerald-500 bg-emerald-500/10" },
            ].map((sc, i) => {
              const Icon = sc.icon;
              return (
                <Link
                  key={i}
                  href={sc.href}
                  className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-[#E2E8F0] dark:border-slate-800 hover:border-amber-500 hover:shadow-xs flex items-center gap-2 sm:gap-3 transition-all group"
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${sc.color}`}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-[#0F172A] dark:text-white truncate">{sc.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Bookings List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
              Recent Bookings & Activity
            </h3>
            <Link
              href="/customer/bookings"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({bookings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 3).map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
