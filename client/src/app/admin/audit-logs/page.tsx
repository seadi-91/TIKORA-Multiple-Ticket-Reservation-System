"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Filter,
  AlertTriangle,
  Info,
  AlertCircle,
  Clock,
  User,
  Building2,
  Lock,
  Copy,
  Eye,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function AdminAuditLogsPage() {
  const { auditLogs } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchesSeverity = severityFilter === "ALL" || log.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-2.5 h-2.5" /> CRITICAL
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-2.5 h-2.5" /> WARNING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Info className="w-2.5 h-2.5" /> INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Platform Security & Compliance Audit Trail
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable, append-only record of administrative authorizations, refunds, policy modifications, and role updates.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-xs shadow-xs">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-semibold text-foreground">Append-Only Ledger Active</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3 overflow-x-auto no-scrollbar flex-nowrap">
        {[
          { label: "All Audit Events", value: "ALL", count: auditLogs.length },
          {
            label: "Info",
            value: "INFO",
            count: auditLogs.filter((l) => l.severity === "INFO").length,
          },
          {
            label: "Warnings",
            value: "WARNING",
            count: auditLogs.filter((l) => l.severity === "WARNING").length,
          },
          {
            label: "Critical Alerts",
            value: "CRITICAL",
            count: auditLogs.filter((l) => l.severity === "CRITICAL").length,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSeverityFilter(tab.value)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              severityFilter === tab.value
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                severityFilter === tab.value ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by action, administrator, target, or IP..."
          className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
        />
      </div>

      {/* Audit Log Table (Elevated, Soft Borders, Modern Rows) */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Event Action</th>
                <th className="px-4 py-3.5">Actor & Identity</th>
                <th className="px-4 py-3.5">Target Resource</th>
                <th className="px-4 py-3.5">Operational Details</th>
                <th className="px-4 py-3.5">Client IP</th>
                <th className="px-4 py-3.5">Severity</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-muted-foreground whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {log.action}
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-semibold text-foreground">{log.actorName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{log.actorRole}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-foreground">{log.target}</td>
                  <td className="px-4 py-3.5 text-muted-foreground max-w-sm">
                    {log.details}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground">
                    {log.ipAddress}
                  </td>
                  <td className="px-4 py-3.5">{getSeverityBadge(log.severity)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end">
                      <ActionDropdown
                        items={[
                          {
                            label: "Copy Event Details",
                            icon: <Copy className="w-3.5 h-3.5" />,
                            onClick: () => {
                              navigator.clipboard.writeText(`${log.action}: ${log.details}`);
                              toast.success("Audit details copied");
                            },
                          },
                          {
                            label: "Copy IP Address",
                            icon: <Lock className="w-3.5 h-3.5" />,
                            onClick: () => {
                              navigator.clipboard.writeText(log.ipAddress);
                              toast.success("IP Address copied");
                            },
                          },
                          {
                            label: "Inspect Actor",
                            icon: <User className="w-3.5 h-3.5" />,
                            href: `/admin/users?q=${encodeURIComponent(log.actorName)}`,
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    No audit records matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
