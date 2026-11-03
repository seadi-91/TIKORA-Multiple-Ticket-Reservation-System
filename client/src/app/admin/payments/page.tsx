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
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
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
        <div className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate">Gross GMV</span>
            <div className="p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-base sm:text-2xl font-bold text-foreground truncate">
            {stats.totalGMV.toLocaleString()} <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">ETB</span>
          </p>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1 truncate">Platform gross sales</p>
        </div>

        <div className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate">Net Revenue</span>
            <div className="p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-base sm:text-2xl font-bold text-foreground truncate">
            {stats.platformRevenue.toLocaleString()} <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">ETB</span>
          </p>
          <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 sm:mt-1 truncate">
            ~5.0% commission
          </p>
        </div>

        <div className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate">Pending Payouts</span>
            <div className="p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-base sm:text-2xl font-bold text-foreground truncate">
            {totalPendingAmount.toLocaleString()} <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">ETB</span>
          </p>
          <p className="text-[10px] sm:text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-0.5 sm:mt-1 truncate">
            {pendingPayouts.length} pending
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Settled to Providers</span>
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {(stats.totalGMV - stats.platformRevenue - totalPendingAmount).toLocaleString()}{" "}
            <span className="text-xs text-muted-foreground font-normal">ETB</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Disbursed via CBE & Telebirr</p>
        </div>
      </div>

      {/* Tabs: Pending Queue vs Processed History (Mobile-First Responsive) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 flex items-center gap-2 ${
              activeTab === "PENDING"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Pending Payouts Queue</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "PENDING" ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {pendingPayouts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 flex items-center gap-2 ${
              activeTab === "HISTORY"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Settlement History</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "HISTORY" ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {processedPayouts.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search provider or account..."
            className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
      </div>

      {/* Payouts Table (Elevated, Soft Borders, Modern SaaS Rows) */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Reference</th>
                <th className="px-4 py-3.5">Provider Organization</th>
                <th className="px-4 py-3.5">Gross / Fee</th>
                <th className="px-4 py-3.5">Net Disbursement</th>
                <th className="px-4 py-3.5">Payout Gateway & Account</th>
                <th className="px-4 py-3.5">Date Requested</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right w-14">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredPayouts.map((pay) => (
                <tr key={pay.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {pay.reference}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-foreground">{pay.providerName}</td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="text-foreground">{pay.amount.toLocaleString()} ETB</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        Fee: -{pay.fee.toLocaleString()} ETB
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-foreground text-sm">
                    {pay.netAmount.toLocaleString()}{" "}
                    <span className="text-[10px] text-muted-foreground font-normal">ETB</span>
                  </td>
                  <td className="px-4 py-3.5">
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
