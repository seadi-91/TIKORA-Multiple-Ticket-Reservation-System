"use client";

import { create } from "zustand";
import { TicketCategory } from "@/types/ticket.types";

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
}

export const useProviderStore = create<ProviderStoreState>((set) => ({
  organization: {
    id: "org-selam-01",
    name: "Selam Bus Lines S.C.",
    legalName: "Selam Bus Line Share Company",
    category: "BUS",
    verified: true,
    approvalStatus: "APPROVED",
    tinNumber: "0048192841",
    registrationNumber: "AA/09/2018/Com",
    licenseNumber: "MOT/TRANS/2024/0912",
    email: "dispatch@selambus.et",
    phone: "+251 11 551 2288",
    website: "https://selambus.et",
    address: "Meskel Square, Behind Stadium, Kirkos Subcity",
    city: "Addis Ababa",
    description:
      "Ethiopia's pioneer luxury cross-country passenger transport corporation operating high-standard Scania and Yutong express coaches across 12 federal highways.",
    contactPerson: {
      fullName: "Tewodros Kassahun",
      role: "Chief Operating Officer",
      phone: "+251 91 144 5566",
      email: "tewodros.k@selambus.et",
    },
    payoutAccount: {
      bankName: "Commercial Bank of Ethiopia (CBE)",
      accountNumber: "1000189429184",
      accountHolder: "Selam Bus Line S.C. Operational",
    },
    stats: {
      totalRevenue: 482500,
      grossSales: 507895,
      platformCommission: 25395,
      netPayout: 457100,
      availableBalance: 124500,
      totalBookings: 1428,
      totalTicketsSold: 2850,
      activeServices: 14,
      pendingBookings: 18,
      availableSeats: 640,
    },
  },

  busRoutes: [
    {
      id: "rt-1",
      origin: "Addis Ababa",
      destination: "Hawassa",
      boardingStation: "Autobus Tera Gate 3",
      dropoffStation: "Hawassa Main Piazza",
      departureTime: "06:00 AM",
      arrivalTime: "10:30 AM",
      duration: "4h 30m",
      operatingDays: "Daily (Every 2 Hours)",
      fare: 650,
      status: "ACTIVE",
      busType: "Scania VIP Luxury Coach",
      dailyTrips: 8,
    },
    {
      id: "rt-2",
      origin: "Addis Ababa",
      destination: "Bahir Dar",
      boardingStation: "Lamberet Terminal Gate 1",
      dropoffStation: "Bahir Dar Stadium Station",
      departureTime: "05:30 AM",
      arrivalTime: "02:45 PM",
      duration: "9h 15m",
      operatingDays: "Daily (Morning Express)",
      fare: 950,
      status: "ACTIVE",
      busType: "Yutong High Deck VIP",
      dailyTrips: 6,
    },
    {
      id: "rt-3",
      origin: "Addis Ababa",
      destination: "Dire Dawa",
      boardingStation: "Kality Cross-Country Gate 4",
      dropoffStation: "Dire Dawa Ashewa Station",
      departureTime: "06:30 AM",
      arrivalTime: "02:15 PM",
      duration: "7h 45m",
      operatingDays: "Mon, Wed, Fri, Sun",
      fare: 850,
      status: "ACTIVE",
      busType: "Mercedes Benz Turismo",
      dailyTrips: 4,
    },
    {
      id: "rt-4",
      origin: "Addis Ababa",
      destination: "Gondar",
      boardingStation: "Lamberet Terminal Gate 2",
      dropoffStation: "Gondar Arada Central",
      departureTime: "05:00 AM",
      arrivalTime: "05:30 PM",
      duration: "12h 30m",
      operatingDays: "Daily Morning",
      fare: 1200,
      status: "ACTIVE",
      busType: "Scania King Long Coach",
      dailyTrips: 3,
    },
    {
      id: "rt-5",
      origin: "Addis Ababa",
      destination: "Jimma",
      boardingStation: "Autobus Tera Gate 7",
      dropoffStation: "Jimma Hirmata Station",
      departureTime: "07:00 AM",
      arrivalTime: "01:30 PM",
      duration: "6h 30m",
      operatingDays: "Daily",
      fare: 700,
      status: "ACTIVE",
      busType: "Yutong Comfort Class",
      dailyTrips: 5,
    },
  ],

  busSchedules: [
    {
      id: "sch-1",
      routeId: "rt-1",
      routeTitle: "Addis Ababa → Hawassa Express",
      busPlateNumber: "ET-3-89412-AA",
      busType: "Scania VIP (48 Seats)",
      departureDate: "2026-11-15",
      departureTime: "06:00 AM",
      totalSeats: 48,
      availableSeats: 8,
      driverName: "Kassahun Tilahun",
      driverPhone: "+251 91 888 1234",
      status: "SCHEDULED",
    },
    {
      id: "sch-2",
      routeId: "rt-1",
      routeTitle: "Addis Ababa → Hawassa Afternoon",
      busPlateNumber: "ET-3-92144-AA",
      busType: "Scania VIP (48 Seats)",
      departureDate: "2026-11-15",
      departureTime: "01:00 PM",
      totalSeats: 48,
      availableSeats: 22,
      driverName: "Girma Wolde",
      driverPhone: "+251 92 777 5678",
      status: "SCHEDULED",
    },
    {
      id: "sch-3",
      routeId: "rt-2",
      routeTitle: "Addis Ababa → Bahir Dar Morning",
      busPlateNumber: "ET-3-77291-AA",
      busType: "Yutong High Deck (44 Seats)",
      departureDate: "2026-11-15",
      departureTime: "05:30 AM",
      totalSeats: 44,
      availableSeats: 4,
      driverName: "Mulugeta Haile",
      driverPhone: "+251 93 444 9900",
      status: "BOARDING",
    },
    {
      id: "sch-4",
      routeId: "rt-3",
      routeTitle: "Addis Ababa → Dire Dawa Express",
      busPlateNumber: "ET-3-63102-AA",
      busType: "Mercedes Benz Turismo (50 Seats)",
      departureDate: "2026-11-15",
      departureTime: "06:30 AM",
      totalSeats: 50,
      availableSeats: 16,
      driverName: "Bekele Megersa",
      driverPhone: "+251 94 333 1122",
      status: "SCHEDULED",
    },
  ],

  movieShowtimes: [
    {
      id: "sh-1",
      movieTitle: "Gladiator II: Ethiopian Premiere",
      genre: "Historical Action / Drama",
      duration: "2h 28m",
      rating: "PG-13",
      hallName: "Hall 1 (Century Cinema Megaplex)",
      screenFormat: "4K Laser Dolby Atmos",
      date: "2026-11-15",
      time: "02:30 PM",
      price: 280,
      vipPrice: 380,
      totalSeats: 120,
      bookedSeats: 88,
      status: "ACTIVE",
    },
    {
      id: "sh-2",
      movieTitle: "Gladiator II: Prime Evening Screening",
      genre: "Historical Action / Drama",
      duration: "2h 28m",
      rating: "PG-13",
      hallName: "Hall 1 (Century Cinema Megaplex)",
      screenFormat: "4K Laser Dolby Atmos",
      date: "2026-11-15",
      time: "05:30 PM",
      price: 320,
      vipPrice: 450,
      totalSeats: 120,
      bookedSeats: 114,
      status: "ACTIVE",
    },
    {
      id: "sh-3",
      movieTitle: "Mufasa: The Lion King",
      genre: "Animation / Adventure / Family",
      duration: "1h 58m",
      rating: "PG",
      hallName: "Hall 2 (Edna Mall Cinema)",
      screenFormat: "RealD 3D Surround",
      date: "2026-11-15",
      time: "04:00 PM",
      price: 260,
      vipPrice: 350,
      totalSeats: 96,
      bookedSeats: 62,
      status: "ACTIVE",
    },
  ],

  staffMembers: [
    {
      id: "st-1",
      fullName: "Almaz Kebede",
      email: "almaz.k@selambus.et",
      phone: "+251 91 199 8877",
      role: "MANAGER",
      assignedStation: "Autobus Tera Central Dispatch",
      status: "ACTIVE",
      scannedTicketsCount: 4210,
      lastActive: "10 mins ago",
      dateAdded: "2025-03-12",
    },
    {
      id: "st-2",
      fullName: "Yared Tefera",
      email: "yared.t@selambus.et",
      phone: "+251 92 233 4455",
      role: "INSPECTOR",
      assignedStation: "Autobus Tera Gate 3 (Hawassa Gate)",
      status: "ACTIVE",
      scannedTicketsCount: 1845,
      lastActive: "Just now",
      dateAdded: "2025-06-01",
    },
    {
      id: "st-3",
      fullName: "Mesfin Alemu",
      email: "mesfin.a@selambus.et",
      phone: "+251 93 344 5566",
      role: "INSPECTOR",
      assignedStation: "Lamberet Gate 1 (Bahir Dar Gate)",
      status: "ACTIVE",
      scannedTicketsCount: 1420,
      lastActive: "25 mins ago",
      dateAdded: "2025-08-15",
    },
    {
      id: "st-4",
      fullName: "Hanna Worku",
      email: "hanna.w@selambus.et",
      phone: "+251 94 455 6677",
      role: "DISPATCHER",
      assignedStation: "Headquarters Operations Desk",
      status: "ACTIVE",
      scannedTicketsCount: 890,
      lastActive: "1 hour ago",
      dateAdded: "2026-01-10",
    },
    {
      id: "st-5",
      fullName: "Desta Hailu",
      email: "desta.h@selambus.et",
      phone: "+251 95 566 7788",
      role: "CASHIER",
      assignedStation: "Ticket Sales Counter 2",
      status: "ACTIVE",
      scannedTicketsCount: 310,
      lastActive: "3 hours ago",
      dateAdded: "2026-02-20",
    },
  ],

  refunds: [
    {
      id: "ref-1",
      bookingReference: "TH-BUS-7741",
      customerName: "Dawit Mengistu",
      serviceTitle: "Addis Ababa to Hawassa Express",
      category: "BUS",
      requestedAmount: 650,
      reason: "Trip rescheduled due to emergency family travel change",
      requestDate: "2026-11-02",
      status: "PENDING",
    },
    {
      id: "ref-2",
      bookingReference: "TH-SPT-3910",
      customerName: "Marta Solomon",
      serviceTitle: "National Basketball League Finals: Game 5",
      category: "SPORTS",
      requestedAmount: 450,
      reason: "Duplicate seat booking by family member",
      requestDate: "2026-11-01",
      status: "PENDING",
    },
    {
      id: "ref-3",
      bookingReference: "TH-EVT-1094",
      customerName: "Robel Assefa",
      serviceTitle: "Addis International Jazz & Afrobeat Festival",
      category: "EVENT",
      requestedAmount: 850,
      reason: "Customer requested cancellation within 48h window",
      requestDate: "2026-10-30",
      status: "APPROVED",
    },
  ],

  notifications: [
    {
      id: "pnot-1",
      title: "New Group Booking Confirmed",
      message: "Customer 'Abebe Bekele' booked 4 seats on Addis → Hawassa (06:00 AM). Total: 3,024 ETB via Telebirr.",
      type: "BOOKING",
      createdAt: "12 mins ago",
      isRead: false,
      linkHref: "/provider/bookings",
    },
    {
      id: "pnot-2",
      title: "Low Seat Inventory Alert",
      message: "Addis → Bahir Dar Morning Express has only 4 seats remaining for Nov 15 departure.",
      type: "INVENTORY",
      createdAt: "45 mins ago",
      isRead: false,
      linkHref: "/provider/inventory",
    },
    {
      id: "pnot-3",
      title: "Weekly Payout Transferred",
      message: "124,500 ETB successfully deposited to Commercial Bank of Ethiopia Account (***29184).",
      type: "PAYMENT",
      createdAt: "3 hours ago",
      isRead: true,
      linkHref: "/provider/payments",
    },
    {
      id: "pnot-4",
      title: "Gate Inspector Activity",
      message: "Inspector Yared Tefera checked in 42 passengers at Autobus Tera Gate 3.",
      type: "INSPECTOR",
      createdAt: "5 hours ago",
      isRead: true,
      linkHref: "/provider/staff",
    },
  ],

  updateOrganization: (data) =>
    set((state) => ({
      organization: { ...state.organization, ...data },
    })),

  toggleApprovalStatus: (status) =>
    set((state) => ({
      organization: { ...state.organization, approvalStatus: status },
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
}));

