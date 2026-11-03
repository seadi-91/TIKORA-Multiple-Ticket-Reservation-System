"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { TicketService } from "@/services/ticket.service";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";

export default function ProviderTicketDetailPage() {
  const params = useParams();
  const ticketId = (params?.ticketId as string) || "bus-1";

  // Find ticket or fallback to bus-1
  const allTickets = TicketService.getAllTickets();
  const ticket = allTickets.find((t) => t.id === ticketId) || allTickets[0];

  const [isActive, setIsActive] = useState(ticket?.status !== "SOLD_OUT");

  // Simulated passenger / attendee manifest
  const [manifest, setManifest] = useState([
    {
      id: "MAN-01",
      name: "Dawit Hailemariam",
      seat: "04A",
      phone: "+251 91 182 9182",
      bookingRef: "TH-BUS-8829",
      status: "CHECKED_IN",
      paid: true,
      time: "05:40 AM",
    },
    {
      id: "MAN-02",
      name: "Tigist Alemu",
      seat: "04B",
      phone: "+251 92 344 8811",
      bookingRef: "TH-BUS-8830",
      status: "CHECKED_IN",
      paid: true,
      time: "05:45 AM",
    },
    {
      id: "MAN-03",
      name: "Yared Tesfaye",
      seat: "05A",
      phone: "+251 93 512 0099",
      bookingRef: "TH-BUS-8835",
      status: "PENDING_BOARDING",
      paid: true,
      time: "05:52 AM",
    },
    {
      id: "MAN-04",
      name: "Bethlehem Assefa",
      seat: "05B",
      phone: "+251 91 766 2211",
      bookingRef: "TH-BUS-8841",
      status: "PENDING_BOARDING",
      paid: true,
      time: "05:58 AM",
    },
    {
      id: "MAN-05",
      name: "Samuel Kebede",
      seat: "06A",
      phone: "+251 94 881 7733",
      bookingRef: "TH-BUS-8849",
      status: "CHECKED_IN",
      paid: true,
      time: "06:01 AM",
    },
  ]);

  if (!ticket) {
    return (
      <div className="p-8 text-center bg-card rounded-xl border border-border/60">
        <p className="text-muted-foreground text-sm">Ticket listing not found.</p>
        <Link
          href="/provider/tickets"
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Listings
        </Link>
      </div>
    );
  }

  const bookedSeats = ticket.totalSeats - ticket.availableSeats;
  const occupancyRate = Math.round((bookedSeats / ticket.totalSeats) * 100);
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

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/provider/tickets"
            className="p-2 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase">
                #{ticket.id}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${isActive
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  }`}
              >
                {isActive ? "Active Sales" : "Sales Paused"}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-0.5">
              {ticket.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSales}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${isActive
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
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Manifest
          </button>

          <Link
            href={`/provider/tickets/${ticket.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Listing
          </Link>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Ticket Price</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-foreground">
            {formatCurrency(ticket.price)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Per allocated seat</p>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Occupancy Rate</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-foreground">{occupancyRate}%</div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
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

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Seats Reserved</span>
            <Ticket className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-foreground">
            {bookedSeats}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              / {ticket.totalSeats}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {ticket.availableSeats} remaining
          </p>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Gross Revenue</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-foreground">
            {formatCurrency(totalGrossRevenue)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">From this listing</p>
        </div>
      </div>

      {/* Main Grid: Details & Manifest */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details card */}
        <div className="space-y-6">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Listing Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  {getCategoryIcon(ticket.category)} Category
                </span>
                <span className="font-semibold text-foreground">{ticket.category}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Date
                </span>
                <span className="font-semibold text-foreground">{ticket.date}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Departure / Gate
                </span>
                <span className="font-semibold text-foreground">{ticket.time}</span>
              </div>

              <div className="flex items-start justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Terminal / Venue
                </span>
                <span className="font-medium text-foreground text-right max-w-[180px]">
                  {ticket.location}
                </span>
              </div>

              {ticket.duration && (
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Trip Duration</span>
                  <span className="font-semibold text-foreground">{ticket.duration}</span>
                </div>
              )}

              {ticket.badge && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Marketing Badge</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-600/30">
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

          {/* Included Amenities */}
          {ticket.amenities && ticket.amenities.length > 0 && (
            <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs">
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
          <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
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
                  {manifest.map((item) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
