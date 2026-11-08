"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight, MapPin, Calendar, Clock, Eye } from "lucide-react";
import { TicketItem, TicketCategory } from "@/types/ticket.types";
import { formatCurrency } from "@/lib/format-currency";
import { useBookingStore } from "@/stores/booking.store";
import { useAuthStore } from "@/stores/auth.store";

interface TicketCardProps {
  ticket: TicketItem;
  viewMode?: "grid" | "list";
  onBookClick?: (ticket: TicketItem) => void;
}

// Fixed, uniform, high-quality representative image per category
export const FIXED_CATEGORY_IMAGES: Record<TicketCategory, string> = {
  BUS: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
  CINEMA: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
  EVENT: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
  SPORTS: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
};

export function TicketCard({ ticket, viewMode = "grid" }: TicketCardProps) {
  const { toggleFavorite, isFavorite } = useBookingStore();
  const favorited = isFavorite(ticket.id);

  const getCategoryMeta = () => {
    switch (ticket.category) {
      case "BUS":
        return {
          label: "Bus",
          linkHref: `/bus/${ticket.id}`,
        };
      case "CINEMA":
        return {
          label: "Cinema",
          linkHref: `/cinema/${ticket.id}`,
        };
      case "EVENT":
        return {
          label: "Event",
          linkHref: `/events/${ticket.id}`,
        };
      case "SPORTS":
        return {
          label: "Sports",
          linkHref: `/sports/${ticket.id}`,
        };
    }
  };

  const { isAuthenticated } = useAuthStore();
  const meta = getCategoryMeta();
  const cardImage = ticket.imageUrl || FIXED_CATEGORY_IMAGES[ticket.category] || FIXED_CATEGORY_IMAGES.BUS;
  const targetHref = meta.linkHref;
  const bookHref = isAuthenticated
    ? targetHref
    : `/login?redirect=${encodeURIComponent(targetHref)}`;

  // -------------------------------------------------------------
  // LIST VIEW - Modern, Balanced & Cohesive Brand Style
  // -------------------------------------------------------------
  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-row items-stretch rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/90 dark:border-slate-800/90 hover:border-amber-500/40 dark:hover:border-amber-500/30 hover:shadow-md transition-all duration-300 overflow-hidden w-full min-h-[130px]">
        {/* Left Side: Fixed Image Thumbnail with 4:3 Proportion */}
        <div className="relative w-32 sm:w-44 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Link href={`/tickets/${ticket.id}`} className="block w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cardImage}
              alt={ticket.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />

          {/* Category Label without Background */}
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 text-[8px] sm:text-[9px] font-black text-amber-400 uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] pointer-events-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
            </span>
            {meta.label}
          </span>

          {/* Bottom City Overlay */}
          <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-white/95 drop-shadow-md flex items-center gap-1 truncate max-w-[90%] pointer-events-none">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{ticket.city || ticket.location}</span>
          </span>
        </div>

        {/* Center & Right: Information & Actions */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/tickets/${ticket.id}`}
                className="block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight line-clamp-1">
                  {ticket.title}
                </h3>
              </Link>

              {/* Wishlist Heart & Detail Eye */}
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/tickets/${ticket.id}`}
                  title="View Details"
                  aria-label="View Details"
                  className="p-1.5 rounded-full text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => toggleFavorite(ticket.id)}
                  aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    favorited
                      ? "bg-rose-50 text-rose-500 dark:bg-rose-950/40"
                      : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${favorited ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-medium truncate">{ticket.organizer}</span>
              {ticket.date && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
                    <Calendar className="w-3 h-3 text-amber-500/80" />
                    {ticket.date}
                  </span>
                </>
              )}
              {ticket.time && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
                    <Clock className="w-3 h-3 text-amber-500/80" />
                    {ticket.time}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-800/80 mt-2">
            <div>
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 block leading-none tracking-wider">
                From
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-mono mt-0.5 block">
                {formatCurrency(ticket.price)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href={`/tickets/${ticket.id}`}
                title="View Full Ticket Details"
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-amber-500/10 dark:bg-slate-800 dark:hover:bg-amber-500/20 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/80 dark:border-slate-700/80 transition-all flex items-center justify-center cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={bookHref}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs hover:shadow-amber-600/20 active:scale-95 flex items-center gap-1.5"
              >
                <span>Book</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // GRID VIEW - Modern, Tall & Elegant Ticket Pass Design
  // -------------------------------------------------------------
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/90 dark:border-slate-800/90 hover:border-amber-500/50 dark:hover:border-amber-500/40 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-300 overflow-hidden w-full h-full">
      {/* Top: 4:3 Ratio Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        <Link href={`/tickets/${ticket.id}`} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cardImage}
            alt={ticket.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Soft Contrast Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/25 pointer-events-none" />

        {/* Top-Left: Category Label without Background */}
        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black text-amber-400 uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] pointer-events-none">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
          </span>
          {meta.label}
        </span>

        {/* Top-Right: Quick View Eye Icon + Glass Wishlist Button */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <Link
            href={`/tickets/${ticket.id}`}
            title="View Ticket Details"
            aria-label="View Ticket Details"
            className="p-1.5 sm:p-2 rounded-full backdrop-blur-md bg-black/45 text-white hover:bg-black/75 hover:text-amber-400 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => toggleFavorite(ticket.id)}
            aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
            title={favorited ? "Saved" : "Save"}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              favorited
                ? "bg-rose-500 text-white shadow-xs"
                : "bg-black/40 text-white hover:bg-black/65 hover:text-rose-400"
            }`}
          >
            <Heart className={`w-3 h-3 ${favorited ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Bottom Image Overlay: Location Pin & Time Tag */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white drop-shadow-sm pointer-events-none">
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold truncate max-w-[70%]">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{ticket.city || ticket.location}</span>
          </span>
          {ticket.time && (
            <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-medium text-white/90 shrink-0 font-mono">
              <Clock className="w-2.5 h-2.5 text-amber-400 shrink-0" />
              <span>{ticket.time}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between gap-2.5">
        <div className="min-w-0">
          <Link
            href={`/tickets/${ticket.id}`}
            className="block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
          >
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight line-clamp-1 leading-snug">
              {ticket.title}
            </h3>
          </Link>

          {/* Organizer & Date Row */}
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span className="truncate max-w-[62%] font-medium">
              {ticket.organizer}
            </span>
            {ticket.date && (
              <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500 shrink-0 text-[10px] font-mono">
                <Calendar className="w-2.5 h-2.5 text-amber-500/70 shrink-0" />
                <span>{ticket.date.replace(/^\d{4}-/, "")}</span>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Bar: Dashed Divider, Bold ETB Price, Eye Icon & Brand Book CTA */}
        <div className="pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 block leading-tight tracking-wider">
              From
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono truncate block mt-0.5">
              {formatCurrency(ticket.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Eye Icon for Detail View */}
            <Link
              href={`/tickets/${ticket.id}`}
              title="View Ticket Details"
              aria-label="View Ticket Details"
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-amber-500/10 dark:bg-slate-800 dark:hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/80 dark:border-slate-700/80 transition-all flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={bookHref}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs hover:shadow-amber-600/25 active:scale-95 flex items-center gap-1 shrink-0"
            >
              <span>Book</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
