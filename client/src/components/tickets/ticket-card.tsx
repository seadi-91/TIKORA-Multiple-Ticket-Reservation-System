"use client";

import React from "react";
import Link from "next/link";
import {
  Bus,
  Film,
  Calendar,
  Trophy,
  MapPin,
  Clock,
  Heart,
  ShieldCheck,
  Star,
  ArrowRight,
  QrCode,
  Ticket,
  Eye,
} from "lucide-react";
import { TicketItem } from "@/types/ticket.types";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { TicketStatusBadge } from "./ticket-status";
import { useBookingStore } from "@/stores/booking.store";

interface TicketCardProps {
  ticket: TicketItem;
  viewMode?: "grid" | "list";
  onBookClick?: (ticket: TicketItem) => void;
}

export function TicketCard({ ticket, viewMode = "grid", onBookClick }: TicketCardProps) {
  const { toggleFavorite, isFavorite } = useBookingStore();
  const favorited = isFavorite(ticket.id);

  const getCategoryMeta = () => {
    switch (ticket.category) {
      case "BUS":
        return {
          icon: Bus,
          label: "Bus Line",
          badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          iconBg: "bg-blue-600 text-white",
          linkHref: `/bus/${ticket.id}`,
        };
      case "CINEMA":
        return {
          icon: Film,
          label: "Cinema",
          badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
          iconBg: "bg-purple-600 text-white",
          linkHref: `/cinema/${ticket.id}`,
        };
      case "EVENT":
        return {
          icon: Calendar,
          label: "Festival / Concert",
          badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
          iconBg: "bg-[#B45309] text-white",
          linkHref: `/events/${ticket.id}`,
        };
      case "SPORTS":
        return {
          icon: Trophy,
          label: "Stadium Match",
          badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          iconBg: "bg-emerald-600 text-white",
          linkHref: `/sports/${ticket.id}`,
        };
    }
  };

  const meta = getCategoryMeta();
  const Icon = meta.icon;

  // -------------------------------------------------------------
  // LIST VIEW - Elegant Digital Boarding Ticket
  // -------------------------------------------------------------
  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col md:flex-row items-stretch rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Left Side: Main Ticket Body */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${meta.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeColor}`}>
                    {ticket.category}
                  </span>
                  <TicketStatusBadge status={ticket.status} />
                  {ticket.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {ticket.badge}
                    </span>
                  )}
                </div>
                <Link href={meta.linkHref} className="block group-hover:text-[#B45309] dark:group-hover:text-amber-400 transition-colors">
                  <h3 className="text-base font-bold text-[#0F172A] dark:text-white line-clamp-1">
                    {ticket.title}
                  </h3>
                </Link>
              </div>
            </div>

            <button
              onClick={() => toggleFavorite(ticket.id)}
              aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                favorited
                  ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/50 dark:border-rose-900/40 dark:text-rose-400"
                  : "bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 dark:bg-slate-900/60 dark:border-slate-800"
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#64748B] dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate max-w-xs">{ticket.location}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>{formatDate(ticket.date)} • {ticket.time}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="font-medium text-[#0F172A] dark:text-slate-300">{ticket.organizer}</span>
            </span>
            {ticket.rating && (
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 text-xs ml-auto sm:ml-0">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{ticket.rating}</span>
              </span>
            )}
          </div>
        </div>

        {/* Perforated Stub Divider (Vertical on desktop, horizontal on mobile) */}
        <div className="relative flex md:flex-col items-center justify-between border-t md:border-t-0 md:border-l border-dashed border-slate-300 dark:border-slate-700/80 px-2 md:px-0 py-0 md:py-2">
          {/* Half-circle punch notches */}
          <div className="hidden md:block absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#F8FAFC] dark:bg-[#0F1117] border-b border-slate-300 dark:border-slate-700/80" />
          <div className="hidden md:block absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#F8FAFC] dark:bg-[#0F1117] border-t border-slate-300 dark:border-slate-700/80" />
        </div>

        {/* Right Side: Ticket Stub & Pricing Action */}
        <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-[#12141C] flex flex-row md:flex-col items-center md:justify-center justify-between gap-2.5 shrink-0 md:w-52 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] dark:text-slate-400 block">
              Fare / Pass
            </span>
            <div className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-white mt-0.5">
              {formatCurrency(ticket.price)}
            </div>
            <div className="hidden md:flex items-center justify-center gap-1 text-[10px] text-[#64748B] dark:text-slate-400 mt-1">
              <QrCode className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span>Instant QR Pass</span>
            </div>
          </div>

          <div className="flex items-center md:flex-col gap-2 w-full">
            <Link
              href={meta.linkHref}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all w-full"
              title="View Complete Ticket Details"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>View Details</span>
            </Link>

            <Link
              href={meta.linkHref}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs shadow-xs active:scale-95 transition-all w-full"
            >
              <span>Book Pass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // GRID VIEW - Compact, Balanced & Authentic Boarding Ticket Pass
  // -------------------------------------------------------------
  const getSubheadline = () => {
    if (ticket.categoryDetails?.homeTeam && ticket.categoryDetails?.awayTeam) {
      return `${ticket.categoryDetails.homeTeam} vs ${ticket.categoryDetails.awayTeam}`;
    }
    if (ticket.categoryDetails?.origin && ticket.categoryDetails?.destination) {
      return `${ticket.categoryDetails.origin} → ${ticket.categoryDetails.destination}`;
    }
    if (ticket.categoryDetails?.screenFormat) {
      return `${ticket.categoryDetails.screenFormat} • ${ticket.duration || "IMAX"}`;
    }
    return ticket.badge || `${ticket.category} Pass`;
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-[295px] mx-auto min-h-[350px] sm:min-h-[360px]">
      {/* Top Header Section */}
      <div className="p-3 sm:p-3.5 space-y-2">
        {/* Category Pill, Eye Detail Link & Wishlist */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${meta.iconBg}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeColor} uppercase tracking-wider block leading-tight`}>
                {ticket.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Eye Icon Button for direct navigation to detail page */}
            <Link
              href={meta.linkHref}
              title="View Ticket Details"
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 hover:text-[#B45309] dark:hover:text-[#D97706] hover:border-[#B45309]/30 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>

            {/* Wishlist Toggle Button */}
            <button
              onClick={() => toggleFavorite(ticket.id)}
              aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
              title={favorited ? "Saved to Wishlist" : "Save to Wishlist"}
              className={`p-1 rounded-lg border transition-all cursor-pointer ${
                favorited
                  ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/50 dark:border-rose-900/40 dark:text-rose-400"
                  : "bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 dark:bg-slate-900/60 dark:border-slate-800"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Title (Compact 2-line clamp) */}
        <Link href={meta.linkHref} className="block group-hover:text-[#B45309] dark:group-hover:text-[#D97706] transition-colors pt-0.5">
          <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white line-clamp-2 min-h-[2.2rem] leading-snug">
            {ticket.title}
          </h3>
        </Link>

        {/* Organizer Verification & Rating */}
        <div className="flex items-center justify-between gap-1 text-[11px] text-[#64748B] dark:text-slate-400">
          <span className="font-medium text-[#0F172A] dark:text-slate-300 truncate flex items-center gap-1">
            <span className="truncate">{ticket.organizer}</span>
            {ticket.organizerVerified && (
              <span title="Verified Partner">
                <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
              </span>
            )}
          </span>
          {ticket.rating && (
            <span className="inline-flex items-center gap-0.5 font-bold text-slate-700 dark:text-slate-300 text-[11px] shrink-0">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{ticket.rating}</span>
            </span>
          )}
        </div>
      </div>

      {/* Middle Trip/Schedule Details (Compact) */}
      <div className="px-3 sm:px-3.5 py-2 bg-slate-50/70 dark:bg-[#12141C] border-y border-[#E2E8F0] dark:border-slate-800/80 space-y-1.5 text-[11px] sm:text-xs text-[#64748B] dark:text-slate-400">
        {/* Matchup / Route Subheadline Strip */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-1">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
            {getSubheadline()}
          </span>
          <TicketStatusBadge status={ticket.status} />
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="truncate" title={ticket.location}>{ticket.location}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{formatDate(ticket.date)} • {ticket.time}</span>
          </div>
          {ticket.availableSeats && (
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {ticket.availableSeats} seats
            </span>
          )}
        </div>
      </div>

      {/* Perforated Stub Divider with Notches */}
      <div className="relative border-t border-dashed border-slate-300 dark:border-slate-700/80 my-0">
        {/* Left half-circle notch */}
        <div className="absolute -top-2 -left-2.5 w-4 h-4 rounded-full bg-[#F8FAFC] dark:bg-[#0F1117] border-r border-slate-300 dark:border-slate-700/80" />
        {/* Right half-circle notch */}
        <div className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-[#F8FAFC] dark:bg-[#0F1117] border-l border-slate-300 dark:border-slate-700/80" />
      </div>

      {/* Bottom Ticket Stub Pricing & Dual Actions */}
      <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2 bg-white dark:bg-[#161922]">
        <div>
          <span className="text-[9px] text-[#64748B] dark:text-slate-400 block uppercase font-bold tracking-wider">
            Starting Price
          </span>
          <div className="text-sm sm:text-base font-black text-[#0F172A] dark:text-white leading-tight">
            {formatCurrency(ticket.price)}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Eye Icon Details Link */}
          <Link
            href={meta.linkHref}
            title="View Ticket Details"
            className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
          >
            <Eye className="w-3 h-3 text-slate-600 dark:text-slate-300" />
            <span className="hidden sm:inline">Details</span>
          </Link>

          {/* Book Pass Button */}
          <Link
            href={meta.linkHref}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs shadow-xs active:scale-95 transition-all group-hover:translate-x-0.5"
          >
            <span>Book</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
