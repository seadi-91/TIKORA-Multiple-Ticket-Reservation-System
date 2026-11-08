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
  Ticket,
  User,
  ShieldCheck,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { formatCurrency } from "@/lib/format-currency";

export default function AdminPaymentsPage() {
  const { payouts, processPayout, stats, bookings } = useAdminStore();

  const [activeTab, setActiveTab] = useState<"TICKET_PAYMENTS" | "PENDING" | "HISTORY">("TICKET_PAYMENTS");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayout, setSelectedPayout] = useState<string | null>(null);
  const [payoutNotes, setPayoutNotes] = useState("");

  const pendingPayouts = payouts.filter((p) => p.status === "PENDING");
  const processedPayouts = payouts.filter((p) => p.status !== "PENDING");

  const filteredTicketPayments = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.reference.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.providerName.toLowerCase().includes(q) ||
      b.serviceTitle.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  });

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
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Financial Ledger &amp; Customer Settlements
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit Gross Merchandise Value (GMV with full VAT), customer payment settlements, and provider disbursements.
          </p>
        </div>

        <Link
          href="/admin/commissions"
          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 hover:bg-muted text-foreground transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          <Percent className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Commission Rules</span>
        </Link>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="p-3 sm:p-3.5 rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider truncate">Gross GMV (w/ VAT)</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-bold text-foreground truncate">
            {stats.totalGMV.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">ETB</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Customer total payments</p>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider truncate">Platform Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-bold text-foreground truncate">
            {stats.platformRevenue.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">ETB</span>
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 truncate">
            5.0% provider commission
          </p>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider truncate">Pending Payouts</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-bold text-foreground truncate">
            {totalPendingAmount.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">ETB</span>
          </p>
          <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium mt-0.5 truncate">
            {pendingPayouts.length} queue requests
          </p>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider truncate">Customer Payments</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-bold text-foreground truncate">
            {bookings.length} <span className="text-[10px] text-muted-foreground font-normal">Transactions</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Settled via Chapa &amp; Banks</p>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("TICKET_PAYMENTS")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "TICKET_PAYMENTS"
                ? "bg-amber-600 text-white shadow-2xs"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Customer Ticket Payments (የትኬት ገቢ ክፍያዎች)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "TICKET_PAYMENTS" ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("PENDING")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "PENDING"
                ? "bg-amber-600 text-white shadow-2xs"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Pending Payouts Queue</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "PENDING" ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {pendingPayouts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "HISTORY"
                ? "bg-amber-600 text-white shadow-2xs"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Settlement History</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "HISTORY" ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {processedPayouts.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference, customer, provider..."
            className="w-full h-8 pl-8 pr-2.5 text-xs rounded-lg bg-card border border-slate-200/60 dark:border-slate-800/60 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* 1. View: Customer Ticket Payments (FULL AMOUNT WITH VAT) */}
      {activeTab === "TICKET_PAYMENTS" && (
        <div className="rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-border/40 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground">Customer Payments Ledger</h3>
              <p className="text-[11px] text-muted-foreground">
                Displaying full customer paid amount (Base fare + 5% VAT) settled via Chapa.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Full Gross Amount (Mulu Yegenzeb Meten)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border/40">
                <tr>
                  <th className="py-2.5 px-4">Tx Reference</th>
                  <th className="py-2.5 px-4">Customer Details</th>
                  <th className="py-2.5 px-4">Provider / Organizer</th>
                  <th className="py-2.5 px-4">Ticket / Service</th>
                  <th className="py-2.5 px-4 text-right">Total Paid (w/ 5% VAT)</th>
                  <th className="py-2.5 px-4 text-center">Gateway</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredTicketPayments.map((b) => {
                  const baseFare = Math.round(b.totalAmount / 1.05);
                  const vatAmount = b.totalAmount - baseFare;
                  return (
                    <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {b.reference}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-foreground block">{b.customerName}</span>
                        <span className="text-[10px] text-muted-foreground">{b.customerEmail}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-foreground">{b.providerName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-foreground block line-clamp-1">{b.serviceTitle}</span>
                        <span className="text-[10px] text-amber-600">{b.category} &bull; {b.quantity || 1} Tickets</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block text-xs">
                          {b.totalAmount.toLocaleString()} ETB
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          Base: {baseFare.toLocaleString()} + VAT: {vatAmount.toLocaleString()} ETB
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 font-mono">
                          {b.paymentMethod || "CHAPA"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> PAID
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[10px] text-muted-foreground">
                        {b.bookingDate}
                      </td>
                    </tr>
                  );
                })}

                {filteredTicketPayments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-muted-foreground text-xs">
                      No customer ticket payments recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. View: Provider Payouts (PENDING / HISTORY) */}
      {activeTab !== "TICKET_PAYMENTS" && (
        <div className="rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[980px]">
              <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Provider Organization</th>
                  <th className="px-4 py-3">Gross / Fee</th>
                  <th className="px-4 py-3">Net Disbursement</th>
                  <th className="px-4 py-3">Settlement Account</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredPayouts.map((pay) => (
                  <tr key={pay.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {pay.reference}
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">{pay.providerName}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-foreground">{pay.amount.toLocaleString()} ETB</p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          Fee: -{pay.fee.toLocaleString()} ETB
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-foreground font-mono">
                      {pay.netAmount.toLocaleString()} ETB
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{pay.payoutMethod.replace(/_/g, " ")}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{pay.accountNumber}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground text-[11px]">{pay.requestedAt}</td>
                    <td className="px-4 py-3">
                      {pay.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      ) : pay.status === "PROCESSED" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Disbursed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                          <XCircle className="w-3 h-3" /> Declined
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {pay.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApprove(pay.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(pay.id)}
                            className="px-2 py-1 rounded bg-rose-50 text-rose-600 dark:bg-rose-950/40 text-[10px] font-bold cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-mono">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredPayouts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground text-xs">
                      No payouts matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
