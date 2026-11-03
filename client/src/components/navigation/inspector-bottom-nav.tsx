"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  QrCode,
  History,
  User,
} from "lucide-react";
import { useInspectorStore } from "@/stores/inspector.store";

export function InspectorBottomNav() {
  const pathname = usePathname();
  const { assignments, verificationHistory } = useInspectorStore();

  const activeAssignments = assignments.filter((a) => a.status === "ACTIVE_NOW").length;

  return (
    <nav
      aria-label="Inspector Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1 shadow-lg pb-safe"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Dashboard */}
        <Link
          href="/inspector"
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl min-w-[52px] transition-all touch-manipulation ${
            pathname === "/inspector"
              ? "text-amber-600 dark:text-amber-400 font-bold scale-105"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${pathname === "/inspector" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] tracking-tight mt-0.5 leading-none">Home</span>
        </Link>

        {/* Gate Posts */}
        <Link
          href="/inspector/assigned"
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl min-w-[52px] transition-all touch-manipulation ${
            pathname.startsWith("/inspector/assigned")
              ? "text-amber-600 dark:text-amber-400 font-bold scale-105"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <div className="relative">
            <ClipboardList className={`w-5 h-5 ${pathname.startsWith("/inspector/assigned") ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
            {activeAssignments > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white dark:ring-[#161922]">
                {activeAssignments}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-none">Gate Posts</span>
        </Link>

        {/* Prominent Center Scanner Launch Button */}
        <div className="relative -top-3">
          <Link
            href="/inspector/scanner"
            className="flex flex-col items-center justify-center w-13 h-13 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/30 active:scale-95 transition-all touch-manipulation ring-4 ring-white dark:ring-[#0F1117]"
            title="Open Live Ticket Scanner"
          >
            <QrCode className="w-6 h-6 stroke-[2.5]" />
          </Link>
          <span className="block text-center text-[9px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">Scan</span>
        </div>

        {/* Scan History */}
        <Link
          href="/inspector/history"
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl min-w-[52px] transition-all touch-manipulation ${
            pathname.startsWith("/inspector/history")
              ? "text-amber-600 dark:text-amber-400 font-bold scale-105"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <div className="relative">
            <History className={`w-5 h-5 ${pathname.startsWith("/inspector/history") ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
            {verificationHistory.length > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[9px] font-bold flex items-center justify-center">
                {verificationHistory.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-none">History</span>
        </Link>

        {/* Profile */}
        <Link
          href="/inspector/profile"
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl min-w-[52px] transition-all touch-manipulation ${
            pathname.startsWith("/inspector/profile") || pathname.startsWith("/inspector/settings")
              ? "text-amber-600 dark:text-amber-400 font-bold scale-105"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <User className={`w-5 h-5 ${pathname.startsWith("/inspector/profile") ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] tracking-tight mt-0.5 leading-none">Profile</span>
        </Link>
      </div>
    </nav>
  );
}

export default InspectorBottomNav;

