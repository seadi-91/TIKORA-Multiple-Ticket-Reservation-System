"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ScanLine,
  ChevronLeft,
  Building2,
  Bus,
  Film,
  Calendar,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Smartphone,
  MapPin,
  Clock,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Printer,
  ExternalLink,
  Edit2,
  Save,
  X,
  Hash,
  Activity,
  History,
  QrCode,
  Sparkles,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ inspectorId: string }>;
}

export default function AdminInspectorDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const {
    inspectors,
    organizations,
    toggleInspectorStatus,
    updateInspectorAssignment,
  } = useAdminStore();

  const inspector = inspectors.find((i) => i.id === resolvedParams.inspectorId);

  const [isEditingStation, setIsEditingStation] = useState(false);
  const [newStation, setNewStation] = useState(inspector?.assignedStation || "");

  if (!inspector) {
    return (
      <div className="py-16 text-center space-y-4">
        <ScanLine className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
        <h2 className="text-base sm:text-lg font-bold text-foreground">Field Inspector Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested gate inspector officer could not be located in the platform registry.
        </p>
        <Link
          href="/admin/inspectors"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Field Inspectors</span>
        </Link>
      </div>
    );
  }

  const affiliatedOrg = organizations.find((o) => o.id === inspector.organizationId);

  const handleStationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStation.trim()) return;
    updateInspectorAssignment(inspector.id, newStation.trim());
    setIsEditingStation(false);
    toast.success(`Station updated to '${newStation.trim()}'`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BUS":
        return <Bus className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "CINEMA":
        return <Film className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "EVENT":
        return <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "SPORTS":
        return <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Building2 className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/40 dark:border-slate-800/40 pb-4">
        <Link
          href="/admin/inspectors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Field Inspectors Directory</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-card border border-slate-200/70 dark:border-slate-800/70 text-foreground hover:bg-muted transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Badge Dossier</span>
          </button>

          <button
            type="button"
            onClick={() => {
              toggleInspectorStatus(inspector.id);
              toast.success(
                inspector.status === "ACTIVE"
                  ? `Suspended inspector ${inspector.name}`
                  : `Reactivated inspector ${inspector.name}`
              );
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
              inspector.status === "ACTIVE"
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            {inspector.status === "ACTIVE" ? (
              <>
                <UserX className="w-3.5 h-3.5" />
                <span>Suspend Inspector</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Reactivate Inspector</span>
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
              {inspector.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-foreground">
                  {inspector.name}
                </h1>
                {inspector.status === "ACTIVE" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active on Duty
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Suspended
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Authorized Field Inspection Officer • Assigned to{" "}
                <span className="font-semibold text-foreground">{inspector.organizationName}</span>
              </p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground mt-1.5 flex-wrap">
                <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Badge: {inspector.badgeId}
                </span>
                <span>Fayda/National ID: {inspector.nationalId}</span>
              </div>
            </div>
          </div>

          {/* Quick Velocity Pill */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Total Check-ins
              </span>
              <span className="text-base font-black text-foreground font-mono">
                {inspector.validScans.toLocaleString()}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block">
                Flagged / Fraud
              </span>
              <span className="text-base font-black text-rose-600 dark:text-rose-400 font-mono">
                {inspector.flaggedScans}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Information Grid (6 Critical Specification Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Personal & Identification Information */}
        <div className="p-5 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800/50 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Personal & Identity Profile
              </h2>
              <p className="text-[11px] text-foreground font-semibold">
                Official Verification Credentials
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/30 space-y-0.5">
              <span className="text-[10px] text-muted-foreground">Full Legal Name</span>
              <p className="font-bold text-foreground">{inspector.name}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 space-y-0.5">
              <span className="text-[10px] text-muted-foreground">Badge ID Number</span>
              <p className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {inspector.badgeId}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 space-y-0.5">
              <span className="text-[10px] text-muted-foreground">National ID (Fayda / Kebele)</span>
              <p className="font-mono font-semibold text-foreground">{inspector.nationalId}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 space-y-0.5">
              <span className="text-[10px] text-muted-foreground">Primary Phone</span>
              <p className="font-mono font-semibold text-foreground flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-400" />
                {inspector.phone}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 space-y-0.5 sm:col-span-2">
              <span className="text-[10px] text-muted-foreground">Officer Email Address</span>
              <p className="font-mono font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-slate-400" />
                {inspector.email}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Organization Affiliation ("Yetgnaw Organization Lay Endemisera") */}
        <div className="p-5 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Organization Affiliation
                </h2>
                <p className="text-[11px] text-foreground font-semibold">
                  Provider Employer Information
                </p>
              </div>
            </div>

            <Link
              href={`/admin/providers/${inspector.organizationId}`}
              className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View Dossier</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  {getCategoryIcon(inspector.organizationCategory)}
                </div>
                <div>
                  <p className="font-bold text-foreground text-xs">{inspector.organizationName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Sector: {inspector.organizationCategory} Operations
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                Verified Provider
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-muted/30 space-y-0.5">
                <span className="text-[10px] text-muted-foreground">Organization ID</span>
                <p className="font-mono font-semibold text-foreground">{inspector.organizationId}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-muted/30 space-y-0.5">
                <span className="text-[10px] text-muted-foreground">TIN / Business License</span>
                <p className="font-mono font-semibold text-foreground">
                  {affiliatedOrg?.taxNumber || "TIN-0019283741"}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-muted/30 space-y-0.5">
                <span className="text-[10px] text-muted-foreground">Provider Focal Person</span>
                <p className="font-semibold text-foreground">
                  {affiliatedOrg?.contactPerson || "Solomon Tadesse"}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-muted/30 space-y-0.5">
                <span className="text-[10px] text-muted-foreground">Provider City & HQ</span>
                <p className="font-semibold text-foreground">
                  {affiliatedOrg?.city || "Addis Ababa, Meskel Square"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Provisioning & Audit Trail ("Man Add Endaderegew Ena Meche Add Endetederege") */}
        <div className="p-5 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800/50 pb-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Provisioning & Audit Trail
              </h2>
              <p className="text-[11px] text-foreground font-semibold">
                Authorization & Creation Records
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-500/[0.04] dark:bg-amber-500/[0.06] border border-amber-500/20 space-y-2">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Provisioned & Authorized By (Man Add Endaderegew)
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground text-xs">{inspector.addedBy.name}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {inspector.addedBy.email}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                  {inspector.addedBy.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-muted/30 space-y-0.5">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Date Added (Meche Add Endetederege)
                </span>
                <p className="font-mono font-bold text-foreground">{inspector.createdAt}</p>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 space-y-0.5">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Activity className="w-3 h-3 text-slate-400" />
                  Last Active Session
                </span>
                <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {inspector.lastActive}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Terminal & Gate Assignment (with interactive reassignment) */}
        <div className="p-5 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Gate & Terminal Station
                </h2>
                <p className="text-[11px] text-foreground font-semibold">
                  Physical Dispatch Point
                </p>
              </div>
            </div>

            {!isEditingStation && (
              <button
                type="button"
                onClick={() => {
                  setNewStation(inspector.assignedStation);
                  setIsEditingStation(true);
                }}
                className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Reassign Gate</span>
              </button>
            )}
          </div>

          {isEditingStation ? (
            <form onSubmit={handleStationUpdate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-foreground mb-1">
                  New Gate / Terminal Station Location
                </label>
                <input
                  type="text"
                  required
                  value={newStation}
                  onChange={(e) => setNewStation(e.target.value)}
                  placeholder="e.g. Autobus Tera Gate 3 (Inbound & Outbound)"
                  className="w-full h-9 px-3 text-xs rounded-xl bg-muted/40 border border-slate-200 dark:border-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingStation(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Assignment</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
                  Current Assigned Terminal
                </span>
                <p className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{inspector.assignedStation}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-muted/30 space-y-0.5">
                  <span className="text-[10px] text-muted-foreground">Assigned Shift Schedule</span>
                  <p className="font-semibold text-foreground">{inspector.shiftSchedule}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/30 space-y-0.5">
                  <span className="text-[10px] text-muted-foreground">Verification Radius</span>
                  <p className="font-semibold text-foreground">Terminal Geofence 150m</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 5: Hardware Scanner Profile & Telemetry */}
        <div className="p-5 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800/50 pb-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Scanner Hardware & OS
              </h2>
              <p className="text-[11px] text-foreground font-semibold">
                Device Diagnostics & Build
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/30 space-y-0.5">
              <span className="text-[10px] text-muted-foreground">POS Scanner Model</span>
              <p className="font-bold text-foreground">{inspector.deviceModel}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 space-y-0.5">
              <span className="text-[10px] text-muted-foreground">Application Build</span>
              <p className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {inspector.appVersion}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 space-y-0.5">
              <span className="text-[10px] text-muted-foreground">Connectivity Mode</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Ethio Telecom 4G LTE Online
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 space-y-0.5">
              <span className="text-[10px] text-muted-foreground">Battery Health</span>
              <p className="font-semibold text-foreground font-mono">92% • Healthy</p>
            </div>
          </div>
        </div>

        {/* Card 6: Scan Analytics & Verification Performance */}
        <div className="p-5 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800/50 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Verification Performance
              </h2>
              <p className="text-[11px] text-foreground font-semibold">
                Telemetry & Fraud Prevention Logs
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* Visual ratio bar */}
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {inspector.validScans.toLocaleString()} Valid Check-ins
                </span>
                <span className="text-rose-500 font-semibold">
                  {inspector.flaggedScans} Flagged Fraud Attempts
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div
                  style={{
                    width: `${(inspector.validScans / (inspector.totalScans || 1)) * 100}%`,
                  }}
                  className="bg-emerald-500 h-full rounded-l-full"
                />
                <div
                  style={{
                    width: `${(inspector.flaggedScans / (inspector.totalScans || 1)) * 100}%`,
                  }}
                  className="bg-rose-500 h-full rounded-r-full"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Recent Check-in Events
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-muted-foreground">#TIK-BUS-88219</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid Entry
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">10m ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-muted-foreground">#TIK-BUS-88218</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid Entry
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">24m ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-muted-foreground">#TIK-BUS-88190</span>
                  <span className="text-rose-500 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Duplicate Scan Blocked
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">1h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

