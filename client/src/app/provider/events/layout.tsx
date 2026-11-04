import React from "react";
import { SectorGuard } from "@/components/provider/sector-guard";

export default function EventSectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectorGuard requiredCategory="EVENT">{children}</SectorGuard>;
}

