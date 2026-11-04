"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  Bus,
  Film,
  Music,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { TicketCategory } from "@/types/ticket.types";
import { useProviderStore } from "@/stores/provider.store";

interface SectorGuardProps {
  requiredCategory: TicketCategory;
  children: React.ReactNode;
}

const getCategoryLabel = (cat: TicketCategory) => {
  switch (cat) {
    case "BUS":
      return "Intercity Coach & Bus Operations";
    case "CINEMA":
      return "Cinema Screening Hall Operations";
    case "EVENT":
      return "Concerts & Festival Operations";
    case "SPORTS":
      return "Stadium Sports & Matchday Operations";
  }
};

const getCategoryHref = (cat: TicketCategory) => {
  switch (cat) {
    case "BUS":
      return "/provider/bus";
    case "CINEMA":
      return "/provider/cinema";
    case "EVENT":
      return "/provider/events";
    case "SPORTS":
      return "/provider/sports";
  }
};

const getCategoryIcon = (cat: TicketCategory) => {
  switch (cat) {
    case "BUS":
      return <Bus className="w-5 h-5 text-amber-600" />;
    case "CINEMA":
      return <Film className="w-5 h-5 text-amber-600" />;
    case "EVENT":
      return <Music className="w-5 h-5 text-amber-600" />;
    case "SPORTS":
      return <Trophy className="w-5 h-5 text-amber-600" />;
  }
};

export function SectorGuard({ requiredCategory, children }: SectorGuardProps) {
  const { organization } = useProviderStore();

  // If the provider's registered category matches, allow access
  if (organization.category === requiredCategory) {
    return <>{children}</>;
  }

  const myCategoryLabel = getCategoryLabel(organization.category);
  const myCategoryHref = getCategoryHref(organization.category);
  const requiredCategoryLabel = getCategoryLabel(requiredCategory);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-lg w-full bg-card border border-border/70 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <span>Sector Isolation Boundary</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Access Restricted to {requiredCategory} Providers
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            This operational console ({requiredCategoryLabel}) is isolated to registered {requiredCategory} partners.
            Your organization, <strong className="text-foreground">{organization.name}</strong>, is registered under <strong className="text-amber-600">{organization.category}</strong>.
          </p>
        </div>

        {/* Registered Domain Card */}
        <div className="bg-muted/30 border border-border/50 rounded-xl p-4 text-left flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-card border border-border/60 flex items-center justify-center">
              {getCategoryIcon(organization.category)}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Your Registered Domain
              </span>
              <span className="text-xs font-semibold text-foreground">{myCategoryLabel}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
          <Link
            href="/provider"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/70 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Provider Dashboard</span>
          </Link>

          <Link
            href={myCategoryHref}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Open {organization.category} Operations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

