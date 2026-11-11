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
  Trophy,
  Bus,
  Film,
  Sparkles,
} from "lucide-react";
import { useProviderStore, ProviderBookingRecord } from "@/stores/provider.store";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { useLanguage } from "@/providers/language-provider";
import {
  calculateProviderFinancials,
  matchesProvider,
  fetchUnifiedFinancialData,
  ProviderFinancialSummary,
} from "@/services/financial.service";
import {
  SettlementReceiptCard,
  SettlementReceiptData,
} from "@/components/provider/settlement-receipt-card";

export type PayoutTransaction = SettlementReceiptData;

export const INITIAL_TRANSACTIONS: PayoutTransaction[] = [];

export default function ProviderPaymentsPage() {
  const {
    organization,
    bookings: storeBookings,
    fetchOrganization,
    fetchBookings,
    requestPayout,
    setOrganizationCategory,
  } = useProviderStore();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"TICKET_SALES" | "DISBURSEMENTS">("TICKET_SALES");
  const [transactions, setTransactions] = useState<PayoutTransaction[]>(INITIAL_TRANSACTIONS);
  const [ticketSales, setTicketSales] = useState<ProviderBookingRecord[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const bProv = localStorage.getItem("tikora_provider_bookings");
        const bAdm = localStorage.getItem("tikora_admin_bookings");
        const combined = [];
        if (bProv) combined.push(...JSON.parse(bProv));
        if (bAdm) combined.push(...JSON.parse(bAdm));
        if (combined.length > 0) return combined;
      } catch {}
    }
    return [];
  });
  const [allPayouts, setAllPayouts] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const pAdm = localStorage.getItem("tikora_admin_payouts");
        if (pAdm) return JSON.parse(pAdm);
      } catch {}
    }
    return [];
  });
  const [sectorOrderCounts, setSectorOrderCounts] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<PayoutTransaction | null>(null);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unified real-time sync for bookings and payouts from unified financial service
  useEffect(() => {
    let isMounted = true;
    fetchOrganization?.().catch(() => {});
    fetchBookings?.().catch(() => {});

    const loadFinancialData = async () => {
      try {
        const { bookings: unifiedBookings, payouts: unifiedPayouts } = await fetchUnifiedFinancialData();
        if (!isMounted) return;

        setAllBookings(unifiedBookings);
        setAllPayouts(unifiedPayouts);

        const counts: Record<string, number> = {
          SPORTS: unifiedBookings.filter(
            (b) =>
              b.category === "SPORTS" ||
              String(b.providerId) === "3" ||
              (b.providerName || "").toLowerCase().includes("stadium")
          ).length,
          BUS: unifiedBookings.filter(
            (b) =>
              b.category === "BUS" ||
              String(b.providerId) === "1" ||
              (b.providerName || "").toLowerCase().includes("bus")
          ).length,
          CINEMA: unifiedBookings.filter(
            (b) =>
              b.category === "CINEMA" ||
              String(b.providerId) === "2" ||
              (b.providerName || "").toLowerCase().includes("cinema")
          ).length,
          EVENT: unifiedBookings.filter(
            (b) =>
              b.category === "EVENT" ||
              String(b.providerId) === "4" ||
              (b.providerName || "").toLowerCase().includes("event")
          ).length,
        };
        setSectorOrderCounts(counts);

        let activeOrg = organization;
        let matched = unifiedBookings.filter((b) => matchesProvider(b, activeOrg));

        // Auto-detect if current sector has 0 orders, but another sector has live orders
        if (matched.length === 0 && unifiedBookings.length > 0) {
          const topCat = (["SPORTS", "BUS", "CINEMA", "EVENT"] as const).find((c) => counts[c] > 0);
          if (topCat && topCat !== organization.category) {
            setOrganizationCategory(topCat);
            activeOrg = { ...organization, category: topCat };
            matched = unifiedBookings.filter((b) => matchesProvider(b, activeOrg));
          }
        }

        setTicketSales(matched);

        // Map live settled payouts specifically for this organization
        const orgPayouts = unifiedPayouts.filter((p) => {
          const isCompleted =
            p.status === "PROCESSED" ||
            p.status === "COMPLETED" ||
            p.status === "PAID";
          return matchesProvider(p, activeOrg) && isCompleted;
        });

        const mapped: PayoutTransaction[] = orgPayouts.map((p) => {
          const amt = Number(p.amount) || 0;
          const net = Number(p.netAmount ?? amt) || amt;
          const fee = Number(p.fee) || 0;
          const dateStr = p.processedAt || p.requestedAt || new Date().toISOString();

          return {
            id: p.id || p.reference,
            reference: p.reference || `PO-${Date.now()}`,
            date: dateStr.split("T")[0],
            timestamp: dateStr.replace("T", " ").substring(0, 16),
            period: "Live Settlement",
            amount: amt,
            grossRevenue: amt,
            grossSales: amt,
            vatAmount: 0,
            fee: fee,
            commission: fee,
            platformCommission: fee,
            netPayout: net,
            channel: (p.payoutMethod || "CHAPA") as any,
            accountNumber: p.accountNumber || "1000000000000",
            accountHolder: p.accountName || organization.name,
            bankName: p.bankName || "Commercial Bank of Ethiopia (CBE)",
            status: "COMPLETED",
            transactionRef: p.reference || `TX-${Date.now()}`,
            organizationName: organization.name,
            taxNumber: organization.tinNumber || "N/A",
            adminName: "Super Admin Peter",
          };
        });

        setTransactions(mapped);
      } catch (err) {
        console.error("Failed to load unified financial data:", err);
      }
    };

    loadFinancialData();

    // Listen for live settlement payouts from admin or customer bookings
    const handleSync = () => loadFinancialData();
    if (typeof window !== "undefined") {
      window.addEventListener("tikora_booking_created", handleSync);
      window.addEventListener("tikora_provider_payout_settled", handleSync);
      window.addEventListener("tikora_provider_notification", handleSync);
      window.addEventListener("storage", handleSync);
    }
    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("tikora_booking_created", handleSync);
        window.removeEventListener("tikora_provider_payout_settled", handleSync);
        window.removeEventListener("tikora_provider_notification", handleSync);
        window.removeEventListener("storage", handleSync);
      }
    };
  }, [storeBookings, organization.id, organization.name, organization.category, organization.tinNumber]);

  // Single authoritative financial calculation shared identically between Admin & Provider
  const effectiveBookings = allBookings.length > 0 ? allBookings : storeBookings;
  const fin = calculateProviderFinancials(organization, effectiveBookings, allPayouts);
  const grossTicketSales = fin.ticketRevenue;
  const totalCommissionFee = fin.commissionDeducted;
  const totalDisbursed = fin.totalSettled;
  const availableBalance = fin.netPayable;

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
        grossSales: payoutAmount,
        commission: Math.round(payoutAmount * (((organization as any)?.commissionRate || 5) / 100)),
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
            {t("Revenue & Payout Settlements")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t("View incoming ticket sales, 5% platform commission deductions, and bank disbursements.", "የትኬት ሽያጮችን፣ 5% የተቀነሰ የፕላትፎርም ኮሚሽን እና የባንክ ዝውውር መረጃዎችን ይመልከቱ።")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportStatement}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> {t("Statement")}
          </button>
          <button
            type="button"
            onClick={handleOpenPayoutModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5" /> {t("Request Bank Payout")}
          </button>
        </div>
      </div>

      {/* Sector Switcher Bar with Real Live Counts */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-card border border-border/60 shadow-xs">
        <span className="text-[11px] font-bold text-muted-foreground px-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          {t("Active Sector Provider")}:
        </span>
        {[
          { id: "SPORTS" as const, label: "Stadium Sports Club", org: "Adiss Abeba Stadium", icon: Trophy },
          { id: "BUS" as const, label: "Intercity Bus Lines", org: "Selam Bus Lines", icon: Bus },
          { id: "CINEMA" as const, label: "Cinema Multiplex", org: "Century Cinema Multiplex", icon: Film },
          { id: "EVENT" as const, label: "Live Events & Concerts", org: "Kuriftu Resort & Live Events", icon: Calendar },
        ].map((s) => {
          const Icon = s.icon;
          const isSelected = organization.category === s.id;
          const count = sectorOrderCounts[s.id] || 0;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setOrganizationCategory(s.id);
                toast.success(`Switched provider to ${s.label} (${s.org})`);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#B45309] text-white shadow-xs"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t(s.label)}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? "bg-white/25 text-white"
                    : count > 0
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold"
                    : "bg-background/80 text-muted-foreground"
                }`}
              >
                {count} {t("orders")}
              </span>
            </button>
          );
        })}
      </div>

      {/* KPI Financial Cards - 5 Reconciled Provider Perspective Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {/* Card 1: Total Ticket Sales (Base Ticket Fare) */}
        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate font-medium">
              {language === "am" ? "ጠቅላላ የትኬት ሽያጭ" : t("payments.ticketSales", "Total Ticket Sales")}
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground truncate font-mono">
            {formatCurrency(fin.ticketRevenue)}
          </div>
          <span className="text-[10px] text-muted-foreground truncate block">
            {language === "am" ? "የትኬት መሸጫ ዋጋ (ያለ VAT)" : "Ticket Base Revenue"}
          </span>
        </div>

        {/* Card 2: TIKORA Platform Commission (5%) */}
        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate font-medium">
              {language === "am" ? "የቲክኦራ 5% ኮሚሽን" : t("analysis.platformCommission", "Commission (5%)")}
            </span>
            <DollarSign className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-rose-500 truncate font-mono">
            - {formatCurrency(fin.commissionDeducted)}
          </div>
          <span className="text-[10px] text-muted-foreground truncate block">
            {language === "am" ? "የተቀነሰ 5% ኮሚሽን" : "5% Platform Fee"}
          </span>
        </div>

        {/* Card 3: Total Net Earned (Ticket Sales - Commission) */}
        <div className="bg-card border border-blue-500/30 bg-blue-500/[0.04] rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-400 text-xs mb-1 font-semibold">
            <span className="text-[10px] sm:text-xs truncate font-bold">
              {language === "am" ? "ጠቅላላ የተጣራ ገቢ" : "Total Net Earned"}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-black text-blue-600 dark:text-blue-400 truncate font-mono">
            {formatCurrency(fin.totalNetEarnings)}
          </div>
          <span className="text-[10px] text-blue-700/80 dark:text-blue-400/80 truncate block font-medium">
            {language === "am" ? "የትኬት ዋጋ - 5% ኮሚሽን" : "Net After Commission"}
          </span>
        </div>

        {/* Card 4: Total Received in Hand (Disbursed to Bank Account) */}
        <div className="bg-card border border-emerald-500/40 bg-emerald-500/[0.06] rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs mb-1 font-semibold">
            <span className="text-[10px] sm:text-xs truncate font-bold">
              {language === "am" ? "ተቀብሎ እጁ ላይ ያለ" : "Received & in Hand"}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 truncate font-mono">
            {formatCurrency(fin.totalSettled)}
          </div>
          <span className="text-[10px] text-emerald-700/90 dark:text-emerald-400/90 truncate block font-medium">
            {language === "am" ? "ወደ ባንክ አካውንት የገባ" : "Disbursed to Bank Account"}
          </span>
        </div>

        {/* Card 5: Net on Platform (Remaining Unclaimed on Platform) */}
        <div
          className={`bg-card rounded-xl p-3 shadow-xs border ${
            fin.netPayable === 0
              ? "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
              : "border-amber-600/40 bg-amber-500/10 shadow-amber-500/5 ring-1 ring-amber-500/20"
          }`}
        >
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs mb-1 font-semibold">
            <span className="text-[10px] sm:text-xs truncate font-bold">
              {language === "am" ? "Net on Platform (ያልተቀበለው)" : "Net on Platform"}
            </span>
            <Wallet className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-sm sm:text-base font-black truncate font-mono ${
                fin.netPayable === 0
                  ? "text-slate-500 dark:text-slate-400"
                  : "text-amber-700 dark:text-amber-400"
              }`}
            >
              {formatCurrency(fin.netPayable)}
            </span>
            {fin.isSettled ? (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {language === "am" ? "✓ ሁሉም ተላልፏል" : "✓ All Settled"}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 animate-pulse">
                {language === "am" ? "ቀሪ ሂሳብ" : "Pending Payout"}
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground truncate block font-medium">
            {fin.isSettled
              ? (language === "am" ? "ሁሉም ተከፍሎ አልቋል" : "Zero Balance Remaining")
              : (language === "am" ? "በፕላትፎርሙ ላይ የቀረ ያልተቀበለው" : "Unclaimed on Platform")}
          </span>
        </div>
      </div>

      {/* Escrow Reconciliation Summary Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-foreground">
              {language === "am"
                ? "የክፍያ ሂሳብ ማጠቃለያ፦ ጠቅላላ የተጣራ ገቢ = ተቀብሎ እጅ ላይ ያለ + በፕላትፎርሙ ላይ የቀረ ያልተቀበሉት"
                : "Escrow Financial Balance: Total Net = Disbursed in Hand + Unclaimed on Platform"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {language === "am"
                ? `ጠቅላላ የተጣራ ገቢ (${formatCurrency(fin.totalNetEarnings)}) = ወደ ባንክ የገባ (${formatCurrency(fin.totalSettled)}) + በፕላትፎርሙ ላይ የቀረ ያልተቀበሉት (${formatCurrency(fin.netPayable)})`
                : `Total Net (${formatCurrency(fin.totalNetEarnings)}) = In Hand (${formatCurrency(fin.totalSettled)}) + On Platform (${formatCurrency(fin.netPayable)})`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] flex-wrap">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{language === "am" ? "እጅ ላይ ያለ፦ " : "In Hand: "}</span>
            <span className="text-emerald-700 dark:text-emerald-300 font-black">{formatCurrency(fin.totalSettled)}</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20 flex items-center gap-1">
            <Wallet className="w-3 h-3 text-amber-600" />
            <span>{language === "am" ? "ያልተቀበሉት፦ " : "Unclaimed: "}</span>
            <span className="text-amber-800 dark:text-amber-200 font-black">{formatCurrency(fin.netPayable)}</span>
          </span>
        </div>
      </div>

      {/* Platform Commission & Payout Policy Banner */}
      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs flex items-start gap-2.5">
        <DollarSign className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-foreground">
            {t("TIKORA Commission & Settlement Policy", "የቲኮራ ኮሚሽን እና የክፍያ ዝውውር መመሪያ")}
          </span>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {t(
              "Only the 5% TIKORA platform service fee is deducted from your ticket sales. The full remaining 95% net revenue is disbursed directly to your verified bank account via Chapa.",
              "ከእያንዳንዱ የትኬት ሽያጭ 5% የቲኮራ ፕላትፎርም አገልግሎት ኮሚሽን ብቻ የሚቀነስ ሲሆን ቀሪው 95% የተጣራ ገቢ ሙሉ በሙሉ ወደ ባንክ ሂሳብዎ በቻፓ በኩል ይተላለፋል።"
            )}
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
                {t("Verified Settlement Account")}
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
          {t("Manage Payout Accounts")} &rarr;
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
          <span>{t("Ticket Sales Revenue")}</span>
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
          <span>{t("Disbursements & Payouts")}</span>
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
              <h3 className="text-xs sm:text-sm font-bold text-foreground">
                {t("Ticket Sales Settlements", "የትኬት ሽያጭ ገቢዎች")}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {t(
                  "Showing incoming ticket sales. 5% platform commission is deducted for your net provider settlement.",
                  "የተሸጡ ትኬቶች ዋጋ። 5% የቲኮራ ፕላትፎርም ኮሚሽን ተቀንሶ የተጣራው ገቢ ለእርስዎ ይተላለፋል።"
                )}
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
              <p className="font-semibold text-foreground">{t("No ticket sales recorded yet.")}</p>
              <p className="text-[11px]">{t("When customers book and pay via Chapa, their ticket payments will appear here.")}</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border/60">
                      <th className="py-2.5 px-3.5">{t("Reference / Pass")}</th>
                      <th className="py-2.5 px-3">{t("Customer Info")}</th>
                      <th className="py-2.5 px-3">{t("Service & Seats")}</th>
                      <th className="py-2.5 px-3 text-right">{t("Ticket Price", "የትኬት ዋጋ")}</th>
                      <th className="py-2.5 px-3 text-right">{t("Commission (5%)", "የተቀነሰ ኮሚሽን")}</th>
                      <th className="py-2.5 px-3 text-right">{t("Net to Provider", "የተጣራ ገቢ")}</th>
                      <th className="py-2.5 px-3 text-center">{t("Status")}</th>
                      <th className="py-2.5 px-3.5 text-right">{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredTicketSales.map((sale) => {
                      const cPaid = Number(sale.customerPaid ?? sale.totalAmount ?? 0);
                      const vatRate = Number(sale.vatRate ?? 5.0);
                      const vat = Number(sale.vatAmount ?? Math.round(((cPaid * vatRate) / (100 + vatRate)) * 100) / 100);
                      const basePrice = Number(sale.subtotal ?? Math.max(0, cPaid - vat));
                      const commRate = typeof sale.commissionRate === "number" ? sale.commissionRate : 5.0;
                      const comm = Number(
                        sale.platformFee ?? Math.round(basePrice * (commRate / 100) * 100) / 100
                      );
                      const net = Number(
                        sale.providerNet ?? Math.max(0, basePrice - comm)
                      );

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
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-500">
                            -{formatCurrency(comm)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
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

              {/* Mobile View: Compact Cards (VAT-free) */}
              <div className="block md:hidden p-2.5 space-y-2">
                {filteredTicketSales.map((sale) => {
                  const cPaid = Number(sale.customerPaid ?? sale.totalAmount ?? 0);
                  const vatRate = Number(sale.vatRate ?? 5.0);
                  const vat = Number(sale.vatAmount ?? Math.round(((cPaid * vatRate) / (100 + vatRate)) * 100) / 100);
                  const basePrice = Number(sale.subtotal ?? Math.max(0, cPaid - vat));
                  const commRate = typeof sale.commissionRate === "number" ? sale.commissionRate : 5.0;
                  const comm = Number(
                    sale.platformFee ?? Math.round(basePrice * (commRate / 100) * 100) / 100
                  );
                  const net = Number(
                    sale.providerNet ?? Math.max(0, basePrice - comm)
                  );

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
                          <span className="text-[10px] text-muted-foreground block">{t("Ticket Price", "የትኬት ዋጋ")}:</span>
                          <span className="font-bold text-foreground">{formatCurrency(basePrice)}</span>
                          <span className="text-[9px] text-rose-500 block">-{formatCurrency(comm)} {t("comm", "ኮሚሽን")}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground block">{t("Net Payout", "የተጣራ ገቢ")}:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(net)}</span>
                          <span className="text-[9px] text-muted-foreground block font-sans">95% {t("to provider", "ለፕሮቫይደር")}</span>
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
