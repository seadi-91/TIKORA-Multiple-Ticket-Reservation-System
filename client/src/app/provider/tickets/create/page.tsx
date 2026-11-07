"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bus,
  Calendar,
  Clock,
  Film,
  MapPin,
  Music,
  Plus,
  Save,
  Trophy,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { TicketCategory } from "@/types/ticket.types";
import { TicketService, FIXED_CATEGORY_IMAGES } from "@/services/ticket.service";
import { useProviderStore } from "@/stores/provider.store";
import { toast } from "sonner";

interface TicketTier {
  id: string;
  name: string;
  price: number;
  capacity: number;
  description: string;
}

export default function CreateTicketPage() {
  const router = useRouter();
  const organization = useProviderStore((state) => state.organization);
  const category = organization.category;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "Addis Ababa",
    location:
      organization.address ||
      (category === "BUS"
        ? "Autobus Tera Gate 3, Addis Ababa"
        : category === "CINEMA"
        ? `${organization.name}, Addis Ababa`
        : category === "EVENT"
        ? "Millennium Hall Main Auditorium"
        : "Addis Ababa Stadium"),
    date: "2026-11-20",
    time:
      category === "BUS"
        ? "06:00 AM"
        : category === "CINEMA"
        ? "05:30 PM"
        : category === "EVENT"
        ? "06:00 PM"
        : "03:00 PM",
    basePrice:
      category === "BUS"
        ? 650
        : category === "CINEMA"
        ? 300
        : category === "EVENT"
        ? 850
        : 350,
    totalCapacity: category === "BUS" ? 50 : category === "CINEMA" ? 120 : 500,
    status: "AVAILABLE",
    badge:
      category === "BUS"
        ? "Luxury Express"
        : category === "CINEMA"
        ? "Laser 4K Atmos"
        : category === "EVENT"
        ? "Live Concert"
        : "Derby Match",
    // Bus specific
    origin: "Addis Ababa (Autobus Tera)",
    destination: "Hawassa (Main Terminal)",
    busType: "Luxury VIP Coach",
    // Event specific
    performer: "",
    gateTime: "04:00 PM",
    ageRestriction: "All Ages",
    // Sports specific
    homeTeam: "",
    awayTeam: "",
    tournament: "Ethiopian Premier League",
    stadiumGate: "Gate 4 (Grandstand)",
    // Cinema specific
    hallName: "Hall 1 (VIP Laser)",
    screenFormat: "4K Laser Dolby Atmos",
  });

  const [tiers, setTiers] = useState<TicketTier[]>([
    { id: "tier-1", name: "Standard", price: 500, capacity: 40, description: "Standard comfortable allocated seating" },
    { id: "tier-2", name: "VIP Executive", price: 850, capacity: 10, description: "Premium front row with complimentary refreshments" },
  ]);

  const [amenities, setAmenities] = useState<string[]>([
    "Free Wi-Fi",
    "Air Conditioning",
    "Charging Ports",
    "Luggage Space",
  ]);

  const [newAmenity, setNewAmenity] = useState("");

  const handleAddTier = () => {
    const newTier: TicketTier = {
      id: `tier-${Date.now()}`,
      name: "New Tier",
      price: formData.basePrice * 1.5,
      capacity: 10,
      description: "Additional tier perk access",
    };
    setTiers([...tiers, newTier]);
  };

  const handleRemoveTier = (id: string) => {
    if (tiers.length <= 1) {
      toast.error("At least one ticket tier is required");
      return;
    }
    setTiers(tiers.filter((t) => t.id !== id));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (name: string) => {
    setAmenities(amenities.filter((a) => a !== name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a service or ticket title");
      return;
    }

    setIsSubmitting(true);
    TicketService.addTicket({
      id: `${category.toLowerCase()}-${Date.now()}`,
      title: formData.title,
      category,
      organizer: organization.name,
      organizerVerified: organization.verified,
      location: formData.location,
      city: formData.city,
      date: formData.date,
      time: formData.time,
      price: Number(formData.basePrice),
      currency: "ETB",
      availableSeats: Number(formData.totalCapacity),
      totalSeats: Number(formData.totalCapacity),
      status: "AVAILABLE",
      badge: formData.badge,
      imageUrl: FIXED_CATEGORY_IMAGES[category],
      description: formData.description,
      amenities,
      tiers: tiers.map((t) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        available: t.capacity,
        perks: [t.description],
      })),
    });

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Ticket listing published successfully!");
      router.push("/provider/tickets");
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/provider/tickets"
            className="p-2 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Publish New Ticket Listing
            </h1>
            <p className="text-xs text-muted-foreground">
              Create a new operational ticket tier across transportation, events, sports, or cinema.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              toast.info("Draft saved locally");
            }}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-border/70 hover:bg-muted text-foreground transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            form="ticket-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            {isSubmitting ? "Publishing..." : "Publish Ticket"}
          </button>
        </div>
      </div>

      <form id="ticket-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Locked Sector Domain Notice */}
          <div className="bg-card border border-border/60 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                  {category === "BUS" && <Bus className="w-5 h-5" />}
                  {category === "CINEMA" && <Film className="w-5 h-5" />}
                  {category === "EVENT" && <Music className="w-5 h-5" />}
                  {category === "SPORTS" && <Trophy className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-foreground">
                      {category === "BUS" && "Intercity Bus Operations"}
                      {category === "CINEMA" && "Cinema Screening Hall Operations"}
                      {category === "EVENT" && "Concerts & Festival Operations"}
                      {category === "SPORTS" && "Stadium & Sports Operations"}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Authorized Sector
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Organization: <span className="font-semibold text-foreground">{organization.name}</span> • All tickets are strictly restricted to your registered sector.
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right sm:border-l sm:border-border/60 sm:pl-4">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Domain</span>
                <span className="text-xs font-bold text-amber-600">{category}</span>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              2. Core Ticket Details
            </label>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Service / Event Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={
                  category === "BUS"
                    ? "e.g. Addis Ababa to Hawassa Luxury Express Coach"
                    : category === "EVENT"
                      ? "e.g. Afro Beats & Jazz Night Live at Millennium Hall"
                      : category === "SPORTS"
                        ? "e.g. St. George SC vs Ethiopian Coffee SC (Derby)"
                        : "e.g. Avatar: The Way of Water 3D Dolby Atmos"
                }
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Public Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe boarding instructions, special conditions, gate opening policies, and amenities..."
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">City / Location</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Specific Venue or Terminal
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Autobus Tera Gate 3 / Millennium Hall"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Departure / Gate Time
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 06:00 AM"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sector Specific Fields */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              3. {category} Specific Metadata
            </label>

            {category === "BUS" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Departure Origin</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Destination</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Coach Type</label>
                  <input
                    type="text"
                    value={formData.busType}
                    onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            {category === "EVENT" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Headlining Artist</label>
                  <input
                    type="text"
                    value={formData.performer}
                    onChange={(e) => setFormData({ ...formData, performer: e.target.value })}
                    placeholder="e.g. Teddy Afro, Rophnan"
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Gate Opens</label>
                  <input
                    type="text"
                    value={formData.gateTime}
                    onChange={(e) => setFormData({ ...formData, gateTime: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Age Restriction</label>
                  <select
                    value={formData.ageRestriction}
                    onChange={(e) => setFormData({ ...formData, ageRestriction: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="All Ages">All Ages</option>
                    <option value="18+">18+ Only</option>
                    <option value="21+">21+ Only</option>
                  </select>
                </div>
              </div>
            )}

            {category === "SPORTS" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Tournament / League</label>
                  <input
                    type="text"
                    value={formData.tournament}
                    onChange={(e) => setFormData({ ...formData, tournament: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Designated Gate</label>
                  <input
                    type="text"
                    value={formData.stadiumGate}
                    onChange={(e) => setFormData({ ...formData, stadiumGate: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            {category === "CINEMA" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Auditorium / Hall</label>
                  <input
                    type="text"
                    value={formData.hallName}
                    onChange={(e) => setFormData({ ...formData, hallName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Screen Format</label>
                  <input
                    type="text"
                    value={formData.screenFormat}
                    onChange={(e) => setFormData({ ...formData, screenFormat: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pricing Tiers Section */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  4. Ticket Tiers & Capacity
                </label>
                <p className="text-[11px] text-muted-foreground">
                  Configure multiple price levels or seat classes for this service.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddTier}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-dashed border-amber-600/60 text-amber-600 hover:bg-amber-500/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Tier
              </button>
            </div>

            <div className="space-y-3">
              {tiers.map((tier, idx) => (
                <div
                  key={tier.id}
                  className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-foreground">
                      Tier #{idx + 1}: {tier.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(tier.id)}
                      className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Remove tier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-muted-foreground mb-1">Tier Name</label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => {
                          const updated = [...tiers];
                          updated[idx].name = e.target.value;
                          setTiers(updated);
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-md border border-border/70 bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-muted-foreground mb-1">Price (ETB)</label>
                      <input
                        type="number"
                        min="0"
                        value={tier.price}
                        onChange={(e) => {
                          const updated = [...tiers];
                          updated[idx].price = Number(e.target.value);
                          setTiers(updated);
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-md border border-border/70 bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-muted-foreground mb-1">Total Capacity</label>
                      <input
                        type="number"
                        min="1"
                        value={tier.capacity}
                        onChange={(e) => {
                          const updated = [...tiers];
                          updated[idx].capacity = Number(e.target.value);
                          setTiers(updated);
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-md border border-border/70 bg-background text-foreground"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Inventory, Badges & Amenities */}
        <div className="space-y-6">
          {/* Quick Summary Card */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Publishing Overview
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Total Capacity:</span>
                <span className="font-semibold text-foreground">
                  {tiers.reduce((acc, t) => acc + t.capacity, 0)} seats
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Starting Fare:</span>
                <span className="font-semibold text-amber-600">
                  {Math.min(...tiers.map((t) => t.price))} ETB
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Listing Status:</span>
                <span className="font-semibold text-emerald-600">Active Instant Booking</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Platform Fee (5%):</span>
                <span className="text-muted-foreground">Deducted at payout</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
              >
                {isSubmitting ? "Processing..." : "Publish Ticket Listing"}
              </button>
            </div>
          </div>

          {/* Perks & Included Amenities */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Included Perks & Amenities
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Visible on customer ticket discovery cards and vouchers.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAmenity();
                  }
                }}
                placeholder="e.g. Free Bottled Water"
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
              {amenities.map((item) => (
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

          {/* Marketing Badge */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Promotional Tag
            </h3>
            <select
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
            >
              <option value="Popular Express">Popular Express</option>
              <option value="VIP Luxury">VIP Luxury</option>
              <option value="Selling Fast">Selling Fast</option>
              <option value="Limited Seats">Limited Seats</option>
              <option value="Early Bird Discount">Early Bird Discount</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}
