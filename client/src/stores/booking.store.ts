"use client";

import { create } from "zustand";
import { TicketItem } from "@/types/ticket.types";
import { BookingRecord, PassengerInfo, BookingPriceBreakdown } from "@/types/booking.types";
import { CustomerNotification } from "@/types/notification.types";
import { PaymentTransaction } from "@/types/payment.types";

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
  bookings: [],
  favorites: [],
  notifications: [],
  payments: [],

  activeTicket: null,
  selectedSeats: [],
  selectedTier: null,
  selectedQuantity: 1,
  passengerInfo: {
    fullName: "",
    phone: "",
    email: "",
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
