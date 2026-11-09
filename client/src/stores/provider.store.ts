"use client";

import { create } from "zustand";
import { TicketCategory } from "@/types/ticket.types";
import { providerService } from "@/services/provider.service";

export interface ProviderOrganization {
  id: string;
  name: string;
  legalName: string;
  category: TicketCategory;
  commissionRate?: number;
  isCategoryActive?: boolean;
  categoryStatus?: "ACTIVE" | "DEACTIVATED";
  categoryDeactivated?: boolean;
  verified: boolean;
  approvalStatus: "APPROVED" | "PENDING_APPROVAL" | "REJECTED" | "SUSPENDED";
  tinNumber: string;
  registrationNumber: string;
  licenseNumber: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  description: string;
  contactPerson: {
    fullName: string;
    role: string;
    phone: string;
    email: string;
  };
  payoutAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  stats: {
    totalRevenue: number;
    grossSales: number;
    platformCommission: number;
    netPayout: number;
    availableBalance: number;
    totalBookings: number;
    totalTicketsSold: number;
    activeServices: number;
    pendingBookings: number;
    availableSeats: number;
  };
}

export interface BusRouteItem {
  id: string;
  origin: string;
  destination: string;
  boardingStation: string;
  dropoffStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  operatingDays: string;
  fare: number;
  status: "ACTIVE" | "INACTIVE";
  busType: string;
  dailyTrips: number;
}

export interface BusScheduleItem {
  id: string;
  routeId: string;
  routeTitle: string;
  busPlateNumber: string;
  busType: string;
  departureDate: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  driverName: string;
  driverPhone: string;
  status: "SCHEDULED" | "BOARDING" | "ON_TRIP" | "COMPLETED" | "DELAYED";
}

export interface MovieShowtimeItem {
  id: string;
  movieTitle: string;
  genre: string;
  duration: string;
  rating: string;
  hallName: string;
  screenFormat: string;
  date: string;
  time: string;
  price: number;
  vipPrice: number;
  totalSeats: number;
  bookedSeats: number;
  status: "ACTIVE" | "SOLD_OUT" | "CANCELLED";
}

export interface ProviderStaffMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "MANAGER" | "DISPATCHER" | "INSPECTOR" | "CASHIER";
  assignedStation: string;
  status: "ACTIVE" | "INVITED" | "SUSPENDED";
  scannedTicketsCount: number;
  lastActive: string;
  dateAdded: string;
}

export interface ProviderRefundItem {
  id: string;
  bookingReference: string;
  customerName: string;
  serviceTitle: string;
  category: TicketCategory;
  requestedAmount: number;
  reason: string;
  requestDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface ProviderNotification {
  id: string;
  title: string;
  message: string;
  type: "BOOKING" | "PAYMENT" | "SYSTEM" | "INVENTORY" | "INSPECTOR";
  createdAt: string;
  isRead: boolean;
  linkHref?: string;
}

export interface ProviderBookingRecord {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceTitle: string;
  category: TicketCategory;
  travelDate: string;
  departureTime: string;
  seats: string[];
  totalAmount: number;
  subtotal?: number;
  customerPaid?: number;
  vatAmount?: number;
  vatRate?: number;
  commissionRate?: number;
  platformFee?: number;
  providerNet?: number;
  paymentMethod: "TELEBIRR" | "CBE_BIRR" | "CHAPA";
  paymentStatus: "PAID" | "PENDING" | "REFUNDED";
  bookingStatus: "CONFIRMED" | "CHECKED_IN" | "CANCELLED";
  createdAt: string;
}

interface ProviderStoreState {
  organization: ProviderOrganization;
  busRoutes: BusRouteItem[];
  busSchedules: BusScheduleItem[];
  movieShowtimes: MovieShowtimeItem[];
  staffMembers: ProviderStaffMember[];
  refunds: ProviderRefundItem[];
  notifications: ProviderNotification[];
  bookings: ProviderBookingRecord[];
  addBooking: (booking: ProviderBookingRecord) => void;
  // Actions
  fetchOrganization: () => Promise<ProviderOrganization | null>;
  updateOrganization: (data: Partial<ProviderOrganization>) => void;
  toggleApprovalStatus: (status: ProviderOrganization["approvalStatus"]) => void;
  // Bus Actions
  addBusRoute: (route: Omit<BusRouteItem, "id">) => void;
  updateBusRoute: (id: string, route: Partial<BusRouteItem>) => void;
  deleteBusRoute: (id: string) => void;
  addBusSchedule: (schedule: Omit<BusScheduleItem, "id">) => void;
  updateBusSchedule: (id: string, data: Partial<BusScheduleItem>) => void;
  // Cinema Actions
  addMovieShowtime: (showtime: Omit<MovieShowtimeItem, "id">) => void;
  updateMovieShowtime: (id: string, data: Partial<MovieShowtimeItem>) => void;
  // Staff Actions
  addStaffMember: (member: Omit<ProviderStaffMember, "scannedTicketsCount" | "dateAdded"> & { id?: string }) => void;
  toggleStaffStatus: (id: string) => void;
  deleteStaffMember: (id: string) => void;
  fetchStaff: () => Promise<ProviderStaffMember[]>;
  // Refund Actions
  processRefund: (id: string, action: "APPROVED" | "REJECTED") => void;
  // Notification Actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  // Payout Request
  requestPayout: (amount: number) => void;
  // Sector Switching
  setOrganizationCategory: (category: TicketCategory) => void;
}

const getInitialCategory = (): TicketCategory => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("tikora_provider_category") as TicketCategory;
      if (saved && ["BUS", "CINEMA", "EVENT", "SPORTS"].includes(saved)) {
        return saved;
      }
    } catch (err) {}
  }
  return "BUS";
};

const initialCat = getInitialCategory();

export const getInitialStaffForCategory = (cat: TicketCategory): ProviderStaffMember[] => [];

export const getInitialRefundsForCategory = (cat: TicketCategory): ProviderRefundItem[] => [];

export const getInitialNotificationsForCategory = (cat: TicketCategory): ProviderNotification[] => [];

export const getInitialStatsForCategory = (_cat: TicketCategory) => ({
  totalRevenue: 0,
  grossSales: 0,
  platformCommission: 0,
  netPayout: 0,
  availableBalance: 0,
  totalBookings: 0,
  totalTicketsSold: 0,
  activeServices: 0,
  pendingBookings: 0,
  availableSeats: 0,
});

const getInitialProviderBookings = (): ProviderBookingRecord[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("tikora_provider_bookings");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const realBookings = parsed.filter(
          (b: any) =>
            !String(b.id || "").startsWith("bkg-") &&
            !String(b.reference || "").startsWith("TIKORA-BKG-10")
        );
        localStorage.setItem("tikora_provider_bookings", JSON.stringify(realBookings));
        return realBookings;
      }
    }
    return [];
  } catch {
    return [];
  }
};

const getInitialProviderStaff = (): ProviderStaffMember[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("tikora_provider_staff");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useProviderStore = create<ProviderStoreState>((set, get) => ({
  organization: {
    id: "org-provider-01",
    name: "Organization Provider Portal",
    legalName: "Organization Provider Services",
    category: initialCat,
    verified: true,
    approvalStatus: "APPROVED",
    tinNumber: "",
    registrationNumber: "",
    licenseNumber: "",
    email: "contact@provider.et",
    phone: "+251 11 000 0000",
    website: "",
    address: "Addis Ababa, Ethiopia",
    city: "Addis Ababa",
    description: "Verified ticket and transit service provider on TIKORA platform.",
    contactPerson: {
      fullName: "Operations Manager",
      role: "Operations Lead",
      phone: "+251 91 000 0000",
      email: "operations@provider.et",
    },
    payoutAccount: {
      bankName: "Commercial Bank of Ethiopia (CBE)",
      accountNumber: "1000000000000",
      accountHolder: "Provider Operational Account",
    },
    stats: getInitialStatsForCategory(initialCat),
  },

  busRoutes: [],
  busSchedules: [],
  movieShowtimes: [],
  staffMembers: getInitialProviderStaff(),
  refunds: [],
  notifications: [],
  bookings: getInitialProviderBookings(),

  fetchOrganization: async () => {
    try {
      const org = await providerService.getProfile();
      if (org) {
        set((state) => ({
          organization: {
            ...state.organization,
            ...org,
            stats: {
              ...state.organization.stats,
              ...(org.stats || {}),
            },
          },
        }));
        return org;
      }
      return null;
    } catch (err) {
      console.warn("Could not fetch organization profile from DB:", err);
      return null;
    }
  },

  updateOrganization: (data) => {
    set((state) => ({
      organization: { ...state.organization, ...data },
    }));

    // Asynchronously persist updates to PostgreSQL database
    providerService.updateProfile(data).catch((err) => {
      console.warn("Failed to persist organization profile update:", err);
    });
  },

  toggleApprovalStatus: (approvalStatus) =>
    set((state) => ({
      organization: { ...state.organization, approvalStatus },
    })),

  addBusRoute: (route) =>
    set((state) => ({
      busRoutes: [{ ...route, id: `rt-${Date.now()}` }, ...state.busRoutes],
    })),

  updateBusRoute: (id, route) =>
    set((state) => ({
      busRoutes: state.busRoutes.map((r) => (r.id === id ? { ...r, ...route } : r)),
    })),

  deleteBusRoute: (id) =>
    set((state) => ({
      busRoutes: state.busRoutes.filter((r) => r.id !== id),
    })),

  addBusSchedule: (schedule) =>
    set((state) => ({
      busSchedules: [{ ...schedule, id: `sch-${Date.now()}` }, ...state.busSchedules],
    })),

  updateBusSchedule: (id, data) =>
    set((state) => ({
      busSchedules: state.busSchedules.map((s) => (s.id === id ? { ...s, ...data } : s)),
    })),

  addMovieShowtime: (showtime) =>
    set((state) => ({
      movieShowtimes: [{ ...showtime, id: `sh-${Date.now()}` }, ...state.movieShowtimes],
    })),

  updateMovieShowtime: (id, data) =>
    set((state) => ({
      movieShowtimes: state.movieShowtimes.map((m) => (m.id === id ? { ...m, ...data } : m)),
    })),

  fetchStaff: async () => {
    try {
      const staff = await providerService.getStaff();
      if (staff && staff.length > 0) {
        set({ staffMembers: staff });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("tikora_provider_staff", JSON.stringify(staff));
          } catch {}
        }
        return staff;
      }
    } catch {}
    return get().staffMembers;
  },

  addStaffMember: (member) => {
    const newMember: ProviderStaffMember = {
      ...member,
      id: member.id || `st-${Date.now()}`,
      scannedTicketsCount: 0,
      dateAdded: new Date().toISOString().split("T")[0],
    };
    set((state) => {
      const updated = [newMember, ...state.staffMembers.filter((s) => s.email !== member.email)];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tikora_provider_staff", JSON.stringify(updated));
        } catch {}
      }
      return { staffMembers: updated };
    });
  },

  toggleStaffStatus: (id) => {
    set((state) => {
      const updated = state.staffMembers.map((s) =>
        s.id === id ? { ...s, status: (s.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE") as any } : s
      );
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tikora_provider_staff", JSON.stringify(updated));
        } catch {}
      }
      providerService.toggleStaffStatus(id).catch(() => {});
      return { staffMembers: updated };
    });
  },

  deleteStaffMember: (id) => {
    set((state) => {
      const updated = state.staffMembers.filter((s) => s.id !== id);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tikora_provider_staff", JSON.stringify(updated));
        } catch {}
      }
      providerService.deleteStaff(id).catch(() => {});
      return { staffMembers: updated };
    });
  },

  processRefund: (id, action) =>
    set((state) => ({
      refunds: state.refunds.map((r) => (r.id === id ? { ...r, status: action } : r)),
    })),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    })),

  markAllNotificationsAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  requestPayout: (amount) =>
    set((state) => ({
      organization: {
        ...state.organization,
        stats: {
          ...state.organization.stats,
          availableBalance: Math.max(0, state.organization.stats.availableBalance - amount),
          netPayout: state.organization.stats.netPayout + amount,
        },
      },
    })),

  addBooking: (booking) => {
    set((state) => {
      // Provider displays purely the ticket base price (VAT excluded)
      const seatsCount = booking.seats && booking.seats.length > 0 ? booking.seats.length : 1;
      const snapVatRate = typeof booking.vatRate === "number" ? booking.vatRate : 5.0;
      const baseTicketPrice = typeof booking.totalAmount === "number" && booking.customerPaid
        ? booking.totalAmount
        : Math.round(booking.totalAmount / (1 + snapVatRate / 100));

      const snapCommissionRate = typeof booking.commissionRate === "number"
        ? booking.commissionRate
        : (state.organization.commissionRate || 5.0);

      const snapPlatformFee = typeof booking.platformFee === "number"
        ? booking.platformFee
        : Math.round(baseTicketPrice * (snapCommissionRate / 100) * 100) / 100;

      const snapProviderNet = typeof booking.providerNet === "number"
        ? booking.providerNet
        : Math.max(0, baseTicketPrice - snapPlatformFee);

      const sanitizedBooking: ProviderBookingRecord = {
        ...booking,
        totalAmount: baseTicketPrice, // Pure ticket base fare without VAT
        vatRate: snapVatRate,
        commissionRate: snapCommissionRate,
        platformFee: snapPlatformFee,
        providerNet: snapProviderNet,
      };

      const existingIdx = state.bookings.findIndex(
        (b) => b.reference === sanitizedBooking.reference || b.id === sanitizedBooking.id
      );
      let newBookings: ProviderBookingRecord[];
      if (existingIdx >= 0) {
        newBookings = [...state.bookings];
        newBookings[existingIdx] = { ...newBookings[existingIdx], ...sanitizedBooking };
      } else {
        newBookings = [sanitizedBooking, ...state.bookings];
      }

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tikora_provider_bookings", JSON.stringify(newBookings));
        } catch {}
      }

      const newGross = newBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const totalFees = newBookings.reduce(
        (sum, b) => sum + (b.platformFee ?? Math.round((b.totalAmount || 0) * ((b.commissionRate ?? 5) / 100))),
        0
      );
      const net = Math.max(0, newGross - totalFees);

      // Decrement seats on bus schedules
      const updatedSchedules = state.busSchedules.map((s) => {
        if (s.routeTitle.includes(booking.serviceTitle) || booking.serviceTitle.includes(s.routeTitle)) {
          return {
            ...s,
            availableSeats: Math.max(0, s.availableSeats - seatsCount),
          };
        }
        return s;
      });

      // Decrement seats on cinema showtimes
      const updatedShowtimes = state.movieShowtimes.map((m) => {
        if (m.movieTitle.includes(booking.serviceTitle) || booking.serviceTitle.includes(m.movieTitle)) {
          return {
            ...m,
            bookedSeats: m.bookedSeats + seatsCount,
          };
        }
        return m;
      });

      return {
        bookings: newBookings,
        busSchedules: updatedSchedules,
        movieShowtimes: updatedShowtimes,
        organization: {
          ...state.organization,
          stats: {
            ...state.organization.stats,
            totalBookings: newBookings.length,
            grossSales: newGross, // Base ticket sales without VAT
            totalRevenue: net,
            availableBalance: net,
            totalTicketsSold: newBookings.reduce((sum, b) => sum + (b.seats?.length || 1), 0),
            availableSeats: Math.max(0, state.organization.stats.availableSeats - seatsCount),
          },
        },
      };
    });
  },

  setOrganizationCategory: (category: TicketCategory) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("tikora_provider_category", category);
      } catch (err) {
        console.warn("Storage error for provider category:", err);
      }
    }

    set((state) => ({
      organization: {
        ...state.organization,
        category,
        stats: getInitialStatsForCategory(category),
      },
    }));
  },
}));
