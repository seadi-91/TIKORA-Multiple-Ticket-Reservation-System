import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function CustomerRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["CUSTOMER", "ADMIN"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
