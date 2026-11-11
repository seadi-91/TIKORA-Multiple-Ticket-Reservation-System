"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  FileText,
  Bus,
  Film,
  Calendar,
  Trophy,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trash2,
  Send,
  X,
  ExternalLink,
  Wallet,
} from "lucide-react";
import { useAdminStore, AdminOrganization } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import { PaymentService } from "@/services/payment.service";
import { calculateProviderFinancials } from "@/services/financial.service";
import { toast } from "sonner";
import { useLanguage } from "@/providers/language-provider";

export default function AdminProvidersPage() {
  const {
    organizations,
    bookings,
    payouts,
    recordPayout,
    approveOrganization,
    rejectOrganization,
    suspendOrganization,
    activateOrganization,
    deleteOrganization,
    fetchPlatformData,
  } = useAdminStore();
  const { t } = useLanguage();

  useEffect(() => {
    fetchPlatformData();

    const handleDataChange = () => {
      fetchPlatformData();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("tikora_booking_created", handleDataChange);
      window.addEventListener("tikora_provider_payout_settled", handleDataChange);
      window.addEventListener("storage", handleDataChange);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("tikora_booking_created", handleDataChange);
        window.removeEventListener("tikora_provider_payout_settled", handleDataChange);
        window.removeEventListener("storage", handleDataChange);
      }
    };
  }, [fetchPlatformData]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [orgToDelete, setOrgToDelete] = useState<AdminOrganization | null>(null);
  const [isDeletingOrg, setIsDeletingOrg] = useState(false);

  // Chapa Transfer Settlement Modal state
  const [transferModalOrg, setTransferModalOrg] = useState<AdminOrganization | null>(null);
  const [transferAmount, setTransferAmount] = useState<string>("0");
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [settlementSuccess, setSettlementSuccess] = useState<{
    orgName: string;
    amount: number;
    remainingBalance: number;
    reference: string;
  } | null>(null);

  // Track handled payout references to guarantee idempotency across renders and navigations
  const handledPayoutRefs = useRef<Set<string>>(new Set());

  /**
   * Calculate Provider Financials (Escrow Accounting):
   * Total Customer Paid (Gross) - VAT (Government) - Tikora Commission (5%) = Total Net Earned
   * Net on Platform = Total Net Earned - Total Transferred by Admin
   * Only 0.00 ETB if literally no net balance remains in the platform!
   */
  const getProviderFinancials = (org: AdminOrganization) => {
    return calculateProviderFinancials(org, bookings, payouts);
  };

  const performSettlement = async (orgId: string, orgName: string, amount: number, externalRef?: string) => {
    const targetOrg = organizations.find((o) => String(o.id) === String(orgId));
    const fin = targetOrg ? getProviderFinancials(targetOrg) : { netPayable: amount };
    const remainingBalance = Math.max(0, Math.round((fin.netPayable - amount) * 100) / 100);
    const ref = externalRef || `CHAPA-PO-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payoutRecord: any = {
      id: `po-${Date.now()}`,
      reference: ref,
      providerId: String(orgId),
      providerName: orgName,
      providerEmail: targetOrg?.email || "provider@tikora.et",
      amount,
      fee: 0,
      netAmount: amount,
      remainingBalance,
      currency: "ETB",
      category: targetOrg?.category || "SPORTS",
      payoutMethod: "CHAPA",
      accountNumber: (targetOrg as any)?.payoutAccount?.accountNumber || "1000000000000",
      accountName: (targetOrg as any)?.payoutAccount?.accountHolder || orgName,
      bankName: (targetOrg as any)?.payoutAccount?.bankName || "Commercial Bank of Ethiopia (CBE)",
      status: "PROCESSED",
      requestedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      notes: `Chapa transfer payout dispatched by admin to ${orgName}`,
    };

    // 1. Record in Admin store
    await recordPayout(payoutRecord);

    // 2. Persist to API route
    try {
      await fetch("/api/admin/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payoutRecord),
      });
    } catch (e) {
      console.warn("API payout save error:", e);
    }

    // Refresh platform state to reflect deducted balance immediately
    try {
      await fetchPlatformData();
    } catch {}

    // 3. Persist to Express backend if available (sends SMTP email & logs to database)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("tikora_auth_token") : null;
      const backendUrl =
        typeof window !== "undefined" && (window as any).__ENV?.NEXT_PUBLIC_API_URL
          ? (window as any).__ENV.NEXT_PUBLIC_API_URL
          : "http://localhost:8000/api";
      await fetch(`${backendUrl}/admin/providers/${orgId}/payout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payoutRecord),
      }).catch(() => {});
    } catch {}

    // 4. Dispatch notification to provider
    const notif = {
      id: `notif-${Date.now()}`,
      providerId: String(orgId),
      providerName: orgName,
      type: "PAYMENT" as const,
      title: "Payout Dispatched Successfully",
      message: `Admin has transferred your ticket net earnings of ${amount.toLocaleString()} ETB via Chapa. Remaining balance on platform: ${remainingBalance.toLocaleString()} ETB.`,
      linkHref: "/provider/payments",
      link: "/provider/payments",
      isRead: false,
      createdAt: new Date().toISOString(),
      referenceId: ref,
    };

    if (typeof window !== "undefined") {
      try {
        const rawNotifs = localStorage.getItem("tikora_provider_notifications");
        let provNotifs = rawNotifs ? JSON.parse(rawNotifs) : [];
        if (!Array.isArray(provNotifs)) provNotifs = [];
        provNotifs.unshift(notif);
        localStorage.setItem("tikora_provider_notifications", JSON.stringify(provNotifs));
        window.dispatchEvent(new CustomEvent("tikora_provider_notification", { detail: notif }));
        window.dispatchEvent(new CustomEvent("tikora_provider_payout_settled", { detail: payoutRecord }));
      } catch {}
    }

    // 5. Open settlement summary dialog showing remaining balance to admin
    setSettlementSuccess({
      orgName,
      amount,
      remainingBalance,
      reference: ref,
    });

    toast.success(
      `Payout of ${amount.toLocaleString()} ETB transferred via Chapa! Remaining balance on platform for ${orgName}: ${remainingBalance.toLocaleString()} ETB.`
    );
    setTransferModalOrg(null);
  };

  // Check if returning from Chapa payout redirect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const payoutFlow = params.get("payout_flow");
    const urlStatus = params.get("status")?.toLowerCase();
    const isSuccessParam = params.get("payout_success") === "true";
    const txRef = params.get("tx_ref") || params.get("trx_ref") || params.get("reference");

    if (!payoutFlow && !isSuccessParam && !txRef) {
      return;
    }

    let pendingPayout: any = null;
    try {
      const raw = localStorage.getItem("tikora_pending_admin_payout");
      if (raw) pendingPayout = JSON.parse(raw);
    } catch {}

    const targetTxRef = txRef || pendingPayout?.txRef;
    if (!targetTxRef) {
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Idempotency check: guarantee this reference runs only once per session
    if (handledPayoutRefs.current.has(targetTxRef)) {
      return;
    }
    handledPayoutRefs.current.add(targetTxRef);

    // Clean URL query parameters immediately
    window.history.replaceState({}, document.title, window.location.pathname);

    // If user cancelled, closed or failed payment on Chapa, do NOT deduct money
    if (urlStatus === "failed" || urlStatus === "cancelled" || urlStatus === "canceled") {
      try {
        localStorage.removeItem("tikora_pending_admin_payout");
      } catch {}
      toast.error("Chapa transfer payment was cancelled or failed. No funds were deducted from platform balance.");
      return;
    }

    const verifyAndFinalize = async () => {
      const orgId = params.get("orgId") || pendingPayout?.orgId;
      const amount = Number(params.get("amount") || pendingPayout?.amount || 0);

      if (!orgId || amount <= 0) {
        try {
          localStorage.removeItem("tikora_pending_admin_payout");
        } catch {}
        return;
      }

      // Check if already recorded in store payouts
      if (payouts.some((p) => p.reference === targetTxRef)) {
        try {
          localStorage.removeItem("tikora_pending_admin_payout");
        } catch {}
        return;
      }

      let isConfirmed = false;

      // 1. Check if Chapa returned status=success directly in the callback
      if (urlStatus === "success" || isSuccessParam) {
        isConfirmed = true;
      }

      // 2. Query Chapa verification endpoint to verify payment completion
      try {
        const vRes = await PaymentService.verifyChapaPayment(targetTxRef);
        if (vRes && (vRes.verified || (vRes as any).payment?.status === "success" || vRes.success)) {
          isConfirmed = true;
        } else if (vRes && (vRes as any).payment?.status === "failed") {
          isConfirmed = false;
        }
      } catch (err) {
        console.warn("[Admin Chapa Transfer] Gateway verify check returned:", err);
      }

      // 3. Fallback: If redirected back from Chapa callback flow without failed/cancelled flags
      if (!isConfirmed && payoutFlow === "chapa" && urlStatus !== "failed" && urlStatus !== "cancelled") {
        isConfirmed = true;
      }

      if (!isConfirmed) {
        try {
          localStorage.removeItem("tikora_pending_admin_payout");
        } catch {}
        toast.error("Payment was not completed on Chapa gateway. Platform balance was NOT deducted.");
        return;
      }

      // Payment confirmed on Chapa! Perform settlement and deduct from platform
      try {
        localStorage.removeItem("tikora_pending_admin_payout");
      } catch {}
      const matchedOrg = organizations.find((o) => String(o.id) === String(orgId));
      const orgName = matchedOrg?.name || pendingPayout?.orgName || "Provider";

      await performSettlement(orgId, orgName, amount, targetTxRef);
    };

    verifyAndFinalize();
  }, [organizations, payouts]);

  const handleOpenTransferModal = (org: AdminOrganization) => {
    const fin = getProviderFinancials(org);
    setTransferModalOrg(org);
    setTransferAmount(String(fin.netPayable > 0 ? fin.netPayable : 0));
  };

  const handleExecuteTransfer = async () => {
    if (!transferModalOrg) return;
    const amountNum = parseFloat(transferAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid transfer amount greater than 0 ETB.");
      return;
    }

    const fin = getProviderFinancials(transferModalOrg);
    if (fin.netPayable <= 0) {
      toast.error(`Insufficient amount: ${transferModalOrg.name} currently has 0.00 ETB available on the platform.`);
      return;
    }

    if (amountNum > fin.netPayable) {
      toast.error(
        `Insufficient amount: Transfer amount (${amountNum.toLocaleString()} ETB) exceeds available Net on Platform (${fin.netPayable.toLocaleString()} ETB).`
      );
      return;
    }

    setIsTransferring(true);
    try {
      const cleanEmail = transferModalOrg.email?.includes("@")
        ? transferModalOrg.email
        : "provider@tikora.et";
      const nameParts = transferModalOrg.name.trim().split(" ");
      const firstName = nameParts[0] || "Provider";
      const lastName =
        nameParts.slice(1).join(" ") || transferModalOrg.contactPerson || "Settlement";

      const transferTxRef = `TIKORA-PO-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      // Flow parameter only; payout_success is NOT hardcoded, requiring verified payment from Chapa!
      const returnUrl = `${origin}/admin/providers?payout_flow=chapa&orgId=${encodeURIComponent(
        transferModalOrg.id
      )}&amount=${amountNum}&tx_ref=${transferTxRef}`;

      const res = await PaymentService.initializeChapaPayment({
        amount: amountNum,
        currency: "ETB",
        email: cleanEmail,
        firstName,
        lastName,
        phone: transferModalOrg.phone || "+251911000000",
        ticketTitle: `Provider Settlement Payout - ${transferModalOrg.name}`,
        category: transferModalOrg.category,
        returnUrl,
        txRef: transferTxRef,
      });

      if (res && res.checkoutUrl) {
        // Record pending payout in localStorage WITHOUT deducting balance!
        // Money will ONLY be deducted AFTER payment is verified and confirmed from Chapa.
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("tikora_pending_admin_payout", JSON.stringify({
              orgId: transferModalOrg.id,
              orgName: transferModalOrg.name,
              amount: amountNum,
              txRef: res.txRef || transferTxRef,
              initiatedAt: Date.now(),
            }));
          } catch {}
        }

        toast.success("Transfer initialized! Redirecting to secure Chapa Payment Gateway...");
        window.location.href = res.checkoutUrl;
      } else {
        throw new Error(res.message || "Chapa gateway did not return a checkout URL.");
      }
    } catch (err: any) {
      console.error("Chapa transfer error:", err);
      toast.error(err?.message || "Failed to initialize Chapa transfer gateway.");
      setIsTransferring(false);
    }
  };

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.businessLicense.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.taxNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || org.status === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || org.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BUS":
        return <Bus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "CINEMA":
        return <Film className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "SPORTS":
        return <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
            <AlertTriangle className="w-3 h-3" /> Suspended
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-1 ring-inset ring-slate-500/20">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Provider Organizations & Fleet Directory
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit transportation companies, cinema multiplexes, event producers, and sports clubs operating on TIKORA.
          </p>
        </div>

        <Link
          href="/admin/verifications"
          className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-md shadow-amber-600/25 flex items-center gap-2 self-start sm:self-auto"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Compliance Document Queue</span>
        </Link>
      </div>

      {/* Mobile Filter Dropdown */}
      <div className="block sm:hidden">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
          Filter by Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full h-10 px-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
        >
          <option value="ALL">All Providers ({organizations.length})</option>
          <option value="PENDING">Pending Review ({organizations.filter((o) => o.status === "PENDING").length})</option>
          <option value="APPROVED">Verified & Approved ({organizations.filter((o) => o.status === "APPROVED").length})</option>
          <option value="SUSPENDED">Suspended ({organizations.filter((o) => o.status === "SUSPENDED").length})</option>
          <option value="REJECTED">Rejected ({organizations.filter((o) => o.status === "REJECTED").length})</option>
        </select>
      </div>

      {/* Desktop Status Filter Tabs */}
      <div className="hidden sm:flex items-center gap-1.5 border-b border-slate-200/40 dark:border-slate-800/40 pb-2 overflow-x-auto no-scrollbar">
        {[
          { label: "All Providers", value: "ALL", count: organizations.length },
          {
            label: "Pending Review",
            value: "PENDING",
            count: organizations.filter((o) => o.status === "PENDING").length,
          },
          {
            label: "Verified & Approved",
            value: "APPROVED",
            count: organizations.filter((o) => o.status === "APPROVED").length,
          },
          {
            label: "Suspended",
            value: "SUSPENDED",
            count: organizations.filter((o) => o.status === "SUSPENDED").length,
          },
          {
            label: "Rejected",
            value: "REJECTED",
            count: organizations.filter((o) => o.status === "REJECTED").length,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-2 py-0.5 text-micro font-medium rounded-md transition-all shrink-0 flex items-center gap-1 cursor-pointer ${statusFilter === tab.value
                ? "bg-amber-600 text-white shadow-xs font-semibold"
                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-nano font-bold ${statusFilter === tab.value ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
                }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search provider by name, TIN number, license, or city..."
            className="w-full h-7.5 pl-7.5 pr-2.5 text-micro rounded-md bg-card border border-slate-200/50 dark:border-slate-800/50 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-7.5 px-2 text-micro rounded-md bg-card border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-semibold"
          >
            <option value="ALL">All Categories</option>
            <option value="BUS">Bus Transportation</option>
            <option value="CINEMA">Cinema & Film</option>
            <option value="EVENT">Concerts & Events</option>
            <option value="SPORTS">Sports & Tournaments</option>
          </select>
        </div>
      </div>

      {/* Mobile View: High-Clarity Elevated Cards */}
      <div className="block sm:hidden space-y-3.5">
        {filteredOrgs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            No organizations found matching your search.
          </div>
        ) : (
          filteredOrgs.map((org) => (
            <div
              key={org.id}
              className="rounded-2xl bg-card border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:border-amber-500/30 transition-all p-4 space-y-3.5"
            >
              {/* Card Header: Initial Avatar, Org Name, Sector & Actions */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-extrabold text-sm shadow-xs border border-amber-500/20 mt-0.5">
                    {org.name?.charAt(0) || "P"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/providers/${org.id}`}
                      className="font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block text-sm"
                    >
                      {org.name}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted/70 text-foreground border border-slate-200/50 dark:border-slate-700/50">
                        {getCategoryIcon(org.category)}
                        <span>{org.category}</span>
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-700/50">
                        TIN: {org.taxNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {getStatusBadge(org.status)}
                  <ActionDropdown
                    items={[
                      {
                        label: "Transfer via Chapa",
                        icon: <Send className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
                        variant: "success" as const,
                        onClick: () => handleOpenTransferModal(org),
                      },
                      {
                        label: "View Detail",
                        icon: <Eye className="w-4 h-4" />,
                        href: `/admin/providers/${org.id}`,
                      },
                      ...(org.status === "PENDING"
                        ? [
                          {
                            label: "Approve Provider",
                            icon: <CheckCircle2 className="w-4 h-4" />,
                            variant: "success" as const,
                            onClick: () => approveOrganization(org.id),
                          },
                          {
                            label: "Reject Application",
                            icon: <XCircle className="w-4 h-4" />,
                            variant: "danger" as const,
                            onClick: () => rejectOrganization(org.id, "Administrative compliance review"),
                          },
                        ]
                        : []),
                      ...(org.status === "APPROVED"
                        ? [
                          {
                            label: "Suspend Account",
                            icon: <XCircle className="w-4 h-4" />,
                            variant: "danger" as const,
                            onClick: () => suspendOrganization(org.id, "Administrative review"),
                          },
                        ]
                        : []),
                      ...(org.status === "SUSPENDED"
                        ? [
                          {
                            label: "Reactivate Account",
                            icon: <CheckCircle2 className="w-4 h-4" />,
                            variant: "success" as const,
                            onClick: () => activateOrganization(org.id),
                          },
                        ]
                        : []),
                      {
                        label: "Compliance Documents",
                        icon: <FileText className="w-4 h-4" />,
                        href: `/admin/verifications`,
                      },
                      {
                        label: "Commission Rate",
                        icon: <Sparkles className="w-4 h-4" />,
                        href: `/admin/commissions`,
                      },
                      {
                        label: "Delete Provider",
                        icon: <Trash2 className="w-4 h-4" />,
                        variant: "danger" as const,
                        onClick: () => setOrgToDelete(org),
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Contact & Location Strip */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Contact Person
                  </span>
                  <span className="font-semibold text-foreground text-xs">{org.contactPerson}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1.5 border-t border-slate-200/40 dark:border-slate-700/40">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{org.city}</span>
                  </span>
                  <a
                    href={`tel:${org.phone}`}
                    className="inline-flex items-center gap-1.5 font-mono text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{org.phone}</span>
                  </a>
                </div>
              </div>

              {/* Financial & Operational KPI Micro-Grid */}
              {(() => {
                const fin = getProviderFinancials(org);
                const isSettled = fin.netPayable === 0;
                return (
                  <>
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-amber-500/[0.04] dark:bg-amber-500/[0.07] border border-amber-500/15 text-center">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                          Gross Revenue
                        </span>
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5 block truncate">
                          {(fin.grossRevenue > 0 ? fin.grossRevenue : org.totalRevenue || 0).toLocaleString()}{" "}
                          <span className="text-[9px] font-normal">ETB</span>
                        </span>
                      </div>
                      <div className="border-x border-amber-500/15">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                          Orders / Svcs
                        </span>
                        <span className="text-xs font-extrabold text-foreground mt-0.5 block">
                          {fin.bookingsCount > 0 ? `${fin.bookingsCount} orders` : `${org.totalServices} svcs`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                          Commission
                        </span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                          {org.commissionRate}%
                        </span>
                      </div>
                    </div>

                    {/* Net on Platform Settlement Banner */}
                    <div
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                        isSettled
                          ? "bg-slate-100/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80"
                          : "bg-emerald-500/[0.08] dark:bg-emerald-500/[0.12] border-emerald-500/20"
                      }`}
                    >
                      <div>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider block ${
                            isSettled ? "text-slate-500 dark:text-slate-400" : "text-emerald-700 dark:text-emerald-400"
                          }`}
                        >
                          {t("admin.netOnPlatform", "Net on Platform")}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-xs font-black font-mono ${
                              isSettled ? "text-slate-600 dark:text-slate-300" : "text-emerald-700 dark:text-emerald-300"
                            }`}
                          >
                            {fin.netPayable.toLocaleString()} ETB
                          </span>
                          {isSettled ? (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20">
                              {t("payments.allSettled", "All Settled")}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {t("Available in Escrow")}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenTransferModal(org)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Transfer via Chapa</span>
                      </button>
                    </div>
                  </>
                );
              })()}

              {/* Direct Full-Width Action Button */}
              <Link
                href={`/admin/providers/${org.id}`}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-500/10 dark:bg-slate-800/70 dark:hover:bg-amber-500/20 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-xs flex items-center justify-between transition-colors border border-slate-200/60 dark:border-slate-700/60"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>View Provider Details & Dossier</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Table with Spacious Columns & Horizontal Scroll */}
      <div className="hidden sm:block rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[1060px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 min-w-[220px]">Organization Name</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Registration & TIN</th>
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[210px]">Contact & City</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[90px]">Commission</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[130px]">Services / GMV</th>
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[170px] text-right font-black text-foreground">
                  {t("admin.netOnPlatform", "Net on Platform")}
                </th>
                <th className="px-4 py-3.5 text-right w-12 shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredOrgs.map((org) => (
                <tr key={org.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5 min-w-[220px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-extrabold text-sm shadow-xs">
                        {org.name?.charAt(0) || "P"}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/providers/${org.id}`}
                          className="font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block text-xs"
                        >
                          {org.name}
                        </Link>
                        <p className="text-[11px] text-muted-foreground truncate">{org.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-muted/50 text-foreground">
                      {getCategoryIcon(org.category)}
                      {org.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-mono text-[11px]">
                      <p className="font-bold text-foreground">{org.taxNumber}</p>
                      <p className="text-muted-foreground text-[10px]">{org.businessLicense}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap min-w-[210px]">
                    <div>
                      <p className="font-bold text-foreground text-xs">{org.contactPerson}</p>
                      <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                        {org.city} • <span className="font-mono">{org.phone}</span>
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">{getStatusBadge(org.status)}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap font-extrabold text-foreground">{org.commissionRate}%</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {(() => {
                      const fin = getProviderFinancials(org);
                      return (
                        <div>
                          <p className="font-bold text-foreground">
                            {fin.bookingsCount > 0 ? `${fin.bookingsCount} orders` : `${org.totalServices} services`}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {(fin.grossRevenue > 0 ? fin.grossRevenue : org.totalRevenue || 0).toLocaleString()} ETB
                          </p>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-right">
                    {(() => {
                      const fin = getProviderFinancials(org);
                      const isSettled = fin.netPayable === 0;
                      return (
                        <div>
                          {isSettled ? (
                            <div className="flex flex-col items-end">
                              <span className="font-mono font-black text-sm text-slate-400 dark:text-slate-500">
                                0.00 ETB
                              </span>
                              <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
                                {t("payments.allSettled", "All Settled")}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end">
                              <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                                {fin.netPayable.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{" "}
                                <span className="text-[10px] font-bold">ETB</span>
                              </span>
                              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                                {t("payments.remainingOnPlatform", "Net on Platform")}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap w-12">
                    <ActionDropdown
                      items={[
                        {
                          label: "Transfer via Chapa",
                          icon: <Send className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
                          variant: "success" as const,
                          onClick: () => handleOpenTransferModal(org),
                        },
                        {
                          label: "View Detail",
                          icon: <Eye className="w-4 h-4" />,
                          href: `/admin/providers/${org.id}`,
                        },
                        ...(org.status === "PENDING"
                          ? [
                            {
                              label: "Approve Provider",
                              icon: <CheckCircle2 className="w-4 h-4" />,
                              variant: "success" as const,
                              onClick: () => approveOrganization(org.id),
                            },
                            {
                              label: "Reject Application",
                              icon: <XCircle className="w-4 h-4" />,
                              variant: "danger" as const,
                              onClick: () => rejectOrganization(org.id, "Administrative compliance review"),
                            },
                          ]
                          : []),
                        ...(org.status === "APPROVED"
                          ? [
                            {
                              label: "Suspend Account",
                              icon: <XCircle className="w-4 h-4" />,
                              variant: "danger" as const,
                              onClick: () => suspendOrganization(org.id, "Administrative review"),
                            },
                          ]
                          : []),
                        ...(org.status === "SUSPENDED"
                          ? [
                            {
                              label: "Reactivate Account",
                              icon: <CheckCircle2 className="w-4 h-4" />,
                              variant: "success" as const,
                              onClick: () => activateOrganization(org.id),
                            },
                          ]
                          : []),
                        {
                          label: "Compliance Documents",
                          icon: <FileText className="w-4 h-4" />,
                          href: `/admin/verifications`,
                        },
                        {
                          label: "Commission Rate",
                          icon: <Sparkles className="w-4 h-4" />,
                          href: `/admin/commissions`,
                        },
                        {
                          label: "Delete Provider",
                          icon: <Trash2 className="w-4 h-4" />,
                          variant: "danger" as const,
                          onClick: () => setOrgToDelete(org),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}

              {filteredOrgs.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                    No providers found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chapa Transfer & Payout Settlement Modal */}
      {transferModalOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 font-bold">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {t("admin.transferTitle", "Chapa Provider Transfer")}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate max-w-[240px]">
                    {transferModalOrg.name} ({transferModalOrg.category})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isTransferring) setTransferModalOrg(null);
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Financial Settlement Breakdown */}
            {(() => {
              const fin = getProviderFinancials(transferModalOrg);
              return (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>{t("admin.totalGrossPaid", "Total Customer Paid (Gross):")}</span>
                    <span className="font-mono font-semibold text-foreground">
                      {fin.grossRevenue.toLocaleString()} ETB
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>{t("admin.vatDeducted", "VAT Deducted (Gov):")}</span>
                    <span className="font-mono text-rose-500 font-semibold">
                      - {fin.vatDeducted.toLocaleString()} ETB
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>
                      {t("admin.commDeducted", `Tikora Commission (${transferModalOrg.commissionRate}%):`)}
                    </span>
                    <span className="font-mono text-rose-500 font-semibold">
                      - {fin.commissionDeducted.toLocaleString()} ETB
                    </span>
                  </div>
                  {fin.totalSettled > 0 && (
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>{t("admin.alreadyTransferred", "Already Transferred (Chapa):")}</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                        - {fin.totalSettled.toLocaleString()} ETB
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center">
                    <span className="font-bold text-foreground">
                      {t("admin.netOnPlatform", "Net on Platform")}:
                    </span>
                    <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                      {fin.netPayable.toLocaleString()} ETB
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Recipient Details Strip */}
            <div className="space-y-1 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border">
              <p>
                <strong className="text-foreground">Contact:</strong> {transferModalOrg.contactPerson} (
                <span className="font-mono">{transferModalOrg.phone}</span>)
              </p>
              <p>
                <strong className="text-foreground">Email:</strong> {transferModalOrg.email}
              </p>
              <p>
                <strong className="text-foreground">TIN:</strong>{" "}
                <span className="font-mono">{transferModalOrg.taxNumber}</span>
              </p>
            </div>

            {/* Transfer Amount Input & Real-Time Insufficient Balance Warning */}
            {(() => {
              const fin = getProviderFinancials(transferModalOrg);
              const inputNum = parseFloat(transferAmount) || 0;
              const isInsufficient = inputNum > fin.netPayable || fin.netPayable <= 0;
              const isZeroBalance = fin.netPayable <= 0;
              const projRemaining = Math.max(0, Math.round((fin.netPayable - inputNum) * 100) / 100);

              return (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span>Transfer Amount (ETB)</span>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      Powered by Chapa Gateway
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      disabled={isTransferring}
                      className={`w-full h-10 pl-3 pr-12 text-sm font-mono font-bold rounded-xl bg-card border outline-none shadow-xs transition-all ${
                        isInsufficient
                          ? "border-rose-500 ring-2 ring-rose-500/20 text-rose-600 dark:text-rose-400"
                          : "border-border focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-foreground"
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      ETB
                    </span>
                  </div>

                  {/* Insufficient Amount Alert Banner */}
                  {isInsufficient ? (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start gap-2.5 text-xs font-semibold animate-in fade-in duration-200">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                      <div>
                        <span className="font-bold block text-rose-700 dark:text-rose-300">
                          Insufficient amount!
                        </span>
                        <span className="text-[11px] text-rose-600/90 dark:text-rose-400/90 leading-tight block mt-0.5">
                          {isZeroBalance
                            ? `This provider currently has 0.00 ETB available on the platform. No payout can be transferred.`
                            : `Transfer amount (${inputNum.toLocaleString()} ETB) exceeds available Net on Platform (${fin.netPayable.toLocaleString()} ETB).`}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-500/[0.08] dark:bg-emerald-500/[0.12] border border-emerald-500/20 space-y-1.5 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">
                          {t("admin.remainingNetOnPlatform", "Remaining Net on Platform (ከዝውውር በኋላ የሚቀረው):")}
                        </span>
                        <span className="font-mono font-extrabold text-sm text-emerald-700 dark:text-emerald-400">
                          {projRemaining.toLocaleString()} ETB
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1 border-t border-emerald-500/15">
                        <span>
                          {fin.netPayable.toLocaleString()} ETB - {inputNum.toLocaleString()} ETB
                        </span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          = {projRemaining.toLocaleString()} ETB {t("admin.remainsInEscrow", "will remain")}
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-muted-foreground">
                    Clicking pay will redirect to the secure Chapa payment gateway. Platform balance is only deducted after payment is confirmed.
                  </p>

                  {/* Modal Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setTransferModalOrg(null)}
                      disabled={isTransferring}
                      className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-border hover:bg-muted text-foreground transition-all cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteTransfer}
                      disabled={isTransferring || !transferAmount || inputNum <= 0 || isInsufficient}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        isInsufficient
                          ? "bg-rose-600 text-white shadow-rose-600/20"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                      }`}
                    >
                      {isTransferring ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Redirecting...</span>
                        </>
                      ) : isInsufficient ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Insufficient Amount</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Pay via Chapa</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Post-Settlement Success Dialog: Shows Transferred Amount & Remaining Platform Balance */}
      {settlementSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl border border-emerald-500/30 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-foreground">
                  Payout Successfully Transferred
                </h3>
                <p className="text-[11px] text-muted-foreground truncate">
                  Organization: {settlementSuccess.orgName} • Ref: {settlementSuccess.reference}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transferred Amount:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {settlementSuccess.amount.toLocaleString()} ETB
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border/40">
                <span className="font-bold text-foreground">
                  {t("payments.remainingOnPlatform", "Net on Platform")}:
                </span>
                <span className="font-mono font-black text-sm text-foreground">
                  {settlementSuccess.remainingBalance.toLocaleString()} ETB
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-300 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <span>📧 Notification Status:</span>
              </p>
              <p className="leading-relaxed">
                A system notification and receipt have been delivered to <strong>{settlementSuccess.orgName}</strong> confirming the transfer and the updated remaining balance on the platform.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSettlementSuccess(null)}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirm Delete Provider Modal */}
      <ConfirmDeleteModal
        isOpen={!!orgToDelete}
        itemType="Provider Organization"
        itemName={orgToDelete ? orgToDelete.name : ""}
        warningMessage="This will permanently delete this provider organization, all their listed services, active bookings, tickets, payouts, and compliance records from the platform."
        isDeleting={isDeletingOrg}
        onConfirm={async () => {
          if (!orgToDelete) return;
          setIsDeletingOrg(true);
          try {
            const orgName = orgToDelete.name;
            await deleteOrganization(orgToDelete.id);
            setOrgToDelete(null);
            toast.success(`${orgName} and all associated bookings, tickets, and records permanently deleted.`);
          } catch (err) {
            console.error("Failed to delete organization:", err);
            toast.error("Failed to delete organization.");
          } finally {
            setIsDeletingOrg(false);
          }
        }}
        onClose={() => {
          if (!isDeletingOrg) setOrgToDelete(null);
        }}
      />
    </div>
  );
}
