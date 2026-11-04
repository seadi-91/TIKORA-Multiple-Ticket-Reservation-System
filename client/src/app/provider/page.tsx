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
  Copy,
  Download,
  MoreVertical,
  MapPin,
  Check,
  Sparkles,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { formatCurrency } from "@/lib/format-currency";
import { DashboardLineChart } from "@/components/charts/line-chart";
import { DashboardPieChart } from "@/components/charts/pie-chart";
import { DashboardBarChart } from "@/components/charts/bar-chart";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { toast } from "sonner";

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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Modern Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 text-white p-5 sm:p-7 shadow-sm border border-slate-800/80">
        {/* Soft Ambient Radial Glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Verified Merchant: {organization.legalName}</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
              Operations & Revenue Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              Live seat matrices, scannable passes, turnstile entry logs, and daily bank payouts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link
              href="/provider/bus/routes"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex-1 sm:flex-initial"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Route</span>
            </Link>
            <Link
              href="/provider/reports"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 ring-1 ring-white/15 font-bold text-xs backdrop-blur-xs transition-all flex-1 sm:flex-initial"
            >
              <span>Financial Report</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 6 Key Stat Cards - Soft border, high aesthetic, responsive mobile 2-col to 6-col desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        {/* Gross Revenue */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all duration-200 space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Gross Revenue
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-[#B45309] dark:text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm sm:text-lg font-black text-[#0F172A] dark:text-white truncate">
            {formatCurrency(organization.stats.totalRevenue)}
          </div>
          <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 shrink-0" />
            <span>+14.2%</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all duration-200 space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Bookings
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm sm:text-lg font-black text-[#0F172A] dark:text-white truncate">
            {organization.stats.totalBookings.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
            14 active lines
          </span>
        </div>

        {/* Tickets Sold */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all duration-200 space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Tickets Sold
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Ticket className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm sm:text-lg font-black text-[#0F172A] dark:text-white truncate">
            {organization.stats.totalTicketsSold.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
            Verified passes
          </span>
        </div>

        {/* Available Inventory */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all duration-200 space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Seats Left
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Boxes className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm sm:text-lg font-black text-[#0F172A] dark:text-white truncate">
            {organization.stats.availableSeats}
          </div>
          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 truncate block">
            Available now
          </span>
        </div>

        {/* Pending Orders */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all duration-200 space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Pending
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm sm:text-lg font-black text-[#0F172A] dark:text-white truncate">
            {organization.stats.pendingBookings}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
            Gate queue
          </span>
        </div>

        {/* Payout Balance */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all duration-200 space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Ready Payout
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm sm:text-lg font-black text-[#0F172A] dark:text-white truncate">
            {formatCurrency(organization.stats.availableBalance)}
          </div>
          <Link
            href="/provider/payments"
            className="text-[10px] font-bold text-[#B45309] dark:text-amber-400 hover:underline flex items-center gap-0.5 truncate"
          >
            <span>Transfer</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Sales Trend Chart (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                Revenue & Sales Velocity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily settled transactions via Telebirr, CBE Birr & Chapa.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl self-start sm:self-auto">
              {(["7D", "30D", "90D"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === r
                      ? "bg-white dark:bg-[#161922] text-[#B45309] dark:text-amber-400 shadow-xs"
                      : "text-slate-500 hover:text-[#0F172A] dark:text-slate-400"
                  }`}
                >
                  {r === "7D" ? "7 Days" : r === "30D" ? "30 Days" : "Quarter"}
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

        {/* Category Share Donut (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
              Revenue by Service Sector
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Breakdown across coach, sports & entertainment.
            </p>
          </div>

          <DashboardPieChart data={categoryShareData} height={260} />
        </div>
      </div>

      {/* Top Routes & Recent Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Recent Customer Bookings (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                Recent Passenger Bookings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live booking activity feed</p>
            </div>
            <Link
              href="/provider/bookings"
              className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Desktop View Table: Soft borders, clean typography, 3-dot dropdown */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/60 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  <th className="py-2.5 px-3">Reference / Customer</th>
                  <th className="py-2.5 px-3">Service & Route</th>
                  <th className="py-2.5 px-3">Seats</th>
                  <th className="py-2.5 px-3">Fare</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs">
                {recentBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-[#0F172A] dark:text-white block">
                        {b.id}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                        {b.customer}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-[#0F172A] dark:text-slate-200 block truncate max-w-[170px]">
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
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <ActionDropdown
                        items={[
                          {
                            label: "View Booking Details",
                            icon: <Eye className="w-3.5 h-3.5" />,
                            href: `/provider/bookings`,
                          },
                          {
                            label: "Copy Reference ID",
                            icon: <Copy className="w-3.5 h-3.5" />,
                            onClick: () => handleCopy(b.id, "Reference"),
                          },
                          {
                            label: "Download E-Ticket",
                            icon: <Download className="w-3.5 h-3.5" />,
                            onClick: () => toast.success(`E-Ticket ${b.id} exported as PDF`),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: High-End Card Feed (No horizontal scrolling!) */}
          <div className="block md:hidden space-y-2.5">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40 space-y-2.5"
              >
                {/* Header: Reference + Status + 3-Dot Action */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#B45309] dark:text-amber-400">
                      {b.id}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <ActionDropdown
                    items={[
                      {
                        label: "View Details",
                        icon: <Eye className="w-3.5 h-3.5" />,
                        href: `/provider/bookings`,
                      },
                      {
                        label: "Copy Reference",
                        icon: <Copy className="w-3.5 h-3.5" />,
                        onClick: () => handleCopy(b.id, "Reference"),
                      },
                      {
                        label: "Download PDF",
                        icon: <Download className="w-3.5 h-3.5" />,
                        onClick: () => toast.success(`E-Ticket ${b.id} downloaded`),
                      },
                    ]}
                  />
                </div>

                {/* Service Details */}
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white leading-tight">
                    {b.service}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>{b.customer}</span>
                    <span>•</span>
                    <span className="font-mono">{b.seats}</span>
                  </div>
                </div>

                {/* Footer: Amount & Gateway */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-800/40 text-xs">
                  <span className="font-black text-[#0F172A] dark:text-white">
                    {formatCurrency(b.amount)}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-700/50 px-2 py-0.5 rounded-md">
                    {b.gateway}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Volumes & Field Operations (5 Cols) */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          {/* Highway Route Performance */}
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                  Top Route Volumes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Revenue by highway sector
                </p>
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
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B45309]" />
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                  Gate Inspectors On Duty
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10">
                {staffMembers.filter((s) => s.status === "ACTIVE").length} Active
              </span>
            </div>

            <div className="space-y-2">
              {staffMembers.slice(0, 3).map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {st.fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white block truncate">
                        {st.fullName}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        {st.assignedStation}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-medium text-slate-600 dark:text-slate-400 shrink-0">
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
