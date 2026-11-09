"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Eye,
  MapPin,
  Phone,
  QrCode,
  Search,
  ShieldAlert,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useProviderStore, ProviderStaffMember } from "@/stores/provider.store";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { useLanguage } from "@/providers/language-provider";

export default function ProviderStaffPage() {
  const { organization, staffMembers, toggleStaffStatus, deleteStaffMember, fetchStaff } = useProviderStore();
  const { t } = useLanguage();
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const filteredStaff = staffMembers.filter((s) => {
    const matchesRole = roleFilter === "ALL" || s.role === roleFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      s.fullName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.assignedStation.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const totalScans = staffMembers.reduce((acc, s) => acc + s.scannedTicketsCount, 0);
  const inspectorsCount = staffMembers.filter((s) => s.role === "INSPECTOR").length;
  const dispatchersCount = staffMembers.filter((s) => s.role === "DISPATCHER").length;

  const handleToggleStatus = (id: string, name: string) => {
    toggleStaffStatus(id);
    toast.success(`Access status for ${name} toggled successfully.`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from your organization staff?`)) {
      deleteStaffMember(id);
      toast.success(`${name} has been removed from staff.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
              {organization.category} Sector Personnel
            </span>
            <span className="text-xs text-muted-foreground">{organization.name}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            {t("Staff & Ticket Inspector Management")}
          </h1>
          <p className="text-xs text-muted-foreground">
            Assign terminal gate inspectors, ticket scanners, dispatchers, and cashiers for {organization.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/provider/staff/invite"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" /> {t("Add Staff & Inspector")}
          </Link>
        </div>
      </div>

      {/* KPI Cards - Multiple Column Display (4 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-card border border-border/60 rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate">{t("Total Team")}</span>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground truncate">{staffMembers.length}</div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate block">{t("Authorized personnel")}</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate">{t("Staff & Inspectors", "Inspectors")}</span>
            <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground truncate">{inspectorsCount}</div>
          <span className="text-[10px] sm:text-[11px] text-emerald-600 truncate block">{t("Mobile scanners")}</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate">{t("Dispatchers")}</span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground truncate">{dispatchersCount}</div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate block">{t("Station leads")}</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="text-[10px] sm:text-xs truncate">{t("Scan Count", "Total Scans")}</span>
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
          </div>
          <div className="text-sm sm:text-base font-bold text-foreground truncate">{totalScans.toLocaleString()}</div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate block">{t("Verified passes")}</span>
        </div>
      </div>

      {/* Sector Isolation Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div>
          <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Inspector Sector Isolation: {organization.category}</span>
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            Inspectors added by {organization.name} are strictly scoped to {organization.category} check-ins and will only see {organization.category.toLowerCase()}-related screening/boarding shifts and tickets.
          </p>
        </div>
        <Link
          href="/inspector"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Launch Inspector Console</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-nowrap pb-1 sm:pb-0">
            {[
              { id: "ALL", label: `All Roles (${staffMembers.length})` },
              { id: "INSPECTOR", label: "Gate Inspectors" },
              { id: "DISPATCHER", label: "Dispatchers" },
              { id: "MANAGER", label: "Managers" },
              { id: "CASHIER", label: "Cashiers" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleFilter(tab.id)}
                className={`px-2 py-0.5 text-micro font-medium rounded-md transition-all shrink-0 cursor-pointer ${
                  roleFilter === tab.id
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "bg-slate-100 dark:bg-slate-800/60 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, station, phone..."
              className="w-full pl-7.5 pr-2.5 h-7.5 text-micro rounded-md border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        </div>
      </div>

      {/* Staff Table & Mobile Cards */}
      <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden">
        {/* Table Sub-header */}
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/20">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Authorized Staff & Scanners
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Active verification personnel assigned to {organization.name}
            </p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl self-start sm:self-auto font-mono">
            {filteredStaff.length} Members
          </span>
        </div>

        {/* Desktop Table View - Spacious Layout (Feta bale way, no squishing) */}
        <div className="hidden md:block overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[1080px]">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-4 px-6 min-w-[280px]">Staff Member</th>
                <th className="py-4 px-6 min-w-[200px]">Phone Number</th>
                <th className="py-4 px-6 min-w-[260px]">Assigned Terminal / Gate</th>
                <th className="py-4 px-6 min-w-[150px] text-center">Tickets Scanned</th>
                <th className="py-4 px-6 min-w-[150px]">Last Active</th>
                <th className="py-4 px-6 min-w-[140px] text-center">Status</th>
                <th className="py-4 px-6 min-w-[100px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs sm:text-[13px]">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">
                    No staff members found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors"
                  >
                    {/* Staff Member */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-600/10 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-xs border border-amber-600/20 shrink-0">
                          {member.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/provider/staff/${member.id}`}
                            className="font-bold text-foreground hover:text-amber-600 transition-colors block text-sm leading-tight truncate"
                          >
                            {member.fullName}
                          </Link>
                          <span className="text-xs text-muted-foreground block truncate mt-0.5">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone Number */}
                    <td className="py-4.5 px-6 whitespace-nowrap">
                      <a
                        href={`tel:${member.phone.replace(/\s+/g, "")}`}
                        className="inline-flex items-center gap-2 font-mono text-xs sm:text-[13px] font-semibold text-foreground hover:text-amber-600 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground shrink-0">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <span>{member.phone}</span>
                      </a>
                    </td>

                    {/* Assigned Terminal / Gate */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="leading-snug">{member.assignedStation}</span>
                      </div>
                    </td>

                    {/* Tickets Scanned */}
                    <td className="py-4.5 px-6 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs sm:text-sm">
                        {member.scannedTicketsCount.toLocaleString()}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="py-4.5 px-6 text-muted-foreground whitespace-nowrap font-medium text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{member.lastActive}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4.5 px-6 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                          member.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : member.status === "INVITED"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.status === "ACTIVE"
                              ? "bg-emerald-600"
                              : member.status === "INVITED"
                              ? "bg-blue-600"
                              : "bg-rose-600"
                          }`}
                        />
                        {member.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          items={[
                            ...(member.role === "INSPECTOR"
                              ? [
                                  {
                                    label: "Open Inspector Scanner",
                                    icon: <QrCode className="w-3.5 h-3.5" />,
                                    href: "/inspector",
                                  },
                                ]
                              : []),
                            {
                              label: "View Profile & Logs",
                              icon: <Eye className="w-3.5 h-3.5" />,
                              href: `/provider/staff/${member.id}`,
                            },
                            {
                              label:
                                member.status === "ACTIVE"
                                  ? "Suspend Access"
                                  : "Activate Member",
                              icon: <UserCheck className="w-3.5 h-3.5" />,
                              variant: member.status === "ACTIVE" ? "warning" : "success",
                              onClick: () =>
                                handleToggleStatus(member.id, member.fullName),
                            },
                            {
                              label: "Remove Staff Member",
                              icon: <Trash2 className="w-3.5 h-3.5" />,
                              variant: "danger",
                              onClick: () => handleDelete(member.id, member.fullName),
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: High-End Spacious Staff Member Cards */}
        <div className="block md:hidden p-3.5 sm:p-4 space-y-3">
          {filteredStaff.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-xs">
              No staff members found matching criteria.
            </div>
          ) : (
            filteredStaff.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-xs border border-amber-600/20 shrink-0">
                      {member.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <Link
                        href={`/provider/staff/${member.id}`}
                        className="font-bold text-sm text-foreground hover:text-amber-600 transition-colors block leading-tight"
                      >
                        {member.fullName}
                      </Link>
                      <span className="text-xs text-muted-foreground block truncate mt-0.5">
                        {member.email}
                      </span>
                    </div>
                  </div>

                  <ActionDropdown
                    items={[
                      ...(member.role === "INSPECTOR"
                        ? [
                            {
                              label: "Open Scanner",
                              icon: <QrCode className="w-3.5 h-3.5" />,
                              href: "/inspector",
                            },
                          ]
                        : []),
                      {
                        label: "View Profile",
                        icon: <Eye className="w-3.5 h-3.5" />,
                        href: `/provider/staff/${member.id}`,
                      },
                      {
                        label: member.status === "ACTIVE" ? "Suspend" : "Activate",
                        icon: <UserCheck className="w-3.5 h-3.5" />,
                        variant: member.status === "ACTIVE" ? "warning" : "success",
                        onClick: () => handleToggleStatus(member.id, member.fullName),
                      },
                      {
                        label: "Remove",
                        icon: <Trash2 className="w-3.5 h-3.5" />,
                        variant: "danger",
                        onClick: () => handleDelete(member.id, member.fullName),
                      },
                    ]}
                  />
                </div>

                {/* Phone & Station Section */}
                <div className="grid grid-cols-1 gap-2 p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/40 dark:border-slate-800/40 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Phone:</span>
                    <a
                      href={`tel:${member.phone.replace(/\s+/g, "")}`}
                      className="font-mono font-bold text-foreground hover:text-amber-600 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3 h-3 text-amber-600" />
                      <span>{member.phone}</span>
                    </a>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-medium">Station:</span>
                    <span className="font-semibold text-foreground text-right truncate max-w-[200px]">
                      {member.assignedStation}
                    </span>
                  </div>
                </div>

                {/* Stats & Status Footer */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-muted-foreground font-medium">
                    Scans:{" "}
                    <strong className="text-amber-600 dark:text-amber-400 font-mono">
                      {member.scannedTicketsCount}
                    </strong>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      member.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-slate-200/60 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300"
                    }`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${
                        member.status === "ACTIVE" ? "bg-emerald-600" : "bg-slate-500"
                      }`}
                    />
                    {member.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
