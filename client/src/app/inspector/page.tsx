"use client";

import React from "react";
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
} from "lucide-react";
import { useInspectorStore } from "@/stores/inspector.store";
import { TicketCategory } from "@/types/ticket.types";

export default function InspectorDashboardPage() {
  const { profile, assignments, verificationHistory } = useInspectorStore();

  const activeAssignment =
    assignments.find((a) => a.status === "ACTIVE_NOW") || assignments[0];

  const totalScans = verificationHistory.length;
  const validScans = verificationHistory.filter((v) => v.result === "VALID").length;
  const invalidScans = verificationHistory.filter((v) => v.result === "INVALID").length;
  const duplicateScans = verificationHistory.filter(
    (v) => v.result === "ALREADY_USED" || v.result === "WRONG_ASSIGNMENT"
  ).length;

  const getCategoryIcon = (cat: TicketCategory) => {
    switch (cat) {
      case "BUS":
        return <Bus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "EVENT":
        return <Music className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case "SPORTS":
        return <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case "CINEMA":
        return <Film className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
    }
  };

  const getResultBadge = (result: string) => {
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
            WRONG GATE
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

  const boardedPercentage = Math.round(
    (activeAssignment.scannedSeats / activeAssignment.totalSeats) * 100
  );

  return (
    <div className="space-y-6">
      {/* Active Duty Live Hero Banner (Modern Soft Mesh & Elevation) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/[0.03] to-card border border-amber-500/15 p-6 sm:p-7 shadow-sm">
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold ring-1 ring-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Terminal Post
              </span>
              <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-md">
                ID: {profile.inspectorId}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-foreground">
              {activeAssignment.title}
            </h2>

            <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                {activeAssignment.venueOrTerminal}
              </span>
              <span>•</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {activeAssignment.gate}
              </span>
              <span>•</span>
              <span>Departure: <strong className="text-foreground">{activeAssignment.scheduledTime}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/inspector/scanner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/25 hover:shadow-lg hover:shadow-amber-600/35 transition-all hover:-translate-y-0.5"
            >
              <QrCode className="w-4 h-4" />
              <span>Launch Ticket Scanner</span>
            </Link>
          </div>
        </div>

        {/* Boarding Progress Bar (Modern Soft Gradient Track) */}
        <div className="mt-5 pt-4 border-t border-amber-500/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Passes Boarded:</span>
            <span className="font-extrabold text-foreground font-mono">
              {activeAssignment.scannedSeats} / {activeAssignment.totalSeats} seats
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
              {boardedPercentage}% validated
            </span>
          </div>

          <div className="w-full sm:w-56 bg-muted/60 rounded-full h-2.5 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-amber-600 to-amber-500 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${Math.min(100, boardedPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Stats Grid - Multiple Column Display (4 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1.5 sm:mb-2">
            <span className="font-bold uppercase tracking-wider text-[9px] sm:text-[10px] truncate">Scanned Today</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-foreground">{totalScans}</div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1 block truncate">Digital passes checked</span>
        </div>

        <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1.5 sm:mb-2">
            <span className="font-bold uppercase tracking-wider text-[9px] sm:text-[10px] truncate">Valid & Admitted</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{validScans}</div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1 block truncate">Passengers boarded</span>
        </div>

        <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1.5 sm:mb-2">
            <span className="font-bold uppercase tracking-wider text-[9px] sm:text-[10px] truncate">Interceptions</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400">{duplicateScans}</div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1 block truncate">Duplicate / wrong gate</span>
        </div>

        <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1.5 sm:mb-2">
            <span className="font-bold uppercase tracking-wider text-[9px] sm:text-[10px] truncate">Invalid / Rejected</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400">{invalidScans}</div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1 block truncate">Signature check failed</span>
        </div>
      </div>

      {/* Main Grid: Operational Sessions & Recent Verification Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Sessions (Clean spaced cards, no harsh divide lines) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  My Assigned Operational Sessions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Verification posts assigned by {profile.organizationName}
                </p>
              </div>
              <Link
                href="/inspector/assigned"
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {assignments.map((asn) => (
                <div
                  key={asn.id}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 hover:bg-amber-500/[0.04] dark:hover:bg-amber-500/[0.08] transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="p-1 rounded-md bg-muted/60">
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
                          ? "Boarding Live"
                          : asn.status === "UPCOMING"
                          ? "Scheduled"
                          : "Finished"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground text-[11px] flex-wrap">
                      <span>{asn.venueOrTerminal}</span>
                      <span>•</span>
                      <span className="font-semibold text-foreground">{asn.gate}</span>
                      <span>•</span>
                      <span>{asn.scheduledDate} at {asn.scheduledTime}</span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
                      &quot;{asn.specialInstructions}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/inspector/scanner"
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs shadow-amber-600/20 transition-all hover:scale-102"
                    >
                      Scan Post
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Recent Scans Stream */}
        <div className="space-y-4">
          <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Live Audit Stream</h3>
                <p className="text-xs text-muted-foreground">Most recent ticket verifications</p>
              </div>
              <Link
                href="/inspector/history"
                className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {verificationHistory.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 hover:bg-muted/40 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                      {log.ticketReference}
                    </span>
                    {getResultBadge(log.result)}
                  </div>

                  <div className="flex items-center justify-between text-foreground font-semibold">
                    <span>{log.passengerName}</span>
                    {log.seatNumber && (
                      <span className="font-mono text-muted-foreground text-[11px] bg-muted/60 px-1.5 py-0.5 rounded">
                        Seat {log.seatNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                    <span className="truncate max-w-[150px]">{log.serviceTitle}</span>
                    <span className="font-mono">{log.verificationTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
