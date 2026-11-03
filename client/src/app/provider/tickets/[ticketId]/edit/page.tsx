"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Save,
  Users,
} from "lucide-react";
import { TicketService } from "@/services/ticket.service";
import { toast } from "sonner";

export default function EditTicketPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = (params?.ticketId as string) || "bus-1";

  const allTickets = TicketService.getAllTickets();
  const ticket = allTickets.find((t) => t.id === ticketId) || allTickets[0];

  const [formData, setFormData] = useState({
    title: ticket?.title || "",
    description: ticket?.description || "",
    city: ticket?.city || "Addis Ababa",
    location: ticket?.location || "",
    date: ticket?.date || "2026-11-20",
    time: ticket?.time || "06:00 AM",
    price: ticket?.price || 650,
    totalSeats: ticket?.totalSeats || 48,
    availableSeats: ticket?.availableSeats || 8,
    status: ticket?.status || "AVAILABLE",
    badge: ticket?.badge || "Direct Express",
    amenities: ticket?.amenities || [
      "Free High-Speed Wi-Fi",
      "USB Charging Ports",
      "Dual AC System",
      "Reclining Leather Seats",
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()],
      });
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (name: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== name),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Ticket listing updated successfully!");
      router.push(`/provider/tickets/${ticketId}`);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href={`/provider/tickets/${ticketId}`}
            className="p-2 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase">
                #{ticketId}
              </span>
              <span className="text-xs text-amber-600 font-semibold">• Editing Mode</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Edit Ticket Listing
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/provider/tickets/${ticketId}`}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-border/70 hover:bg-muted text-foreground transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="edit-ticket-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>

      <form id="edit-ticket-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* General Details */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              General Information
            </h3>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Listing Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Description & Terms
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">City</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Boarding Terminal / Venue
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Scheduled Date</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Departure Time
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Seat Capacity */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pricing & Seat Capacity Allocation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Fare per Seat (ETB)
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Total Coach / Hall Seats
                </label>
                <div className="relative">
                  <Users className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="number"
                    min="1"
                    value={formData.totalSeats}
                    onChange={(e) =>
                      setFormData({ ...formData, totalSeats: Number(e.target.value) })
                    }
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Available for Booking
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.totalSeats}
                  value={formData.availableSeats}
                  onChange={(e) =>
                    setFormData({ ...formData, availableSeats: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Amenities */}
        <div className="space-y-6">
          {/* Status Settings */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Sales Availability
            </h3>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Current Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "AVAILABLE" | "SELLING_FAST" | "SOLD_OUT",
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
              >
                <option value="AVAILABLE">Available for Booking</option>
                <option value="SELLING_FAST">Selling Fast (Low Seats)</option>
                <option value="SOLD_OUT">Sold Out / Halted</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Promotional Badge
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
              />
            </div>
          </div>

          {/* Amenities & Perks */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Listing Perks
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="New amenity"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-border/70 bg-background text-foreground"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-foreground hover:bg-muted/80"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {formData.amenities.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-600/20"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(item)}
                    className="hover:text-destructive text-[10px]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
