"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock,
  Info,
  MapPin,
  MessageSquare,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useInspectorStore } from "@/stores/inspector.store";
import { toast } from "sonner";

export default function InspectorNotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, profile } =
    useInspectorStore();
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  const filtered = notifications.filter((n) => (filter === "UNREAD" ? !n.isRead : true));

  const handleMarkAll = () => {
    markAllNotificationsAsRead();
    toast.success("All inspector notifications marked as read.");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Inspector Alerts & Bulletins
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational gate notices, assignment dispatches, and bulletins from {profile.organizationName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notifications.some((n) => !n.isRead) && (
            <button
              type="button"
              onClick={handleMarkAll}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === "ALL"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800/60 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800"
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("UNREAD")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === "UNREAD"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800/60 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800"
          }`}
        >
          Unread Only ({notifications.filter((n) => !n.isRead).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-3xl border border-slate-200/50 dark:border-slate-800/50 text-muted-foreground text-xs shadow-sm">
            No notifications in this view.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                !n.isRead
                  ? "bg-amber-500/10 border-amber-600/30 text-foreground ring-1 ring-amber-600/20"
                  : "bg-card border-slate-200/50 dark:border-slate-800/50 text-muted-foreground hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{n.title}</span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap font-mono">
                  {n.createdAt}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>

              {n.linkHref && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/40 dark:border-slate-800/40">
                  <Link
                    href={n.linkHref}
                    className="text-xs text-amber-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Open Related View →
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

