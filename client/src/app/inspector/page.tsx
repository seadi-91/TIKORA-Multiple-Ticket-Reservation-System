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
        return <Bus className="w-3.5 h-3.5 text-amber-600" />;
      case "EVENT":
        return <Music className="w-3.5 h-3.5 text-purple-600" />;
      case "SPORTS":
        return <Trophy className="w-3.5 h-3.5 text-emerald-600" />;
      case "CINEMA":
        return <Film className="w-3.5 h-3.5 text-sky-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Duty Live Banner */}
      <div className="rounded-xl border border-amber-600/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Gate Session
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {profile.inspectorId}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {activeAssignment.title}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{activeAssignment.venueOrTerminal}</span>
              <span>•</span>
              <span className="font-semibold text-foreground">{activeAssignment.gate}</span>
              <span>•</span>
              <span>Departure: {activeAssignment.scheduledTime}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/inspector/scanner"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all hover:scale-102"
            >
              <QrCode className="w-4 h-4" />
              <span>Launch Ticket Scanner</span>
            </Link>
          </div>
        </div>

        {/* Boarding Progress Bar */}
        <div className="mt-4 pt-3 border-t border-amber-600/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Passes Validated:</span>
            <span className="font-bold text-foreground font-mono">
              {activeAssignment.scannedSeats} / {activeAssignment.totalSeats} seats
            </span>
            <span className="text-[11px] text-amber-600 font-semibold">
              ({Math.round((activeAssignment.scannedSeats / activeAssignment.totalSeats) * 100)}% boarded)
            </span>
          </div>

          <div className="w-full sm:w-48 bg-muted/60 rounded-full h-2 overflow-hidden border border-border/40">
            <div
              className="bg-amber-600 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((activeAssignment.scannedSeats / activeAssignment.totalSeats) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Scanned Today</span>
            <QrCode className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-foreground">{totalScans}</div>
          <span className="text-[11px] text-muted-foreground">Digital passes checked</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Valid & Boarded</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-600">{validScans}</div>
          <span className="text-[11px] text-muted-foreground">Passengers admitted</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Interceptions</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-600">{duplicateScans}</div>
          <span className="text-[11px] text-muted-foreground">Duplicates & wrong gates</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Invalid / Forged</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-rose-600">{invalidScans}</div>
          <span className="text-[11px] text-muted-foreground">Cryptographic check failed</span>
        </div>
      </div>

      {/* Main Grid: Today's Assignments & Recent Verification Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assignments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  My Assigned Operational Sessions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Scheduled verification posts assigned by {profile.organizationName}
                </p>
              </div>
              <Link
                href="/inspector/assigned"
                className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1"
              >
                View All →
              </Link>
            </div>

            <div className="divide-y divide-border/40">
              {assignments.map((asn) => (
                <div
                  key={asn.id}
                  className="p-4 hover:bg-muted/20 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(asn.category)}
                      <span className="font-bold text-foreground text-xs">{asn.title}</span>
                      <span
                        className={`inline-flex items-center px-2 py-0.2 rounded text-[10px] font-semibold border ${
                          asn.status === "ACTIVE_NOW"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : asn.status === "UPCOMING"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-muted text-muted-foreground border-border/50"
                        }`}
                      >
                        {asn.status === "ACTIVE_NOW"
                          ? "Boarding Live"
                          : asn.status === "UPCOMING"
                          ? "Scheduled"
                          : "Finished"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
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
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      Scan Post
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Recent Scans Log */}
        <div className="space-y-4">
          <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Live Audit Stream</h3>
                <p className="text-xs text-muted-foreground">Most recent ticket checks</p>
              </div>
              <Link
                href="/inspector/history"
                className="text-xs text-amber-600 font-semibold hover:underline"
              >
                History →
              </Link>
            </div>

            <div className="p-3 space-y-2.5 max-h-96 overflow-y-auto">
              {verificationHistory.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg border border-border/50 bg-muted/20 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-600 text-xs">
                      {log.ticketReference}
                    </span>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                        log.result === "VALID"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : log.result === "ALREADY_USED"
                          ? "bg-amber-500/10 text-amber-600"
                          : log.result === "WRONG_ASSIGNMENT"
                          ? "bg-purple-500/10 text-purple-600"
                          : "bg-rose-500/10 text-rose-600"
                      }`}
                    >
                      {log.result}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-foreground font-medium">
                    <span>{log.passengerName}</span>
                    {log.seatNumber && (
                      <span className="font-mono text-muted-foreground text-[11px]">
                        Seat {log.seatNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                    <span className="truncate max-w-[140px]">{log.serviceTitle}</span>
                    <span>{log.verificationTime}</span>
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
