"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Boxes,
} from "lucide-react";
import { TicketService } from "@/services/ticket.service";
import { formatCurrency } from "@/lib/format-currency";
import { TicketCategory } from "@/types/ticket.types";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function ProviderTicketsPage() {
  const allTickets = TicketService.getAllTickets();
  const [tickets, setTickets] = useState(allTickets);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<TicketCategory | "ALL">("ALL");

  const filtered = tickets.filter((t) => {
    if (selectedCat !== "ALL" && t.category !== selectedCat) return false;
    if (
      search &&
      !t.title.toLowerCase().includes(search.toLowerCase()) &&
      !t.location.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

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
            <span className="font-semibold text-[#0F172A] dark:text-white">Tickets & Listings</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
            Central Ticket Inventory & Pass Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage ticket types, prices in ETB, remaining seat allocations, and public availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/provider/inventory"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Seat Matrix Overview</span>
          </Link>

          <Link
            href="/provider/tickets/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Ticket</span>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-nowrap">
            {(["ALL", "BUS", "CINEMA", "EVENT", "SPORTS"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedCat === cat
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800/60 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-foreground"
                }`}
              >
                {cat === "ALL" ? "All Sectors" : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search ticket title or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                <th className="py-3.5 px-4">Ticket / Pass Name</th>
                <th className="py-3.5 px-4">Sector</th>
                <th className="py-3.5 px-4">Schedule / Date</th>
                <th className="py-3.5 px-4">Starting Price</th>
                <th className="py-3.5 px-4">Available Capacity</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-foreground block line-clamp-1">
                      {t.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">{t.location}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800 text-foreground">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-foreground block">
                      {t.date}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{t.time}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(t.price)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {t.availableSeats}
                    </span>
                    <span className="text-muted-foreground"> / {t.totalSeats} seats</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${t.availableSeats > 10
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60"
                          : t.availableSeats > 0
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60"
                        }`}
                    >
                      {t.availableSeats > 10
                        ? "Available"
                        : t.availableSeats > 0
                          ? "Low Stock"
                          : "Sold Out"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end">
                      <ActionDropdown
                        items={[
                          {
                            label: "View Ticket Details",
                            icon: <Eye className="w-3.5 h-3.5" />,
                            href: `/provider/tickets/${t.id}`,
                          },
                          {
                            label: "Edit Ticket / Pricing",
                            icon: <Edit className="w-3.5 h-3.5" />,
                            href: `/provider/tickets/${t.id}/edit`,
                          },
                          {
                            label: "Manage Inventory",
                            icon: <Boxes className="w-3.5 h-3.5" />,
                            href: `/provider/inventory`,
                          },
                          {
                            label: "Delete Ticket Listing",
                            icon: <Trash2 className="w-3.5 h-3.5" />,
                            variant: "danger",
                            onClick: () => {
                              if (confirm(`Delete ticket listing "${t.title}"?`)) {
                                setTickets(tickets.filter((item) => item.id !== t.id));
                              }
                            },
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
