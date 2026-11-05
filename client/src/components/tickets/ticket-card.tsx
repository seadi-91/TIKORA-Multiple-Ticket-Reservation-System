"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { TicketItem, TicketCategory } from "@/types/ticket.types";
import { formatCurrency } from "@/lib/format-currency";
import { useBookingStore } from "@/stores/booking.store";

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
          label: "BUS",
          badgeColor: "bg-blue-600 text-white",
          linkHref: `/bus/${ticket.id}`,
        };
      case "CINEMA":
        return {
          label: "CINEMA",
          badgeColor: "bg-purple-600 text-white",
          linkHref: `/cinema/${ticket.id}`,
        };
      case "EVENT":
        return {
          label: "EVENT",
          badgeColor: "bg-amber-600 text-white",
          linkHref: `/events/${ticket.id}`,
        };
      case "SPORTS":
        return {
          label: "SPORTS",
          badgeColor: "bg-emerald-600 text-white",
          linkHref: `/sports/${ticket.id}`,
        };
    }
  };

  const meta = getCategoryMeta();
  const cardImage = FIXED_CATEGORY_IMAGES[ticket.category] || FIXED_CATEGORY_IMAGES.BUS;

  // -------------------------------------------------------------
  // LIST VIEW - Compact & Uncluttered
  // -------------------------------------------------------------
  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-row items-stretch rounded-xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden w-full max-w-3xl">
        {/* Left Side: Fixed Image Thumbnail */}
        <div className="relative w-28 sm:w-36 h-24 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={cardImage}
            alt={ticket.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <span className={`absolute top-1.5 left-1.5 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-xs ${meta.badgeColor}`}>
            {meta.label}
          </span>
        </div>

        {/* Center: Essential Info */}
        <div className="flex-1 p-2.5 flex flex-col justify-between min-w-0">
          <div>
            <Link
              href={meta.linkHref}
              className="block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
            >
              <h3 className="text-xs sm:text-sm font-bold text-foreground tracking-tight line-clamp-1">
                {ticket.title}
              </h3>
            </Link>
            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
              {ticket.organizer} • {ticket.city || ticket.location}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[8px] uppercase font-bold text-muted-foreground block leading-none">Starting</span>
              <span className="text-xs sm:text-sm font-black text-foreground font-mono">{formatCurrency(ticket.price)}</span>
            </div>

            <Link
              href={meta.linkHref}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-[10px] shadow-xs active:scale-95 transition-all flex items-center gap-1"
            >
              <span>Book</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // GRID VIEW - Reduced Width (by >20px), Compact & Uncluttered
  // -------------------------------------------------------------
  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden w-full max-w-[240px] mx-auto">
      {/* Top: Fixed Category Image */}
      <div className="relative h-28 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={cardImage}
          alt={ticket.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Gradient for image depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Category Badge */}
        <span className={`absolute top-2 left-2 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-xs ${meta.badgeColor}`}>
          {meta.label}
        </span>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={() => toggleFavorite(ticket.id)}
          aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
          title={favorited ? "Saved" : "Save"}
          className={`absolute top-2 right-2 p-1 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            favorited
              ? "bg-rose-500 text-white shadow-xs"
              : "bg-black/40 text-white hover:bg-black/60 hover:text-rose-400"
          }`}
        >
          <Heart className={`w-3 h-3 ${favorited ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Card Content - Clean & Minimalist */}
      <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={meta.linkHref}
            className="block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
          >
            <h3 className="text-xs font-bold text-foreground tracking-tight line-clamp-2 leading-snug">
              {ticket.title}
            </h3>
          </Link>
          <p className="text-[10px] text-muted-foreground truncate mt-0.5">
            {ticket.organizer} • {ticket.city || ticket.location}
          </p>
        </div>

        {/* Bottom Price & Single CTA Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1.5">
          <div>
            <span className="text-[8px] uppercase font-bold text-muted-foreground block leading-none">
              Starting
            </span>
            <div className="text-xs sm:text-sm font-black text-foreground font-mono leading-tight mt-0.5">
              {formatCurrency(ticket.price)}
            </div>
          </div>

          <Link
            href={meta.linkHref}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-[10px] sm:text-[11px] shadow-xs active:scale-95 transition-all flex items-center gap-1 shrink-0"
          >
            <span>Book</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
