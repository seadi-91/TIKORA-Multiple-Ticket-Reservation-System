"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";

interface PayoutTransaction {
  id: string;
  reference: string;
  date: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  netPayout: number;
  fee: number;
  status: "COMPLETED" | "PROCESSING" | "PENDING";
}

const INITIAL_TRANSACTIONS: PayoutTransaction[] = [
  {
    id: "tx-1",
    reference: "POT-2026-1102",
    date: "2026-11-01 16:30",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    accountNumber: "1000189429184",
    amount: 150000,
    fee: 0,
    netPayout: 150000,
    status: "COMPLETED",
  },
  {
    id: "tx-2",
    reference: "POT-2026-1025",
    date: "2026-10-25 11:15",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    accountNumber: "1000189429184",
    amount: 182600,
    fee: 0,
    netPayout: 182600,
    status: "COMPLETED",
  },
  {
    id: "tx-3",
    reference: "POT-2026-1018",
    date: "2026-10-18 09:40",
    bankName: "Commercial Bank of Ethiopia (CBE)",
    accountNumber: "1000189429184",
    amount: 124500,
    fee: 0,
    netPayout: 124500,
    status: "COMPLETED",
  },
];

export default function ProviderPaymentsPage() {
  const { organization, requestPayout } = useProviderStore();
  const [transactions, setTransactions] = useState<PayoutTransaction[]>(INITIAL_TRANSACTIONS);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(50000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableBalance = organization.stats.availableBalance;

  const handleOpenPayoutModal = () => {
    setPayoutAmount(Math.min(50000, availableBalance));
    setShowPayoutModal(true);
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Revenue & Payout Settlements
          </h1>
          <p className="text-xs text-muted-foreground">
            Financial ledger, platform commissions, settlement history, and direct bank transfers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportStatement}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download Tax Statement
          </button>
          <button
            type="button"
            onClick={handleOpenPayoutModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
          >
            <Wallet className="w-3.5 h-3.5" /> Request Bank Payout
          </button>
        </div>
      </div>

      {/* KPI Financial Cards - Multiple Column Display (4 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Gross Sales */}
        <div className="bg-card border border-border/60 rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate">Gross Sales</span>
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-base sm:text-xl font-bold text-foreground truncate">
            {formatCurrency(organization.stats.grossSales)}
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate block">Captured revenue</span>
        </div>

        {/* Commission */}
        <div className="bg-card border border-border/60 rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate">Commission (5%)</span>
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
          </div>
          <div className="text-base sm:text-xl font-bold text-foreground truncate">
            {formatCurrency(organization.stats.platformCommission)}
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate block">Platform service fee</span>
        </div>

        {/* Net Payout to Date */}
        <div className="bg-card border border-border/60 rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate">Total Settled</span>
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
          </div>
          <div className="text-base sm:text-xl font-bold text-blue-600 truncate">
            {formatCurrency(organization.stats.netPayout)}
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate block">Transferred to bank</span>
        </div>

        {/* Available for Withdrawal */}
        <div className="bg-card border border-amber-600/30 bg-amber-500/5 rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs mb-1 font-semibold">
            <span className="text-[10px] sm:text-xs truncate">Available Balance</span>
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
          </div>
          <div className="text-base sm:text-xl font-bold text-amber-700 dark:text-amber-400 truncate">
            {formatCurrency(availableBalance)}
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate block">Ready for settlement</span>
        </div>
      </div>

      {/* Linked Bank Account Summary */}
      <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-700 dark:text-amber-300 flex items-center justify-center border border-amber-600/20">
              <Landmark className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  {organization.payoutAccount.bankName}
                </h3>
                <span className="inline-flex items-center px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Verified Payout Beneficiary
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Account Number:{" "}
                <span className="font-mono font-medium text-foreground">
                  {organization.payoutAccount.accountNumber}
                </span>{" "}
                • Holder: {organization.payoutAccount.accountHolder}
              </p>
            </div>
          </div>

          <Link
            href="/provider/organization"
            className="text-xs text-amber-600 font-semibold hover:underline"
          >
            Manage Payout Accounts →
          </Link>
        </div>
      </div>

      {/* Settlement Transactions Table */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/40 dark:border-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-foreground">Payout & Settlement History</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Official record of electronic funds transfers to your designated bank.
            </p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl self-start sm:self-auto">
            {transactions.length} Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-4">Payout Reference</th>
                <th className="py-3.5 px-4">Date & Timestamp</th>
                <th className="py-3.5 px-4">Settlement Bank</th>
                <th className="py-3.5 px-4 text-right">Requested</th>
                <th className="py-3.5 px-4 text-right">Transfer Fee</th>
                <th className="py-3.5 px-4 text-right">Net Transferred</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {tx.reference}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground font-mono">{tx.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-foreground block">{tx.bankName}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Acct: {tx.accountNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-foreground">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-muted-foreground">
                    0 ETB
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                    {formatCurrency(tx.netPayout)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${
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
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end">
                      <ActionDropdown
                        items={[
                          {
                            label: "View Settlement Receipt",
                            icon: <FileText className="w-3.5 h-3.5" />,
                            onClick: () =>
                              toast.success(`Generated receipt slip for ${tx.reference}`),
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
                            label: "Download Invoice PDF",
                            icon: <Download className="w-3.5 h-3.5" />,
                            onClick: () =>
                              toast.success(`Downloading payout receipt ${tx.reference}.pdf`),
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
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Request Bank Payout</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Transfer funds to your corporate bank account
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-amber-500/10 border border-amber-600/30 rounded-lg p-3 text-xs space-y-1">
              <span className="text-amber-700 dark:text-amber-300 font-semibold block">
                Available Withdrawable Balance:
              </span>
              <span className="text-lg font-bold text-foreground font-mono">
                {formatCurrency(availableBalance)}
              </span>
            </div>

            <form onSubmit={handleConfirmPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Payout Amount (ETB)
                </label>
                <input
                  type="number"
                  min="100"
                  max={availableBalance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground font-mono"
                />
              </div>

              <div className="bg-muted/30 rounded-lg p-3 text-xs space-y-2 border border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Beneficiary Account
                </span>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank:</span>
                  <span className="font-medium text-foreground">
                    {organization.payoutAccount.bankName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Number:</span>
                  <span className="font-mono text-foreground">
                    {organization.payoutAccount.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
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
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-border/70 hover:bg-muted text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || payoutAmount <= 0 || payoutAmount > availableBalance}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors disabled:opacity-60"
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
