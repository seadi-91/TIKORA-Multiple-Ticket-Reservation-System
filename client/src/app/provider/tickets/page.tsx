"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Boxes,
  Ticket,
  AlertTriangle,
} from "lucide-react";
import { TicketService } from "@/services/ticket.service";
import { formatCurrency } from "@/lib/format-currency";
import { TicketCategory } from "@/types/ticket.types";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { useProviderStore } from "@/stores/provider.store";
import { useLanguage } from "@/providers/language-provider";

export default function ProviderTicketsPage() {
  const { organization, bookings, fetchOrganization } = useProviderStore();
  const { t } = useLanguage();
  const allTickets = TicketService.getAllTickets(true);
  const sectorTickets = allTickets.filter((t) => t.category === organization.category);
  const [tickets, setTickets] = useState(sectorTickets);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrganization();
    TicketService.fetchCategories().catch(() => { });
    TicketService.fetchTickets(true).then((all) => {
      setTickets(all.filter((t) => t.category === organization.category));
    });
  }, [organization.category, fetchOrganization]);

  const isCategoryDeactivated =
    organization.isCategoryActive === false ||
    !TicketService.isCategoryActive(organization.category);

  const filtered = tickets.filter((t) => {
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
    <div className="space-y-5">
      {/* Sector Category Deactivated Warning Banner */}
      {isCategoryDeactivated && (
        <div className="rounded-2xl p-4 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 text-foreground flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-extrabold text-amber-800 dark:text-amber-300">
                {t("Operating Sector Deactivated by Platform Administrator")}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25">
                {t("Sector Inactive")}
              </span>
            </div>
            <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 leading-relaxed">
              The <strong>{organization.category}</strong> category has been deactivated by the platform administration.
              All tickets listed below are currently <strong>hidden from customer & guest pages</strong> and cannot receive new reservations until the administrator reactivates the category.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/provider" className="hover:text-[#B45309]">
              {t("Provider Dashboard")}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0F172A] dark:text-white">{t("Tickets Management", "Tickets & Listings")}</span>
          </div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
              {organization.category} Domain
            </span>
            {isCategoryDeactivated ? (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {t("Category Deactivated (Hidden from Customers)")}
              </span>
            ) : (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {t("Category Active")}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{organization.name}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
            {t("Central Ticket Inventory & Pass Catalog")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage ticket types, prices in ETB, and seat allocations strictly isolated to {organization.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/provider/inventory"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>{t("Seat Matrix Overview")}</span>
          </Link>

          <Link
            href="/provider/tickets/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t("Create New Ticket")}</span>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 text-white shadow-sm inline-flex items-center gap-1.5">
              <span>{organization.category} Catalog</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {filtered.length} listings
              </span>
            </span>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Locked to registered sector
            </span>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t("hero.searchPlaceholder", `Search ${organization.category.toLowerCase()} tickets...`)}
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
                <th className="py-3.5 px-4">{t("Ticket / Pass Name")}</th>
                <th className="py-3.5 px-4">{t("Starting Price")}</th>
                <th className="py-3.5 px-4">{t("Total Stock")}</th>
                <th className="py-3.5 px-4">{t("Tickets Sold")}</th>
                <th className="py-3.5 px-4">{t("Remaining Capacity")}</th>
                <th className="py-3.5 px-4">{t("Schedule / Date")}</th>
                <th className="py-3.5 px-4 text-center">{t("Status")}</th>
                <th className="py-3.5 px-5 text-right">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 px-4 text-center text-xs text-muted-foreground">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-foreground text-sm">No ticket listings available</p>
                    <p className="text-[11px] mt-1 max-w-sm mx-auto text-muted-foreground">
                      No tickets match your filter or no listings have been published yet. Click &quot;Create New Ticket&quot; to publish your first pass.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const matchingBookings = (bookings || []).filter((b: any) => {
                    if (b.bookingStatus === "CANCELLED" || b.status === "CANCELLED") return false;
                    const matchId = b.ticketId ? String(b.ticketId) === String(item.id) : b.id === item.id;
                    const matchTitle = b.serviceTitle && (
                      b.serviceTitle.toLowerCase().trim() === item.title.toLowerCase().trim() ||
                      item.title.toLowerCase().includes(b.serviceTitle.toLowerCase()) ||
                      b.serviceTitle.toLowerCase().includes(item.title.toLowerCase())
                    );
                    return matchId || matchTitle;
                  });

                  const bookedCount = matchingBookings.reduce((sum: number, b: any) => {
                    const qty = Number(b.quantity) || (Array.isArray(b.seats) ? b.seats.length : (Array.isArray(b.seatNumbers) ? b.seatNumbers.length : 1));
                    return sum + qty;
                  }, 0);

                  const totalStock = Number(item.totalSeats || 100);
                  const remainingSeats = Math.max(0, totalStock - bookedCount);
                  const occupancyRate = totalStock > 0 ? Math.round((bookedCount / totalStock) * 100) : 0;

                  return (
                    <tr key={item.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-foreground block line-clamp-1">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded border border-slate-200/60 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">{item.location}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-600 dark:text-amber-400">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-foreground block">
                          {totalStock} {t("ticket.seatsLeft", "seats")}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{t("Total Capacity", "Allocated Stock")}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                            {bookedCount} {t("Sold", "sold")}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
                            {occupancyRate}%
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground block">{t("Confirmed passes", "Confirmed Bookings")}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 block">
                          {remainingSeats} {t("left", "seats")}
                        </span>
                        <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">{t("Available inventory", "Remaining Open")}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-foreground block">
                          {item.date}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{item.time}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isCategoryDeactivated || item.categoryIsActive === false ? (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {t("Category Deactivated (Hidden from Customers)", "Hidden from Public")}
                          </span>
                        ) : (
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${remainingSeats > 10
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60"
                                : remainingSeats > 0
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60"
                                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60"
                              }`}
                          >
                            {remainingSeats > 10
                              ? t("status.active", "Available")
                              : remainingSeats > 0
                                ? t("status.lowStock", "Low Stock")
                                : t("status.soldOut", "Sold Out")}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end">
                          <ActionDropdown
                            items={[
                              {
                                label: t("common.viewDetails", "View Ticket Details"),
                                icon: <Eye className="w-3.5 h-3.5" />,
                                href: `/provider/tickets/${item.id}`,
                              },
                              {
                                label: t("common.edit", "Edit Ticket / Pricing"),
                                icon: <Edit className="w-3.5 h-3.5" />,
                                href: `/provider/tickets/${item.id}/edit`,
                              },
                              {
                                label: t("provider.inventory", "Manage Inventory"),
                                icon: <Boxes className="w-3.5 h-3.5" />,
                                href: `/provider/inventory`,
                              },
                              {
                                label: t("common.delete", "Delete Ticket Listing"),
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: "danger",
                                onClick: () => {
                                  if (confirm(`Delete ticket listing "${item.title}"?`)) {
                                    TicketService.deleteTicket(item.id);
                                    setTickets(TicketService.getAllTickets().filter((tObj) => tObj.category === organization.category));
                                  }
                                },
                              },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
