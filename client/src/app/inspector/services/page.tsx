"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bus,
  Calendar,
  CheckCircle2,
  Clock,
  Film,
  MapPin,
  Music,
  Phone,
  QrCode,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useInspectorStore, InspectorAssignment } from "@/stores/inspector.store";
import { TicketCategory } from "@/types/ticket.types";
import { toast } from "sonner";

export default function InspectorAssignedServicesPage() {
  const router = useRouter();
  const { assignments, profile, setCurrentAssignment, fetchOrganizationServices } = useInspectorStore();
  const [selectedService, setSelectedService] = useState<InspectorAssignment | null>(null);

  useEffect(() => {
    fetchOrganizationServices();
  }, [fetchOrganizationServices]);

  const getCategoryIcon = (cat: TicketCategory) => {
    switch (cat) {
      case "BUS":
        return <Bus className="w-4 h-4 text-amber-600" />;
      case "EVENT":
        return <Music className="w-4 h-4 text-purple-600" />;
      case "SPORTS":
        return <Trophy className="w-4 h-4 text-emerald-600" />;
      case "CINEMA":
        return <Film className="w-4 h-4 text-amber-600" />;
    }
  };

  const getPageHeading = () => {
    switch (profile.category) {
      case "CINEMA":
        return {
          title: "Authorized Movie Showtimes & Screenings",
          desc: `Active screening schedules managed by ${profile.organizationName}. Ushers verify admissions exclusively for these authorized theater auditoriums.`,
          unitLabel: "Patrons Admitted",
          actionLabel: "Launch Usher Scanner",
          unitType: "Screening Hall",
        };
      case "BUS":
        return {
          title: "Scheduled Bus Trips & Fleet Operations",
          desc: `Active passenger transport departures managed by ${profile.organizationName}. Inspectors verify boarding exclusively for these authorized coach routes.`,
          unitLabel: "Passengers Boarded",
          actionLabel: "Launch Boarding Scanner",
          unitType: "Express Coach",
        };
      case "EVENT":
        return {
          title: "Concert Stages & Festival Sessions",
          desc: `Active festival stages managed by ${profile.organizationName}. Staff verify entry wristbands for these events.`,
          unitLabel: "Guests Admitted",
          actionLabel: "Launch Turnstile Scanner",
          unitType: "Festival Pavilion",
        };
      case "SPORTS":
        return {
          title: "Matchday Stadium Fixtures",
          desc: `Active sporting fixtures managed by ${profile.organizationName}. Inspectors verify tribune passes for these matches.`,
          unitLabel: "Fans Admitted",
          actionLabel: "Launch Tribune Scanner",
          unitType: "Stadium Stand",
        };
    }
  };

  const headingInfo = getPageHeading();

  const handleLaunchScan = (asn: InspectorAssignment) => {
    setCurrentAssignment(asn.id);
    toast.success(`Active scanning session set to: ${asn.title}`);
    router.push("/inspector/scanner");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              {profile.organizationName}
            </span>
            <span className="text-xs text-slate-500">Provider-Restricted Duty</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {headingInfo.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {headingInfo.desc}
          </p>
        </div>

        <Link
          href="/inspector/scanner"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors shrink-0"
        >
          <QrCode className="w-3.5 h-3.5" /> Open Scanner
        </Link>
      </div>

      {/* Services Grid */}
      {assignments.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-card border border-dashed border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">No authorized services assigned</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There are currently no active transport corridors, screening halls, or turnstile events authorized for your scanner badge.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((asn) => {
          const occupancy = Math.round((asn.scannedSeats / asn.totalSeats) * 100);

          return (
            <div
              key={asn.id}
              className="bg-card border border-slate-200/70 dark:border-slate-800/70 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-600/20">
                    {getCategoryIcon(asn.category)}
                    <span>{asn.category}</span>
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      asn.status === "ACTIVE_NOW"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : asn.status === "UPCOMING"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-muted text-muted-foreground border-border/50"
                    }`}
                  >
                    {asn.status === "ACTIVE_NOW"
                      ? "Admitting Now"
                      : asn.status === "UPCOMING"
                      ? "Upcoming"
                      : "Completed"}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground line-clamp-1">{asn.title}</h3>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold block mt-0.5">
                    {profile.organizationName}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground bg-slate-50/70 dark:bg-slate-800/30 p-3.5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">
                      {asn.venueOrTerminal} ({asn.gate})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>
                      {asn.scheduledDate} • {asn.scheduledTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {profile.category === "CINEMA" ? (
                      <Film className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <Bus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                    <span className="truncate">{asn.coachOrHall}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-muted-foreground">{headingInfo.unitLabel}:</span>
                    <span className="font-mono font-bold text-foreground">
                      {asn.scannedSeats} / {asn.totalSeats} seats
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, occupancy)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200/40 dark:border-slate-800/40 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedService(asn)}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                >
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchScan(asn)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <QrCode className="w-3 h-3" />
                  <span>{headingInfo.actionLabel}</span>
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border/80 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-foreground">Service Specification</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Service Title
                </span>
                <p className="text-sm font-bold text-foreground mt-0.5">{selectedService.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3 rounded-2xl">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Venue / Terminal</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedService.venueOrTerminal}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Gate / Entrance</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedService.gate}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Scheduled Departure/Show</span>
                  <p className="font-semibold text-foreground mt-0.5">
                    {selectedService.scheduledDate} at {selectedService.scheduledTime}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">{headingInfo.unitType}</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedService.coachOrHall}</p>
                </div>
              </div>

              {selectedService.driverOrLead && (
                <div className="p-3 bg-muted/40 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Station Lead / Officer</span>
                    <p className="font-semibold text-foreground">{selectedService.driverOrLead}</p>
                  </div>
                  {selectedService.driverPhone && (
                    <a
                      href={`tel:${selectedService.driverPhone}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:underline"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                  )}
                </div>
              )}

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300 block mb-1">
                  Provider Management Instructions
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedService.specialInstructions}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleLaunchScan(selectedService);
                  setSelectedService(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
              >
                Launch Scanner for This Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
