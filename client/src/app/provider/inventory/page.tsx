"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Boxes,
  Eye,
  Layers,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Ticket,
  Users,
  X,
  TrendingUp,
  RotateCcw,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { TicketService } from "@/services/ticket.service";
import { TicketCategory, TicketItem } from "@/types/ticket.types";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { useProviderStore } from "@/stores/provider.store";
import { useLanguage } from "@/providers/language-provider";

interface InventoryRow {
  id: string;
  title: string;
  category: TicketCategory;
  date: string;
  time: string;
  location: string;
  totalCapacity: number;
  availableSeats: number;
  soldSeats: number;
  revenue: number;
  price: number;
  fillPercentage: number;
  status: "NORMAL" | "LOW_STOCK" | "SOLD_OUT";
}

export default function InventoryManagementPage() {
  const { organization } = useProviderStore();
  const { t } = useLanguage();
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Seat Adjustment Modal State
  const [adjustModalItem, setAdjustModalItem] = useState<InventoryRow | null>(null);
  const [seatAdjustmentValue, setSeatAdjustmentValue] = useState<number>(5);
  const [adjustmentAction, setAdjustmentAction] = useState<"ADD" | "REMOVE">("ADD");

  const syncInventoryFromData = (ticketsList: TicketItem[], bookingsList: any[]) => {
    const sector = organization.category;
    const filteredTickets = ticketsList.filter(
      (t) => !sector || t.category === sector || t.organizer === organization.name
    );
    const targetTickets = filteredTickets.length > 0 ? filteredTickets : ticketsList;

    const rows: InventoryRow[] = targetTickets.map((t) => {
      // Find matching confirmed bookings for this ticket
      const ticketBookings = bookingsList.filter((b) => {
        if (b.bookingStatus === "CANCELLED" || b.status === "CANCELLED") return false;
        const matchTitle = b.serviceTitle && (
          b.serviceTitle.toLowerCase().trim() === t.title.toLowerCase().trim() ||
          t.title.toLowerCase().includes(b.serviceTitle.toLowerCase()) ||
          b.serviceTitle.toLowerCase().includes(t.title.toLowerCase())
        );
        const matchId =
          (b.ticketId && String(b.ticketId) === String(t.id)) ||
          (b.ticket?.id && String(b.ticket.id) === String(t.id)) ||
          (b.id && String(b.id) === String(t.id));

        return matchTitle || matchId;
      });

      const bookedCountFromBookings = ticketBookings.reduce(
        (sum, b) =>
          sum +
          (Number(b.quantity) ||
            (Array.isArray(b.seats)
              ? b.seats.length
              : Array.isArray(b.seatNumbers)
              ? b.seatNumbers.length
              : 1)),
        0
      );

      const totalCap = Math.max(1, Number(t.totalSeats || 50));
      const effectiveSold =
        bookedCountFromBookings > 0
          ? bookedCountFromBookings
          : Math.max(0, totalCap - (t.availableSeats ?? totalCap));
      const effectiveAvailable = Math.max(0, totalCap - effectiveSold);
      const revenue = effectiveSold * (t.price || 0);

      // Exact Fill Rate Calculation: (Sold / Total Capacity) * 100%
      const fillPercentage = totalCap > 0 ? Math.round((effectiveSold / totalCap) * 100) : 0;

      let status: "NORMAL" | "LOW_STOCK" | "SOLD_OUT" = "NORMAL";
      if (effectiveAvailable === 0) status = "SOLD_OUT";
      else if (effectiveAvailable <= Math.ceil(totalCap * 0.2)) status = "LOW_STOCK";

      return {
        id: String(t.id),
        title: t.title,
        category: t.category,
        date: t.date ? String(t.date).slice(0, 10) : "Upcoming",
        time: t.time || "Scheduled",
        location: t.location || "Addis Ababa, Ethiopia",
        totalCapacity: totalCap,
        availableSeats: effectiveAvailable,
        soldSeats: effectiveSold,
        revenue,
        price: t.price || 0,
        fillPercentage,
        status,
      };
    });

    setInventory(rows);
    setLoading(false);

    // Keep provider store stats synchronized with live inventory & bookings
    try {
      const totalAvail = rows.reduce((acc, r) => acc + r.availableSeats, 0);
      const totalSld = rows.reduce((acc, r) => acc + r.soldSeats, 0);
      const totalBkgs = bookingsList.length;
      useProviderStore.getState().updateOrganization({
        stats: {
          ...organization.stats,
          availableSeats: totalAvail,
          totalTicketsSold: totalSld,
          totalBookings: Math.max(totalBkgs, organization.stats.totalBookings || 0),
        },
      });
    } catch {}
  };

  const loadData = async () => {
    try {
      const tickets = await TicketService.fetchTickets(true);
      let bookings: any[] = [];
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.bookings) && data.bookings.length > 0) {
            bookings = data.bookings;
          }
        }
      } catch {}

      if (bookings.length === 0) {
        const storeB = useProviderStore.getState().bookings;
        bookings = storeB && storeB.length > 0 ? storeB : [];
      }

      syncInventoryFromData(tickets, bookings);
    } catch {
      const localTickets = TicketService.getAllTickets(true);
      const storeB = useProviderStore.getState().bookings;
      const bookings = storeB && storeB.length > 0 ? storeB : [];
      syncInventoryFromData(localTickets, bookings);
    }
  };

  useEffect(() => {
    loadData();
  }, [organization.category]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success("Inventory & fill rates re-synchronized with live bookings");
  };

  const handleOpenAdjustModal = (item: InventoryRow) => {
    setAdjustModalItem(item);
    setSeatAdjustmentValue(5);
    setAdjustmentAction("ADD");
  };

  const handleConfirmAdjustment = async () => {
    if (!adjustModalItem) return;

    const newAvailable =
      adjustmentAction === "ADD"
        ? adjustModalItem.availableSeats + seatAdjustmentValue
        : Math.max(0, adjustModalItem.availableSeats - seatAdjustmentValue);

    const newTotal =
      adjustmentAction === "ADD"
        ? Math.max(adjustModalItem.totalCapacity, adjustModalItem.totalCapacity + seatAdjustmentValue)
        : adjustModalItem.totalCapacity;

    const newSold = Math.max(0, newTotal - newAvailable);
    const newFill = newTotal > 0 ? Math.round((newSold / newTotal) * 100) : 0;
    const newRevenue = newSold * adjustModalItem.price;

    let newStatus: "AVAILABLE" | "LOW_STOCK" | "SOLD_OUT" = "AVAILABLE";
    if (newAvailable === 0) newStatus = "SOLD_OUT";

    let rowStatus: "NORMAL" | "LOW_STOCK" | "SOLD_OUT" = "NORMAL";
    if (newAvailable === 0) rowStatus = "SOLD_OUT";
    else if (newAvailable <= Math.ceil(newTotal * 0.2)) rowStatus = "LOW_STOCK";

    // 1. Update TicketService (which syncs to memory, localStorage, and /api/tickets/[ticketId])
    TicketService.updateTicket(adjustModalItem.id, {
      totalSeats: newTotal,
      availableSeats: newAvailable,
      status: newStatus,
    });

    // 2. Persist to API route
    try {
      await fetch(`/api/tickets/${adjustModalItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalSeats: newTotal,
          availableSeats: newAvailable,
          status: newStatus,
        }),
      });
    } catch {}

    // 3. Update React state immediately
    setInventory((prev) =>
      prev.map((row) =>
        row.id === adjustModalItem.id
          ? {
              ...row,
              totalCapacity: newTotal,
              availableSeats: newAvailable,
              soldSeats: newSold,
              revenue: newRevenue,
              fillPercentage: newFill,
              status: rowStatus,
            }
          : row
      )
    );

    toast.success(
      `Inventory for "${adjustModalItem.title}" updated: ${
        adjustmentAction === "ADD" ? `+${seatAdjustmentValue} seats added` : `-${seatAdjustmentValue} seats held/removed`
      }`
    );
    setAdjustModalItem(null);
  };

  const handleResetCapacity = async (item: InventoryRow) => {
    TicketService.updateTicket(item.id, {
      availableSeats: item.totalCapacity,
      status: "AVAILABLE",
    });

    try {
      await fetch(`/api/tickets/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availableSeats: item.totalCapacity,
          status: "AVAILABLE",
        }),
      });
    } catch {}

    setInventory((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              availableSeats: r.totalCapacity,
              soldSeats: 0,
              revenue: 0,
              fillPercentage: 0,
              status: "NORMAL",
            }
          : r
      )
    );
    toast.success(`Reset capacity for "${item.title}" to full ${item.totalCapacity} available seats.`);
  };

  // Filtered rows
  const filteredInventory = inventory.filter((item) => {
    const matchesQuery =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  // KPI Calculations
  const totalCapacity = inventory.reduce((acc, i) => acc + i.totalCapacity, 0);
  const totalAvailable = inventory.reduce((acc, i) => acc + i.availableSeats, 0);
  const totalSold = inventory.reduce((acc, i) => acc + i.soldSeats, 0);
  const totalRevenue = inventory.reduce((acc, i) => acc + i.revenue, 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;
  const lowStockCount = inventory.filter((i) => i.status === "LOW_STOCK").length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-muted-foreground">{organization.name}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            {t("Seat Inventory & Capacity Allocation")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t("Real-time seat capacity, sold tickets, available stock, accurate fill rates, and captured sales revenue.")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-border/70 bg-card hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-amber-600" : ""}`} />
            <span>{refreshing ? t("Syncing...") : t("Refresh Sync")}</span>
          </button>
          <Link
            href="/provider/tickets/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t("Add Listing")}</span>
          </Link>
        </div>
      </div>

      {/* KPI 5-Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        {/* Total Capacity */}
        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate font-medium">{t("Total Capacity")}</span>
            <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground font-mono">{totalCapacity.toLocaleString()}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{inventory.length} listings</p>
        </div>

        {/* Sold Seats */}
        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate font-medium">{t("Sold / Reserved")}</span>
            <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-blue-600 font-mono">{totalSold.toLocaleString()}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{t("Verified passes", "Confirmed passes")}</p>
        </div>

        {/* Available Seats Left */}
        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate font-medium">{t("Seats Left (Available)")}</span>
            <Ticket className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-600 font-mono">{totalAvailable.toLocaleString()} {t("left")}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{t("Available inventory")}</p>
        </div>

        {/* Gross Revenue */}
        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate font-medium">{t("Captured Revenue")}</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground font-mono truncate">{formatCurrency(totalRevenue)}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{t("From sold seats")}</p>
        </div>

        {/* Fill Rate */}
        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate font-medium">{t("Fill Rate")}</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground font-mono">{overallOccupancy}%</div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>{lowStockCount} {t("low stock listings")}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar - Clean, Compact (NO SECTOR) */}
      <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground">
            {t("Listings Inventory")} ({filteredInventory.length})
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("hero.searchPlaceholder", "Search by title or venue...")}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">{t("All Stock Levels")}</option>
            <option value="NORMAL">{t("Optimal Stock")}</option>
            <option value="LOW_STOCK">{t("Low Stock (<20%)")}</option>
            <option value="SOLD_OUT">{t("status.soldOut", "Sold Out")}</option>
          </select>
        </div>
      </div>

      {/* Inventory Matrix Table (SECTOR COLUMN REMOVED) */}
      <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border/60">
                <th className="py-2.5 px-3.5 min-w-[200px]">{t("Service & Venue")}</th>
                <th className="py-2.5 px-3 min-w-[130px]">{t("Schedule")}</th>
                <th className="py-2.5 px-3 text-right">{t("Unit Price")}</th>
                <th className="py-2.5 px-3 text-center">{t("Total Capacity")}</th>
                <th className="py-2.5 px-3 text-center">{t("Sold")}</th>
                <th className="py-2.5 px-3 text-center min-w-[100px]">{t("Seats Left")}</th>
                <th className="py-2.5 px-3 text-right">{t("Captured Revenue")}</th>
                <th className="py-2.5 px-3 min-w-[150px]">{t("Fill Rate")}</th>
                <th className="py-2.5 px-3 text-center">{t("Status")}</th>
                <th className="py-2.5 px-3.5 text-right">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-xs text-muted-foreground">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-2">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-foreground text-xs">No inventory records available</p>
                    <p className="text-[11px] mt-0.5 max-w-sm mx-auto text-muted-foreground">
                      No listings match your search. Create a ticket listing to populate your seat inventory matrix.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-500/[0.02] transition-colors">
                    {/* Service & Venue */}
                    <td className="py-2.5 px-3.5">
                      <Link
                        href={`/provider/tickets/${item.id}`}
                        className="font-semibold text-foreground hover:text-amber-600 transition-colors block line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-muted-foreground/70 shrink-0" />
                        <span className="line-clamp-1">{item.location}</span>
                      </span>
                    </td>

                    {/* Schedule */}
                    <td className="py-2.5 px-3 text-muted-foreground">
                      <div className="flex items-center gap-1 font-medium text-foreground">
                        <Calendar className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3 text-muted-foreground/70 shrink-0" />
                        <span>{item.time}</span>
                      </div>
                    </td>

                    {/* Unit Price */}
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-foreground">
                      {formatCurrency(item.price)}
                    </td>

                    {/* Total Capacity */}
                    <td className="py-2.5 px-3 text-center font-mono font-medium text-foreground">
                      {item.totalCapacity}
                    </td>

                    {/* Sold Seats */}
                    <td className="py-2.5 px-3 text-center">
                      <Link
                        href={`/provider/tickets/${item.id}`}
                        className="font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline block"
                        title="View booked passengers"
                      >
                        {item.soldSeats} sold
                      </Link>
                      <span className="text-[10px] text-muted-foreground block font-mono">
                        {item.fillPercentage}% fill
                      </span>
                    </td>

                    {/* Available Seats Left */}
                    <td className="py-2.5 px-3 text-center font-mono">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {item.availableSeats} left
                      </span>
                    </td>

                    {/* Captured Revenue */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(item.revenue)}
                    </td>

                    {/* Fill Rate - Fully accurate progress & metrics */}
                    <td className="py-2.5 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-foreground font-mono">{item.fillPercentage}%</span>
                          <span className="text-muted-foreground font-mono text-[9px]">
                            {item.soldSeats}/{item.totalCapacity}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden border border-border/40">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              item.fillPercentage >= 85
                                ? "bg-rose-500"
                                : item.fillPercentage >= 50
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${Math.min(100, Math.max(item.fillPercentage, item.soldSeats > 0 ? 5 : 0))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-center">
                      {item.status === "SOLD_OUT" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                          Sold Out
                        </span>
                      )}
                      {item.status === "LOW_STOCK" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          Low Stock
                        </span>
                      )}
                      {item.status === "NORMAL" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Optimal
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          items={[
                            {
                              label: "View Passenger Manifest",
                              icon: <Users className="w-3.5 h-3.5" />,
                              href: `/provider/tickets/${item.id}`,
                            },
                            {
                              label: "Adjust Seat Allocation",
                              icon: <SlidersHorizontal className="w-3.5 h-3.5" />,
                              onClick: () => handleOpenAdjustModal(item),
                            },
                            {
                              label: "Reset to Full Capacity",
                              icon: <RotateCcw className="w-3.5 h-3.5" />,
                              onClick: () => handleResetCapacity(item),
                            },
                            {
                              label: "View Listing Details",
                              icon: <Eye className="w-3.5 h-3.5" />,
                              href: `/provider/tickets/${item.id}`,
                            },
                            {
                              label: "Edit Pricing & Schedule",
                              icon: <Ticket className="w-3.5 h-3.5" />,
                              href: `/provider/tickets/${item.id}/edit`,
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seat Adjustment Modal */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl shadow-xl max-w-md w-full p-4.5 space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground">Adjust Seat Allocation</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                  {adjustModalItem.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustModalItem(null)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-muted/30 rounded-xl p-2.5 text-xs space-y-1.5 border border-border/50 font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Capacity:</span>
                <span className="font-bold text-foreground">{adjustModalItem.totalCapacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sold / Reserved Seats:</span>
                <span className="font-bold text-blue-600">{adjustModalItem.soldSeats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currently Available Seats:</span>
                <span className="font-bold text-emerald-600">{adjustModalItem.availableSeats}</span>
              </div>
              <div className="flex justify-between border-t border-border/40 pt-1">
                <span className="text-muted-foreground">Current Fill Rate:</span>
                <span className="font-bold text-foreground">{adjustModalItem.fillPercentage}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-foreground">Adjustment Action</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustmentAction("ADD")}
                  className={`py-2 text-xs rounded-xl border text-center transition-colors cursor-pointer ${
                    adjustmentAction === "ADD"
                      ? "border-emerald-600 bg-emerald-500/10 text-emerald-600 font-bold"
                      : "border-border/70 hover:bg-muted text-muted-foreground font-medium"
                  }`}
                >
                  + Add Available Seats
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentAction("REMOVE")}
                  className={`py-2 text-xs rounded-xl border text-center transition-colors cursor-pointer ${
                    adjustmentAction === "REMOVE"
                      ? "border-rose-600 bg-rose-500/10 text-rose-600 font-bold"
                      : "border-border/70 hover:bg-muted text-muted-foreground font-medium"
                  }`}
                >
                  - Hold / Remove Seats
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Number of Seats to {adjustmentAction === "ADD" ? "Add" : "Remove"}
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={seatAdjustmentValue}
                  onChange={(e) => setSeatAdjustmentValue(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-border/70 bg-background text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setAdjustModalItem(null)}
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-border/70 hover:bg-muted text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAdjustment}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer"
              >
                Apply Allocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
