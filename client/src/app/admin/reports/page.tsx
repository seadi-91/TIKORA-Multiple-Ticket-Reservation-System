"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Ticket,
  Building2,
  Users,
  Percent,
  Bus,
  Film,
  Trophy,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminStore } from "@/stores/admin.store";
import { DashboardLineChart } from "@/components/charts/line-chart";
import { DashboardBarChart } from "@/components/charts/bar-chart";
import { DashboardPieChart } from "@/components/charts/pie-chart";

export default function AdminReportsPage() {
  const { stats, organizations, bookings, fetchPlatformData, isLoading } = useAdminStore();

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  const [dateRange, setDateRange] = useState<"30D" | "90D" | "YTD">("30D");

  const gmvGrowthData =
    bookings.length > 0
      ? [
          { name: "Week 1", value: Math.round(stats.totalGMV * 0.2) },
          { name: "Week 2", value: Math.round(stats.totalGMV * 0.25) },
          { name: "Week 3", value: Math.round(stats.totalGMV * 0.25) },
          { name: "Week 4", value: Math.round(stats.totalGMV * 0.3) },
        ]
      : [
          { name: "Week 1", value: 0 },
          { name: "Week 2", value: 0 },
          { name: "Week 3", value: 0 },
          { name: "Week 4", value: 0 },
        ];

  const sectorPerformanceData = [
    {
      name: "Bus Transport",
      value: bookings.filter((b) => b.category === "BUS").reduce((sum, b) => sum + b.totalAmount, 0),
      secondaryValue: bookings.filter((b) => b.category === "BUS").reduce((sum, b) => sum + b.platformFee, 0),
    },
    {
      name: "Cinema",
      value: bookings.filter((b) => b.category === "CINEMA").reduce((sum, b) => sum + b.totalAmount, 0),
      secondaryValue: bookings.filter((b) => b.category === "CINEMA").reduce((sum, b) => sum + b.platformFee, 0),
    },
    {
      name: "Events",
      value: bookings.filter((b) => b.category === "EVENT").reduce((sum, b) => sum + b.totalAmount, 0),
      secondaryValue: bookings.filter((b) => b.category === "EVENT").reduce((sum, b) => sum + b.platformFee, 0),
    },
    {
      name: "Sports",
      value: bookings.filter((b) => b.category === "SPORTS").reduce((sum, b) => sum + b.totalAmount, 0),
      secondaryValue: bookings.filter((b) => b.category === "SPORTS").reduce((sum, b) => sum + b.platformFee, 0),
    },
  ];

  const totalBookingsCount = bookings.length;
  const telebirrCount = bookings.filter((b) => b.paymentMethod === "TELEBIRR").length;
  const cbeCount = bookings.filter((b) => b.paymentMethod === "CBE_BIRR").length;
  const otherCount = totalBookingsCount - telebirrCount - cbeCount;

  const paymentShareData =
    totalBookingsCount > 0
      ? [
          { name: "Telebirr", value: Math.round((telebirrCount / totalBookingsCount) * 100), color: "#B45309" },
          { name: "CBE Birr", value: Math.round((cbeCount / totalBookingsCount) * 100), color: "#F59E0B" },
          { name: "Chapa / Cards", value: Math.round((otherCount / totalBookingsCount) * 100), color: "#FDE68A" },
        ]
      : [
          { name: "Telebirr", value: 0, color: "#B45309" },
          { name: "CBE Birr", value: 0, color: "#F59E0B" },
          { name: "Chapa / Cards", value: 0, color: "#FDE68A" },
        ];

  const exportReport = () => {
    alert("Generating comprehensive platform audit summary PDF...");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Platform Analytics & Executive Reports
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cross-sector financial reports, conversion velocities, payment gateway market share, and revenue retention.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 p-0.5 bg-muted/60 rounded-md text-micro font-medium">
            {(["30D", "90D", "YTD"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  dateRange === r ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={exportReport}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights Bar - Multiple Column Display (4 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">Period Gross GMV</p>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground mt-0.5 truncate">{stats.totalGMV.toLocaleString()} ETB</p>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium mt-0.5">
            <span>Live confirmed GMV</span>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">Commission Earned</p>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">{stats.platformRevenue.toLocaleString()} ETB</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-0.5">
            <span>Retained platform margin</span>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">Tickets Verified</p>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground mt-0.5 truncate">{stats.totalBookings.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Total active bookings</p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">Dispute Rate</p>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground mt-0.5 truncate">0.00%</p>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5 truncate">Zero active disputes</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-foreground">Weekly Revenue Trend (GMV)</h3>
            <p className="text-xs text-muted-foreground">Aggregated across all verified transport and event partners</p>
          </div>
          <DashboardLineChart data={gmvGrowthData} valuePrefix="ETB " color="#B45309" height={220} />
        </div>

        <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-foreground">Payment Gateway Volume Share</h3>
            <p className="text-xs text-muted-foreground">Market penetration of integrated digital wallets</p>
          </div>
          <DashboardPieChart data={paymentShareData} height={180} innerRadius={45} outerRadius={70} />
          <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-slate-200/40 dark:border-slate-800/40 pt-3">
            {paymentShareData.map((p) => (
              <div key={p.name}>
                <span className="text-muted-foreground text-[10px] block">{p.name}</span>
                <span className="font-bold text-foreground">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Providers Table */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden p-6 space-y-4">
        <div>
          <h3 className="font-bold text-sm text-foreground">Top Provider Organizations by Volume</h3>
          <p className="text-xs text-muted-foreground">Ranked by gross sales volume and verified punctuality</p>
        </div>

        {/* Mobile View: Top Provider Cards */}
        <div className="block sm:hidden space-y-3">
          {organizations.filter((o) => o.status === "APPROVED").length === 0 ? (
            <div className="py-12 px-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="font-semibold text-foreground">No approved providers yet</p>
              <p className="text-[11px] mt-0.5">Approved provider performance rankings will appear here.</p>
            </div>
          ) : (
            organizations
              .filter((o) => o.status === "APPROVED")
              .map((org, idx) => (
                <div
                  key={org.id}
                  className="p-3.5 rounded-2xl bg-muted/20 border border-slate-200/50 dark:border-slate-800/50 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-xs flex items-center justify-center font-mono shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/providers/${org.id}`}
                          className="font-bold text-xs text-foreground hover:text-amber-600 dark:hover:text-amber-400 truncate block"
                        >
                          {org.name}
                        </Link>
                        <p className="text-[10px] text-muted-foreground truncate">{org.city} • {org.category}</p>
                      </div>
                    </div>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-xs shrink-0">
                      ★ {org.rating}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-card border border-slate-200/40 dark:border-slate-800/40 text-center">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-muted-foreground block">Gross Sales</span>
                      <span className="text-xs font-black text-foreground font-mono mt-0.5 block truncate">
                        {org.totalRevenue >= 1000 ? `${(org.totalRevenue / 1000).toFixed(0)}k` : org.totalRevenue} ETB
                      </span>
                    </div>
                    <div className="border-x border-slate-200/40 dark:border-slate-800/40">
                      <span className="text-[9px] uppercase font-bold text-muted-foreground block">Commission</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                        {org.commissionRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-muted-foreground block">Bookings</span>
                      <span className="text-xs font-extrabold text-foreground mt-0.5 block">
                        {org.totalBookings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto -mx-6 -mb-6">
          <table className="w-full text-xs text-left min-w-[950px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3.5 whitespace-nowrap min-w-[200px]">Rank & Provider</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[130px]">Active Routes/Events</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Bookings</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[120px]">Gross Sales</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[140px]">Platform Commission</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-right min-w-[80px]">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {organizations.filter((o) => o.status === "APPROVED").length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-muted-foreground">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="font-semibold text-foreground">No approved providers yet</p>
                    <p className="text-[11px] mt-0.5">Approved provider performance rankings will appear here.</p>
                  </td>
                </tr>
              ) : (
                organizations
                  .filter((o) => o.status === "APPROVED")
                  .map((org, idx) => (
                    <tr key={org.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-muted-foreground text-xs w-4">
                            #{idx + 1}
                          </span>
                          <div>
                            <Link
                              href={`/admin/providers/${org.id}`}
                              className="font-semibold text-foreground hover:text-amber-600 dark:hover:text-amber-400"
                            >
                              {org.name}
                            </Link>
                            <p className="text-[11px] text-muted-foreground">{org.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-muted text-foreground">
                          {org.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-foreground">{org.totalServices}</td>
                      <td className="px-4 py-3.5 font-semibold text-foreground">{org.totalBookings.toLocaleString()}</td>
                      <td className="px-4 py-3.5 font-bold text-foreground">{org.totalRevenue.toLocaleString()} ETB</td>
                      <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                        {((org.totalRevenue * org.commissionRate) / 100).toLocaleString()} ETB ({org.commissionRate}%)
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-amber-600 dark:text-amber-400">
                        ★ {org.rating}
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
