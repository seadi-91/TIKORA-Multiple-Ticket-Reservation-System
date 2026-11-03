"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function AdminCommissionsPage() {
  const { categories, organizations, settings, updateSettings, updateCategoryCommission } =
    useAdminStore();

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

  // Recent commission transactions mock split
  const sampleTransactions = [
    {
      id: "tx-1",
      bookingRef: "TK-BUS-9901",
      provider: "Selam Bus Line SC",
      category: "BUS",
      gross: 1300,
      rate: 5.0,
      platformFee: 65,
      providerNet: 1235,
      date: "2026-11-02 14:22",
    },
    {
      id: "tx-2",
      bookingRef: "TK-CIN-4421",
      provider: "Century Cinema Addis",
      category: "CINEMA",
      gross: 250,
      rate: 5.0,
      platformFee: 12.5,
      providerNet: 237.5,
      date: "2026-11-02 16:05",
    },
    {
      id: "tx-3",
      bookingRef: "TK-SPT-1102",
      provider: "Ethiopian Premier League (EFF)",
      category: "SPORTS",
      gross: 600,
      rate: 4.5,
      platformFee: 27,
      providerNet: 573,
      date: "2026-11-01 19:12",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 space-y-2 flex flex-col justify-between"
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
      <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm text-foreground">Live Commission Split Ledger</h3>
          <p className="text-xs text-muted-foreground">
            Auditing gross ticket collections and platform margin deduction in real-time
          </p>
        </div>

        <div className="overflow-x-auto -mx-6 -mb-6">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Booking Ref</th>
                <th className="px-4 py-3.5">Provider Name</th>
                <th className="px-4 py-3.5">Sector</th>
                <th className="px-4 py-3.5">Gross Fare</th>
                <th className="px-4 py-3.5">Commission %</th>
                <th className="px-4 py-3.5">Platform Retained</th>
                <th className="px-4 py-3.5">Provider Net</th>
                <th className="px-4 py-3.5 font-mono">Settlement Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {sampleTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-6 py-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {tx.bookingRef}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-foreground">{tx.provider}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-muted text-foreground">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-foreground">{tx.gross} ETB</td>
                  <td className="px-4 py-3.5 font-bold text-amber-600 dark:text-amber-400">{tx.rate}%</td>
                  <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                    +{tx.platformFee} ETB
                  </td>
                  <td className="px-4 py-3.5 font-bold text-foreground">{tx.providerNet} ETB</td>
                  <td className="px-4 py-3.5 font-mono text-muted-foreground">{tx.date}</td>
                  <td className="px-6 py-3.5 text-right">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
