"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Bus,
  Film,
  Calendar,
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Eye,
  X,
  CreditCard,
  Building2,
  User,
} from "lucide-react";
import { useAdminStore, AdminBooking } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function AdminBookingsPage() {
  const { bookings } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "ALL" || b.category === categoryFilter;
    const matchesStatus = statusFilter === "ALL" || b.bookingStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BUS":
        return <Bus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "CINEMA":
        return <Film className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "SPORTS":
        return <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const exportCSV = () => {
    const headers = [
      "Reference",
      "Customer",
      "Email",
      "Provider",
      "Service",
      "Category",
      "Amount_ETB",
      "Fee_ETB",
      "Method",
      "Status",
      "Date",
    ];
    const rows = filteredBookings.map((b) => [
      b.reference,
      `"${b.customerName}"`,
      b.customerEmail,
      `"${b.providerName}"`,
      `"${b.serviceTitle}"`,
      b.category,
      b.totalAmount,
      b.platformFee,
      b.paymentMethod,
      b.bookingStatus,
      b.bookingDate,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tikora-bookings-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Platform Booking Master Ledger
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full transactional audit trail for all customer seat reservations, passes, and payments.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 hover:bg-muted text-foreground transition-all flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Download className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Mobile Filter Dropdown */}
      <div className="block sm:hidden">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
          Booking Status Filter
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full h-10 px-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
        >
          <option value="ALL">All Bookings ({bookings.length})</option>
          <option value="CONFIRMED">Confirmed ({bookings.filter((b) => b.bookingStatus === "CONFIRMED").length})</option>
          <option value="CANCELLED">Cancelled ({bookings.filter((b) => b.bookingStatus === "CANCELLED").length})</option>
        </select>
      </div>

      {/* Desktop Filter Tabs */}
      <div className="hidden sm:flex flex-wrap items-center gap-1.5 border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
        {[
          { label: "All Bookings", value: "ALL" },
          { label: "Confirmed", value: "CONFIRMED" },
          { label: "Cancelled", value: "CANCELLED" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-2 py-0.5 text-micro font-medium rounded-md transition-all cursor-pointer ${
              statusFilter === tab.value
                ? "bg-amber-600 text-white shadow-xs font-semibold"
                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference code, passenger name, email, or provider..."
            className="w-full h-7.5 pl-7.5 pr-2.5 text-micro rounded-md bg-card border border-slate-200/50 dark:border-slate-800/50 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-7.5 px-2 text-micro rounded-md bg-card border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-semibold"
          >
            <option value="ALL">All Categories</option>
            <option value="BUS">Bus Transport</option>
            <option value="CINEMA">Cinema</option>
            <option value="EVENT">Events</option>
            <option value="SPORTS">Sports</option>
          </select>
        </div>
      </div>

      {/* Mobile View: High-Clarity Elevated Cards */}
      <div className="block sm:hidden space-y-3.5">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            No bookings found matching query.
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl bg-card border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:border-amber-500/30 transition-all p-4 space-y-3.5"
            >
              {/* Card Header: Reference Badge, Category & 3-Dots Dropdown */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-extrabold text-sm shadow-xs border border-amber-500/20 mt-0.5">
                    {getCategoryIcon(b.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-amber-600 dark:text-amber-400">
                        {b.reference}
                      </span>
                      {b.bookingStatus === "CONFIRMED" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
                          <RotateCcw className="w-3 h-3" /> Cancelled
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                      {b.bookingDate}
                    </p>
                  </div>
                </div>

                <ActionDropdown
                  items={[
                    {
                      label: "Inspect Booking Record",
                      icon: <Eye className="w-4 h-4" />,
                      onClick: () => setSelectedBooking(b),
                    },
                    {
                      label: "View Customer",
                      icon: <User className="w-4 h-4" />,
                      href: `/admin/users?q=${encodeURIComponent(b.customerName)}`,
                    },
                    {
                      label: "Dispute / Refund Review",
                      icon: <RotateCcw className="w-4 h-4" />,
                      href: `/admin/refunds`,
                    },
                    {
                      label: "View Operator",
                      icon: <Building2 className="w-4 h-4" />,
                      href: `/admin/providers?q=${encodeURIComponent(b.providerName)}`,
                    },
                  ]}
                />
              </div>

              {/* Service & Operator Strip */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Service / Departure
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-muted/60 px-2 py-0.5 rounded border border-slate-200/40 dark:border-slate-700/40">
                    {b.category}
                  </span>
                </div>
                <p className="font-bold text-foreground text-xs leading-snug">{b.serviceTitle}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-0.5">
                  <Building2 className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>Operator: </span>
                  <strong className="text-foreground">{b.providerName}</strong>
                </p>
              </div>

              {/* Passenger & Seat Strip */}
              <div className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/25 border border-slate-200/30 dark:border-slate-800/40 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Customer / Passenger
                  </span>
                  <span className="font-mono text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-md border border-amber-500/20">
                    {b.seatNumbers.length > 0 ? `Seats: ${b.seatNumbers.join(", ")}` : `${b.quantity} passes`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-foreground">{b.customerName}</span>
                  <span className="font-mono text-muted-foreground">{b.customerPhone}</span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{b.customerEmail}</p>
              </div>

              {/* Financial & Payment Micro-Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-amber-500/[0.04] dark:bg-amber-500/[0.07] border border-amber-500/15 text-center">
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Total Paid
                  </span>
                  <span className="text-xs font-black text-foreground font-mono mt-0.5 block truncate">
                    {b.totalAmount} <span className="text-[9px] text-muted-foreground font-normal">ETB</span>
                  </span>
                </div>
                <div className="border-x border-amber-500/15">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Platform Fee
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block truncate">
                    +{b.platformFee} <span className="text-[9px] font-normal">ETB</span>
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Gateway
                  </span>
                  <span className="text-xs font-extrabold text-foreground mt-0.5 block truncate">
                    {b.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Direct Tap Button to Inspect */}
              <button
                type="button"
                onClick={() => setSelectedBooking(b)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-500/10 dark:bg-slate-800/70 dark:hover:bg-amber-500/20 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-xs flex items-center justify-between transition-colors border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Inspect Audit Record</span>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">Full Breakdown &rarr;</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Full Table with Spacious Columns & Horizontal Scroll */}
      <div className="hidden sm:block rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[1080px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[140px]">Reference</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Customer</th>
                <th className="px-4 py-3.5 min-w-[180px]">Service / Route</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[150px]">Provider</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[120px]">Seats & Qty</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[120px]">Total / Fee</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">Method</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Status</th>
                <th className="px-4 py-3.5 text-right w-12 shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    {b.reference}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-foreground">{b.customerName}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{b.customerPhone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 min-w-[180px]">
                    <div>
                      <p className="font-semibold text-foreground truncate max-w-[200px]">{b.serviceTitle}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                        {getCategoryIcon(b.category)}
                        {b.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-foreground whitespace-nowrap">{b.providerName}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-foreground">{b.quantity} ticket(s)</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {b.seatNumbers.join(", ")}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div>
                      <p className="font-extrabold text-foreground">{b.totalAmount} ETB</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        Fee: {b.platformFee} ETB
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-muted/60 text-muted-foreground">
                      {b.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {b.bookingStatus === "CONFIRMED" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
                        <RotateCcw className="w-3 h-3" /> Cancelled
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap w-12">
                    <ActionDropdown
                      items={[
                        {
                          label: "Inspect Booking",
                          icon: <Eye className="w-4 h-4" />,
                          onClick: () => setSelectedBooking(b),
                        },
                        {
                          label: "View Customer",
                          icon: <User className="w-4 h-4" />,
                          href: `/admin/users?q=${encodeURIComponent(b.customerName)}`,
                        },
                        {
                          label: "Dispute / Refund Review",
                          icon: <RotateCcw className="w-4 h-4" />,
                          href: `/admin/refunds`,
                        },
                        {
                          label: "View Operator",
                          icon: <Building2 className="w-4 h-4" />,
                          href: `/admin/providers?q=${encodeURIComponent(b.providerName)}`,
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                    No bookings found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Reservation Audit Record
                </span>
                <h3 className="font-extrabold text-base text-foreground font-mono">{selectedBooking.reference}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 space-y-1">
                <p className="font-bold text-foreground text-sm">{selectedBooking.serviceTitle}</p>
                <p className="text-muted-foreground text-[11px]">
                  Provider: <strong className="text-foreground">{selectedBooking.providerName}</strong> • Category: {selectedBooking.category}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 py-1">
                <div>
                  <p className="text-muted-foreground text-[11px]">Passenger / Customer</p>
                  <p className="font-bold text-foreground mt-0.5">{selectedBooking.customerName}</p>
                  <p className="text-[11px] text-muted-foreground">{selectedBooking.customerEmail}</p>
                  <p className="text-[11px] font-mono text-muted-foreground">{selectedBooking.customerPhone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Seats Assigned</p>
                  <p className="font-mono font-extrabold text-foreground mt-0.5 text-sm">
                    {selectedBooking.seatNumbers.join(", ")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Quantity: {selectedBooking.quantity} ticket(s)</p>
                </div>
              </div>

              <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Customer Payment</span>
                  <span className="font-extrabold text-foreground text-sm">{selectedBooking.totalAmount} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Commission Fee</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    +{selectedBooking.platformFee} ETB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider Net Settlement</span>
                  <span className="font-bold text-foreground">
                    {(selectedBooking.totalAmount - selectedBooking.platformFee).toFixed(2)} ETB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Gateway</span>
                  <span className="font-mono font-bold text-foreground">{selectedBooking.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="font-semibold text-foreground">{selectedBooking.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp</span>
                  <span className="font-mono text-muted-foreground">{selectedBooking.bookingDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
