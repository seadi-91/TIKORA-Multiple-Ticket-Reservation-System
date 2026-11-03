"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Ticket,
  Boxes,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
  Bus,
  Calendar,
  Film,
  Trophy,
  Users,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { formatCurrency } from "@/lib/format-currency";
import { DashboardLineChart } from "@/components/charts/line-chart";
import { DashboardPieChart } from "@/components/charts/pie-chart";
import { DashboardBarChart } from "@/components/charts/bar-chart";

export default function ProviderOverviewDashboard() {
  const { organization, busRoutes, busSchedules, staffMembers, refunds } = useProviderStore();
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D">("30D");

  // Sample analytics data based on selected time range
  const revenueTrendData = [
    { name: "Mon", value: 48500 },
    { name: "Tue", value: 54200 },
    { name: "Wed", value: 61800 },
    { name: "Thu", value: 59100 },
    { name: "Fri", value: 89400 },
    { name: "Sat", value: 98200 },
    { name: "Sun", value: 71300 },
  ];

  const categoryShareData = [
    { name: "Intercity Bus", value: 52, color: "#B45309" },
    { name: "Concerts & Events", value: 24, color: "#D97706" },
    { name: "Cinema & IMAX", value: 14, color: "#6366F1" },
    { name: "Stadium Sports", value: 10, color: "#10B981" },
  ];

  const routePerformanceData = [
    { name: "Addis → Hawassa", value: 185000, secondaryValue: 240 },
    { name: "Addis → Bahir Dar", value: 142000, secondaryValue: 180 },
    { name: "Addis → Dire Dawa", value: 92000, secondaryValue: 110 },
    { name: "Addis → Gondar", value: 63500, secondaryValue: 65 },
  ];

  const recentBookings = [
    {
      id: "TH-BUS-8829",
      customer: "Abebe Bekele",
      service: "Addis Ababa → Hawassa (06:00 AM)",
      date: "Nov 15, 2026",
      seats: "12A, 12B",
      pax: 2,
      amount: 1508,
      gateway: "Telebirr",
      status: "CONFIRMED",
    },
    {
      id: "TH-BUS-8830",
      customer: "Selamawit Tadesse",
      service: "Addis Ababa → Bahir Dar (05:30 AM)",
      date: "Nov 15, 2026",
      seats: "04A",
      pax: 1,
      amount: 1102,
      gateway: "CBE Birr",
      status: "CONFIRMED",
    },
    {
      id: "TH-EVT-4401",
      customer: "Dawit Mengistu",
      service: "Addis International Jazz & Afrobeat Festival",
      date: "Nov 20, 2026",
      seats: "VIP Table 4",
      pax: 4,
      amount: 3944,
      gateway: "Chapa",
      status: "CONFIRMED",
    },
    {
      id: "TH-SPT-9921",
      customer: "Marta Solomon",
      service: "National Basketball League Finals: Game 5",
      date: "Nov 18, 2026",
      seats: "Court-Side Row 2",
      pax: 2,
      amount: 1044,
      gateway: "Telebirr",
      status: "PENDING",
    },
  ];

  const pendingRefundCount = refunds.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-[#1E293B] text-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Merchant: {organization.legalName}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Operations & Revenue Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time passenger bookings, seat availability matrices, electronic gate turnstiles, and daily bank settlements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/provider/bus/routes"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Route</span>
          </Link>
          <Link
            href="/provider/reports"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
          >
            <span>Financial Report</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards - Multiple 3 to 6 Column Display */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3.5">
        {/* Total Revenue */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">Gross Revenue</span>
            <CreditCard className="w-3.5 h-3.5 text-[#B45309] dark:text-amber-400 shrink-0" />
          </div>
          <div className="text-xs sm:text-xl font-black text-[#0F172A] dark:text-white mt-0.5 truncate">
            {formatCurrency(organization.stats.totalRevenue)}
          </div>
          <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 truncate">
            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            <span className="truncate">+14.2%</span>
          </span>
        </div>

        {/* Total Bookings */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">Bookings</span>
            <ShoppingBag className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          </div>
          <div className="text-xs sm:text-xl font-black text-[#0F172A] dark:text-white mt-0.5">
            {organization.stats.totalBookings.toLocaleString()}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400 truncate block">14 active lines</span>
        </div>

        {/* Tickets Sold */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">Tickets Sold</span>
            <Ticket className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          </div>
          <div className="text-xs sm:text-xl font-black text-[#0F172A] dark:text-white mt-0.5">
            {organization.stats.totalTicketsSold.toLocaleString()}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400 truncate block">Scannable passes</span>
        </div>

        {/* Available Inventory */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">Seats Left</span>
            <Boxes className="w-3.5 h-3.5 text-purple-500 shrink-0" />
          </div>
          <div className="text-xs sm:text-xl font-black text-[#0F172A] dark:text-white mt-0.5">
            {organization.stats.availableSeats}
          </div>
          <span className="text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400 font-medium truncate block">Available now</span>
        </div>

        {/* Pending Orders */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">Pending</span>
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          </div>
          <div className="text-xs sm:text-xl font-black text-[#0F172A] dark:text-white mt-0.5">
            {organization.stats.pendingBookings}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400 truncate block">Gate queue</span>
        </div>

        {/* Payout Balance */}
        <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">Ready Payout</span>
            <CreditCard className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          </div>
          <div className="text-xs sm:text-xl font-black text-[#0F172A] dark:text-white mt-0.5 truncate">
            {formatCurrency(organization.stats.availableBalance)}
          </div>
          <Link
            href="/provider/payments"
            className="text-[9px] sm:text-[10px] font-bold text-[#B45309] dark:text-amber-400 hover:underline flex items-center gap-0.5 truncate"
          >
            <span>Payout</span>
            <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
          </Link>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Sales Trend Chart */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                Revenue & Sales Velocity
              </h2>
              <p className="text-xs text-slate-400">
                Daily settled ticket transactions across CBE Birr, Telebirr & Chapa.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              {(["7D", "30D", "90D"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === r
                      ? "bg-white dark:bg-[#161922] text-[#B45309] dark:text-amber-400 shadow-2xs"
                      : "text-slate-500 hover:text-[#0F172A] dark:text-slate-400"
                  }`}
                >
                  {r === "7D" ? "Last 7 Days" : r === "30D" ? "30 Days" : "Quarter"}
                </button>
              ))}
            </div>
          </div>

          <DashboardLineChart
            data={revenueTrendData}
            color="#B45309"
            height={260}
            valuePrefix=""
            valueSuffix=" ETB"
          />
        </div>

        {/* Right 4 Cols: Category Share Donut */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
              Revenue by Service Sector
            </h2>
            <p className="text-xs text-slate-400">Distribution across transportation & entertainment.</p>
          </div>

          <DashboardPieChart data={categoryShareData} height={260} />
        </div>
      </div>

      {/* Top Routes & Recent Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Recent Customer Bookings Table */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                Recent Passenger Bookings
              </h3>
              <p className="text-xs text-slate-400">Live feed from web portal & mobile apps</p>
            </div>
            <Link
              href="/provider/bookings"
              className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-2.5 px-3">Reference / Customer</th>
                  <th className="py-2.5 px-3">Service / Line</th>
                  <th className="py-2.5 px-3">Seats</th>
                  <th className="py-2.5 px-3">Fare</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-[#0F172A] dark:text-white block">
                        {b.id}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                        {b.customer}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-[#0F172A] dark:text-slate-200 block truncate max-w-[180px]">
                        {b.service}
                      </span>
                      <span className="text-[10px] text-slate-400">{b.date}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {b.seats}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#0F172A] dark:text-white block">
                        {formatCurrency(b.amount)}
                      </span>
                      <span className="text-[10px] text-slate-400">{b.gateway}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: Route Volume Chart & Operational Dispatch */}
        <div className="lg:col-span-5 space-y-6">
          {/* Highway Route Performance */}
          <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                  Top Route Volumes
                </h3>
                <p className="text-xs text-slate-400">Total revenue generated by highway segment</p>
              </div>
              <Link
                href="/provider/bus/routes"
                className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline"
              >
                Routes
              </Link>
            </div>

            <DashboardBarChart data={routePerformanceData} height={200} valueSuffix=" ETB" />
          </div>

          {/* Operational Team Quick Status */}
          <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B45309]" />
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                  Gate Inspectors On Duty
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950">
                {staffMembers.filter((s) => s.status === "ACTIVE").length} Active
              </span>
            </div>

            <div className="space-y-2">
              {staffMembers.slice(0, 3).map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                      {st.fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white block truncate">
                        {st.fullName}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {st.assignedStation}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {st.scannedTicketsCount} Scanned
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/provider/staff"
              className="w-full text-center block pt-2 text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline"
            >
              Manage All Field Staff & Inspectors →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

