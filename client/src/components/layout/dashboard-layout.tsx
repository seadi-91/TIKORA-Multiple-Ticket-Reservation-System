"use client";

import React from "react";
import { CustomerSidebar } from "@/components/navigation/customer-sidebar";
import { PublicNavbar } from "@/components/navigation/public-navbar";
import { Footer } from "@/components/layout/footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-[#F8FAFC]">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          <CustomerSidebar />
          <div className="flex-1 w-full min-w-0">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardLayout;

