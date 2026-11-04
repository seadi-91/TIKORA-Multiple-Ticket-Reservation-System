import React from "react";
import { SectorGuard } from "@/components/provider/sector-guard";

export default function BusSectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectorGuard requiredCategory="BUS">{children}</SectorGuard>;
}

