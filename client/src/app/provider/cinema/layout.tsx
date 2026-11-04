import React from "react";
import { SectorGuard } from "@/components/provider/sector-guard";

export default function CinemaSectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectorGuard requiredCategory="CINEMA">{children}</SectorGuard>;
}

