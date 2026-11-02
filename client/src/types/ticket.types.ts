export type TicketCategory = "BUS" | "CINEMA" | "EVENT" | "SPORTS";

export type TicketStatus = "AVAILABLE" | "SELLING_FAST" | "SOLD_OUT";

export interface TicketItem {
  id: string;
  title: string;
  category: TicketCategory;
  organizer: string;
  organizerVerified?: boolean;
  location: string;
  city: string;
  date: string;
  time: string;
  price: number;
  currency?: string;
  availableSeats: number;
  totalSeats: number;
  status: TicketStatus;
  rating?: number;
  badge?: string;
  imageUrl?: string;
  categoryDetails?: {
    busCompany?: string;
    origin?: string;
    destination?: string;
    busType?: string;
    movieHall?: string;
    screenFormat?: string;
    eventVenue?: string;
    stadiumStand?: string;
  };
}

export interface TicketFilterState {
  category: TicketCategory | "ALL";
  searchQuery: string;
  city: string;
  date: string;
  priceRange?: [number, number];
}

