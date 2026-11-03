"use client";

import React, { useState } from "react";
import { ProviderSidebar } from "@/components/navigation/provider-sidebar";
import { ProviderHeader } from "@/components/navigation/provider-header";

export default function ProviderRootLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col">
      {/* Top Mobile/Desktop Header */}
      <div className={`transition-all duration-300 ${collapsed ? "lg:pl-18" : "lg:pl-64"}`}>
        <ProviderHeader onToggleMobileMenu={() => setMobileOpen(true)} />
      </div>

      {/* Main Grid with Fixed/Collapsible Sidebar */}
      <div className="flex-1 flex w-full">
        <ProviderSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <main
          className={`flex-1 min-w-0 transition-all duration-300 p-4 sm:p-6 lg:p-8 ${
            collapsed ? "lg:pl-6" : "lg:pl-8"
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

