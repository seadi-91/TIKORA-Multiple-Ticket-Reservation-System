"use client";

import React, { useState, useEffect } from "react";
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
  Upload,
  Image as ImageIcon,
  Check,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { TicketCategory } from "@/types/ticket.types";
import {
  TicketService,
  CATEGORY_DEFAULT_IMAGES,
  FIXED_CATEGORY_IMAGES,
} from "@/services/ticket.service";
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

  const isCategoryDeactivated =
    organization.isCategoryActive === false ||
    !TicketService.isCategoryActive(category);

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

  const defaultImages = CATEGORY_DEFAULT_IMAGES[category] || CATEGORY_DEFAULT_IMAGES.CINEMA;
  const [imageSource, setImageSource] = useState<"DEFAULT" | "CUSTOM">("DEFAULT");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(() => defaultImages[0]?.url || "");
  const [customImageUrl, setCustomImageUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  useEffect(() => {
    const defaults = CATEGORY_DEFAULT_IMAGES[category] || CATEGORY_DEFAULT_IMAGES.CINEMA;
    if (imageSource === "DEFAULT") {
      setSelectedImageUrl(defaults[0]?.url || "");
    }
  }, [category, imageSource]);

  const handleCustomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit. Please choose a smaller image.");
      return;
    }

    setIsUploadingImage(true);
    const toastId = toast.loading("Uploading image to Cloudinary CDN...");

    try {
      const url = await TicketService.uploadTicketImage(file);
      setCustomImageUrl(url);
      setSelectedImageUrl(url);
      setImageSource("CUSTOM");
      toast.success("Image uploaded to Cloudinary successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload image to Cloudinary.", { id: toastId });
    } finally {
      setIsUploadingImage(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a service or ticket title");
      return;
    }

    setIsSubmitting(true);
    try {
      await TicketService.addTicket({
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
        imageUrl: selectedImageUrl || defaultImages[0].url,
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

      toast.success("Ticket listing saved to database and published successfully!");
      router.push("/provider/tickets");
    } catch (err: any) {
      toast.error(err?.message || "Failed to publish ticket.");
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Sector Category Deactivated Notice */}
      {isCategoryDeactivated && (
        <div className="rounded-2xl p-4 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 text-foreground flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300">
              Operating Sector Category Currently Deactivated
            </h4>
            <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 leading-relaxed">
              Your registered sector (<strong>{category}</strong>) has been deactivated by the platform admin. You may still prepare and save this ticket, but it will remain <strong>hidden from customer & guest pages</strong> until the administrator reactivates this category.
            </p>
          </div>
        </div>
      )}

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
                  {category === "CINEMA"
                    ? "Showtime / Starts At"
                    : category === "BUS"
                    ? "Departure Time"
                    : category === "EVENT"
                    ? "Gate Opens / Event Starts"
                    : "Kick-off / Match Time"}
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder={
                      category === "CINEMA"
                        ? "e.g. 05:30 PM (Starts At)"
                        : category === "BUS"
                        ? "e.g. 06:00 AM (Departure)"
                        : "e.g. 06:00 PM"
                    }
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Cover Showcase Image (2 Curated Defaults or Cloudinary Upload) */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    3. Cover Showcase Image
                  </label>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-600/20">
                    {category} Default Assets
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Pick one of the 2 sector-tailored default images, or upload your own promotional poster (saved to Cloudinary).
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-lg self-start sm:self-auto border border-border/50 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setImageSource("DEFAULT");
                    if (!selectedImageUrl.includes("res.cloudinary.com")) {
                      setSelectedImageUrl(defaultImages[0]?.url || "");
                    }
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    imageSource === "DEFAULT"
                      ? "bg-amber-600 text-white font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Default (2 Images)
                </button>
                <button
                  type="button"
                  onClick={() => setImageSource("CUSTOM")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    imageSource === "CUSTOM"
                      ? "bg-amber-600 text-white font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Upload Custom
                </button>
              </div>
            </div>

            {/* Option A: 2 Default Images Selection */}
            {imageSource === "DEFAULT" && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {defaultImages.map((img, index) => {
                    const isSelected = selectedImageUrl === img.url;
                    return (
                      <div
                        key={img.id}
                        onClick={() => setSelectedImageUrl(img.url)}
                        className={`group relative rounded-xl border-2 p-2.5 cursor-pointer transition-all overflow-hidden bg-background ${
                          isSelected
                            ? "border-amber-600 ring-2 ring-amber-500/20 shadow-sm"
                            : "border-border/70 hover:border-amber-500/50 hover:bg-muted/30"
                        }`}
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-2">
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                            Option #{index + 1}
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="pr-2">
                            <div className="text-xs font-bold text-foreground line-clamp-1">{img.title}</div>
                            <div className="text-[10px] text-muted-foreground line-clamp-1">{img.description}</div>
                          </div>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                              isSelected
                                ? "bg-amber-600/10 text-amber-700 dark:text-amber-300 font-bold"
                                : "text-muted-foreground"
                            }`}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground italic text-right">
                  Curated for {category} operations • High-resolution responsive banners
                </p>
              </div>
            )}

            {/* Option B: Custom Image Upload to Cloudinary */}
            {imageSource === "CUSTOM" && (
              <div className="space-y-3 pt-1">
                <div className="border-2 border-dashed border-border/80 hover:border-amber-500/60 rounded-xl p-5 text-center transition-colors bg-muted/20">
                  <input
                    type="file"
                    id="ticket-image-file"
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                  <label
                    htmlFor="ticket-image-file"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      {isUploadingImage ? (
                        <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {isUploadingImage ? "Uploading to Cloudinary..." : "Click to select or drag and drop custom image"}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Supports PNG, JPG, or WEBP (Max 10MB) • Uploaded and hosted directly on Cloudinary CDN
                      </p>
                    </div>
                  </label>
                </div>

                {/* Cloudinary Uploaded Image Preview */}
                {customImageUrl && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/60">
                      <img src={customImageUrl} alt="Uploaded custom" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Uploaded to Cloudinary CDN</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate font-mono mt-0.5">
                        {customImageUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomImageUrl("");
                        setSelectedImageUrl(defaultImages[0]?.url || "");
                        setImageSource("DEFAULT");
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive px-2 py-1 rounded hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            )}
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
          {/* Live Card Preview */}
          <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-xs">
            <div className="p-3 border-b border-border/50 bg-muted/30 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" /> Live Customer Card Preview
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {imageSource === "CUSTOM" ? "Cloudinary CDN" : "Default Asset"}
              </span>
            </div>

            <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
              <img
                src={selectedImageUrl || defaultImages[0].url}
                alt="Selected cover preview"
                className="w-full h-full object-cover transition-all"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider border border-white/20">
                {category}
              </div>

              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-600 text-[9px] font-bold text-white shadow-xs">
                {formData.badge || "Verified Pass"}
              </div>

              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <h4 className="text-xs font-bold tracking-tight line-clamp-1 drop-shadow-sm">
                  {formData.title || "Untitled Ticket Listing"}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-white/90 mt-0.5">
                  <span className="truncate">{formData.city || "Addis Ababa"}</span>
                  <span>•</span>
                  <span>{formData.time || "Showtime"}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-card flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground block leading-none">Starting At</span>
                <span className="text-sm font-extrabold text-amber-600 font-mono mt-0.5 block">
                  {formData.basePrice} ETB
                </span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                {tiers.reduce((acc, t) => acc + t.capacity, 0)} available seats
              </span>
            </div>
          </div>

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
