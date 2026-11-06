"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Building2,
  Search,
  Filter,
  Check,
  X,
  FileText,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function AdminPaymentsPage() {
  const { payouts, processPayout, stats } = useAdminStore();

  const [activeTab, setActiveTab] = useState<"PENDING" | "HISTORY">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayout, setSelectedPayout] = useState<string | null>(null);
  const [payoutNotes, setPayoutNotes] = useState("");

  const pendingPayouts = payouts.filter((p) => p.status === "PENDING");
  const processedPayouts = payouts.filter((p) => p.status !== "PENDING");

  const filteredPayouts = (activeTab === "PENDING" ? pendingPayouts : processedPayouts).filter(
    (p) =>
      p.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.accountNumber.includes(searchQuery)
  );

  const totalPendingAmount = pendingPayouts.reduce((acc, p) => acc + p.netAmount, 0);

  const handleApprove = (id: string) => {
    processPayout(id, true, payoutNotes || "Disbursed via automated bank gateway batch");
    setSelectedPayout(null);
    setPayoutNotes("");
  };

  const handleReject = (id: string) => {
    processPayout(id, false, payoutNotes || "Declined due to bank account name mismatch");
    setSelectedPayout(null);
    setPayoutNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Financial Oversight & Provider Disbursements
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit Gross Merchandise Value (GMV), platform fee retention, and authorize bank payout settlements.
          </p>
        </div>

        <Link
          href="/admin/commissions"
          className="px-3.5 py-2 text-xs font-semibold rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 hover:bg-muted text-foreground transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Percent className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Commission Rules</span>
        </Link>
      </div>

      {/* Financial KPI Cards - Multiple Column Display (4 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate">Gross GMV</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">
            {stats.totalGMV.toLocaleString()} <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">ETB</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Platform gross sales</p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate">Net Revenue</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">
            {stats.platformRevenue.toLocaleString()} <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">ETB</span>
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 truncate">
            ~5.0% commission
          </p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate">Pending Payouts</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">
            {totalPendingAmount.toLocaleString()} <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">ETB</span>
          </p>
          <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium mt-0.5 truncate">
            {pendingPayouts.length} pending
          </p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate">Settled to Providers</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">
            {(stats.totalGMV - stats.platformRevenue - totalPendingAmount).toLocaleString()}{" "}
            <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">ETB</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Disbursed via CBE & Telebirr</p>
        </div>
      </div>

      {/* Tabs: Pending Queue vs Processed History (Mobile-First Responsive) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
        {/* Mobile View: Dropdown Switcher */}
        <div className="block sm:hidden w-full">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
            Settlement View
          </label>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as "PENDING" | "HISTORY")}
            className="w-full h-10 px-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
          >
            <option value="PENDING">Pending Payouts Queue ({pendingPayouts.length})</option>
            <option value="HISTORY">Settlement History ({processedPayouts.length})</option>
          </select>
        </div>

        {/* Desktop View: Tabs */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`px-2 py-0.5 text-micro font-medium rounded-md transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
              activeTab === "PENDING"
                ? "bg-amber-600 text-white shadow-xs font-semibold"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Pending Payouts Queue</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-nano font-bold ${
                activeTab === "PENDING" ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {pendingPayouts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`px-2 py-0.5 text-micro font-medium rounded-md transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
              activeTab === "HISTORY"
                ? "bg-amber-600 text-white shadow-xs font-semibold"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Settlement History</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-nano font-bold ${
                activeTab === "HISTORY" ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {processedPayouts.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search provider, bank account..."
            className="w-full h-7.5 pl-7.5 pr-2.5 text-micro rounded-md bg-card border border-slate-200/50 dark:border-slate-800/50 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Mobile View: High-Clarity Elevated Cards */}
      <div className="block sm:hidden space-y-3.5">
        {filteredPayouts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            No payouts found matching your filter criteria.
          </div>
        ) : (
          filteredPayouts.map((pay) => (
            <div
              key={pay.id}
              className="rounded-2xl bg-card border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:border-amber-500/30 transition-all p-4 space-y-3.5"
            >
              {/* Card Header: Reference, Provider Name & Status */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-extrabold text-sm shadow-xs border border-amber-500/20 mt-0.5">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-amber-600 dark:text-amber-400">
                        {pay.reference}
                      </span>
                    </div>
                    <Link
                      href={`/admin/providers/${pay.providerId}`}
                      className="font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block text-xs mt-0.5"
                    >
                      {pay.providerName}
                    </Link>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      Requested: {pay.requestedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {pay.status === "PENDING" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  ) : pay.status === "PROCESSED" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Disbursed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
                      <XCircle className="w-3 h-3" /> Declined
                    </span>
                  )}

                  <ActionDropdown
                    items={[
                      ...(pay.status === "PENDING"
                        ? [
                            {
                              label: "Disburse Settlement",
                              icon: <Check className="w-4 h-4" />,
                              variant: "success" as const,
                              onClick: () => handleApprove(pay.id),
                            },
                            {
                              label: "Decline Payout",
                              icon: <X className="w-4 h-4" />,
                              variant: "danger" as const,
                              onClick: () => handleReject(pay.id),
                            },
                          ]
                        : []),
                      {
                        label: "View Operator Organization",
                        icon: <Building2 className="w-4 h-4" />,
                        href: `/admin/providers/${pay.providerId}`,
                      },
                      {
                        label: "Audited Ledger Documents",
                        icon: <FileText className="w-4 h-4" />,
                        href: `/admin/reports`,
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Gateway & Account Strip */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/50 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Bank / Settlement Account
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-foreground bg-muted/60 px-2 py-0.5 rounded">
                    {pay.payoutMethod.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="font-mono text-muted-foreground">{pay.accountNumber}</span>
                  <span className="font-medium text-foreground truncate max-w-[170px]">{pay.accountName}</span>
                </div>
              </div>

              {/* 3-Column Financial Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-amber-500/[0.04] dark:bg-amber-500/[0.07] border border-amber-500/15 text-center">
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Gross Sales
                  </span>
                  <span className="text-xs font-black text-foreground font-mono mt-0.5 block truncate">
                    {pay.amount.toLocaleString()} <span className="text-[9px] text-muted-foreground font-normal">ETB</span>
                  </span>
                </div>
                <div className="border-x border-amber-500/15">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Fee Retained
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block truncate">
                    -{pay.fee.toLocaleString()} <span className="text-[9px] font-normal">ETB</span>
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Net Payout
                  </span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5 block truncate">
                    {pay.netAmount.toLocaleString()} <span className="text-[9px] font-normal">ETB</span>
                  </span>
                </div>
              </div>

              {/* Quick Action Buttons for Pending Payouts */}
              {pay.status === "PENDING" && (
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleApprove(pay.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Disburse Settlement</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(pay.id)}
                    className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-1 transition-colors border border-rose-200/60 dark:border-rose-900/50 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Payouts Table with Spacious Columns & Horizontal Scroll */}
      <div className="hidden sm:block rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[1020px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[140px]">Reference</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[180px]">Provider Organization</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[130px]">Gross / Fee</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[140px]">Net Disbursement</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[190px]">Payout Gateway & Account</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Date Requested</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">Status</th>
                <th className="px-4 py-3.5 text-right w-12 shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredPayouts.map((pay) => (
                <tr key={pay.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    {pay.reference}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-foreground whitespace-nowrap">{pay.providerName}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div>
                      <p className="text-foreground">{pay.amount.toLocaleString()} ETB</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        Fee: -{pay.fee.toLocaleString()} ETB
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-foreground text-sm whitespace-nowrap">
                    {pay.netAmount.toLocaleString()}{" "}
                    <span className="text-[10px] text-muted-foreground font-normal">ETB</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div>
                      <p className="font-semibold text-foreground flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                        <span>{pay.payoutMethod.replace(/_/g, " ")}</span>
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">{pay.accountNumber}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{pay.accountName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-muted-foreground">{pay.requestedAt}</td>
                  <td className="px-4 py-3.5">
                    {pay.status === "PENDING" ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    ) : pay.status === "PROCESSED" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3 h-3" /> Disbursed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                        <XCircle className="w-3 h-3" /> Declined
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <ActionDropdown
                      items={[
                        ...(pay.status === "PENDING"
                          ? [
                              {
                                label: "Disburse Settlement",
                                icon: <Check className="w-4 h-4" />,
                                variant: "success" as const,
                                onClick: () => handleApprove(pay.id),
                              },
                              {
                                label: "Decline Payout",
                                icon: <X className="w-4 h-4" />,
                                variant: "danger" as const,
                                onClick: () => handleReject(pay.id),
                              },
                            ]
                          : []),
                        {
                          label: "View Organization",
                          icon: <Building2 className="w-4 h-4" />,
                          href: `/admin/providers/${pay.providerId}`,
                        },
                        {
                          label: "Commission Settings",
                          icon: <Percent className="w-4 h-4" />,
                          href: `/admin/commissions`,
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}

              {filteredPayouts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    No payouts matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
