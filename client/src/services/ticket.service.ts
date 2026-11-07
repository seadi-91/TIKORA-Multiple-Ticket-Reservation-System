import { TicketItem, TicketCategory, TicketFilterState } from "@/types/ticket.types";

export const FIXED_CATEGORY_IMAGES = {
  BUS: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
  CINEMA: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
  EVENT: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
  SPORTS: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
} as const;

export let MOCK_TICKETS: TicketItem[] = [];

export const TicketService = {
  getAllTickets(): TicketItem[] {
    return MOCK_TICKETS;
  },

  getTicketById(id: string): TicketItem | undefined {
    return MOCK_TICKETS.find((t) => t.id === id);
  },

  getTicketsByCategory(category: TicketCategory): TicketItem[] {
    return MOCK_TICKETS.filter((t) => t.category === category);
  },

  getFeaturedTickets(): TicketItem[] {
    return MOCK_TICKETS.filter((t) => t.rating && t.rating >= 4.8);
  },

  addTicket(ticket: TicketItem): TicketItem {
    MOCK_TICKETS = [ticket, ...MOCK_TICKETS.filter((t) => t.id !== ticket.id)];
    return ticket;
  },

  deleteTicket(id: string): boolean {
    const prevLen = MOCK_TICKETS.length;
    MOCK_TICKETS = MOCK_TICKETS.filter((t) => t.id !== id);
    return MOCK_TICKETS.length < prevLen;
  },

  updateTicket(id: string, updates: Partial<TicketItem>): TicketItem | undefined {
    const idx = MOCK_TICKETS.findIndex((t) => t.id === id);
    if (idx !== -1) {
      MOCK_TICKETS[idx] = { ...MOCK_TICKETS[idx], ...updates };
      return MOCK_TICKETS[idx];
    }
    return undefined;
  },

  searchTickets(filters: Partial<TicketFilterState>): TicketItem[] {
    let results = [...MOCK_TICKETS];

    if (filters.category && filters.category !== "ALL") {
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
