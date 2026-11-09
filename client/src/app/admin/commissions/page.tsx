"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Percent,
  DollarSign,
  TrendingUp,
  Building2,
  Bus,
  Film,
  Calendar,
  Trophy,
  Save,
  Edit,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function AdminCommissionsPage() {
  const { categories, organizations, bookings, settings, updateSettings, updateCategoryCommission, fetchPlatformData, isLoading } =
    useAdminStore();

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  const [defaultRate, setDefaultRate] = useState(settings.defaultCommissionRate);
  const [editingDefault, setEditingDefault] = useState(false);

  const handleSaveDefault = () => {
    updateSettings({ defaultCommissionRate: Number(defaultRate) });
    setEditingDefault(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BUS":
        return <Bus className="w-4 h-4 text-amber-600" />;
      case "CINEMA":
        return <Film className="w-4 h-4 text-amber-600" />;
      case "SPORTS":
        return <Trophy className="w-4 h-4 text-amber-600" />;
      default:
        return <Calendar className="w-4 h-4 text-amber-600" />;
    }
  };

  // Live commission transactions split from confirmed platform bookings
  // Step 1: Customer Paid (Gross Fare)
  // Step 2: VAT is deducted first -> Pre-Tax Base Fare = Customer Paid - VAT
  // Step 3: Platform Commission is deducted from Pre-Tax Base Fare -> Platform Commission = Pre-Tax Base * Commission%
  // Step 4: Provider Net = (Customer Paid - VAT) - Platform Commission
  // Point-in-time snapshot integrity: Historical transactions preserve their exact rates at time of booking
  const commissionTransactions = bookings.map((b) => {
    const customerPaid = Number(b.customerPaid ?? b.totalAmount) || 0;
    const vatRate = Number(b.vatRate ?? settings.vatTaxRate ?? 5.0);

    let vatAmount = Number(b.vatAmount);
    if (!vatAmount && customerPaid > 0) {
      if (b.subtotal && b.subtotal < customerPaid) {
        vatAmount = Math.round((customerPaid - b.subtotal) * 100) / 100;
      } else {
        const computedBase = Math.round((customerPaid / (1 + vatRate / 100)) * 100) / 100;
        vatAmount = Math.max(0, Math.round((customerPaid - computedBase) * 100) / 100);
      }
    }

    const preTaxBase = Math.max(0, Math.round((customerPaid - vatAmount) * 100) / 100);

    const catObj = categories.find((c) => c.category === b.category);
    let defaultCatRate = settings.defaultCommissionRate ?? 5.0;
    if (b.category === "BUS") defaultCatRate = settings.busCommissionRate ?? defaultCatRate;
    else if (b.category === "CINEMA") defaultCatRate = settings.cinemaCommissionRate ?? defaultCatRate;
    else if (b.category === "EVENT") defaultCatRate = settings.eventCommissionRate ?? defaultCatRate;
    else if (b.category === "SPORTS") defaultCatRate = settings.sportsCommissionRate ?? defaultCatRate;

    const commissionRate = Number(b.commissionRate ?? catObj?.commissionRate ?? defaultCatRate);

    const platformFee = Number(b.platformFee ?? Math.round(preTaxBase * (commissionRate / 100) * 100) / 100);
    const providerNet = Number(b.providerNet ?? b.providerPayout ?? Math.max(0, Math.round((preTaxBase - platformFee) * 100) / 100));

    return {
      id: `tx-${b.id}`,
      bookingRef: b.reference,
      provider: b.providerName,
      category: b.category,
      customerPaid,
      vatAmount,
      vatRate,
      preTaxBase,
      commissionRate,
      platformFee,
      providerNet,
      date: b.bookingDate,
    };
  });

  const totalGrossCustomer = commissionTransactions.reduce((acc, tx) => acc + tx.customerPaid, 0);
  const totalVatDeducted = commissionTransactions.reduce((acc, tx) => acc + tx.vatAmount, 0);
  const totalPreTaxBase = commissionTransactions.reduce((acc, tx) => acc + tx.preTaxBase, 0);
  const totalPlatformFees = commissionTransactions.reduce((acc, tx) => acc + tx.platformFee, 0);
  const totalProviderNet = commissionTransactions.reduce((acc, tx) => acc + tx.providerNet, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Platform Commission Rules & Fee Architecture
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Define baseline platform fee rates, category overrides, and provider-level negotiable terms.
          </p>
        </div>

        <Link
          href="/admin/payments"
          className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs shadow-amber-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <DollarSign className="w-4 h-4" />
          <span>Provider Disbursements</span>
        </Link>
      </div>

      {/* Global Default Banner Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              GLOBAL PLATFORM POLICY
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground">Default Platform Take-Rate</h3>
          <p className="text-xs text-muted-foreground">
            Automatically applies to all freshly verified providers unless custom terms or category overrides are set.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xs shrink-0">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Standard Take Rate</p>
            {editingDefault ? (
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="20"
                  value={defaultRate}
                  onChange={(e) => setDefaultRate(Number(e.target.value))}
                  className="w-16 h-7 px-2 text-xs rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-muted font-bold text-foreground"
                />
                <span className="text-xs font-bold">%</span>
                <button
                  onClick={handleSaveDefault}
                  className="p-1 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                >
                  <Save className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-bold text-foreground">{settings.defaultCommissionRate}%</span>
                <button
                  onClick={() => setEditingDefault(true)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Specific Overrides Grid */}
      <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm text-foreground">Category-Wide Commission Rates</h3>
          <p className="text-xs text-muted-foreground">Standard rate configured per industry sector</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 space-y-1.5 sm:space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10">
                  {getCategoryIcon(cat.category)}
                </div>
                <div>
                  <p className="font-bold text-xs text-foreground">{cat.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">/{cat.slug}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Commission Rate</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {cat.commissionRate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Commission Settlement Audit */}
      <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-5">
        <div>
          <h3 className="font-bold text-sm text-foreground">Live Commission Split Ledger</h3>
          <p className="text-xs text-muted-foreground">
            Auditing customer gross payments, statutory VAT deduction, platform commission, and net provider payouts in real-time.
          </p>
        </div>

        {/* 5-Card High-Level Financial Breakdown Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Customer Paid
            </span>
            <span className="text-sm sm:text-base font-black text-foreground font-mono mt-1 block truncate">
              {totalGrossCustomer.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">ETB</span>
            </span>
            <span className="text-[10px] text-muted-foreground">Gross Collected</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-500/[0.05] border border-rose-500/20 text-center">
            <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider block">
              VAT Deducted ({settings.vatTaxRate ?? 5}%)
            </span>
            <span className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400 font-mono mt-1 block truncate">
              -{totalVatDeducted.toLocaleString()} <span className="text-[10px] font-normal opacity-70">ETB</span>
            </span>
            <span className="text-[10px] text-rose-600/70 dark:text-rose-400/70">Statutory Tax</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider block">
              Pre-Tax Fare
            </span>
            <span className="text-sm sm:text-base font-black text-amber-700 dark:text-amber-400 font-mono mt-1 block truncate">
              {totalPreTaxBase.toLocaleString()} <span className="text-[10px] font-normal opacity-70">ETB</span>
            </span>
            <span className="text-[10px] text-muted-foreground">Customer - VAT</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider block">
              Platform Fee
            </span>
            <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block truncate">
              +{totalPlatformFees.toLocaleString()} <span className="text-[10px] font-normal opacity-70">ETB</span>
            </span>
            <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">Platform Revenue</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-500/[0.05] border border-blue-500/20 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider block">
              Provider Net
            </span>
            <span className="text-sm sm:text-base font-black text-blue-600 dark:text-blue-400 font-mono mt-1 block truncate">
              {totalProviderNet.toLocaleString()} <span className="text-[10px] font-normal opacity-70">ETB</span>
            </span>
            <span className="text-[10px] text-blue-600/70 dark:text-blue-400/70">Total Disbursable</span>
          </div>
        </div>

        {/* Mobile View: Commission Split Cards */}
        <div className="block sm:hidden space-y-3">
          {commissionTransactions.length === 0 ? (
            <div className="py-12 px-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6">
              <Percent className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="font-semibold text-foreground">No commission transactions yet</p>
              <p className="text-[11px] mt-0.5">Platform commission splits will appear here once bookings are confirmed.</p>
            </div>
          ) : (
            commissionTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-muted/20 border border-slate-200/50 dark:border-slate-800/50 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                      {tx.bookingRef}
                    </span>
                    <p className="font-semibold text-xs text-foreground mt-0.5">{tx.provider}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-muted text-foreground">
                    {tx.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-card border border-slate-200/40 dark:border-slate-800/40 text-center">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block">Customer Paid</span>
                    <span className="text-xs font-black text-foreground font-mono mt-0.5 block truncate">
                      {tx.customerPaid.toLocaleString()} ETB
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-rose-600 dark:text-rose-400 block">VAT ({tx.vatRate}%)</span>
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5 block truncate">
                      -{tx.vatAmount.toLocaleString()} ETB
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">TIKORA Fee ({tx.commissionRate}%)</span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block truncate">
                      +{tx.platformFee.toLocaleString()} ETB
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-blue-600 dark:text-blue-400 block">Provider Net</span>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5 block truncate">
                      {tx.providerNet.toLocaleString()} ETB
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-slate-200/30 dark:border-slate-800/30">
                  <span>Pre-Tax Fare: {tx.preTaxBase.toLocaleString()} ETB</span>
                  <span>{tx.date}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table with VAT, Commission %, and Provider Net */}
        <div className="hidden sm:block overflow-x-auto -mx-6 -mb-6">
          <table className="w-full text-xs text-left min-w-[1100px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[130px]">Booking Ref</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Provider Operator</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[80px]">Sector</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[120px] text-right">Customer Paid</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px] text-right">VAT Deducted</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[120px] text-right">Pre-Tax Base</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[120px] text-right">Platform Fee</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[130px] text-right">Provider Net</th>
                <th className="px-4 py-3.5 font-mono whitespace-nowrap min-w-[100px] text-center">Settlement Date</th>
                <th className="px-5 py-3.5 text-right w-12 shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {commissionTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-xs text-muted-foreground">
                    <Percent className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="font-semibold text-foreground">No commission transactions yet</p>
                    <p className="text-[11px] mt-0.5">Platform commission splits will appear here once bookings are confirmed.</p>
                  </td>
                </tr>
              ) : (
                commissionTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      {tx.bookingRef}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-foreground whitespace-nowrap">
                      {tx.provider}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-muted text-foreground">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-foreground text-right whitespace-nowrap">
                      {tx.customerPaid.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">ETB</span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <span className="font-bold text-rose-600 dark:text-rose-400">
                        -{tx.vatAmount.toLocaleString()} ETB
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground block">
                        {tx.vatRate}% VAT
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-700 dark:text-slate-300 text-right whitespace-nowrap">
                      {tx.preTaxBase.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">ETB</span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        +{tx.platformFee.toLocaleString()} ETB
                      </span>
                      <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 block">
                        {tx.commissionRate}% Take
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <span className="font-black text-blue-600 dark:text-blue-400 text-xs">
                        {tx.providerNet.toLocaleString()} ETB
                      </span>
                      <span className="text-[9px] text-muted-foreground block font-mono">
                        Disbursable
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground text-center whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap w-12">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          items={[
                            {
                              label: "Inspect Booking",
                              icon: <Eye className="w-3.5 h-3.5" />,
                              href: `/admin/bookings`,
                            },
                            {
                              label: "Provider Account",
                              icon: <Building2 className="w-3.5 h-3.5" />,
                              href: `/admin/providers?q=${encodeURIComponent(tx.provider)}`,
                            },
                            {
                              label: "Copy Reference",
                              icon: <Copy className="w-3.5 h-3.5" />,
                              onClick: () => {
                                navigator.clipboard.writeText(tx.bookingRef);
                                toast.success("Booking reference copied");
                              },
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
