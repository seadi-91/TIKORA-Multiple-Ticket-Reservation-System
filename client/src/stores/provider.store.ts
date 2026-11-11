"use client";

import { create } from "zustand";
import { TicketCategory } from "@/types/ticket.types";
import { providerService } from "@/services/provider.service";
import { calculateProviderFinancials, matchesProvider } from "@/services/financial.service";

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
  providerId?: string;
  providerName?: string;
  ticket?: any;
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
  addNotification: (notification: Partial<ProviderNotification>) => void;
  fetchNotifications: () => Promise<ProviderNotification[]>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  // Booking Fetch
  fetchBookings: () => Promise<ProviderBookingRecord[]>;
  // Payout Request
  requestPayout: (amount: number) => void;
  // Sector Switching
  setOrganizationCategory: (category: TicketCategory) => void;
}

export const DEFAULT_SECTOR_ORGS: Record<
  TicketCategory,
  {
    id: string;
    name: string;
    legalName: string;
    category: TicketCategory;
    commissionRate: number;
    email: string;
    phone: string;
    address: string;
    city: string;
    tinNumber: string;
    registrationNumber: string;
    licenseNumber: string;
    description: string;
    contactPerson: { fullName: string; role: string; phone: string; email: string };
    payoutAccount: { bankName: string; accountNumber: string; accountHolder: string };
  }
> = {
  SPORTS: {
    id: "3",
    name: "Adiss Abeba Stadium",
    legalName: "Adiss Abeba Stadium Sports Directorate",
    category: "SPORTS",
    commissionRate: 5.0,
    email: "stadium@tikora.et",
    phone: "+251991826380",
    address: "Addis Ababa Stadium, Stadium Area, Addis Ababa",
    city: "Addis Ababa",
    tinNumber: "TIN-0091827364",
    registrationNumber: "REG-SPT-9988",
    licenseNumber: "LIC-ETH-SPT-2024-003",
    description: "National premier football and athletic stadium hosting major Ethiopian Premier League fixtures.",
    contactPerson: {
      fullName: "Addis Stadium Operations",
      role: "Operations Lead",
      phone: "+251991826380",
      email: "stadium@tikora.et",
    },
    payoutAccount: {
      bankName: "Commercial Bank of Ethiopia (CBE)",
      accountNumber: "1000192837465",
      accountHolder: "Adiss Abeba Stadium Operations",
    },
  },
  BUS: {
    id: "1",
    name: "Selam Bus Lines",
    legalName: "Selam Bus Lines Share Company",
    category: "BUS",
    commissionRate: 5.0,
    email: "selambus@tikora.et",
    phone: "+251911223344",
    address: "Meskel Square, Addis Ababa",
    city: "Addis Ababa",
    tinNumber: "TIN-0098765432",
    registrationNumber: "REG-BUS-1029",
    licenseNumber: "BUS-LIC-2024-8891",
    description: "Pioneer intercity scheduled transit lines connecting all major regions of Ethiopia.",
    contactPerson: {
      fullName: "Selam Bus Dispatch",
      role: "Fleet Director",
      phone: "+251911223344",
      email: "selambus@tikora.et",
    },
    payoutAccount: {
      bankName: "Commercial Bank of Ethiopia (CBE)",
      accountNumber: "1000283746519",
      accountHolder: "Selam Bus Lines S.C.",
    },
  },
  CINEMA: {
    id: "2",
    name: "Century Cinema Multiplex",
    legalName: "Century Cinema & Entertainment PLC",
    category: "CINEMA",
    commissionRate: 5.0,
    email: "cinema@tikora.et",
    phone: "+251911334455",
    address: "Century Mall, Gurd Shola, Addis Ababa",
    city: "Addis Ababa",
    tinNumber: "TIN-0044556677",
    registrationNumber: "REG-CIN-3344",
    licenseNumber: "CIN-LIC-2024-5541",
    description: "Premier multiplex cinema halls equipped with 4K laser projection and Dolby Atmos sound.",
    contactPerson: {
      fullName: "Century Cinema Box Office",
      role: "General Manager",
      phone: "+251911334455",
      email: "cinema@tikora.et",
    },
    payoutAccount: {
      bankName: "Commercial Bank of Ethiopia (CBE)",
      accountNumber: "1000374651928",
      accountHolder: "Century Cinema Multiplex",
    },
  },
  EVENT: {
    id: "4",
    name: "Kuriftu Resort & Live Events",
    legalName: "Kuriftu Resorts and Cultural Events",
    category: "EVENT",
    commissionRate: 5.0,
    email: "events@tikora.et",
    phone: "+251911778899",
    address: "Bishoftu / Bole Road, Addis Ababa",
    city: "Addis Ababa",
    tinNumber: "TIN-0033221199",
    registrationNumber: "REG-EVT-7788",
    licenseNumber: "EVT-LIC-2024-1190",
    description: "Cultural festivals, live concerts, and premium resort experience gatherings.",
    contactPerson: {
      fullName: "Kuriftu Event Coordinator",
      role: "Event Director",
      phone: "+251911778899",
      email: "events@tikora.et",
    },
    payoutAccount: {
      bankName: "Commercial Bank of Ethiopia (CBE)",
      accountNumber: "1000465192837",
      accountHolder: "Kuriftu Resort & Live Events",
    },
  },
};

const getInitialCategory = (): TicketCategory => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("tikora_provider_category") as TicketCategory;
      if (saved && ["BUS", "CINEMA", "EVENT", "SPORTS"].includes(saved)) {
        return saved;
      }
    } catch (err) { }
  }
  return "SPORTS";
};

const initialCat = getInitialCategory();

const getInitialOrg = (cat: TicketCategory): ProviderOrganization => {
  const def = DEFAULT_SECTOR_ORGS[cat] || DEFAULT_SECTOR_ORGS.SPORTS;
  return {
    id: def.id,
    name: def.name,
    legalName: def.legalName,
    category: cat,
    verified: true,
    approvalStatus: "APPROVED",
    tinNumber: def.tinNumber,
    registrationNumber: def.registrationNumber,
    licenseNumber: def.licenseNumber,
    email: def.email,
    phone: def.phone,
    website: "https://tikora.et",
    address: def.address,
    city: def.city,
    description: def.description,
    commissionRate: def.commissionRate,
    contactPerson: def.contactPerson,
    payoutAccount: def.payoutAccount,
    stats: getInitialStatsForCategory(cat),
  };
};

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

const getInitialProviderNotifications = (): ProviderNotification[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("tikora_provider_notifications");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { }
  return [];
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
  organization: getInitialOrg(initialCat),

  busRoutes: [],
  busSchedules: [],
  movieShowtimes: [],
  staffMembers: getInitialProviderStaff(),
  refunds: [],
  notifications: getInitialProviderNotifications(),
  bookings: getInitialProviderBookings(),

  fetchOrganization: async () => {
    try {
      const org = await providerService.getProfile();
      if (org && org.id) {
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
    } catch (err) {
      console.warn("Could not fetch organization profile from DB:", err);
    }

    if (typeof window !== "undefined") {
      try {
        const rawUser = localStorage.getItem("tikora_auth_user");
        if (rawUser) {
          const user = JSON.parse(rawUser);
          if (user && user.role === "ORGANIZATION" && user.organizationName) {
            const orgNameLower = (user.organizationName || "").toLowerCase();
            let cat: TicketCategory = user.organizationCategory || get().organization.category;
            let orgId = String(user.organizationId || get().organization.id);
            if (
              orgNameLower.includes("stadium") ||
              orgNameLower.includes("sport") ||
              orgNameLower.includes("adiss") ||
              orgNameLower.includes("addis")
            ) {
              cat = "SPORTS";
              orgId = "3";
            } else if (orgNameLower.includes("bus") || orgNameLower.includes("selam")) {
              cat = "BUS";
              orgId = "1";
            } else if (orgNameLower.includes("cinema") || orgNameLower.includes("century")) {
              cat = "CINEMA";
              orgId = "2";
            } else if (orgNameLower.includes("kuriftu") || orgNameLower.includes("event")) {
              cat = "EVENT";
              orgId = "4";
            }
            const def = DEFAULT_SECTOR_ORGS[cat] || DEFAULT_SECTOR_ORGS.SPORTS;
            set((state) => ({
              organization: {
                ...state.organization,
                ...def,
                id: orgId,
                name: user.organizationName,
                category: cat,
                email: user.email || state.organization.email,
              },
            }));
            try {
              localStorage.setItem("tikora_provider_category", cat);
            } catch { }
          }
        }
      } catch { }
    }
    return get().organization;
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
          } catch { }
        }
        return staff;
      }
    } catch { }
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
        } catch { }
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
        } catch { }
      }
      providerService.toggleStaffStatus(id).catch(() => { });
      return { staffMembers: updated };
    });
  },

  deleteStaffMember: (id) => {
    set((state) => {
      const updated = state.staffMembers.filter((s) => s.id !== id);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tikora_provider_staff", JSON.stringify(updated));
        } catch { }
      }
      providerService.deleteStaff(id).catch(() => { });
      return { staffMembers: updated };
    });
  },

  processRefund: (id, action) =>
    set((state) => ({
      refunds: state.refunds.map((r) => (r.id === id ? { ...r, status: action } : r)),
    })),

  addNotification: (notification) => {
    const newNotif: ProviderNotification = {
      id: notification.id || `notif-${Date.now()}`,
      title: notification.title || "Notification",
      message: notification.message || "",
      type: notification.type || "SYSTEM",
      createdAt: notification.createdAt || new Date().toISOString(),
      isRead: false,
      linkHref: notification.linkHref || "/provider/dashboard",
    };
    set((state) => {
      const updated = [newNotif, ...state.notifications.filter((n) => n.id !== newNotif.id)];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tikora_provider_notifications", JSON.stringify(updated));
        } catch { }
      }
      return { notifications: updated };
    });
  },

  fetchNotifications: async () => {
    let list: ProviderNotification[] = [];
    try {
      const res = await fetch("/api/provider/notifications");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          list = data.notifications;
        }
      }
    } catch { }

    if (list.length === 0 && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tikora_provider_notifications");
        if (raw) list = JSON.parse(raw);
      } catch { }
    }

    if (list.length > 0) {
      set({ notifications: list });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tikora_provider_notifications", JSON.stringify(list));
        } catch { }
      }
    }
    return list;
  },

  markNotificationAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tikora_provider_notifications", JSON.stringify(updated));
          fetch("/api/provider/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }).catch(() => { });
        } catch { }
      }
      return { notifications: updated };
    }),

  markAllNotificationsAsRead: () =>
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, isRead: true }));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tikora_provider_notifications", JSON.stringify(updated));
          fetch("/api/provider/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ markAll: true }),
          }).catch(() => { });
        } catch { }
      }
      return { notifications: updated };
    }),

  fetchBookings: async () => {
    let currentOrg = get().organization;
    let fetchedList: any[] = [];
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          fetchedList = data.bookings;
        }
      }
    } catch { }

    let storedList: any[] = [];
    let adminBookings: any[] = [];
    let customerBookings: any[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tikora_provider_bookings");
        if (raw) storedList = JSON.parse(raw);
        const rawAdm = localStorage.getItem("tikora_admin_bookings");
        if (rawAdm) adminBookings = JSON.parse(rawAdm);
        const rawCust = localStorage.getItem("tikora_customer_bookings");
        if (rawCust) customerBookings = JSON.parse(rawCust);
      } catch { }
    }

    const mergedMap = new Map<string, any>();
    for (const b of [
      ...fetchedList,
      ...storedList,
      ...adminBookings,
      ...customerBookings,
      ...get().bookings,
    ]) {
      if (!b) continue;
      const key = String(b.bookingReference || b.reference || b.id || "");
      if (key && !mergedMap.has(key)) {
        mergedMap.set(key, b);
      }
    }

    const allBookings = Array.from(mergedMap.values());
    const validBookings = allBookings.filter(
      (b) =>
        !String(b.id || "").startsWith("bkg-") &&
        !String(b.reference || "").startsWith("TIKORA-BKG-10")
    );

    let matchedValid = validBookings.filter((b) => matchesProvider(b, currentOrg));

    // If current selected category has 0 bookings, but there are bookings for another sector on platform:
    if (matchedValid.length === 0 && validBookings.length > 0) {
      const firstB = validBookings[0];
      const targetCat = (firstB.category as TicketCategory) || "SPORTS";
      if (targetCat) {
        const targetDef = DEFAULT_SECTOR_ORGS[targetCat];
        if (targetDef) {
          currentOrg = {
            ...currentOrg,
            ...targetDef,
            category: targetCat,
          };
          set((state) => ({
            organization: {
              ...state.organization,
              ...targetDef,
              category: targetCat,
            },
          }));
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("tikora_provider_category", targetCat);
            } catch { }
          }
          matchedValid = validBookings.filter((b) => matchesProvider(b, targetDef));
        }
      }
    }

    const mapped: ProviderBookingRecord[] = matchedValid.map((b: any) => {
      const cPaid = Number(b.customerPaid ?? b.pricing?.total ?? b.totalAmount ?? 0);
      const vRate = Number(b.vatRate ?? b.pricing?.vatRate ?? 5.0);
      const vAmount = Number(b.vatAmount ?? b.pricing?.tax ?? Math.round(((cPaid * vRate) / (100 + vRate)) * 100) / 100);
      const baseFare = Number(b.pricing?.subtotal ?? b.subtotal ?? Math.max(0, Math.round((cPaid - vAmount) * 100) / 100));
      const commRate = Number(b.commissionRate ?? b.pricing?.commissionRate ?? (currentOrg?.commissionRate || 5.0));
      const pFee = Number(b.platformFee ?? b.pricing?.platformCommission ?? Math.round(baseFare * (commRate / 100) * 100) / 100);
      const pNet = Number(b.providerNet ?? b.pricing?.providerNet ?? Math.max(0, Math.round((baseFare - pFee) * 100) / 100));

      return {
        id: b.id,
        reference: b.bookingReference || b.reference || b.id,
        customerName: b.customerName || "Customer",
        customerPhone: b.customerPhone || "+251 91 100 0000",
        customerEmail: b.customerEmail || "customer@tikora.et",
        serviceTitle: b.ticket?.title || b.serviceTitle || "TIKORA Experience Pass",
        category: b.category || currentOrg.category || "BUS",
        travelDate: b.ticket?.date || b.travelDate || new Date().toISOString().split("T")[0],
        departureTime: b.ticket?.time || b.departureTime || "Flexible",
        seats: b.selectedSeats || b.seats || [b.selectedTier || "Pass"],
        totalAmount: cPaid, // Standardize to customer paid gross so gross revenue matches admin (4,725 ETB)
        subtotal: baseFare,
        customerPaid: cPaid,
        vatRate: vRate,
        vatAmount: vAmount,
        commissionRate: commRate,
        platformFee: pFee,
        providerNet: pNet,
        paymentMethod: b.paymentMethod || "CHAPA",
        paymentStatus: b.paymentStatus || "PAID",
        bookingStatus: b.bookingStatus || "CONFIRMED",
        createdAt: b.createdAt || new Date().toISOString(),
        providerId: String(b.providerId || b.ticket?.providerId || ""),
        providerName: b.providerName || b.ticket?.organizer || "",
        ticket: b.ticket,
      };
    });

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("tikora_provider_bookings", JSON.stringify(mapped));
      } catch { }
    }

    const newGross = mapped.reduce((sum, b) => sum + (b.customerPaid || b.totalAmount || 0), 0);
    const totalFees = mapped.reduce((sum, b) => sum + (b.platformFee || 0), 0);
    const net = mapped.reduce((sum, b) => sum + (b.providerNet || 0), 0);
    const totalTicketsSold = mapped.reduce((sum, b) => {
      const pax = Array.isArray(b.seats) ? b.seats.length : (Number((b as any).quantity) || 1);
      return sum + pax;
    }, 0);

    let remotePayouts: any[] = [];
    try {
      const pRes = await fetch("/api/admin/payout");
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.success && Array.isArray(pData.payouts)) {
          remotePayouts = pData.payouts;
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("tikora_admin_payouts", JSON.stringify(remotePayouts));
            } catch { }
          }
        }
      }
    } catch { }
    if (remotePayouts.length === 0 && typeof window !== "undefined") {
      try {
        const rawP = localStorage.getItem("tikora_admin_payouts");
        if (rawP) remotePayouts = JSON.parse(rawP);
      } catch { }
    }

    const fin = calculateProviderFinancials(currentOrg, validBookings, remotePayouts);

    set((state) => ({
      bookings: mapped,
      organization: {
        ...state.organization,
        stats: {
          ...state.organization.stats,
          totalBookings: fin.bookingsCount,
          grossSales: fin.ticketRevenue,
          totalRevenue: fin.ticketRevenue,
          availableBalance: fin.netPayable,
          netPayout: fin.totalSettled,
          totalTicketsSold,
        },
      },
    }));

    return mapped;
  },

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
      const seatsCount = Array.isArray(booking.seats) && booking.seats.length > 0
        ? booking.seats.length
        : (Number((booking as any).quantity) || 1);
      const cPaid = Number(booking.customerPaid ?? booking.totalAmount ?? 0);
      const snapVatRate = typeof booking.vatRate === "number" ? booking.vatRate : 5.0;
      const snapVatAmount = typeof booking.vatAmount === "number"
        ? booking.vatAmount
        : Math.round(((cPaid * snapVatRate) / (100 + snapVatRate)) * 100) / 100;
      const baseTicketPrice = Number(booking.subtotal ?? Math.max(0, cPaid - snapVatAmount));

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
        totalAmount: cPaid,
        customerPaid: cPaid,
        subtotal: baseTicketPrice,
        vatRate: snapVatRate,
        vatAmount: snapVatAmount,
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
        } catch { }
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

    const def = DEFAULT_SECTOR_ORGS[category] || DEFAULT_SECTOR_ORGS.SPORTS;
    set((state) => ({
      organization: {
        ...state.organization,
        ...def,
        category,
        stats: getInitialStatsForCategory(category),
      },
    }));
    get().fetchBookings();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("tikora_provider_category_changed", { detail: category }));
    }
  },
}));
