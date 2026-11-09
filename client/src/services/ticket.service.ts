import { TicketItem, TicketCategory, TicketFilterState, PublicCategoryItem } from "@/types/ticket.types";
import { API_BASE_URL } from "./auth.service";

export const FIXED_CATEGORY_IMAGES = {
  BUS: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
  CINEMA: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
  EVENT: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
  SPORTS: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
} as const;

export interface DefaultImageOption {
  id: string;
  title: string;
  description: string;
  url: string;
}

export const CATEGORY_DEFAULT_IMAGES: Record<TicketCategory, DefaultImageOption[]> = {
  BUS: [
    {
      id: "bus-default-1",
      title: "VIP Luxury Express Coach",
      description: "Modern executive highway coach with reclining comfort",
      url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "bus-default-2",
      title: "Intercity Scania Fleet",
      description: "Cross-regional high-speed passenger coach",
      url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    },
  ],
  CINEMA: [
    {
      id: "cinema-default-1",
      title: "Laser 4K Dolby Atmos Auditorium",
      description: "Modern theater screening hall with immersive projection",
      url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "cinema-default-2",
      title: "Premiere Screen & Lounger Seating",
      description: "Red velvet seating with wide panoramic cinema screen",
      url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    },
  ],
  EVENT: [
    {
      id: "event-default-1",
      title: "Live Concert Grand Stage",
      description: "Vibrant festival stage with professional arena lighting",
      url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "event-default-2",
      title: "Cultural Celebration & Acoustic Hall",
      description: "Atmospheric festival gathering and live celebration",
      url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    },
  ],
  SPORTS: [
    {
      id: "sports-default-1",
      title: "Premier Match Stadium Pitch",
      description: "Floodlit championship pitch with lush green turf",
      url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "sports-default-2",
      title: "Derby Stadium Tribune & Fans",
      description: "Grandstand seating with electric derby matchday atmosphere",
      url: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80",
    },
  ],
};

// Zero default tickets: only real listings published by verified providers appear in the catalog
export const DEFAULT_TICKETS: TicketItem[] = [];

export let MOCK_TICKETS: TicketItem[] = [];
export let MOCK_CATEGORIES: PublicCategoryItem[] = [];

function saveToLocalStorage(tickets: TicketItem[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("tikora_tickets_cache", JSON.stringify(tickets));
    } catch {}
  }
}

function saveCategoriesToLocalStorage(categories: PublicCategoryItem[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("tikora_categories_cache", JSON.stringify(categories));
    } catch {}
  }
}

function loadCategoriesFromLocalStorage(): PublicCategoryItem[] {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("tikora_categories_cache");
      if (saved) return JSON.parse(saved);
    } catch {}
  }
  return [];
}

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("tikora_auth_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

export const TicketService = {
  /**
   * Fetch all categories and their current isActive status from backend
   */
  async fetchCategories(): Promise<PublicCategoryItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.categories && Array.isArray(data.categories)) {
          MOCK_CATEGORIES = data.categories;
          saveCategoriesToLocalStorage(MOCK_CATEGORIES);
          return data.categories;
        }
      }
    } catch (error) {
      console.warn("Failed to fetch categories from backend:", error);
    }
    if (MOCK_CATEGORIES.length === 0) {
      MOCK_CATEGORIES = loadCategoriesFromLocalStorage();
    }
    return MOCK_CATEGORIES;
  },

  getCategories(): PublicCategoryItem[] {
    if (MOCK_CATEGORIES.length === 0) {
      MOCK_CATEGORIES = loadCategoriesFromLocalStorage();
      this.fetchCategories().catch(() => {});
    }
    return MOCK_CATEGORIES;
  },

  isCategoryActive(category: string): boolean {
    const categories = this.getCategories();
    if (!categories || categories.length === 0) return true;
    const cat = categories.find(
      (c) =>
        (c.category || "").toUpperCase() === category.toUpperCase() ||
        (c.slug || "").toLowerCase() === category.toLowerCase() ||
        (c.name || "").toLowerCase() === category.toLowerCase()
    );
    if (!cat) return true;
    return cat.isActive !== false;
  },

  /**
   * Fetch all tickets from PostgreSQL database
   */
  async fetchTickets(includeInactive = false): Promise<TicketItem[]> {
    try {
      this.fetchCategories().catch(() => {});

      const url = includeInactive
        ? `${API_BASE_URL}/tickets?includeInactive=true`
        : `${API_BASE_URL}/tickets`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.tickets && Array.isArray(data.tickets)) {
          const legacyIds = new Set(["bus-1", "bus-2", "cinema-1", "cinema-2", "event-1", "event-2", "sports-1"]);
          const providerOnly = data.tickets.filter((t: any) => !legacyIds.has(t.id));
          MOCK_TICKETS = providerOnly;
          saveToLocalStorage(MOCK_TICKETS);
          return providerOnly;
        }
      }
    } catch (error) {
      console.warn("Failed to fetch tickets from backend, fallback to local cache:", error);
    }
    return MOCK_TICKETS;
  },

  getAllTickets(includeInactive = false): TicketItem[] {
    // If empty on client, check cache or trigger fetch in background
    if (MOCK_TICKETS.length === 0 && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("tikora_tickets_cache");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const legacyIds = new Set(["bus-1", "bus-2", "cinema-1", "cinema-2", "event-1", "event-2", "sports-1"]);
            const providerOnly = parsed.filter((t: any) => !legacyIds.has(t.id));
            MOCK_TICKETS = providerOnly;
            saveToLocalStorage(providerOnly);
          }
        }
      } catch {}
      this.fetchTickets(includeInactive).catch(() => {});
    }

    if (includeInactive) {
      return MOCK_TICKETS;
    }

    // For customer and guest pages: exclude any ticket where category is deactivated!
    return MOCK_TICKETS.filter((t) => {
      if (t.categoryIsActive === false || t.isCategoryActive === false) return false;
      if (!this.isCategoryActive(t.category)) return false;
      return true;
    });
  },

  getTicketById(id: string): TicketItem | undefined {
    return MOCK_TICKETS.find((t) => String(t.id) === String(id));
  },

  /**
   * Fetch a single ticket by ID directly from PostgreSQL backend
   */
  async fetchTicketById(id: string, forceRefresh = false): Promise<TicketItem | undefined> {
    if (!forceRefresh) {
      const existing = this.getTicketById(id);
      if (existing) return existing;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ticket) {
          const ticket = data.ticket;
          MOCK_TICKETS = [ticket, ...MOCK_TICKETS.filter((t) => String(t.id) !== String(id))];
          saveToLocalStorage(MOCK_TICKETS);
          return ticket;
        }
      } else if (res.status === 403) {
        const data = await res.json().catch(() => ({}));
        if (data.ticket) {
          return {
            ...data.ticket,
            categoryIsActive: false,
            isCategoryActive: false,
          };
        }
      }
    } catch (e) {
      console.warn("Failed to fetch ticket by id from backend:", e);
    }

    // Fallback: fetch all tickets
    const all = await this.fetchTickets(true);
    return all.find((t) => String(t.id) === String(id));
  },

  getTicketsByCategory(category: TicketCategory, includeInactive = false): TicketItem[] {
    if (!includeInactive && !this.isCategoryActive(category)) {
      return [];
    }
    return this.getAllTickets(includeInactive).filter((t) => t.category === category);
  },

  getFeaturedTickets(): TicketItem[] {
    return this.getAllTickets().filter((t) => t.rating && t.rating >= 4.8);
  },

  /**
   * Upload custom ticket cover image to Cloudinary and return secure URL
   */
  async uploadTicketImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      headers: getAuthHeader(),
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to upload image to Cloudinary.");
    }

    const data = await res.json();
    return data.url;
  },

  /**
   * Save newly created ticket into PostgreSQL database and sync local cache
   */
  async addTicket(ticket: TicketItem): Promise<TicketItem> {
    // 1. Immediately update local state for responsive UI
    MOCK_TICKETS = [ticket, ...MOCK_TICKETS.filter((t) => t.id !== ticket.id)];
    saveToLocalStorage(MOCK_TICKETS);

    // 2. Persist to PostgreSQL via backend API
    try {
      const res = await fetch(`${API_BASE_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          title: ticket.title,
          category: ticket.category,
          organizer: ticket.organizer,
          organizerVerified: ticket.organizerVerified,
          location: ticket.location,
          city: ticket.city,
          date: ticket.date,
          time: ticket.time, // Showtime / Starts At or Departure Time
          price: ticket.price,
          currency: ticket.currency || "ETB",
          availableSeats: ticket.availableSeats,
          totalSeats: ticket.totalSeats,
          status: ticket.status || "AVAILABLE",
          badge: ticket.badge,
          imageUrl: ticket.imageUrl,
          description: ticket.description,
          amenities: ticket.amenities,
          duration: ticket.duration,
          tiers: ticket.tiers,
        }),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ticket) {
          const savedTicket = { ...ticket, id: String(data.ticket.id) };
          MOCK_TICKETS = [savedTicket, ...MOCK_TICKETS.filter((t) => t.id !== ticket.id && t.id !== savedTicket.id)];
          saveToLocalStorage(MOCK_TICKETS);
          return savedTicket;
        }
      }
    } catch (error) {
      console.error("Failed to persist ticket to PostgreSQL database:", error);
    }

    return ticket;
  },

  deleteTicket(id: string): boolean {
    const prevLen = MOCK_TICKETS.length;
    MOCK_TICKETS = MOCK_TICKETS.filter((t) => t.id !== id);
    saveToLocalStorage(MOCK_TICKETS);
    return MOCK_TICKETS.length < prevLen;
  },

  updateTicket(id: string, updates: Partial<TicketItem>): TicketItem | undefined {
    const idx = MOCK_TICKETS.findIndex((t) => t.id === id);
    if (idx !== -1) {
      MOCK_TICKETS[idx] = { ...MOCK_TICKETS[idx], ...updates };
      saveToLocalStorage(MOCK_TICKETS);

      // Persist to internal API route
      if (typeof window !== "undefined") {
        fetch(`/api/tickets/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }).catch(() => {});
      }

      return MOCK_TICKETS[idx];
    }
    return undefined;
  },

  decrementTicketSeats(ticketId: string, count: number): TicketItem | undefined {
    const ticket = this.getTicketById(ticketId);
    if (ticket) {
      const currentAvailable = Number(ticket.availableSeats || 0);
      const newAvailable = Math.max(0, currentAvailable - count);
      const newStatus = newAvailable === 0 ? "SOLD_OUT" : ticket.status;
      return this.updateTicket(ticketId, {
        availableSeats: newAvailable,
        status: newStatus,
      });
    }
    return undefined;
  },

  searchTickets(filters: Partial<TicketFilterState>, includeInactive = false): TicketItem[] {
    let results = this.getAllTickets(includeInactive);

    if (filters.category && filters.category !== "ALL") {
      if (!includeInactive && !this.isCategoryActive(filters.category)) {
        return [];
      }
      results = results.filter((t) => t.category === filters.category);
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.organizer.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
      );
    }

    if (filters.city && filters.city !== "" && filters.city !== "All Cities") {
      results = results.filter((t) => t.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }

    if (filters.minPrice !== undefined) {
      results = results.filter((t) => t.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter((t) => t.price <= filters.maxPrice!);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "PRICE_ASC":
          results.sort((a, b) => a.price - b.price);
          break;
        case "PRICE_DESC":
          results.sort((a, b) => b.price - a.price);
          break;
        case "LATEST":
          results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          break;
        case "POPULAR":
        default:
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }
    }

    return results;
  },
};
