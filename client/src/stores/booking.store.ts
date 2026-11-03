"use client";

import { create } from "zustand";
import { TicketItem } from "@/types/ticket.types";
import { BookingRecord, PassengerInfo, BookingPriceBreakdown } from "@/types/booking.types";
import { CustomerNotification } from "@/types/notification.types";
import { PaymentTransaction } from "@/types/payment.types";

// Realistic Seed Bookings for TicketHub Customer
const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: "BKG-2026-0891",
    bookingReference: "TH-BUS-8829",
    ticketId: "bus-1",
    category: "BUS",
    ticket: {
      id: "bus-1",
      title: "Addis Ababa to Hawassa Express",
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
      badge: "Fastest Express",
      amenities: ["Free Wi-Fi", "USB Charging", "Air Conditioning", "Reclining Seats", "Snack Pack"],
      categoryDetails: {
        busCompany: "Selam Bus Line SC",
        origin: "Addis Ababa (Autobus Tera)",
        destination: "Hawassa (Piazza Terminal)",
        busType: "Scania VIP Luxury Coach",
        boardingStation: "Autobus Tera Gate 3",
        dropoffStation: "Hawassa Main Piazza",
      },
    },
    customerName: "Abebe Bekele",
    customerEmail: "abebe.customer@tickethub.et",
    customerPhone: "+251 91 123 4567",
    passengers: [
      {
        fullName: "Abebe Bekele",
        phone: "+251 91 123 4567",
        email: "abebe.customer@tickethub.et",
        seatNumber: "12A",
        gender: "MALE",
      },
      {
        fullName: "Selamawit Tadesse",
        phone: "+251 92 987 6543",
        email: "selamawit@tickethub.et",
        seatNumber: "12B",
        gender: "FEMALE",
      },
    ],
    selectedSeats: ["12A", "12B"],
    quantity: 2,
    pricing: {
      basePrice: 650,
      quantity: 2,
      subtotal: 1300,
      serviceFee: 65,
      tax: 195,
      discount: 0,
      total: 1560,
    },
    paymentMethod: "TELEBIRR",
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2026-11-01T09:30:00Z",
    qrCodeData: "TH-VERIFIED:BKG-2026-0891:BUS:12A,12B:SELAM_BUS",
  },
  {
    id: "BKG-2026-0845",
    bookingReference: "TH-CIN-4102",
    ticketId: "cinema-1",
    category: "CINEMA",
    ticket: {
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
      amenities: ["Dolby Atmos 7.1", "Laser 4K Projection", "Couple Loungers", "Popcorn & Soda Bar"],
      categoryDetails: {
        movieHall: "Screen 1 (IMAX Hall)",
        screenFormat: "IMAX 4K 3D",
        movieGenre: "Action / Historical Drama",
        movieRating: "PG-13",
      },
    },
    customerName: "Abebe Bekele",
    customerEmail: "abebe.customer@tickethub.et",
    customerPhone: "+251 91 123 4567",
    passengers: [
      {
        fullName: "Abebe Bekele",
        phone: "+251 91 123 4567",
        email: "abebe.customer@tickethub.et",
        seatNumber: "F-10",
      },
    ],
    selectedSeats: ["F-10"],
    quantity: 1,
    pricing: {
      basePrice: 350,
      quantity: 1,
      subtotal: 350,
      serviceFee: 20,
      tax: 52.5,
      discount: 0,
      total: 422.5,
    },
    paymentMethod: "CHAPA",
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2026-10-28T14:15:00Z",
    qrCodeData: "TH-VERIFIED:BKG-2026-0845:CINEMA:F10:CENTURY_MALL",
  },
  {
    id: "BKG-2026-0770",
    bookingReference: "TH-EVT-9931",
    ticketId: "event-1",
    category: "EVENT",
    ticket: {
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
      badge: "VIP Lounge Access",
      amenities: ["Outdoor Stage", "VIP Beverage Bar", "Artisanal Food Courtyard", "Live Broadcast"],
      categoryDetails: {
        eventVenue: "Ghion Main Gardens Amphitheater",
        eventCategory: "Music / Festival",
      },
    },
    customerName: "Abebe Bekele",
    customerEmail: "abebe.customer@tickethub.et",
    customerPhone: "+251 91 123 4567",
    passengers: [
      {
        fullName: "Abebe Bekele",
        phone: "+251 91 123 4567",
        email: "abebe.customer@tickethub.et",
        seatNumber: "VIP-PASS-01",
      },
    ],
    selectedSeats: ["VIP-01"],
    selectedTier: "VIP Stage Pass",
    quantity: 1,
    pricing: {
      basePrice: 800,
      quantity: 1,
      subtotal: 800,
      serviceFee: 40,
      tax: 120,
      discount: 0,
      total: 960,
    },
    paymentMethod: "CBE_BIRR",
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2026-10-20T11:00:00Z",
    qrCodeData: "TH-VERIFIED:BKG-2026-0770:EVENT:VIP-01:YARED_ARTS",
  },
];

const INITIAL_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: "notif-1",
    type: "BOOKING_CONFIRMATION",
    title: "Booking Confirmed: Addis to Hawassa Express",
    message: "Your 2 bus seats (12A, 12B) on Selam Bus have been booked and your QR boarding pass is active.",
    timestamp: "2 hours ago",
    isRead: false,
    link: "/customer/tickets",
    referenceId: "TH-BUS-8829",
  },
  {
    id: "notif-2",
    type: "PAYMENT_SUCCESS",
    title: "Payment Processed (ETB 1,560.00)",
    message: "Telebirr transaction confirmed. Your official e-receipt has been generated.",
    timestamp: "2 hours ago",
    isRead: false,
    link: "/customer/payments",
    referenceId: "TX-TB-9921",
  },
  {
    id: "notif-3",
    type: "REMINDER",
    title: "Upcoming Cinema Screening in 5 Days",
    message: "Reminder: Gladiator II at Century Mall Screen 1 starts at 08:15 PM on Nov 8.",
    timestamp: "1 day ago",
    isRead: true,
    link: "/customer/bookings",
    referenceId: "TH-CIN-4102",
  },
  {
    id: "notif-4",
    type: "PROMOTION",
    title: "20% Early Bird Pass for Addis Jazz Fest",
    message: "Special loyalty perk: Enjoy 20% off festival tickets using code MARAKI20 at checkout.",
    timestamp: "3 days ago",
    isRead: true,
    link: "/events",
  },
];

const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: "tx-1",
    transactionReference: "TX-TB-9921",
    bookingReference: "TH-BUS-8829",
    ticketTitle: "Addis Ababa to Hawassa Express (2 Seats)",
    category: "BUS",
    amount: 1560,
    currency: "ETB",
    paymentMethod: "TELEBIRR",
    status: "COMPLETED",
    date: "2026-11-01 09:32 AM",
    receiptNumber: "RCP-8829-ETB",
  },
  {
    id: "tx-2",
    transactionReference: "TX-CHP-7712",
    bookingReference: "TH-CIN-4102",
    ticketTitle: "Gladiator II - IMAX Premiere (1 Seat)",
    category: "CINEMA",
    amount: 422.5,
    currency: "ETB",
    paymentMethod: "CHAPA",
    status: "COMPLETED",
    date: "2026-10-28 02:18 PM",
    receiptNumber: "RCP-4102-ETB",
  },
  {
    id: "tx-3",
    transactionReference: "TX-CBE-5519",
    bookingReference: "TH-EVT-9931",
    ticketTitle: "Addis International Jazz & Heritage Fest",
    category: "EVENT",
    amount: 960,
    currency: "ETB",
    paymentMethod: "CBE_BIRR",
    status: "COMPLETED",
    date: "2026-10-20 11:05 AM",
    receiptNumber: "RCP-9931-ETB",
  },
];

interface BookingState {
  bookings: BookingRecord[];
  favorites: string[]; // ticket IDs
  notifications: CustomerNotification[];
  payments: PaymentTransaction[];
  
  // Active checkout / booking modal state
  activeTicket: TicketItem | null;
  selectedSeats: string[];
  selectedTier: string | null;
  selectedQuantity: number;
  passengerInfo: PassengerInfo;
  paymentMethod: string;
  bookingStep: number;
  isProcessing: boolean;
  
  // Actions
  addBooking: (booking: BookingRecord) => void;
  cancelBooking: (bookingId: string) => void;
  toggleFavorite: (ticketId: string) => void;
  isFavorite: (ticketId: string) => boolean;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  
  // Checkout flow actions
  setActiveTicket: (ticket: TicketItem | null) => void;
  toggleSeatSelection: (seatId: string) => void;
  setSelectedSeats: (seats: string[]) => void;
  setSelectedTier: (tier: string | null) => void;
  setSelectedQuantity: (qty: number) => void;
  setPassengerInfo: (info: Partial<PassengerInfo>) => void;
  setPaymentMethod: (method: string) => void;
  setBookingStep: (step: number) => void;
  setIsProcessing: (processing: boolean) => void;
  resetBookingFlow: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: INITIAL_BOOKINGS,
  favorites: ["bus-1", "cinema-1", "sports-1"],
  notifications: INITIAL_NOTIFICATIONS,
  payments: INITIAL_PAYMENTS,

  activeTicket: null,
  selectedSeats: [],
  selectedTier: null,
  selectedQuantity: 1,
  passengerInfo: {
    fullName: "Abebe Bekele",
    phone: "+251 91 123 4567",
    email: "abebe.customer@tickethub.et",
  },
  paymentMethod: "TELEBIRR",
  bookingStep: 1,
  isProcessing: false,

  addBooking: (booking) => {
    set((state) => ({
      bookings: [booking, ...state.bookings],
      payments: [
        {
          id: `tx-${Date.now()}`,
          transactionReference: `TX-TH-${Math.floor(1000 + Math.random() * 9000)}`,
          bookingReference: booking.bookingReference,
          ticketTitle: booking.ticket.title,
          category: booking.category,
          amount: booking.pricing.total,
          currency: "ETB",
          paymentMethod: (booking.paymentMethod as any) || "TELEBIRR",
          status: "COMPLETED",
          date: new Date().toLocaleString(),
          receiptNumber: `RCP-${Math.floor(1000 + Math.random() * 9000)}-ETB`,
        },
        ...state.payments,
      ],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          type: "BOOKING_CONFIRMATION",
          title: `Booking Confirmed: ${booking.ticket.title}`,
          message: `Your reservation for ${booking.ticket.title} (${booking.quantity} ticket) was successful. Reference: ${booking.bookingReference}`,
          timestamp: "Just now",
          isRead: false,
          link: "/customer/tickets",
          referenceId: booking.bookingReference,
        },
        ...state.notifications,
      ],
    }));
  },

  cancelBooking: (bookingId) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, bookingStatus: "CANCELLED" as const } : b
      ),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          type: "CANCELLATION",
          title: "Booking Cancelled",
          message: `Your booking #${bookingId} has been cancelled. Refund processing has initiated.`,
          timestamp: "Just now",
          isRead: false,
          link: "/customer/bookings",
        },
        ...state.notifications,
      ],
    }));
  },

  toggleFavorite: (ticketId) => {
    set((state) => {
      const exists = state.favorites.includes(ticketId);
      return {
        favorites: exists
          ? state.favorites.filter((id) => id !== ticketId)
          : [...state.favorites, ticketId],
      };
    });
  },

  isFavorite: (ticketId) => {
    return get().favorites.includes(ticketId);
  },

  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  },

  markAllNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  setActiveTicket: (ticket) => set({ activeTicket: ticket, bookingStep: 1, selectedSeats: [] }),

  toggleSeatSelection: (seatId) => {
    set((state) => {
      const exists = state.selectedSeats.includes(seatId);
      const newSeats = exists
        ? state.selectedSeats.filter((s) => s !== seatId)
        : [...state.selectedSeats, seatId];
      return {
        selectedSeats: newSeats,
        selectedQuantity: Math.max(1, newSeats.length),
      };
    });
  },

  setSelectedSeats: (seats) =>
    set({ selectedSeats: seats, selectedQuantity: Math.max(1, seats.length) }),

  setSelectedTier: (tier) => set({ selectedTier: tier }),

  setSelectedQuantity: (qty) => set({ selectedQuantity: Math.max(1, qty) }),

  setPassengerInfo: (info) =>
    set((state) => ({
      passengerInfo: { ...state.passengerInfo, ...info },
    })),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setBookingStep: (step) => set({ bookingStep: step }),

  setIsProcessing: (isProcessing) => set({ isProcessing }),

  resetBookingFlow: () =>
    set({
      activeTicket: null,
      selectedSeats: [],
      selectedTier: null,
      selectedQuantity: 1,
      bookingStep: 1,
      isProcessing: false,
    }),
}));

