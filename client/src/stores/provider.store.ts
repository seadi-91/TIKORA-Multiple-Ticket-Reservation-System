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

const getInitialOrgMeta = (cat: TicketCategory) => {
  switch (cat) {
    case "CINEMA":
      return {
        name: "Century Cinema Addis",
        legalName: "Century Cinema & Entertainment PLC",
        description: "Premier digital cinema and multiplex screening theatre operating modern Dolby Atmos and laser projection halls.",
      };
    case "EVENT":
      return {
        name: "Addis Live Events & Concerts",
        legalName: "Addis Live Entertainment & Festival SC",
        description: "Official event promoter and live festival management company organizing cultural and music concerts across Millennium Hall.",
      };
    case "SPORTS":
      return {
        name: "St. George Stadium Club",
        legalName: "St. George Football & Sports Club Association",
        description: "Official sports franchise and stadium matchday pass distributor for Ethiopian Premier League and regional tournament derbies.",
      };
    default:
      return {
        name: "Selam Bus Lines S.C.",
        legalName: "Selam Bus Line Share Company",
        description: "Ethiopia's pioneer luxury cross-country passenger transport corporation operating high-standard Scania and Yutong express coaches across 12 federal highways.",
      };
  }
};

const initialOrgMeta = getInitialOrgMeta(initialCat);

export const getInitialStaffForCategory = (cat: TicketCategory): ProviderStaffMember[] => {
  switch (cat) {
    case "CINEMA":
      return [
        {
          id: "st-cnm-1",
          fullName: "Selamawit Tadesse",
          email: "selamawit.t@centurycinema.et",
          phone: "+251 91 199 4433",
          role: "MANAGER",
          assignedStation: "Century Megaplex Box Office Management",
          status: "ACTIVE",
          scannedTicketsCount: 3940,
          lastActive: "12 mins ago",
          dateAdded: "2025-02-10",
        },
        {
          id: "st-cnm-2",
          fullName: "Biruk Girma",
          email: "biruk.g@centurycinema.et",
          phone: "+251 92 233 8899",
          role: "INSPECTOR",
          assignedStation: "Hall 1 (VIP Laser Dolby Atmos) Scanner",
          status: "ACTIVE",
          scannedTicketsCount: 2150,
          lastActive: "Just now",
          dateAdded: "2025-05-18",
        },
        {
          id: "st-cnm-3",
          fullName: "Bethelhem Assefa",
          email: "bethelhem.a@centurycinema.et",
          phone: "+251 93 344 1122",
          role: "INSPECTOR",
          assignedStation: "Hall 2 (RealD 3D Surround) Scanner",
          status: "ACTIVE",
          scannedTicketsCount: 1820,
          lastActive: "18 mins ago",
          dateAdded: "2025-08-01",
        },
        {
          id: "st-cnm-4",
          fullName: "Dawit Zewdu",
          email: "dawit.z@centurycinema.et",
          phone: "+251 94 455 3344",
          role: "DISPATCHER",
          assignedStation: "Digital Projection & Hall Turnover Control",
          status: "ACTIVE",
          scannedTicketsCount: 640,
          lastActive: "45 mins ago",
          dateAdded: "2026-01-14",
        },
        {
          id: "st-cnm-5",
          fullName: "Mahlet Bekele",
          email: "mahlet.b@centurycinema.et",
          phone: "+251 95 566 5566",
          role: "CASHIER",
          assignedStation: "Movie Concessions & Box Office Counter",
          status: "ACTIVE",
          scannedTicketsCount: 520,
          lastActive: "2 hours ago",
          dateAdded: "2026-02-19",
        },
      ];
    case "EVENT":
      return [
        {
          id: "st-evt-1",
          fullName: "Natnael Haile",
          email: "natnael.h@addislive.et",
          phone: "+251 91 188 7766",
          role: "MANAGER",
          assignedStation: "Millennium Hall Festival Operations",
          status: "ACTIVE",
          scannedTicketsCount: 5120,
          lastActive: "8 mins ago",
          dateAdded: "2025-01-15",
        },
        {
          id: "st-evt-2",
          fullName: "Ruth Mengistu",
          email: "ruth.m@addislive.et",
          phone: "+251 92 244 5511",
          role: "INSPECTOR",
          assignedStation: "VIP Red Carpet Turnstile Scanner",
          status: "ACTIVE",
          scannedTicketsCount: 3410,
          lastActive: "Just now",
          dateAdded: "2025-04-20",
        },
        {
          id: "st-evt-3",
          fullName: "Ermias Tesfaye",
          email: "ermias.t@addislive.et",
          phone: "+251 93 355 6622",
          role: "INSPECTOR",
          assignedStation: "General Admission Turnstile A Scanner",
          status: "ACTIVE",
          scannedTicketsCount: 2890,
          lastActive: "30 mins ago",
          dateAdded: "2025-07-12",
        },
        {
          id: "st-evt-4",
          fullName: "Senait Kebede",
          email: "senait.k@addislive.et",
          phone: "+251 94 466 7733",
          role: "DISPATCHER",
          assignedStation: "Stage Credential & Wristband Dispatch",
          status: "ACTIVE",
          scannedTicketsCount: 980,
          lastActive: "1 hour ago",
          dateAdded: "2026-01-08",
        },
        {
          id: "st-evt-5",
          fullName: "Henok Alemayehu",
          email: "henok.a@addislive.et",
          phone: "+251 95 577 8844",
          role: "CASHIER",
          assignedStation: "Festival Entry Box Office Counter",
          status: "ACTIVE",
          scannedTicketsCount: 740,
          lastActive: "3 hours ago",
          dateAdded: "2026-02-15",
        },
      ];
    case "SPORTS":
      return [
        {
          id: "st-spt-1",
          fullName: "Getachew Reda",
          email: "getachew.r@stgeorgesports.et",
          phone: "+251 91 177 3344",
          role: "MANAGER",
          assignedStation: "Addis Ababa Stadium Matchday Operations",
          status: "ACTIVE",
          scannedTicketsCount: 6340,
          lastActive: "5 mins ago",
          dateAdded: "2025-02-01",
        },
        {
          id: "st-spt-2",
          fullName: "Yohannes Wolde",
          email: "yohannes.w@stgeorgesports.et",
          phone: "+251 92 255 6677",
          role: "INSPECTOR",
          assignedStation: "Stadium Gate 4 (Grandstand VIP) Scanner",
          status: "ACTIVE",
          scannedTicketsCount: 4210,
          lastActive: "Just now",
          dateAdded: "2025-05-10",
        },
        {
          id: "st-spt-3",
          fullName: "Tigist Melaku",
          email: "tigist.m@stgeorgesports.et",
          phone: "+251 93 366 7788",
          role: "INSPECTOR",
          assignedStation: "Gate 1 (Bleachers Turnstile) Scanner",
          status: "ACTIVE",
          scannedTicketsCount: 3650,
          lastActive: "20 mins ago",
          dateAdded: "2025-08-22",
        },
        {
          id: "st-spt-4",
          fullName: "Samson Bekele",
          email: "samson.b@stgeorgesports.et",
          phone: "+251 94 477 8899",
          role: "DISPATCHER",
          assignedStation: "Tribune Crowd Safety & Pitch Security",
          status: "ACTIVE",
          scannedTicketsCount: 1120,
          lastActive: "2 hours ago",
          dateAdded: "2026-01-20",
        },
        {
          id: "st-spt-5",
          fullName: "Frehiwot Desta",
          email: "frehiwot.d@stgeorgesports.et",
          phone: "+251 95 588 9900",
          role: "CASHIER",
          assignedStation: "Matchday Ticket Kiosk 1",
          status: "ACTIVE",
          scannedTicketsCount: 890,
          lastActive: "4 hours ago",
          dateAdded: "2026-02-25",
        },
      ];
    default:
      return [
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
      ];
  }
};

export const getInitialRefundsForCategory = (cat: TicketCategory): ProviderRefundItem[] => {
  switch (cat) {
    case "CINEMA":
      return [
        {
          id: "ref-cnm-1",
          bookingReference: "TH-CNM-4419",
          customerName: "Meron Worku",
          serviceTitle: "Avatar: The Way of Water 3D Dolby",
          category: "CINEMA",
          requestedAmount: 500,
          reason: "Customer booked wrong screening time session",
          requestDate: "2026-11-03",
          status: "PENDING",
        },
        {
          id: "ref-cnm-2",
          bookingReference: "TH-CNM-5520",
          customerName: "Kassahun Desta",
          serviceTitle: "Gladiator II: Ethiopian Premiere",
          category: "CINEMA",
          requestedAmount: 380,
          reason: "Showtime conflict with work schedule",
          requestDate: "2026-11-01",
          status: "APPROVED",
        },
      ];
    case "EVENT":
      return [
        {
          id: "ref-evt-1",
          bookingReference: "TH-EVT-1094",
          customerName: "Robel Assefa",
          serviceTitle: "Addis International Jazz & Afrobeat Festival",
          category: "EVENT",
          requestedAmount: 850,
          reason: "Customer requested cancellation within 48h refund policy window",
          requestDate: "2026-10-30",
          status: "APPROVED",
        },
        {
          id: "ref-evt-2",
          bookingReference: "TH-EVT-9921",
          customerName: "Alazar Mengistu",
          serviceTitle: "Teddy Afro New Year Concert Tour",
          category: "EVENT",
          requestedAmount: 1200,
          reason: "Medical emergency travel cancellation",
          requestDate: "2026-11-02",
          status: "PENDING",
        },
      ];
    case "SPORTS":
      return [
        {
          id: "ref-spt-1",
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
          id: "ref-spt-2",
          bookingReference: "TH-SPT-8812",
          customerName: "Dawit Wolde",
          serviceTitle: "Ethiopian Premier League Derby: St. George vs Coffee",
          category: "SPORTS",
          requestedAmount: 400,
          reason: "Purchased incorrect stadium entrance gate ticket",
          requestDate: "2026-11-02",
          status: "APPROVED",
        },
      ];
    default:
      return [
        {
          id: "ref-1",
          bookingReference: "TH-BUS-9021",
          customerName: "Solomon Getachew",
          serviceTitle: "Addis Ababa → Hawassa (06:00 AM)",
          category: "BUS",
          requestedAmount: 650,
          reason: "Trip rescheduled due to emergency family travel change",
          requestDate: "2026-11-02",
          status: "PENDING",
        },
        {
          id: "ref-2",
          bookingReference: "TH-BUS-8871",
          customerName: "Kassahun Desta",
          serviceTitle: "Addis Ababa to Bahir Dar Lake Cruiser",
          category: "BUS",
          requestedAmount: 950,
          reason: "Passenger missed morning express connection",
          requestDate: "2026-11-01",
          status: "APPROVED",
        },
      ];
  }
};

export const getInitialNotificationsForCategory = (cat: TicketCategory): ProviderNotification[] => {
  switch (cat) {
    case "CINEMA":
      return [
        {
          id: "pnot-cnm-1",
          title: "VIP Atmos Screening Booking",
          message: "Customer 'Dawit Mengistu' booked 2 VIP Laser Atmos seats for Avatar 3D. Total: 900 ETB via Telebirr.",
          type: "BOOKING",
          createdAt: "10 mins ago",
          isRead: false,
          linkHref: "/provider/bookings",
        },
        {
          id: "pnot-cnm-2",
          title: "Hall 1 Low Seat Availability",
          message: "Gladiator II 05:30 PM prime screening has only 6 seats remaining in Hall 1.",
          type: "INVENTORY",
          createdAt: "35 mins ago",
          isRead: false,
          linkHref: "/provider/inventory",
        },
        {
          id: "pnot-cnm-3",
          title: "Box Office Payout Deposited",
          message: "98,000 ETB successfully deposited to Commercial Bank of Ethiopia Account (***29184).",
          type: "PAYMENT",
          createdAt: "2 hours ago",
          isRead: true,
          linkHref: "/provider/payments",
        },
        {
          id: "pnot-cnm-4",
          title: "Auditorium Usher Scan Activity",
          message: "Inspector Biruk Girma checked in 84 moviegoers at Hall 1 VIP Gate Scanner.",
          type: "INSPECTOR",
          createdAt: "4 hours ago",
          isRead: true,
          linkHref: "/provider/staff",
        },
      ];
    case "EVENT":
      return [
        {
          id: "pnot-evt-1",
          title: "VIP Lounge Table Confirmed",
          message: "Customer 'Alazar Mengistu' booked VIP Table for Addis Jazz Festival. Total: 3,944 ETB via Telebirr.",
          type: "BOOKING",
          createdAt: "8 mins ago",
          isRead: false,
          linkHref: "/provider/bookings",
        },
        {
          id: "pnot-evt-2",
          title: "Early Bird Festival Passes Low",
          message: "Less than 25 Early Bird passes remaining for Millennium Hall Afrobeat Night.",
          type: "INVENTORY",
          createdAt: "50 mins ago",
          isRead: false,
          linkHref: "/provider/inventory",
        },
        {
          id: "pnot-evt-3",
          title: "Festival Settlement Deposited",
          message: "185,000 ETB successfully transferred to Commercial Bank of Ethiopia Account (***29184).",
          type: "PAYMENT",
          createdAt: "3 hours ago",
          isRead: true,
          linkHref: "/provider/payments",
        },
        {
          id: "pnot-evt-4",
          title: "Turnstile Gate Clearance Rate",
          message: "Turnstile Scanner Ruth Mengistu cleared 340 attendees at VIP Red Carpet.",
          type: "INSPECTOR",
          createdAt: "5 hours ago",
          isRead: true,
          linkHref: "/provider/staff",
        },
      ];
    case "SPORTS":
      return [
        {
          id: "pnot-spt-1",
          title: "Grandstand VIP Derby Passes",
          message: "Customer 'Marta Solomon' booked 2 Covered Tribune tickets for Derby. Total: 1,600 ETB via CBE Birr.",
          type: "BOOKING",
          createdAt: "15 mins ago",
          isRead: false,
          linkHref: "/provider/bookings",
        },
        {
          id: "pnot-spt-2",
          title: "Gate 4 Grandstand Inventory Low",
          message: "Covered VIP Tribune Gate 4 has only 18 tickets remaining for Matchday 14.",
          type: "INVENTORY",
          createdAt: "40 mins ago",
          isRead: false,
          linkHref: "/provider/inventory",
        },
        {
          id: "pnot-spt-3",
          title: "Derby Gate Payout Transferred",
          message: "142,000 ETB deposited to Commercial Bank of Ethiopia Account (***29184).",
          type: "PAYMENT",
          createdAt: "2 hours ago",
          isRead: true,
          linkHref: "/provider/payments",
        },
        {
          id: "pnot-spt-4",
          title: "Stadium Turnstile Gate Scans",
          message: "Turnstile Scanner Yohannes Wolde verified 420 passes at Stadium Gate 4.",
          type: "INSPECTOR",
          createdAt: "4 hours ago",
          isRead: true,
          linkHref: "/provider/staff",
        },
      ];
    default:
      return [
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
      ];
  }
};

export const getInitialStatsForCategory = (cat: TicketCategory) => {
  switch (cat) {
    case "CINEMA":
      return {
        totalRevenue: 435000,
        grossSales: 457895,
        platformCommission: 22895,
        netPayout: 412100,
        availableBalance: 98000,
        totalBookings: 1250,
        totalTicketsSold: 2600,
        activeServices: 8,
        pendingBookings: 12,
        availableSeats: 320,
      };
    case "EVENT":
      return {
        totalRevenue: 680000,
        grossSales: 715789,
        platformCommission: 35789,
        netPayout: 644211,
        availableBalance: 185000,
        totalBookings: 980,
        totalTicketsSold: 3100,
        activeServices: 4,
        pendingBookings: 24,
        availableSeats: 1200,
      };
    case "SPORTS":
      return {
        totalRevenue: 520000,
        grossSales: 547368,
        platformCommission: 27368,
        netPayout: 492632,
        availableBalance: 142000,
        totalBookings: 1650,
        totalTicketsSold: 4200,
        activeServices: 6,
        pendingBookings: 30,
        availableSeats: 1800,
      };
    case "BUS":
    default:
      return {
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
      };
  }
};

export const useProviderStore = create<ProviderStoreState>((set) => ({
  organization: {
    id: "org-selam-01",
    name: initialOrgMeta.name,
    legalName: initialOrgMeta.legalName,
    category: initialCat,
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
    description: initialOrgMeta.description,
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
    stats: getInitialStatsForCategory(initialCat),
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

  staffMembers: getInitialStaffForCategory(initialCat),

  refunds: getInitialRefundsForCategory(initialCat),

  notifications: getInitialNotificationsForCategory(initialCat),

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

  setOrganizationCategory: (category: TicketCategory) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("tikora_provider_category", category);
      } catch (err) {
        console.warn("Storage error for provider category:", err);
      }
    }

    set((state) => {
      let name = state.organization.name;
      let legalName = state.organization.legalName;
      let description = state.organization.description;

      if (category === "CINEMA") {
        name = "Century Cinema Addis";
        legalName = "Century Cinema & Entertainment PLC";
        description = "Premier digital cinema and multiplex screening theatre operating modern Dolby Atmos and laser projection halls.";
      } else if (category === "EVENT") {
        name = "Addis Live Events & Concerts";
        legalName = "Addis Live Entertainment & Festival SC";
        description = "Official event promoter and live festival management company organizing cultural and music concerts across Millennium Hall.";
      } else if (category === "SPORTS") {
        name = "St. George Stadium Club";
        legalName = "St. George Football & Sports Club Association";
        description = "Official sports franchise and stadium matchday pass distributor for Ethiopian Premier League and regional tournament derbies.";
      } else if (category === "BUS") {
        name = "Selam Bus Lines S.C.";
        legalName = "Selam Bus Line Share Company";
        description = "Ethiopia's pioneer luxury cross-country passenger transport corporation operating high-standard Scania and Yutong express coaches across 12 federal highways.";
      }

      return {
        organization: {
          ...state.organization,
          category,
          name,
          legalName,
          description,
          stats: getInitialStatsForCategory(category),
        },
        staffMembers: getInitialStaffForCategory(category),
        refunds: getInitialRefundsForCategory(category),
        notifications: getInitialNotificationsForCategory(category),
      };
    });
  },
}));

