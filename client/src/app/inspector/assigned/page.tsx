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
  Filter,
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
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function InspectorAssignmentsPage() {
  const router = useRouter();
  const { assignments, profile, setCurrentAssignment } = useInspectorStore();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstructionAssignment, setSelectedInstructionAssignment] =
    useState<InspectorAssignment | null>(null);

  const filteredAssignments = assignments.filter((a) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && a.status === "ACTIVE_NOW") ||
      (statusFilter === "UPCOMING" && a.status === "UPCOMING") ||
      (statusFilter === "COMPLETED" && a.status === "COMPLETED");

    const matchesCategory = categoryFilter === "ALL" || a.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      a.title.toLowerCase().includes(q) ||
      a.venueOrTerminal.toLowerCase().includes(q) ||
      a.gate.toLowerCase().includes(q) ||
      (a.driverOrLead && a.driverOrLead.toLowerCase().includes(q));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleStartScanning = (assignment: InspectorAssignment) => {
    setCurrentAssignment(assignment.id);
    toast.success(`Switched active scanner post to: ${assignment.gate}`);
    router.push("/inspector/scanner");
  };

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Assigned Gate Posts & Sessions
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Official inspection posts assigned to you by {profile.organizationName}.
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
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-nowrap pb-1 sm:pb-0">
            {[
              { id: "ALL", label: `All Posts (${assignments.length})` },
              { id: "ACTIVE", label: "Active Live" },
              { id: "UPCOMING", label: "Upcoming" },
              { id: "COMPLETED", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                  statusFilter === tab.id
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800/60 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-foreground"
                }`}
              >
                {tab.label}
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
              placeholder="Search station, gate, or route..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <Filter className="w-3 h-3" /> Sector:
          </span>
          {["ALL", "BUS", "EVENT", "SPORTS", "CINEMA"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                categoryFilter === cat
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-600/30"
                  : "bg-slate-100 dark:bg-slate-800/40 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {cat === "ALL" ? "All Sectors" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-card rounded-3xl border border-slate-200/50 dark:border-slate-800/50 text-muted-foreground text-xs shadow-sm">
            No gate inspection posts match your selected filters.
          </div>
        ) : (
          filteredAssignments.map((asn) => {
            const fillRate = Math.round((asn.scannedSeats / asn.totalSeats) * 100);

            return (
              <div
                key={asn.id}
                className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {asn.id}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        asn.status === "ACTIVE_NOW"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : asn.status === "UPCOMING"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : "bg-muted text-muted-foreground border-border/50"
                      }`}
                    >
                      {asn.status === "ACTIVE_NOW"
                        ? "Active Now"
                        : asn.status === "UPCOMING"
                        ? "Upcoming"
                        : "Completed"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                      {getCategoryIcon(asn.category)}
                      <span>{asn.title}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{asn.venueOrTerminal}</span>
                      <span>•</span>
                      <span className="font-semibold text-foreground">{asn.gate}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/70 dark:bg-slate-800/30 p-3 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
                    <div>
                      <span className="text-muted-foreground block">Departure Time:</span>
                      <span className="font-semibold text-foreground">
                        {asn.scheduledDate} • {asn.scheduledTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Vehicle / Hall:</span>
                      <span className="font-semibold text-foreground truncate block">
                        {asn.coachOrHall}
                      </span>
                    </div>
                  </div>

                  {/* Boarding Progress */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-muted-foreground">Checked-In Progress:</span>
                      <span className="font-mono font-bold text-foreground">
                        {asn.scannedSeats} / {asn.totalSeats} ({fillRate}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, fillRate)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200/40 dark:border-slate-800/40 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedInstructionAssignment(asn)}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-semibold"
                  >
                    <Info className="w-3.5 h-3.5" /> Instructions
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartScanning(asn)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Scan Post
                    </button>

                    <ActionDropdown
                      items={[
                        {
                          label: "Open Live Scanner",
                          icon: <QrCode className="w-3.5 h-3.5" />,
                          onClick: () => handleStartScanning(asn),
                        },
                        {
                          label: "Gate Instructions",
                          icon: <Info className="w-3.5 h-3.5" />,
                          onClick: () => setSelectedInstructionAssignment(asn),
                        },
                        {
                          label: "Copy Post Ref",
                          icon: <Copy className="w-3.5 h-3.5" />,
                          onClick: () => {
                            navigator.clipboard.writeText(asn.id);
                            toast.success("Post ID copied");
                          },
                        },
                        {
                          label: "View All Scans",
                          icon: <Clock className="w-3.5 h-3.5" />,
                          href: "/inspector/history",
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Gate Instructions Modal */}
      {selectedInstructionAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Gate Standing Instructions
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                  {selectedInstructionAssignment.gate} • {selectedInstructionAssignment.id}
                </p>
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
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-600/20 text-amber-800 dark:text-amber-200 space-y-1">
                <span className="font-bold block">Supervisor Instructions:</span>
                <p className="leading-relaxed">
                  {selectedInstructionAssignment.specialInstructions}
                </p>
              </div>

              {selectedInstructionAssignment.driverOrLead && (
                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40 space-y-1.5">
                  <span className="font-semibold text-foreground block">
                    Lead Driver / Gate Contact:
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {selectedInstructionAssignment.driverOrLead}
                    </span>
                    <span className="font-mono font-semibold text-foreground">
                      {selectedInstructionAssignment.driverPhone}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
              <button
                type="button"
                onClick={() => setSelectedInstructionAssignment(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const asn = selectedInstructionAssignment;
                  setSelectedInstructionAssignment(null);
                  handleStartScanning(asn);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white"
              >
                Open Scanner for This Gate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
