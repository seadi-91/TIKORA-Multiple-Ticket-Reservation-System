"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  Users,
  ChevronLeft,
  Building2,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  Printer,
  ExternalLink,
  Award,
  Wallet,
  ShoppingBag,
  Sparkles,
  Fingerprint,
  Search,
  Filter,
  CreditCard,
  History,
  Lock,
  Smartphone,
  Globe,
  Tag,
  Key,
  BadgeCheck,
  Bus,
  Film,
  Trophy,
  ArrowRight,
  AlertTriangle,
  Send,
  RotateCw,
  FileText,
  Activity,
  Layers,
} from "lucide-react";
import { useAdminStore, AdminBooking } from "@/stores/admin.store";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default function AdminUserDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);

  const {
    users,
    bookings,
    toggleUserStatus,
  } = useAdminStore();

  const user = users.find((u) => u.id === resolvedParams.userId);

  // Active Tab state for clean, un-fragmented navigation
  const [activeTab, setActiveTab] = useState<"profile" | "bookings" | "finance" | "security">("profile");

  // Booking table search and category filter
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingCategory, setBookingCategory] = useState<string>("ALL");

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <Users className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Platform User Account Not Found</h2>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          The requested user account ID <span className="font-mono font-semibold">{resolvedParams.userId}</span> could not be located in the platform database.
        </p>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-md shadow-amber-600/20"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Platform Users</span>
        </Link>
      </div>
    );
  }

  // Filter bookings related to this user by email or name
  const rawUserBookings = bookings.filter(
    (b) =>
      b.customerEmail.toLowerCase() === user.email.toLowerCase() ||
      b.customerName.toLowerCase() === user.name.toLowerCase() ||
      (user.phone && b.customerPhone === user.phone)
  );

  const userBookings: AdminBooking[] = rawUserBookings;

  const filteredBookings = userBookings.filter((b) => {
    const matchesQuery =
      b.reference.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.providerName.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchesCategory = bookingCategory === "ALL" || b.category === bookingCategory;
    return matchesQuery && matchesCategory;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return {
          bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/20",
          label: "Super Admin",
        };
      case "ORGANIZATION":
        return {
          bg: "bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-blue-500/20",
          label: "Provider Partner",
        };
      case "INSPECTOR":
        return {
          bg: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 ring-cyan-500/20",
          label: "Field Gate Inspector",
        };
      default:
        return {
          bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20",
          label: "Verified Customer",
        };
    }
  };

  const getSectorIcon = (cat: string) => {
    switch (cat) {
      case "BUS":
        return <Bus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "CINEMA":
        return <Film className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case "EVENT":
        return <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case "SPORTS":
        return <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Tag className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const roleMeta = getRoleBadge(user.role);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Platform Users Directory</span>
        </Link>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              toast.success(`Security password reset link dispatched to ${user.email}`);
            }}
            className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-card border border-slate-200/70 dark:border-slate-800/70 text-foreground hover:bg-muted transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Key className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Reset Password</span>
          </button>

          <button
            type="button"
            onClick={() => {
              toast.success(`Direct SMS notification dispatched to ${user.phone}`);
            }}
            className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-card border border-slate-200/70 dark:border-slate-800/70 text-foreground hover:bg-muted transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Send className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Send SMS Notice</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-2 py-0.5 text-micro font-medium rounded-md bg-card border border-slate-200/70 dark:border-slate-800/70 text-foreground hover:bg-muted transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Printer className="w-3 h-3 text-slate-500" />
            <span>Print Dossier</span>
          </button>

          {user.role !== "ADMIN" && (
            <button
              type="button"
              onClick={() => {
                toggleUserStatus(user.id);
                toast.success(
                  user.status === "ACTIVE"
                    ? `Account suspended for ${user.name}`
                    : `Account reactivated for ${user.name}`
                );
              }}
              className={`px-2 py-0.5 text-micro font-semibold rounded-md transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
                user.status === "ACTIVE"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 ring-1 ring-inset ring-rose-500/20"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 ring-1 ring-inset ring-emerald-500/20"
              }`}
            >
              {user.status === "ACTIVE" ? (
                <>
                  <UserX className="w-3 h-3" />
                  <span>Suspend Account</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3 h-3" />
                  <span>Reactivate Account</span>
                </>
              )}
            </button>
          )}

          {user.organizationName && (
            <Link
              href={`/admin/providers?q=${encodeURIComponent(user.organizationName)}`}
              className="px-2 py-0.5 text-micro font-medium rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 transition-colors flex items-center gap-1 ring-1 ring-inset ring-blue-500/20"
            >
              <Building2 className="w-3 h-3" />
              <span>Provider Profile</span>
            </Link>
          )}
        </div>
      </div>

      {/* Unified Hero Profile & Identity Banner (Single Spacious Cohesive Card - NO small cards overload) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-6">
        {/* Top Profile Header: Avatar, Names, Badges */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0 ring-4 ring-amber-500/15">
              {user.name.charAt(0)}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight truncate">
                  {user.name}
                </h1>
                {user.amharicName && (
                  <span className="text-sm font-semibold text-muted-foreground font-mono">
                    ({user.amharicName})
                  </span>
                )}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ring-1 ring-inset ${roleMeta.bg}`}
                >
                  {roleMeta.label}
                </span>
                {user.status === "ACTIVE" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Account
                  </span>
                ) : user.status === "SUSPENDED" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Suspended
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    Inactive
                  </span>
                )}
              </div>

              {/* Identity & Verification Pill */}
              <div className="flex items-center gap-2.5 flex-wrap text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>Fayda ID: {user.nationalId || "ET-FAN-PENDING"}</span>
                </span>
                <span>•</span>
                <span className="font-mono text-foreground font-semibold">ID: {user.id}</span>
                {user.organizationName && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                      <Building2 className="w-3.5 h-3.5 text-blue-500" />
                      {user.organizationName}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {user.kycStatus === "VERIFIED" ? "KYC Level 2 Verified" : "KYC Pending Verification"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact & Geographic Location Ribbon */}
          <div className="flex flex-wrap lg:flex-col lg:items-end gap-2 text-xs text-muted-foreground font-medium pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
            <a
              href={`tel:${user.phone}`}
              className="inline-flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{user.phone}</span>
            </a>
            <a
              href={`mailto:${user.email}`}
              className="inline-flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{user.email}</span>
            </a>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{user.city || "Addis Ababa"}, Ethiopia</span>
            </span>
          </div>
        </div>

        {/* Integrated KPI Metrics Ribbon (Cohesive Horizontal Row with Dividers - NOT detached small cards!) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-3 px-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60 divide-y md:divide-y-0 md:divide-x divide-slate-200/60 dark:divide-slate-800/60">
            {/* Lifetime Spend */}
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Total Lifetime GMV
              </span>
              <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                {(user.totalSpentETB || 0).toLocaleString()} <span className="text-xs font-normal">ETB</span>
              </div>
              <span className="text-[10px] text-muted-foreground block truncate">
                Total settled value
              </span>
            </div>

            {/* Total Bookings */}
            <div className="space-y-0.5 md:pl-4 pt-2 md:pt-0">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Platform Orders
              </span>
              <div className="text-base sm:text-lg font-black text-foreground font-mono">
                {user.totalBookings || userBookings.length}{" "}
                <span className="text-xs font-normal text-muted-foreground">Bookings</span>
              </div>
              <span className="text-[10px] text-muted-foreground block truncate">
                Bus, Cinema & Events
              </span>
            </div>

            {/* Loyalty Points */}
            <div className="space-y-0.5 md:pl-4 pt-2 md:pt-0">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Loyalty Rewards
              </span>
              <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {user.loyaltyPoints || 0}{" "}
                <span className="text-xs font-normal text-muted-foreground">Pts</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block truncate">
                {user.loyaltyPoints && user.loyaltyPoints > 200 ? "Gold Member Tier" : "Standard Tier"}
              </span>
            </div>

            {/* Preferred Gateway */}
            <div className="space-y-0.5 md:pl-4 pt-2 md:pt-0">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Preferred Payment
              </span>
              <div className="text-sm sm:text-base font-bold text-foreground font-mono">
                {user.preferredPayment || "TELEBIRR"}
              </div>
              <span className="text-[10px] text-muted-foreground block truncate">
                Automated Settlement
              </span>
            </div>

            {/* Security Status */}
            <div className="space-y-0.5 md:pl-4 pt-2 md:pt-0 col-span-2 md:col-span-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Account Security
              </span>
              <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{user.twoFactorEnabled !== false ? "2FA Active" : "Standard Auth"}</span>
              </div>
              <span className="text-[10px] text-muted-foreground block truncate">
                SMS OTP Authenticated
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Profile, Bookings, Finance, Security) */}
      <div className="flex items-center gap-1.5 border-b border-slate-200/60 dark:border-slate-800/60 pb-2 overflow-x-auto">
        {[
          { id: "profile", label: "Identity & Profile Dossier", icon: <Fingerprint className="w-3 h-3" /> },
          {
            id: "bookings",
            label: "Bookings & Tickets Ledger",
            count: userBookings.length,
            icon: <ShoppingBag className="w-3 h-3" />,
          },
          { id: "finance", label: "Financial Activity & Payments", icon: <Wallet className="w-3 h-3" /> },
          { id: "security", label: "Security & Governance Audit", icon: <Shield className="w-3 h-3" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-2 py-1 text-micro font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? "bg-amber-600 text-white shadow-xs font-semibold"
                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-nano font-bold ${
                  activeTab === tab.id ? "bg-white/25 text-white" : "bg-muted-foreground/15 text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: Identity & Profile Dossier (Spacious Two-Column Panels - Clean, Structured & Un-Fragmented) */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel (6 cols): Official National Registration & Residence */}
          <div className="lg:col-span-6 rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-amber-600" />
                <span>Official Ethiopian National Identity</span>
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                INSA Verified
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Full Legal Name (English)</span>
                <span className="font-bold text-foreground text-right">{user.name}</span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Full Legal Name (Amharic)</span>
                <span className="font-bold text-foreground text-right">{user.amharicName || "—"}</span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">National Fayda ID Number</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-right">
                  {user.nationalId || "ET-FAN-PENDING"}
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Fayda Verification Status</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified via Federal INSA Gateway
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Date of Birth & Age</span>
                <span className="font-mono text-foreground text-right">
                  {user.dateOfBirth || "1994-04-12"} (32 yrs)
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Gender</span>
                <span className="text-foreground font-medium text-right">{user.gender || "Male"}</span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">City & Region</span>
                <span className="text-foreground font-semibold text-right">{user.city || "Addis Ababa"}, Ethiopia</span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Sub-City & Woreda</span>
                <span className="text-foreground text-right">{user.woreda || "Bole Sub-City, Woreda 03"}</span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Kebele & Residential Address</span>
                <span className="text-foreground text-right font-medium max-w-[280px]">
                  {user.address || "Bole Sub-City, Woreda 03, House 412, Addis Ababa"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel (6 cols): Platform Governance, Access & Device Environment */}
          <div className="lg:col-span-6 rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Governance & Authentication Metadata</span>
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Access Audit
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Platform Account ID</span>
                <span className="font-mono font-bold text-foreground text-right">{user.id}</span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Assigned Platform Role</span>
                <span className="font-bold text-foreground text-right">{roleMeta.label}</span>
              </div>

              {user.organizationName && (
                <div className="py-3 flex items-center justify-between gap-4">
                  <span className="text-muted-foreground font-semibold">Affiliated Organization</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-right">{user.organizationName}</span>
                </div>
              )}

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Onboarding Origin & Authority</span>
                <span className="text-foreground font-medium text-right">
                  {user.addedBy?.name || "Telebirr SSO OAuth Gateway"}
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Two-Factor Authentication (2FA)</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active (SMS OTP to {user.phone})
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Primary Client Device</span>
                <span className="text-foreground text-right font-mono text-[11px]">
                  {user.deviceInfo || "Samsung Galaxy S24 Ultra • Android 14 • Chrome 128"}
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Last Known IP Address</span>
                <span className="text-foreground text-right font-mono text-[11px]">
                  {user.ipAddress || "197.156.103.42 (Addis Ababa - Ethio Telecom)"}
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Registration Timestamp</span>
                <span className="font-mono text-muted-foreground text-right">{user.createdAt}</span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-semibold">Last Active Login Session</span>
                <span className="font-mono text-foreground font-bold text-right">{user.lastLogin}</span>
              </div>

              {user.status === "SUSPENDED" && user.suspendedReason && (
                <div className="py-3 flex items-start justify-between gap-4 bg-rose-500/5 -mx-6 px-6 border-y border-rose-500/20">
                  <span className="text-rose-600 font-bold shrink-0">Suspension Reason</span>
                  <span className="text-rose-700 dark:text-rose-300 text-right font-semibold">
                    {user.suspendedReason}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Bookings & Tickets History (Full-Width Spacious Table - NO small cards!) */}
      {activeTab === "bookings" && (
        <div className="rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Reserved Tickets & Bookings Ledger</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete record of platform tickets purchased across Intercity Bus, Cinema, Sports, and Concerts.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Filter reference or event..."
                  className="h-7 pl-7 pr-2.5 text-micro rounded-md bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <select
                value={bookingCategory}
                onChange={(e) => setBookingCategory(e.target.value)}
                className="h-7 px-2 text-micro rounded-md bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              >
                <option value="ALL">All Categories</option>
                <option value="BUS">Bus Transport</option>
                <option value="CINEMA">Cinemas</option>
                <option value="EVENT">Concerts & Events</option>
                <option value="SPORTS">Sports Stadiums</option>
              </select>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto opacity-30" />
              <p className="text-xs font-semibold text-foreground">No bookings recorded</p>
              <p className="text-[11px] text-muted-foreground">
                There are no ticket reservations matching the selected filter criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[940px]">
                <thead className="bg-slate-50/70 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Booking Reference</th>
                    <th className="px-5 py-3.5">Service & Operator</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Category</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Seats / Qty</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Total Paid</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Payment Gateway</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {filteredBookings.map((bk) => (
                    <tr
                      key={bk.id}
                      className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-foreground whitespace-nowrap">
                        {bk.reference}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-foreground">{bk.serviceTitle}</div>
                        <div className="text-[11px] text-muted-foreground">{bk.providerName}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-foreground border border-slate-200/50 dark:border-slate-700/50">
                          {getSectorIcon(bk.category)}
                          <span>{bk.category}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-mono text-foreground font-semibold">
                        {bk.quantity} Ticket{bk.quantity > 1 ? "s" : ""}
                        {bk.seatNumbers && bk.seatNumbers.length > 0 && (
                          <span className="block text-[11px] text-muted-foreground">
                            [{bk.seatNumbers.join(", ")}]
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-mono font-black text-amber-600 dark:text-amber-400">
                        {bk.totalAmount.toLocaleString()} ETB
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono font-semibold text-[11px] text-foreground">
                          <CreditCard className="w-3 h-3 text-slate-400" />
                          {bk.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {bk.bookingStatus === "CONFIRMED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Confirmed
                          </span>
                        ) : bk.bookingStatus === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-mono text-muted-foreground text-[11px]">
                        {bk.bookingDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Financial Activity & Payments (Ledger & Payment Streams - Spacious & Cohesive) */}
      {activeTab === "finance" && (
        <div className="rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Wallet className="w-4 h-4 text-amber-600" />
                <span>Financial Transactions & Settlement History</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Itemized payments, gateway provider references, and refunds processed for this account.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground">
                Lifetime Volume:{" "}
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {(user.totalSpentETB || 0).toLocaleString()} ETB
                </span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[900px]">
              <thead className="bg-slate-50/70 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Transaction ID</th>
                  <th className="px-5 py-3.5">Associated Booking</th>
                  <th className="px-4 py-3.5">Payment Channel</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Gross Amount</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Platform Fee</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Gateway Ref</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {userBookings.map((bk, idx) => (
                  <tr key={`tx-${bk.id}-${idx}`} className="hover:bg-amber-500/[0.03] transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-foreground">
                      TXN-2026-{1000 + idx}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-foreground">{bk.reference}</div>
                      <div className="text-[11px] text-muted-foreground">{bk.serviceTitle}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        {bk.paymentMethod === "TELEBIRR"
                          ? "Telebirr SuperApp"
                          : bk.paymentMethod === "CBE_BIRR"
                          ? "Commercial Bank of Ethiopia (CBE Birr)"
                          : "Chapa Card & Mobile"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-mono font-black text-foreground">
                      {bk.totalAmount.toLocaleString()} ETB
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-mono text-muted-foreground">
                      {bk.platformFee.toLocaleString()} ETB
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                      TB-{Math.floor(10000000 + Math.random() * 90000000)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {bk.paymentStatus === "PAID" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Settled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <RotateCw className="w-3 h-3" />
                          Refunded
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-mono text-muted-foreground text-[11px]">
                      {bk.bookingDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Security & Governance Audit (Spacious Audit Trail Table) */}
      {activeTab === "security" && (
        <div className="rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Security Governance & Access Audit Log</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Comprehensive security trail tracking authentication events, password updates, and session origins.
              </p>
            </div>

            <button
              type="button"
              onClick={() => toast.success("Active session tokens invalidated for all devices.")}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors self-start sm:self-auto cursor-pointer"
            >
              Invalidate All Active Sessions
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Successful Authentication via Telebirr OAuth SSO</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Handshake verified via Ethio Telecom identity federation. OTP challenge completed.
                </p>
              </div>
              <div className="text-right font-mono text-[11px] text-muted-foreground shrink-0">
                {user.lastLogin} • IP: {user.ipAddress ? user.ipAddress.split(" ")[0] : "197.156.103.42"}
              </div>
            </div>

            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>National Fayda Biometric Verification Confirmed</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Fayda identification number {user.nationalId || "ET-FAN-1029384"} matched against national citizen registry.
                </p>
              </div>
              <div className="text-right font-mono text-[11px] text-muted-foreground shrink-0">
                {user.createdAt} 10:15 • INSA API Gateway
              </div>
            </div>

            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Account Provisioned & Profile Created</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  User registered on TIKORA platform with role: {user.role}. Assigned ID {user.id}.
                </p>
              </div>
              <div className="text-right font-mono text-[11px] text-muted-foreground shrink-0">
                {user.createdAt} 09:00 • System Initializer
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}