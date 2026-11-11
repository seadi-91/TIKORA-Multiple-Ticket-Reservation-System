/**
 * Unified Financial Settlement & Ledger Service
 * 
 * Provides a single source of truth for revenue reconciliation,
 * statutory tax separation (5% Ethiopian VAT), platform commission (5%),
 * and Chapa disbursement tracking across BOTH Admin and Provider portals.
 */

import { TicketCategory } from "@/types/ticket.types";

export interface ProviderFinancialSummary {
  bookingsCount: number;
  grossRevenue: number;         // Total customer paid (Gross with VAT) - for Admin ledger
  ticketRevenue: number;        // Pure Ticket Sales amount (Base fare without customer VAT) - reaches provider
  vatDeducted: number;          // 5% Ethiopian statutory VAT collected for MOR (Admin ledger)
  commissionDeducted: number;   // 5% Tikora platform commission (deducted from ticket fare)
  totalNetEarnings: number;     // ticketRevenue - commissionDeducted
  totalSettled: number;         // disbursed via Chapa
  netPayable: number;           // Net on Platform remaining
  isSettled: boolean;
}

export interface ProviderFinancialTarget {
  id?: string | number;
  name?: string;
  category?: TicketCategory | string;
  commissionRate?: number;
  totalRevenue?: number;
  totalBookings?: number;
}

/**
 * Standardizes Ethiopian name matching (handles 'Addis' vs 'Adiss', 'Ababa' vs 'Abeba', spaces, hyphens)
 */
export function normalizeName(name?: string): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s\-_]+/g, "")
    .replace(/addis/g, "adiss")
    .replace(/ababa/g, "abeba");
}

/**
 * Checks whether a booking or payout record belongs to a given provider
 */
export function matchesProvider(
  record: any,
  target: ProviderFinancialTarget
): boolean {
  if (!record || !target) return false;

  const targetId = String(target.id || "").replace(/^org-/, "").trim().toLowerCase();
  const targetNormName = normalizeName(target.name);
  const targetCategory = target.category ? String(target.category).toUpperCase() : "";

  const recordProvId = String(
    record.providerId || record.ticket?.providerId || ""
  ).replace(/^org-/, "").trim().toLowerCase();
  const byId = Boolean(
    targetId &&
    recordProvId &&
    (targetId === recordProvId ||
      targetId.includes(recordProvId) ||
      recordProvId.includes(targetId))
  );

  const rawRecName =
    record.providerName ||
    record.ticket?.organizer ||
    record.accountHolder ||
    record.accountName ||
    "";
  const recordNormName = normalizeName(rawRecName);
  const byName = Boolean(
    targetNormName &&
    recordNormName &&
    (targetNormName === recordNormName ||
      targetNormName.includes(recordNormName) ||
      recordNormName.includes(targetNormName))
  );

  const byTitle = Boolean(
    targetNormName &&
    record.serviceTitle &&
    normalizeName(record.serviceTitle).includes(targetNormName)
  );

  // Infer category for payouts or legacy records without explicit category
  const inferredCat =
    recordProvId === "3" || recordNormName.includes("stadium") ? "SPORTS" :
    recordProvId === "1" || recordNormName.includes("bus") || recordNormName.includes("selam") ? "BUS" :
    recordProvId === "2" || recordNormName.includes("cinema") || recordNormName.includes("century") ? "CINEMA" :
    recordProvId === "4" || recordNormName.includes("event") || recordNormName.includes("kuriftu") ? "EVENT" : "";

  const recCat = String(record.category || record.ticket?.category || inferredCat).toUpperCase();
  const byCategoryMatch = Boolean(targetCategory && recCat && targetCategory === recCat);

  return Boolean(byId || byName || byTitle || byCategoryMatch);
}

/**
 * Unified financial calculator used identically by Admin and Provider
 */
export function calculateProviderFinancials(
  provider: ProviderFinancialTarget,
  allBookings: any[],
  allPayouts: any[]
): ProviderFinancialSummary {
  // 1. Filter matched confirmed bookings (exclude cancelled or refunded)
  const matchedBookings = (allBookings || []).filter((b) => {
    if (b.bookingStatus === "CANCELLED" || (b as any).status === "CANCELLED") return false;
    if (b.paymentStatus === "REFUNDED" || (b as any).paymentStatus === "FAILED") return false;
    return matchesProvider(b, provider);
  });

  // 2. Filter completed/processed Chapa payouts
  const matchedPayouts = (allPayouts || []).filter((p) => {
    const isCompleted =
      p.status === "PROCESSED" ||
      p.status === "COMPLETED" ||
      p.status === "PAID";
    return matchesProvider(p, provider) && isCompleted;
  });

  const totalSettled = matchedPayouts.reduce(
    (sum, p) => sum + (Number(p.netAmount ?? p.amount) || 0),
    0
  );

  // 3. Compute real earnings from matched bookings
  if (matchedBookings.length > 0) {
    let gross = 0;
    let ticketSales = 0;
    let vat = 0;
    let commission = 0;
    let net = 0;

    for (const b of matchedBookings) {
      const bTotal = Number(b.customerPaid ?? b.totalAmount ?? 0);
      const bVat = Number(
        b.vatAmount !== undefined
          ? b.vatAmount
          : Math.round(((bTotal * 0.05) / 1.05) * 100) / 100
      );
      const baseFare = Number(b.subtotal ?? Math.max(0, bTotal - bVat));
      const commRate = Number(b.commissionRate ?? provider.commissionRate ?? 5.0) / 100;
      const bComm = Number(
        b.platformFee !== undefined
          ? b.platformFee
          : Math.round(baseFare * commRate * 100) / 100
      );
      const bNet = Number(
        b.providerNet ?? b.providerPayout ?? Math.max(0, baseFare - bComm)
      );

      gross += bTotal;
      ticketSales += baseFare;
      vat += bVat;
      commission += bComm;
      net += bNet;
    }

    const netPayable = Math.max(0, Math.round((net - totalSettled) * 100) / 100);

    return {
      bookingsCount: matchedBookings.length,
      grossRevenue: Math.round(gross * 100) / 100,
      ticketRevenue: Math.round(ticketSales * 100) / 100,
      vatDeducted: Math.round(vat * 100) / 100,
      commissionDeducted: Math.round(commission * 100) / 100,
      totalNetEarnings: Math.round(net * 100) / 100,
      totalSettled: Math.round(totalSettled * 100) / 100,
      netPayable,
      isSettled: netPayable === 0,
    };
  }

  // 4. Fallback if bookings list is empty but provider has tracked gross totalRevenue
  const fallbackGross = Number(provider.totalRevenue || 0);
  if (fallbackGross > 0) {
    const commRate = Number(provider.commissionRate || 5) / 100;
    const vatRate = 0.05; // 5% Ethiopian statutory VAT
    const vat = Math.round(((fallbackGross * vatRate) / (1 + vatRate)) * 100) / 100;
    const base = fallbackGross - vat;
    const comm = Math.round(base * commRate * 100) / 100;
    const net = Math.max(0, Math.round((base - comm) * 100) / 100);
    const netPayable = Math.max(0, Math.round((net - totalSettled) * 100) / 100);

    return {
      bookingsCount: provider.totalBookings || 0,
      grossRevenue: fallbackGross,
      ticketRevenue: base,
      vatDeducted: vat,
      commissionDeducted: comm,
      totalNetEarnings: net,
      totalSettled: Math.round(totalSettled * 100) / 100,
      netPayable,
      isSettled: netPayable === 0,
    };
  }

  return {
    bookingsCount: 0,
    grossRevenue: 0,
    ticketRevenue: 0,
    vatDeducted: 0,
    commissionDeducted: 0,
    totalNetEarnings: 0,
    totalSettled: Math.round(totalSettled * 100) / 100,
    netPayable: 0,
    isSettled: true,
  };
}

/**
 * Universal async fetcher for all confirmed bookings and payouts
 * across Next.js API storage, local storage, and admin store caches.
 */
export async function fetchUnifiedFinancialData(): Promise<{
  bookings: any[];
  payouts: any[];
}> {
  let apiBookings: any[] = [];
  let apiPayouts: any[] = [];
  let hasApiPayouts = false;
  let hasApiBookings = false;

  try {
    const [bRes, pRes] = await Promise.all([
      fetch("/api/bookings").then((r) => r.json()).catch(() => ({})),
      fetch("/api/admin/payout").then((r) => r.json()).catch(() => ({})),
    ]);
    if (bRes && Array.isArray(bRes.bookings)) {
      apiBookings = bRes.bookings;
      hasApiBookings = true;
    }
    if (pRes && Array.isArray(pRes.payouts)) {
      apiPayouts = pRes.payouts;
      hasApiPayouts = true;
    }
  } catch {}

  let localBookings: any[] = [];
  let localPayouts: any[] = [];

  if (typeof window !== "undefined") {
    try {
      const bProv = localStorage.getItem("tikora_provider_bookings");
      const bAdm = localStorage.getItem("tikora_admin_bookings");
      const bCust = localStorage.getItem("tikora_customer_bookings");

      if (bProv) localBookings.push(...JSON.parse(bProv));
      if (bAdm) localBookings.push(...JSON.parse(bAdm));
      if (bCust) localBookings.push(...JSON.parse(bCust));

      const pAdm = localStorage.getItem("tikora_admin_payouts");
      const pProv = localStorage.getItem("tikora_provider_payouts");

      if (pAdm) localPayouts.push(...JSON.parse(pAdm));
      if (pProv) localPayouts.push(...JSON.parse(pProv));
    } catch {}
  }

  // Deduplicate bookings
  const bMap = new Map<string, any>();
  for (const b of [...apiBookings, ...localBookings]) {
    if (!b) continue;
    const key = String(b.bookingReference || b.reference || b.id || "");
    if (key && !bMap.has(key)) {
      bMap.set(key, b);
    }
  }

  // Authoritative payouts: when /api/admin/payout responds, it is the single source of truth
  let finalPayouts: any[] = [];
  if (hasApiPayouts) {
    finalPayouts = apiPayouts;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("tikora_admin_payouts", JSON.stringify(apiPayouts));
      } catch {}
    }
  } else {
    const pMap = new Map<string, any>();
    for (const p of localPayouts) {
      if (!p) continue;
      const key = String(p.reference || p.id || "");
      if (key && !pMap.has(key)) {
        pMap.set(key, p);
      }
    }
    finalPayouts = Array.from(pMap.values());
  }

  const cleanBookings = Array.from(bMap.values()).filter(
    (b) =>
      !String(b.id || "").startsWith("bkg-") &&
      !String(b.reference || "").startsWith("TIKORA-BKG-10")
  );

  if (typeof window !== "undefined" && cleanBookings.length > 0) {
    try {
      localStorage.setItem("tikora_provider_bookings", JSON.stringify(cleanBookings));
      localStorage.setItem("tikora_admin_bookings", JSON.stringify(cleanBookings));
    } catch {}
  }

  return {
    bookings: cleanBookings,
    payouts: finalPayouts,
  };
}
