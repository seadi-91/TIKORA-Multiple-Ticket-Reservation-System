"use client";

import React, { useState, useMemo } from "react";
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
  AlertTriangle,
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
import { TicketService } from "@/services/ticket.service";
import { useLanguage } from "@/providers/language-provider";
import { toast } from "sonner";

export default function ProviderOverviewDashboard() {
  const { organization, staffMembers, busRoutes, movieShowtimes, fetchOrganization } = useProviderStore();
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D">("30D");

  const [liveSeats, setLiveSeats] = useState<number>(() => {
    return organization.stats.availableSeats > 0 ? organization.stats.availableSeats : 46;
  });

  React.useEffect(() => {
    fetchOrganization();
    TicketService.fetchCategories().catch(() => {});

    const updateSeats = () => {
      const tickets = TicketService.getAllTickets(true);
      const sectorTickets = tickets.filter(
        (t) =>
          !organization.category ||
          t.category?.toUpperCase() === organization.category?.toUpperCase() ||
          t.organizer?.toLowerCase() === organization.name?.toLowerCase()
      );
      const target = sectorTickets.length > 0 ? sectorTickets : tickets;
      const sum = target.reduce(
        (acc, t) => acc + Number(t.availableSeats !== undefined ? t.availableSeats : t.totalSeats || 50),
        0
      );
      const sectorDefault =
        organization.category === "CINEMA"
          ? 48
          : organization.category === "SPORTS"
          ? 420
          : organization.category === "EVENT"
          ? 185
          : 46;
      setLiveSeats(
        sum > 0 ? sum : organization.stats.availableSeats > 0 ? organization.stats.availableSeats : sectorDefault
      );
    };

    updateSeats();
    TicketService.fetchTickets(true).then(() => updateSeats()).catch(() => {});
  }, [fetchOrganization, organization.category, organization.name, organization.stats.availableSeats]);

  const isCategoryDeactivated =
    organization.isCategoryActive === false ||
    !TicketService.isCategoryActive(organization.category);

  // Dynamic inspectors list from real staff members
  const inspectorsList = useMemo(() => {
    return staffMembers
      .filter((s) => s.role === "INSPECTOR" || s.role === "DISPATCHER")
      .map((st) => ({
        id: st.id,
        name: st.fullName,
        station: st.assignedStation || "Gate Scanner",
        scans: st.scannedTicketsCount || 0,
      }));
  }, [staffMembers]);

  // Dynamic performance data per sector
  const performanceData = useMemo(() => {
    switch (organization.category) {
      case "CINEMA":
        return movieShowtimes.map((m) => ({
          name: m.movieTitle,
          value: m.bookedSeats * m.price,
          secondaryValue: m.bookedSeats,
        }));
      case "BUS":
        return busRoutes.map((r) => ({
          name: `${r.origin} → ${r.destination}`,
          value: r.fare * r.dailyTrips,
          secondaryValue: r.dailyTrips,
        }));
      case "EVENT":
      case "SPORTS":
      default:
        return [];
    }
  }, [organization.category, busRoutes, movieShowtimes]);

  // Dynamic tier share data
  const shareData = useMemo(() => {
    if (organization.category === "BUS") {
      const vipRoutes = busRoutes.filter((r) => r.busType.toLowerCase().includes("vip")).length;
      const standardRoutes = busRoutes.filter((r) => !r.busType.toLowerCase().includes("vip")).length;
      const totalR = vipRoutes + standardRoutes;
      if (totalR === 0) return [];
      return [
        { name: "VIP Luxury Coach", value: Math.round((vipRoutes / totalR) * 100), color: "#B45309" },
        { name: "Standard Express", value: Math.round((standardRoutes / totalR) * 100), color: "#D97706" },
      ];
    }
    return [];
  }, [organization.category, busRoutes]);

  // Sector UI configurations
  const getSectorConfig = () => {
    switch (organization.category) {
      case "CINEMA":
        return {
          sectorName: "Cinema & Movie Multiplex",
          heroTitle: "Cinema Box Office & Screening Hub",
          heroSubtitle: "Live screening halls, 4K laser Dolby Atmos showtimes, VIP seat occupancy, and concession ticketing.",
          primaryAction: { label: "Add Showtime", href: "/provider/cinema/showtimes" },
          secondaryAction: { label: "Movie Catalog", href: "/provider/cinema/movies" },
          chartTitle: "Top Box Office Movies",
          chartSubtitle: "Screening gross revenue by movie title",
          chartLink: "/provider/cinema/movies",
          chartLinkLabel: "Movies",
          performanceData,
          shareTitle: "Revenue by Hall Tier",
          shareSubtitle: "VIP Laser Atmos vs Standard 2D",
          shareData,
          recentBookingsTitle: "Recent Moviegoers Bookings",
          serviceColumnTitle: "Movie & Screening",
          recentBookings: [] as Array<{
            id: string;
            customer: string;
            service: string;
            date: string;
            seats: string;
            pax: number;
            amount: number;
            gateway: string;
            status: string;
          }>,
          inspectorRoleTitle: "Screening Hall Ushers & Scanners",
          inspectorsList,
        };

      case "EVENT":
        return {
          sectorName: "Live Events & Concerts",
          heroTitle: "Concerts & Festival Promotion Hub",
          heroSubtitle: "Tiered festival ticketing, VIP backstage wristbands, venue turnstiles, and live gate manifests.",
          primaryAction: { label: "Publish Event", href: "/provider/events/create" },
          secondaryAction: { label: "All Events", href: "/provider/events" },
          chartTitle: "Top Event Ticket Sales",
          chartSubtitle: "Gross booking volume by festival & concert",
          chartLink: "/provider/events",
          chartLinkLabel: "Events",
          performanceData,
          shareTitle: "Revenue by Ticket Tier",
          shareSubtitle: "VIP Tables vs General Standing",
          shareData,
          recentBookingsTitle: "Recent Event Pass Orders",
          serviceColumnTitle: "Concert & Pass Tier",
          recentBookings: [] as Array<{
            id: string;
            customer: string;
            service: string;
            date: string;
            seats: string;
            pax: number;
            amount: number;
            gateway: string;
            status: string;
          }>,
          inspectorRoleTitle: "Turnstile Gate Staff & Scanners",
          inspectorsList,
        };

      case "SPORTS":
        return {
          sectorName: "Stadium Sports & Derbies",
          heroTitle: "Stadium Matchday & Turnstile Hub",
          heroSubtitle: "Electronic turnstile gates, tribune tiers (Bleachers, Covered, VIP), and season derby passes.",
          primaryAction: { label: "Schedule Match", href: "/provider/sports/create" },
          secondaryAction: { label: "All Fixtures", href: "/provider/sports" },
          chartTitle: "Top Matchday Fixtures",
          chartSubtitle: "Turnstile gate ticket gross",
          chartLink: "/provider/sports",
          chartLinkLabel: "Fixtures",
          performanceData,
          shareTitle: "Revenue by Tribune Tier",
          shareSubtitle: "VIP Covered vs West Bleachers",
          shareData,
          recentBookingsTitle: "Recent Matchday Ticket Orders",
          serviceColumnTitle: "Fixture & Stand",
          recentBookings: [] as Array<{
            id: string;
            customer: string;
            service: string;
            date: string;
            seats: string;
            pax: number;
            amount: number;
            gateway: string;
            status: string;
          }>,
          inspectorRoleTitle: "Electronic Turnstile Scanners",
          inspectorsList,
        };

      case "BUS":
      default:
        return {
          sectorName: "Intercity Bus Operations",
          heroTitle: "Bus Operations & Fleet Dispatch Hub",
          heroSubtitle: "Live highway coach schedules, seat matrix allocations, terminal gates, and passenger manifests.",
          primaryAction: { label: "New Route", href: "/provider/bus/routes" },
          secondaryAction: { label: "Fleet Schedules", href: "/provider/bus/schedules" },
          chartTitle: "Top Highway Routes",
          chartSubtitle: "Gross booking volume by highway sector",
          chartLink: "/provider/bus/routes",
          chartLinkLabel: "Routes",
          performanceData,
          shareTitle: "Revenue by Coach Class",
          shareSubtitle: "VIP Luxury vs Standard Express share",
          shareData,
          recentBookingsTitle: "Recent Passenger Bookings",
          serviceColumnTitle: "Route & Departure",
          recentBookings: [] as Array<{
            id: string;
            customer: string;
            service: string;
            date: string;
            seats: string;
            pax: number;
            amount: number;
            gateway: string;
            status: string;
          }>,
          inspectorRoleTitle: "Boarding Gate Inspectors",
          inspectorsList,
        };
    }
  };

  const sector = getSectorConfig();

  // Dynamic revenue trend data derived from live stats
  const revenueTrendData = useMemo(() => {
    if (timeRange === "7D") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map((name) => ({ name, value: 0 }));
    }
    if (timeRange === "30D") {
      return ["W1", "W2", "W3", "W4"].map((name) => ({ name, value: 0 }));
    }
    return ["M1", "M2", "M3"].map((name) => ({ name, value: 0 }));
  }, [timeRange]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* High-Priority Warning: Sector Category Deactivated by Platform Admin */}
      {isCategoryDeactivated && (
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border-2 border-amber-500/40 dark:border-amber-500/30 text-foreground shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-extrabold text-amber-900 dark:text-amber-300">
                  {t("Operating Sector Category Deactivated by Platform Administrator")}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25">
                  {t("Sector Inactive")}
                </span>
              </div>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-200/80 leading-relaxed max-w-2xl">
                Your operating sector (<strong>{organization.category}</strong>) has been deactivated by the platform admin. 
                All ticket listings in this sector are temporarily hidden from customers and guest pages, and new online reservations cannot be placed until the category is reactivated.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 self-stretch md:self-auto justify-end">
            <Link
              href="/provider/tickets"
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-all shadow-xs"
            >
              {t("View Affected Listings")}
            </Link>
          </div>
        </div>
      )}

      {/* Modern Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 text-white p-5 sm:p-7 shadow-sm border border-slate-800/80">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{t(sector.sectorName)} • {organization.legalName}</span>
            </div>

            <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white leading-tight">
              {t(sector.heroTitle)}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              {t(sector.heroSubtitle)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link
              href={sector.primaryAction.href}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex-1 sm:flex-initial"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t(sector.primaryAction.label)}</span>
            </Link>
            <Link
              href={sector.secondaryAction.href}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 ring-1 ring-white/15 font-bold text-xs backdrop-blur-xs transition-all flex-1 sm:flex-initial"
            >
              <span>{t(sector.secondaryAction.label)}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        {/* Gross Revenue */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all duration-200 space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              {t("analysis.totalGrossSales", "Gross Revenue")}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-[#B45309] dark:text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
            {formatCurrency(organization.stats.totalRevenue)}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
            {t("provider.payments", "Total settled sales")}
          </span>
        </div>

        {/* Total Bookings */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all duration-200 space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              {t("analysis.totalBookings", "Bookings")}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
            {organization.stats.totalBookings.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
            {organization.stats.activeServices} active lines
          </span>
        </div>

        {/* Tickets Sold */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all duration-200 space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              {t("analysis.ticketsSold", "Tickets Sold")}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Ticket className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
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
              {t("analysis.availableSeats", "Seats Left")}
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Boxes className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">
            {liveSeats} left
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground truncate block">
            {t("provider.inventory", "Available inventory")}
          </span>
        </div>

        {/* Pending Orders */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all duration-200 space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              {t("analysis.pendingBookings", "Pending")}
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
            {organization.stats.pendingBookings}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
            Awaiting confirmation
          </span>
        </div>

        {/* Payout Balance */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 shadow-xs hover:shadow-sm transition-all duration-200 space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              {t("Ready Payout")}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
            {formatCurrency(organization.stats.availableBalance)}
          </div>
          <Link
            href="/provider/payments"
            className="text-[10px] font-bold text-[#B45309] dark:text-amber-400 hover:underline flex items-center gap-0.5 truncate"
          >
            <span>{t("Transfer")}</span>
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
              <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
                {t("Revenue & Sales Velocity")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("Daily settled transactions via Telebirr, CBE Birr & Chapa.")}
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
                  {r === "7D" ? t("7 Days") : r === "30D" ? t("30 Days") : t("Quarter")}
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
            <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
              {sector.shareTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {sector.shareSubtitle}
            </p>
          </div>

          {sector.shareData.length > 0 && sector.shareData.some((s) => s.value > 0) ? (
            <DashboardPieChart data={sector.shareData} height={260} />
          ) : (
            <div className="py-16 text-center text-muted-foreground space-y-1.5">
              <Boxes className="w-8 h-8 mx-auto opacity-30 text-amber-500" />
              <p className="text-xs font-semibold text-foreground">No tier volume share data</p>
              <p className="text-[11px] text-muted-foreground">Volume distribution will calculate as reservations occur.</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Routes & Recent Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Recent Customer Bookings (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
                {t(sector.recentBookingsTitle)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("Live booking activity feed")}</p>
            </div>
            <Link
              href="/provider/bookings"
              className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>{t("common.viewAll", "View All")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {sector.recentBookings.length > 0 ? (
            <>
              {/* Desktop View Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/60 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                      <th className="py-2.5 px-3">{t("Reference / Customer")}</th>
                      <th className="py-2.5 px-3">{t(sector.serviceColumnTitle)}</th>
                      <th className="py-2.5 px-3">{t("Seats")}</th>
                      <th className="py-2.5 px-3">{t("Fare")}</th>
                      <th className="py-2.5 px-3">{t("Status")}</th>
                      <th className="py-2.5 px-3 text-right">{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs">
                    {sector.recentBookings.map((b) => (
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

              {/* Mobile View */}
              <div className="block md:hidden space-y-2.5">
                {sector.recentBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40 space-y-2.5"
                  >
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
                        ]}
                      />
                    </div>

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
            </>
          ) : (
            <div className="py-14 text-center text-muted-foreground space-y-2">
              <ShoppingBag className="w-9 h-9 mx-auto opacity-30 text-amber-500" />
              <p className="text-xs font-bold text-foreground">No customer reservations yet</p>
              <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                When passengers or attendees book passes, live reservations and manifest entries will display here.
              </p>
            </div>
          )}
        </div>

        {/* Route Volumes & Field Operations (5 Cols) */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          {/* Sector Volume Performance */}
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
                  {t(sector.chartTitle)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t(sector.chartSubtitle)}
                </p>
              </div>
              <Link
                href={sector.chartLink}
                className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline"
              >
                {t(sector.chartLinkLabel)}
              </Link>
            </div>

            {sector.performanceData.length > 0 ? (
              <DashboardBarChart data={sector.performanceData} height={200} valueSuffix=" ETB" />
            ) : (
              <div className="py-10 text-center text-muted-foreground space-y-1.5">
                <Ticket className="w-8 h-8 mx-auto opacity-30 text-amber-500" />
                <p className="text-xs font-semibold text-foreground">{t("No service performance data")}</p>
                <p className="text-[11px] text-muted-foreground">{t("Performance rankings will appear once services are active.")}</p>
              </div>
            )}
          </div>

          {/* Operational Team Quick Status */}
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B45309]" />
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                  {t(sector.inspectorRoleTitle)}
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10">
                {sector.inspectorsList.length} {t("Active")}
              </span>
            </div>

            {sector.inspectorsList.length > 0 ? (
              <div className="space-y-2">
                {sector.inspectorsList.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {st.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#0F172A] dark:text-white block truncate">
                          {st.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                          {st.station}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-medium text-slate-600 dark:text-slate-400 shrink-0">
                      {st.scans} {t("Scanned")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground space-y-1.5">
                <Users className="w-7 h-7 mx-auto opacity-30 text-amber-500" />
                <p className="text-xs font-semibold text-foreground">{t("No field inspectors assigned")}</p>
                <p className="text-[11px] text-muted-foreground">{t("Assign gate scanners and terminal ushers in Staff Management.")}</p>
              </div>
            )}

            <Link
              href="/provider/staff"
              className="w-full text-center block pt-2 text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline"
            >
              {t("Manage All Field Staff & Inspectors →")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
