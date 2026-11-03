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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Inspector Alerts & Bulletins
          </h1>
          <p className="text-xs text-muted-foreground">
            Operational gate notices, assignment dispatches, and bulletins from {profile.organizationName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notifications.some((n) => !n.isRead) && (
            <button
              type="button"
              onClick={handleMarkAll}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
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
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === "ALL"
              ? "bg-amber-600 text-white"
              : "bg-muted/40 text-muted-foreground hover:bg-muted"
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("UNREAD")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === "UNREAD"
              ? "bg-amber-600 text-white"
              : "bg-muted/40 text-muted-foreground hover:bg-muted"
          }`}
        >
          Unread Only ({notifications.filter((n) => !n.isRead).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-card rounded-xl border border-border/60 text-muted-foreground text-xs">
            No notifications in this view.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                !n.isRead
                  ? "bg-amber-500/10 border-amber-600/30 text-foreground ring-1 ring-amber-600/20"
                  : "bg-card border-border/60 text-muted-foreground hover:border-border/80"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">{n.title}</span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {n.createdAt}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>

              {n.linkHref && (
                <div className="mt-2 pt-2 border-t border-border/40">
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

