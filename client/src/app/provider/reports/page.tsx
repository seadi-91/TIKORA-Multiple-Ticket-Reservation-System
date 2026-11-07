"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  FileText,
  TrendingUp,
  ShieldCheck,
  Building2,
  Film,
  Bus,
  Calendar,
  Trophy,
  ArrowRight,
  Download,
  Percent,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { DashboardLineChart } from "@/components/charts/line-chart";
import { DashboardBarChart } from "@/components/charts/bar-chart";
import { DashboardPieChart } from "@/components/charts/pie-chart";
import { formatCurrency } from "@/lib/format-currency";
import { useProviderStore, ProviderOrganization } from "@/stores/provider.store";
import { TicketCategory, TicketItem } from "@/types/ticket.types";
import { TicketService } from "@/services/ticket.service";
import { toast } from "sonner";

interface SectorReportConfig {
  sectorBadge: string;
  reportTitle: string;
  reportSubtitle: string;
  unitLabel: string;
  kpis: {
    label: string;
    value: string;
    sub: string;
    isPositive?: boolean;
  }[];
  revenueTrajectory: { name: string; value: number }[];
  distributionTitle: string;
  distributionSubtitle: string;
  distributionData: { name: string; value: number; color: string }[];
  topBarTitle: string;
  topBarSubtitle: string;
  topBarData: { name: string; value: number }[];
  tableTitle: string;
  tableSubtitle: string;
  tableHeaders: {
    col1: string;
    col2: string;
    col3: string;
    col4: string;
    col5: string;
    col6: string;
    col7: string;
  };
  ledgerRows: {
    segmentTitle: string;
    subLabel: string;
    sessionsOrTrips: number;
    ticketsSold: number;
    occupancyRate: string;
    grossSales: number;
    netPayout: number;
  }[];
}

const getSectorAnalyticsConfig = (
  organization: ProviderOrganization,
  tickets: TicketItem[]
): SectorReportConfig => {
  const category = organization.category;
  const orgName = organization.name;

  const totalCapacity = tickets.reduce((acc, t) => acc + t.totalSeats, 0);
  const totalAvailable = tickets.reduce((acc, t) => acc + t.availableSeats, 0);
  const totalSold = totalCapacity - totalAvailable;
  const avgPrice =
    tickets.length > 0 ? Math.round(tickets.reduce((acc, t) => acc + t.price, 0) / tickets.length) : 0;
  const occupancyPct = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;

  const ledgerRows = tickets.map((t) => {
    const sold = t.totalSeats - t.availableSeats;
    const gross = sold * t.price;
    const net = Math.round(gross * 0.95);
    const occ = t.totalSeats > 0 ? `${Math.round((sold / t.totalSeats) * 100)}%` : "0%";

    return {
      segmentTitle: t.title,
      subLabel: `${t.location} • ${t.date} ${t.time}`,
      sessionsOrTrips: 1,
      ticketsSold: sold,
      occupancyRate: occ,
      grossSales: gross,
      netPayout: net,
    };
  });

  const revenueTrajectory =
    organization.stats.totalRevenue > 0
      ? [
          { name: "Week 1", value: Math.round(organization.stats.totalRevenue * 0.15) },
          { name: "Week 2", value: Math.round(organization.stats.totalRevenue * 0.25) },
          { name: "Week 3", value: Math.round(organization.stats.totalRevenue * 0.25) },
          { name: "Week 4", value: Math.round(organization.stats.totalRevenue * 0.35) },
        ]
      : [
          { name: "Week 1", value: 0 },
          { name: "Week 2", value: 0 },
          { name: "Week 3", value: 0 },
          { name: "Week 4", value: 0 },
        ];

  const topBarData = tickets.slice(0, 5).map((t) => ({
    name: t.title.length > 20 ? `${t.title.slice(0, 18)}...` : t.title,
    value: (t.totalSeats - t.availableSeats) * t.price,
  }));

  const colors = ["#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"];
  const distributionData = tickets.slice(0, 4).map((t, idx) => ({
    name: t.title.length > 20 ? `${t.title.slice(0, 18)}...` : t.title,
    value: (t.totalSeats - t.availableSeats) * t.price || 0,
    color: colors[idx % colors.length],
  }));

  switch (category) {
    case "CINEMA":
      return {
        sectorBadge: "CINEMA BOX OFFICE ANALYTICS",
        reportTitle: "Multiplex Screening & Box Office Performance",
        reportSubtitle: `Granular hall occupancy, revenue velocity, and concession ticketing for ${orgName}.`,
        unitLabel: "Showtimes",
        kpis: [
          {
            label: "Average Ticket Value",
            value: `${avgPrice} ETB`,
            sub: tickets.length > 0 ? "Standard premiere rate" : "No active movies",
            isPositive: tickets.length > 0,
          },
          {
            label: "Screening Hall Occupancy",
            value: `${occupancyPct}%`,
            sub: `${totalSold} seats booked`,
            isPositive: occupancyPct > 50,
          },
          {
            label: "Active Premieres",
            value: `${tickets.length}`,
            sub: "Now showing",
          },
          {
            label: "Tickets Verified",
            value: `${organization.stats.totalTicketsSold}`,
            sub: "Redeemed at hall gate",
            isPositive: organization.stats.totalTicketsSold > 0,
          },
        ],
        revenueTrajectory,
        distributionTitle: "Box Office by Screening Format",
        distributionSubtitle: "Distribution across active movie features",
        distributionData,
        topBarTitle: "Top Box Office Movie Screenings",
        topBarSubtitle: "Ranked by gross ticket sales and hall occupancy",
        topBarData,
        tableTitle: "Cinema Screening & Box Office Ledger",
        tableSubtitle: `Live box office performance and digital hall manifest for ${orgName}`,
        tableHeaders: {
          col1: "Movie Title & Session",
          col2: "Screening Format & Hall",
          col3: "Showtimes Run",
          col4: "Tickets Sold",
          col5: "Hall Occupancy",
          col6: "Gross Box Office",
          col7: "Net Provider Payout",
        },
        ledgerRows,
      };

    case "EVENT":
      return {
        sectorBadge: "LIVE EVENTS & CONCERTS ANALYTICS",
        reportTitle: "Concert & Festival Ticket Sales Performance",
        reportSubtitle: `Festival pass velocity, VIP conversions, turnstile check-ins, and attendee volume trends for ${orgName}.`,
        unitLabel: "Events",
        kpis: [
          {
            label: "Average Pass Order",
            value: `${avgPrice} ETB`,
            sub: tickets.length > 0 ? "Average ticket tier" : "No live events",
            isPositive: tickets.length > 0,
          },
          {
            label: "Venue Turnstile Fill",
            value: `${occupancyPct}%`,
            sub: `${totalSold} passes sold`,
            isPositive: occupancyPct > 50,
          },
          {
            label: "Active Listings",
            value: `${tickets.length}`,
            sub: "Festivals & concerts",
          },
          {
            label: "Gate Scans Verified",
            value: `${organization.stats.totalTicketsSold}`,
            sub: "Checked-in at turnstiles",
            isPositive: organization.stats.totalTicketsSold > 0,
          },
        ],
        revenueTrajectory,
        distributionTitle: "Revenue by Festival Pass Tier",
        distributionSubtitle: "Distribution across event listings",
        distributionData,
        topBarTitle: "Top Performing Festivals & Concerts",
        topBarSubtitle: "Ranked by gross ticket volume and gate attendance",
        topBarData,
        tableTitle: "Concert & Festival Event Ledger",
        tableSubtitle: `Turnstile gate manifests and revenue reconciliation for ${orgName}`,
        tableHeaders: {
          col1: "Festival / Concert Title",
          col2: "Venue & Staging Tier",
          col3: "Active Turnstiles",
          col4: "Passes Sold",
          col5: "Venue Fill Rate",
          col6: "Gross Pass Sales",
          col7: "Net Provider Payout",
        },
        ledgerRows,
      };

    case "SPORTS":
      return {
        sectorBadge: "STADIUM SPORTS & DERBY ANALYTICS",
        reportTitle: "Stadium Matchday & Turnstile Performance",
        reportSubtitle: `Electronic turnstile gate throughput, grandstand sales, and derby gate receipts for ${orgName}.`,
        unitLabel: "Fixtures",
        kpis: [
          {
            label: "Average Match Ticket",
            value: `${avgPrice} ETB`,
            sub: tickets.length > 0 ? "Tribune average fare" : "No matches scheduled",
            isPositive: tickets.length > 0,
          },
          {
            label: "Stadium Tribune Occupancy",
            value: `${occupancyPct}%`,
            sub: `${totalSold} tickets booked`,
            isPositive: occupancyPct > 50,
          },
          {
            label: "Scheduled Fixtures",
            value: `${tickets.length}`,
            sub: "Active tournaments",
          },
          {
            label: "Turnstile Entries",
            value: `${organization.stats.totalTicketsSold}`,
            sub: "Turnstile scans verified",
            isPositive: organization.stats.totalTicketsSold > 0,
          },
        ],
        revenueTrajectory,
        distributionTitle: "Revenue by Stadium Tribune Zone",
        distributionSubtitle: "Distribution across stadium fixtures",
        distributionData,
        topBarTitle: "Top Performing Derby Fixtures",
        topBarSubtitle: "Ranked by gross gate receipts and stadium attendance",
        topBarData,
        tableTitle: "Stadium Fixture & Turnstile Gate Ledger",
        tableSubtitle: `Official turnstile attendance and gate receipts for ${orgName}`,
        tableHeaders: {
          col1: "Match Fixture & Tournament",
          col2: "Stadium Zone & Gate",
          col3: "Turnstiles Active",
          col4: "Gate Passes Sold",
          col5: "Tribune Occupancy",
          col6: "Gross Gate Sales",
          col7: "Net Provider Payout",
        },
        ledgerRows,
      };

    case "BUS":
    default:
      return {
        sectorBadge: "INTERCITY BUS LOGISTICS ANALYTICS",
        reportTitle: "Fleet Logistics & Corridor Performance Reports",
        reportSubtitle: `Route profitability, passenger seat load factor, highway fleet dispatch, and passenger volume trends for ${orgName}.`,
        unitLabel: "Routes",
        kpis: [
          {
            label: "Average Passenger Fare",
            value: `${avgPrice} ETB`,
            sub: tickets.length > 0 ? "Corridor route average" : "No active bus routes",
            isPositive: tickets.length > 0,
          },
          {
            label: "Fleet Seat Load Factor",
            value: `${occupancyPct}%`,
            sub: `${totalSold} passenger seats booked`,
            isPositive: occupancyPct > 50,
          },
          {
            label: "Active Departures",
            value: `${tickets.length}`,
            sub: "Licensed routes",
          },
          {
            label: "Boarding Passes Scanned",
            value: `${organization.stats.totalTicketsSold}`,
            sub: "Boarding verified",
            isPositive: organization.stats.totalTicketsSold > 0,
          },
        ],
        revenueTrajectory,
        distributionTitle: "Revenue by Coach Fleet Class",
        distributionSubtitle: "Distribution across scheduled departures",
        distributionData,
        topBarTitle: "Top Performing Route Corridors",
        topBarSubtitle: "Ranked by gross passenger sales volume and seat fill rate",
        topBarData,
        tableTitle: "Intercity Route & Corridor Ledger",
        tableSubtitle: `Operational highway metrics and passenger volume reconciliation for ${orgName}`,
        tableHeaders: {
          col1: "Corridor / Route Segment",
          col2: "Fleet Coach Class & Station",
          col3: "Scheduled Trips",
          col4: "Passengers Transported",
          col5: "Avg Seat Occupancy",
          col6: "Gross Ticket Sales",
          col7: "Net Provider Payout",
        },
        ledgerRows,
      };
  }
};

export default function ProviderReportsPage() {
  const { organization } = useProviderStore();
  const [period, setPeriod] = useState<"7D" | "30D" | "QUARTER" | "YTD">("30D");

  const tickets = TicketService.getAllTickets().filter((t) => t.category === organization.category);
  const config = getSectorAnalyticsConfig(organization, tickets);

  const handleExportPDF = () => {
    toast.success(`${organization.category} Performance BI Report PDF generated.`);
  };

  const handleExportCSV = () => {
    toast.success(`${organization.category} Granular Analytics CSV dataset downloaded.`);
  };

  const getCategoryIcon = () => {
    switch (organization.category) {
      case "CINEMA":
        return <Film className="w-4 h-4 text-purple-600" />;
      case "EVENT":
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case "SPORTS":
        return <Trophy className="w-4 h-4 text-emerald-600" />;
      case "BUS":
      default:
        return <Bus className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Strict Sector Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              {getCategoryIcon()}
              <span>{config.sectorBadge}</span>
            </span>
            <span className="text-xs font-semibold text-muted-foreground">{organization.name}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            {config.reportTitle}
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl mt-0.5">
            {config.reportSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="inline-flex rounded-md border border-border/70 p-0.5 bg-muted/40 text-micro font-medium">
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
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  period === p.id
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-border/70 bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Export PDF</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-border/70 bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards - Sector Isolated (4 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        {config.kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-card border border-border/60 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-sm transition-all"
          >
            <span className="text-muted-foreground text-[10px] sm:text-xs block mb-1 truncate font-medium">
              {kpi.label}
            </span>
            <div className="text-sm sm:text-base font-bold text-foreground truncate font-mono">
              {kpi.value}
            </div>
            <span
              className={`text-[10px] sm:text-[11px] flex items-center gap-1 mt-0.5 truncate ${
                kpi.isPositive
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {kpi.isPositive && <TrendingUp className="w-3 h-3 shrink-0" />}
              <span>{kpi.sub}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Revenue Velocity Trend Line Chart */}
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Revenue Velocity & Gross Volume
              </h3>
              <p className="text-xs text-muted-foreground">
                {organization.category} ticket sales trajectory over the selected period
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              Total: {formatCurrency(organization.stats.totalRevenue)}
            </span>
          </div>
          <div className="h-64">
            <DashboardLineChart data={config.revenueTrajectory} color="#B45309" valueSuffix=" ETB" />
          </div>
        </div>

        {/* Sector Tier Distribution Donut Chart */}
        <div className="bg-card border border-border/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-border/40 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              {config.distributionTitle}
            </h3>
            <p className="text-xs text-muted-foreground">{config.distributionSubtitle}</p>
          </div>
          <div className="h-64">
            <DashboardPieChart data={config.distributionData} height={240} />
          </div>
        </div>
      </div>

      {/* Bar Chart: Top Performing Sector Units */}
      <div className="bg-card border border-border/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">{config.topBarTitle}</h3>
          <p className="text-xs text-muted-foreground">{config.topBarSubtitle}</p>
        </div>
        <div className="h-60">
          <DashboardBarChart data={config.topBarData} color="#B45309" valueSuffix=" ETB" />
        </div>
      </div>

      {/* Detailed Performance Ledger Table - Strictly Isolated to Provider Sector */}
      <div className="bg-card border border-border/60 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                {config.tableTitle}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-600/20">
                100% {organization.category} Isolated
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{config.tableSubtitle}</p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-3 py-1 rounded-xl self-start sm:self-auto font-mono">
            {config.ledgerRows.length} Active {config.unitLabel}
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[1050px] text-xs sm:text-[13px]">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-5 min-w-[280px]">{config.tableHeaders.col1}</th>
                <th className="py-3.5 px-4 min-w-[120px]">{config.tableHeaders.col2}</th>
                <th className="py-3.5 px-4 text-center min-w-[120px]">{config.tableHeaders.col3}</th>
                <th className="py-3.5 px-4 text-center min-w-[130px]">{config.tableHeaders.col4}</th>
                <th className="py-3.5 px-4 text-center min-w-[130px]">{config.tableHeaders.col5}</th>
                <th className="py-3.5 px-4 text-right min-w-[140px]">{config.tableHeaders.col6}</th>
                <th className="py-3.5 px-5 text-right min-w-[150px]">{config.tableHeaders.col7}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {config.ledgerRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 px-5 text-center text-xs text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="font-semibold text-foreground text-sm">No {organization.category.toLowerCase()} ledger entries recorded</p>
                    <p className="text-[11px] mt-1 text-muted-foreground">Entries and performance analytics will appear here once ticket sales commence.</p>
                  </td>
                </tr>
              ) : (
                config.ledgerRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-5 font-semibold text-foreground">
                      <span className="block text-sm">{row.segmentTitle}</span>
                      <span className="text-[11px] font-normal text-muted-foreground mt-0.5 block">
                        {row.subLabel}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {organization.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-muted-foreground">
                      {row.sessionsOrTrips}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-medium text-foreground">
                      {row.ticketsSold.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10">
                        {row.occupancyRate}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-medium text-foreground whitespace-nowrap">
                      {formatCurrency(row.grossSales)}
                    </td>
                    <td className="py-4 px-5 text-right font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      {formatCurrency(row.netPayout)}
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
