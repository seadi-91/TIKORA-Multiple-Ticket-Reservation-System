"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderTree,
  Bus,
  Film,
  Calendar,
  Trophy,
  CheckCircle2,
  XCircle,
  Percent,
  Building2,
  Ticket,
  Save,
  Edit,
  ArrowRight,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";

export default function AdminCategoriesPage() {
  const { categories, updateCategoryCommission, toggleCategoryActive } = useAdminStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [rateInput, setRateInput] = useState<number>(5.0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BUS":
        return <Bus className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "CINEMA":
        return <Film className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "SPORTS":
        return <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const handleStartEdit = (catId: string, currentRate: number) => {
    setEditingId(catId);
    setRateInput(currentRate);
  };

  const handleSaveRate = (catId: string) => {
    updateCategoryCommission(catId, rateInput);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Platform Categories & Sector Commissions
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure sector-wide commission percentages, operational availability, and category descriptions.
          </p>
        </div>

        <Link
          href="/admin/commissions"
          className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs shadow-amber-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Percent className="w-4 h-4" />
          <span>Commission Rules & Tiers</span>
        </Link>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {getCategoryIcon(cat.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">{cat.name}</h3>
                    <p className="text-[11px] font-mono text-muted-foreground">slug: /{cat.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCategoryActive(cat.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                      cat.isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                    }`}
                  >
                    {cat.isActive ? "ACTIVE" : "DISABLED"}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{cat.description}</p>
            </div>

            {/* Metrics & Commission Controller */}
            <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40 grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Providers</p>
                <p className="font-bold text-sm text-foreground mt-0.5">{cat.totalProviders}</p>
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Bookings</p>
                <p className="font-bold text-sm text-foreground mt-0.5">{cat.totalBookings.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Commission</p>
                {editingId === cat.id ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="30"
                      value={rateInput}
                      onChange={(e) => setRateInput(Number(e.target.value))}
                      className="w-16 h-7 px-2 text-xs rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-muted/60 font-bold"
                    />
                    <button
                      onClick={() => handleSaveRate(cat.id)}
                      className="p-1 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-bold text-sm text-amber-600 dark:text-amber-400">
                      {cat.commissionRate}%
                    </span>
                    <button
                      onClick={() => handleStartEdit(cat.id, cat.commissionRate)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
