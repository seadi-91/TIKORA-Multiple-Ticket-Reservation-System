import React from "react";
import { formatCurrency } from "@/lib/format-currency";

interface PaymentSummaryProps {
  amount: number;
  paymentMethod: string;
  reference?: string;
}

export function PaymentSummary({ amount, paymentMethod, reference }: PaymentSummaryProps) {
  return (
    <div className="rounded-xl p-4 bg-gray-50 dark:bg-[#0C0E14] border border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
      <div>
        <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-amber-400/60 block">
          Payment Method: {paymentMethod}
        </span>
        {reference && (
          <span className="text-xs font-mono text-[#0F172A] dark:text-slate-300">Ref: {reference}</span>
        )}
      </div>
      <div className="text-right">
        <span className="text-[10px] text-[#64748B] dark:text-amber-300/60 block uppercase font-medium">Charged</span>
        <span className="text-base font-black text-[#F59E0B] dark:text-amber-400">{formatCurrency(amount)}</span>
      </div>
    </div>
  );
}

export default PaymentSummary;

