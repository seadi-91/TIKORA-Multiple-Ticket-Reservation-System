"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bus,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
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
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function ProviderRefundsPage() {
  const { organization, refunds, processRefund } = useProviderStore();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const sectorRefunds = refunds.filter((r) => r.category === organization.category);

  const filteredRefunds = sectorRefunds.filter((r) => {
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

  const pendingCount = sectorRefunds.filter((r) => r.status === "PENDING").length;
  const approvedCount = sectorRefunds.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = sectorRefunds.filter((r) => r.status === "REJECTED").length;
  const totalApprovedAmount = sectorRefunds
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
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
              {organization.category} Refund Claims
            </span>
            <span className="text-xs text-muted-foreground">{organization.name}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Refunds & Customer Disputes
          </h1>
          <p className="text-xs text-muted-foreground">
            Review cancellation claims, customer refund requests, and ticket disputes for {organization.name}.
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

      {/* KPI Cards - Multiple Column Display (4 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-card border border-amber-600/30 rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="font-semibold text-amber-700 dark:text-amber-300 text-[10px] sm:text-xs truncate">
              Pending Claims
            </span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-amber-700 dark:text-amber-400">
            {pendingCount}
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate block">Awaiting review</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate">Approved</span>
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground">{approvedCount}</div>
          <span className="text-[10px] sm:text-[11px] text-emerald-600 truncate block">
            {formatCurrency(totalApprovedAmount)} returned
          </span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate">Rejected</span>
            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground">{rejectedCount}</div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate block">Did not meet policy</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Avg Response Time</span>
            <RotateCcw className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground">3.2 hrs</div>
          <span className="text-[11px] text-muted-foreground">Within SLA target of 24h</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-nowrap pb-1 sm:pb-0">
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

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, customer, or reason..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        </div>
      </div>

      {/* Refunds Table & Mobile Cards */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/40 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Service / Route</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 min-w-[200px]">Reason Given</th>
                <th className="py-3.5 px-4">Request Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No refund requests found in this view.
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((r) => (
                  <tr key={r.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {r.bookingReference}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {r.customerName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(r.category)}
                        <span className="line-clamp-1 text-foreground font-medium">
                          {r.serviceTitle}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                      {formatCurrency(r.requestedAmount)}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      <p className="line-clamp-2 text-[11px] leading-relaxed italic">
                        &quot;{r.reason}&quot;
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap font-mono">
                      {r.requestDate}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${
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

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          items={[
                            ...(r.status === "PENDING"
                              ? [
                                  {
                                    label: "Approve Refund",
                                    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                                    variant: "success" as const,
                                    onClick: () =>
                                      handleApprove(
                                        r.id,
                                        r.bookingReference,
                                        r.requestedAmount
                                      ),
                                  },
                                  {
                                    label: "Decline Claim",
                                    icon: <XCircle className="w-3.5 h-3.5" />,
                                    variant: "danger" as const,
                                    onClick: () =>
                                      handleReject(r.id, r.bookingReference),
                                  },
                                ]
                              : []),
                            {
                              label: "Copy Booking Ref",
                              icon: <Copy className="w-3.5 h-3.5" />,
                              onClick: () => {
                                navigator.clipboard.writeText(r.bookingReference);
                                toast.success("Booking reference copied");
                              },
                            },
                            {
                              label: "View Booking Record",
                              icon: <Eye className="w-3.5 h-3.5" />,
                              href: `/provider/bookings?q=${encodeURIComponent(
                                r.bookingReference
                              )}`,
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

        {/* Mobile View: High-End Refund Request Cards */}
        <div className="block md:hidden p-3 space-y-2.5">
          {filteredRefunds.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs">
              No refund requests found in this view.
            </div>
          ) : (
            filteredRefunds.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                    {r.bookingReference}
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        r.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : r.status === "REJECTED"
                          ? "bg-rose-500/10 text-rose-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {r.status}
                    </span>

                    <ActionDropdown
                      items={[
                        ...(r.status === "PENDING"
                          ? [
                              {
                                label: "Approve Refund",
                                icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                                variant: "success" as const,
                                onClick: () =>
                                  handleApprove(
                                    r.id,
                                    r.bookingReference,
                                    r.requestedAmount
                                  ),
                              },
                              {
                                label: "Decline Claim",
                                icon: <XCircle className="w-3.5 h-3.5" />,
                                variant: "danger" as const,
                                onClick: () =>
                                  handleReject(r.id, r.bookingReference),
                              },
                            ]
                          : []),
                        {
                          label: "Copy Ref",
                          icon: <Copy className="w-3.5 h-3.5" />,
                          onClick: () => {
                            navigator.clipboard.writeText(r.bookingReference);
                            toast.success("Booking reference copied");
                          },
                        },
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-foreground leading-tight">
                    {r.serviceTitle}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span>{r.customerName}</span>
                    <span>•</span>
                    <span className="font-mono">{r.requestDate}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-card border border-border/40 text-[11px] text-muted-foreground italic">
                  &quot;{r.reason}&quot;
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/30 dark:border-slate-800/30 text-xs">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Claim Amount</span>
                  <span className="font-mono font-bold text-foreground">{formatCurrency(r.requestedAmount)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
