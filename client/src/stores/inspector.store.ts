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
// SECTOR DATASETS: Clean baseline per Category
// -------------------------------------------------------------
export const SECTOR_DATASETS: Record<TicketCategory, SectorDataset> = {
  CINEMA: {
    profile: {
      id: "insp-cnm-01",
      fullName: "Field Usher",
      email: "usher@cinema.tikora.et",
      phone: "+251 90 000 0000",
      role: "Cinema Hall Usher & QR Scanner",
      inspectorId: "INS-CNM-01",
      category: "CINEMA",
      organizationId: "org-cnm",
      organizationName: "Cinema Partner",
      assignedStation: "Auditorium Gate",
      terminalGate: "Hall 1 Entrance",
      status: "ACTIVE",
      dateJoined: "Today",
    },
    assignments: [],
    history: [],
    notifications: [],
    samplePasses: {},
  },
  BUS: {
    profile: {
      id: "insp-bus-01",
      fullName: "Platform Inspector",
      email: "inspector@bus.tikora.et",
      phone: "+251 90 000 0000",
      role: "Platform Inspector & Boarding Officer",
      inspectorId: "INS-BUS-01",
      category: "BUS",
      organizationId: "org-bus",
      organizationName: "Bus Partner",
      assignedStation: "Bus Terminal Platform",
      terminalGate: "Platform Gate 1",
      status: "ACTIVE",
      dateJoined: "Today",
    },
    assignments: [],
    history: [],
    notifications: [],
    samplePasses: {},
  },
  EVENT: {
    profile: {
      id: "insp-evt-01",
      fullName: "Access Controller",
      email: "gate@event.tikora.et",
      phone: "+251 90 000 0000",
      role: "Event Gate & Turnstile Officer",
      inspectorId: "INS-EVT-01",
      category: "EVENT",
      organizationId: "org-evt",
      organizationName: "Event Partner",
      assignedStation: "Turnstile Gate",
      terminalGate: "Gate A",
      status: "ACTIVE",
      dateJoined: "Today",
    },
    assignments: [],
    history: [],
    notifications: [],
    samplePasses: {},
  },
  SPORTS: {
    profile: {
      id: "insp-spt-01",
      fullName: "Stadium Marshal",
      email: "marshal@sports.tikora.et",
      phone: "+251 90 000 0000",
      role: "Stadium Gate Marshal & Ticket Scanner",
      inspectorId: "INS-SPT-01",
      category: "SPORTS",
      organizationId: "org-spt",
      organizationName: "Sports Partner",
      assignedStation: "Stadium Entrance",
      terminalGate: "Gate 1",
      status: "ACTIVE",
      dateJoined: "Today",
    },
    assignments: [],
    history: [],
    notifications: [],
    samplePasses: {},
  },
};

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
    const currentAssignment =
      state.assignments.find((a) => a.id === state.currentAssignmentId) || state.assignments[0];

    const gateLabel = currentAssignment?.gate || state.profile.terminalGate || "Gate Entrance";
    const venueLabel = currentAssignment?.venueOrTerminal || state.profile.assignedStation || "Venue Terminal";
    const serviceTitle = currentAssignment?.title || state.profile.organizationName || "Service Validation";

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    let outcome: VerificationOutcome;

    // Check 1: Empty or invalid barcode
    if (!rawRef || rawRef.length < 5 || rawRef.startsWith("INV") || rawRef.includes("FAKE")) {
      outcome = {
        result: "INVALID",
        ticketReference: rawRef || "UNKNOWN_QR",
        passengerName: "Unregistered Holder",
        serviceTitle,
        category: activeCategory,
        verifiedAt: timestamp,
        message: "Digital ticket signature could not be verified in TIKORA ledger.",
        details: {
          gate: gateLabel,
        },
      };
    }
    // Check 2: Expired pass test
    else if (rawRef.includes("EXP") || rawRef === "TH-EXP-001") {
      outcome = {
        result: "EXPIRED",
        ticketReference: rawRef,
        passengerName: "Pass Holder",
        seatNumber: "Expired Pass",
        serviceTitle,
        category: activeCategory,
        verifiedAt: timestamp,
        message: "Ticket validity window expired. Service completed in the past.",
        details: {
          gate: gateLabel,
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
        message: `Wrong venue/service: This pass belongs to ${foreignCategory}, not ${state.profile.organizationName} (${gateLabel}).`,
        details: {
          expectedService: serviceTitle,
          gate: gateLabel,
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
          serviceTitle,
          category: activeCategory,
          verifiedAt: timestamp,
          message: `Duplicate scan detected! This voucher was previously validated at ${existingValidScan.verificationTime}.`,
          details: {
            previouslyScannedAt: `${existingValidScan.verificationDate} • ${existingValidScan.verificationTime}`,
            gate: gateLabel,
          },
        };
      } else {
        const successMessage =
          activeCategory === "CINEMA"
            ? "Ticket verified successfully. Patron auditorium admission approved."
            : activeCategory === "BUS"
            ? "Boarding pass verified. Passenger coach access approved."
            : activeCategory === "EVENT"
            ? "Event pass verified. Wristband issued for venue turnstile entry."
            : "Matchday stadium pass verified. Turnstile entry approved.";

        outcome = {
          result: "VALID",
          ticketReference: rawRef,
          passengerName: "Verified Patron",
          seatNumber: "Standard Entry",
          serviceTitle,
          category: activeCategory,
          verifiedAt: timestamp,
          message: successMessage,
          details: {
            origin: state.profile.organizationName,
            destination: venueLabel,
            tier: "General Access",
            gate: gateLabel,
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
      location: venueLabel,
      result: outcome.result,
      failureReason: outcome.result !== "VALID" ? outcome.message : undefined,
      previousScannedAt: outcome.details?.previouslyScannedAt,
    };

    set((s) => ({
      verificationHistory: [logItem, ...s.verificationHistory],
      assignments: currentAssignment
        ? s.assignments.map((a) =>
            a.id === currentAssignment.id && outcome.result === "VALID"
              ? { ...a, scannedSeats: a.scannedSeats + 1 }
              : a
          )
        : s.assignments,
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
