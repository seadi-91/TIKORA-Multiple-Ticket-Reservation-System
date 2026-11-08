"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  DollarSign,
  Download,
  FileText,
  Landmark,
  TrendingUp,
  Wallet,
  X,
  Printer,
  ShieldCheck,
  Building2,
  Receipt,
  Ticket,
  User,
  Phone,
  Calendar,
  ExternalLink,
  Search,
} from "lucide-react";
import { useProviderStore, ProviderBookingRecord } from "@/stores/provider.store";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import {
  SettlementReceiptCard,
  SettlementReceiptData,
} from "@/components/provider/settlement-receipt-card";

export type PayoutTransaction = SettlementReceiptData;

export const INITIAL_TRANSACTIONS: PayoutTransaction[] = [];

export default function ProviderPaymentsPage() {
  const { organization, bookings: storeBookings, requestPayout } = useProviderStore();
  const [activeTab, setActiveTab] = useState<"TICKET_SALES" | "DISBURSEMENTS">("TICKET_SALES");
  const [transactions, setTransactions] = useState<PayoutTransaction[]>(INITIAL_TRANSACTIONS);
  const [ticketSales, setTicketSales] = useState<ProviderBookingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<PayoutTransaction | null>(null);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync ticket sales from store and local storage
  useEffect(() => {
    let sales = storeBookings && storeBookings.length > 0 ? storeBookings : [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tikora_provider_bookings");
        if (raw) {
          const parsed: ProviderBookingRecord[] = JSON.parse(raw);
          if (parsed && parsed.length > 0) {
            sales = parsed;
          }
        }
      } catch {}
    }
    setTicketSales(sales);
  }, [storeBookings]);

  // Compute live revenue numbers based ONLY on ticket base prices (excluding VAT)
  const totalBaseSales = ticketSales
    .filter((s) => s.paymentStatus === "PAID")
    .reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  const totalCommission = Math.round(totalBaseSales * 0.05);
  const netEarnings = totalBaseSales - totalCommission;

  const totalDisbursed = transactions
    .filter((t) => t.status === "COMPLETED")
    .reduce((sum, t) => sum + (t.netPayout || 0), 0);

  const availableBalance = Math.max(0, netEarnings - totalDisbursed);

  // Read URL query parameter for receipt on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const receiptId = params.get("receipt");
      if (receiptId) {
        const found = transactions.find((t) => t.id === receiptId || t.reference === receiptId);
        if (found) {
          setSelectedReceiptTx(found);
        }
      }
    }
  }, [transactions]);

  const handleOpenPayoutModal = () => {
    setPayoutAmount(Math.min(50000, availableBalance));
    setShowPayoutModal(true);
  };

  const handleViewReceipt = (tx: PayoutTransaction) => {
    setSelectedReceiptTx(tx);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `?receipt=${tx.id}`);
    }
  };

  const handleBackFromReceipt = () => {
    setSelectedReceiptTx(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/provider/payments");
    }
  };

  const handleConfirmPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0) {
      toast.error("Please enter a valid payout amount");
      return;
    }
    if (payoutAmount > availableBalance) {
      toast.error("Requested amount exceeds available balance");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      requestPayout(payoutAmount);

      const newTx: PayoutTransaction = {
        id: `tx-${Date.now()}`,
        reference: `POT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: "Just now",
        bankName: organization.payoutAccount.bankName,
        accountNumber: organization.payoutAccount.accountNumber,
        amount: payoutAmount,
        fee: 0,
        netPayout: payoutAmount,
        status: "PROCESSING",
        grossSales: Math.round(payoutAmount * 1.05),
        commission: Math.round(payoutAmount * 0.05),
        transactionRef: `FT26310${Math.floor(100000 + Math.random() * 900000)}`,
        period: "Current Settlement Cycle",
      };

      setTransactions([newTx, ...transactions]);
      setIsSubmitting(false);
      setShowPayoutModal(false);
      toast.success(
        `Payout request of ${formatCurrency(payoutAmount)} submitted successfully to ${
          organization.payoutAccount.bankName
        }.`
      );
    }, 600);
  };

  const handleExportStatement = () => {
    toast.success("Quarterly Payout Statement PDF downloaded.");
  };

  const filteredTicketSales = ticketSales.filter((sale) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      sale.reference.toLowerCase().includes(q) ||
      sale.customerName.toLowerCase().includes(q) ||
      sale.customerPhone.toLowerCase().includes(q) ||
      sale.serviceTitle.toLowerCase().includes(q)
    );
  });

  if (selectedReceiptTx) {
    return (
      <SettlementReceiptCard
        transaction={selectedReceiptTx}
        organization={organization}
        onBack={handleBackFromReceipt}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Header - Compact Styling */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
              {organization.category} Sector
            </span>
            <span className="text-xs text-muted-foreground">{organization.name}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Revenue &amp; Payout Settlements
          </h1>
          <p className="text-xs text-muted-foreground">
            View incoming ticket sales (VAT-excluded base fares), platform commissions, and bank disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportStatement}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Statement
          </button>
          <button
            type="button"
            onClick={handleOpenPayoutModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5" /> Request Bank Payout
          </button>
        </div>
      </div>

      {/* KPI Financial Cards - Compact Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Ticket Sales (Base Fare, No VAT) */}
        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate font-medium">Ticket Sales (No VAT)</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground truncate font-mono">
            {formatCurrency(totalBaseSales)}
          </div>
          <span className="text-[10px] text-muted-foreground truncate block">Base fare revenue</span>
        </div>

        {/* Platform Commission (5%) */}
        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate font-medium">Commission (5%)</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground truncate font-mono">
            {formatCurrency(totalCommission)}
          </div>
          <span className="text-[10px] text-muted-foreground truncate block">Platform service fee</span>
        </div>

        {/* Net Provider Earnings */}
        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate font-medium">Net Earnings</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-blue-600 truncate font-mono">
            {formatCurrency(netEarnings)}
          </div>
          <span className="text-[10px] text-muted-foreground truncate block">Pure provider payout</span>
        </div>

        {/* Available for Withdrawal */}
        <div className="bg-card border border-amber-600/30 bg-amber-500/5 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs mb-1 font-semibold">
            <span className="text-[10px] sm:text-xs truncate font-medium">Available Balance</span>
            <Wallet className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-amber-700 dark:text-amber-400 truncate font-mono">
            {formatCurrency(availableBalance)}
          </div>
          <span className="text-[10px] text-muted-foreground truncate block">Ready to withdraw</span>
        </div>
      </div>

      {/* Ethiopian VAT Tax Notice Banner */}
      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-foreground">Ethiopian VAT (5%) Separation Policy</span>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            The 5% Value Added Tax paid by customers is collected for the Ethiopian Ministry of Revenue and recorded
            in the platform Admin Ledger. Your provider earnings are computed strictly from the pure ticket base fare,
            deducting only the 5% platform service fee.
          </p>
        </div>
      </div>

      {/* Linked Bank Account Summary - Compact */}
      <div className="bg-card border border-border/60 rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-600/10 text-amber-700 dark:text-amber-300 flex items-center justify-center border border-amber-600/20 shrink-0">
            <Landmark className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-foreground">
                {organization.payoutAccount.bankName}
              </h3>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Verified Settlement Account
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Account: <span className="font-mono font-medium text-foreground">{organization.payoutAccount.accountNumber}</span> &bull; Holder: {organization.payoutAccount.accountHolder}
            </p>
          </div>
        </div>

        <Link
          href="/provider/organization"
          className="text-xs text-amber-600 hover:text-amber-700 font-semibold hover:underline"
        >
          Manage Payout Accounts &rarr;
        </Link>
      </div>

      {/* Tabs Switcher: Ticket Sales Revenue vs Disbursements */}
      <div className="flex border-b border-border/60 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("TICKET_SALES")}
          className={`pb-2.5 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === "TICKET_SALES"
              ? "border-amber-600 text-amber-600 dark:text-amber-400 font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Ticket Sales Revenue</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/10 text-amber-600">
            {ticketSales.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("DISBURSEMENTS")}
          className={`pb-2.5 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === "DISBURSEMENTS"
              ? "border-amber-600 text-amber-600 dark:text-amber-400 font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Disbursements &amp; Payouts</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-muted-foreground">
            {transactions.length}
          </span>
        </button>
      </div>

      {/* TAB 1: TICKET SALES REVENUE (BASE FARE WITHOUT VAT) */}
      {activeTab === "TICKET_SALES" && (
        <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden space-y-0">
          <div className="p-3.5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">Ticket Sales Payments</h3>
              <p className="text-[11px] text-muted-foreground">
                Showing pure ticket base prices (VAT excluded). 5% platform commission is deducted for net provider settlement.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reference, customer..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {filteredTicketSales.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
              <Ticket className="w-8 h-8 mx-auto text-muted-foreground/50" />
              <p className="font-semibold text-foreground">No ticket sales recorded yet.</p>
              <p className="text-[11px]">When customers book and pay via Chapa, their ticket payments will appear here.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border/60">
                      <th className="py-2.5 px-3.5">Reference / Pass</th>
                      <th className="py-2.5 px-3">Customer Info</th>
                      <th className="py-2.5 px-3">Service &amp; Seats</th>
                      <th className="py-2.5 px-3 text-right">Base Fare (No VAT)</th>
                      <th className="py-2.5 px-3 text-right">Commission (5%)</th>
                      <th className="py-2.5 px-3 text-right">Net Payout</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredTicketSales.map((sale) => {
                      const basePrice = sale.totalAmount || 0;
                      const comm = Math.round(basePrice * 0.05);
                      const net = basePrice - comm;

                      return (
                        <tr key={sale.id} className="hover:bg-amber-500/[0.02] transition-colors">
                          <td className="py-2.5 px-3.5">
                            <Link
                              href={`/provider/bookings/${encodeURIComponent(sale.id)}`}
                              className="font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline block"
                            >
                              {sale.reference}
                            </Link>
                            <span className="text-[10px] text-muted-foreground">
                              {sale.travelDate || "Scheduled"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-foreground block">{sale.customerName}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{sale.customerPhone}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium text-foreground block line-clamp-1">{sale.serviceTitle}</span>
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                              Seats: {sale.seats?.join(", ") || "General"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                            {formatCurrency(basePrice)}
                            <span className="text-[9px] text-muted-foreground block font-normal">VAT Excluded</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                            -{formatCurrency(comm)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                            {formatCurrency(net)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              {sale.paymentStatus || "PAID"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <div className="flex items-center justify-end">
                              <ActionDropdown
                                items={[
                                  {
                                    label: "View Booking & QR Pass",
                                    icon: <FileText className="w-3.5 h-3.5" />,
                                    onClick: () => {
                                      window.location.href = `/provider/bookings/${encodeURIComponent(sale.id)}`;
                                    },
                                  },
                                  {
                                    label: "Copy Reference Code",
                                    icon: <Copy className="w-3.5 h-3.5" />,
                                    onClick: () => {
                                      navigator.clipboard.writeText(sale.reference);
                                      toast.success("Reference code copied");
                                    },
                                  },
                                ]}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Compact Cards */}
              <div className="block md:hidden p-2.5 space-y-2">
                {filteredTicketSales.map((sale) => {
                  const basePrice = sale.totalAmount || 0;
                  const comm = Math.round(basePrice * 0.05);
                  const net = basePrice - comm;

                  return (
                    <div
                      key={sale.id}
                      className="p-3 rounded-xl bg-muted/20 border border-border/50 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/provider/bookings/${encodeURIComponent(sale.id)}`}
                          className="font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline"
                        >
                          {sale.reference}
                        </Link>
                        <span className="inline-flex items-center px-2 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600">
                          {sale.paymentStatus || "PAID"}
                        </span>
                      </div>

                      <div>
                        <span className="font-semibold text-foreground block">{sale.serviceTitle}</span>
                        <span className="text-[11px] text-muted-foreground">{sale.customerName} &bull; {sale.customerPhone}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-border/40 font-mono">
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Base Ticket Price:</span>
                          <span className="font-bold text-foreground">{formatCurrency(basePrice)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground block">Net Payout (5% comm):</span>
                          <span className="font-bold text-emerald-600">{formatCurrency(net)}</span>
                        </div>
                      </div>

                      <Link
                        href={`/provider/bookings/${encodeURIComponent(sale.id)}`}
                        className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>View Pass &amp; Details</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: DISBURSEMENTS & BANK TRANSFERS */}
      {activeTab === "DISBURSEMENTS" && (
        <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">Bank Payout History</h3>
              <p className="text-[11px] text-muted-foreground">
                Official electronic disbursement vouchers for {organization.name}.
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2.5 py-0.5 rounded-lg font-mono">
              {transactions.length} Disbursements
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
              <Receipt className="w-8 h-8 mx-auto text-muted-foreground/50" />
              <p className="font-semibold text-foreground">No bank disbursements requested yet.</p>
              <p className="text-[11px]">When you request a payout from your available balance, the records will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border/60">
                    <th className="py-2.5 px-3.5">Payout Reference</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Settlement Bank</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Fee</th>
                    <th className="py-2.5 px-3 text-right">Net Transferred</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-amber-500/[0.02] transition-colors">
                      <td className="py-2.5 px-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                        <button
                          type="button"
                          onClick={() => handleViewReceipt(tx)}
                          className="hover:underline cursor-pointer"
                        >
                          {tx.reference}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground font-mono">{tx.date}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-foreground block">{tx.bankName}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          Acct: {tx.accountNumber}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-foreground">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                        0 ETB
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                        {formatCurrency(tx.netPayout)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                            tx.status === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              tx.status === "COMPLETED" ? "bg-emerald-600" : "bg-amber-500"
                            }`}
                          />
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-right">
                        <div className="flex items-center justify-end">
                          <ActionDropdown
                            items={[
                              {
                                label: "View Settlement Receipt",
                                icon: <FileText className="w-3.5 h-3.5" />,
                                onClick: () => handleViewReceipt(tx),
                              },
                              {
                                label: "Copy Reference Code",
                                icon: <Copy className="w-3.5 h-3.5" />,
                                onClick: () => {
                                  navigator.clipboard.writeText(tx.reference);
                                  toast.success("Reference copied to clipboard");
                                },
                              },
                              {
                                label: "Print Voucher",
                                icon: <Printer className="w-3.5 h-3.5" />,
                                onClick: () => handleViewReceipt(tx),
                              },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Payout Request Modal - Compact */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl shadow-xl max-w-md w-full p-4.5 space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground">Request Bank Payout</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Transfer funds to your corporate bank account
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-amber-500/10 border border-amber-600/30 rounded-xl p-2.5 text-xs space-y-0.5">
              <span className="text-amber-700 dark:text-amber-300 font-semibold block text-[11px]">
                Available Withdrawable Balance:
              </span>
              <span className="text-sm sm:text-base font-bold text-foreground font-mono">
                {formatCurrency(availableBalance)}
              </span>
            </div>

            <form onSubmit={handleConfirmPayout} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Payout Amount (ETB)
                </label>
                <input
                  type="number"
                  min="100"
                  max={availableBalance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-border/70 bg-background text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="bg-muted/30 rounded-xl p-2.5 text-xs space-y-1.5 border border-border/50">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Beneficiary Account
                </span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Bank:</span>
                  <span className="font-medium text-foreground">
                    {organization.payoutAccount.bankName}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Account Number:</span>
                  <span className="font-mono text-foreground">
                    {organization.payoutAccount.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Account Holder:</span>
                  <span className="font-medium text-foreground">
                    {organization.payoutAccount.accountHolder}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl border border-border/70 hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || payoutAmount <= 0 || payoutAmount > availableBalance}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? "Processing..." : `Transfer ${formatCurrency(payoutAmount)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
