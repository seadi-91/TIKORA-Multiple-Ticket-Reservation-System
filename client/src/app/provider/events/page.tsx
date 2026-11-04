"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Ticket,
  Search,
  Filter,
  Eye,
  Boxes,
} from "lucide-react";
import { EventService } from "@/services/event.service";
import { formatCurrency } from "@/lib/format-currency";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function ProviderEventsPage() {
  const events = EventService.getAllEvents();
  const [search, setSearch] = useState("");

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/provider" className="hover:text-[#B45309]">
              Provider Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0F172A] dark:text-white">Concerts & Festivals</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
            Events & Live Festival Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure multi-tier tickets (Early Bird, Regular, VIP, Tables), manage venues, and track live check-ins.
          </p>
        </div>

        <Link
          href="/provider/events/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Publish New Event</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-3 sm:p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search event title or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#B45309]"
          />
        </div>

        <span className="text-xs text-slate-400">
          <strong>{filtered.length}</strong> events in catalog
        </span>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((evt) => (
          <div
            key={evt.id}
            className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  {evt.categoryDetails?.eventCategory || "Festival"}
                </span>
                <span className="text-xs font-black text-[#B45309] dark:text-amber-400">
                  From {formatCurrency(evt.price)}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white line-clamp-1">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {evt.description}
                </p>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{evt.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{evt.date} • {evt.time}</span>
                </div>
              </div>

              {/* Tiers Preview */}
              {evt.tiers && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Ticket Tiers</span>
                  <div className="flex flex-wrap gap-1.5">
                    {evt.tiers.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {t.name}: {formatCurrency(t.price)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-emerald-600">
                {evt.availableSeats} Passes Left
              </span>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`/events/${evt.id}`}
                  target="_blank"
                  className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Preview</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <ActionDropdown
                  items={[
                    {
                      label: "View Listing",
                      icon: <Eye className="w-3.5 h-3.5" />,
                      href: `/provider/tickets/${evt.id}`,
                    },
                    {
                      label: "Manage Tier Inventory",
                      icon: <Boxes className="w-3.5 h-3.5" />,
                      href: `/provider/inventory`,
                    },
                    {
                      label: "Edit Event Tiers",
                      icon: <Ticket className="w-3.5 h-3.5" />,
                      href: `/provider/tickets/${evt.id}/edit`,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
