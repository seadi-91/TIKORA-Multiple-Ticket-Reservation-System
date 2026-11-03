"use client";

import React, { useState } from "react";
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
  const { assignments, profile, setCurrentAssignment } = useInspectorStore();
  const [selectedService, setSelectedService] = useState<InspectorAssignment | null>(null);

  const getCategoryIcon = (cat: TicketCategory) => {
    switch (cat) {
      case "BUS":
        return <Bus className="w-4 h-4 text-amber-600" />;
      case "EVENT":
        return <Music className="w-4 h-4 text-purple-600" />;
      case "SPORTS":
        return <Trophy className="w-4 h-4 text-emerald-600" />;
      case "CINEMA":
        return <Film className="w-4 h-4 text-sky-600" />;
    }
  };

  const handleLaunchScan = (asn: InspectorAssignment) => {
    setCurrentAssignment(asn.id);
    toast.success(`Active scanning session set to: ${asn.title}`);
    router.push("/inspector/scanner");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            My Assigned Services & Fleet Operations
          </h1>
          <p className="text-xs text-muted-foreground">
            Authorized services managed by {profile.organizationName}. You can only verify tickets for these assigned operations.
          </p>
        </div>

        <Link
          href="/inspector/scanner"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
        >
          <QrCode className="w-3.5 h-3.5" /> Open Scanner
        </Link>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((asn) => {
          const occupancy = Math.round((asn.scannedSeats / asn.totalSeats) * 100);

          return (
            <div
              key={asn.id}
              className="bg-card border border-border/60 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-600/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-600/20">
                    {getCategoryIcon(asn.category)}
                    <span>{asn.category}</span>
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      asn.status === "ACTIVE_NOW"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : asn.status === "UPCOMING"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-muted text-muted-foreground border-border/50"
                    }`}
                  >
                    {asn.status === "ACTIVE_NOW"
                      ? "Boarding Now"
                      : asn.status === "UPCOMING"
                      ? "Upcoming"
                      : "Completed"}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground line-clamp-1">{asn.title}</h3>
                  <span className="text-[11px] text-amber-600 font-semibold block mt-0.5">
                    {profile.organizationName}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/40">
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
                    <Bus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{asn.coachOrHall}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">Boarded / Scanned:</span>
                    <span className="font-mono font-bold text-foreground">
                      {asn.scannedSeats} / {asn.totalSeats} seats
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, occupancy)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedService(asn)}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:underline"
                >
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchScan(asn)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" /> Scan Post
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">{selectedService.title}</h3>
                <span className="text-xs text-muted-foreground font-mono">
                  {selectedService.id} • {selectedService.gate}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-muted/20 p-3 rounded-lg border border-border/40">
                <div>
                  <span className="text-muted-foreground text-[11px] block">Terminal & Gate:</span>
                  <span className="font-semibold text-foreground block">
                    {selectedService.venueOrTerminal}
                  </span>
                  <span className="text-[11px] text-amber-600 font-bold">
                    {selectedService.gate}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">Departure Time:</span>
                  <span className="font-semibold text-foreground block">
                    {selectedService.scheduledDate}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {selectedService.scheduledTime}
                  </span>
                </div>
              </div>

              {selectedService.driverOrLead && (
                <div className="bg-muted/20 p-3 rounded-lg border border-border/40 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Lead Driver:</span>
                    <span className="font-semibold text-foreground">
                      {selectedService.driverOrLead}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-600 font-mono font-medium">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedService.driverPhone}</span>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-600/30 text-amber-800 dark:text-amber-200">
                <span className="font-bold block mb-0.5">Inspection Instructions:</span>
                <p className="leading-relaxed">{selectedService.specialInstructions}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-border/70 hover:bg-muted text-foreground"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = selectedService;
                  setSelectedService(null);
                  handleLaunchScan(s);
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white"
              >
                Start Scanning Gate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

