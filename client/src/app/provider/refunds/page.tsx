"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bus,
  CheckCircle2,
  Clock,
  Film,
  Music,
  RotateCcw,
  Search,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  XCircle,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { formatCurrency } from "@/lib/format-currency";
import { TicketCategory } from "@/types/ticket.types";
import { toast } from "sonner";

export default function ProviderRefundsPage() {
  const { refunds, processRefund } = useProviderStore();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRefunds = refunds.filter((r) => {
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      r.bookingReference.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.serviceTitle.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = refunds.filter((r) => r.status === "PENDING").length;
  const approvedCount = refunds.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = refunds.filter((r) => r.status === "REJECTED").length;
  const totalApprovedAmount = refunds
    .filter((r) => r.status === "APPROVED")
    .reduce((acc, r) => acc + r.requestedAmount, 0);

  const handleApprove = (id: string, ref: string, amount: number) => {
    processRefund(id, "APPROVED");
    toast.success(
      `Refund of ${formatCurrency(amount)} approved for ${ref}. Customer account will be credited.`
    );
  };

  const handleReject = (id: string, ref: string) => {
    processRefund(id, "REJECTED");
    toast.error(`Refund claim for ${ref} has been rejected.`);
  };

  const getCategoryIcon = (cat: TicketCategory) => {
    switch (cat) {
      case "BUS":
        return <Bus className="w-3 h-3 text-amber-600" />;
      case "EVENT":
        return <Music className="w-3 h-3 text-purple-600" />;
      case "SPORTS":
        return <Trophy className="w-3 h-3 text-emerald-600" />;
      case "CINEMA":
        return <Film className="w-3 h-3 text-sky-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Refunds & Customer Disputes
          </h1>
          <p className="text-xs text-muted-foreground">
            Review cancellation claims, passenger refund requests, and customer dispute resolutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/provider/bookings"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors"
          >
            View All Bookings
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-amber-600/30 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="font-semibold text-amber-700 dark:text-amber-300">
              Pending Claims
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
            {pendingCount}
          </div>
          <span className="text-[11px] text-muted-foreground">Awaiting provider review</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Approved Refunds</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-foreground">{approvedCount}</div>
          <span className="text-[11px] text-emerald-600">
            {formatCurrency(totalApprovedAmount)} returned
          </span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Rejected Disputes</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-foreground">{rejectedCount}</div>
          <span className="text-[11px] text-muted-foreground">Did not meet refund policy</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Avg Response Time</span>
            <RotateCcw className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-foreground">3.2 hrs</div>
          <span className="text-[11px] text-muted-foreground">Within SLA target of 24h</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: `All Claims (${refunds.length})` },
              { id: "PENDING", label: `Pending (${pendingCount})` },
              { id: "APPROVED", label: `Approved (${approvedCount})` },
              { id: "REJECTED", label: `Rejected (${rejectedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === tab.id
                    ? "bg-amber-600 text-white"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, customer, or reason..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Service / Route</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-4 min-w-[200px]">Reason Given</th>
                <th className="py-3 px-3">Request Date</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    No refund requests found in this view.
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600">
                      {r.bookingReference}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-foreground">
                      {r.customerName}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(r.category)}
                        <span className="line-clamp-1 text-foreground font-medium">
                          {r.serviceTitle}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(r.requestedAmount)}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      <p className="line-clamp-2 text-[11px] leading-relaxed italic">
                        &quot;{r.reason}&quot;
                      </p>
                    </td>

                    <td className="py-3.5 px-3 text-muted-foreground whitespace-nowrap">
                      {r.requestDate}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold border ${
                          r.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : r.status === "REJECTED"
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            r.status === "APPROVED"
                              ? "bg-emerald-600"
                              : r.status === "REJECTED"
                              ? "bg-rose-600"
                              : "bg-amber-500"
                          }`}
                        />
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {r.status === "PENDING" ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApprove(r.id, r.bookingReference, r.requestedAmount)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                            title="Approve refund"
                          >
                            <ThumbsUp className="w-3 h-3" /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(r.id, r.bookingReference)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded border border-rose-600/30 text-rose-600 hover:bg-rose-500/10 transition-colors"
                            title="Reject claim"
                          >
                            <ThumbsDown className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
