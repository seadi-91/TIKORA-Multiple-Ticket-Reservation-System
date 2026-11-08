"use client";

import { create } from "zustand";
import { TicketItem } from "@/types/ticket.types";
import { BookingRecord, PassengerInfo } from "@/types/booking.types";
import { CustomerNotification } from "@/types/notification.types";
import { PaymentTransaction } from "@/types/payment.types";

const STORAGE_KEYS = {
  BOOKINGS: "tikora_customer_bookings",
  PAYMENTS: "tikora_customer_payments",
  NOTIFICATIONS: "tikora_customer_notifications",
  FAVORITES: "tikora_customer_favorites",
};

const getStoredItem = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStoredItem = (key: string, data: any) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
};

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
  updateBookingStatus: (idOrRef: string, bookingStatus: "CONFIRMED" | "PENDING" | "CANCELLED", paymentStatus: "PAID" | "PENDING" | "FAILED" | "REFUNDED") => void;
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
  rehydrateFromStorage: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: getStoredItem<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, []),
  favorites: getStoredItem<string[]>(STORAGE_KEYS.FAVORITES, []),
  notifications: getStoredItem<CustomerNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []),
  payments: getStoredItem<PaymentTransaction[]>(STORAGE_KEYS.PAYMENTS, []),

  activeTicket: null,
  selectedSeats: [],
  selectedTier: null,
  selectedQuantity: 1,
  passengerInfo: {
    fullName: "",
    phone: "",
    email: "",
  },
  paymentMethod: "CHAPA",
  bookingStep: 1,
  isProcessing: false,

  rehydrateFromStorage: () => {
    set({
      bookings: getStoredItem<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, []),
      favorites: getStoredItem<string[]>(STORAGE_KEYS.FAVORITES, []),
      notifications: getStoredItem<CustomerNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []),
      payments: getStoredItem<PaymentTransaction[]>(STORAGE_KEYS.PAYMENTS, []),
    });
  },

  addBooking: (booking) => {
    set((state) => {
      // Check if booking already exists by id or bookingReference
      const existingIdx = state.bookings.findIndex(
        (b) =>
          b.id === booking.id ||
          b.bookingReference === booking.bookingReference ||
          (booking.bookingReference && b.bookingReference && b.bookingReference.includes(booking.bookingReference))
      );

      let newBookings: BookingRecord[];
      if (existingIdx >= 0) {
        newBookings = [...state.bookings];
        newBookings[existingIdx] = { ...newBookings[existingIdx], ...booking };
      } else {
        newBookings = [booking, ...state.bookings];
      }
      setStoredItem(STORAGE_KEYS.BOOKINGS, newBookings);

      // Create or update payment record
      const paymentRecord: PaymentTransaction = {
        id: `tx-${booking.bookingReference || Date.now()}`,
        transactionReference: booking.bookingReference || `TX-${Date.now()}`,
        bookingReference: booking.bookingReference,
        ticketTitle: booking.ticket.title,
        category: booking.category,
        amount: booking.pricing.total,
        currency: "ETB",
        paymentMethod: (booking.paymentMethod as any) || "CHAPA",
        status: booking.paymentStatus === "PAID" ? "COMPLETED" : "PENDING",
        date: new Date().toLocaleString(),
        receiptNumber: `RCP-${booking.bookingReference || Math.floor(1000 + Math.random() * 9000)}-ETB`,
      };

      const existingPaymentIdx = state.payments.findIndex(
        (p) => p.bookingReference === booking.bookingReference || p.transactionReference === booking.bookingReference
      );
      let newPayments: PaymentTransaction[];
      if (existingPaymentIdx >= 0) {
        newPayments = [...state.payments];
        newPayments[existingPaymentIdx] = { ...newPayments[existingPaymentIdx], ...paymentRecord };
      } else {
        newPayments = [paymentRecord, ...state.payments];
      }
      setStoredItem(STORAGE_KEYS.PAYMENTS, newPayments);

      // Create notification
      const notification: CustomerNotification = {
        id: `notif-${Date.now()}`,
        type: "BOOKING_CONFIRMATION",
        title: `Booking Confirmed: ${booking.ticket.title}`,
        message: `Your reservation for ${booking.ticket.title} (${booking.quantity} ticket) was confirmed. Reference: ${booking.bookingReference}`,
        timestamp: "Just now",
        isRead: false,
        link: "/customer/tickets",
        referenceId: booking.bookingReference,
      };
      const newNotifications = [notification, ...state.notifications];
      setStoredItem(STORAGE_KEYS.NOTIFICATIONS, newNotifications);

      // Persist to backend server API asynchronously
      if (typeof window !== "undefined") {
        fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking, txRef: booking.bookingReference }),
        }).catch(() => {});
      }

      return {
        bookings: newBookings,
        payments: newPayments,
        notifications: newNotifications,
      };
    });
  },

  updateBookingStatus: (idOrRef, bookingStatus, paymentStatus) => {
    set((state) => {
      const newBookings = state.bookings.map((b) =>
        b.id === idOrRef || b.bookingReference === idOrRef || (b.bookingReference && b.bookingReference.includes(idOrRef))
          ? {
              ...b,
              bookingStatus,
              paymentStatus,
              qrCodeData: `TIKORA-PASS:${b.bookingReference}:${b.pricing.total}:${paymentStatus}`,
            }
          : b
      );
      setStoredItem(STORAGE_KEYS.BOOKINGS, newBookings);

      const newPayments = state.payments.map((p) =>
        p.bookingReference === idOrRef || p.transactionReference === idOrRef
          ? { ...p, status: paymentStatus === "PAID" ? ("COMPLETED" as const) : ("PENDING" as const) }
          : p
      );
      setStoredItem(STORAGE_KEYS.PAYMENTS, newPayments);

      return { bookings: newBookings, payments: newPayments };
    });
  },

  cancelBooking: (bookingId) => {
    set((state) => {
      const newBookings = state.bookings.map((b) =>
        b.id === bookingId ? { ...b, bookingStatus: "CANCELLED" as const } : b
      );
      setStoredItem(STORAGE_KEYS.BOOKINGS, newBookings);

      const notification: CustomerNotification = {
        id: `notif-${Date.now()}`,
        type: "CANCELLATION",
        title: "Booking Cancelled",
        message: `Your booking #${bookingId} has been cancelled. Refund processing has initiated.`,
        timestamp: "Just now",
        isRead: false,
        link: "/customer/bookings",
      };
      const newNotifications = [notification, ...state.notifications];
      setStoredItem(STORAGE_KEYS.NOTIFICATIONS, newNotifications);

      return { bookings: newBookings, notifications: newNotifications };
    });
  },

  toggleFavorite: (ticketId) => {
    set((state) => {
      const exists = state.favorites.includes(ticketId);
      const newFavs = exists
        ? state.favorites.filter((id) => id !== ticketId)
        : [...state.favorites, ticketId];
      setStoredItem(STORAGE_KEYS.FAVORITES, newFavs);
      return { favorites: newFavs };
    });
  },

  isFavorite: (ticketId) => {
    return get().favorites.includes(ticketId);
  },

  markNotificationAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      setStoredItem(STORAGE_KEYS.NOTIFICATIONS, updated);
      return { notifications: updated };
    });
  },

  markAllNotificationsAsRead: () => {
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, isRead: true }));
      setStoredItem(STORAGE_KEYS.NOTIFICATIONS, updated);
      return { notifications: updated };
    });
  },

  deleteNotification: (id) => {
    set((state) => {
      const updated = state.notifications.filter((n) => n.id !== id);
      setStoredItem(STORAGE_KEYS.NOTIFICATIONS, updated);
      return { notifications: updated };
    });
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
