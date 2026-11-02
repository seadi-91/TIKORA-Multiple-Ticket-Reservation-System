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
  CheckCircle,
  ArrowRight,
  Ticket as TicketIcon,
} from "lucide-react";
import { TicketItem } from "@/types/ticket.types";
import { formatCurrency } from "@/lib/format-currency";

interface TicketCardProps {
  ticket: TicketItem;
  onBookClick?: (ticket: TicketItem) => void;
}

export function TicketCard({ ticket, onBookClick }: TicketCardProps) {
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case "BUS":
        return {
          icon: Bus,
          color: "text-cyan-600 dark:text-cyan-400",
          bgColor: "bg-cyan-50 border-cyan-200 dark:bg-cyan-500/10 dark:border-cyan-500/30",
          badge: "Intercity Bus",
        };
      case "CINEMA":
        return {
          icon: Film,
          color: "text-purple-600 dark:text-purple-400",
          bgColor: "bg-purple-50 border-purple-200 dark:bg-purple-500/10 dark:border-purple-500/30",
          badge: "Cinema Movie",
        };
      case "EVENT":
        return {
          icon: Calendar,
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30",
          badge: "Concert & Event",
        };
      case "SPORTS":
        return {
          icon: Trophy,
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30",
          badge: "Stadium Sports",
        };
      default:
        return {
          icon: TicketIcon,
          color: "text-indigo-600 dark:text-indigo-400",
          bgColor: "bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30",
          badge: "Ticket",
        };
    }
  };

  const config = getCategoryConfig(ticket.category);
  const CategoryIcon = config.icon;

  const percentAvailable = Math.round(
    (ticket.availableSeats / ticket.totalSeats) * 100
  );

  return (
    <div className="group rounded-3xl bg-white dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-500/40 p-5 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-950/40 flex flex-col justify-between relative overflow-hidden">
      {/* Top row: Category Badge & Seats Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bgColor} ${config.color}`}
          >
            <CategoryIcon className="w-3.5 h-3.5" />
            <span>{config.badge}</span>
          </span>

          {ticket.status === "SELLING_FAST" ? (
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30 animate-pulse">
              Selling Fast
            </span>
          ) : ticket.status === "SOLD_OUT" ? (
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
              Sold Out
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/20">
              {ticket.availableSeats} seats left
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
          {ticket.title}
        </h3>

        {/* Organizer / Provider */}
        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
          <span>{ticket.organizer}</span>
          {ticket.organizerVerified && (
            <span title="Verified Provider" className="inline-flex items-center">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </span>
          )}
        </div>

        {/* Date, Time & Location Specs */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>
              {ticket.date} • <strong className="text-slate-800 dark:text-slate-200">{ticket.time}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="line-clamp-1">{ticket.location}</span>
          </div>
        </div>

        {/* Seats progress bar */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Availability</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">{percentAvailable}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentAvailable < 20
                  ? "bg-rose-500"
                  : percentAvailable < 50
                  ? "bg-amber-500"
                  : "bg-indigo-600 dark:bg-indigo-500"
              }`}
              style={{ width: `${percentAvailable}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Price & Booking Action */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block leading-tight">
            Starting from
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {formatCurrency(ticket.price)}
          </span>
        </div>

        {onBookClick ? (
          <button
            onClick={() => onBookClick(ticket)}
            disabled={ticket.status === "SOLD_OUT"}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <span>Book Seat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Link
            href={`/login?redirect=/tickets/${ticket.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all active:scale-95"
          >
            <span>Book Seat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default TicketCard;
