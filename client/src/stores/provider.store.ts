"use client";

import { create } from "zustand";
import { TicketCategory } from "@/types/ticket.types";
import { providerService } from "@/services/provider.service";

export interface ProviderOrganization {
  id: string;
  name: string;
  legalName: string;
  category: TicketCategory;
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

interface ProviderStoreState {
  organization: ProviderOrganization;
  busRoutes: BusRouteItem[];
  busSchedules: BusScheduleItem[];
  movieShowtimes: MovieShowtimeItem[];
  staffMembers: ProviderStaffMember[];
  refunds: ProviderRefundItem[];
  notifications: ProviderNotification[];
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
  addStaffMember: (member: Omit<ProviderStaffMember, "id" | "scannedTicketsCount" | "dateAdded">) => void;
  toggleStaffStatus: (id: string) => void;
  deleteStaffMember: (id: string) => void;
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

export const getInitialStatsForCategory = (cat: TicketCategory) => ({
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

export const useProviderStore = create<ProviderStoreState>((set) => ({
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
  staffMembers: [],
  refunds: [],
  notifications: [],

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

  addStaffMember: (member) =>
    set((state) => ({
      staffMembers: [
        {
          ...member,
          id: `st-${Date.now()}`,
          scannedTicketsCount: 0,
          dateAdded: new Date().toISOString().split("T")[0],
        },
        ...state.staffMembers,
      ],
    })),

  toggleStaffStatus: (id) =>
    set((state) => ({
      staffMembers: state.staffMembers.map((s) =>
        s.id === id ? { ...s, status: s.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" } : s
      ),
    })),

  deleteStaffMember: (id) =>
    set((state) => ({
      staffMembers: state.staffMembers.filter((s) => s.id !== id),
    })),

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
