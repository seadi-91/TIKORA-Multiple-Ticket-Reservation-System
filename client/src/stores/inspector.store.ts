"use client";

import { create } from "zustand";
import { TicketCategory } from "@/types/ticket.types";

export interface InspectorProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  inspectorId: string;
  category: TicketCategory;
  organizationId: string;
  organizationName: string;
  assignedStation: string;
  terminalGate: string;
  status: "ACTIVE" | "OFF_DUTY" | "SUSPENDED";
  dateJoined: string;
  deviceInfo: {
    deviceModel: string;
    scannerVersion: string;
    lastSync: string;
  };
}

export interface InspectorAssignment {
  id: string;
  serviceId: string;
  title: string;
  category: TicketCategory;
  venueOrTerminal: string;
  gate: string;
  scheduledDate: string;
  scheduledTime: string;
  coachOrHall: string;
  driverOrLead?: string;
  driverPhone?: string;
  totalSeats: number;
  scannedSeats: number;
  status: "ACTIVE_NOW" | "UPCOMING" | "COMPLETED";
  specialInstructions: string;
  validReferencePrefix: string;
}

export type VerificationResultType =
  | "VALID"
  | "INVALID"
  | "ALREADY_USED"
  | "WRONG_ASSIGNMENT"
  | "EXPIRED";

export interface VerificationLogItem {
  id: string;
  ticketReference: string;
  passengerName: string;
  phone?: string;
  seatNumber?: string;
  serviceTitle: string;
  category: TicketCategory;
  verificationDate: string;
  verificationTime: string;
  location: string;
  result: VerificationResultType;
  failureReason?: string;
  previousScannedAt?: string;
}

export interface InspectorNotification {
  id: string;
  title: string;
  message: string;
  type: "ASSIGNMENT" | "GATE_CHANGE" | "ALERT" | "PROVIDER_MSG";
  createdAt: string;
  isRead: boolean;
  linkHref?: string;
}

interface VerificationOutcome {
  result: VerificationResultType;
  ticketReference: string;
  passengerName: string;
  seatNumber?: string;
  serviceTitle: string;
  category: TicketCategory;
  verifiedAt: string;
  message: string;
  details?: {
    origin?: string;
    destination?: string;
    tier?: string;
    gate?: string;
    previouslyScannedAt?: string;
    expectedService?: string;
  };
}

interface SectorDataset {
  profile: Partial<InspectorProfile>;
  assignments: InspectorAssignment[];
  history: VerificationLogItem[];
  notifications: InspectorNotification[];
  samplePasses: Record<string, { name: string; seat: string; phone: string; tier: string }>;
}

// -------------------------------------------------------------
// SECTOR DATASETS: 100% Dedicated per Provider Category
// -------------------------------------------------------------
export const SECTOR_DATASETS: Record<TicketCategory, SectorDataset> = {
  // ==================== CINEMA SECTOR ====================
  CINEMA: {
    profile: {
      id: "stf-cnm-01",
      fullName: "Biruk Girma",
      email: "biruk.g@centurycinema.et",
      phone: "+251 92 233 8899",
      role: "Cinema Hall Usher & QR Scanner",
      inspectorId: "INS-CNM-041",
      category: "CINEMA",
      organizationId: "org-cnm-01",
      organizationName: "Century Cinema Addis",
      assignedStation: "Auditorium Hall 1 (VIP Laser Dolby Atmos)",
      terminalGate: "Hall 1 Entrance Gate A",
      status: "ACTIVE",
      dateJoined: "May 18, 2025",
    },
    assignments: [
      {
        id: "ASN-CNM-01",
        serviceId: "cnm-1",
        title: "Avatar: The Way of Water 3D Dolby Laser",
        category: "CINEMA",
        venueOrTerminal: "Century Cinema Megaplex (Gurd Shola)",
        gate: "Hall 1 Entrance (VIP Laser)",
        scheduledDate: "Today",
        scheduledTime: "06:30 PM",
        coachOrHall: "Auditorium Hall 1 (Dolby Atmos & Laser 4K)",
        driverOrLead: "Projection Lead: Yonas Bekele",
        driverPhone: "+251 91 199 4433",
        totalSeats: 160,
        scannedSeats: 114,
        status: "ACTIVE_NOW",
        specialInstructions:
          "Issue cleaned 3D glasses to each patron. Direct VIP recliner seat holders to Rows D, E & F.",
        validReferencePrefix: "TH-CNM",
      },
      {
        id: "ASN-CNM-02",
        serviceId: "cnm-2",
        title: "Gladiator II IMAX Laser Premiere",
        category: "CINEMA",
        venueOrTerminal: "Century Cinema Megaplex (Gurd Shola)",
        gate: "Hall 2 (IMAX Grand Theatre)",
        scheduledDate: "Today",
        scheduledTime: "09:15 PM",
        coachOrHall: "Auditorium Hall 2 (IMAX Grand Theatre)",
        driverOrLead: "Floor Lead: Selamawit Tadesse",
        driverPhone: "+251 92 233 8899",
        totalSeats: 220,
        scannedSeats: 0,
        status: "UPCOMING",
        specialInstructions:
          "High volume screening. Direct patrons with snack vouchers to the Express Concessions counter.",
        validReferencePrefix: "TH-CNM",
      },
      {
        id: "ASN-CNM-03",
        serviceId: "cnm-3",
        title: "Oppenheimer 70mm Special Screening",
        category: "CINEMA",
        venueOrTerminal: "Century Cinema Megaplex (Gurd Shola)",
        gate: "Hall 1 Entrance Gate A",
        scheduledDate: "Today",
        scheduledTime: "02:00 PM",
        coachOrHall: "Auditorium Hall 1",
        totalSeats: 160,
        scannedSeats: 160,
        status: "COMPLETED",
        specialInstructions: "Matinee screening completed. Hall sanitized.",
        validReferencePrefix: "TH-CNM",
      },
    ],
    history: [
      {
        id: "VLOG-CNM-01",
        ticketReference: "TH-CNM-4419",
        passengerName: "Meron Worku",
        phone: "+251 91 122 3344",
        seatNumber: "H1-VIP-E08",
        serviceTitle: "Avatar: The Way of Water 3D Dolby Laser",
        category: "CINEMA",
        verificationDate: "Today",
        verificationTime: "06:18 PM",
        location: "Hall 1 Entrance (VIP Laser)",
        result: "VALID",
      },
      {
        id: "VLOG-CNM-02",
        ticketReference: "TH-CNM-4420",
        passengerName: "Dawit Tadesse",
        phone: "+251 92 344 5566",
        seatNumber: "H1-VIP-E09",
        serviceTitle: "Avatar: The Way of Water 3D Dolby Laser",
        category: "CINEMA",
        verificationDate: "Today",
        verificationTime: "06:16 PM",
        location: "Hall 1 Entrance (VIP Laser)",
        result: "VALID",
      },
      {
        id: "VLOG-CNM-03",
        ticketReference: "TH-CNM-4419",
        passengerName: "Meron Worku (Duplicate Scan)",
        seatNumber: "H1-VIP-E08",
        serviceTitle: "Avatar: The Way of Water 3D Dolby Laser",
        category: "CINEMA",
        verificationDate: "Today",
        verificationTime: "06:12 PM",
        location: "Hall 1 Entrance (VIP Laser)",
        result: "ALREADY_USED",
        previousScannedAt: "06:18 PM (Hall 1 Entrance)",
        failureReason: "Pass was previously scanned and verified 6 minutes ago.",
      },
      {
        id: "VLOG-CNM-04",
        ticketReference: "TH-BUS-8829",
        passengerName: "Dawit Hailemariam",
        seatNumber: "04A",
        serviceTitle: "Selam Bus Hawassa Express",
        category: "BUS",
        verificationDate: "Today",
        verificationTime: "06:05 PM",
        location: "Hall 1 Entrance (VIP Laser)",
        result: "WRONG_ASSIGNMENT",
        failureReason: "This pass is for Bus Coach departure, not Century Cinema Screening Hall 1.",
      },
    ],
    notifications: [
      {
        id: "NOTIF-CNM-1",
        title: "Auditorium Hall 1 Admitting Patrons",
        message: "Avatar: The Way of Water 3D (06:30 PM showtime) is now open for patron admission at Hall 1.",
        type: "ASSIGNMENT",
        createdAt: "10m ago",
        isRead: false,
        linkHref: "/inspector/scanner",
      },
      {
        id: "NOTIF-CNM-2",
        title: "Gladiator II IMAX Hall Readiness",
        message: "Hall 2 projection system testing completed for tonight's 09:15 PM premiere screening.",
        type: "ALERT",
        createdAt: "1h ago",
        isRead: false,
        linkHref: "/inspector/assigned",
      },
      {
        id: "NOTIF-CNM-3",
        title: "Cinema Management Notice",
        message: "Century Cinema Operations: Ensure all patrons with VIP recliner passes receive complimentary 3D glasses.",
        type: "PROVIDER_MSG",
        createdAt: "1d ago",
        isRead: true,
      },
    ],
    samplePasses: {
      "TH-CNM-4419": { name: "Meron Worku", seat: "H1-VIP-E08", phone: "+251 91 122 3344", tier: "VIP Recliner" },
      "TH-CNM-4420": { name: "Dawit Tadesse", seat: "H1-VIP-E09", phone: "+251 92 344 5566", tier: "VIP Recliner" },
      "TH-CNM-4425": { name: "Bethlehem Haile", seat: "H1-STD-F12", phone: "+251 93 455 6677", tier: "Standard Laser" },
      "TH-CNM-4430": { name: "Yared Tesfaye", seat: "H1-STD-F14", phone: "+251 94 566 7788", tier: "Standard Laser" },
    },
  },

  // ==================== BUS SECTOR ====================
  BUS: {
    profile: {
      id: "stf-bus-01",
      fullName: "Kassahun Girma",
      email: "kassahun.g@selambus.et",
      phone: "+251 91 144 8822",
      role: "Coach Boarding Inspector",
      inspectorId: "INS-BUS-081",
      category: "BUS",
      organizationId: "org-bus-01",
      organizationName: "Selam Bus Lines S.C.",
      assignedStation: "Autobus Tera Central Terminal",
      terminalGate: "Platform Gate 3 (Intercity Express)",
      status: "ACTIVE",
      dateJoined: "March 15, 2026",
    },
    assignments: [
      {
        id: "ASN-BUS-01",
        serviceId: "bus-1",
        title: "Addis Ababa to Hawassa Luxury Express",
        category: "BUS",
        venueOrTerminal: "Autobus Tera Central Terminal",
        gate: "Gate 3 (Intercity Express)",
        scheduledDate: "Today",
        scheduledTime: "06:00 AM",
        coachOrHall: "Scania VIP Luxury Coach (Plate AA-3-48129)",
        driverOrLead: "Driver: Kassahun Girma",
        driverPhone: "+251 91 144 8822",
        totalSeats: 48,
        scannedSeats: 34,
        status: "ACTIVE_NOW",
        specialInstructions:
          "Verify national ID or passport for all adult passengers. Ensure luggage tag stubs match boarding pass references.",
        validReferencePrefix: "TH-BUS",
      },
      {
        id: "ASN-BUS-02",
        serviceId: "bus-2",
        title: "Addis Ababa to Bahir Dar Lake Cruiser",
        category: "BUS",
        venueOrTerminal: "Lamberet Bus Terminal",
        gate: "Gate 1B (Northern Express)",
        scheduledDate: "Tomorrow",
        scheduledTime: "05:30 AM",
        coachOrHall: "Yutong High Deck VIP (Plate AA-3-99120)",
        driverOrLead: "Driver: Mulugeta Tadesse",
        driverPhone: "+251 92 311 0022",
        totalSeats: 46,
        scannedSeats: 0,
        status: "UPCOMING",
        specialInstructions:
          "Cross-verify passenger manifest against electronic manifest. Boarding begins 30 minutes prior to departure.",
        validReferencePrefix: "TH-BUS",
      },
      {
        id: "ASN-BUS-03",
        serviceId: "bus-3",
        title: "Addis Ababa to Adama Fastliner Shuttle",
        category: "BUS",
        venueOrTerminal: "Autobus Tera Gate 3",
        gate: "Gate 3",
        scheduledDate: "Today",
        scheduledTime: "08:00 AM",
        coachOrHall: "Toyota Coaster Deluxe (Plate AA-2-12001)",
        totalSeats: 28,
        scannedSeats: 28,
        status: "COMPLETED",
        specialInstructions: "Boarding finalized. Trip completed.",
        validReferencePrefix: "TH-BUS",
      },
    ],
    history: [
      {
        id: "VLOG-BUS-01",
        ticketReference: "TH-BUS-8829",
        passengerName: "Dawit Hailemariam",
        phone: "+251 91 182 9182",
        seatNumber: "04A (Window)",
        serviceTitle: "Addis Ababa to Hawassa Luxury Express",
        category: "BUS",
        verificationDate: "Today",
        verificationTime: "05:58 AM",
        location: "Autobus Tera Gate 3",
        result: "VALID",
      },
      {
        id: "VLOG-BUS-02",
        ticketReference: "TH-BUS-8830",
        passengerName: "Tigist Alemu",
        phone: "+251 92 344 8811",
        seatNumber: "04B (Aisle)",
        serviceTitle: "Addis Ababa to Hawassa Luxury Express",
        category: "BUS",
        verificationDate: "Today",
        verificationTime: "05:54 AM",
        location: "Autobus Tera Gate 3",
        result: "VALID",
      },
      {
        id: "VLOG-BUS-03",
        ticketReference: "TH-BUS-8829",
        passengerName: "Dawit Hailemariam (Duplicate Scan)",
        seatNumber: "04A",
        serviceTitle: "Addis Ababa to Hawassa Luxury Express",
        category: "BUS",
        verificationDate: "Today",
        verificationTime: "05:50 AM",
        location: "Autobus Tera Gate 3",
        result: "ALREADY_USED",
        previousScannedAt: "05:58 AM (Gate 3)",
        failureReason: "Pass was previously scanned and verified 4 minutes ago.",
      },
      {
        id: "VLOG-BUS-04",
        ticketReference: "TH-CNM-4419",
        passengerName: "Meron Worku",
        seatNumber: "H1-E08",
        serviceTitle: "Avatar: The Way of Water 3D Dolby",
        category: "CINEMA",
        verificationDate: "Today",
        verificationTime: "05:42 AM",
        location: "Autobus Tera Gate 3",
        result: "WRONG_ASSIGNMENT",
        failureReason: "This pass is for Cinema Screening Hall 1, not assigned to Autobus Tera coach boarding.",
      },
    ],
    notifications: [
      {
        id: "NOTIF-BUS-1",
        title: "Active Departure Boarding Now",
        message: "Addis Ababa to Hawassa Luxury Express is currently boarding at Gate 3. Coach Scania Plate AA-3-48129.",
        type: "ASSIGNMENT",
        createdAt: "15m ago",
        isRead: false,
        linkHref: "/inspector/scanner",
      },
      {
        id: "NOTIF-BUS-2",
        title: "Terminal Gate Adjustment",
        message: "Tomorrow's Bahir Dar Lake Cruiser departure shifted from Gate 2 to Gate 1B at Lamberet Terminal.",
        type: "GATE_CHANGE",
        createdAt: "2h ago",
        isRead: false,
        linkHref: "/inspector/assigned",
      },
      {
        id: "NOTIF-BUS-3",
        title: "Provider Operations Notice",
        message: "Selam Bus Operations: All inspectors must ensure passenger luggage tags are inspected before entry.",
        type: "PROVIDER_MSG",
        createdAt: "1d ago",
        isRead: true,
      },
    ],
    samplePasses: {
      "TH-BUS-8829": { name: "Dawit Hailemariam", seat: "04A", phone: "+251 91 182 9182", tier: "VIP Recliner" },
      "TH-BUS-8830": { name: "Tigist Alemu", seat: "04B", phone: "+251 92 344 8811", tier: "VIP Recliner" },
      "TH-BUS-8835": { name: "Yared Tesfaye", seat: "05A", phone: "+251 93 512 0099", tier: "Standard" },
      "TH-BUS-8841": { name: "Bethlehem Assefa", seat: "06A", phone: "+251 91 766 2211", tier: "Standard" },
    },
  },

  // ==================== EVENT SECTOR ====================
  EVENT: {
    profile: {
      id: "stf-evt-01",
      fullName: "Abel Bekele",
      email: "abel.b@addislive.et",
      phone: "+251 91 333 4455",
      role: "Festival Turnstile & VIP Gate Inspector",
      inspectorId: "INS-EVT-019",
      category: "EVENT",
      organizationId: "org-evt-01",
      organizationName: "Addis Live Events & Concerts",
      assignedStation: "Millennium Hall Grounds",
      terminalGate: "Gate 2 (VIP Turnstile A)",
      status: "ACTIVE",
      dateJoined: "January 10, 2026",
    },
    assignments: [
      {
        id: "ASN-EVT-01",
        serviceId: "evt-1",
        title: "Addis International Jazz & Heritage Festival",
        category: "EVENT",
        venueOrTerminal: "Millennium Hall Exhibition Grounds",
        gate: "Gate 2 (VIP Turnstile A)",
        scheduledDate: "Today",
        scheduledTime: "06:00 PM",
        coachOrHall: "Main Concert Pavilion & VIP Garden",
        driverOrLead: "Stage Lead: Alem Events",
        driverPhone: "+251 91 222 3344",
        totalSeats: 500,
        scannedSeats: 290,
        status: "ACTIVE_NOW",
        specialInstructions:
          "Scan wristband voucher QR codes. Issue Gold wristbands for VIP pass holders. Strictly no glass bottles allowed.",
        validReferencePrefix: "TH-EVT",
      },
      {
        id: "ASN-EVT-02",
        serviceId: "evt-2",
        title: "Ethio Afro-Tech Summit & Expo 2026",
        category: "EVENT",
        venueOrTerminal: "Millennium Hall Main Auditorium",
        gate: "Gate 1 (Delegate Access)",
        scheduledDate: "Tomorrow",
        scheduledTime: "09:00 AM",
        coachOrHall: "Hall 3 Technology Pavilion",
        driverOrLead: "Summit Coordinator: Henok M.",
        driverPhone: "+251 91 555 6677",
        totalSeats: 800,
        scannedSeats: 0,
        status: "UPCOMING",
        specialInstructions: "Issue lanyard badges upon QR validation.",
        validReferencePrefix: "TH-EVT",
      },
    ],
    history: [
      {
        id: "VLOG-EVT-01",
        ticketReference: "TH-EVT-1001",
        passengerName: "Natnael Shimelis",
        phone: "+251 91 444 5566",
        seatNumber: "VIP Table 4",
        serviceTitle: "Addis International Jazz Festival",
        category: "EVENT",
        verificationDate: "Today",
        verificationTime: "05:45 PM",
        location: "Gate 2 (VIP Turnstile A)",
        result: "VALID",
      },
      {
        id: "VLOG-EVT-02",
        ticketReference: "TH-EVT-1002",
        passengerName: "Hanna Daniel",
        phone: "+251 92 555 6677",
        seatNumber: "General Access",
        serviceTitle: "Addis International Jazz Festival",
        category: "EVENT",
        verificationDate: "Today",
        verificationTime: "05:40 PM",
        location: "Gate 2 (VIP Turnstile A)",
        result: "VALID",
      },
    ],
    notifications: [
      {
        id: "NOTIF-EVT-1",
        title: "Festival Gate 2 Open",
        message: "Turnstiles are live for early VIP entrance at Millennium Hall.",
        type: "ASSIGNMENT",
        createdAt: "20m ago",
        isRead: false,
        linkHref: "/inspector/scanner",
      },
    ],
    samplePasses: {
      "TH-EVT-1001": { name: "Natnael Shimelis", seat: "VIP Table 4", phone: "+251 91 444 5566", tier: "VIP Lounge" },
      "TH-EVT-1002": { name: "Hanna Daniel", seat: "General Access", phone: "+251 92 555 6677", tier: "Regular Pass" },
    },
  },

  // ==================== SPORTS SECTOR ====================
  SPORTS: {
    profile: {
      id: "stf-spt-01",
      fullName: "Tewodros Kassaye",
      email: "tewodros.k@stgeorgefc.et",
      phone: "+251 91 777 8899",
      role: "Matchday Stadium Gate Inspector",
      inspectorId: "INS-SPT-007",
      category: "SPORTS",
      organizationId: "org-spt-01",
      organizationName: "St. George Stadium Club",
      assignedStation: "Addis Ababa Stadium",
      terminalGate: "Gate 4 (VIP Tribune & West Stand)",
      status: "ACTIVE",
      dateJoined: "February 20, 2026",
    },
    assignments: [
      {
        id: "ASN-SPT-01",
        serviceId: "spt-1",
        title: "Sheger Derby: St. George SC vs Ethiopia Coffee SC",
        category: "SPORTS",
        venueOrTerminal: "Addis Ababa Stadium",
        gate: "Gate 4 (VIP Tribune & West Stand)",
        scheduledDate: "Today",
        scheduledTime: "04:00 PM",
        coachOrHall: "Tribune West VIP Seating",
        driverOrLead: "Match Commissioner: Girma W.",
        driverPhone: "+251 91 888 9900",
        totalSeats: 1200,
        scannedSeats: 840,
        status: "ACTIVE_NOW",
        specialInstructions:
          "Strict electronic turnstile pass check. Direct VIP pass holders to Elevator 2.",
        validReferencePrefix: "TH-SPT",
      },
      {
        id: "ASN-SPT-02",
        serviceId: "spt-2",
        title: "Bahir Dar City FC vs Fasil Kenema FC",
        category: "SPORTS",
        venueOrTerminal: "Bahir Dar International Stadium",
        gate: "Gate 2 (East Bleachers)",
        scheduledDate: "Tomorrow",
        scheduledTime: "03:00 PM",
        coachOrHall: "East Bleachers Tier 1",
        totalSeats: 3500,
        scannedSeats: 0,
        status: "UPCOMING",
        specialInstructions: "Inspect bag restrictions at perimeter gates.",
        validReferencePrefix: "TH-SPT",
      },
    ],
    history: [
      {
        id: "VLOG-SPT-01",
        ticketReference: "TH-SPT-3001",
        passengerName: "Biniam Girma",
        phone: "+251 91 999 0011",
        seatNumber: "West Tribune A12",
        serviceTitle: "Sheger Derby: St. George vs Ethiopia Coffee",
        category: "SPORTS",
        verificationDate: "Today",
        verificationTime: "03:30 PM",
        location: "Gate 4 (VIP Tribune)",
        result: "VALID",
      },
    ],
    notifications: [
      {
        id: "NOTIF-SPT-1",
        title: "Matchday Gate 4 Live",
        message: "Turnstiles activated for Sheger Derby matchday pass entry.",
        type: "ASSIGNMENT",
        createdAt: "30m ago",
        isRead: false,
        linkHref: "/inspector/scanner",
      },
    ],
    samplePasses: {
      "TH-SPT-3001": { name: "Biniam Girma", seat: "West Tribune A12", phone: "+251 91 999 0011", tier: "VIP Tribune" },
    },
  },
};

// Determine initial category: sync from localStorage, default to CINEMA or provider's category
const getInitialCategory = (): TicketCategory => {
  if (typeof window !== "undefined") {
    try {
      const savedInsp = localStorage.getItem("tikora_inspector_category") as TicketCategory;
      if (savedInsp && ["BUS", "CINEMA", "EVENT", "SPORTS"].includes(savedInsp)) {
        return savedInsp;
      }
      const savedProv = localStorage.getItem("tikora_provider_category") as TicketCategory;
      if (savedProv && ["BUS", "CINEMA", "EVENT", "SPORTS"].includes(savedProv)) {
        return savedProv;
      }
    } catch {}
  }
  return "CINEMA";
};

const initialCategory = getInitialCategory();
const initialSector = SECTOR_DATASETS[initialCategory] || SECTOR_DATASETS.CINEMA;

interface InspectorStoreState {
  profile: InspectorProfile;
  assignments: InspectorAssignment[];
  currentAssignmentId: string;
  verificationHistory: VerificationLogItem[];
  notifications: InspectorNotification[];
  scannerSoundEnabled: boolean;
  scannerVibrateEnabled: boolean;
  autoResetDurationSec: number;

  // Actions
  setInspectorCategory: (category: TicketCategory, orgName?: string) => void;
  setCurrentAssignment: (id: string) => void;
  updateProfile: (data: Partial<InspectorProfile>) => void;
  verifyTicket: (reference: string) => VerificationOutcome;
  clearHistory: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  setScannerSound: (enabled: boolean) => void;
  setScannerVibrate: (enabled: boolean) => void;
  setAutoResetDuration: (sec: number) => void;
}

export const useInspectorStore = create<InspectorStoreState>((set, get) => ({
  profile: {
    ...initialSector.profile,
    deviceInfo: {
      deviceModel: "Samsung Galaxy A54 5G (Enterprise)",
      scannerVersion: "TIKORA Inspector v2.4.1",
      lastSync: "Just now",
    },
  } as InspectorProfile,
  assignments: initialSector.assignments,
  currentAssignmentId: initialSector.assignments[0]?.id || "",
  verificationHistory: initialSector.history,
  notifications: initialSector.notifications,
  scannerSoundEnabled: true,
  scannerVibrateEnabled: true,
  autoResetDurationSec: 5,

  // Change sector dynamically (Cinema vs Bus vs Event vs Sports)
  setInspectorCategory: (category: TicketCategory, customOrgName?: string) => {
    const dataset = SECTOR_DATASETS[category] || SECTOR_DATASETS.CINEMA;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("tikora_inspector_category", category);
      } catch {}
    }

    set((state) => ({
      profile: {
        ...state.profile,
        ...dataset.profile,
        organizationName: customOrgName || dataset.profile.organizationName || state.profile.organizationName,
        category,
      } as InspectorProfile,
      assignments: dataset.assignments,
      currentAssignmentId: dataset.assignments[0]?.id || "",
      verificationHistory: dataset.history,
      notifications: dataset.notifications,
    }));
  },

  setCurrentAssignment: (id: string) => {
    set({ currentAssignmentId: id });
  },

  updateProfile: (data) => {
    set((state) => ({
      profile: { ...state.profile, ...data },
    }));
  },

  verifyTicket: (reference: string) => {
    const rawRef = reference.trim().toUpperCase();
    const state = get();
    const activeCategory = state.profile.category;
    const dataset = SECTOR_DATASETS[activeCategory] || SECTOR_DATASETS.CINEMA;
    const currentAssignment =
      state.assignments.find((a) => a.id === state.currentAssignmentId) || state.assignments[0];

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    let outcome: VerificationOutcome;

    // Check 1: Empty or invalid barcode
    if (!rawRef || rawRef.length < 5 || rawRef.startsWith("INV") || rawRef.includes("FAKE")) {
      outcome = {
        result: "INVALID",
        ticketReference: rawRef || "UNKNOWN_QR",
        passengerName: "Unregistered Holder",
        serviceTitle: state.profile.organizationName,
        category: activeCategory,
        verifiedAt: timestamp,
        message: "Digital ticket signature could not be verified in TIKORA ledger.",
        details: {
          gate: currentAssignment.gate,
        },
      };
    }
    // Check 2: Expired pass test
    else if (rawRef.includes("EXP") || rawRef === "TH-EXP-001") {
      outcome = {
        result: "EXPIRED",
        ticketReference: rawRef,
        passengerName: "Kassahun Desta",
        seatNumber: "Expired Seat",
        serviceTitle: currentAssignment.title,
        category: activeCategory,
        verifiedAt: timestamp,
        message: "Ticket validity window expired. Service completed in the past.",
        details: {
          gate: currentAssignment.gate,
        },
      };
    }
    // Check 3: Wrong Category / Assignment (e.g., Bus ticket presented at Cinema or vice-versa)
    else if (
      (activeCategory === "CINEMA" && (rawRef.startsWith("TH-BUS") || rawRef.startsWith("TH-EVT") || rawRef.startsWith("TH-SPT"))) ||
      (activeCategory === "BUS" && (rawRef.startsWith("TH-CNM") || rawRef.startsWith("TH-EVT") || rawRef.startsWith("TH-SPT"))) ||
      (activeCategory === "EVENT" && (rawRef.startsWith("TH-BUS") || rawRef.startsWith("TH-CNM") || rawRef.startsWith("TH-SPT"))) ||
      (activeCategory === "SPORTS" && (rawRef.startsWith("TH-BUS") || rawRef.startsWith("TH-CNM") || rawRef.startsWith("TH-EVT")))
    ) {
      const foreignCategory = rawRef.startsWith("TH-CNM")
        ? "Cinema"
        : rawRef.startsWith("TH-BUS")
        ? "Bus Coach"
        : rawRef.startsWith("TH-EVT")
        ? "Event Festival"
        : "Stadium Sports";

      outcome = {
        result: "WRONG_ASSIGNMENT",
        ticketReference: rawRef,
        passengerName: "Cross-Sector Voucher",
        seatNumber: "--",
        serviceTitle: foreignCategory,
        category: activeCategory,
        verifiedAt: timestamp,
        message: `Wrong venue/service: This pass belongs to ${foreignCategory}, not ${state.profile.organizationName} (${currentAssignment.gate}).`,
        details: {
          expectedService: currentAssignment.title,
          gate: currentAssignment.gate,
        },
      };
    }
    // Check 4: Check if already scanned in today's local verification history
    else {
      const existingValidScan = state.verificationHistory.find(
        (v) => v.ticketReference === rawRef && v.result === "VALID"
      );

      if (existingValidScan) {
        outcome = {
          result: "ALREADY_USED",
          ticketReference: rawRef,
          passengerName: existingValidScan.passengerName,
          seatNumber: existingValidScan.seatNumber,
          serviceTitle: currentAssignment.title,
          category: activeCategory,
          verifiedAt: timestamp,
          message: `Duplicate scan detected! This voucher was previously validated at ${existingValidScan.verificationTime}.`,
          details: {
            previouslyScannedAt: `${existingValidScan.verificationDate} • ${existingValidScan.verificationTime}`,
            gate: currentAssignment.gate,
          },
        };
      } else {
        // Valid pass! Check sample passes or generate valid response
        const known = dataset.samplePasses[rawRef] || {
          name: "Verified Patron",
          seat: activeCategory === "CINEMA" ? "H1-VIP-D04" : activeCategory === "BUS" ? "08A" : "VIP Entry",
          phone: "+251 91 000 0000",
          tier: "VIP Access",
        };

        const successMessage =
          activeCategory === "CINEMA"
            ? "Ticket verified successfully. Patron auditorium admission approved. 3D glasses issued."
            : activeCategory === "BUS"
            ? "Boarding pass verified. Passenger coach access approved. Luggage tagged."
            : activeCategory === "EVENT"
            ? "Event pass verified. Wristband issued for venue turnstile entry."
            : "Matchday stadium pass verified. Turnstile entry approved.";

        outcome = {
          result: "VALID",
          ticketReference: rawRef,
          passengerName: known.name,
          seatNumber: known.seat,
          serviceTitle: currentAssignment.title,
          category: activeCategory,
          verifiedAt: timestamp,
          message: successMessage,
          details: {
            origin: state.profile.organizationName,
            destination: currentAssignment.venueOrTerminal,
            tier: known.tier,
            gate: currentAssignment.gate,
          },
        };
      }
    }

    // Append to verification history
    const logItem: VerificationLogItem = {
      id: `VLOG-${Date.now()}`,
      ticketReference: outcome.ticketReference,
      passengerName: outcome.passengerName,
      seatNumber: outcome.seatNumber,
      serviceTitle: outcome.serviceTitle,
      category: outcome.category,
      verificationDate: "Today",
      verificationTime: timestamp,
      location: currentAssignment.venueOrTerminal,
      result: outcome.result,
      failureReason: outcome.result !== "VALID" ? outcome.message : undefined,
      previousScannedAt: outcome.details?.previouslyScannedAt,
    };

    set((s) => ({
      verificationHistory: [logItem, ...s.verificationHistory],
      assignments: s.assignments.map((a) =>
        a.id === currentAssignment.id && outcome.result === "VALID"
          ? { ...a, scannedSeats: a.scannedSeats + 1 }
          : a
      ),
    }));

    return outcome;
  },

  clearHistory: () => {
    set({ verificationHistory: [] });
  },

  markNotificationAsRead: (id: string) => {
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  },

  markAllNotificationsAsRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  setScannerSound: (enabled: boolean) => set({ scannerSoundEnabled: enabled }),
  setScannerVibrate: (enabled: boolean) => set({ scannerVibrateEnabled: enabled }),
  setAutoResetDuration: (sec: number) => set({ autoResetDurationSec: sec }),
}));
