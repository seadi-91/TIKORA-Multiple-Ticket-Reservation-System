import React from "react";
import { SectorGuard } from "@/components/provider/sector-guard";

export default function SportsSectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectorGuard requiredCategory="SPORTS">{children}</SectorGuard>;
}

