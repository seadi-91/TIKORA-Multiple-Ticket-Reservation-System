"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Eye,
  QrCode,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useProviderStore, ProviderStaffMember } from "@/stores/provider.store";
import { toast } from "sonner";

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
      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
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
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${roleFilter === tab.id
                    ? "bg-amber-600 text-white"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, station, phone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Assigned Terminal / Gate</th>
                <th className="py-3 px-3 text-center">Tickets Scanned</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No staff members found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-600/10 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-[11px] border border-amber-600/20">
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
                          <span className="text-[11px] text-muted-foreground block">
                            {member.email} • {member.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">{getRoleBadge(member.role)}</td>

                    <td className="py-3.5 px-3 text-foreground font-medium">
                      {member.assignedStation}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-bold text-amber-600">
                      {member.scannedTicketsCount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-muted-foreground">{member.lastActive}</td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold border ${member.status === "ACTIVE"
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

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(member.id, member.fullName)}
                          className="px-2 py-1 text-[11px] font-medium rounded border border-border/70 hover:bg-muted text-foreground transition-colors"
                          title="Toggle Active / Suspended status"
                        >
                          {member.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </button>

                        <Link
                          href={`/provider/staff/${member.id}`}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="View profile & scan logs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(member.id, member.fullName)}
                          className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Remove staff member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
