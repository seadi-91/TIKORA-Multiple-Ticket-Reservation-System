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
  const { organization, staffMembers } = useProviderStore();
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D">("30D");

  // Dynamic sector configuration strictly tailored to the organization's category
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
          performanceData: [
            { name: "Avatar: Fire & Ash 3D", value: 182000, secondaryValue: 520 },
            { name: "Dune: Part Two Atmos", value: 135000, secondaryValue: 390 },
            { name: "Gladiator II 4K Laser", value: 98000, secondaryValue: 280 },
            { name: "Habesha Romance Comedy", value: 76000, secondaryValue: 210 },
          ],
          shareTitle: "Revenue by Hall Tier",
          shareSubtitle: "VIP Laser Atmos vs Standard 2D",
          shareData: [
            { name: "VIP Laser Atmos", value: 55, color: "#6366F1" },
            { name: "3D Digital Hall 1", value: 30, color: "#818CF8" },
            { name: "Standard 2D Hall 2", value: 15, color: "#A5B4FC" },
          ],
          recentBookingsTitle: "Recent Moviegoers Bookings",
          serviceColumnTitle: "Movie & Screening",
          recentBookings: [
            { id: "TH-CIN-8829", customer: "Dawit Mengistu", service: "Avatar: Fire & Ash 3D (04:30 PM)", date: "Nov 15, 2026", seats: "F12, F13", pax: 2, amount: 900, gateway: "Telebirr", status: "CONFIRMED" },
            { id: "TH-CIN-8830", customer: "Lidia Hailu", service: "Dune: Part Two Dolby Atmos (07:00 PM)", date: "Nov 15, 2026", seats: "VIP C4", pax: 1, amount: 650, gateway: "CBE Birr", status: "CONFIRMED" },
            { id: "TH-CIN-8831", customer: "Mikiyas Girma", service: "Gladiator II 4K Laser (08:30 PM)", date: "Nov 16, 2026", seats: "E08, E09", pax: 2, amount: 900, gateway: "Telebirr", status: "CONFIRMED" },
            { id: "TH-CIN-8832", customer: "Tigist Alemu", service: "Habesha Wedding Comedy (02:00 PM)", date: "Nov 16, 2026", seats: "D05", pax: 1, amount: 350, gateway: "Chapa", status: "PENDING" },
          ],
          inspectorRoleTitle: "Screening Hall Ushers & Scanners",
          inspectorsList: [
            { id: "cin-st-1", name: "Daniel Assefa", station: "Hall 1 (VIP Laser Gate)", scans: 840 },
            { id: "cin-st-2", name: "Sara Tekle", station: "Hall 2 (Dolby Atmos)", scans: 620 },
            { id: "cin-st-3", name: "Brook Haile", station: "Concession Lobby Scanner", scans: 410 },
          ],
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
          performanceData: [
            { name: "Addis Jazz & Blues Fest", value: 240000, secondaryValue: 480 },
            { name: "Afrobeat Live Millennium", value: 195000, secondaryValue: 390 },
            { name: "New Year Eve Grand Gala", value: 160000, secondaryValue: 250 },
            { name: "Tech Expo Summit 2026", value: 85000, secondaryValue: 190 },
          ],
          shareTitle: "Revenue by Ticket Tier",
          shareSubtitle: "VIP Tables vs General Standing",
          shareData: [
            { name: "VIP Tables & Lounges", value: 48, color: "#D97706" },
            { name: "General Admission", value: 38, color: "#B45309" },
            { name: "Early Bird Tickets", value: 14, color: "#F59E0B" },
          ],
          recentBookingsTitle: "Recent Event Pass Orders",
          serviceColumnTitle: "Concert & Pass Tier",
          recentBookings: [
            { id: "TH-EVT-8829", customer: "Dawit Mengistu", service: "Addis International Jazz & Afrobeat Festival", date: "Nov 20, 2026", seats: "VIP Table 4", pax: 4, amount: 3944, gateway: "Chapa", status: "CONFIRMED" },
            { id: "TH-EVT-8830", customer: "Hiwot Assefa", service: "Afrobeat Live Festival - Millennium Hall", date: "Nov 21, 2026", seats: "General Standing x2", pax: 2, amount: 1600, gateway: "Telebirr", status: "CONFIRMED" },
            { id: "TH-EVT-8831", customer: "Kassahun Desta", service: "Ethiopian New Year Eve Music Night", date: "Nov 25, 2026", seats: "Front Row VIP", pax: 1, amount: 2500, gateway: "CBE Birr", status: "CONFIRMED" },
            { id: "TH-EVT-8832", customer: "Sara Tefera", service: "Tech & Startup Innovation Gala", date: "Nov 28, 2026", seats: "Delegate Pass", pax: 1, amount: 1200, gateway: "Telebirr", status: "PENDING" },
          ],
          inspectorRoleTitle: "Turnstile Gate Staff & Scanners",
          inspectorsList: [
            { id: "evt-st-1", name: "Almaz Kassa", station: "Main Gate Turnstile A", scans: 1280 },
            { id: "evt-st-2", name: "Yared Belay", station: "VIP Wristband Booth", scans: 690 },
            { id: "evt-st-3", name: "Helen Negash", station: "Backstage Accreditation", scans: 310 },
          ],
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
          performanceData: [
            { name: "St. George vs Coffee", value: 290000, secondaryValue: 850 },
            { name: "Fasil Kenema Derby", value: 165000, secondaryValue: 480 },
            { name: "Bahir Dar City Match", value: 120000, secondaryValue: 350 },
            { name: "Adama City Match", value: 95000, secondaryValue: 280 },
          ],
          shareTitle: "Revenue by Tribune Tier",
          shareSubtitle: "VIP Covered vs West Bleachers",
          shareData: [
            { name: "Covered VIP Tribune", value: 50, color: "#10B981" },
            { name: "West Bleachers", value: 30, color: "#059669" },
            { name: "East Gate General", value: 20, color: "#34D399" },
          ],
          recentBookingsTitle: "Recent Matchday Ticket Orders",
          serviceColumnTitle: "Fixture & Stand",
          recentBookings: [
            { id: "TH-SPT-8829", customer: "Marta Solomon", service: "St. George SC vs Ethiopian Coffee SC (Derby)", date: "Nov 18, 2026", seats: "VIP Tribune A-12", pax: 1, amount: 800, gateway: "Telebirr", status: "CONFIRMED" },
            { id: "TH-SPT-8830", customer: "Abel Kebede", service: "Ethiopian Premier League Matchday 14", date: "Nov 19, 2026", seats: "Covered Stand Gate 2", pax: 2, amount: 1000, gateway: "CBE Birr", status: "CONFIRMED" },
            { id: "TH-SPT-8831", customer: "Yonas Mekonnen", service: "National Cup Semi-Final Clash", date: "Nov 22, 2026", seats: "West Bleachers x2", pax: 2, amount: 400, gateway: "Telebirr", status: "CONFIRMED" },
            { id: "TH-SPT-8832", customer: "Eden Daniel", service: "Addis City Basketball Finals: Game 5", date: "Nov 24, 2026", seats: "Court-Side Row 2", pax: 2, amount: 1044, gateway: "Chapa", status: "PENDING" },
          ],
          inspectorRoleTitle: "Electronic Turnstile Scanners",
          inspectorsList: [
            { id: "spt-st-1", name: "Tilahun Girmay", station: "Turnstile Gate 4 (Grandstand)", scans: 1450 },
            { id: "spt-st-2", name: "Binyam Worku", station: "Turnstile 1 (VIP Tribune)", scans: 820 },
            { id: "spt-st-3", name: "Solomon Abebe", station: "North Bleachers Turnstile", scans: 950 },
          ],
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
          performanceData: [
            { name: "Addis → Hawassa", value: 185000, secondaryValue: 240 },
            { name: "Addis → Bahir Dar", value: 142000, secondaryValue: 180 },
            { name: "Addis → Dire Dawa", value: 92000, secondaryValue: 110 },
            { name: "Addis → Gondar", value: 63500, secondaryValue: 65 },
          ],
          shareTitle: "Revenue by Coach Class",
          shareSubtitle: "VIP Luxury vs Standard Express share",
          shareData: [
            { name: "VIP Luxury Coach", value: 58, color: "#B45309" },
            { name: "Standard Express", value: 32, color: "#D97706" },
            { name: "Minibus Shuttle", value: 10, color: "#F59E0B" },
          ],
          recentBookingsTitle: "Recent Passenger Bookings",
          serviceColumnTitle: "Route & Departure",
          recentBookings: [
            { id: "TH-BUS-8829", customer: "Abebe Bekele", service: "Addis Ababa → Hawassa (06:00 AM)", date: "Nov 15, 2026", seats: "12A, 12B", pax: 2, amount: 1508, gateway: "Telebirr", status: "CONFIRMED" },
            { id: "TH-BUS-8830", customer: "Selamawit Tadesse", service: "Addis Ababa → Bahir Dar (05:30 AM)", date: "Nov 15, 2026", seats: "04A", pax: 1, amount: 1102, gateway: "CBE Birr", status: "CONFIRMED" },
            { id: "TH-BUS-8831", customer: "Yared Tesfaye", service: "Addis Ababa → Jimma Express (06:30 AM)", date: "Nov 16, 2026", seats: "07B, 07C", pax: 2, amount: 1350, gateway: "Telebirr", status: "CONFIRMED" },
            { id: "TH-BUS-8832", customer: "Bethlehem Assefa", service: "Addis Ababa → Dire Dawa (05:00 AM)", date: "Nov 16, 2026", seats: "15A", pax: 1, amount: 1250, gateway: "Chapa", status: "PENDING" },
          ],
          inspectorRoleTitle: "Boarding Gate Inspectors",
          inspectorsList: [
            { id: "bus-st-1", name: "Tewodros Kassahun", station: "Autobus Tera Gate 3", scans: 1420 },
            { id: "bus-st-2", name: "Almaz Kebede", station: "Lamberet Terminal Bay 2", scans: 890 },
            { id: "bus-st-3", name: "Dawit Wolde", station: "Kality Cross-country Bay", scans: 540 },
          ],
        };
    }
  };

  const sector = getSectorConfig();

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
              <span className="truncate">{sector.sectorName} • {organization.legalName}</span>
            </div>

            <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white leading-tight">
              {sector.heroTitle}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              {sector.heroSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link
              href={sector.primaryAction.href}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex-1 sm:flex-initial"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{sector.primaryAction.label}</span>
            </Link>
            <Link
              href={sector.secondaryAction.href}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 ring-1 ring-white/15 font-bold text-xs backdrop-blur-xs transition-all flex-1 sm:flex-initial"
            >
              <span>{sector.secondaryAction.label}</span>
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
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
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
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
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
              Seats Left
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Boxes className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
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
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
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
          <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
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
              <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
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
            <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
              {sector.shareTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {sector.shareSubtitle}
            </p>
          </div>

          <DashboardPieChart data={sector.shareData} height={260} />
        </div>
      </div>

      {/* Top Routes & Recent Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Recent Customer Bookings (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
                {sector.recentBookingsTitle}
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
                  <th className="py-2.5 px-3">{sector.serviceColumnTitle}</th>
                  <th className="py-2.5 px-3">Seats</th>
                  <th className="py-2.5 px-3">Fare</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
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

          {/* Mobile View: High-End Card Feed (No horizontal scrolling!) */}
          <div className="block md:hidden space-y-2.5">
            {sector.recentBookings.map((b) => (
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
          {/* Sector Volume Performance */}
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
                  {sector.chartTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {sector.chartSubtitle}
                </p>
              </div>
              <Link
                href={sector.chartLink}
                className="text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline"
              >
                {sector.chartLinkLabel}
              </Link>
            </div>

            <DashboardBarChart data={sector.performanceData} height={200} valueSuffix=" ETB" />
          </div>

          {/* Operational Team Quick Status */}
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B45309]" />
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                  {sector.inspectorRoleTitle}
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10">
                {sector.inspectorsList.length} Active
              </span>
            </div>

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
                    {st.scans} Scanned
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
