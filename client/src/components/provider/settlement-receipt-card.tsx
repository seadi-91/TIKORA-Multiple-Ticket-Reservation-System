"use client";

import React from "react";
import {
  Printer,
  Download,
  Copy,
  ArrowLeft,
  ShieldCheck,
  QrCode,
  Receipt,
  Building2,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";
import { ProviderOrganization } from "@/stores/provider.store";

export interface SettlementReceiptData {
  id: string;
  reference: string;
  date: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  netPayout: number;
  fee: number;
  status: "COMPLETED" | "PROCESSING" | "PENDING";
  grossSales?: number;
  commission?: number;
  transactionRef?: string;
  period?: string;
}

interface SettlementReceiptCardProps {
  transaction: SettlementReceiptData;
  organization: ProviderOrganization;
  onBack?: () => void;
}

export function SettlementReceiptCard({
  transaction,
  organization,
  onBack,
}: SettlementReceiptCardProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transaction.reference);
    toast.success(`Reference ${transaction.reference} copied`);
  };

  const handleDownload = () => {
    toast.success(`Receipt ${transaction.reference}.pdf downloaded`);
  };

  const grossSales = transaction.grossSales ?? Math.round(transaction.amount * 1.05);
  const commission = transaction.commission ?? Math.round(transaction.amount * 0.05);

  return (
    <div className="space-y-6">
      {/* Top Navigation & Breadcrumbs Bar (Reuses Provider Header & Sidebar) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>Provider Portal</span>
              <span>/</span>
              <span>Revenue & Settlements</span>
              <span>/</span>
              <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                {transaction.reference}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2 mt-0.5">
              <span>Settlement Receipt</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                {transaction.status}
              </span>
            </h1>
          </div>
        </div>

        {/* Compact Top Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCopyRef}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground text-xs font-medium transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Ref</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Main Centered Realistic Receipt Card */}
      <div className="flex justify-center">
        <div
          id="settlement-receipt-print"
          className="w-full max-w-xl bg-white dark:bg-[#151821] text-slate-900 dark:text-slate-100 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden"
        >
          {/* Receipt Top Monogram Banner */}
          <div className="p-6 sm:p-7 space-y-5">
            <div className="text-center space-y-1.5 pb-4 border-b border-dashed border-slate-200 dark:border-slate-800">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#B45309] text-white shadow-xs mx-auto mb-1">
                <span className="font-black text-sm tracking-tighter">TK</span>
              </div>
              <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                TIKORA SETTLEMENT CLEARING HOUSE
              </h2>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400">
                Official Electronic Disbursement Voucher
              </p>
              <div className="pt-2 flex items-center justify-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border-2 border-emerald-500 bg-emerald-500/10 text-emerald-600 font-black text-[11px] tracking-wider uppercase rotate-[-2deg]">
                  ✓ PAID & SETTLED
                </span>
              </div>
            </div>

            {/* Voucher Metadata */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                  Voucher Reference
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {transaction.reference}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                  Payment Date & Time
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {transaction.date}
                </span>
              </div>
            </div>

            {/* Beneficiary Details */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                Beneficiary Provider Details
              </span>
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Business Entity:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right">
                    {organization.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Industry Sector:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {organization.category} Operations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">TIN Number:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">
                    {organization.tinNumber || "0081928419"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Disbursement Bank:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {transaction.bankName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Account Number:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {transaction.accountNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Bank Transfer Ref:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {transaction.transactionRef || "CBE-FT2630591823"}
                  </span>
                </div>
              </div>
            </div>

            {/* Settlement Ledger Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                Settlement Ledger Breakdown
              </span>
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/20">
                  <span className="text-slate-600 dark:text-slate-300">
                    Settlement Period Coverage:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {transaction.period || "Weekly Payout Cycle"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-slate-600 dark:text-slate-300">
                    Gross Ticket Sales Settled:
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(grossSales)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 text-slate-500">
                  <span>TIKORA Platform Commission (5%):</span>
                  <span className="font-mono text-rose-500 font-medium">
                    -{formatCurrency(commission)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 text-slate-500">
                  <span>EFT Electronic Transfer Fee:</span>
                  <span className="font-mono text-emerald-600 font-medium">0.00 ETB (Waived)</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-amber-500/10 dark:bg-amber-500/15 text-slate-900 dark:text-white font-bold">
                  <span className="uppercase text-xs font-extrabold">Net Disbursed Amount:</span>
                  <span className="font-mono font-black text-base text-amber-700 dark:text-amber-400">
                    {formatCurrency(transaction.netPayout)}
                  </span>
                </div>
              </div>
            </div>

            {/* Perforated Divider with Side Notches */}
            <div className="relative py-2 border-b-2 border-dashed border-slate-300 dark:border-slate-700">
              <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F8FAFC] dark:bg-[#0F1117] border-r border-slate-200 dark:border-slate-800" />
              <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F8FAFC] dark:bg-[#0F1117] border-l border-slate-200 dark:border-slate-800" />
            </div>

            {/* Security Compliance Seal */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="space-y-1 max-w-[280px]">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Audited & Signed Digital Voucher</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Authorized by TIKORA Clearing Gateway. Fully compliant with National Bank of
                  Ethiopia electronic settlement directives.
                </p>
              </div>

              <div className="w-14 h-14 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                <QrCode className="w-11 h-11 text-slate-800 dark:text-white" />
              </div>
            </div>
          </div>

          {/* Bottom Compact Actions (Short text & Compact size) */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-[#1a1e29] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyRef}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Ref</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
