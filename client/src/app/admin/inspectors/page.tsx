"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ScanLine,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  Building2,
  Bus,
  Film,
  Calendar,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Smartphone,
  MapPin,
  Clock,
  UserCheck,
  UserX,
  X,
  QrCode,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useAdminStore, AdminInspector } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { toast } from "sonner";

export default function AdminInspectorsPage() {
  const { inspectors, organizations, toggleInspectorStatus, createInspector } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New inspector modal state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || "");
  const [assignedStation, setAssignedStation] = useState("");
  const [deviceModel, setDeviceModel] = useState("Sunmi V2 Pro Android POS Scanner");
  const [shiftSchedule, setShiftSchedule] = useState("Morning Shift: 06:00 - 14:00");

  const filteredInspectors = inspectors.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.badgeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.assignedStation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.nationalId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || i.organizationCategory === categoryFilter;
    const matchesStatus = statusFilter === "ALL" || i.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalScans = inspectors.reduce((acc, curr) => acc + curr.totalScans, 0);
  const totalValid = inspectors.reduce((acc, curr) => acc + curr.validScans, 0);
  const totalFlagged = inspectors.reduce((acc, curr) => acc + curr.flaggedScans, 0);
  const activeCount = inspectors.filter((i) => i.status === "ACTIVE").length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !organizationId) {
      toast.error("Please fill in all required inspector fields");
      return;
    }

    const selectedOrg = organizations.find((o) => o.id === organizationId);
    if (!selectedOrg) {
      toast.error("Selected organization was not found");
      return;
    }

    const badgeId = `INS-ET-${Math.floor(1000 + Math.random() * 9000)}`;

    createInspector({
      badgeId,
      name,
      email,
      phone: phone || "+251 900 000 000",
      nationalId: nationalId || `ET-FAN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      organizationCategory: selectedOrg.category,
      assignedStation: assignedStation || `${selectedOrg.name} Primary Gate`,
      deviceModel,
      shiftSchedule,
    });

    toast.success(`Provisioned inspector ${name} (${badgeId}) successfully!`);
    setName("");
    setEmail("");
    setPhone("");
    setNationalId("");
    setAssignedStation("");
    setShowCreateModal(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BUS":
        return <Bus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "CINEMA":
        return <Film className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case "EVENT":
        return <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case "SPORTS":
        return <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Field Inspectors & Gate Control
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-500/20">
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit ticket verification officers, terminal gate assignments, scanner hardware, and security verification logs.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-md shadow-amber-600/25 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Field Inspector</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">Total Inspectors</span>
            <ScanLine className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-foreground font-mono">
            {inspectors.length}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {activeCount} active on duty
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">Verified Check-ins</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-foreground font-mono">
            {totalValid.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {((totalValid / (totalScans || 1)) * 100).toFixed(1)}% success rate
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">Flagged & Blocked</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
            {totalFlagged.toLocaleString()}
          </p>
          <p className="text-[10px] text-rose-600/80 dark:text-rose-400/80">
            Fraud & duplicate QR blocks
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">Providers Covered</span>
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-foreground font-mono">
            {new Set(inspectors.map((i) => i.organizationId)).size} Orgs
          </p>
          <p className="text-[10px] text-muted-foreground">
            Bus, cinema, sports & events
          </p>
        </div>
      </div>

      {/* Mobile Sector Filter Dropdown */}
      <div className="block sm:hidden">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
          Filter by Sector
        </label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full h-10 px-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
        >
          <option value="ALL">All Sectors ({inspectors.length})</option>
          <option value="BUS">Bus Terminals ({inspectors.filter((i) => i.organizationCategory === "BUS").length})</option>
          <option value="CINEMA">Cinema Halls ({inspectors.filter((i) => i.organizationCategory === "CINEMA").length})</option>
          <option value="EVENT">Event Venues ({inspectors.filter((i) => i.organizationCategory === "EVENT").length})</option>
          <option value="SPORTS">Sports Stadiums ({inspectors.filter((i) => i.organizationCategory === "SPORTS").length})</option>
        </select>
      </div>

      {/* Desktop Category Tabs */}
      <div className="hidden sm:flex items-center gap-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-3 overflow-x-auto no-scrollbar">
        {[
          { label: "All Sectors", value: "ALL", count: inspectors.length },
          {
            label: "Bus Terminals",
            value: "BUS",
            count: inspectors.filter((i) => i.organizationCategory === "BUS").length,
          },
          {
            label: "Cinema Halls",
            value: "CINEMA",
            count: inspectors.filter((i) => i.organizationCategory === "CINEMA").length,
          },
          {
            label: "Event Venues",
            value: "EVENT",
            count: inspectors.filter((i) => i.organizationCategory === "EVENT").length,
          },
          {
            label: "Sports Stadiums",
            value: "SPORTS",
            count: inspectors.filter((i) => i.organizationCategory === "SPORTS").length,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategoryFilter(tab.value)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              categoryFilter === tab.value
                ? "bg-amber-600 text-white shadow-sm shadow-amber-600/25"
                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                categoryFilter === tab.value
                  ? "bg-white/20 text-white"
                  : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inspector by name, badge ID, station, organization, or National ID..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Mobile View: High-Clarity Elevated Cards (< 640px) */}
      <div className="block sm:hidden space-y-3.5">
        {filteredInspectors.length === 0 ? (
          <div className="py-12 text-center space-y-2 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            <ScanLine className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
            <p className="text-xs font-semibold text-foreground">No field inspectors found</p>
            <p className="text-[11px] text-muted-foreground">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          filteredInspectors.map((inspector) => (
            <div
              key={inspector.id}
              className="rounded-2xl bg-card border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:border-amber-500/30 transition-all p-4 space-y-3.5"
            >
              {/* Card Header: Avatar, Name, Badge & Status */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs border border-amber-500/20 mt-0.5">
                    {inspector.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/inspectors/${inspector.id}`}
                      className="font-bold text-sm text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block"
                    >
                      {inspector.name}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {inspector.badgeId}
                      </span>
                      {inspector.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Suspended
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <ActionDropdown
                  items={[
                    {
                      label: "View Detail",
                      icon: <Eye className="w-4 h-4" />,
                      href: `/admin/inspectors/${inspector.id}`,
                    },
                    {
                      label:
                        inspector.status === "ACTIVE"
                          ? "Suspend Inspector"
                          : "Reactivate Inspector",
                      icon:
                        inspector.status === "ACTIVE" ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        ),
                      variant: inspector.status === "ACTIVE" ? "danger" : "success",
                      onClick: () => toggleInspectorStatus(inspector.id),
                    },
                    {
                      label: "View Organization",
                      icon: <Building2 className="w-4 h-4" />,
                      href: `/admin/providers/${inspector.organizationId}`,
                    },
                  ]}
                />
              </div>

              {/* Organization & Station Strip */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    {getCategoryIcon(inspector.organizationCategory)}
                    <span>Organization:</span>
                  </span>
                  <Link
                    href={`/admin/providers/${inspector.organizationId}`}
                    className="font-semibold text-foreground hover:text-amber-600 dark:hover:text-amber-400 truncate max-w-[170px]"
                  >
                    {inspector.organizationName}
                  </Link>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Station:</span>
                  </span>
                  <span className="font-medium text-foreground truncate max-w-[180px]">
                    {inspector.assignedStation}
                  </span>
                </div>
              </div>

              {/* Performance & Hardware Micro-Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-amber-500/[0.04] dark:bg-amber-500/[0.07] border border-amber-500/15 text-center">
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Valid Scans
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block truncate">
                    {inspector.validScans.toLocaleString()}
                  </span>
                </div>
                <div className="border-x border-amber-500/15">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Flagged
                  </span>
                  <span className="text-xs font-black text-rose-500 font-mono mt-0.5 block">
                    {inspector.flaggedScans}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Scanner HW
                  </span>
                  <span className="text-xs font-extrabold text-foreground mt-0.5 block truncate">
                    {inspector.deviceModel.split(" ")[0]}
                  </span>
                </div>
              </div>

              {/* Direct Full-Width Dossier Button */}
              <Link
                href={`/admin/inspectors/${inspector.id}`}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-500/10 dark:bg-slate-800/70 dark:hover:bg-amber-500/20 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-xs flex items-center justify-between transition-colors border border-slate-200/60 dark:border-slate-700/60"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>View Inspector Dossier & Telemetry</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Table with Spacious Columns & Horizontal Scroll */}
      <div className="hidden sm:block rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[1050px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 min-w-[200px]">Inspector Officer</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[180px]">Assigned Organization</th>
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[220px]">Gate / Terminal Station</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Device & Version</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[130px]">Scan Activity</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">Status</th>
                <th className="px-4 py-3.5 text-right w-12 shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredInspectors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No field inspectors match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInspectors.map((inspector) => (
                  <tr
                    key={inspector.id}
                    className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors"
                  >
                    <td className="px-5 py-3.5 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs ring-1 ring-amber-500/20">
                          {inspector.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/inspectors/${inspector.id}`}
                            className="font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block"
                          >
                            {inspector.name}
                          </Link>
                          <p className="text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400">
                            {inspector.badgeId}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap min-w-[180px]">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(inspector.organizationCategory)}
                        <span className="font-semibold text-foreground truncate">
                          {inspector.organizationName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap min-w-[220px]">
                      <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{inspector.assignedStation}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{inspector.shiftSchedule}</p>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{inspector.deviceModel}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{inspector.appVersion}</p>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap min-w-[130px]">
                      <div className="font-mono">
                        <span className="font-bold text-foreground">
                          {inspector.validScans.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground"> valid</span>
                      </div>
                      {inspector.flaggedScans > 0 ? (
                        <p className="text-[10px] text-rose-500 font-mono font-semibold mt-0.5">
                          {inspector.flaggedScans} flagged
                        </p>
                      ) : (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">0 fraud</p>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {inspector.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Suspended
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap w-12">
                      <ActionDropdown
                        items={[
                          {
                            label: "View Detail",
                            icon: <Eye className="w-4 h-4" />,
                            href: `/admin/inspectors/${inspector.id}`,
                          },
                          {
                            label:
                              inspector.status === "ACTIVE"
                                ? "Suspend Inspector"
                                : "Reactivate Inspector",
                            icon:
                              inspector.status === "ACTIVE" ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              ),
                            variant: inspector.status === "ACTIVE" ? "danger" : "success",
                            onClick: () => toggleInspectorStatus(inspector.id),
                          },
                          {
                            label: "View Organization",
                            icon: <Building2 className="w-4 h-4" />,
                            href: `/admin/providers/${inspector.organizationId}`,
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New Field Inspector Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateSubmit}
            className="w-full max-w-lg rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Provision Field Inspector</h3>
                  <p className="text-[11px] text-muted-foreground">Authorize gate staff & assign terminal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Full Legal Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Almaz Kebede"
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="almaz@selambus.et"
                    className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 912 998 877"
                    className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">National ID / Kebele ID</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="ET-FAN-9842103"
                    className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Organization <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-semibold"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Assigned Terminal Gate</label>
                <input
                  type="text"
                  value={assignedStation}
                  onChange={(e) => setAssignedStation(e.target.value)}
                  placeholder="e.g. Autobus Tera Gate 4 (Outbound Terminal)"
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">POS Scanner Model</label>
                  <input
                    type="text"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Shift Schedule</label>
                  <input
                    type="text"
                    value={shiftSchedule}
                    onChange={(e) => setShiftSchedule(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-200/40 dark:border-slate-800/40">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-md shadow-amber-600/25 cursor-pointer"
              >
                Provision Inspector
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

