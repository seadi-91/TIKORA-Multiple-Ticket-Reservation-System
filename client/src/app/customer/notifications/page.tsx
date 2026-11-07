"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Trash2,
  Ticket,
  CreditCard,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/feedback/empty-state";
import { useBookingStore } from "@/stores/booking.store";

export default function CustomerNotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useBookingStore();

  const [filterTab, setFilterTab] = useState<"ALL" | "UNREAD">("ALL");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = notifications.filter((n) => {
    if (filterTab === "UNREAD") return !n.isRead;
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "BOOKING_CONFIRMATION":
        return <Ticket className="w-4 h-4 text-emerald-600" />;
      case "PAYMENT_SUCCESS":
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case "REMINDER":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "PROMOTION":
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <PageContainer
      title="Notification Center"
      subtitle="Stay informed on booking confirmations, e-receipts, departure alerts, and exclusive offers."
      breadcrumbs={[{ label: "Customer Dashboard", href: "/customer" }, { label: "Notifications" }]}
      action={
        notifications.length > 0 && unreadCount > 0 ? (
          <button
            onClick={markAllNotificationsAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-xs font-semibold text-[#F59E0B] dark:text-amber-400 hover:bg-[#FFFBEB] cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {/* Filter Pills */}
        <div className="inline-flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setFilterTab("ALL")}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              filterTab === "ALL"
                ? "bg-white dark:bg-slate-700 text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>All</span>
            <span className="text-[10px] font-mono opacity-75">({notifications.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("UNREAD")}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
              filterTab === "UNREAD"
                ? "bg-white dark:bg-slate-700 text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Unread</span>
            <span className="text-[10px] font-mono opacity-75">({unreadCount})</span>
          </button>
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="All caught up!"
            description="You don't have any unread alerts right now. We'll notify you when tickets are confirmed or departure times approach."
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${!n.isRead
                  ? "bg-white dark:bg-[#161922] border-emerald-300 dark:border-slate-700 shadow-xs"
                  : "bg-[#F8FAFC] dark:bg-[#0C0E14] border-[#E2E8F0] dark:border-slate-800/20 opacity-80"
                  }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-amber-950/60 flex items-center justify-center shrink-0 mt-0.5">
                    {getNotifIcon(n.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-[#64748B] dark:text-amber-400/60 font-medium">
                      <span>{n.timestamp}</span>
                      {n.link && (
                        <Link
                          href={n.link}
                          className="font-bold text-[#F59E0B] dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => markNotificationAsRead(n.id)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F59E0B] hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
