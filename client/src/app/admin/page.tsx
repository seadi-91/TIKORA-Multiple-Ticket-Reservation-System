"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Building2,
  Users,
  ShieldCheck,
  Ticket,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Percent,
  CreditCard,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Activity,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminStore } from "@/stores/admin.store";
import { useLanguage } from "@/providers/language-provider";
import { DashboardLineChart } from "@/components/charts/line-chart";
import { DashboardBarChart } from "@/components/charts/bar-chart";
import { DashboardPieChart } from "@/components/charts/pie-chart";

export default function AdminDashboardPage() {
  const {
    organizations,
    auditLogs,
    bookings,
    categories,
    users,
    inspectors,
    refunds,
    approveOrganization,
    fetchPlatformData,
    isLoading,
  } = useAdminStore();
  const { t, formatCurrencyWithLang } = useLanguage();

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  const [revenueRange, setRevenueRange] = useState<"6M" | "30D" | "7D">("6M");

  const pendingOrgs = useMemo(
    () => organizations.filter((o) => o.status === "PENDING"),
    [organizations]
  );
  const approvedOrgs = useMemo(
    () => organizations.filter((o) => o.status === "APPROVED"),
    [organizations]
  );

  // Dynamic calculations from actual store data
  const totalGMV = useMemo(() => {
    return bookings.reduce((sum, b) => sum + (Number((b as any).customerPaid ?? b.totalAmount) || 0), 0);
  }, [bookings]);

  const platformRevenue = useMemo(() => {
    return bookings.reduce((sum, b) => sum + (Number(b.platformFee) || 0), 0);
  }, [bookings]);

  const totalBookingsCount = bookings.length;
  const activeProvidersCount = approvedOrgs.length;
  const pendingOrgsCount = pendingOrgs.length;
  const totalUsersCount = users.length;
  const activeInspectorsCount = useMemo(
    () => inspectors.filter((i) => i.status === "ACTIVE").length,
    [inspectors]
  );
  const refundsRequestedCount = useMemo(
    () => refunds.filter((r) => r.status === "PENDING").length,
    [refunds]
  );

  const averageMargin = totalGMV > 0 ? ((platformRevenue / totalGMV) * 100).toFixed(1) : "0.0";
  const activeCategoriesCount = useMemo(
    () => categories.filter((c) => c.isActive).length,
    [categories]
  );

  // Dynamic Chart Data: Revenue Trajectory derived from real bookings
  const revenueHistory = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();

    if (revenueRange === "7D") {
      const days: { name: string; value: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
        const dayVal = bookings
          .filter((b) => b.bookingDate && b.bookingDate.startsWith(dateStr))
          .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
        days.push({ name: dayLabel, value: dayVal });
      }
      return days;
    }

    if (revenueRange === "30D") {
      const points: { name: string; value: number }[] = [];
      for (let i = 4; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i * 6);
        const label = `${d.getDate()} ${monthNames[d.getMonth()]}`;
        const start = new Date(now.getTime() - (i + 1) * 6 * 24 * 60 * 60 * 1000);
        const end = new Date(now.getTime() - i * 6 * 24 * 60 * 60 * 1000);
        const val = bookings
          .filter((b) => {
            if (!b.bookingDate) return false;
            const bDate = new Date(b.bookingDate);
            return bDate >= start && bDate <= end;
          })
          .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
        points.push({ name: label, value: val });
      }
      return points;
    }

    // Default: 6 Months
    const months: { name: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = monthNames[d.getMonth()];
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthVal = bookings
        .filter((b) => b.bookingDate && b.bookingDate.startsWith(yearMonth))
        .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
      months.push({ name: monthLabel, value: monthVal });
    }
    return months;
  }, [bookings, revenueRange]);

  // Dynamic Sector Revenue & Retained Commission breakdown
  const categoryRevenue = useMemo(() => {
    const categoryConfigs = [
      { key: "BUS", name: "Bus Transport" },
      { key: "CINEMA", name: "Cinema & Film" },
      { key: "EVENT", name: "Concerts/Events" },
      { key: "SPORTS", name: "Sports Fixtures" },
    ];

    return categoryConfigs.map((cfg) => {
      const catBookings = bookings.filter((b) => b.category === cfg.key);
      const value = catBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
      const secondaryValue = catBookings.reduce((sum, b) => sum + (Number(b.platformFee) || 0), 0);

      return {
        name: cfg.name,
        value,
        secondaryValue,
      };
    });
  }, [bookings]);

  // Dynamic Category Volume Share
  const categoryPieData = useMemo(() => {
    const categoryConfigs = [
      { key: "BUS", name: "Bus Transport", color: "#B45309" },
      { key: "CINEMA", name: "Cinema", color: "#D97706" },
      { key: "EVENT", name: "Concerts/Events", color: "#F59E0B" },
      { key: "SPORTS", name: "Sports", color: "#FBBF24" },
    ];

    return categoryConfigs.map((cfg) => {
      const catTotal = bookings
        .filter((b) => b.category === cfg.key)
        .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
      const percentage = totalGMV > 0 ? Number(((catTotal / totalGMV) * 100).toFixed(1)) : 0;

      return {
        name: cfg.name,
        value: percentage,
        color: cfg.color,
      };
    });
  }, [bookings, totalGMV]);

  return (
    <div className="space-y-6">
      {/* Top Welcome & System Status Bar */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/[0.04] to-card border border-amber-500/15 p-4 sm:p-5 shadow-xs">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-36 h-36 bg-amber-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20">
                <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>{t("ROOT COMMAND CONSOLE", "ROOT COMMAND CONSOLE")}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t("Network Online", "Network Online")}
              </span>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-foreground">
              {t("Platform Master Overview", "Platform Master Overview")}
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {t(
                "Unified control center for ticket inventories, organization compliance, live reservations, and financial settlements across Ethiopia.",
                "Unified control center for ticket inventories, organization compliance, live reservations, and financial settlements across Ethiopia."
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={async () => {
                await fetchPlatformData();
                toast.success("Synchronized with PostgreSQL database & live ledger.");
              }}
              disabled={isLoading}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-card hover:bg-muted text-foreground transition-all shadow-xs flex items-center gap-1.5 border border-slate-200/50 dark:border-slate-800/50 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-600" : "text-amber-600 dark:text-amber-400"}`} />
              <span>{isLoading ? t("Syncing...", "Syncing...") : t("Sync DB", "Sync DB")}</span>
            </button>
            <Link
              href="/admin/providers"
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-card/90 hover:bg-card text-foreground transition-all shadow-xs flex items-center gap-2 border border-slate-200/50 dark:border-slate-800/50"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t("Providers", "Providers")} ({organizations.length})</span>
            </Link>
            <Link
              href="/admin/verifications"
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs shadow-amber-600/20 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>{t("Verification Queue", "Verification Queue")} ({pendingOrgsCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 8 Primary KPI Metric Cards - Multiple Column Display (4 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Gross GMV */}
        <div className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase truncate">{t("Gross GMV", "Gross GMV")}</span>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500/20 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-foreground truncate">
            {totalGMV.toLocaleString()} <span className="text-[10px] font-semibold text-muted-foreground">{t("common.etb", "ETB")}</span>
          </p>
          <div className="flex items-center gap-1 mt-1 text-[10px]">
            <span className="text-muted-foreground text-[10px] truncate">{t("Cumulative transaction volume", "Cumulative transaction volume")}</span>
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase truncate">{t("Net Commission", "Net Commission")}</span>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-foreground truncate">
            {platformRevenue.toLocaleString()} <span className="text-[10px] font-semibold text-muted-foreground">{t("common.etb", "ETB")}</span>
          </p>
          <div className="flex items-center gap-1 mt-1 text-[10px]">
            <span className="text-muted-foreground text-[10px] truncate">{averageMargin}% {t("platform take rate", "platform take rate")}</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase truncate">{t("Total Bookings", "Total Bookings")}</span>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500/20 to-blue-500/5 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Ticket className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-foreground truncate">
            {totalBookingsCount.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1 text-[10px]">
            <span className="text-muted-foreground text-[10px] truncate">{activeCategoriesCount} {t("active sectors", "active sectors")}</span>
          </div>
        </div>

        {/* Active Providers */}
        <div className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase truncate">{t("Active Providers", "Active Providers")}</span>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500/20 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-foreground truncate">
            {activeProvidersCount}
          </p>
          <div className="flex items-center gap-1 mt-1 text-[10px]">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[9px]">
              <Clock className="w-2.5 h-2.5" />
              {pendingOrgsCount} {t("pending", "pending")}
            </span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase truncate">{t("Verification Queue", "Verification Queue")}</span>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500/20 to-rose-500/5 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-foreground truncate">
            {pendingOrgsCount}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1 truncate">{t("Partner applications", "Partner applications")}</p>
        </div>

        {/* Total Platform Users */}
        <div className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase truncate">{t("User Accounts", "User Accounts")}</span>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-500/20 to-violet-500/5 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-foreground truncate">
            {totalUsersCount.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1 truncate">{t("Registered accounts", "Registered accounts")}</p>
        </div>

        {/* Field Inspectors */}
        <div className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase truncate">{t("Inspectors", "Inspectors")}</span>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-cyan-500/5 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-foreground truncate">
            {activeInspectorsCount}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1 truncate">{t("Active terminal staff", "Active terminal staff")}</p>
        </div>

        {/* Refund Requests */}
        <div className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase truncate">{t("Refund Claims", "Refund Claims")}</span>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600/20 to-amber-600/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-foreground truncate">
            {refundsRequestedCount}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1 truncate">{t("Pending claims", "Pending claims")}</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GMV Trajectory Line Chart */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Platform GMV Velocity</h3>
              <p className="text-xs text-muted-foreground">Gross transaction value across all categories</p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setRevenueRange("6M")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  revenueRange === "6M" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                6M
              </button>
              <button
                onClick={() => setRevenueRange("30D")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  revenueRange === "30D" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                30D
              </button>
              <button
                onClick={() => setRevenueRange("7D")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  revenueRange === "7D" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                7D
              </button>
            </div>
          </div>

          <DashboardLineChart data={revenueHistory} valuePrefix="ETB " color="#B45309" height={240} />
        </div>

        {/* Category Share Donut Chart */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-foreground">Category Volume Share</h3>
            <p className="text-xs text-muted-foreground">Percentage split of total platform reservations</p>
          </div>

          {totalGMV > 0 ? (
            <>
              <div className="my-auto py-2">
                <DashboardPieChart data={categoryPieData} height={190} innerRadius={50} outerRadius={75} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-3">
                {categoryPieData.map((c) => (
                  <div key={c.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-muted/30">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: c.color }} />
                    <span className="text-muted-foreground truncate text-[11px]">{c.name}</span>
                    <span className="font-bold text-foreground ml-auto text-[11px]">{c.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="my-auto py-10 text-center text-muted-foreground space-y-2">
              <Layers className="w-8 h-8 mx-auto opacity-30 text-amber-500" />
              <p className="text-xs font-semibold text-foreground">No reservations yet</p>
              <p className="text-[11px] text-muted-foreground">Volume share will calculate once reservations occur.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sector Revenue Breakdown Bar Chart */}
      <div className="p-5 sm:p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-foreground">Sector Revenue & Commission Distribution</h3>
            <p className="text-xs text-muted-foreground">
              Dark amber indicates Gross Merchandise Value; light tint indicates retained platform commission.
            </p>
          </div>
          <Link
            href="/admin/commissions"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Commission Rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {totalGMV > 0 ? (
          <DashboardBarChart
            data={categoryRevenue}
            color="#B45309"
            secondaryColor="#F59E0B"
            valuePrefix="ETB "
            height={240}
          />
        ) : (
          <div className="py-12 text-center text-muted-foreground space-y-2">
            <Ticket className="w-8 h-8 mx-auto opacity-30 text-amber-500" />
            <p className="text-xs font-semibold text-foreground">No sector revenue recorded</p>
            <p className="text-[11px] text-muted-foreground">Sector GMV and platform commission will be tracked here in real-time.</p>
          </div>
        )}
      </div>

      {/* Two Column Grid: Pending Verification Queue & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Provider Approvals Queue */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Pending Provider Applications</h3>
              <p className="text-xs text-muted-foreground">Organizations waiting for verification approval</p>
            </div>
            <Link
              href="/admin/providers"
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 flex-1">
            {pendingOrgs.length > 0 ? (
              pendingOrgs.map((org) => (
                <div
                  key={org.id}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 hover:bg-amber-500/[0.04] dark:hover:bg-amber-500/[0.08] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {org.name}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {org.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      TIN: <span className="font-mono text-foreground font-semibold">{org.taxNumber}</span> • Applied: {org.appliedDate}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-sm">
                      {org.documents.length} verified compliance documents attached
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/providers/${org.id}`}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-card hover:bg-muted text-foreground transition-all shadow-xs flex items-center gap-1 border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Review</span>
                    </Link>
                    <button
                      onClick={() => approveOrganization(org.id)}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs shadow-amber-600/20 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-muted-foreground space-y-1.5">
                <CheckCircle2 className="w-9 h-9 text-emerald-500 mx-auto opacity-80" />
                <p className="text-xs font-bold text-foreground">All applications cleared!</p>
                <p className="text-[11px] text-muted-foreground">No pending provider verifications in queue.</p>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Audit Trail Stream */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Recent Security Audit Stream</h3>
              <p className="text-xs text-muted-foreground">Append-only log of authorizations and policy actions</p>
            </div>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Full audit log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[360px] pr-1 scrollbar-thin">
            {auditLogs.length > 0 ? (
              auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 hover:bg-muted/40 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-foreground truncate">{log.action.replace(/_/g, " ")}</span>
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0 bg-muted/60 px-1.5 py-0.5 rounded-md">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{log.details}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                    <span>Actor: <strong className="text-foreground">{log.actorName}</strong></span>
                    <span className="font-mono text-[10px]">{log.ipAddress}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-muted-foreground space-y-1.5">
                <ShieldCheck className="w-9 h-9 text-muted-foreground/30 mx-auto" />
                <p className="text-xs font-bold text-foreground">No security audit events recorded</p>
                <p className="text-[11px] text-muted-foreground">System authorization and policy events will appear here in real-time.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
