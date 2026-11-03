"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  Building2,
  User,
  X,
  Check,
  Eye,
} from "lucide-react";
import { useAdminStore, AdminRefund } from "@/stores/admin.store";
import { ActionDropdown, ActionDropdownItem } from "@/components/ui/action-dropdown";

export default function AdminRefundsPage() {
  const { refunds, processRefund } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRefund, setSelectedRefund] = useState<AdminRefund | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | null>(null);

  const filteredRefunds = refunds.filter((r) => {
    const matchesSearch =
      r.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = refunds.filter((r) => r.status === "PENDING").length;
  const approvedCount = refunds.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = refunds.filter((r) => r.status === "REJECTED").length;

  const handleConfirmAction = () => {
    if (!selectedRefund || !actionType) return;
    processRefund(selectedRefund.id, actionType === "APPROVE", actionNotes);
    setSelectedRefund(null);
    setActionType(null);
    setActionNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Customer Refund Claims & Dispute Resolution
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit customer refund requests, provider departure cancellations, and enforce consumer dispute policy.
          </p>
        </div>

        <Link
          href="/admin/bookings"
          className="px-3.5 py-2 text-xs font-semibold rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 hover:bg-muted text-foreground transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <span>All Bookings Ledger</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3 overflow-x-auto no-scrollbar flex-nowrap">
        {[
          { label: "All Claims", value: "ALL", count: refunds.length },
          { label: "Pending Review", value: "PENDING", count: pendingCount },
          { label: "Approved Refunds", value: "APPROVED", count: approvedCount },
          { label: "Rejected Claims", value: "REJECTED", count: rejectedCount },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              statusFilter === tab.value
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === tab.value ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search claim ref, booking, customer, or provider..."
          className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
        />
      </div>

      {/* Refunds Table (Elevated, Soft Borders, Modern Rows) */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Claim Reference</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Provider & Service</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Reason Category</th>
                <th className="px-4 py-3.5">Date Filed</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredRefunds.map((r) => (
                <tr key={r.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                    <div>
                      <p>{r.reference}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{r.bookingReference}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-foreground">{r.customerName}</td>
                  <td className="px-4 py-3.5">
                    <div className="max-w-[220px]">
                      <p className="font-semibold text-foreground truncate">{r.serviceTitle}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{r.providerName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-foreground text-sm">
                    {r.amount} <span className="text-[10px] text-muted-foreground font-normal">ETB</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="max-w-[240px]">
                      <p className="font-semibold text-foreground truncate">{r.reason}</p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {r.customerReasonDetails}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-muted-foreground">{r.requestedAt}</td>
                  <td className="px-4 py-3.5">
                    {r.status === "PENDING" ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    ) : r.status === "APPROVED" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end">
                      <ActionDropdown
                        items={[
                          {
                            label: "Inspect Claim",
                            icon: <Eye className="w-3.5 h-3.5" />,
                            onClick: () => setSelectedRefund(r),
                          },
                          ...(r.status === "PENDING"
                            ? [
                                {
                                  label: "Approve Refund",
                                  icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                                  variant: "success" as const,
                                  onClick: () => {
                                    setSelectedRefund(r);
                                    setActionType("APPROVE");
                                  },
                                },
                                {
                                  label: "Decline Refund",
                                  icon: <XCircle className="w-3.5 h-3.5" />,
                                  variant: "danger" as const,
                                  onClick: () => {
                                    setSelectedRefund(r);
                                    setActionType("REJECT");
                                  },
                                },
                              ]
                            : []),
                          {
                            label: "Customer Account",
                            icon: <User className="w-3.5 h-3.5" />,
                            href: `/admin/users?q=${encodeURIComponent(r.customerName)}`,
                          },
                          {
                            label: "Provider Profile",
                            icon: <Building2 className="w-3.5 h-3.5" />,
                            href: `/admin/providers?q=${encodeURIComponent(r.providerName)}`,
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRefunds.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    No refund claims matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action / Details Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Claim Investigation
                </span>
                <h3 className="font-bold text-sm text-foreground font-mono">{selectedRefund.reference}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedRefund(null);
                  setActionType(null);
                }}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-slate-200/50 dark:border-slate-800/50 space-y-1">
                <p className="font-bold text-foreground">{selectedRefund.serviceTitle}</p>
                <p className="text-muted-foreground">
                  Provider: <strong className="text-foreground">{selectedRefund.providerName}</strong>
                </p>
                <p className="text-muted-foreground">
                  Customer: <strong className="text-foreground">{selectedRefund.customerName}</strong> • Booking:{" "}
                  <strong className="font-mono text-foreground">{selectedRefund.bookingReference}</strong>
                </p>
              </div>

              <div>
                <p className="font-semibold text-foreground">Customer Statement & Grounds for Refund:</p>
                <p className="mt-1 p-3 rounded-2xl bg-muted/40 text-foreground text-[11px] leading-relaxed">
                  {selectedRefund.customerReasonDetails}
                </p>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/40 dark:border-slate-800/40">
                <span className="text-muted-foreground">Claim Amount</span>
                <span className="font-bold text-foreground text-sm">{selectedRefund.amount} ETB</span>
              </div>

              {selectedRefund.decisionNotes && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px]">
                  <p className="font-bold text-amber-700 dark:text-amber-300">Administrative Decision Notes:</p>
                  <p className="mt-0.5 text-foreground">{selectedRefund.decisionNotes}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground font-mono">
                    Decided on: {selectedRefund.decisionDate}
                  </p>
                </div>
              )}

              {actionType && (
                <div className="space-y-1.5 pt-1">
                  <label className="block font-semibold text-foreground">
                    Super Admin Policy Justification Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="e.g. Verified with provider dispatch that departure was delayed over 4 hours."
                    className="w-full p-3 text-xs rounded-2xl bg-muted/40 border border-slate-200/60 dark:border-slate-800/60 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedRefund(null);
                  setActionType(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground"
              >
                Close
              </button>
              {actionType && (
                <button
                  onClick={handleConfirmAction}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl text-white ${
                    actionType === "APPROVE" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {actionType === "APPROVE" ? "Confirm Refund Approval" : "Confirm Rejection"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
