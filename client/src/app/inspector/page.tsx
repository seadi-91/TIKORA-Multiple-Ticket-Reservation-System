"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { useInspectorStore, VerificationResultType } from "@/stores/inspector.store";
import { TicketCategory } from "@/types/ticket.types";
import { toast } from "sonner";

export default function InspectorDashboardPage() {
  const {
    profile,
    assignments,
    currentAssignmentId,
    setCurrentAssignment,
    verificationHistory,
    verifyTicket,
  } = useInspectorStore();

  // Find active assignment or fallback
  const activeAssignment = useMemo(() => {
    return (
      assignments.find((a) => a.id === currentAssignmentId) ||
      assignments.find((a) => a.status === "ACTIVE_NOW") ||
      assignments[0]
    );
  }, [assignments, currentAssignmentId]);

  // Statistics calculation
  const totalScans = verificationHistory.length;
  const validScans = verificationHistory.filter((v) => v.result === "VALID").length;
  const invalidScans = verificationHistory.filter((v) => v.result === "INVALID").length;
  const duplicateScans = verificationHistory.filter(
    (v) => v.result === "ALREADY_USED" || v.result === "WRONG_ASSIGNMENT"
  ).length;

  const validPercentage = totalScans > 0 ? Math.round((validScans / totalScans) * 100) : 100;

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
          demoValidCode: "TH-CNM-4419",
          demoWrongCode: "TH-BUS-8829",
          demoValidName: "Meron Worku (VIP Recliner E08)",
          demoWrongLabel: "Test Wrong Pass (Bus Ticket)",
          formatHint: "Format: TH-CNM-XXXX",
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
          demoValidCode: "TH-BUS-8829",
          demoWrongCode: "TH-CNM-4419",
          demoValidName: "Dawit Hailemariam (Seat 04A)",
          demoWrongLabel: "Test Wrong Pass (Cinema Pass)",
          formatHint: "Format: TH-BUS-XXXX",
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
          demoValidCode: "TH-EVT-1001",
          demoWrongCode: "TH-BUS-8829",
          demoValidName: "Natnael Shimelis (VIP Lounge)",
          demoWrongLabel: "Test Wrong Pass (Bus Ticket)",
          formatHint: "Format: TH-EVT-XXXX",
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
          demoValidCode: "TH-SPT-3001",
          demoWrongCode: "TH-BUS-8829",
          demoValidName: "Biniam Girma (West Tribune)",
          demoWrongLabel: "Test Wrong Pass (Bus Ticket)",
          formatHint: "Format: TH-SPT-XXXX",
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
    ? Math.round((activeAssignment.scannedSeats / activeAssignment.totalSeats) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Telemetry & Operational Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#161922] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-500/20">
            {profile.category === "CINEMA" ? <Film className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
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

      {/* Active Duty Live Hero Banner */}
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
                  {sector.timeLabel} <strong className="text-amber-600 dark:text-amber-400">{activeAssignment.scheduledTime}</strong>
                </span>
                <span>•</span>
                <span>
                  {sector.unitType}: <strong className="text-foreground">{activeAssignment.coachOrHall}</strong>
                </span>
                {activeAssignment.driverOrLead && (
                  <>
                    <span>•</span>
                    <span>Lead: <strong className="text-foreground">{activeAssignment.driverOrLead}</strong></span>
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
              <span className="text-[11px] text-muted-foreground text-center sm:text-right">
                Ready for digital QR vouchers & paper passes
              </span>
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

      {/* KPI Stats Grid - 4 Columns Display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Scanned Today */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px]">Scanned Passes</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">{totalScans}</div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Total scans verified</span>
          </div>
        </div>

        {/* Valid & Admitted */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px]">Valid & Admitted</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{validScans}</div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>{validPercentage}% pass rate</span>
          </div>
        </div>

        {/* Interceptions / Duplicate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px]">Interceptions</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">{duplicateScans}</div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
            <span>Re-used / Cross-sector</span>
          </div>
        </div>

        {/* Invalid / Rejected */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px]">Invalid Passes</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">{invalidScans}</div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-rose-600 dark:text-rose-400">
            <span>Signature mismatch</span>
          </div>
        </div>
      </div>

      {/* Manual Quick Validation Box (Field Fallback Tool) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Instant Pass Code Lookup & Validation</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              For patrons with cracked screens, low phone battery, or printed booking reference codes.
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {sector.formatHint}
          </span>
        </div>

        <form onSubmit={handleManualVerify} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder={`e.g. ${sector.demoValidCode} or paste QR token...`}
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setManualCode(sector.demoValidCode)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 font-mono cursor-pointer"
              title={sector.demoValidName}
            >
              Valid Test Pass
            </button>
            <button
              type="button"
              onClick={() => setManualCode(sector.demoWrongCode)}
              className="px-3 py-2.5 rounded-xl border border-purple-500/30 text-[11px] text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 font-mono cursor-pointer"
              title={sector.demoWrongLabel}
            >
              Wrong Sector
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-60 flex items-center gap-1.5 shrink-0 cursor-pointer"
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
          </div>
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

      {/* Main Grid: Operational Sessions & Live Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Sessions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Assigned Operational Duty Sessions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Official verification posts assigned by {profile.organizationName}
                </p>
              </div>
              <Link
                href="/inspector/assigned"
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>View all ({assignments.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {assignments.map((asn) => {
                const isSelected = activeAssignment?.id === asn.id;
                return (
                  <div
                    key={asn.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs group ${
                      isSelected
                        ? "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20"
                        : "bg-slate-50/70 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="p-1 rounded-md bg-white dark:bg-slate-700 shadow-xs">
                          {getCategoryIcon(asn.category)}
                        </div>
                        <span className="font-bold text-foreground text-xs group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                          {asn.title}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            asn.status === "ACTIVE_NOW"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20"
                              : asn.status === "UPCOMING"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {asn.status === "ACTIVE_NOW"
                            ? "Active Live"
                            : asn.status === "UPCOMING"
                            ? "Scheduled"
                            : "Finished"}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-white px-1.5 py-0.2 rounded-md">
                            Current Post
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground text-[11px] flex-wrap">
                        <span>{asn.venueOrTerminal}</span>
                        <span>•</span>
                        <span className="font-semibold text-foreground">{asn.gate}</span>
                        <span>•</span>
                        <span>Time: {asn.scheduledTime}</span>
                        <span>•</span>
                        <span>
                          Seats: <strong className="text-foreground">{asn.scannedSeats}/{asn.totalSeats}</strong>
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
                        &quot;{asn.specialInstructions}&quot;
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!isSelected && (
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentAssignment(asn.id);
                            toast.success(`Switched active terminal to: ${asn.title}`);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          Set Active
                        </button>
                      )}
                      <Link
                        href="/inspector/scanner"
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-102"
                      >
                        Scan Gate
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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

        {/* Right Col: Live Audit Stream with Search & Tabs */}
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
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
              {(["ALL", "VALID", "ALERTS"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setStatusFilter(mode)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    statusFilter === mode
                      ? "bg-white dark:bg-slate-700 text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode === "ALL" ? "All Logs" : mode === "VALID" ? "Valid" : "Alerts"}
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
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No scan logs match your search.
                </div>
              ) : (
                filteredHistory.slice(0, 8).map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all text-xs space-y-1.5 border border-slate-200/40 dark:border-slate-800/40 cursor-pointer"
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
    </div>
  );
}
