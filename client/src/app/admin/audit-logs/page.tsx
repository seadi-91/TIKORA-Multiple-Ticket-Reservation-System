"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function AdminAuditLogsPage() {
  const { auditLogs } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadLogs = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const logs = await adminService.getAuditLogs();
      useAdminStore.setState({ auditLogs: logs });
    } catch (err: any) {
      toast.error("Failed to sync audit logs: " + (err.message || "Network error"));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

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
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Platform Security & Compliance Audit Trail
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable, append-only record of administrative authorizations, refunds, policy modifications, and role updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadLogs}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Refresh Ledger"}</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-xs shadow-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-semibold text-foreground">PostgreSQL Ledger Active</span>
          </div>
        </div>
      </div>

      {/* Mobile Severity Filter Dropdown */}
      <div className="block sm:hidden">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
          Filter by Severity
        </label>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="w-full h-10 px-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
        >
          <option value="ALL">All Audit Events ({auditLogs.length})</option>
          <option value="INFO">Info Events ({auditLogs.filter((l) => l.severity === "INFO").length})</option>
          <option value="WARNING">Warnings ({auditLogs.filter((l) => l.severity === "WARNING").length})</option>
          <option value="CRITICAL">Critical Alerts ({auditLogs.filter((l) => l.severity === "CRITICAL").length})</option>
        </select>
      </div>

      {/* Desktop Filter Tabs */}
      <div className="hidden sm:flex items-center gap-1.5 border-b border-slate-200/50 dark:border-slate-800/50 pb-2 overflow-x-auto no-scrollbar flex-nowrap">
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
            className={`px-2 py-0.5 text-micro font-medium rounded-md transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              severityFilter === tab.value
                ? "bg-amber-600 text-white shadow-xs font-semibold"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-nano font-bold ${
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

      {/* Mobile View: High-Clarity Elevated Cards */}
      <div className="block sm:hidden space-y-3.5">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            No audit records matching query.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="rounded-2xl bg-card border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:border-amber-500/30 transition-all p-4 space-y-3.5"
            >
              {/* Card Header: Action, Severity & Actions */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                      {log.action}
                    </span>
                    {getSeverityBadge(log.severity)}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">
                    {log.timestamp}
                  </p>
                </div>

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

              {/* Actor & Target Strip */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/50 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Actor:</span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {log.actorName} <span className="text-[10px] font-mono text-muted-foreground">({log.actorRole})</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                  <span className="text-muted-foreground">Target Resource:</span>
                  <span className="font-mono text-foreground font-medium">{log.target}</span>
                </div>
              </div>

              {/* Operational Details Box */}
              <div className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/25 border border-slate-200/30 dark:border-slate-800/40 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Details & Telemetry
                </span>
                <p className="text-[11px] text-foreground leading-relaxed">{log.details}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-slate-200/30 dark:border-slate-800/30">
                  <span>Client IP: {log.ipAddress}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(log.ipAddress);
                      toast.success("IP copied");
                    }}
                    className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Copy IP
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Audit Log Table with Spacious Columns & Horizontal Scroll */}
      <div className="hidden sm:block rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[1020px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[140px]">Timestamp</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[180px]">Event Action</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Actor & Identity</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Target Resource</th>
                <th className="px-4 py-3.5 min-w-[200px]">Operational Details</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[120px]">Client IP</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[90px]">Severity</th>
                <th className="px-4 py-3.5 text-right w-12 shrink-0">Actions</th>
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
