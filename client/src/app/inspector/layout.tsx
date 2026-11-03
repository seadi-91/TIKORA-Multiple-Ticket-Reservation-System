"use client";

import React, { useState } from "react";
import { InspectorSidebar } from "@/components/navigation/inspector-sidebar";
import { InspectorHeader } from "@/components/navigation/inspector-header";
import { InspectorBottomNav } from "@/components/navigation/inspector-bottom-nav";

export default function InspectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
      <InspectorSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <InspectorHeader onToggleMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto pb-24 lg:pb-6">
          {children}
        </main>
        <InspectorBottomNav />
      </div>
    </div>
  );
}
