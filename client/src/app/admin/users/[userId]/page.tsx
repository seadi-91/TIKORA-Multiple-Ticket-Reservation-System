"use client";

import React, { use } from "react";
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
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
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

  if (!user) {
    return (
      <div className="py-16 text-center space-y-4">
        <Users className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
        <h2 className="text-base sm:text-lg font-bold text-foreground">Platform User Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested user account could not be located in the platform database.
        </p>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Users Directory</span>
        </Link>
      </div>
    );
  }

  // Filter bookings related to this user
  const userBookings = bookings.filter(
    (b) =>
      b.customerEmail.toLowerCase() === user.email.toLowerCase() ||
      b.customerName.toLowerCase() === user.name.toLowerCase()
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return {
          bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
          label: "Platform Admin",
        };
      case "ORGANIZATION":
        return {
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          label: "Provider Partner",
        };
      case "INSPECTOR":
        return {
          bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          label: "Gate Inspector",
        };
      default:
        return {
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          label: "Verified Customer",
        };
    }
  };

  const roleMeta = getRoleBadge(user.role);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/40 dark:border-slate-800/40 pb-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Platform Users Directory</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-card border border-slate-200/70 dark:border-slate-800/70 text-foreground hover:bg-muted transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print User Dossier</span>
          </button>

          <button
            type="button"
            onClick={() => {
              toggleUserStatus(user.id);
              toast.success(
                user.status === "ACTIVE"
                  ? `Suspended account for ${user.name}`
                  : `Reactivated account for ${user.name}`
              );
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
              user.status === "ACTIVE"
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            {user.status === "ACTIVE" ? (
              <>
                <UserX className="w-3.5 h-3.5" />
                <span>Suspend Account</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Reactivate Account</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Profile Overview Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0 ring-4 ring-amber-500/10">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-foreground">
                  {user.name}
                </h1>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${roleMeta.bg}`}
                >
                  {roleMeta.label}
                </span>
                {user.status === "ACTIVE" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active Account
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Suspended
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Platform Account ID: <span className="font-mono text-foreground font-semibold">{user.id}</span>
                {user.organizationName && (
                  <span> • Affiliated with <span className="font-semibold text-foreground">{user.organizationName}</span></span>
                )}
              </p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground mt-1.5 flex-wrap">
                <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Fayda ID: {user.nationalId || "Not Registered"}
                </span>
                <span>City: {user.city || "Addis Ababa"}</span>
                <span>Member Since: {user.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Quick Velocity Pill */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Total Bookings
              </span>
              <span className="text-base font-black text-foreground font-mono">
                {user.totalBookings || userBookings.length}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Total ETB Spent
              </span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                {(user.totalSpentETB || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">Total Purchases</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground font-mono">
            {user.totalBookings || userBookings.length} Bookings
          </div>
          <span className="text-[10px] text-muted-foreground block">Platform tickets reserved</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">Lifetime Spent</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground font-mono">
            {(user.totalSpentETB || 0).toLocaleString()} ETB
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block">Settled via Telebirr / CBE</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">Loyalty Points</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm sm:text-base font-bold text-amber-600 font-mono">
            {user.loyaltyPoints || 0} pts
          </div>
          <span className="text-[10px] text-muted-foreground block">TIKORA Rewards Tier</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">Account Security</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-600 font-mono">
            Verified (Level 2)
          </div>
          <span className="text-[10px] text-muted-foreground block">2FA & Phone Authenticated</span>
        </div>
      </div>

      {/* Main Grid: Details & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column (7 cols): User Dossier */}
        <div className="lg:col-span-7 space-y-5">
          {/* Personal & Identity Dossier */}
          <div className="p-5 sm:p-6 rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-amber-600" />
                <span>Personal & Identity Dossier</span>
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Verified Profile
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-2xl bg-muted/20 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Full Legal Name
                </span>
                <span className="text-xs font-bold text-foreground">{user.name}</span>
              </div>

              <div className="p-3 rounded-2xl bg-muted/20 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  National / Fayda ID
                </span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  {user.nationalId || "ET-FAN-PENDING"}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-muted/20 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Email Address
                </span>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">{user.email}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/20 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Phone Number
                </span>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-mono font-medium text-foreground">{user.phone}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/20 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Registered City
                </span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">{user.city || "Addis Ababa"}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/20 border border-slate-100 dark:border-slate-800/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Residential Address
                </span>
                <span className="text-xs font-medium text-foreground">
                  {user.address || "Bole Sub-City, Addis Ababa, Ethiopia"}
                </span>
              </div>
            </div>
          </div>

          {/* Account Governance & Origin */}
          <div className="p-5 sm:p-6 rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Account Governance & Audit Trail</span>
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Creation Meta
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Provisioned / Added By
                  </span>
                  <span className="font-bold text-foreground">
                    {user.addedBy?.name || "Self Sign-Up via Telebirr Portal"}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {user.addedBy?.email ? `${user.addedBy.email} • ${user.addedBy.role}` : "Automated SMS OTP Verification"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-muted/20 border border-slate-100 dark:border-slate-800/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" /> Registration Date
                  </span>
                  <span className="font-mono text-xs font-semibold text-foreground">{user.createdAt}</span>
                </div>

                <div className="p-3 rounded-2xl bg-muted/20 border border-slate-100 dark:border-slate-800/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" /> Last Active / Login
                  </span>
                  <span className="font-mono text-xs font-semibold text-foreground">{user.lastLogin}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Activity & Recent Bookings */}
        <div className="lg:col-span-5 space-y-5">
          {/* Recent Bookings Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Recent Platform Bookings</span>
              </h2>
              <span className="text-[10px] font-bold text-muted-foreground">
                {userBookings.length} Records
              </span>
            </div>

            {userBookings.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <ShoppingBag className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
                <p className="text-xs text-muted-foreground">No recent bookings found for this user.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {userBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-muted/10 hover:bg-muted/30 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-foreground">
                        {booking.reference}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          booking.bookingStatus === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : booking.bookingStatus === "COMPLETED"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-rose-500/10 text-rose-600"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-foreground truncate">
                      {booking.serviceTitle}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-slate-100 dark:border-slate-800/60">
                      <span>{booking.providerName}</span>
                      <span className="font-mono font-bold text-foreground">
                        {booking.totalAmount.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Administrative Quick Actions */}
          <div className="p-5 sm:p-6 rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-foreground">Administrative Actions</h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => toast.success(`Password reset link dispatched to ${user.email}`)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-between transition-colors"
              >
                <span>Dispatch Password Reset Link</span>
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              <button
                type="button"
                onClick={() => toast.success(`OTP verification challenge sent to ${user.phone}`)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-between transition-colors"
              >
                <span>Trigger Mobile Re-Authentication</span>
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {user.organizationName && (
                <Link
                  href={`/admin/providers?q=${encodeURIComponent(user.organizationName)}`}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-between transition-colors block"
                >
                  <span>View Provider Entity Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
