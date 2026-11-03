"use client";

import React from "react";
import { CreditCard, Download, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PaymentStatusBadge } from "@/components/payment/payment-status";
import { EmptyState } from "@/components/feedback/empty-state";
import { useBookingStore } from "@/stores/booking.store";
import { formatCurrency } from "@/lib/format-currency";

export default function CustomerPaymentsHistoryPage() {
  const { payments } = useBookingStore();

  const handleDownloadReceipt = (receipt: string) => {
    alert(`Downloading verified e-receipt for ${receipt}...`);
  };

  return (
    <PageContainer
      title="Payment History & Receipts"
      subtitle="View all your past mobile money transactions, official tax receipts, and payment logs."
      breadcrumbs={[{ label: "Customer Dashboard", href: "/customer" }, { label: "Payment History" }]}
    >
      <div className="space-y-6">
        {/* Security Notice */}
        <div className="p-4 rounded-2xl bg-[#FFFBEB] dark:bg-amber-950/40 border border-amber-200 dark:border-slate-700/60 text-[#F59E0B] dark:text-amber-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>
              All transactions are encrypted and audited through certified Ethiopian payment switches. Sensitive bank or wallet PINs are never stored.
            </span>
          </div>
        </div>

        {payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payment records found"
            description="You haven't made any purchases yet. Your receipts will be automatically compiled here once you reserve tickets."
            actionLabel="Discover Tickets"
            actionHref="/search"
          />
        ) : (
          <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] dark:bg-[#0C0E14] border-b border-[#E2E8F0] dark:border-slate-800 text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/70 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Transaction Ref</th>
                    <th className="px-5 py-3.5">Ticket & Category</th>
                    <th className="px-5 py-3.5">Method</th>
                    <th className="px-5 py-3.5">Date & Time</th>
                    <th className="px-5 py-3.5">Amount (ETB)</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Receipt</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0] dark:divide-emerald-900/20 text-[#0F172A] dark:text-white">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/70 dark:hover:bg-indigo-950/20 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-xs text-[#F59E0B] dark:text-amber-400">
                        {p.transactionReference}
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-bold block">{p.ticketTitle}</span>
                        <span className="text-[10px] text-[#64748B] dark:text-amber-400/60 block">
                          Ref: {p.bookingReference}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#0C0E14] border border-[#E2E8F0] dark:border-slate-800 text-[11px] font-semibold">
                          {p.paymentMethod}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[#64748B] dark:text-slate-400 text-[11px]">
                        {p.date}
                      </td>

                      <td className="px-5 py-4 font-black text-sm text-[#0F172A] dark:text-white">
                        {formatCurrency(p.amount)}
                      </td>

                      <td className="px-5 py-4">
                        <PaymentStatusBadge status={p.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDownloadReceipt(p.receiptNumber)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 text-[11px] font-bold text-[#F59E0B] dark:text-amber-400 hover:bg-[#FFFBEB] transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
