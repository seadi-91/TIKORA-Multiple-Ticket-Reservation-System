"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpDown,
  Bus,
  CheckCircle2,
  Clock,
  Copy,
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
import { ActionDropdown } from "@/components/ui/action-dropdown";

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Ticket Verification Audit Trail
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Digital timestamped record of tickets scanned for <strong className="text-amber-600 dark:text-amber-400">{profile.organizationName}</strong> by {profile.fullName} ({profile.inspectorId}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {verificationHistory.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:bg-muted text-muted-foreground hover:text-destructive transition-colors shadow-xs"
              title="Clear log"
            >
              Clear Log
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card hover:bg-muted text-foreground transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export Audit CSV
          </button>

          <Link
            href="/inspector/scanner"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" /> Open Scanner
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-3 sm:p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Status Tabs */}
          <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl overflow-x-auto no-scrollbar flex-nowrap">
            {[
              { id: "ALL", label: "All", count: verificationHistory.length },
              { id: "VALID", label: "Valid", count: verificationHistory.filter((v) => v.result === "VALID").length },
              { id: "ALREADY_USED", label: "Duplicates", count: verificationHistory.filter((v) => v.result === "ALREADY_USED").length },
              { id: "WRONG_ASSIGNMENT", label: "Wrong Gate", count: verificationHistory.filter((v) => v.result === "WRONG_ASSIGNMENT").length },
              { id: "INVALID", label: "Invalid", count: verificationHistory.filter((v) => v.result === "INVALID").length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-white dark:bg-slate-700 text-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-200/60 dark:bg-slate-600/60">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, passenger, or service..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500/30"
            />
          </div>
        </div>

        {/* Sector Indicator */}
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-200/40 dark:border-slate-800/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">Active Provider:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{profile.organizationName}</span>
            <span>({profile.category} Sector)</span>
          </div>
          <span className="text-[11px] font-mono">
            {filteredHistory.length} total records
          </span>
        </div>
      </div>

      {/* History Master Table (Dual View: Mobile Cards & Desktop Table) */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="block sm:hidden divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredHistory.length === 0 ? (
            <div className="py-12 px-4 text-center text-muted-foreground text-xs">
              No ticket scan records found in this view.
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item.id} className="p-4 space-y-3">
                {/* Header: Ref, Category, Actions */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400 block leading-tight">
                        {item.ticketReference}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">
                        {item.verificationDate} • {item.verificationTime}
                      </span>
                    </div>
                  </div>

                  <ActionDropdown
                    items={[
                      {
                        label: "View Audit Record",
                        icon: <Eye className="w-3.5 h-3.5" />,
                        onClick: () => setSelectedLog(item),
                      },
                      {
                        label: "Copy Ticket Code",
                        icon: <Copy className="w-3.5 h-3.5" />,
                        onClick: () => {
                          navigator.clipboard.writeText(item.ticketReference);
                          toast.success("Copied ticket code to clipboard");
                        },
                      },
                      {
                        label: "Re-scan Gate Ticket",
                        icon: <QrCode className="w-3.5 h-3.5" />,
                        href: "/inspector/scanner",
                      },
                    ]}
                  />
                </div>

                {/* Passenger & Service */}
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">{item.passengerName}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{item.serviceTitle}</p>
                </div>

                {/* Gate, Seat & Outcome Status */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/40 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] bg-muted/60 px-2 py-0.5 rounded-lg text-foreground font-semibold">
                      Seat: {item.seatNumber || "--"}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">
                      {item.location}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${
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
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-5">Ticket Ref</th>
                <th className="py-3.5 px-4">Passenger</th>
                <th className="py-3.5 px-4">Service / Departure</th>
                <th className="py-3.5 px-4 text-center">Seat</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Terminal Gate</th>
                <th className="py-3.5 px-4 text-center">Outcome</th>
                <th className="py-3.5 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-5 text-center text-muted-foreground">
                    No ticket scan records found in this view.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {item.ticketReference}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {item.passengerName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(item.category)}
                        <span className="line-clamp-1 font-medium text-foreground">
                          {item.serviceTitle}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-foreground">
                      {item.seatNumber || "--"}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {item.verificationDate} • {item.verificationTime}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">{item.location}</td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${
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

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          items={[
                            {
                              label: "View Audit Record",
                              icon: <Eye className="w-3.5 h-3.5" />,
                              onClick: () => setSelectedLog(item),
                            },
                            {
                              label: "Copy Ticket Code",
                              icon: <Copy className="w-3.5 h-3.5" />,
                              onClick: () => {
                                navigator.clipboard.writeText(item.ticketReference);
                                toast.success("Copied ticket code to clipboard");
                              },
                            },
                            {
                              label: "Re-scan Gate Ticket",
                              icon: <QrCode className="w-3.5 h-3.5" />,
                              href: "/inspector/scanner",
                            },
                          ]}
                        />
                      </div>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Scan Verification Record</h3>
                <span className="font-mono text-xs text-amber-600 font-bold block mt-0.5">
                  {selectedLog.ticketReference}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50/70 dark:bg-slate-800/30 rounded-2xl p-4 text-xs space-y-2.5 border border-slate-200/40 dark:border-slate-800/40">
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
                <span className="font-semibold text-foreground">{selectedLog.passengerName}</span>
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
                <span className="font-semibold text-foreground line-clamp-1">
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
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
                <span className="font-bold block mb-0.5">Discrepancy Details:</span>
                <p className="leading-relaxed">{selectedLog.failureReason}</p>
              </div>
            )}

            <div className="flex items-center justify-end pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground"
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
