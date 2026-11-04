"use client";

import React from "react";
import { CustomerSidebar } from "@/components/navigation/customer-sidebar";
import { CustomerBottomNav } from "@/components/navigation/customer-bottom-nav";
import { PublicNavbar } from "@/components/navigation/public-navbar";
import { Footer } from "@/components/layout/footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 pb-24 lg:pb-8">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          <div className="hidden lg:block shrink-0">
            <CustomerSidebar />
          </div>
          <div className="flex-1 w-full min-w-0">{children}</div>
        </div>
      </main>

      <div className="hidden lg:block">
        <Footer />
      </div>

      {/* Modern Mobile Bottom Navigation for Customer Portal */}
      <CustomerBottomNav />
    </div>
  );
}

export default DashboardLayout;

