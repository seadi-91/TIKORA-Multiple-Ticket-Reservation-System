"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bus,
  CheckCircle2,
  Clock,
  Film,
  History,
  Layers,
  MapPin,
  Music,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Trophy,
  Users,
  XCircle,
  Sparkles,
  Activity,
  ArrowUpRight,
  Search,
  Filter,
  Phone,
  Shield,
  Smartphone,
  Check,
  RefreshCw,
  Radio,
  KeyRound,
  ExternalLink,
  ChevronRight,
  X,
  Calendar,
  Ticket,
  Armchair,
  Copy,
  Printer,
  Eye,
  CheckCheck,
  Hash,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useInspectorStore, VerificationResultType } from "@/stores/inspector.store";
import { TicketCategory } from "@/types/ticket.types";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";

export default function InspectorDashboardPage() {
  const {
    profile,
    assignments,
    currentAssignmentId,
    setCurrentAssignment,
    verificationHistory,
    verifyTicket,
    organizationBookings,
    organizationTickets,
    fetchOrganizationBookings,
    fetchOrganizationServices,
    checkInBooking,
    isLoadingBookings,
  } = useInspectorStore();

  // Load live organization services and bookings on mount
  useEffect(() => {
    fetchOrganizationServices();
    fetchOrganizationBookings();
  }, [fetchOrganizationServices, fetchOrganizationBookings]);

  // Find active assignment or fallback
  const activeAssignment = useMemo(() => {
    return (
      assignments.find((a) => a.id === currentAssignmentId) ||
      assignments.find((a) => a.status === "ACTIVE_NOW") ||
      assignments[0]
    );
  }, [assignments, currentAssignmentId]);

  // Statistics calculation for scans
  const totalScans = verificationHistory.length;
  const validScans = verificationHistory.filter((v) => v.result === "VALID").length;
  const invalidScans = verificationHistory.filter((v) => v.result === "INVALID").length;
  const duplicateScans = verificationHistory.filter(
    (v) => v.result === "ALREADY_USED" || v.result === "WRONG_ASSIGNMENT"
  ).length;

  const validPercentage = totalScans > 0 ? Math.round((validScans / totalScans) * 100) : 100;

  // -------------------------------------------------------------
  // CAPACITY & SEAT INVENTORY CALCULATIONS
  // -------------------------------------------------------------
  const orgTickets = organizationTickets && organizationTickets.length > 0 ? organizationTickets : [];

  // Total capacity across all trips/showtimes of this organization
  const totalCapacity = orgTickets.reduce((acc, t) => acc + (t.totalSeats || 0), 0);

  // Remaining available seats
  const unsoldSeatsCount = orgTickets.reduce((acc, t) => acc + (t.availableSeats || 0), 0);

  // Sold seats based on ticket inventory
  const inventorySoldSeats = orgTickets.reduce(
    (acc, t) => acc + Math.max(0, (t.totalSeats || 0) - (t.availableSeats || 0)),
    0
  );

  // Total seats booked from confirmed manifest
  const bookedSeatsCount = organizationBookings.reduce(
    (acc, b) => acc + (b.quantity || b.selectedSeats?.length || 1),
    0
  );

  // Effective sold & unsold figures
  const effectiveSold = Math.max(inventorySoldSeats, bookedSeatsCount);
  const effectiveUnsold = Math.max(0, totalCapacity - effectiveSold);
  const fillRate = totalCapacity > 0 ? Math.round((effectiveSold / totalCapacity) * 100) : 0;

  // Checked-in / Admitted patrons vs Awaiting gate entry
  const checkedInCount = organizationBookings.filter((b) => b.bookingStatus === "CHECKED_IN").length;
  const pendingCheckInCount = Math.max(0, organizationBookings.length - checkedInCount);

  // -------------------------------------------------------------
  // MANIFEST STATE (FILTER & SEARCH FOR BOOKINGS)
  // -------------------------------------------------------------
  const [manifestSearch, setManifestSearch] = useState("");
  const [manifestFilter, setManifestFilter] = useState<"ALL" | "CONFIRMED" | "CHECKED_IN">("ALL");
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<any | null>(null);
  const [checkingInRef, setCheckingInRef] = useState<string | null>(null);

  const filteredBookings = useMemo(() => {
    return organizationBookings.filter((b) => {
      const q = manifestSearch.toLowerCase().trim();
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

      if (manifestFilter === "CONFIRMED") return b.bookingStatus !== "CHECKED_IN";
      if (manifestFilter === "CHECKED_IN") return b.bookingStatus === "CHECKED_IN";
      return true;
    });
  }, [organizationBookings, manifestSearch, manifestFilter]);

  // Handle direct check-in from the manifest table
  const handleDirectCheckIn = async (ref: string) => {
    setCheckingInRef(ref);
    const success = await checkInBooking(ref);
    setCheckingInRef(null);
    if (success) {
      toast.success(`Patron admitted and marked as CHECKED_IN: ${ref}`);
    } else {
      toast.error("Failed to update check-in status.");
    }
  };

  // Copy reference code
  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast.success(`Reference ${ref} copied to clipboard!`);
  };

  // Manual Check-in State
  const [manualCode, setManualCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [manualResult, setManualResult] = useState<any | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  // History search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "VALID" | "ALERTS">("ALL");

  // Selected Log for detail modal
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const getSectorMeta = () => {
    switch (profile.category) {
      case "CINEMA":
        return {
          title: "Cinema Ushering Command Center",
          activeBadge: "Active Screening Post",
          timeLabel: "Showtime:",
          unitLabel: "Patrons Admitted",
          unitType: "Screening Hall",
          unitNoun: "Patron",
          seatLabel: "Auditorium Seat",
          formatHint: "Format: TH-CNM-XXXX or TIKORA-...",
        };
      case "BUS":
        return {
          title: "Bus Fleet Boarding Command Center",
          activeBadge: "Active Boarding Post",
          timeLabel: "Departure:",
          unitLabel: "Passengers Boarded",
          unitType: "Express Coach",
          unitNoun: "Passenger",
          seatLabel: "Coach Seat",
          formatHint: "Format: TH-BUS-XXXX or TIKORA-...",
        };
      case "EVENT":
        return {
          title: "Festival Gate Command Center",
          activeBadge: "Active Turnstile Post",
          timeLabel: "Starts:",
          unitLabel: "Guests Admitted",
          unitType: "Main Stage Pavilion",
          unitNoun: "Guest",
          seatLabel: "Wristband Tier / Table",
          formatHint: "Format: TH-EVT-XXXX or TIKORA-...",
        };
      case "SPORTS":
        return {
          title: "Stadium Gate Command Center",
          activeBadge: "Active Stadium Turnstile",
          timeLabel: "Kickoff:",
          unitLabel: "Fans Admitted",
          unitType: "Tribune Stand",
          unitNoun: "Fan",
          seatLabel: "Tribune Seat",
          formatHint: "Format: TH-SPT-XXXX or TIKORA-...",
        };
    }
  };

  const sector = getSectorMeta();

  const getCategoryIcon = (cat: TicketCategory) => {
    switch (cat) {
      case "BUS":
        return <Bus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "EVENT":
        return <Music className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case "SPORTS":
        return <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case "CINEMA":
        return <Film className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getResultBadge = (result: VerificationResultType) => {
    switch (result) {
      case "VALID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            VALID
          </span>
        );
      case "ALREADY_USED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20">
            <Clock className="w-3 h-3" />
            DUPLICATE
          </span>
        );
      case "WRONG_ASSIGNMENT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-inset ring-purple-500/20">
            <AlertTriangle className="w-3 h-3" />
            WRONG VENUE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
            <XCircle className="w-3 h-3" />
            INVALID
          </span>
        );
    }
  };

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      toast.error("Please enter a ticket reference code");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const outcome = verifyTicket(manualCode.trim().toUpperCase());
      setManualResult(outcome);
      setIsVerifying(false);

      if (outcome.result === "VALID") {
        toast.success(`Ticket Verified: ${outcome.passengerName} (${outcome.seatNumber || "General"})`);
        checkInBooking(outcome.ticketReference);
      } else if (outcome.result === "ALREADY_USED") {
        toast.warning(`Duplicate Pass: Already verified previously.`);
      } else {
        toast.error(`Verification Alert: ${outcome.message}`);
      }
    }, 350);
  };

  // Filtered live audit history
  const filteredHistory = useMemo(() => {
    return verificationHistory.filter((item) => {
      const matchesSearch =
        item.ticketReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.seatNumber && item.seatNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (statusFilter === "VALID") return item.result === "VALID";
      if (statusFilter === "ALERTS") return item.result !== "VALID";
      return true;
    });
  }, [verificationHistory, searchQuery, statusFilter]);

  const boardedPercentage = activeAssignment
    ? Math.round((activeAssignment.scannedSeats / (activeAssignment.totalSeats || 1)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Telemetry & Operational Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#161922] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-500/20">
            {profile.category === "CINEMA" ? (
              <Film className="w-5 h-5" />
            ) : profile.category === "BUS" ? (
              <Bus className="w-5 h-5" />
            ) : profile.category === "SPORTS" ? (
              <Trophy className="w-5 h-5" />
            ) : (
              <Music className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-foreground">
                {sector.title}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold ring-1 ring-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                GATE ONLINE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="font-bold text-amber-600 dark:text-amber-400">{profile.organizationName}</span>
              <span>•</span>
              <span>{profile.fullName}</span>
              <span>•</span>
              <span className="font-mono text-slate-500">{profile.inspectorId}</span>
              <span>•</span>
              <span>{profile.assignedStation}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              fetchOrganizationServices();
              fetchOrganizationBookings();
              toast.success("Synchronized live tickets and bookings from server!");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-foreground transition-all cursor-pointer"
            title="Refresh bookings and ticket stock"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoadingBookings ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Sync Data</span>
          </button>

          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-foreground transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>Manual Code Entry</span>
          </button>

          <Link
            href="/inspector/scanner"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Camera</span>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. SEAT & TICKET SALES INVENTORY CARDS */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Sold Tickets */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/30 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-muted-foreground">
              Tickets Sold
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {effectiveSold}
            </span>
            <span className="text-xs font-bold text-muted-foreground">seats booked</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
            <span className="text-muted-foreground">Occupancy Rate:</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{fillRate}% Sold</span>
          </div>
        </div>

        {/* Card 2: Unsold Seats */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-500/30 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-muted-foreground">
              Unsold Seats
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {effectiveUnsold}
            </span>
            <span className="text-xs font-bold text-muted-foreground">seats left</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
            <span className="text-muted-foreground">Available Capacity:</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">
              {totalCapacity > 0 ? 100 - fillRate : 100}% Remaining
            </span>
          </div>
        </div>

        {/* Card 3: Total Fleet / Venue Capacity */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-500/30 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-muted-foreground">
              Total Fleet Capacity
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
              {totalCapacity}
            </span>
            <span className="text-xs font-bold text-muted-foreground">total seats</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
            <span className="text-muted-foreground">Active Posts:</span>
            <span className="font-extrabold text-foreground">{orgTickets.length} scheduled lines</span>
          </div>
        </div>

        {/* Card 4: Admitted Patrons */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-purple-500/30 transition-all space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-muted-foreground">
              Admitted at Gate
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
              {checkedInCount}
            </span>
            <span className="text-xs font-bold text-muted-foreground">
              / {organizationBookings.length} admitted
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
            <span className="text-muted-foreground">Awaiting Gate:</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">
              {pendingCheckInCount} passengers left
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. ALL BOOKED TICKETS FOR THIS ORGANIZATION */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                All Booked Tickets for {profile.organizationName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-xs font-mono">
                {organizationBookings.length} Bookings
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Live passenger and patron manifest registered in TIKORA ledger
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setManifestFilter("ALL")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  manifestFilter === "ALL"
                    ? "bg-white dark:bg-slate-700 text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({organizationBookings.length})
              </button>
              <button
                type="button"
                onClick={() => setManifestFilter("CONFIRMED")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  manifestFilter === "CONFIRMED"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Awaiting Entry ({pendingCheckInCount})
              </button>
              <button
                type="button"
                onClick={() => setManifestFilter("CHECKED_IN")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  manifestFilter === "CHECKED_IN"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Admitted ({checkedInCount})
              </button>
            </div>
          </div>
        </div>

        {/* Search input for bookings */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={manifestSearch}
            onChange={(e) => setManifestSearch(e.target.value)}
            placeholder="Search patron name, mobile number, ticket code, seat numbers..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Bookings Manifest Table - Spacious, Roomy Layout */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/80 scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[1450px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-4.5 px-6 min-w-[220px]">Reference Code</th>
                <th className="py-4.5 px-6 min-w-[260px]">Patron / Passenger</th>
                <th className="py-4.5 px-6 min-w-[300px]">Service / Route / Event</th>
                <th className="py-4.5 px-6 text-center min-w-[180px]">Allocated Seats</th>
                <th className="py-4.5 px-6 text-right min-w-[160px]">Paid Amount</th>
                <th className="py-4.5 px-6 text-center min-w-[160px]">Admission Status</th>
                <th className="py-4.5 px-6 text-right min-w-[150px]">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">
                    <Ticket className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="font-semibold text-foreground">No bookings found for this criteria.</p>
                    <p className="text-[11px] mt-0.5">
                      Customer bookings for {profile.organizationName} will appear here live once booked.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b: any) => {
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
                    <tr
                      key={refCode}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Reference Code - Uncramped with copy button */}
                      <td className="py-4.5 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground text-xs sm:text-sm tracking-tight">{refCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyRef(refCode)}
                            className="p-1 text-slate-400 hover:text-foreground cursor-pointer transition-colors"
                            title="Copy reference code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Customer Name & Phone */}
                      <td className="py-4.5 px-6">
                        <div className="font-bold text-foreground text-xs sm:text-sm">{b.customerName || "Valued Patron"}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          {b.customerPhone && <span>{b.customerPhone}</span>}
                          {b.customerPhone && b.customerEmail && <span>•</span>}
                          {b.customerEmail && <span className="truncate max-w-[150px]">{b.customerEmail}</span>}
                        </div>
                      </td>

                      {/* Service / Journey / Screening */}
                      <td className="py-4.5 px-6">
                        <div className="font-semibold text-foreground text-xs sm:text-sm line-clamp-1 max-w-[280px]">
                          {serviceName}
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{b.ticket?.date || b.travelDate || "Scheduled"}</span>
                          <span>•</span>
                          <span className="font-mono text-amber-600 dark:text-amber-400">
                            {b.ticket?.time || b.departureTime || "Gate 1"}
                          </span>
                        </div>
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
                              ({b.quantity} Tickets)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount Paid */}
                      <td className="py-4.5 px-6 text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-foreground text-xs sm:text-sm block">
                          {formatCurrency(totalPaid)}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                          Chapa Paid
                        </span>
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

                      {/* Action buttons */}
                      <td className="py-4.5 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {!isCheckedIn ? (
                            <button
                              type="button"
                              disabled={checkingInRef === refCode}
                              onClick={() => handleDirectCheckIn(refCode)}
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
                            onClick={() => setSelectedBookingForPass(b)}
                            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            title="View digital QR pass"
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

      {/* ------------------------------------------------------------- */}
      {/* 3. PER-SERVICE / TRIP BREAKDOWN */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Seat Inventory & Fleet Schedule for {profile.organizationName}
            </h3>
            <p className="text-xs text-muted-foreground">
              Live capacity breakdown: Sold vs Unsold seats per scheduled post
            </p>
          </div>
          <Link
            href="/inspector/services"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>All Services ({orgTickets.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {orgTickets.map((t: any) => {
            const sold = Math.max(0, (t.totalSeats || 50) - (t.availableSeats || 0));
            const left = t.availableSeats || 0;
            const total = t.totalSeats || 50;
            const rate = total > 0 ? Math.round((sold / total) * 100) : 0;

            return (
              <div
                key={t.id}
                className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/30 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      {t.category} POST &bull; {t.location || t.city || "Addis Ababa"}
                    </span>
                    <h4 className="font-extrabold text-foreground text-xs line-clamp-1">
                      {t.title}
                    </h4>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{t.time}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{t.date}</span>
                    </div>
                  </div>

                  <Link
                    href="/inspector/scanner"
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all shrink-0"
                  >
                    Scan Gate
                  </Link>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {sold} Sold
                    </span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                      {left} Left
                    </span>
                    <span className="font-mono text-muted-foreground">
                      / {total} Total
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, rate)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. ACTIVE DUTY HERO & MANUAL VALIDATION TOOL */}
      {/* ------------------------------------------------------------- */}
      {activeAssignment && (
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#161922] border border-amber-500/25 p-5 sm:p-7 shadow-xs">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold ring-1 ring-emerald-500/25">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {sector.activeBadge}
                </span>
                <span className="text-xs text-muted-foreground font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {activeAssignment.venueOrTerminal}
                </span>
                <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  {activeAssignment.gate}
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground">
                {activeAssignment.title}
              </h2>

              <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                <span className="font-medium text-foreground">
                  {sector.timeLabel}{" "}
                  <strong className="text-amber-600 dark:text-amber-400">{activeAssignment.scheduledTime}</strong>
                </span>
                <span>•</span>
                <span>
                  {sector.unitType}: <strong className="text-foreground">{activeAssignment.coachOrHall}</strong>
                </span>
                {activeAssignment.driverOrLead && (
                  <>
                    <span>•</span>
                    <span>
                      Lead: <strong className="text-foreground">{activeAssignment.driverOrLead}</strong>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              <Link
                href="/inspector/scanner"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Launch Camera Scanner</span>
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
              <span>{sector.unitLabel}:</span>
              <span className="font-extrabold text-foreground font-mono">
                {activeAssignment.scannedSeats} / {activeAssignment.totalSeats} seats
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                {boardedPercentage}% validated
              </span>
              <span className="text-slate-400">
                ({activeAssignment.totalSeats - activeAssignment.scannedSeats} remaining)
              </span>
            </div>

            <div className="w-full sm:w-64 bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${Math.min(100, boardedPercentage)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Manual Quick Validation Box (Field Fallback Tool) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Instant Pass Code Lookup & Field Check-In</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              For patrons with printed paper vouchers, dead batteries, or direct booking reference codes.
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">{sector.formatHint}</span>
        </div>

        <form onSubmit={handleManualVerify} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter ticket code (e.g. TIKORA-... or TH-BUS-...)..."
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {manualCode && (
              <button
                type="button"
                onClick={() => setManualCode("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || !manualCode.trim()}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Verify Ticket</span>
              </>
            )}
          </button>
        </form>

        {/* Live Outcome Banner */}
        {manualResult && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
              manualResult.result === "VALID"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                : manualResult.result === "ALREADY_USED"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100"
                : "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {manualResult.result === "VALID" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : manualResult.result === "ALREADY_USED" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <span className="font-extrabold uppercase tracking-wider text-xs">
                  {manualResult.result === "VALID" ? "TICKET VALID & ACCESS APPROVED" : manualResult.message}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setManualResult(null)}
                className="text-slate-400 hover:text-slate-600 text-[11px] cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-sans">
              <div>
                <span className="text-[10px] text-muted-foreground block">{sector.unitNoun} Name</span>
                <span className="font-bold text-foreground">{manualResult.passengerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">{sector.seatLabel}</span>
                <span className="font-mono font-bold text-foreground">
                  {manualResult.seatNumber ? `${manualResult.seatNumber}` : "General Access"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Session Title</span>
                <span className="font-semibold text-foreground truncate block">{manualResult.serviceTitle}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Verification Time</span>
                <span className="font-mono text-muted-foreground">{manualResult.verifiedAt}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. LIVE AUDIT STREAM & SUPERVISOR DISPATCH */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Supervisor Emergency Contact Card */}
          <div className="p-4 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-foreground block">
                  {profile.organizationName} Dispatch Hotline
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Contact provider operations for patron disputes or gate re-routing
                </span>
              </div>
            </div>
            <a
              href="tel:+251911234567"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400 font-bold font-mono text-xs shadow-xs shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+251 911 234 567</span>
            </a>
          </div>
        </div>

        {/* Right Col: Live Audit Stream */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Live Audit Stream</h3>
                <p className="text-xs text-muted-foreground">Real-time gate scan feed for {profile.organizationName}</p>
              </div>
              <Link
                href="/inspector/history"
                className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Full Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg">
              {(["ALL", "VALID", "ALERTS"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setStatusFilter(mode)}
                  className={`flex-1 py-0.5 px-2 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                    statusFilter === mode
                      ? "bg-white dark:bg-slate-700 text-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode === "ALL" ? "All" : mode === "VALID" ? "Valid" : "Alerts"}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patron, seat, code..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500/30"
              />
            </div>

            {/* Stream List */}
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No scan logs match your search.
                </div>
              ) : (
                filteredHistory.slice(0, 8).map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all text-xs space-y-1.5 border border-slate-200/40 dark:border-slate-800/40 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                        {log.ticketReference}
                      </span>
                      {getResultBadge(log.result)}
                    </div>

                    <div className="flex items-center justify-between text-foreground font-semibold">
                      <span className="truncate max-w-[140px]">{log.passengerName}</span>
                      {log.seatNumber && (
                        <span className="font-mono text-muted-foreground text-[10px] bg-muted/60 px-1.5 py-0.5 rounded">
                          {log.seatNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                      <span className="truncate max-w-[130px]">{log.serviceTitle}</span>
                      <span className="font-mono">{log.verificationTime}</span>
                    </div>

                    {log.failureReason && (
                      <p className="text-[10px] text-rose-600 dark:text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded">
                        {log.failureReason}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. TURNSTILE QR PASS PREVIEW MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedBookingForPass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Official Digital Turnstile Pass
              </span>
              <button
                type="button"
                onClick={() => setSelectedBookingForPass(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-extrabold text-foreground">
                {selectedBookingForPass.customerName}
              </h3>
              <p className="text-xs text-muted-foreground">
                {selectedBookingForPass.serviceTitle || selectedBookingForPass.ticket?.title}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center mx-auto w-fit">
              <QRCodeSVG
                value={
                  selectedBookingForPass.qrCodeData ||
                  `TIKORA-PASS:${selectedBookingForPass.bookingReference || selectedBookingForPass.id}:PAID`
                }
                size={160}
                level="M"
              />
              <span className="font-mono font-bold text-xs text-slate-800 mt-2">
                {selectedBookingForPass.bookingReference || selectedBookingForPass.id}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Allocated Seats:</span>
                <span className="font-bold text-foreground">
                  {(selectedBookingForPass.selectedSeats && selectedBookingForPass.selectedSeats.join(", ")) ||
                    selectedBookingForPass.selectedTier ||
                    "Standard"}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Admission Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedBookingForPass.bookingStatus || "CONFIRMED"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBookingForPass(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}