"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Armchair,
  Check,
  CheckCheck,
  Clock,
  Copy,
  Layers,
  MapPin,
  QrCode,
  RefreshCw,
  Search,
  Ticket,
  User,
  Users,
  X,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useInspectorStore } from "@/stores/inspector.store";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";

export default function InspectorManifestPage() {
  const {
    profile,
    organizationBookings,
    organizationTickets,
    fetchOrganizationBookings,
    fetchOrganizationServices,
    checkInBooking,
    isLoadingBookings,
  } = useInspectorStore();

  useEffect(() => {
    fetchOrganizationServices();
    fetchOrganizationBookings();
  }, [fetchOrganizationServices, fetchOrganizationBookings]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "CONFIRMED" | "CHECKED_IN">("ALL");
  const [selectedPass, setSelectedPass] = useState<any | null>(null);
  const [checkingInRef, setCheckingInRef] = useState<string | null>(null);

  // Statistics
  const orgTickets = organizationTickets || [];
  const totalCapacity = orgTickets.reduce((acc, t) => acc + (t.totalSeats || 0), 0);
  const unsoldSeatsCount = orgTickets.reduce((acc, t) => acc + (t.availableSeats || 0), 0);
  const inventorySold = orgTickets.reduce((acc, t) => acc + Math.max(0, (t.totalSeats || 0) - (t.availableSeats || 0)), 0);
  const bookedSeatsCount = organizationBookings.reduce((acc, b) => acc + (b.quantity || b.selectedSeats?.length || 1), 0);
  const effectiveSold = Math.max(inventorySold, bookedSeatsCount);
  const effectiveUnsold = Math.max(0, totalCapacity - effectiveSold);
  const checkedInCount = organizationBookings.filter((b) => b.bookingStatus === "CHECKED_IN").length;
  const pendingCount = Math.max(0, organizationBookings.length - checkedInCount);

  const getPageTitle = () => {
    switch (profile.category) {
      case "SPORTS":
        return "Supporter Manifest & Pass Roster";
      case "BUS":
        return "Passenger Manifest & Boarding Roster";
      case "CINEMA":
        return "Patron Manifest & Screening Roster";
      default:
        return "Attendee Manifest & Turnstile Roster";
    }
  };

  const filtered = useMemo(() => {
    return organizationBookings.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (b.customerName && b.customerName.toLowerCase().includes(q)) ||
        (b.customerPhone && b.customerPhone.toLowerCase().includes(q)) ||
        (b.customerEmail && b.customerEmail.toLowerCase().includes(q)) ||
        (b.bookingReference && b.bookingReference.toLowerCase().includes(q)) ||
        (b.serviceTitle && b.serviceTitle.toLowerCase().includes(q)) ||
        (b.ticket?.title && b.ticket.title.toLowerCase().includes(q)) ||
        (b.selectedSeats && b.selectedSeats.join(" ").toLowerCase().includes(q)) ||
        (b.seats && b.seats.join(" ").toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (filterStatus === "CONFIRMED") return b.bookingStatus !== "CHECKED_IN";
      if (filterStatus === "CHECKED_IN") return b.bookingStatus === "CHECKED_IN";
      return true;
    });
  }, [organizationBookings, searchQuery, filterStatus]);

  const handleCheckIn = async (ref: string) => {
    setCheckingInRef(ref);
    const success = await checkInBooking(ref);
    setCheckingInRef(null);
    if (success) {
      toast.success(`Patron admitted and marked as CHECKED_IN: ${ref}`);
    } else {
      toast.error("Failed to update status.");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${text}`);
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300">
              {profile.organizationName}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {profile.assignedStation}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time registered customer bookings, allocated seats, and turnstile check-in controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              fetchOrganizationServices();
              fetchOrganizationBookings();
              toast.success("Synchronized live manifest!");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-foreground transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBookings ? "animate-spin" : ""}`} />
            <span>Sync Manifest</span>
          </button>
          <Link
            href="/inspector/scanner"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Scanner</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Sold Tickets
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {effectiveSold}
          </div>
          <span className="text-[11px] text-muted-foreground">Booked seats</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Unsold Seats
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {effectiveUnsold}
          </div>
          <span className="text-[11px] text-muted-foreground">Seats remaining</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Admitted Patrons
          </span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {checkedInCount}
          </div>
          <span className="text-[11px] text-muted-foreground">Checked-in at gate</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Awaiting Entry
          </span>
          <div className="text-2xl font-black text-foreground font-mono">
            {pendingCount}
          </div>
          <span className="text-[11px] text-muted-foreground">Pending admission</span>
        </div>
      </div>

      {/* Manifest Table Card - Spacious, Roomy Layout */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patron, phone, ticket reference, seat..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterStatus === "ALL"
                  ? "bg-white dark:bg-slate-700 text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({organizationBookings.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("CONFIRMED")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterStatus === "CONFIRMED"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Awaiting Entry ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("CHECKED_IN")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterStatus === "CHECKED_IN"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Admitted ({checkedInCount})
            </button>
          </div>
        </div>

        {/* Spacious Table with generous width and padding */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/80 scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[1450px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-4.5 px-6 min-w-[220px]">Reference Code</th>
                <th className="py-4.5 px-6 min-w-[260px]">Patron / Passenger</th>
                <th className="py-4.5 px-6 min-w-[300px]">Service & Route</th>
                <th className="py-4.5 px-6 min-w-[160px]">Schedule Date</th>
                <th className="py-4.5 px-6 text-center min-w-[180px]">Allocated Seats</th>
                <th className="py-4.5 px-6 text-right min-w-[150px]">Amount (ETB)</th>
                <th className="py-4.5 px-6 text-center min-w-[160px]">Admission Status</th>
                <th className="py-4.5 px-6 text-right min-w-[140px]">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground">
                    <Ticket className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="font-semibold text-foreground">No bookings found matching your search.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((b: any) => {
                  const isCheckedIn = b.bookingStatus === "CHECKED_IN";
                  const refCode = b.bookingReference || b.reference || b.id;
                  const serviceName = b.serviceTitle || b.ticket?.title || "TIKORA Experience Pass";
                  const seatList =
                    (b.selectedSeats && b.selectedSeats.length > 0 && b.selectedSeats.join(", ")) ||
                    (b.seats && b.seats.length > 0 && b.seats.join(", ")) ||
                    b.selectedTier ||
                    "Standard Entry";
                  const totalPaid = b.pricing?.total || b.totalAmount || (b.ticket?.price ? b.ticket.price * (b.quantity || 1) : 0);

                  return (
                    <tr key={refCode} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Reference Code - Roomy & Uncramped */}
                      <td className="py-4.5 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground text-xs sm:text-sm tracking-tight">
                            {refCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(refCode)}
                            className="p-1 text-slate-400 hover:text-foreground cursor-pointer transition-colors"
                            title="Copy reference code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Customer & Contact */}
                      <td className="py-4.5 px-6">
                        <div className="font-bold text-foreground text-xs sm:text-sm">{b.customerName || "Valued Patron"}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          {b.customerPhone && <span>{b.customerPhone}</span>}
                          {b.customerPhone && b.customerEmail && <span>•</span>}
                          {b.customerEmail && <span className="truncate max-w-[150px]">{b.customerEmail}</span>}
                        </div>
                      </td>

                      {/* Service / Journey */}
                      <td className="py-4.5 px-6">
                        <div className="font-semibold text-foreground text-xs sm:text-sm line-clamp-1 max-w-[280px]">
                          {serviceName}
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{b.ticket?.location || b.location || "Addis Ababa"}</span>
                        </div>
                      </td>

                      {/* Schedule Date & Time */}
                      <td className="py-4.5 px-6 text-muted-foreground whitespace-nowrap">
                        <span className="font-medium text-foreground block text-xs">
                          {b.ticket?.date || b.travelDate || "Scheduled"}
                        </span>
                        <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                          {b.ticket?.time || b.departureTime || "Gate 1"}
                        </span>
                      </td>

                      {/* Allocated Seats - NO BORDER */}
                      <td className="py-4.5 px-6 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground font-mono font-bold text-xs">
                            <Armchair className="w-3.5 h-3.5" />
                            <span>{seatList}</span>
                          </span>
                          {b.quantity && b.quantity > 1 && (
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              {b.quantity} passes
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount Paid */}
                      <td className="py-4.5 px-6 text-right whitespace-nowrap font-mono font-bold text-foreground text-xs sm:text-sm">
                        {formatCurrency(totalPaid)}
                      </td>

                      {/* Admission Status - NO BORDER */}
                      <td className="py-4.5 px-6 text-center whitespace-nowrap">
                        {isCheckedIn ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <CheckCheck className="w-3.5 h-3.5" />
                            Admitted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <Clock className="w-3.5 h-3.5" />
                            Awaiting Entry
                          </span>
                        )}
                      </td>

                      {/* Gate Action */}
                      <td className="py-4.5 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {!isCheckedIn ? (
                            <button
                              type="button"
                              disabled={checkingInRef === refCode}
                              onClick={() => handleCheckIn(refCode)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{checkingInRef === refCode ? "Admitting..." : "Check-In"}</span>
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold px-2 py-1">
                              ✓ Admitted
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedPass(b)}
                            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            title="View QR pass"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
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

      {/* QR Pass Preview Modal */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Official Digital Turnstile Pass
              </span>
              <button
                type="button"
                onClick={() => setSelectedPass(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-extrabold text-foreground">
                {selectedPass.customerName}
              </h3>
              <p className="text-xs text-muted-foreground">
                {selectedPass.serviceTitle || selectedPass.ticket?.title}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center mx-auto w-fit">
              <QRCodeSVG
                value={
                  selectedPass.qrCodeData ||
                  `TIKORA-PASS:${selectedPass.bookingReference || selectedPass.id}:PAID`
                }
                size={160}
                level="M"
              />
              <span className="font-mono font-bold text-xs text-slate-800 mt-2">
                {selectedPass.bookingReference || selectedPass.id}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Allocated Seats:</span>
                <span className="font-bold text-foreground">
                  {(selectedPass.selectedSeats && selectedPass.selectedSeats.join(", ")) ||
                    (selectedPass.seats && selectedPass.seats.join(", ")) ||
                    selectedPass.selectedTier ||
                    "Standard"}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Admission Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedPass.bookingStatus || "CONFIRMED"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPass(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all cursor-pointer"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
