"use client";

import React, { useState } from "react";
import { ProviderSidebar } from "@/components/navigation/provider-sidebar";
import { ProviderHeader } from "@/components/navigation/provider-header";
import { ProviderBottomNav } from "@/components/navigation/provider-bottom-nav";

export default function ProviderRootLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col">
      <div className="flex-1 flex w-full min-w-0">
        {/* Desktop Sticky Sidebar */}
        <ProviderSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Right Content Area: Sticky Header + Main Page */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <div className="sticky top-0 z-30 w-full">
            <ProviderHeader onToggleMobileMenu={() => setMobileOpen(true)} />
          </div>

          <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto w-full space-y-6">{children}</div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation for Providers */}
      <ProviderBottomNav onOpenMenu={() => setMobileOpen(true)} />
    </div>
  );
}
