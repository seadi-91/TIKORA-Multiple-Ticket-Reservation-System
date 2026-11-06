"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bus,
  Eye,
  Film,
  Layers,
  Music,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Ticket,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { TicketService } from "@/services/ticket.service";
import { TicketCategory } from "@/types/ticket.types";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { useProviderStore } from "@/stores/provider.store";

interface InventoryRow {
  id: string;
  title: string;
  category: TicketCategory;
  date: string;
  time: string;
  location: string;
  totalCapacity: number;
  availableSeats: number;
  price: number;
  status: "NORMAL" | "LOW_STOCK" | "SOLD_OUT";
}

export default function InventoryManagementPage() {
  const { organization } = useProviderStore();
  const allTickets = TicketService.getAllTickets().filter((t) => t.category === organization.category);

  // Initial inventory state based on tickets
  const [inventory, setInventory] = useState<InventoryRow[]>(
    allTickets.map((t) => {
      let status: "NORMAL" | "LOW_STOCK" | "SOLD_OUT" = "NORMAL";
      if (t.availableSeats === 0) status = "SOLD_OUT";
      else if (t.availableSeats <= Math.ceil(t.totalSeats * 0.2)) status = "LOW_STOCK";

      return {
        id: t.id,
        title: t.title,
        category: t.category,
        date: t.date,
        time: t.time,
        location: t.location,
        totalCapacity: t.totalSeats,
        availableSeats: t.availableSeats,
        price: t.price,
        status,
      };
    })
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    const sectorTickets = TicketService.getAllTickets().filter(
      (t) => t.category === organization.category
    );
    setInventory(
      sectorTickets.map((t) => {
        let status: "NORMAL" | "LOW_STOCK" | "SOLD_OUT" = "NORMAL";
        if (t.availableSeats === 0) status = "SOLD_OUT";
        else if (t.availableSeats <= Math.ceil(t.totalSeats * 0.2)) status = "LOW_STOCK";

        return {
          id: t.id,
          title: t.title,
          category: t.category,
          date: t.date,
          time: t.time,
          location: t.location,
          totalCapacity: t.totalSeats,
          availableSeats: t.availableSeats,
          price: t.price,
          status,
        };
      })
    );
  }, [organization.category]);

  // Seat Adjustment Modal State
  const [adjustModalItem, setAdjustModalItem] = useState<InventoryRow | null>(null);
  const [seatAdjustmentValue, setSeatAdjustmentValue] = useState<number>(0);
  const [adjustmentAction, setAdjustmentAction] = useState<"ADD" | "REMOVE">("ADD");

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
  const totalSold = totalCapacity - totalAvailable;
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;
  const lowStockCount = inventory.filter((i) => i.status === "LOW_STOCK").length;

  const handleOpenAdjustModal = (item: InventoryRow) => {
    setAdjustModalItem(item);
    setSeatAdjustmentValue(5);
    setAdjustmentAction("ADD");
  };

  const handleConfirmAdjustment = () => {
    if (!adjustModalItem) return;

    setInventory((prev) =>
      prev.map((row) => {
        if (row.id !== adjustModalItem.id) return row;

        const newAvailable =
          adjustmentAction === "ADD"
            ? row.availableSeats + seatAdjustmentValue
            : Math.max(0, row.availableSeats - seatAdjustmentValue);

        const newTotal =
          adjustmentAction === "ADD"
            ? Math.max(row.totalCapacity, row.totalCapacity + seatAdjustmentValue)
            : row.totalCapacity;

        let status: "NORMAL" | "LOW_STOCK" | "SOLD_OUT" = "NORMAL";
        if (newAvailable === 0) status = "SOLD_OUT";
        else if (newAvailable <= Math.ceil(newTotal * 0.2)) status = "LOW_STOCK";

        return {
          ...row,
          totalCapacity: newTotal,
          availableSeats: newAvailable,
          status,
        };
      })
    );

    toast.success(
      `Inventory for "${adjustModalItem.title}" updated: ${
        adjustmentAction === "ADD" ? `+${seatAdjustmentValue} seats added` : `-${seatAdjustmentValue} seats removed`
      }`
    );
    setAdjustModalItem(null);
  };

  const getCategoryBadge = (cat: TicketCategory) => {
    switch (cat) {
      case "BUS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-600/20">
            <Bus className="w-3 h-3 text-amber-600" /> Bus
          </span>
        );
      case "EVENT":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-600/20">
            <Music className="w-3 h-3 text-purple-600" /> Event
          </span>
        );
      case "SPORTS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-600/20">
            <Trophy className="w-3 h-3 text-emerald-600" /> Sports
          </span>
        );
      case "CINEMA":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-600/20">
            <Film className="w-3 h-3 text-sky-600" /> Cinema
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Inventory & Seat Allocation Matrix
          </h1>
          <p className="text-xs text-muted-foreground">
            Real-time seat capacity, fill rates, and instant seat allocation across all sectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              toast.success("Inventory cache refreshed with real-time bookings");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Sync
          </button>
          <Link
            href="/provider/tickets/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Listing
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Total Fleet / Hall Seats</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground">{totalCapacity.toLocaleString()}</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Across {inventory.length} active listings</p>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Sold / Reserved</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground">{totalSold.toLocaleString()}</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Confirmed reservations</p>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Remaining Stock</span>
            <Ticket className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground">{totalAvailable.toLocaleString()}</div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Seats open for purchase</p>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Average Occupancy</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground">{overallOccupancy}%</div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{lowStockCount} listings below 20%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Sector Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 text-white shadow-sm inline-flex items-center gap-1.5">
              <span>{organization.category} Matrix</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {filteredInventory.length}
              </span>
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Allocated exclusively for {organization.name}
            </span>
          </div>

          {/* Search & Stock Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listing or venue..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="NORMAL">Healthy Stock</option>
              <option value="LOW_STOCK">Low Stock (&lt;20%)</option>
              <option value="SOLD_OUT">Sold Out</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Matrix Table */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-4">Service & Route</th>
                <th className="py-3.5 px-4">Sector</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4 text-center">Total Capacity</th>
                <th className="py-3.5 px-4 text-center">Sold</th>
                <th className="py-3.5 px-4 text-center">In Stock</th>
                <th className="py-3.5 px-4 min-w-[140px]">Fill Rate</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground">
                    No matching inventory records found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const sold = item.totalCapacity - item.availableSeats;
                  const fillPercentage = Math.round((sold / item.totalCapacity) * 100);

                  return (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/provider/tickets/${item.id}`}
                          className="font-semibold text-foreground hover:text-amber-600 transition-colors block line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <span className="text-[11px] text-muted-foreground block line-clamp-1 mt-0.5">
                          {item.location}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">{getCategoryBadge(item.category)}</td>

                      <td className="py-3.5 px-3 text-muted-foreground">
                        <span className="font-medium text-foreground block">{item.date}</span>
                        <span className="text-[11px]">{item.time}</span>
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-medium text-foreground">
                        {item.totalCapacity}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-medium text-blue-600">
                        {sold}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-bold text-amber-600">
                        {item.availableSeats}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-medium text-foreground">{fillPercentage}%</span>
                          <span className="text-muted-foreground">
                            {sold}/{item.totalCapacity}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              fillPercentage >= 90
                                ? "bg-rose-500"
                                : fillPercentage >= 70
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, fillPercentage)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        {item.status === "SOLD_OUT" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            Sold Out
                          </span>
                        )}
                        {item.status === "LOW_STOCK" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            Low Stock
                          </span>
                        )}
                        {item.status === "NORMAL" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Optimal
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end">
                          <ActionDropdown
                            items={[
                              {
                                label: "Adjust Seat Allocation",
                                icon: <SlidersHorizontal className="w-3.5 h-3.5" />,
                                onClick: () => handleOpenAdjustModal(item),
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
                              {
                                label: "Reset to Full Capacity",
                                icon: <RefreshCw className="w-3.5 h-3.5" />,
                                onClick: () => {
                                  setInventory((prev) =>
                                    prev.map((r) =>
                                      r.id === item.id
                                        ? { ...r, availableSeats: r.totalCapacity, status: "NORMAL" }
                                        : r
                                    )
                                  );
                                  toast.success("Capacity reset to full available.");
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

      {/* Seat Adjustment Modal */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Quick Seat Allocation</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {adjustModalItem.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustModalItem(null)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 text-xs space-y-1.5 border border-border/50">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Available Seats:</span>
                <span className="font-bold text-foreground font-mono">
                  {adjustModalItem.availableSeats}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Capacity:</span>
                <span className="font-bold text-foreground font-mono">
                  {adjustModalItem.totalCapacity}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-foreground">Action</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustmentAction("ADD")}
                  className={`py-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                    adjustmentAction === "ADD"
                      ? "border-emerald-600 bg-emerald-500/10 text-emerald-600 font-semibold"
                      : "border-border/70 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  + Add Available Seats
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentAction("REMOVE")}
                  className={`py-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                    adjustmentAction === "REMOVE"
                      ? "border-rose-600 bg-rose-500/10 text-rose-600 font-semibold"
                      : "border-border/70 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  - Hold / Remove Seats
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Number of Seats
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={seatAdjustmentValue}
                  onChange={(e) => setSeatAdjustmentValue(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setAdjustModalItem(null)}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-border/70 hover:bg-muted text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAdjustment}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
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
