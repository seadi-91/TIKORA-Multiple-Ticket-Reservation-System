"use client";

import React, { useState, useEffect } from "react";
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
  RefreshCw,
  Eye,
  Trash2,
  Send,
  MoreVertical,
  AlertTriangle,
  Loader2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminStore, AdminPayout } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { formatCurrency } from "@/lib/format-currency";

export default function AdminPaymentsPage() {
  const { payouts, processPayout, deletePayout, stats, bookings, fetchPlatformData, isLoading, settings } = useAdminStore();

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  const [activeTab, setActiveTab] = useState<"TICKET_PAYMENTS" | "PENDING" | "HISTORY">("TICKET_PAYMENTS");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals for Payouts
  const [detailPayout, setDetailPayout] = useState<AdminPayout | null>(null);
  const [transferPayout, setTransferPayout] = useState<AdminPayout | null>(null);
  const [deletePayoutTarget, setDeletePayoutTarget] = useState<AdminPayout | null>(null);
  const [transferNotes, setTransferNotes] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  // Modal for Customer Payment Detail
  const [detailBooking, setDetailBooking] = useState<any | null>(null);

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

  const handleExecuteTransfer = () => {
    if (!transferPayout) return;
    setIsTransferring(true);
    try {
      processPayout(
        transferPayout.id,
        true,
        transferNotes || "Disbursed via automated bank gateway batch settlement"
      );
      toast.success(`Transfer executed for ${transferPayout.providerName}: ${transferPayout.netAmount.toLocaleString()} ETB`);
      setTransferPayout(null);
      setTransferNotes("");
    } catch (err: any) {
      toast.error("Failed to execute transfer: " + (err.message || "Unknown error"));
    } finally {
      setIsTransferring(false);
    }
  };

  const handleConfirmDeletePayout = () => {
    if (!deletePayoutTarget) return;
    deletePayout(deletePayoutTarget.id);
    toast.success(`Payout record ${deletePayoutTarget.reference} removed.`);
    setDeletePayoutTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Financial Ledger & Customer Settlements
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit Gross Merchandise Value (GMV with full VAT), customer payment settlements, and provider disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={async () => {
              await fetchPlatformData();
              toast.success("Synchronized ledger with PostgreSQL database.");
            }}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 hover:bg-muted text-foreground transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-600" : "text-amber-600 dark:text-amber-400"}`} />
            <span>{isLoading ? "Syncing..." : "Sync DB"}</span>
          </button>
          <Link
            href="/admin/commissions"
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 hover:bg-muted text-foreground transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Percent className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Commission Rules</span>
          </Link>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xs">
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

        <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xs">
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
            {settings.defaultCommissionRate ?? 5.0}% provider commission
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xs">
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

        <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider truncate">Customer Payments</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-bold text-foreground truncate">
            {bookings.length} <span className="text-[10px] text-muted-foreground font-normal">Transactions</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Settled via Chapa & Banks</p>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("TICKET_PAYMENTS")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "TICKET_PAYMENTS"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Customer Ticket Payments</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "TICKET_PAYMENTS" ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {bookings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("PENDING")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "PENDING"
                ? "bg-amber-600 text-white shadow-xs"
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
            type="button"
            onClick={() => setActiveTab("HISTORY")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "HISTORY"
                ? "bg-amber-600 text-white shadow-xs"
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
            className="w-full h-9 pl-8 pr-2.5 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* 1. View: Customer Ticket Payments & Balances (Spacious Relaxed Grid) */}
      {activeTab === "TICKET_PAYMENTS" && (
        <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border/40 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground">Customer Payments & Balances Ledger</h3>
              <p className="text-[11px] text-muted-foreground">
                Displaying full customer paid amount (Base fare + Statutory VAT) settled via payment gateways.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              Full Gross Settlement (ETB)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[1250px]">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border/40">
                <tr>
                  <th className="py-3.5 px-5 min-w-[170px]">Tx Reference</th>
                  <th className="py-3.5 px-5 min-w-[210px]">Customer Details</th>
                  <th className="py-3.5 px-5 min-w-[200px]">Provider / Organizer</th>
                  <th className="py-3.5 px-5 min-w-[220px]">Ticket / Service</th>
                  <th className="py-3.5 px-5 min-w-[180px] text-right">Total Paid (Inc. VAT)</th>
                  <th className="py-3.5 px-5 min-w-[120px] text-center">Gateway</th>
                  <th className="py-3.5 px-5 min-w-[130px] text-center">Status</th>
                  <th className="py-3.5 px-5 min-w-[130px] text-right">Date</th>
                  <th className="py-3.5 px-5 text-right w-12">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredTicketPayments.map((b) => {
                  const bPaid = b.customerPaid ?? b.totalAmount;
                  const bVatRate = b.vatRate ?? settings.vatTaxRate ?? 5;
                  const bVatAmount = b.vatAmount ?? Math.round((bPaid * bVatRate) / (100 + bVatRate));
                  const baseFare = Math.max(0, bPaid - bVatAmount);
                  return (
                    <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {b.reference}
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-semibold text-foreground block">{b.customerName}</span>
                        <span className="text-[10px] text-muted-foreground">{b.customerEmail}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-medium text-foreground">{b.providerName}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-semibold text-foreground block line-clamp-1">{b.serviceTitle}</span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400">{b.category} &bull; {b.quantity || 1} Passes</span>
                      </td>
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block text-xs">
                          {bPaid.toLocaleString()} ETB
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          Base: {baseFare.toLocaleString()} + VAT ({bVatRate}%): {bVatAmount.toLocaleString()} ETB
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center font-medium whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 font-mono">
                          {b.paymentMethod || "CHAPA"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> PAID
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {b.bookingDate}
                      </td>
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <ActionDropdown
                          items={[
                            {
                              label: "View Payment Dossier",
                              icon: <Eye className="w-3.5 h-3.5" />,
                              onClick: () => setDetailBooking(b),
                            },
                            {
                              label: "Copy Reference",
                              icon: <Copy className="w-3.5 h-3.5" />,
                              onClick: () => {
                                navigator.clipboard.writeText(b.reference);
                                toast.success("Reference copied");
                              },
                            },
                            {
                              label: "View Operator",
                              icon: <Building2 className="w-3.5 h-3.5" />,
                              href: `/admin/providers?q=${encodeURIComponent(b.providerName)}`,
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}

                {filteredTicketPayments.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-muted-foreground text-xs">
                      No customer ticket payments recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. View: Provider Payouts & Balances (Spacious Columns with 3-Dots Actions) */}
      {activeTab !== "TICKET_PAYMENTS" && (
        <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border/40 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground">
                {activeTab === "PENDING" ? "Pending Provider Payouts Queue" : "Disbursement & Payout Settlement History"}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Spacious ledger breakdown of provider balances, commission deductions, and bank transfer authorizations.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
              {filteredPayouts.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[1300px]">
              <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border/40">
                <tr>
                  <th className="px-5 py-3.5 min-w-[170px]">Reference</th>
                  <th className="px-5 py-3.5 min-w-[220px]">Provider Organization</th>
                  <th className="px-5 py-3.5 min-w-[180px]">Gross / Commission Fee</th>
                  <th className="px-5 py-3.5 min-w-[180px]">Net Disbursement</th>
                  <th className="px-5 py-3.5 min-w-[230px]">Settlement Account & Bank</th>
                  <th className="px-5 py-3.5 min-w-[150px]">Requested Date</th>
                  <th className="px-5 py-3.5 min-w-[140px]">Status</th>
                  <th className="px-5 py-3.5 text-right min-w-[90px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredPayouts.map((pay) => (
                  <tr key={pay.id} className="hover:bg-muted/20 transition-colors">
                    {/* Reference */}
                    <td className="px-5 py-4 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      {pay.reference}
                    </td>

                    {/* Provider Organization */}
                    <td className="px-5 py-4 min-w-[220px]">
                      <p className="font-bold text-foreground">{pay.providerName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">ID: {pay.providerId}</p>
                    </td>

                    {/* Gross & Platform Fee */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-foreground font-bold">{pay.amount.toLocaleString()} ETB</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Platform Fee: -{pay.fee.toLocaleString()} ETB
                      </p>
                    </td>

                    {/* Net Disbursement */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-bold text-sm text-foreground font-mono text-emerald-600 dark:text-emerald-400 block">
                        {pay.netAmount.toLocaleString()} ETB
                      </span>
                      <span className="text-[10px] text-muted-foreground">Authorized Net</span>
                    </td>

                    {/* Settlement Account */}
                    <td className="px-5 py-4 min-w-[230px]">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{pay.payoutMethod.replace(/_/g, " ")}</span>
                      </div>
                      <p className="text-[11px] font-mono font-semibold text-muted-foreground mt-0.5">
                        Acc: {pay.accountNumber}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">{pay.accountName}</p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                      <p>{pay.requestedAt}</p>
                      {pay.processedAt && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                          Paid: {pay.processedAt}
                        </p>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {pay.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      ) : pay.status === "PROCESSED" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Disbursed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                          <XCircle className="w-3 h-3" /> Declined
                        </span>
                      )}
                    </td>

                    {/* Actions Column with 3 Dots: Transfer, View Detail, Delete */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <ActionDropdown
                        items={[
                          {
                            label: "Transfer",
                            icon: <ArrowUpRight className="w-3.5 h-3.5" />,
                            onClick: () => {
                              if (pay.status === "PROCESSED") {
                                toast.info(`Transfer already completed for reference ${pay.reference}.`);
                                return;
                              }
                              setTransferPayout(pay);
                              setTransferNotes("");
                            },
                          },
                          {
                            label: "View Detail",
                            icon: <Eye className="w-3.5 h-3.5" />,
                            onClick: () => setDetailPayout(pay),
                          },
                          {
                            label: "Delete",
                            icon: <Trash2 className="w-3.5 h-3.5" />,
                            variant: "danger",
                            onClick: () => setDeletePayoutTarget(pay),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}

                {filteredPayouts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground text-xs">
                      No payout records matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Transfer Payout Execution Modal */}
      {transferPayout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-5 h-5" />
                <h3 className="font-bold text-sm text-foreground">Authorize Bank Transfer</h3>
              </div>
              <button
                type="button"
                onClick={() => setTransferPayout(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/[0.04] dark:bg-amber-500/[0.07] border border-amber-500/20 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient Provider</span>
                <span className="font-bold text-foreground">{transferPayout.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank Gateway</span>
                <span className="font-bold text-foreground">{transferPayout.payoutMethod.replace(/_/g, " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number</span>
                <span className="font-mono font-bold text-foreground">{transferPayout.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Holder Name</span>
                <span className="font-bold text-foreground">{transferPayout.accountName}</span>
              </div>
              <div className="border-t border-amber-500/20 pt-2 flex justify-between items-center">
                <span className="font-bold text-foreground">Net Transfer Amount</span>
                <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400">
                  {transferPayout.netAmount.toLocaleString()} ETB
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-foreground block">
                Transfer Audit Notes & Bank Transaction Ref
              </label>
              <textarea
                rows={2}
                value={transferNotes}
                onChange={(e) => setTransferNotes(e.target.value)}
                placeholder="e.g. Disbursed via Commercial Bank of Ethiopia batch #TXN-99821."
                className="w-full p-2.5 text-xs rounded-xl bg-muted/40 border border-slate-200 dark:border-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTransferPayout(null)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteTransfer}
                disabled={isTransferring}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isTransferring ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Execute Transfer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: View Detail Payout Modal */}
      {detailPayout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-foreground">Payout & Balance Dossier</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailPayout(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">
                    Settlement Reference
                  </span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                    {detailPayout.reference}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  detailPayout.status === "PROCESSED"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : detailPayout.status === "PENDING"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}>
                  {detailPayout.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-muted/30">
                  <span className="text-[10px] text-muted-foreground block">Provider Organization</span>
                  <p className="font-bold text-foreground mt-0.5">{detailPayout.providerName}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Org ID: {detailPayout.providerId}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30">
                  <span className="text-[10px] text-muted-foreground block">Bank / Payment Gateway</span>
                  <p className="font-bold text-foreground mt-0.5">{detailPayout.payoutMethod.replace(/_/g, " ")}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{detailPayout.accountNumber}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/[0.04] dark:bg-amber-500/[0.06] border border-amber-500/15 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Booking Revenue</span>
                  <span className="font-mono font-bold text-foreground">{detailPayout.amount.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Commission Fee (5%)</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    -{detailPayout.fee.toLocaleString()} ETB
                  </span>
                </div>
                <div className="border-t border-amber-500/20 pt-1.5 flex justify-between items-center">
                  <span className="font-bold text-foreground">Net Disbursed Payout</span>
                  <span className="font-mono font-black text-sm text-foreground">
                    {detailPayout.netAmount.toLocaleString()} ETB
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-2.5 rounded-xl bg-muted/30">
                  <span className="text-[10px] text-muted-foreground block">Requested Timestamp</span>
                  <span className="font-mono text-foreground font-semibold">{detailPayout.requestedAt}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/30">
                  <span className="text-[10px] text-muted-foreground block">Processed Timestamp</span>
                  <span className="font-mono text-foreground font-semibold">
                    {detailPayout.processedAt || "Pending Execution"}
                  </span>
                </div>
              </div>

              {detailPayout.notes && (
                <div className="p-3 rounded-xl bg-muted/30 text-[11px] space-y-0.5">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                    Administrator Audit Notes
                  </span>
                  <p className="text-foreground leading-relaxed">{detailPayout.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => setDetailPayout(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Delete Payout Confirmation Modal */}
      {deletePayoutTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
                <Trash2 className="w-5 h-5" />
                <h3 className="font-bold text-sm text-foreground">Confirm Payout Deletion</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeletePayoutTarget(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete payout record{" "}
              <strong className="text-foreground">{deletePayoutTarget.reference}</strong> for{" "}
              <strong className="text-foreground">{deletePayoutTarget.providerName}</strong> (ETB{" "}
              {deletePayoutTarget.netAmount.toLocaleString()})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletePayoutTarget(null)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePayout}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs cursor-pointer"
              >
                Delete Payout Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Customer Payment Dossier Modal */}
      {detailBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-foreground">Customer Payment Dossier</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailBooking(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-muted/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">
                    Transaction Reference
                  </span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                    {detailBooking.reference}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  PAID & SETTLED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-muted/30">
                  <span className="text-[10px] text-muted-foreground block">Customer Name</span>
                  <p className="font-bold text-foreground mt-0.5">{detailBooking.customerName}</p>
                  <p className="text-[10px] text-muted-foreground">{detailBooking.customerEmail}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30">
                  <span className="text-[10px] text-muted-foreground block">Provider / Operator</span>
                  <p className="font-bold text-foreground mt-0.5">{detailBooking.providerName}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{detailBooking.category}</p>
                </div>
              </div>

              {(() => {
                const bPaid = detailBooking.customerPaid ?? detailBooking.totalAmount;
                const bVatRate = detailBooking.vatRate ?? settings.vatTaxRate ?? 5;
                const bVatAmount = detailBooking.vatAmount ?? Math.round((bPaid * bVatRate) / (100 + bVatRate));
                const bBase = Math.max(0, bPaid - bVatAmount);
                const bCommRate = detailBooking.commissionRate ?? settings.defaultCommissionRate ?? 5;
                const bFee = detailBooking.platformFee ?? Math.round(bBase * (bCommRate / 100));
                const bNet = detailBooking.providerNet ?? Math.max(0, bBase - bFee);
                return (
                  <div className="p-3.5 rounded-2xl bg-amber-500/[0.04] dark:bg-amber-500/[0.06] border border-amber-500/15 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pre-Tax Base Fare</span>
                      <span className="font-mono font-bold text-foreground">
                        {bBase.toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Statutory VAT ({bVatRate}%)</span>
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                        -{bVatAmount.toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="border-t border-amber-500/20 pt-1.5 flex justify-between items-center">
                      <span className="font-bold text-foreground">Total Customer Paid</span>
                      <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                        {bPaid.toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-muted-foreground">Platform Commission ({bCommRate}%)</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        -{bFee.toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-border/40">
                      <span className="font-bold text-muted-foreground">Provider Net Settlement</span>
                      <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400">
                        {bNet.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-2.5 rounded-xl bg-muted/30">
                  <span className="text-[10px] text-muted-foreground block">Payment Gateway</span>
                  <span className="font-mono text-foreground font-semibold">
                    {detailBooking.paymentMethod || "CHAPA"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/30">
                  <span className="text-[10px] text-muted-foreground block">Settlement Date</span>
                  <span className="font-mono text-foreground font-semibold">{detailBooking.bookingDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => setDetailBooking(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
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
