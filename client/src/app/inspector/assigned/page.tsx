"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Bus,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Film,
  Info,
  MapPin,
  Music,
  Phone,
  QrCode,
  Search,
  Shield,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import { useInspectorStore, InspectorAssignment } from "@/stores/inspector.store";
import { TicketCategory } from "@/types/ticket.types";
import { toast } from "sonner";

export default function InspectorAssignmentsPage() {
  const router = useRouter();
  const { assignments, profile, setCurrentAssignment } = useInspectorStore();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstructionAssignment, setSelectedInstructionAssignment] =
    useState<InspectorAssignment | null>(null);

  const getPageMeta = () => {
    switch (profile.category) {
      case "CINEMA":
        return {
          title: "Auditorium Gate Shifts & Screenings",
          desc: `Authorized screening gates assigned to you by ${profile.organizationName}. Ushers manage patron admission exclusively for these halls.`,
          gateLabel: "Auditorium Gate",
          unitLabel: "Admitted Patrons",
          unitType: "Screening Hall",
        };
      case "BUS":
        return {
          title: "Platform Gate Posts & Boarding Sessions",
          desc: `Authorized platform gates assigned to you by ${profile.organizationName}. Inspectors manage passenger boarding exclusively for these coach lines.`,
          gateLabel: "Platform Gate",
          unitLabel: "Boarded Passengers",
          unitType: "Coach Fleet",
        };
      case "EVENT":
        return {
          title: "Turnstile Gates & Access Shifts",
          desc: `Authorized venue turnstiles assigned to you by ${profile.organizationName}.`,
          gateLabel: "Venue Turnstile",
          unitLabel: "Admitted Guests",
          unitType: "Concert Stage",
        };
      case "SPORTS":
        return {
          title: "Stadium Gates & Tribune Shifts",
          desc: `Authorized matchday gates assigned to you by ${profile.organizationName}.`,
          gateLabel: "Stadium Gate",
          unitLabel: "Admitted Fans",
          unitType: "Tribune Stand",
        };
    }
  };

  const meta = getPageMeta();

  const filteredAssignments = assignments.filter((a) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && a.status === "ACTIVE_NOW") ||
      (statusFilter === "UPCOMING" && a.status === "UPCOMING") ||
      (statusFilter === "COMPLETED" && a.status === "COMPLETED");

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      a.title.toLowerCase().includes(q) ||
      a.venueOrTerminal.toLowerCase().includes(q) ||
      a.gate.toLowerCase().includes(q) ||
      (a.driverOrLead && a.driverOrLead.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const handleStartScanning = (assignment: InspectorAssignment) => {
    setCurrentAssignment(assignment.id);
    toast.success(`Switched active scanner post to: ${assignment.gate}`);
    router.push("/inspector/scanner");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              {profile.organizationName}
            </span>
            <span className="text-xs text-slate-500">Provider-Restricted Duty</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {meta.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {meta.desc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/inspector/scanner"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" /> Launch Scanner
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Status Tabs */}
          <div className="inline-flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg overflow-x-auto no-scrollbar">
            {[
              { id: "ALL", label: "All", count: assignments.length },
              { id: "ACTIVE", label: "Active", count: assignments.filter((a) => a.status === "ACTIVE_NOW").length },
              { id: "UPCOMING", label: "Upcoming", count: assignments.filter((a) => a.status === "UPCOMING").length },
              { id: "COMPLETED", label: "Completed", count: assignments.filter((a) => a.status === "COMPLETED").length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-white dark:bg-slate-700 text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono opacity-75">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station, gate, or title..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Assignments Cards Grid */}
      {filteredAssignments.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-card border border-dashed border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">No duty assignments scheduled</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You do not have any gate or turnstile shifts matching this filter. New assignments dispatched by {profile.organizationName} will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssignments.map((assignment) => {
            const occupancy = Math.round((assignment.scannedSeats / assignment.totalSeats) * 100);

            return (
              <div
                key={assignment.id}
                className={`bg-card border rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${assignment.status === "ACTIVE_NOW"
                    ? "border-amber-500/50 shadow-md ring-1 ring-amber-500/20"
                    : "border-slate-200/60 dark:border-slate-800/60"
                  }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                      {assignment.id}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${assignment.status === "ACTIVE_NOW"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : assignment.status === "UPCOMING"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-muted text-muted-foreground border-border/50"
                        }`}
                    >
                      {assignment.status === "ACTIVE_NOW"
                        ? "Active Live"
                        : assignment.status === "UPCOMING"
                          ? "Upcoming"
                          : "Completed"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-foreground line-clamp-1">
                      {assignment.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{assignment.gate}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {assignment.scheduledDate} • {assignment.scheduledTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {profile.category === "CINEMA" ? (
                        <Film className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <Bus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{assignment.coachOrHall}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-muted-foreground">{meta.unitLabel}:</span>
                      <span className="font-mono font-bold text-foreground">
                        {assignment.scannedSeats} / {assignment.totalSeats} seats
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, occupancy)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInstructionAssignment(assignment)}
                    className="text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                  >
                    Instructions
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartScanning(assignment)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Start Scanning</span>
                  </button>
                </div>
              </div>
            );
          })}
          i        </div>
      )}

      {/* Instruction Modal */}
      {selectedInstructionAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-foreground">Gate Protocols & Instructions</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInstructionAssignment(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="font-bold text-sm text-foreground">
                  {selectedInstructionAssignment.title}
                </p>
                <p className="text-muted-foreground mt-0.5">
                  {selectedInstructionAssignment.gate} • {selectedInstructionAssignment.venueOrTerminal}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-muted-foreground leading-relaxed">
                <span className="font-bold text-[10px] uppercase text-amber-800 dark:text-amber-300 block mb-1">
                  Provider Management Notice
                </span>
                {selectedInstructionAssignment.specialInstructions}
              </div>

              {selectedInstructionAssignment.driverOrLead && (
                <div className="p-3 bg-muted/40 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Station Lead</span>
                    <span className="font-semibold text-foreground">
                      {selectedInstructionAssignment.driverOrLead}
                    </span>
                  </div>
                  {selectedInstructionAssignment.driverPhone && (
                    <a
                      href={`tel:${selectedInstructionAssignment.driverPhone}`}
                      className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedInstructionAssignment(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xs cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
