"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useProviderStore } from "@/stores/provider.store";
import {
  SettlementReceiptCard,
  SettlementReceiptData,
} from "@/components/provider/settlement-receipt-card";
import { INITIAL_TRANSACTIONS } from "../page";

export default function ProviderPaymentReceiptPage({
  params,
}: {
  params: Promise<{ paymentId: string }> | { paymentId: string };
}) {
  const router = useRouter();
  const { organization } = useProviderStore();

  // Next.js 15 params can be a Promise
  const resolvedParams =
    typeof (params as any)?.then === "function" ? use(params as Promise<{ paymentId: string }>) : (params as { paymentId: string });

  const paymentId = resolvedParams.paymentId;

  // Search transaction by id or reference
  const tx = INITIAL_TRANSACTIONS.find(
    (t) => t.id === paymentId || t.reference.toLowerCase() === paymentId.toLowerCase()
  );

  if (!tx) {
    return (
      <div className="p-8 text-center bg-card rounded-2xl border border-slate-200/50 dark:border-slate-800/50 max-w-md mx-auto my-12 space-y-3">
        <p className="font-bold text-foreground text-sm">Settlement receipt not found</p>
        <p className="text-muted-foreground text-xs">
          No payout transaction record matches reference &quot;{paymentId}&quot;.
        </p>
        <button
          onClick={() => router.push("/provider/payments")}
          className="mt-2 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 text-white cursor-pointer"
        >
          Return to Disbursements
        </button>
      </div>
    );
  }

  return (
    <SettlementReceiptCard
      transaction={tx}
      organization={organization}
      onBack={() => router.push("/provider/payments")}
    />
  );
}

