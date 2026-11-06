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
  ) || {
    id: paymentId,
    reference: paymentId.startsWith("POT-") ? paymentId : `POT-2026-${paymentId}`,
    date: "2026-11-01 16:30",
    bankName: organization.payoutAccount.bankName || "Commercial Bank of Ethiopia (CBE)",
    accountNumber: organization.payoutAccount.accountNumber || "1000189429184",
    amount: 150000,
    fee: 0,
    netPayout: 150000,
    status: "COMPLETED" as const,
    grossSales: 157895,
    commission: 7895,
    transactionRef: "CBE-FT2630591823",
    period: "Oct 25, 2026 - Oct 31, 2026",
  };

  return (
    <SettlementReceiptCard
      transaction={tx}
      organization={organization}
      onBack={() => router.push("/provider/payments")}
    />
  );
}

