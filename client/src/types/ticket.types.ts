export type TicketCategory = "BUS" | "CINEMA" | "EVENT" | "SPORTS";

export type TicketStatus = "AVAILABLE" | "SELLING_FAST" | "SOLD_OUT";

export interface PublicCategoryItem {
  id: number | string;
  name: string;
  slug: string;
  category: TicketCategory;
  description?: string;
  icon?: string;
  isActive: boolean;
  commissionRate?: number;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  perks: string[];
  available: number;
}

export interface TicketItem {
  id: string;
  title: string;
  category: TicketCategory;
  categoryIsActive?: boolean;
  isCategoryActive?: boolean;
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
  reviewCount?: number;
  badge?: string;
  imageUrl?: string;
  description?: string;
  duration?: string;
  amenities?: string[];
  tiers?: TicketTier[];
  categoryDetails?: {
    busCompany?: string;
    origin?: string;
    destination?: string;
    busType?: string;
    boardingStation?: string;
    dropoffStation?: string;
    movieHall?: string;
    screenFormat?: string;
    movieGenre?: string;
    movieRating?: string;
    eventVenue?: string;
    eventCategory?: string;
    stadiumStand?: string;
    stadiumGate?: string;
    homeTeam?: string;
    awayTeam?: string;
    tournament?: string;
  };
}

export interface TicketFilterState {
  category: TicketCategory | "ALL";
  searchQuery: string;
  city: string;
  date: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "POPULAR" | "LATEST" | "PRICE_ASC" | "PRICE_DESC";
  viewMode?: "grid" | "list";
}
