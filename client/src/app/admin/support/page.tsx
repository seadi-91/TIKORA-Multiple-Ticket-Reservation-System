"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Headphones,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Send,
  User,
  Building2,
  ShieldCheck,
  X,
  Eye,
} from "lucide-react";
import { useAdminStore, AdminSupportTicket } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function AdminSupportPage() {
  const { supportTickets, replyToSupportTicket } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<AdminSupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [nextStatus, setNextStatus] = useState<"OPEN" | "IN_PROGRESS" | "RESOLVED">("RESOLVED");

  const filteredTickets = supportTickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    replyToSupportTicket(selectedTicket.id, replyMessage, nextStatus);

    // Update locally selected ticket view
    const updated = useAdminStore
      .getState()
      .supportTickets.find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);

    setReplyMessage("");
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            LOW
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
            Customer & Provider Dispute Desk
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Resolve consumer complaints, payment gateway discrepancies, and expedited provider inquiries.
          </p>
        </div>
      </div>

      {/* Mobile Filter Dropdown */}
      <div className="block sm:hidden">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
          Filter Tickets by Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full h-10 px-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
        >
          <option value="ALL">All Tickets ({supportTickets.length})</option>
          <option value="OPEN">Open Priority ({supportTickets.filter((t) => t.status === "OPEN").length})</option>
          <option value="IN_PROGRESS">Under Review ({supportTickets.filter((t) => t.status === "IN_PROGRESS").length})</option>
          <option value="RESOLVED">Resolved ({supportTickets.filter((t) => t.status === "RESOLVED").length})</option>
        </select>
      </div>

      {/* Desktop Filter Tabs */}
      <div className="hidden sm:flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3 overflow-x-auto no-scrollbar flex-nowrap">
        {[
          { label: "All Tickets", value: "ALL", count: supportTickets.length },
          {
            label: "Open Priority",
            value: "OPEN",
            count: supportTickets.filter((t) => t.status === "OPEN").length,
          },
          {
            label: "Under Review",
            value: "IN_PROGRESS",
            count: supportTickets.filter((t) => t.status === "IN_PROGRESS").length,
          },
          {
            label: "Resolved",
            value: "RESOLVED",
            count: supportTickets.filter((t) => t.status === "RESOLVED").length,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              statusFilter === tab.value
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === tab.value ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ticket number, requester name, or subject..."
          className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
        />
      </div>

      {/* Mobile View: High-Clarity Elevated Cards */}
      <div className="block sm:hidden space-y-3.5">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            No support inquiries found matching your query.
          </div>
        ) : (
          filteredTickets.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-card border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:border-amber-500/30 transition-all p-4 space-y-3.5"
            >
              {/* Card Header: Ticket ID, Priority, Status & Actions */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-amber-600 dark:text-amber-400">
                      {t.ticketNumber}
                    </span>
                    {getPriorityBadge(t.priority)}
                    {t.status === "OPEN" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
                        <Clock className="w-3 h-3" /> Open
                      </span>
                    ) : t.status === "IN_PROGRESS" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20">
                        <Clock className="w-3 h-3" /> In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">
                    Filed: {t.createdAt}
                  </p>
                </div>

                <ActionDropdown
                  items={[
                    {
                      label: "Open Case Discussion",
                      icon: <MessageSquare className="w-3.5 h-3.5" />,
                      onClick: () => {
                        setSelectedTicket(t);
                        setNextStatus(t.status === "OPEN" ? "IN_PROGRESS" : "RESOLVED");
                      },
                    },
                    ...(t.status !== "RESOLVED"
                      ? [
                          {
                            label: "Mark As Resolved",
                            icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                            variant: "success" as const,
                            onClick: () => replyToSupportTicket(t.id, "Case resolved by administrator", "RESOLVED"),
                          },
                        ]
                      : []),
                    {
                      label: "View Requester Profile",
                      icon: <User className="w-3.5 h-3.5" />,
                      href: `/admin/users?q=${encodeURIComponent(t.requesterName)}`,
                    },
                  ]}
                />
              </div>

              {/* Subject & Category Strip */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/50 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Category: {t.category}
                  </span>
                  <span className="text-[10px] font-semibold text-foreground bg-muted/60 px-2 py-0.5 rounded">
                    {t.requesterRole}
                  </span>
                </div>
                <p className="font-bold text-foreground text-xs leading-snug">{t.subject}</p>
              </div>

              {/* Requester Identity Strip */}
              <div className="flex items-center justify-between text-[11px] p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/25 border border-slate-200/30 dark:border-slate-800/40">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px] flex items-center justify-center shrink-0">
                    {t.requesterName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-xs">{t.requesterName}</p>
                    <p className="text-[10px] text-muted-foreground">{t.requesterEmail}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {t.messages.length} msg(s)
                </span>
              </div>

              {/* Direct Tap Button to Open Conversation */}
              <button
                type="button"
                onClick={() => {
                  setSelectedTicket(t);
                  setNextStatus(t.status === "OPEN" ? "IN_PROGRESS" : "RESOLVED");
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-500/10 dark:bg-slate-800/70 dark:hover:bg-amber-500/20 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-xs flex items-center justify-between transition-colors border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
              >
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Open Ticket Case Thread</span>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">Reply &rarr;</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Tickets Master List with Spacious Columns & Horizontal Scroll */}
      <div className="hidden sm:block rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[950px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[120px]">Ticket ID</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Requester</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">Role</th>
                <th className="px-4 py-3.5 min-w-[180px]">Subject & Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[90px]">Priority</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">Date</th>
                <th className="px-4 py-3.5 text-right w-12 shrink-0">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {t.ticketNumber}
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-semibold text-foreground">{t.requesterName}</p>
                      <p className="text-[11px] text-muted-foreground">{t.requesterEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-muted text-foreground">
                      {t.requesterRole}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="max-w-[280px]">
                      <p className="font-semibold text-foreground truncate">{t.subject}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{t.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">{getPriorityBadge(t.priority)}</td>
                  <td className="px-4 py-3.5">
                    {t.status === "OPEN" ? (
                      <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> Open
                      </span>
                    ) : t.status === "IN_PROGRESS" ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-muted-foreground">{t.createdAt}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end">
                      <ActionDropdown
                        items={[
                          {
                            label: "Open Case Discussion",
                            icon: <MessageSquare className="w-3.5 h-3.5" />,
                            onClick: () => {
                              setSelectedTicket(t);
                              setNextStatus(t.status === "OPEN" ? "IN_PROGRESS" : "RESOLVED");
                            },
                          },
                          ...(t.status !== "RESOLVED"
                            ? [
                                {
                                  label: "Mark As Resolved",
                                  icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                                  variant: "success" as const,
                                  onClick: () => {
                                    replyToSupportTicket(t.id, "Case resolved by administrator audit.", "RESOLVED");
                                  },
                                },
                              ]
                            : []),
                          {
                            label: "Inspect Requester",
                            icon: <User className="w-3.5 h-3.5" />,
                            href: `/admin/users?q=${encodeURIComponent(t.requesterName)}`,
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    No support tickets matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Conversation Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-6 space-y-4 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                    {selectedTicket.ticketNumber}
                  </span>
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
                <h3 className="font-bold text-base text-foreground mt-0.5">{selectedTicket.subject}</h3>
                <p className="text-[11px] text-muted-foreground">
                  Requester: <strong className="text-foreground">{selectedTicket.requesterName}</strong> (
                  {selectedTicket.requesterRole}) • {selectedTicket.requesterEmail}
                </p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-1 text-xs">
              {selectedTicket.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl space-y-1 ${
                    m.isStaff
                      ? "bg-amber-500/10 border border-amber-500/20 ml-6"
                      : "bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 mr-6"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-foreground">
                      {m.sender} {m.isStaff && "(Super Admin)"}
                    </span>
                    <span className="font-mono text-muted-foreground">{m.timestamp}</span>
                  </div>
                  <p className="text-foreground leading-relaxed">{m.message}</p>
                </div>
              ))}
            </div>

            {/* Admin Response Form */}
            <form onSubmit={handleReplySubmit} className="border-t border-slate-200/40 dark:border-slate-800/40 pt-3 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-foreground">Dispatch Official Administrative Reply:</label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">Status after reply:</span>
                  <select
                    value={nextStatus}
                    onChange={(e) =>
                      setNextStatus(e.target.value as "OPEN" | "IN_PROGRESS" | "RESOLVED")
                    }
                    className="h-8 px-2.5 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-foreground"
                  >
                    <option value="IN_PROGRESS">Keep In Progress</option>
                    <option value="RESOLVED">Mark as Resolved</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={3}
                required
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Compose response or resolution details..."
                className="w-full p-3 text-xs rounded-2xl bg-muted/40 border border-slate-200/60 dark:border-slate-800/60 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground"
                >
                  Close Case
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
