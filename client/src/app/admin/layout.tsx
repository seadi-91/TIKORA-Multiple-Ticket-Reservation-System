"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/navigation/admin-sidebar";
import { AdminHeader } from "@/components/navigation/admin-header";
import { AdminBottomNav } from "@/components/navigation/admin-bottom-nav";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col">
      {/* Sticky Top Header with dynamic offset */}
      <div className={`sticky top-0 z-30 transition-all duration-300 ${collapsed ? "lg:pl-16" : "lg:pl-64"}`}>
        <AdminHeader onToggleMobileMenu={() => setMobileOpen(true)} />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <main
          className={`flex-1 min-w-0 transition-all duration-300 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 ${
            collapsed ? "lg:pl-20" : "lg:pl-70"
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <AdminBottomNav onOpenMenu={() => setMobileOpen(true)} />
    </div>
  );
}
