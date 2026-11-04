"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  TrendingUp,
} from "lucide-react";
import { DashboardLineChart } from "@/components/charts/line-chart";
import { DashboardBarChart } from "@/components/charts/bar-chart";
import { DashboardPieChart } from "@/components/charts/pie-chart";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";

export default function ProviderReportsPage() {
  const [period, setPeriod] = useState<"7D" | "30D" | "QUARTER" | "YTD">("30D");

  const revenueLineData = [
    { name: "Oct 15", value: 42000 },
    { name: "Oct 20", value: 58000 },
    { name: "Oct 25", value: 65000 },
    { name: "Oct 30", value: 72000 },
    { name: "Nov 05", value: 89000 },
    { name: "Nov 10", value: 98000 },
    { name: "Nov 15", value: 112000 },
  ];

  const topRoutesBarData = [
    { name: "AA - Hawassa", value: 165000 },
    { name: "AA - Bahir Dar", value: 128000 },
    { name: "AA - Gondar", value: 85000 },
    { name: "AA - Jimma", value: 62000 },
    { name: "AA - Dire Dawa", value: 42500 },
  ];

  const sectorPieData = [
    { name: "Intercity Bus", value: 312000, color: "#B45309" },
    { name: "Concerts & Events", value: 78000, color: "#8B5CF6" },
    { name: "Cinema Showtimes", value: 54000, color: "#0284C7" },
    { name: "Stadium Sports", value: 38500, color: "#10B981" },
  ];

  const handleExportPDF = () => {
    toast.success("Executive BI Report PDF generated and downloaded.");
  };

  const handleExportCSV = () => {
    toast.success("Granular Analytics CSV dataset downloaded.");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Analytics & Executive Performance Reports
          </h1>
          <p className="text-xs text-muted-foreground">
            Revenue velocity, seat fill efficiency, passenger volume trends, and segment profitability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="inline-flex rounded-lg border border-border/70 p-0.5 bg-muted/40 text-xs font-medium">
            {[
              { id: "7D", label: "7 Days" },
              { id: "30D", label: "30 Days" },
              { id: "QUARTER", label: "Quarter" },
              { id: "YTD", label: "YTD" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id as any)}
                className={`px-2.5 py-1 rounded-md transition-colors ${period === p.id
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" /> Export PDF
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Summary Cards - Multiple Column Display (4 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-card border border-border/60 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-sm transition-all">
          <span className="text-muted-foreground text-[10px] sm:text-xs block mb-1 truncate">Average Order Value</span>
          <div className="text-sm sm:text-base font-bold text-foreground truncate">780 ETB</div>
          <span className="text-[10px] sm:text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5 truncate">
            <TrendingUp className="w-3 h-3 shrink-0" /> +12.4%
          </span>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-sm transition-all">
          <span className="text-muted-foreground text-[10px] sm:text-xs block mb-1 truncate">Occupancy Rate</span>
          <div className="text-sm sm:text-base font-bold text-foreground truncate">74.2%</div>
          <span className="text-[10px] sm:text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5 truncate">
            <TrendingUp className="w-3 h-3 shrink-0" /> +4.8% load
          </span>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-sm transition-all">
          <span className="text-muted-foreground text-[10px] sm:text-xs block mb-1 truncate">Repeat Rate</span>
          <div className="text-sm sm:text-base font-bold text-foreground truncate">68.5%</div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate block">2+ bookings</span>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-sm transition-all">
          <span className="text-muted-foreground text-[10px] sm:text-xs block mb-1 truncate">On-Time Dispatch</span>
          <div className="text-sm sm:text-base font-bold text-emerald-600 truncate">97.4%</div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate block">On schedule</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Revenue Trend Line Chart */}
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground">Revenue Velocity & Volume</h3>
              <p className="text-xs text-muted-foreground">
                Gross ticket sales trajectory over the selected period
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              Total: 482,500 ETB
            </span>
          </div>
          <div className="h-64">
            <DashboardLineChart data={revenueLineData} color="#B45309" valueSuffix=" ETB" />
          </div>
        </div>

        {/* Sector Distribution Pie Chart */}
        <div className="bg-card border border-border/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-border/40 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground">Revenue by Category</h3>
            <p className="text-xs text-muted-foreground">Distribution across transport & events</p>
          </div>
          <div className="h-64">
            <DashboardPieChart data={sectorPieData} height={240} />
          </div>
        </div>
      </div>

      {/* Bar Chart: Top Routes */}
      <div className="bg-card border border-border/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">Top Performing Route Corridors</h3>
          <p className="text-xs text-muted-foreground">
            Ranked by gross sales volume and seat fill rate
          </p>
        </div>
        <div className="h-60">
          <DashboardBarChart data={topRoutesBarData} color="#B45309" valueSuffix=" ETB" />
        </div>
      </div>

      {/* Route & Service Detailed Performance Table */}
      <div className="bg-card border border-border/60 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Route & Segment Ledger</h3>
            <p className="text-xs text-muted-foreground">
              Operational breakdown across highway corridors and cinema sessions
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Segment / Listing</th>
                <th className="py-3 px-3">Sector</th>
                <th className="py-3 px-3 text-center">Scheduled Trips</th>
                <th className="py-3 px-3 text-center">Tickets Sold</th>
                <th className="py-3 px-3 text-center">Avg Occupancy</th>
                <th className="py-3 px-3 text-right">Gross Sales</th>
                <th className="py-3 px-4 text-right">Net Provider Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {[
                {
                  route: "Addis Ababa - Hawassa Express",
                  sector: "BUS",
                  trips: 42,
                  tickets: 1890,
                  occupancy: "88%",
                  gross: 165000,
                  net: 156750,
                },
                {
                  route: "Addis Ababa - Bahir Dar Lake Cruiser",
                  sector: "BUS",
                  trips: 28,
                  tickets: 1120,
                  occupancy: "82%",
                  gross: 128000,
                  net: 121600,
                },
                {
                  route: "Addis Ababa - Gondar Express",
                  sector: "BUS",
                  trips: 18,
                  tickets: 680,
                  occupancy: "76%",
                  gross: 85000,
                  net: 80750,
                },
                {
                  route: "Afro Beats & Jazz Night Live",
                  sector: "EVENT",
                  trips: 1,
                  tickets: 240,
                  occupancy: "96%",
                  gross: 78000,
                  net: 74100,
                },
                {
                  route: "Avatar 3D Laser - Hall 1",
                  sector: "CINEMA",
                  trips: 14,
                  tickets: 420,
                  occupancy: "70%",
                  gross: 54000,
                  net: 51300,
                },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">{row.route}</td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-600/20">
                      {row.sector}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-muted-foreground">
                    {row.trips}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-medium text-foreground">
                    {row.tickets}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-600">
                    {row.occupancy}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-medium text-foreground">
                    {formatCurrency(row.gross)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-600">
                    {formatCurrency(row.net)}
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
