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
  Upload,
  CheckCircle2,
  Check,
  Sparkles,
} from "lucide-react";
import { TicketService, CATEGORY_DEFAULT_IMAGES } from "@/services/ticket.service";
import { toast } from "sonner";

export default function EditTicketPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = (params?.ticketId as string) || "";

  const allTickets = TicketService.getAllTickets();
  const ticket = allTickets.find((t) => t.id === ticketId);
  const ticketCategory = ticket?.category || "CINEMA";
  const defaultImages = CATEGORY_DEFAULT_IMAGES[ticketCategory] || CATEGORY_DEFAULT_IMAGES.CINEMA;

  const [imageSource, setImageSource] = useState<"DEFAULT" | "CUSTOM">(
    ticket?.imageUrl && ticket.imageUrl.includes("res.cloudinary.com") ? "CUSTOM" : "DEFAULT"
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(
    ticket?.imageUrl || defaultImages[0]?.url || ""
  );
  const [customImageUrl, setCustomImageUrl] = useState<string>(
    ticket?.imageUrl && ticket.imageUrl.includes("res.cloudinary.com") ? ticket.imageUrl : ""
  );
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const handleCustomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
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
    amenities: ticket?.amenities || [],
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
    TicketService.updateTicket(ticketId, {
      title: formData.title,
      description: formData.description,
      city: formData.city,
      location: formData.location,
      date: formData.date,
      time: formData.time,
      price: Number(formData.price),
      totalSeats: Number(formData.totalSeats),
      availableSeats: Number(formData.availableSeats),
      status: formData.status as any,
      badge: formData.badge,
      imageUrl: selectedImageUrl,
      amenities: formData.amenities,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Ticket listing updated successfully!");
      router.push(`/provider/tickets/${ticketId}`);
    }, 400);
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
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
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
                  {ticket?.category === "CINEMA"
                    ? "Showtime / Starts At (የሚጀምርበት ሰዓት)"
                    : ticket?.category === "BUS"
                    ? "Departure Time (የሚነሳበት ሰዓት)"
                    : "Showtime / Departure Time"}
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

          {/* Cover Showcase Image (2 Curated Defaults or Cloudinary Upload) */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Cover Showcase Image
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-600/20">
                    {ticketCategory} Assets
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Pick one of the 2 default images, or upload your own promotional poster (saved to Cloudinary).
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

            {/* Default Images Grid */}
            {imageSource === "DEFAULT" && (
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
            )}

            {/* Custom Upload to Cloudinary */}
            {imageSource === "CUSTOM" && (
              <div className="space-y-3 pt-1">
                <div className="border-2 border-dashed border-border/80 hover:border-amber-500/60 rounded-xl p-5 text-center transition-colors bg-muted/20">
                  <input
                    type="file"
                    id="edit-ticket-image-file"
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-ticket-image-file"
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
                        {isUploadingImage ? "Uploading to Cloudinary..." : "Click to select new custom image"}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Supports PNG, JPG, or WEBP (Max 10MB) • Uploaded and hosted directly on Cloudinary CDN
                      </p>
                    </div>
                  </label>
                </div>

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
