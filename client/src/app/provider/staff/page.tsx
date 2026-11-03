"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Eye,
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

export default function ProviderStaffPage() {
  const { staffMembers, toggleStaffStatus, deleteStaffMember } = useProviderStore();
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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

  const getRoleBadge = (role: ProviderStaffMember["role"]) => {
    switch (role) {
      case "MANAGER":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-600/20">
            Manager
          </span>
        );
      case "DISPATCHER":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-600/20">
            Dispatcher
          </span>
        );
      case "INSPECTOR":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-600/20">
            Gate Inspector
          </span>
        );
      case "CASHIER":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-600/20">
            Cashier
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Staff & Ticket Inspector Management
          </h1>
          <p className="text-xs text-muted-foreground">
            Assign terminal gate inspectors, ticket scanners, dispatchers, and cashiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/provider/staff/invite"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" /> Invite Staff Member
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Total Team Size</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-foreground">{staffMembers.length}</div>
          <span className="text-[11px] text-muted-foreground">Authorized personnel</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Gate Inspectors</span>
            <QrCode className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-foreground">{inspectorsCount}</div>
          <span className="text-[11px] text-emerald-600">Active mobile scanners</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Fleet Dispatchers</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-foreground">{dispatchersCount}</div>
          <span className="text-[11px] text-muted-foreground">Station operational leads</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Total Scans Logged</span>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-foreground">{totalScans.toLocaleString()}</div>
          <span className="text-[11px] text-muted-foreground">Passes verified at boarding</span>
        </div>
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
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                  roleFilter === tab.id
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800/60 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, station, phone..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Assigned Terminal / Gate</th>
                <th className="py-3.5 px-4 text-center">Tickets Scanned</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No staff members found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-[11px] border border-amber-600/20 shrink-0">
                          {member.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <Link
                            href={`/provider/staff/${member.id}`}
                            className="font-semibold text-foreground hover:text-amber-600 transition-colors block"
                          >
                            {member.fullName}
                          </Link>
                          <span className="text-[11px] text-muted-foreground block font-mono">
                            {member.email} • {member.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">{getRoleBadge(member.role)}</td>

                    <td className="py-3.5 px-4 text-foreground font-medium">
                      {member.assignedStation}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-600 dark:text-amber-400">
                      {member.scannedTicketsCount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">{member.lastActive}</td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${member.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : member.status === "INVITED"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${member.status === "ACTIVE"
                              ? "bg-emerald-600"
                              : member.status === "INVITED"
                                ? "bg-blue-600"
                                : "bg-rose-600"
                            }`}
                        />
                        {member.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end">
                        <ActionDropdown
                          items={[
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
      </div>
    </div>
  );
}
