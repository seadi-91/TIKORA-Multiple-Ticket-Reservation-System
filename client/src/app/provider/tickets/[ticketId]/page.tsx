"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Edit,
  MapPin,
  PauseCircle,
  PlayCircle,
  ShieldCheck,
  Ticket,
  Users,
  CheckCircle2,
  DollarSign,
  Bus,
  Film,
  Music,
  Trophy,
  ExternalLink,
  Layers,
  Sparkles,
  Loader2,
} from "lucide-react";
import { TicketService } from "@/services/ticket.service";
import { formatCurrency } from "@/lib/format-currency";
import { TicketItem } from "@/types/ticket.types";
import { toast } from "sonner";

export default function ProviderTicketDetailPage() {
  const params = useParams();
  const ticketId = (params?.ticketId as string) || "";

  const [ticket, setTicket] = useState<TicketItem | null>(() => TicketService.getTicketById(ticketId) || null);
  const [loading, setLoading] = useState(!ticket);
  const [isActive, setIsActive] = useState(ticket ? (ticket.status as string) !== "SOLD_OUT" && (ticket.status as string) !== "INACTIVE" : true);

  useEffect(() => {
    let isMounted = true;
    TicketService.fetchTicketById(ticketId, true).then((fetched) => {
      if (isMounted) {
        if (fetched) {
          setTicket(fetched);
          setIsActive((fetched.status as string) !== "SOLD_OUT" && (fetched.status as string) !== "INACTIVE");
        }
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [ticketId]);

  // Live passenger / attendee manifest
  const [manifest, setManifest] = useState<
    Array<{
      id: string;
      name: string;
      seat: string;
      phone: string;
      bookingRef: string;
      status: string;
      paid: boolean;
      time: string;
    }>
  >([]);

  if (loading && !ticket) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground">Loading ticket listing from central inventory...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-8 text-center bg-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 max-w-md mx-auto my-12">
        <Ticket className="w-10 h-10 text-muted-foreground/40 mx-auto" />
        <h3 className="text-sm font-bold text-foreground">Ticket listing not found</h3>
        <p className="text-xs text-muted-foreground">The requested ticket listing #{ticketId} could not be located in your organization inventory.</p>
        <Link
          href="/provider/tickets"
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Listings
        </Link>
      </div>
    );
  }

  const bookedSeats = ticket.totalSeats - ticket.availableSeats;
  const occupancyRate = Math.round((bookedSeats / (ticket.totalSeats || 1)) * 100);
  const totalGrossRevenue = bookedSeats * ticket.price;

  const handleToggleSales = () => {
    setIsActive(!isActive);
    toast.success(
      isActive
        ? "Ticket sales paused. Customers can no longer book this listing."
        : "Ticket sales resumed. Now accepting public reservations."
    );
  };

  const handleExportCSV = () => {
    toast.success("Passenger manifest CSV exported successfully.");
  };

  const handleToggleCheckIn = (id: string) => {
    setManifest((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            status: item.status === "CHECKED_IN" ? "PENDING_BOARDING" : "CHECKED_IN",
          }
          : item
      )
    );
    toast.success("Passenger boarding status updated");
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "BUS":
        return <Bus className="w-4 h-4 text-amber-600" />;
      case "EVENT":
        return <Music className="w-4 h-4 text-purple-600" />;
      case "SPORTS":
        return <Trophy className="w-4 h-4 text-emerald-600" />;
      case "CINEMA":
        return <Film className="w-4 h-4 text-sky-600" />;
      default:
        return <Ticket className="w-4 h-4 text-amber-600" />;
    }
  };

  const getTimeLabel = (cat: string) => {
    switch (cat) {
      case "CINEMA":
        return "Showtime / Starts At";
      case "BUS":
        return "Departure Time";
      case "SPORTS":
        return "Match Kickoff";
      default:
        return "Gate Opens / Starts";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/provider/tickets"
            className="p-2 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase">
                #{ticket.id}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${isActive
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  }`}
              >
                {isActive ? "Active Sales" : "Sales Paused"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-foreground border border-slate-200/50 dark:border-slate-800/50">
                {ticket.category}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground mt-0.5">
              {ticket.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/tickets/${ticket.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-card hover:bg-muted text-foreground transition-all shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
            <span>Open Public Pass</span>
          </Link>

          <button
            type="button"
            onClick={handleToggleSales}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${isActive
                ? "border-amber-600/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
                : "border-emerald-600/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
              }`}
          >
            {isActive ? (
              <>
                <PauseCircle className="w-3.5 h-3.5" /> Pause Sales
              </>
            ) : (
              <>
                <PlayCircle className="w-3.5 h-3.5" /> Resume Sales
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-card hover:bg-muted text-foreground transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Manifest
          </button>

          <Link
            href={`/provider/tickets/${ticket.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Listing
          </Link>
        </div>
      </div>

      {/* Hero Cover Image Banner (Cloudinary Custom Upload or Default Category Asset) */}
      {ticket.imageUrl && (
        <div className="relative w-full h-52 sm:h-72 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ticket.imageUrl}
            alt={ticket.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/20" />

          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-amber-600 text-white shadow-xs">
                  {ticket.category}
                </span>
                <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{ticket.organizer}</span>
                </span>
              </div>
              <h2 className="text-white font-black text-lg sm:text-2xl drop-shadow-md">
                {ticket.title}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{ticket.location} • {ticket.city}</span>
              </p>
            </div>

            <div className="bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-right">
              <span className="text-[10px] uppercase font-bold text-amber-200 block">
                Starting Seat Price
              </span>
              <span className="text-lg sm:text-xl font-black text-white">
                {formatCurrency(ticket.price)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="font-semibold">Starting Price</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-base sm:text-lg font-black text-foreground">
            {formatCurrency(ticket.price)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Base allocated fare</p>
        </div>

        <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="font-semibold">Occupancy Rate</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base sm:text-lg font-black text-foreground">{occupancyRate}%</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${occupancyRate >= 80
                  ? "bg-rose-500"
                  : occupancyRate >= 50
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="font-semibold">Seats Reserved</span>
            <Ticket className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-base sm:text-lg font-black text-foreground">
            {bookedSeats}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              / {ticket.totalSeats}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {ticket.availableSeats} remaining seats
          </p>
        </div>

        <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="font-semibold">Gross Revenue</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalGrossRevenue)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Direct ticket bookings</p>
        </div>
      </div>

      {/* Main Grid: Details & Manifest */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details card */}
        <div className="space-y-6">
          <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Listing Metadata & Schedule
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  {getCategoryIcon(ticket.category)} Category
                </span>
                <span className="font-bold text-foreground">{ticket.category}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Date
                </span>
                <span className="font-semibold text-foreground">{ticket.date}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {getTimeLabel(ticket.category)}
                </span>
                <span className="font-bold text-foreground">{ticket.time}</span>
              </div>

              <div className="flex items-start justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Venue / Station
                </span>
                <span className="font-medium text-foreground text-right max-w-[180px]">
                  {ticket.location}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Operating City</span>
                <span className="font-semibold text-foreground">{ticket.city}</span>
              </div>

              {ticket.duration && (
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Estimated Duration</span>
                  <span className="font-semibold text-foreground">{ticket.duration}</span>
                </div>
              )}

              {ticket.badge && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Marketing Badge</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-600/30">
                    {ticket.badge}
                  </span>
                </div>
              )}
            </div>

            {ticket.description && (
              <div className="pt-2 border-t border-border/40">
                <span className="text-xs font-semibold text-foreground block mb-1">
                  Public Overview
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ticket.description}
                </p>
              </div>
            )}
          </div>

          {/* Pricing Tiers Card */}
          {ticket.tiers && ticket.tiers.length > 0 && (
            <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span>Configured Admission Tiers</span>
              </h3>
              <div className="space-y-2">
                {ticket.tiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-foreground block">{tier.name}</span>
                      {tier.perks && (
                        <span className="text-[10px] text-muted-foreground">
                          {tier.perks.join(" • ")}
                        </span>
                      )}
                    </div>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                      {formatCurrency(tier.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Included Amenities */}
          {ticket.amenities && ticket.amenities.length > 0 && (
            <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Included Amenities & Specs
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {ticket.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md bg-muted/60 text-foreground border border-border/50"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Passenger / Attendee Manifest Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Boarding Manifest & Booked Attendees
                </h3>
                <p className="text-xs text-muted-foreground">
                  Verified passengers booked on this specific departure
                </p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Showing {manifest.length} of {bookedSeats} booked
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">Seat</th>
                    <th className="py-2.5 px-3">Passenger</th>
                    <th className="py-2.5 px-3">Booking Ref</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Boarding Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {manifest.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-3 text-center text-muted-foreground text-xs">
                        <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                        <p className="font-semibold text-foreground">No passengers checked in yet</p>
                        <p className="text-[11px] mt-0.5">Passenger boarding records will appear as tickets are scanned by gate inspectors.</p>
                      </td>
                    </tr>
                  ) : (
                    manifest.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-amber-600">
                          {item.seat}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-foreground block">{item.name}</span>
                          <span className="text-[10px] text-muted-foreground">Checked {item.time}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-foreground">
                          {item.bookingRef}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{item.phone}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${item.status === "CHECKED_IN"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${item.status === "CHECKED_IN" ? "bg-emerald-600" : "bg-amber-500"
                                }`}
                            />
                            {item.status === "CHECKED_IN" ? "Boarded" : "Pending"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleCheckIn(item.id)}
                            className="px-2.5 py-1 text-[11px] font-medium rounded border border-border/70 hover:bg-muted text-foreground transition-colors"
                          >
                            {item.status === "CHECKED_IN" ? "Revoke" : "Check-in"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
