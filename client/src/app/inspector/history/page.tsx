"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpDown,
  Bus,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Film,
  Filter,
  Music,
  QrCode,
  Search,
  ShieldAlert,
  Trash2,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { useInspectorStore, VerificationLogItem } from "@/stores/inspector.store";
import { TicketCategory } from "@/types/ticket.types";
import { toast } from "sonner";

export default function VerificationHistoryPage() {
  const { verificationHistory, clearHistory, profile } = useInspectorStore();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<VerificationLogItem | null>(null);

  const filteredHistory = verificationHistory.filter((item) => {
    const matchesStatus = statusFilter === "ALL" || item.result === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      item.ticketReference.toLowerCase().includes(q) ||
      item.passengerName.toLowerCase().includes(q) ||
      item.serviceTitle.toLowerCase().includes(q);

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = "Reference,Passenger,Seat,Service,Category,Result,Time,Location\n";
    const rows = filteredHistory
      .map(
        (h) =>
          `"${h.ticketReference}","${h.passengerName}","${h.seatNumber || "--"}","${
            h.serviceTitle
          }","${h.category}","${h.result}","${h.verificationDate} ${h.verificationTime}","${
            h.location
          }"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inspector-audit-log-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Verification audit CSV downloaded.");
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your local verification scan audit trail?")) {
      clearHistory();
      toast.success("Audit log cleared.");
    }
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Ticket Verification Audit Trail
          </h1>
          <p className="text-xs text-muted-foreground">
            Digital timestamped record of tickets scanned by {profile.fullName} ({profile.inspectorId}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {verificationHistory.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
              title="Clear log"
            >
              Clear Log
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Audit CSV
          </button>

          <Link
            href="/inspector/scanner"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" /> Open Scanner
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: `All Scans (${verificationHistory.length})` },
              { id: "VALID", label: "Valid" },
              { id: "ALREADY_USED", label: "Duplicates" },
              { id: "WRONG_ASSIGNMENT", label: "Wrong Gate" },
              { id: "INVALID", label: "Invalid Signature" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === tab.id
                    ? "bg-amber-600 text-white font-semibold"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, passenger, or service..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Filter className="w-3 h-3" /> Sector:
          </span>
          {["ALL", "BUS", "EVENT", "SPORTS", "CINEMA"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                categoryFilter === cat
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-600/30"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat === "ALL" ? "All Sectors" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* History Data Table */}
      <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Ticket Ref</th>
                <th className="py-3 px-3">Passenger</th>
                <th className="py-3 px-3">Service / Departure</th>
                <th className="py-3 px-3 text-center">Seat</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Terminal Gate</th>
                <th className="py-3 px-3 text-center">Outcome</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    No ticket scan records found in this view.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600">
                      {item.ticketReference}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-foreground">
                      {item.passengerName}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(item.category)}
                        <span className="line-clamp-1 font-medium text-foreground">
                          {item.serviceTitle}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-semibold text-foreground">
                      {item.seatNumber || "--"}
                    </td>

                    <td className="py-3.5 px-3 text-muted-foreground whitespace-nowrap">
                      {item.verificationDate} • {item.verificationTime}
                    </td>

                    <td className="py-3.5 px-3 text-muted-foreground">{item.location}</td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          item.result === "VALID"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : item.result === "ALREADY_USED"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : item.result === "WRONG_ASSIGNMENT"
                            ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.result === "VALID"
                              ? "bg-emerald-600"
                              : item.result === "ALREADY_USED"
                              ? "bg-amber-500"
                              : item.result === "WRONG_ASSIGNMENT"
                              ? "bg-purple-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {item.result === "VALID"
                          ? "Approved"
                          : item.result === "ALREADY_USED"
                          ? "Duplicate"
                          : item.result === "WRONG_ASSIGNMENT"
                          ? "Wrong Gate"
                          : "Invalid"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(item)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="View audit metadata"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Scan Verification Record</h3>
                <span className="font-mono text-xs text-amber-600 font-bold block mt-0.5">
                  {selectedLog.ticketReference}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 text-xs space-y-2 border border-border/50">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Verification Outcome:</span>
                <span
                  className={`font-bold ${
                    selectedLog.result === "VALID"
                      ? "text-emerald-600"
                      : selectedLog.result === "ALREADY_USED"
                      ? "text-amber-600"
                      : "text-rose-600"
                  }`}
                >
                  {selectedLog.result}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Passenger:</span>
                <span className="font-medium text-foreground">{selectedLog.passengerName}</span>
              </div>

              {selectedLog.seatNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seat Assignment:</span>
                  <span className="font-mono font-bold text-foreground">
                    {selectedLog.seatNumber}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium text-foreground line-clamp-1">
                  {selectedLog.serviceTitle}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Scanned Timestamp:</span>
                <span className="font-mono text-muted-foreground">
                  {selectedLog.verificationDate} at {selectedLog.verificationTime}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Station Post:</span>
                <span className="text-foreground">{selectedLog.location}</span>
              </div>
            </div>

            {selectedLog.failureReason && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs">
                <span className="font-bold block mb-0.5">Discrepancy Details:</span>
                <p className="leading-relaxed">{selectedLog.failureReason}</p>
              </div>
            )}

            <div className="flex items-center justify-end pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-muted hover:bg-muted/80 text-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
