import { TicketItem, TicketCategory, TicketFilterState } from "@/types/ticket.types";

export const FIXED_CATEGORY_IMAGES = {
  BUS: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
  CINEMA: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
  EVENT: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
  SPORTS: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
} as const;

export const MOCK_TICKETS: TicketItem[] = [
  // ==================== BUS TICKETS ====================
  {
    id: "bus-1",
    title: "Addis Ababa to Hawassa Luxury Express",
    category: "BUS",
    organizer: "Selam Bus Line SC",
    organizerVerified: true,
    location: "Autobus Tera -> Hawassa Piazza Terminal",
    city: "Hawassa",
    date: "2026-11-15",
    time: "06:00 AM",
    price: 650,
    currency: "ETB",
    availableSeats: 8,
    totalSeats: 48,
    status: "AVAILABLE",
    rating: 4.8,
    reviewCount: 342,
    badge: "Direct Express",
    imageUrl: FIXED_CATEGORY_IMAGES.BUS,
    description: "Premium daily express service from Addis Ababa to the resort lakeside city of Hawassa. Features high-speed WiFi, onboard USB chargers, complimentary bottled water, and air suspension.",
    duration: "4h 30m",
    amenities: ["Free High-Speed Wi-Fi", "USB Charging Ports", "Dual AC System", "Reclining Leather Seats", "Snack Pack"],
    categoryDetails: {
      busCompany: "Selam Bus Line SC",
      origin: "Addis Ababa (Autobus Tera Gate 3)",
      destination: "Hawassa (Piazza Main Terminal)",
      busType: "Scania VIP Luxury Coach (2x2 Recliner)",
      boardingStation: "Autobus Tera Gate 3",
      dropoffStation: "Hawassa Piazza Main Terminal",
    },
  },
  {
    id: "bus-2",
    title: "Addis Ababa to Bahir Dar Lake Tana Cruiser",
    category: "BUS",
    organizer: "Abay Bus Transport",
    organizerVerified: true,
    location: "Lamberet Bus Terminal -> Bahir Dar Central",
    city: "Bahir Dar",
    date: "2026-11-16",
    time: "05:30 AM",
    price: 950,
    currency: "ETB",
    availableSeats: 5,
    totalSeats: 46,
    status: "SELLING_FAST",
    rating: 4.7,
    reviewCount: 289,
    badge: "Scenic Route",
    imageUrl: FIXED_CATEGORY_IMAGES.BUS,
    description: "Scenic journey over the breathtaking Blue Nile Gorge straight to Bahir Dar. Comfortable seating with professional certified drivers and meal stops.",
    duration: "9h 15m",
    amenities: ["Air Conditioning", "Overhead Luggage", "Audio Entertainment", "Reclining Seats", "First Aid Kit"],
    categoryDetails: {
      busCompany: "Abay Bus Transport",
      origin: "Addis Ababa (Lamberet Terminal)",
      destination: "Bahir Dar (Central Bus Station)",
      busType: "Volvo Grand Coach (2x2)",
      boardingStation: "Lamberet Gate 1",
      dropoffStation: "Bahir Dar Central Station",
    },
  },
  {
    id: "bus-3",
    title: "Addis Ababa to Dire Dawa VIP Shuttle",
    category: "BUS",
    organizer: "Golden Bus Transport",
    organizerVerified: true,
    location: "Kality Bus Terminal -> Dire Dawa Sabian",
    city: "Dire Dawa",
    date: "2026-11-17",
    time: "06:30 AM",
    price: 850,
    currency: "ETB",
    availableSeats: 12,
    totalSeats: 44,
    status: "AVAILABLE",
    rating: 4.6,
    reviewCount: 198,
    badge: "Air Conditioned",
    imageUrl: FIXED_CATEGORY_IMAGES.BUS,
    description: "Fast transit along the modern expressway connecting Addis Ababa to the eastern commercial hub of Dire Dawa.",
    duration: "7h 45m",
    amenities: ["Wi-Fi", "USB Ports", "Air Conditioning", "Reclining Seats"],
    categoryDetails: {
      busCompany: "Golden Bus Transport",
      origin: "Addis Ababa (Kality Terminal)",
      destination: "Dire Dawa (Sabian Station)",
      busType: "Mercedes Benz Tourismo",
      boardingStation: "Kality Terminal",
      dropoffStation: "Sabian Central Station",
    },
  },
  {
    id: "bus-4",
    title: "Addis Ababa to Adama Fast Commuter",
    category: "BUS",
    organizer: "Sky Bus Ethiopia",
    organizerVerified: true,
    location: "Megenagna -> Adama Posta",
    city: "Adama (Nazret)",
    date: "2026-11-18",
    time: "08:00 AM",
    price: 250,
    currency: "ETB",
    availableSeats: 18,
    totalSeats: 50,
    status: "AVAILABLE",
    rating: 4.9,
    reviewCount: 512,
    badge: "Expressway",
    imageUrl: FIXED_CATEGORY_IMAGES.BUS,
    description: "Hourly non-stop commute through the Addis-Adama Toll Expressway.",
    duration: "1h 15m",
    amenities: ["Fast Commute", "Luggage Space", "Air Conditioning"],
    categoryDetails: {
      busCompany: "Sky Bus Ethiopia",
      origin: "Addis Ababa (Megenagna)",
      destination: "Adama (Posta Bet)",
      busType: "City Commuter Express",
    },
  },

  // ==================== CINEMA TICKETS ====================
  {
    id: "cinema-1",
    title: "Gladiator II - 4K IMAX Premiere",
    category: "CINEMA",
    organizer: "Century Cinema Megaplex",
    organizerVerified: true,
    location: "Century Mall, 4th Floor, Addis Ababa",
    city: "Addis Ababa",
    date: "2026-11-08",
    time: "08:15 PM",
    price: 350,
    currency: "ETB",
    availableSeats: 24,
    totalSeats: 160,
    status: "SELLING_FAST",
    rating: 4.9,
    reviewCount: 420,
    badge: "IMAX 4K",
    imageUrl: FIXED_CATEGORY_IMAGES.CINEMA,
    description: "From legendary director Ridley Scott, Gladiator II continues the epic saga of power, intrigue, and vengeance set in Ancient Rome. Experience it on Ethiopia's largest laser 4K projection.",
    duration: "2h 28m",
    amenities: ["Dolby Atmos 7.1", "Laser 4K Projection", "Couple Loungers", "Popcorn & Soda Bar", "Online Seat Selection"],
    categoryDetails: {
      movieHall: "Screen 1 (IMAX Laser Hall)",
      screenFormat: "IMAX 4K 3D",
      movieGenre: "Action / Historical Drama",
      movieRating: "PG-13",
    },
  },
  {
    id: "cinema-2",
    title: "Moana 2 - Family Special Screening",
    category: "CINEMA",
    organizer: "Edna Mall Cinema",
    organizerVerified: true,
    location: "Bole Medhanialem, Edna Mall 2nd Floor",
    city: "Addis Ababa",
    date: "2026-11-09",
    time: "03:00 PM",
    price: 280,
    currency: "ETB",
    availableSeats: 45,
    totalSeats: 140,
    status: "AVAILABLE",
    rating: 4.8,
    reviewCount: 215,
    badge: "Kids & Family",
    imageUrl: FIXED_CATEGORY_IMAGES.CINEMA,
    description: "Walt Disney Animation Studios' epic animated musical Moana 2 reunites Moana and Maui three years later for an expansive new voyage alongside a crew of unlikely seafarers.",
    duration: "1h 40m",
    amenities: ["3D Glasses Included", "Dolby Digital Surround", "Concession Stand", "Free Mall Parking"],
    categoryDetails: {
      movieHall: "Hall 2 (Family Theater)",
      screenFormat: "Digital 3D",
      movieGenre: "Animation / Adventure / Musical",
      movieRating: "G",
    },
  },
  {
    id: "cinema-3",
    title: "Dune: Part Two - Director's Cut",
    category: "CINEMA",
    organizer: "Voda Cinema Bole",
    organizerVerified: true,
    location: "Bole Atlas, Welosefer Tower",
    city: "Addis Ababa",
    date: "2026-11-10",
    time: "07:30 PM",
    price: 320,
    currency: "ETB",
    availableSeats: 15,
    totalSeats: 120,
    status: "SELLING_FAST",
    rating: 4.9,
    reviewCount: 380,
    badge: "Dolby Atmos",
    imageUrl: FIXED_CATEGORY_IMAGES.CINEMA,
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Masterpiece sci-fi experience.",
    duration: "2h 46m",
    amenities: ["Dolby Atmos Sound", "Recliner Seats", "Gourmet Snack Bar"],
    categoryDetails: {
      movieHall: "Gold Class Cinema 1",
      screenFormat: "4K UHD Digital",
      movieGenre: "Sci-Fi / Adventure",
      movieRating: "PG-13",
    },
  },

  // ==================== EVENTS & CONCERTS ====================
  {
    id: "event-1",
    title: "Addis International Jazz & Heritage Festival",
    category: "EVENT",
    organizer: "Yared Music & Arts Ent",
    organizerVerified: true,
    location: "Ghion Hotel Gardens, Addis Ababa",
    city: "Addis Ababa",
    date: "2026-12-05",
    time: "04:00 PM",
    price: 800,
    currency: "ETB",
    availableSeats: 110,
    totalSeats: 2500,
    status: "AVAILABLE",
    rating: 4.9,
    reviewCount: 610,
    badge: "Live Music",
    imageUrl: FIXED_CATEGORY_IMAGES.EVENT,
    description: "The 12th edition of the renowned Ethio-Jazz and Afro-Fusion gathering, featuring world-class live ensembles, traditional culinary booths, and artisanal craft markets in the lush gardens of Ghion Hotel.",
    duration: "6 hours",
    amenities: ["Outdoor Stage", "VIP Beverage Bar", "Artisanal Food Courtyard", "Live Broadcast"],
    tiers: [
      { id: "reg", name: "Regular Admission", price: 800, available: 1500, perks: ["General Lawn Entry", "Food Village Access"] },
      { id: "vip", name: "VIP Lounge Pass", price: 1800, available: 400, perks: ["Front Stage Zone", "2 Welcome Drinks", "VIP Restrooms", "Fast-Track Entry"] },
      { id: "vvip", name: "VVIP Table (4 Pax)", price: 6500, available: 50, perks: ["Dedicated Waiter", "Full Bottle Service", "Backstage Lounge", "Reserved Parking"] },
    ],
    categoryDetails: {
      eventVenue: "Ghion Main Gardens Amphitheater",
      eventCategory: "Music / Festival",
    },
  },
  {
    id: "event-2",
    title: "Ethiopian Tech Summit 2026 (Fintech & AI)",
    category: "EVENT",
    organizer: "Silicon Horn Tech Community",
    organizerVerified: true,
    location: "Millennium Hall, Bole, Addis Ababa",
    city: "Addis Ababa",
    date: "2026-11-28",
    time: "08:30 AM",
    price: 1200,
    currency: "ETB",
    availableSeats: 240,
    totalSeats: 1200,
    status: "AVAILABLE",
    rating: 4.8,
    reviewCount: 180,
    badge: "Conference",
    imageUrl: FIXED_CATEGORY_IMAGES.EVENT,
    description: "The premier technology and startup conference uniting East Africa's leading developers, investors, and policymakers. Keynotes on Digital Payments, AI, and Cloud Infrastructure.",
    duration: "Full Day (8:30 AM - 6:00 PM)",
    amenities: ["Buffet Lunch Included", "Conference Swag Kit", "High-Speed Wi-Fi", "B2B Networking Lounge"],
    tiers: [
      { id: "student", name: "Student Delegate", price: 600, available: 300, perks: ["Keynotes Access", "Expo Hall Access", "Digital Certificate"] },
      { id: "pro", name: "Professional Pass", price: 1200, available: 600, perks: ["All Stages Access", "Buffet Lunch", "Networking Mixer", "Swag Bag"] },
      { id: "investor", name: "Executive VIP", price: 3500, available: 100, perks: ["Investor Lounge Access", "1-on-1 Pitch Sessions", "VIP Dinner"] },
    ],
    categoryDetails: {
      eventVenue: "Millennium Hall Hall A & B",
      eventCategory: "Technology / Business Conference",
    },
  },
  {
    id: "event-3",
    title: "Standup Comedy Night: Addis Laugh Lounge",
    category: "EVENT",
    organizer: "Habesha Comedy Club",
    organizerVerified: true,
    location: "Skylight Hotel Grand Ballroom, Addis Ababa",
    city: "Addis Ababa",
    date: "2026-11-21",
    time: "07:00 PM",
    price: 500,
    currency: "ETB",
    availableSeats: 60,
    totalSeats: 500,
    status: "SELLING_FAST",
    rating: 4.7,
    reviewCount: 230,
    badge: "Comedy Show",
    imageUrl: FIXED_CATEGORY_IMAGES.EVENT,
    description: "A night of hilarious humor featuring Ethiopia's top comedic talent, live improv, and musical parodies.",
    duration: "3 hours",
    amenities: ["Plush Seating", "Cocktail Bar", "Free Parking"],
    tiers: [
      { id: "reg", name: "Standard Entry", price: 500, available: 300, perks: ["Numbered Chair Seating"] },
      { id: "vip", name: "VIP Front Row", price: 1000, available: 80, perks: ["Front 3 Rows", "1 Free Drink", "Meet & Greet"] },
    ],
    categoryDetails: {
      eventVenue: "Ethiopian Skylight Ballroom",
      eventCategory: "Comedy / Entertainment",
    },
  },

  // ==================== SPORTS TICKETS ====================
  {
    id: "sports-1",
    title: "Ethiopian Premier League: St. George SC vs Ethiopia Coffee SC",
    category: "SPORTS",
    organizer: "Ethiopian Football Federation",
    organizerVerified: true,
    location: "Addis Ababa Stadium, Stadium Area",
    city: "Addis Ababa",
    date: "2026-11-22",
    time: "03:00 PM",
    price: 200,
    currency: "ETB",
    availableSeats: 350,
    totalSeats: 25000,
    status: "SELLING_FAST",
    rating: 4.9,
    reviewCount: 920,
    badge: "Sheger Derby",
    imageUrl: FIXED_CATEGORY_IMAGES.SPORTS,
    description: "The fiercest and most historic rivalry in Ethiopian football: The Sheger Derby! Watch St. George SC clash with Ethiopia Coffee SC in an electric stadium atmosphere.",
    duration: "2 hours",
    amenities: ["Police Security Escort", "Turnstile Electronic QR Entry", "Food & Water Kiosks", "First Aid Stations"],
    tiers: [
      { id: "bleachers", name: "Katanga Bleachers (Stand B)", price: 200, available: 12000, perks: ["General Admission Stand"] },
      { id: "covered", name: "Enclosure Covered Tribune", price: 500, available: 3000, perks: ["Shaded Roof", "Numbered Seat", "Closer Sightline"] },
      { id: "vip", name: "VIP President's Tribune", price: 1500, available: 200, perks: ["Padded Armchairs", "Hospitality Lounge", "Private Security Gate"] },
    ],
    categoryDetails: {
      stadiumStand: "Tribune & Enclosure Stands",
      homeTeam: "Saint George SC (Kidus Giorgis)",
      awayTeam: "Ethiopia Coffee SC (Bunna)",
      tournament: "Ethiopian Premier League (Gameweek 14)",
    },
  },
  {
    id: "sports-2",
    title: "National Basketball League Finals: Game 5",
    category: "SPORTS",
    organizer: "Ethiopian Basketball Federation",
    organizerVerified: true,
    location: "Arat Kilo Youth Center Indoor Arena",
    city: "Addis Ababa",
    date: "2026-11-19",
    time: "05:00 PM",
    price: 150,
    currency: "ETB",
    availableSeats: 90,
    totalSeats: 1500,
    status: "AVAILABLE",
    rating: 4.7,
    reviewCount: 140,
    badge: "Championship",
    imageUrl: FIXED_CATEGORY_IMAGES.SPORTS,
    description: "Deciding Game 5 for the National Basketball Championship trophy. High-octane hardwood action, cheer teams, and half-time dunk contests.",
    duration: "2 hours",
    amenities: ["Indoor Climate Control", "Courtside Refreshments", "Electronic Scoreboard"],
    tiers: [
      { id: "stand", name: "Grandstand Seat", price: 150, available: 800, perks: ["Tiered Bleacher View"] },
      { id: "courtside", name: "Courtside Floor Seat", price: 600, available: 50, perks: ["Floor Seat 2m from Court", "Free Energy Drink"] },
    ],
    categoryDetails: {
      stadiumStand: "Indoor Arena Stands",
      homeTeam: "Addis Ababa City BC",
      awayTeam: "Water & Energy BC",
      tournament: "Ethiopian Basketball Championship Final",
    },
  },
];

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

