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

// Initial Mock Assignments
const INITIAL_ASSIGNMENTS: InspectorAssignment[] = [
  {
    id: "ASN-2026-081",
    serviceId: "bus-1",
    title: "Addis Ababa to Hawassa Luxury Express",
    category: "BUS",
    venueOrTerminal: "Autobus Tera Central Terminal",
    gate: "Gate 3 (Intercity Express)",
    scheduledDate: "2026-11-15",
    scheduledTime: "06:00 AM",
    coachOrHall: "Scania VIP Luxury Coach (Plate AA-3-48129)",
    driverOrLead: "Kassahun Girma",
    driverPhone: "+251 91 144 8822",
    totalSeats: 48,
    scannedSeats: 34,
    status: "ACTIVE_NOW",
    specialInstructions:
      "Verify national ID or passport for all adult passengers. Ensure luggage tag stubs match boarding pass references.",
    validReferencePrefix: "TH-BUS",
  },
  {
    id: "ASN-2026-082",
    serviceId: "bus-2",
    title: "Addis Ababa to Bahir Dar Lake Cruiser",
    category: "BUS",
    venueOrTerminal: "Lamberet Bus Terminal",
    gate: "Gate 1B (Northern Express)",
    scheduledDate: "2026-11-16",
    scheduledTime: "05:30 AM",
    coachOrHall: "Yutong High Deck VIP (Plate AA-3-99120)",
    driverOrLead: "Mulugeta Tadesse",
    driverPhone: "+251 92 311 0022",
    totalSeats: 46,
    scannedSeats: 0,
    status: "UPCOMING",
    specialInstructions:
      "Cross-verify passenger manifest against electronic manifest. Boarding begins 30 minutes prior to departure.",
    validReferencePrefix: "TH-BUS",
  },
  {
    id: "ASN-2026-085",
    serviceId: "evt-1",
    title: "Afro Beats & Jazz Night Live at Millennium Hall",
    category: "EVENT",
    venueOrTerminal: "Millennium Hall Exhibition Grounds",
    gate: "Gate 2 (VIP & Gold Access)",
    scheduledDate: "2026-11-20",
    scheduledTime: "06:00 PM",
    coachOrHall: "Main Concert Pavilion",
    driverOrLead: "Alem Events Management",
    driverPhone: "+251 91 222 3344",
    totalSeats: 500,
    scannedSeats: 0,
    status: "UPCOMING",
    specialInstructions:
      "Scan wristband voucher QR codes. Strictly no outside beverages permitted beyond gate 2.",
    validReferencePrefix: "TH-EVT",
  },
  {
    id: "ASN-2026-079",
    serviceId: "bus-prev",
    title: "Addis Ababa to Adama Fastliner Shuttle",
    category: "BUS",
    venueOrTerminal: "Autobus Tera Gate 3",
    gate: "Gate 3",
    scheduledDate: "2026-11-14",
    scheduledTime: "08:00 AM",
    coachOrHall: "Toyota Coaster Deluxe (Plate AA-2-12001)",
    totalSeats: 28,
    scannedSeats: 28,
    status: "COMPLETED",
    specialInstructions: "Boarding finalized. Trip completed.",
    validReferencePrefix: "TH-BUS",
  },
];

// Initial Verification History
const INITIAL_HISTORY: VerificationLogItem[] = [
  {
    id: "VLOG-101",
    ticketReference: "TH-BUS-8829",
    passengerName: "Dawit Hailemariam",
    phone: "+251 91 182 9182",
    seatNumber: "04A",
    serviceTitle: "Addis Ababa to Hawassa Luxury Express",
    category: "BUS",
    verificationDate: "Today",
    verificationTime: "05:58 AM",
    location: "Autobus Tera Gate 3",
    result: "VALID",
  },
  {
    id: "VLOG-102",
    ticketReference: "TH-BUS-8830",
    passengerName: "Tigist Alemu",
    phone: "+251 92 344 8811",
    seatNumber: "04B",
    serviceTitle: "Addis Ababa to Hawassa Luxury Express",
    category: "BUS",
    verificationDate: "Today",
    verificationTime: "05:54 AM",
    location: "Autobus Tera Gate 3",
    result: "VALID",
  },
  {
    id: "VLOG-103",
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
    id: "VLOG-104",
    ticketReference: "TH-CNM-4419",
    passengerName: "Meron Worku",
    seatNumber: "H1-E08",
    serviceTitle: "Avatar: The Way of Water 3D Dolby",
    category: "CINEMA",
    verificationDate: "Today",
    verificationTime: "05:42 AM",
    location: "Autobus Tera Gate 3",
    result: "WRONG_ASSIGNMENT",
    failureReason:
      "This pass is for Cinema Screening Hall 1, not assigned to Autobus Tera coach boarding.",
  },
  {
    id: "VLOG-105",
    ticketReference: "INVALID-XYZ-9999",
    passengerName: "Unknown Customer",
    serviceTitle: "Unrecognized QR Code",
    category: "BUS",
    verificationDate: "Today",
    verificationTime: "05:35 AM",
    location: "Autobus Tera Gate 3",
    result: "INVALID",
    failureReason: "Cryptographic QR digital signature check failed. Not a TIKORA voucher.",
  },
  {
    id: "VLOG-106",
    ticketReference: "TH-EXP-0012",
    passengerName: "Kassahun Desta",
    serviceTitle: "Addis Ababa to Hawassa Early Bird",
    category: "BUS",
    verificationDate: "Today",
    verificationTime: "05:20 AM",
    location: "Autobus Tera Gate 3",
    result: "EXPIRED",
    failureReason: "Pass expired on Nov 10, 2026. Trip departed 5 days ago.",
  },
];

// Initial Notifications
const INITIAL_NOTIFICATIONS: InspectorNotification[] = [
  {
    id: "NOTIF-INS-1",
    title: "Active Departure Boarding Now",
    message: "Addis Ababa to Hawassa Luxury Express is currently boarding at Gate 3. Coach Scania Plate AA-3-48129.",
    type: "ASSIGNMENT",
    createdAt: "15m ago",
    isRead: false,
    linkHref: "/inspector/scanner",
  },
  {
    id: "NOTIF-INS-2",
    title: "Terminal Gate Adjustment",
    message: "Tomorrow's Bahir Dar Lake Cruiser departure shifted from Gate 2 to Gate 1B at Lamberet Terminal.",
    type: "GATE_CHANGE",
    createdAt: "2h ago",
    isRead: false,
    linkHref: "/inspector/assigned",
  },
  {
    id: "NOTIF-INS-3",
    title: "Provider Operations Notice",
    message: "Selam Bus Operations: All inspectors must ensure passenger luggage tags are inspected before entry.",
    type: "PROVIDER_MSG",
    createdAt: "1d ago",
    isRead: true,
  },
];

export const useInspectorStore = create<InspectorStoreState>((set, get) => ({
  profile: {
    id: "stf-1",
    fullName: "Solomon Abebe",
    email: "solomon.a@selambus.et",
    phone: "+251 91 184 9281",
    role: "Gate Ticket Inspector",
    inspectorId: "INS-AA-0941",
    organizationId: "org-selam-01",
    organizationName: "Selam Bus Lines S.C.",
    assignedStation: "Autobus Tera Central Terminal",
    terminalGate: "Gate 3 (Intercity Express)",
    status: "ACTIVE",
    dateJoined: "March 15, 2026",
    deviceInfo: {
      deviceModel: "Samsung Galaxy A54 5G (Enterprise)",
      scannerVersion: "TIKORA Inspector v2.4.1",
      lastSync: "Just now",
    },
  },
  assignments: INITIAL_ASSIGNMENTS,
  currentAssignmentId: "ASN-2026-081",
  verificationHistory: INITIAL_HISTORY,
  notifications: INITIAL_NOTIFICATIONS,
  scannerSoundEnabled: true,
  scannerVibrateEnabled: true,
  autoResetDurationSec: 5,

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
    const currentAssignment =
      state.assignments.find((a) => a.id === state.currentAssignmentId) || state.assignments[0];

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    let outcome: VerificationOutcome;

    // Check 1: Empty or completely garbage string
    if (!rawRef || rawRef.length < 5 || rawRef.startsWith("INV") || rawRef.includes("FAKE")) {
      outcome = {
        result: "INVALID",
        ticketReference: rawRef || "UNKNOWN_QR",
        passengerName: "Unregistered Holder",
        serviceTitle: "TIKORA Central Ledger",
        category: currentAssignment.category,
        verifiedAt: timestamp,
        message: "Digital ticket signature could not be verified in TIKORA registry.",
        details: {
          gate: currentAssignment.gate,
        },
      };
    }
    // Check 2: Expired pass test
    else if (rawRef.includes("EXP") || rawRef === "TH-BUS-0012") {
      outcome = {
        result: "EXPIRED",
        ticketReference: rawRef,
        passengerName: "Kassahun Desta",
        seatNumber: "02A",
        serviceTitle: currentAssignment.title,
        category: currentAssignment.category,
        verifiedAt: timestamp,
        message: "Ticket validity window expired. Service completed on Nov 10, 2026.",
        details: {
          gate: currentAssignment.gate,
        },
      };
    }
    // Check 3: Wrong assignment (e.g. Cinema or Sports ticket presented at Bus terminal)
    else if (
      (rawRef.startsWith("TH-CNM") || rawRef.startsWith("TH-SPT") || rawRef.startsWith("TH-EVT")) &&
      currentAssignment.category === "BUS"
    ) {
      outcome = {
        result: "WRONG_ASSIGNMENT",
        ticketReference: rawRef,
        passengerName: "Meron Worku",
        seatNumber: "H1-E08",
        serviceTitle: rawRef.startsWith("TH-CNM")
          ? "Avatar 3D (Alem Cinema)"
          : "Afro Beats Jazz Concert",
        category: rawRef.startsWith("TH-CNM") ? "CINEMA" : "EVENT",
        verifiedAt: timestamp,
        message: `Wrong venue/service. This ticket belongs to ${
          rawRef.startsWith("TH-CNM") ? "Cinema" : "Concert Event"
        }, not this coach departure.`,
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
          category: currentAssignment.category,
          verifiedAt: timestamp,
          message: `Duplicate scan detected! This voucher was previously validated at ${existingValidScan.verificationTime}.`,
          details: {
            previouslyScannedAt: `${existingValidScan.verificationDate} • ${existingValidScan.verificationTime}`,
            gate: currentAssignment.gate,
          },
        };
      } else {
        // Valid pass!
        // Deterministic passenger lookup based on ref
        const samplePassengers: Record<string, { name: string; seat: string; phone: string }> = {
          "TH-BUS-8829": { name: "Dawit Hailemariam", seat: "04A", phone: "+251 91 182 9182" },
          "TH-BUS-8830": { name: "Tigist Alemu", seat: "04B", phone: "+251 92 344 8811" },
          "TH-BUS-8835": { name: "Yared Tesfaye", seat: "05A", phone: "+251 93 512 0099" },
          "TH-BUS-8841": { name: "Bethlehem Assefa", seat: "06A", phone: "+251 91 766 2211" },
          "TH-BUS-8849": { name: "Samuel Kebede", seat: "07B", phone: "+251 94 881 7733" },
        };

        const known = samplePassengers[rawRef] || {
          name: "Verified Passenger",
          seat: "08A",
          phone: "+251 91 000 0000",
        };

        outcome = {
          result: "VALID",
          ticketReference: rawRef,
          passengerName: known.name,
          seatNumber: known.seat,
          serviceTitle: currentAssignment.title,
          category: currentAssignment.category,
          verifiedAt: timestamp,
          message: "Ticket verified successfully. Boarding access approved.",
          details: {
            origin: "Addis Ababa (Autobus Tera)",
            destination: "Hawassa Piazza Terminal",
            tier: "Luxury VIP Recliner",
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
      // If valid, increment scanned count on current assignment
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

