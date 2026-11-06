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
import { useProviderStore } from "@/stores/provider.store";
import { TicketCategory } from "@/types/ticket.types";
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

const getSectorAnalyticsConfig = (category: TicketCategory, orgName: string): SectorReportConfig => {
  switch (category) {
    case "CINEMA":
      return {
        sectorBadge: "CINEMA BOX OFFICE ANALYTICS",
        reportTitle: "Multiplex Screening & Box Office Performance",
        reportSubtitle: `Granular hall occupancy, 4K Laser Dolby Atmos revenue velocity, matinee vs evening sales, and concession ticketing for ${orgName}.`,
        unitLabel: "Showtimes",
        kpis: [
          {
            label: "Average Ticket Value",
            value: "340 ETB",
            sub: "+8.4% vs last period",
            isPositive: true,
          },
          {
            label: "Screening Hall Occupancy",
            value: "78.6%",
            sub: "+5.2% seat load factor",
            isPositive: true,
          },
          {
            label: "VIP Laser Atmos Share",
            value: "54.2%",
            sub: "High-yield hall tier",
          },
          {
            label: "Projection Reliability",
            value: "99.8%",
            sub: "0 screening disruptions",
            isPositive: true,
          },
        ],
        revenueTrajectory: [
          { name: "Oct 15", value: 38000 },
          { name: "Oct 20", value: 49000 },
          { name: "Oct 25", value: 58000 },
          { name: "Oct 30", value: 69000 },
          { name: "Nov 05", value: 81000 },
          { name: "Nov 10", value: 92000 },
          { name: "Nov 15", value: 104500 },
        ],
        distributionTitle: "Box Office by Screening Format",
        distributionSubtitle: "VIP Atmos vs 3D Digital vs 2D standard",
        distributionData: [
          { name: "4K Laser Dolby Atmos (Hall 1)", value: 235000, color: "#6366F1" },
          { name: "RealD 3D Surround (Hall 2)", value: 128000, color: "#818CF8" },
          { name: "Standard 2D Digital (Hall 3)", value: 54000, color: "#A5B4FC" },
          { name: "Afternoon Matinee Discount", value: 38000, color: "#C7D2FE" },
        ],
        topBarTitle: "Top Box Office Movie Screenings",
        topBarSubtitle: "Ranked by gross ticket sales and hall occupancy",
        topBarData: [
          { name: "Avatar: Fire & Ash 3D", value: 182000 },
          { name: "Dune: Part Two Atmos", value: 135000 },
          { name: "Gladiator II 4K Laser", value: 98000 },
          { name: "Habesha Romance Comedy", value: 76000 },
          { name: "Mufasa: The Lion King", value: 64000 },
        ],
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
        ledgerRows: [
          {
            segmentTitle: "Avatar: Fire & Ash 3D Laser",
            subLabel: "Hall 1 (Century Megaplex) • 04:30 PM & 08:30 PM",
            sessionsOrTrips: 28,
            ticketsSold: 1240,
            occupancyRate: "92%",
            grossSales: 182000,
            netPayout: 172900,
          },
          {
            segmentTitle: "Dune: Part Two Dolby Atmos",
            subLabel: "Hall 1 (Century Megaplex) • 07:00 PM Prime",
            sessionsOrTrips: 24,
            ticketsSold: 980,
            occupancyRate: "86%",
            grossSales: 135000,
            netPayout: 128250,
          },
          {
            segmentTitle: "Gladiator II: Ethiopian Premiere",
            subLabel: "Hall 2 (VIP Recliner) • 05:30 PM & 09:00 PM",
            sessionsOrTrips: 20,
            ticketsSold: 740,
            occupancyRate: "81%",
            grossSales: 98000,
            netPayout: 93100,
          },
          {
            segmentTitle: "Habesha Romance Comedy",
            subLabel: "Hall 3 (Standard 2D) • 02:00 PM Matinee",
            sessionsOrTrips: 18,
            ticketsSold: 560,
            occupancyRate: "74%",
            grossSales: 76000,
            netPayout: 72200,
          },
          {
            segmentTitle: "Mufasa: The Lion King",
            subLabel: "Hall 2 (RealD 3D Family) • 03:00 PM & 06:00 PM",
            sessionsOrTrips: 16,
            ticketsSold: 490,
            occupancyRate: "70%",
            grossSales: 64000,
            netPayout: 60800,
          },
        ],
      };

    case "EVENT":
      return {
        sectorBadge: "LIVE EVENTS & CONCERTS ANALYTICS",
        reportTitle: "Concert & Festival Ticket Sales Performance",
        reportSubtitle: `Festival pass velocity, VIP lounge conversions, turnstile check-in throughput, and attendee volume trends for ${orgName}.`,
        unitLabel: "Events",
        kpis: [
          {
            label: "Average Pass Order",
            value: "1,450 ETB",
            sub: "+15.8% vs last period",
            isPositive: true,
          },
          {
            label: "Venue Turnstile Fill",
            value: "92.4%",
            sub: "Millennium Hall Capacity",
            isPositive: true,
          },
          {
            label: "VIP Table Conversion",
            value: "48.0%",
            sub: "High-margin premium tiers",
          },
          {
            label: "Gate Check-in Speed",
            value: "88 scans/min",
            sub: "Fast turnstile flow",
            isPositive: true,
          },
        ],
        revenueTrajectory: [
          { name: "Oct 15", value: 52000 },
          { name: "Oct 20", value: 74000 },
          { name: "Oct 25", value: 98000 },
          { name: "Oct 30", value: 125000 },
          { name: "Nov 05", value: 168000 },
          { name: "Nov 10", value: 215000 },
          { name: "Nov 15", value: 248000 },
        ],
        distributionTitle: "Revenue by Festival Pass Tier",
        distributionSubtitle: "VIP Lounges vs General Standing vs Early Bird",
        distributionData: [
          { name: "VIP Tables & Lounges", value: 345000, color: "#D97706" },
          { name: "General Admission Standing", value: 245000, color: "#B45309" },
          { name: "Early Bird Discount Passes", value: 85000, color: "#F59E0B" },
          { name: "Backstage & Artist Access", value: 40789, color: "#FCD34D" },
        ],
        topBarTitle: "Top Performing Festivals & Concerts",
        topBarSubtitle: "Ranked by gross ticket volume and gate attendance",
        topBarData: [
          { name: "Addis Jazz & Blues Fest", value: 240000 },
          { name: "Afrobeat Live Millennium", value: 195000 },
          { name: "New Year Eve Grand Gala", value: 160000 },
          { name: "Tech & Startup Expo", value: 85000 },
          { name: "Addis Standup Showcase", value: 35789 },
        ],
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
        ledgerRows: [
          {
            segmentTitle: "Addis International Jazz & Heritage Festival",
            subLabel: "Ghion Hotel Open Gardens • Main Amphitheatre Stage",
            sessionsOrTrips: 1,
            ticketsSold: 1850,
            occupancyRate: "98%",
            grossSales: 240000,
            netPayout: 228000,
          },
          {
            segmentTitle: "Afrobeat Live Festival - Millennium Hall",
            subLabel: "Millennium Hall Main Arena • Turnstiles A, B, C",
            sessionsOrTrips: 1,
            ticketsSold: 1420,
            occupancyRate: "94%",
            grossSales: 195000,
            netPayout: 185250,
          },
          {
            segmentTitle: "Ethiopian New Year Eve Music Night",
            subLabel: "Sheraton Addis Gaslight Pavilion • VIP Tables",
            sessionsOrTrips: 1,
            ticketsSold: 980,
            occupancyRate: "90%",
            grossSales: 160000,
            netPayout: 152000,
          },
          {
            segmentTitle: "Tech & Startup Innovation Gala",
            subLabel: "Skylight Hotel Grand Ballroom • Corporate Passes",
            sessionsOrTrips: 1,
            ticketsSold: 650,
            occupancyRate: "82%",
            grossSales: 85000,
            netPayout: 80750,
          },
          {
            segmentTitle: "Addis Standup Comedy Showcase",
            subLabel: "National Theatre Main Auditorium",
            sessionsOrTrips: 2,
            ticketsSold: 420,
            occupancyRate: "88%",
            grossSales: 35789,
            netPayout: 34000,
          },
        ],
      };

    case "SPORTS":
      return {
        sectorBadge: "STADIUM SPORTS & DERBY ANALYTICS",
        reportTitle: "Stadium Matchday & Turnstile Performance",
        reportSubtitle: `Electronic turnstile gate throughput, covered grandstand vs bleachers sales, season member share, and derby gate receipts for ${orgName}.`,
        unitLabel: "Fixtures",
        kpis: [
          {
            label: "Average Match Ticket",
            value: "380 ETB",
            sub: "+10.2% vs league average",
            isPositive: true,
          },
          {
            label: "Stadium Tribune Occupancy",
            value: "86.5%",
            sub: "Addis Ababa Stadium",
            isPositive: true,
          },
          {
            label: "Covered VIP Tribune Share",
            value: "46.2%",
            sub: "High-demand covered seating",
          },
          {
            label: "Gate Turnstile Clearance",
            value: "98.6%",
            sub: "Zero entry bottlenecks",
            isPositive: true,
          },
        ],
        revenueTrajectory: [
          { name: "Oct 15", value: 45000 },
          { name: "Oct 20", value: 68000 },
          { name: "Oct 25", value: 89000 },
          { name: "Oct 30", value: 112000 },
          { name: "Nov 05", value: 145000 },
          { name: "Nov 10", value: 182000 },
          { name: "Nov 15", value: 215000 },
        ],
        distributionTitle: "Revenue by Stadium Tribune Zone",
        distributionSubtitle: "Covered VIP vs West Bleachers vs East Gate",
        distributionData: [
          { name: "Covered VIP Grandstand", value: 265000, color: "#10B981" },
          { name: "West Bleachers General Gate", value: 165000, color: "#059669" },
          { name: "East Gate General Tribune", value: 82000, color: "#34D399" },
          { name: "Pitchside Corporate Boxes", value: 35368, color: "#6EE7B7" },
        ],
        topBarTitle: "Top Performing Derby Fixtures",
        topBarSubtitle: "Ranked by gross gate receipts and stadium attendance",
        topBarData: [
          { name: "St. George vs Coffee Derby", value: 290000 },
          { name: "Fasil Kenema League Match", value: 165000 },
          { name: "National Basketball Finals", value: 120000 },
          { name: "Addis City Cup Semifinal", value: 95000 },
          { name: "Bahir Dar City Matchday", value: 77368 },
        ],
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
        ledgerRows: [
          {
            segmentTitle: "St. George SC vs Ethiopian Coffee SC (Derby)",
            subLabel: "Addis Ababa Stadium • Gates 1, 2, 3, 4 (Full Capacity)",
            sessionsOrTrips: 1,
            ticketsSold: 2850,
            occupancyRate: "96%",
            grossSales: 290000,
            netPayout: 275500,
          },
          {
            segmentTitle: "Fasil Kenema FC Premier League Clash",
            subLabel: "Addis Ababa Stadium • Gates 2 & 4",
            sessionsOrTrips: 1,
            ticketsSold: 1720,
            occupancyRate: "88%",
            grossSales: 165000,
            netPayout: 156750,
          },
          {
            segmentTitle: "National Basketball League Finals: Game 5",
            subLabel: "Arat Kilo Sports Complex • Court-Side & Bleachers",
            sessionsOrTrips: 1,
            ticketsSold: 980,
            occupancyRate: "92%",
            grossSales: 120000,
            netPayout: 114000,
          },
          {
            segmentTitle: "Addis Ababa City Cup Semifinal",
            subLabel: "Abebe Bikila Stadium • West Tribune",
            sessionsOrTrips: 1,
            ticketsSold: 850,
            occupancyRate: "80%",
            grossSales: 95000,
            netPayout: 90250,
          },
          {
            segmentTitle: "Bahir Dar City League Fixture",
            subLabel: "Addis Ababa Stadium • Covered Grandstand",
            sessionsOrTrips: 1,
            ticketsSold: 710,
            occupancyRate: "76%",
            grossSales: 77368,
            netPayout: 73500,
          },
        ],
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
            value: "780 ETB",
            sub: "+12.4% vs last period",
            isPositive: true,
          },
          {
            label: "Fleet Seat Load Factor",
            value: "84.2%",
            sub: "+4.8% corridor load",
            isPositive: true,
          },
          {
            label: "Repeat Passenger Rate",
            value: "68.5%",
            sub: "2+ bookings per user",
          },
          {
            label: "On-Time Highway Dispatch",
            value: "97.4%",
            sub: "On scheduled departure",
            isPositive: true,
          },
        ],
        revenueTrajectory: [
          { name: "Oct 15", value: 42000 },
          { name: "Oct 20", value: 58000 },
          { name: "Oct 25", value: 65000 },
          { name: "Oct 30", value: 72000 },
          { name: "Nov 05", value: 89000 },
          { name: "Nov 10", value: 98000 },
          { name: "Nov 15", value: 112000 },
        ],
        distributionTitle: "Revenue by Coach Fleet Class",
        distributionSubtitle: "Scania VIP vs Yutong High-Deck vs Minibus",
        distributionData: [
          { name: "Scania VIP Luxury Coach (48 Seats)", value: 295000, color: "#B45309" },
          { name: "Yutong High-Deck Express (44 Seats)", value: 142000, color: "#D97706" },
          { name: "Mercedes Benz Turismo (50 Seats)", value: 52000, color: "#F59E0B" },
          { name: "Regional Shuttle Express", value: 18895, color: "#FCD34D" },
        ],
        topBarTitle: "Top Performing Route Corridors",
        topBarSubtitle: "Ranked by gross passenger sales volume and seat fill rate",
        topBarData: [
          { name: "AA - Hawassa", value: 165000 },
          { name: "AA - Bahir Dar", value: 128000 },
          { name: "AA - Gondar", value: 85000 },
          { name: "AA - Jimma", value: 62000 },
          { name: "AA - Dire Dawa", value: 42500 },
        ],
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
        ledgerRows: [
          {
            segmentTitle: "Addis Ababa → Hawassa Express",
            subLabel: "Autobus Tera Gate 3 • Scania VIP Luxury Coach",
            sessionsOrTrips: 42,
            ticketsSold: 1890,
            occupancyRate: "88%",
            grossSales: 165000,
            netPayout: 156750,
          },
          {
            segmentTitle: "Addis Ababa → Bahir Dar Lake Cruiser",
            subLabel: "Lamberet Terminal Gate 1 • Yutong High-Deck VIP",
            sessionsOrTrips: 28,
            ticketsSold: 1120,
            occupancyRate: "82%",
            grossSales: 128000,
            netPayout: 121600,
          },
          {
            segmentTitle: "Addis Ababa → Gondar Express",
            subLabel: "Lamberet Terminal Gate 2 • Scania King Long Coach",
            sessionsOrTrips: 18,
            ticketsSold: 680,
            occupancyRate: "76%",
            grossSales: 85000,
            netPayout: 80750,
          },
          {
            segmentTitle: "Addis Ababa → Jimma Express",
            subLabel: "Autobus Tera Gate 7 • Yutong Comfort Class",
            sessionsOrTrips: 16,
            ticketsSold: 540,
            occupancyRate: "79%",
            grossSales: 62000,
            netPayout: 58900,
          },
          {
            segmentTitle: "Addis Ababa → Dire Dawa Express",
            subLabel: "Kality Cross-Country Gate 4 • Mercedes Benz Turismo",
            sessionsOrTrips: 12,
            ticketsSold: 420,
            occupancyRate: "72%",
            grossSales: 42500,
            netPayout: 40375,
          },
        ],
      };
  }
};

export default function ProviderReportsPage() {
  const { organization } = useProviderStore();
  const [period, setPeriod] = useState<"7D" | "30D" | "QUARTER" | "YTD">("30D");

  // Dynamic config strictly locked to the provider's active category
  const config = getSectorAnalyticsConfig(organization.category, organization.name);

  const handleExportPDF = () => {
    toast.success(`${organization.category} Performance BI Report PDF generated and downloaded.`);
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
              {config.ledgerRows.map((row, idx) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
