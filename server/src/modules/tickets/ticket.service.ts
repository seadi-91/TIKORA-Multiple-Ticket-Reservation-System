import { db } from "../../config/database";
import { AuditService } from "../admin/audit.service";

export interface CreateTicketDto {
  title: string;
  category: "BUS" | "CINEMA" | "EVENT" | "SPORTS";
  organizer?: string;
  organizerVerified?: boolean;
  location: string;
  city: string;
  date: string;
  time: string; // Showtime / Starts At or Departure Time
  price: number;
  currency?: string;
  availableSeats?: number;
  totalSeats?: number;
  status?: string;
  badge?: string;
  imageUrl?: string;
  description?: string;
  amenities?: string[];
  duration?: string;
  performer?: string;
  ageRestriction?: string;
  tiers?: Array<{
    id?: string;
    name: string;
    price: number;
    capacity?: number;
    available?: number;
    perks?: string[];
    description?: string;
  }>;
}

export const FIXED_CATEGORY_IMAGES = {
  BUS: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
  CINEMA: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
  EVENT: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
  SPORTS: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
} as const;

export const CATEGORY_MAP: Record<string, { name: string; slug: string; description: string }> = {
  BUS: {
    name: "Intercity Bus & Coach",
    slug: "bus",
    description: "Intercity scheduled transport, express luxury coaches, cross-regional routes.",
  },
  CINEMA: {
    name: "Cinema & Movie Theaters",
    slug: "cinema",
    description: "Movie theater admissions, 4K laser showtimes, and screening auditoriums.",
  },
  EVENT: {
    name: "Concerts, Festivals & Events",
    slug: "event",
    description: "Live music concerts, cultural celebrations, expos, and festivals.",
  },
  SPORTS: {
    name: "Stadium & Sports Matches",
    slug: "sports",
    description: "Football league derbies, stadium tribune admissions, athletics, and competitions.",
  },
};

export class TicketService {
  /**
   * Ensure standard category rows exist in DB
   */
  static async ensureCategories() {
    for (const [key, info] of Object.entries(CATEGORY_MAP)) {
      const existing = await db.orm.public.TicketCategory.where({ slug: info.slug }).first();
      if (!existing) {
        await db.orm.public.TicketCategory.create({
          name: info.name,
          slug: info.slug,
          description: info.description,
          commissionRate: 5.0,
          isActive: true,
        });
      }
    }
  }

  /**
   * Seed initial platform tickets if none exist
   */
  static async seedInitialOfferings() {
    try {
      await this.ensureCategories();
      // Zero default tickets: offerings strictly reflect real tickets published by verified providers
    } catch (err) {
      console.error("Failed to seed initial offerings:", err);
    }
  }

  /**
   * Save a newly created ticket offering into PostgreSQL database
   */
  static async createTicket(dto: CreateTicketDto, user?: any) {
    await this.ensureCategories();

    const categoryKey = dto.category.toUpperCase();
    const catInfo = CATEGORY_MAP[categoryKey] || CATEGORY_MAP.CINEMA;

    let category = await db.orm.public.TicketCategory.where({ slug: catInfo.slug }).first();
    if (!category) {
      category = await db.orm.public.TicketCategory.create({
        name: catInfo.name,
        slug: catInfo.slug,
        description: catInfo.description,
        commissionRate: 5.0,
        isActive: true,
      });
    }

    // Determine Provider
    let providerId: number | null = null;
    let providerName = dto.organizer || "Tikora Operator";

    if (user?.id) {
      const member = await db.orm.public.ProviderMember.where({ userId: user.id })
        .include("provider")
        .first();
      if (member && member.provider) {
        providerId = member.provider.id;
        providerName = member.provider.name;
      }
    }

    if (!providerId) {
      // Find or create default provider for this domain
      const providerSlug = (dto.organizer || `provider-${categoryKey.toLowerCase()}`)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");

      let defaultProv = await db.orm.public.Provider.where({ slug: providerSlug }).first();
      if (!defaultProv) {
        defaultProv = await db.orm.public.Provider.where({ providerType: categoryKey }).first();
      }
      if (!defaultProv) {
        defaultProv = await db.orm.public.Provider.create({
          name: dto.organizer || `${catInfo.name} Operator`,
          slug: providerSlug,
          providerType: categoryKey,
          email: user?.email || `provider@tikora.et`,
          phone: "+251911000000",
          city: dto.city || "Addis Ababa",
          verificationStatus: "APPROVED",
          isActive: true,
        });
      }
      providerId = defaultProv.id;
      providerName = defaultProv.name;
    }

    // Create TicketOffering
    const totalCap = Number(dto.totalSeats || dto.availableSeats || 100);
    const availCap = Number(dto.availableSeats || totalCap);
    const basePrice = Number(dto.price || (dto.tiers?.[0]?.price) || 300);

    const offering = await db.orm.public.TicketOffering.create({
      providerId,
      categoryId: category.id,
      title: dto.title.trim(),
      description: dto.description || null,
      image: dto.imageUrl || FIXED_CATEGORY_IMAGES[categoryKey as keyof typeof FIXED_CATEGORY_IMAGES] || FIXED_CATEGORY_IMAGES.CINEMA,
      location: dto.location || "Addis Ababa",
      city: dto.city || "Addis Ababa",
      badge: dto.badge || (categoryKey === "CINEMA" ? "Laser 4K Atmos" : "Verified Listing"),
      rating: 5.0,
      reviewCount: 0,
      amenities: dto.amenities ? JSON.stringify(dto.amenities) : null,
      duration: dto.duration || null,
      performer: dto.performer || null,
      gateTime: dto.time, // Showtime / Starts At or Departure Time
      ageRestriction: dto.ageRestriction || null,
      status: "ACTIVE",
      startDate: dto.date ? new Date(dto.date) : new Date(),
    });

    // Create Prices / Tiers
    if (dto.tiers && Array.isArray(dto.tiers) && dto.tiers.length > 0) {
      for (const tier of dto.tiers) {
        await db.orm.public.TicketPrice.create({
          offeringId: offering.id,
          name: tier.name || "Standard",
          description: tier.description || (tier.perks ? tier.perks.join(", ") : "Allocated admission"),
          price: Number(tier.price || basePrice),
          currency: dto.currency || "ETB",
          isActive: true,
        });
      }
    } else {
      await db.orm.public.TicketPrice.create({
        offeringId: offering.id,
        name: "Standard",
        description: "Standard Admission",
        price: basePrice,
        currency: dto.currency || "ETB",
        isActive: true,
      });
    }

    // Create Inventory
    await db.orm.public.TicketInventory.create({
      offeringId: offering.id,
      totalQuantity: totalCap,
      availableQuantity: availCap,
      reservedQuantity: 0,
      soldQuantity: 0,
    });

    // Notify all ADMIN users in DB
    try {
      const adminRole = await db.orm.public.Role.where({ name: "ADMIN" }).first();
      if (adminRole) {
        const adminUsers = await db.orm.public.UserRole.where({ roleId: adminRole.id }).all();
        for (const au of adminUsers) {
          await db.orm.public.Notification.create({
            userId: au.userId,
            title: `New ${categoryKey} Ticket Published: ${dto.title}`,
            message: `Provider "${providerName}" has published a new ${categoryKey} ticket listing "${dto.title}" scheduled for ${dto.date} at ${dto.time} in ${dto.city}.`,
            type: "TICKET_PUBLISHED",
            link: "/admin/tickets",
            referenceId: String(offering.id),
            isRead: false,
          });
        }
      }
    } catch (notifErr) {
      console.error("Failed to record admin notifications for ticket creation:", notifErr);
    }

    // Audit Log entry
    await AuditService.record({
      userId: user?.id,
      actorName: user?.name || providerName,
      actorRole: user?.role || "ORGANIZATION",
      target: `Ticket #${offering.id}`,
      action: "TICKET_CREATED",
      entityType: "TICKET",
      entityId: String(offering.id),
      details: `Published ${categoryKey} ticket listing "${dto.title}" with start/departure time "${dto.time}" by "${providerName}".`,
      ipAddress: "127.0.0.1",
      severity: "INFO",
    });

    return this.formatOffering(offering, providerName, category.slug.toUpperCase(), basePrice, availCap, totalCap, dto.time, dto.date);
  }

  /**
   * Fetch all categories with their active status
   */
  static async getCategories() {
    await this.ensureCategories();
    const categories = await db.orm.public.TicketCategory.all();
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      category: (cat.slug || "").toUpperCase(),
      description: cat.description || "",
      icon: cat.icon || "Ticket",
      commissionRate: cat.commissionRate,
      isActive: cat.isActive !== false,
    }));
  }

  /**
   * Fetch all tickets from PostgreSQL database
   */
  static async getAllTickets(filters?: {
    category?: string;
    providerId?: number;
    city?: string;
    status?: string;
    includeInactiveCategories?: boolean;
  }) {
    await this.seedInitialOfferings();

    const offerings = filters?.status
      ? await db.orm.public.TicketOffering.where({ status: filters.status })
          .include("provider")
          .include("category")
          .include("prices")
          .include("inventory")
          .all()
      : await db.orm.public.TicketOffering.where({})
          .include("provider")
          .include("category")
          .include("prices")
          .include("inventory")
          .all();

    // Query booking items to accurately aggregate confirmed sold counts per offering
    let allBookingItems: any[] = [];
    try {
      allBookingItems = await db.orm.public.BookingItem.all();
    } catch {
      allBookingItems = [];
    }

    const bookedCountMap = new Map<number, number>();
    for (const item of allBookingItems) {
      const offId = Number(item.offeringId);
      const qty = Number(item.quantity) || 1;
      bookedCountMap.set(offId, (bookedCountMap.get(offId) || 0) + qty);
    }

    let mapped = offerings.map((offering) => {
      const provName = offering.provider?.name || "Verified Operator";
      const catSlug = (offering.category?.slug?.toUpperCase() || "CINEMA") as "BUS" | "CINEMA" | "EVENT" | "SPORTS";
      const isCatActive = offering.category ? offering.category.isActive !== false : true;
      const prices = offering.prices || [];
      const inv = offering.inventory?.[0];
      const basePrice = prices[0]?.price || 300;
      const totalSeats = Number(inv?.totalQuantity) || 100;
      const bookedFromDb = bookedCountMap.get(offering.id);
      const bookedCount = bookedFromDb !== undefined && bookedFromDb > 0 ? bookedFromDb : 0;
      const totalSold = bookedCount;
      const remainingCapacity = Math.max(0, totalSeats - totalSold);
      const availableSeats = remainingCapacity;

      let amenitiesArr: string[] = [];
      if (offering.amenities) {
        try {
          amenitiesArr = JSON.parse(offering.amenities);
        } catch {
          amenitiesArr = [offering.amenities];
        }
      }

      const dateStr = offering.startDate
        ? new Date(offering.startDate).toISOString().split("T")[0]
        : "2026-11-20";

      return {
        id: String(offering.id),
        title: offering.title,
        category: catSlug,
        categoryIsActive: isCatActive,
        isCategoryActive: isCatActive,
        organizer: provName,
        organizerVerified: offering.provider?.verificationStatus === "APPROVED",
        location: offering.location || "Addis Ababa",
        city: offering.city || "Addis Ababa",
        date: dateStr,
        time: offering.gateTime || "05:30 PM", // Showtime / Starts At or Departure Time
        price: basePrice,
        currency: "ETB",
        totalSold,
        soldQuantity: totalSold,
        capacity: totalSeats,
        totalSeats,
        availableSeats,
        remainingCapacity,
        status: offering.status === "ACTIVE" ? "AVAILABLE" : offering.status,
        badge: offering.badge || "Verified Pass",
        imageUrl: offering.image || FIXED_CATEGORY_IMAGES[catSlug] || FIXED_CATEGORY_IMAGES.CINEMA,
        description: offering.description || "",
        amenities: amenitiesArr,
        duration: offering.duration || undefined,
        performer: offering.performer || undefined,
        ageRestriction: offering.ageRestriction || undefined,
        providerId: offering.providerId,
        tiers: prices.map((p) => ({
          id: `tier-${p.id}`,
          name: p.name,
          price: p.price,
          available: availableSeats,
          perks: p.description ? [p.description] : ["Allocated seating"],
        })),
      };
    });

    // If not explicitly requesting inactive categories (and not a provider querying their own inventory):
    // tickets belonging to deactivated categories MUST NOT be visible on customer and guest pages!
    if (!filters?.includeInactiveCategories && !filters?.providerId) {
      mapped = mapped.filter((t) => t.categoryIsActive !== false);
    }

    if (filters?.category && filters.category !== "ALL") {
      mapped = mapped.filter((t) => t.category === filters.category);
    }
    if (filters?.providerId) {
      mapped = mapped.filter((t) => t.providerId === filters.providerId);
    }
    if (filters?.city && filters.city !== "All Cities") {
      mapped = mapped.filter((t) => t.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }

    return mapped;
  }

  /**
   * Helper to format offering
   */
  private static formatOffering(
    offering: any,
    providerName: string,
    categoryKey: string,
    basePrice: number,
    availableSeats: number,
    totalSeats: number,
    time: string,
    date: string
  ) {
    return {
      id: String(offering.id),
      title: offering.title,
      category: categoryKey as any,
      organizer: providerName,
      organizerVerified: true,
      location: offering.location || "Addis Ababa",
      city: offering.city || "Addis Ababa",
      date,
      time,
      price: basePrice,
      currency: "ETB",
      availableSeats,
      totalSeats,
      status: "AVAILABLE",
      badge: offering.badge || "Verified Pass",
      imageUrl: offering.image || FIXED_CATEGORY_IMAGES.CINEMA,
      description: offering.description || "",
      amenities: offering.amenities ? JSON.parse(offering.amenities) : [],
    };
  }

  /**
   * Toggle or update ticket status (ACTIVE / INACTIVE) in database
   */
  static async updateTicketStatus(id: string, status: string, user?: any) {
    const offering = await db.orm.public.TicketOffering.where({ id: Number(id) }).first();
    if (!offering) {
      throw new Error(`Ticket offering #${id} not found.`);
    }

    await db.orm.public.TicketOffering.where({ id: Number(id) }).update({ status });

    await AuditService.record({
      userId: user?.id,
      actorName: user?.name || "System Admin",
      actorRole: user?.role || "ADMIN",
      target: `Ticket #${id}`,
      action: status === "ACTIVE" ? "TICKET_ACTIVATED" : "TICKET_DEACTIVATED",
      entityType: "TICKET",
      entityId: String(id),
      details: `Ticket #${id} ("${offering.title}") status transitioned to ${status}.`,
      ipAddress: "127.0.0.1",
      severity: "INFO",
    });

    return offering;
  }

  /**
   * Permanently delete ticket offering and its relations from database
   */
  static async deleteTicket(id: string, user?: any) {
    const offeringId = parseInt(id, 10);
    if (isNaN(offeringId)) {
      throw new Error("Invalid ticket offering ID.");
    }

    const offering = await db.orm.public.TicketOffering.where({ id: offeringId }).first();
    if (!offering) {
      throw new Error(`Ticket offering #${id} not found.`);
    }

    // Delete dependent child records
    await db.orm.public.TicketPrice.where({ offeringId }).delete().catch(() => {});
    await db.orm.public.TicketInventory.where({ offeringId }).delete().catch(() => {});
    await db.orm.public.BookingItem.where({ offeringId }).delete().catch(() => {});

    await db.orm.public.TicketOffering.where({ id: offeringId }).delete();

    await AuditService.record({
      userId: user?.id,
      actorName: user?.name || "System Admin",
      actorRole: user?.role || "ADMIN",
      target: `Ticket #${id} (${offering.title})`,
      action: "TICKET_DELETED_PERMANENTLY",
      entityType: "TICKET",
      entityId: String(id),
      details: `Ticket #${id} ("${offering.title}") was permanently deleted by ${user?.name || "System Admin"}.`,
      ipAddress: "127.0.0.1",
      severity: "WARNING",
    });

    return true;
  }
}
