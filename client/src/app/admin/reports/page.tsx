"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { DashboardLineChart } from "@/components/charts/line-chart";
import { DashboardBarChart } from "@/components/charts/bar-chart";
import { DashboardPieChart } from "@/components/charts/pie-chart";

export default function AdminReportsPage() {
  const { stats, organizations } = useAdminStore();

  const [dateRange, setDateRange] = useState<"30D" | "90D" | "YTD">("30D");

  const gmvGrowthData = [
    { name: "Week 1", value: 1120000 },
    { name: "Week 2", value: 1240000 },
    { name: "Week 3", value: 1190000 },
    { name: "Week 4", value: 1300200 },
  ];

  const sectorPerformanceData = [
    { name: "Bus Transport", value: 2450000, secondaryValue: 122500 },
    { name: "Cinema", value: 920000, secondaryValue: 46000 },
    { name: "Events", value: 840000, secondaryValue: 50400 },
    { name: "Sports", value: 640200, secondaryValue: 28810 },
  ];

  const paymentShareData = [
    { name: "Telebirr", value: 64, color: "#B45309" },
    { name: "CBE Birr", value: 26, color: "#F59E0B" },
    { name: "Chapa / Cards", value: 10, color: "#FDE68A" },
  ];

  const exportReport = () => {
    alert("Generating comprehensive platform audit summary PDF...");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Platform Analytics & Executive Reports
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cross-sector financial reports, conversion velocities, payment gateway market share, and revenue retention.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl text-xs font-semibold">
            {(["30D", "90D", "YTD"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded-lg transition-colors ${
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

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Period Gross GMV</p>
          <p className="text-2xl font-bold text-foreground mt-1">4,850,200 ETB</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2%</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Commission Earned</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">242,510 ETB</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+11.8%</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tickets Verified</p>
          <p className="text-2xl font-bold text-foreground mt-1">17,890</p>
          <p className="text-[11px] text-muted-foreground mt-1">97.1% redemption rate</p>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Dispute Rate</p>
          <p className="text-2xl font-bold text-foreground mt-1">0.04%</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Low risk status</p>
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

        <div className="overflow-x-auto -mx-6 -mb-6">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Rank & Provider</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Active Routes/Events</th>
                <th className="px-4 py-3.5">Bookings</th>
                <th className="px-4 py-3.5">Gross Sales</th>
                <th className="px-4 py-3.5">Platform Commission</th>
                <th className="px-6 py-3.5 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {organizations
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
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
