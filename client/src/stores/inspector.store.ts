"use client";

import { create } from "zustand";
import { TicketCategory } from "@/types/ticket.types";
import { TicketService } from "@/services/ticket.service";

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
  organizationBookings: any[];
  organizationTickets: any[];
  isLoadingBookings: boolean;

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
  syncOrganizationTickets: (tickets: any[]) => void;
  fetchOrganizationServices: () => Promise<void>;
  fetchOrganizationBookings: () => Promise<void>;
  checkInBooking: (reference: string) => Promise<boolean>;
  undoCheckInBooking: (reference: string) => Promise<boolean>;
  initializeFromAuthUser: (user: any) => void;
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
  organizationBookings: [],
  organizationTickets: [],
  isLoadingBookings: false,

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

    get().fetchOrganizationServices();
  },

  initializeFromAuthUser: (user: any) => {
    if (!user) return;
    const cat = ((user.organizationCategory || user.category || "BUS") as string).toUpperCase() as TicketCategory;
    const dataset = SECTOR_DATASETS[cat] || SECTOR_DATASETS.BUS;
    const orgName =
      user.organizationName ||
      user.organization ||
      dataset.profile.organizationName ||
      "Provider Organization";
    const station = user.assignedStation || dataset.profile.assignedStation || "Main Gate Terminal";

    set((state) => ({
      profile: {
        ...state.profile,
        ...dataset.profile,
        id: String(user.id || state.profile.id),
        fullName: user.name || state.profile.fullName,
        email: user.email || state.profile.email,
        phone: user.phone || state.profile.phone,
        organizationName: orgName,
        organizationId: user.organizationId ? String(user.organizationId) : state.profile.organizationId,
        category: cat,
        assignedStation: station,
      } as InspectorProfile,
    }));

    get().fetchOrganizationServices();
  },

  setCurrentAssignment: (id: string) => {
    set({ currentAssignmentId: id });
  },

  updateProfile: (data) => {
    set((state) => ({
      profile: { ...state.profile, ...data },
    }));
  },

  syncOrganizationTickets: (tickets: any[]) => {
    const profile = get().profile;
    const cat = profile.category || "CINEMA";
    const cleanOrg = (profile.organizationName || "").toLowerCase().trim();
    const orgWords = cleanOrg.split(/\s+/).filter((w) => w.length > 2 && w !== "express" && w !== "lines" && w !== "plc" && w !== "ltd");

    const matching = tickets.filter((t) => {
      const tOrg = (t.organizer || "").toLowerCase();
      const tTitle = (t.title || "").toLowerCase();
      if (cleanOrg && (tOrg.includes(cleanOrg) || cleanOrg.includes(tOrg))) return true;
      if (orgWords.some((w) => tOrg.includes(w) || tTitle.includes(w))) return true;
      if (t.category === cat) return true;
      return false;
    });

    const mappedAssignments: InspectorAssignment[] = matching.map((t) => ({
      id: `asn-${t.id}`,
      serviceId: String(t.id),
      title: t.title,
      category: t.category,
      venueOrTerminal: t.location || t.city || "Addis Ababa",
      gate: t.category === "CINEMA" ? "Auditorium Hall 1" : "Terminal Gate 3",
      scheduledDate: t.date || "2026-11-20",
      scheduledTime: t.time || "05:30 PM", // Showtime / Starts At or Departure Time
      coachOrHall: t.category === "CINEMA" ? "Cinema Hall VIP" : "Coach 01",
      driverOrLead: t.organizer,
      totalSeats: t.totalSeats || 50,
      scannedSeats: Math.max(0, (t.totalSeats || 50) - (t.availableSeats || 50)),
      status: "ACTIVE_NOW",
      specialInstructions: `Authorized admission validation for ${t.title}. Showtime/Departure: ${t.time}.`,
      validReferencePrefix: "TIK-",
    }));

    set({
      organizationTickets: matching.length > 0 ? matching : tickets,
      assignments: mappedAssignments.length > 0 ? mappedAssignments : get().assignments,
      currentAssignmentId: mappedAssignments[0]?.id || get().currentAssignmentId,
    });
  },

  fetchOrganizationServices: async () => {
    try {
      const tickets = await TicketService.fetchTickets();
      get().syncOrganizationTickets(tickets);
      get().fetchOrganizationBookings();
    } catch (e) {
      console.error("Failed to sync inspector services:", e);
    }
  },

  fetchOrganizationBookings: async () => {
    set({ isLoadingBookings: true });
    try {
      const profile = get().profile;
      const cleanOrg = (profile.organizationName || "").toLowerCase().trim();
      const cat = profile.category || "CINEMA";
      const orgWords = cleanOrg.split(/\s+/).filter((w) => w.length > 2 && w !== "express" && w !== "lines" && w !== "plc" && w !== "ltd");

      // 1. Fetch from server API
      let serverBookings: any[] = [];
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.bookings)) {
            serverBookings = data.bookings;
          }
        }
      } catch (err) {
        console.warn("Could not fetch server bookings:", err);
      }

      // 2. Fetch from local storages
      let localBookings: any[] = [];
      if (typeof window !== "undefined") {
        try {
          const b1 = JSON.parse(localStorage.getItem("tikora_bookings") || "[]");
          const b2 = JSON.parse(localStorage.getItem("tikora_provider_bookings") || "[]");
          const b3 = JSON.parse(localStorage.getItem("tikora_admin_bookings") || "[]");
          localBookings = [...b1, ...b2, ...b3];
        } catch {}
      }

      // Combine and deduplicate
      const combined = [...serverBookings, ...localBookings];
      const seen = new Set<string>();
      const unique = combined.filter((b) => {
        const ref = (b.bookingReference || b.reference || b.id || "").toUpperCase();
        if (!ref || seen.has(ref)) return false;
        seen.add(ref);
        return true;
      });

      // Filter for this organization
      const matched = unique.filter((b) => {
        const bOrg = (b.providerName || b.ticket?.organizer || b.organizer || "").toLowerCase();
        const bTitle = (b.serviceTitle || b.ticket?.title || "").toLowerCase();
        const bCat = (b.category || b.ticket?.category || "").toUpperCase();

        if (cleanOrg && (bOrg.includes(cleanOrg) || cleanOrg.includes(bOrg))) return true;
        if (orgWords.some((w) => bOrg.includes(w) || bTitle.includes(w))) return true;
        if (bCat === cat) return true;
        return false;
      });

      set({ organizationBookings: matched, isLoadingBookings: false });
    } catch (err) {
      console.error("fetchOrganizationBookings error:", err);
      set({ isLoadingBookings: false });
    }
  },

  checkInBooking: async (reference: string) => {
    try {
      const cleanRef = reference.trim().toUpperCase();

      // 1. Send update to server API
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: cleanRef, bookingStatus: "CHECKED_IN" }),
      }).catch(() => {});

      // 2. Update store state
      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      set((s) => ({
        organizationBookings: s.organizationBookings.map((b) => {
          const bRef = (b.bookingReference || b.reference || b.id || "").toUpperCase();
          if (bRef === cleanRef || bRef.includes(cleanRef) || cleanRef.includes(bRef)) {
            return { ...b, bookingStatus: "CHECKED_IN", checkedInAt: nowTime };
          }
          return b;
        }),
      }));

      // 3. Update local storage copies
      if (typeof window !== "undefined") {
        try {
          const updateStorage = (key: string) => {
            const list = JSON.parse(localStorage.getItem(key) || "[]");
            const updated = list.map((b: any) => {
              const bRef = (b.bookingReference || b.reference || b.id || "").toUpperCase();
              if (bRef === cleanRef || bRef.includes(cleanRef) || cleanRef.includes(bRef)) {
                return { ...b, bookingStatus: "CHECKED_IN", checkedInAt: nowTime };
              }
              return b;
            });
            localStorage.setItem(key, JSON.stringify(updated));
          };
          updateStorage("tikora_bookings");
          updateStorage("tikora_provider_bookings");
          updateStorage("tikora_admin_bookings");
        } catch {}
      }

      // 4. Record to inspector verification audit history
      const matched = get().organizationBookings.find((b) => {
        const bRef = (b.bookingReference || b.reference || b.id || "").toUpperCase();
        return bRef === cleanRef || bRef.includes(cleanRef) || cleanRef.includes(bRef);
      });

      const logItem: VerificationLogItem = {
        id: `VLOG-${Date.now()}`,
        ticketReference: cleanRef,
        passengerName: matched?.customerName || "Patron Admitted",
        seatNumber:
          (matched?.selectedSeats && matched.selectedSeats.join(", ")) ||
          (matched?.seats && matched.seats.join(", ")) ||
          matched?.selectedTier ||
          "Standard Pass",
        serviceTitle: matched?.serviceTitle || matched?.ticket?.title || get().profile.organizationName,
        category: get().profile.category,
        verificationDate: "Today",
        verificationTime: nowTime,
        location: get().profile.assignedStation,
        result: "VALID",
      };

      set((s) => ({
        verificationHistory: [logItem, ...s.verificationHistory],
        assignments: s.assignments.map((a, idx) =>
          idx === 0 ? { ...a, scannedSeats: a.scannedSeats + 1 } : a
        ),
      }));

      return true;
    } catch (err) {
      console.error("checkInBooking error:", err);
      return false;
    }
  },

  undoCheckInBooking: async (reference: string) => {
    try {
      const cleanRef = reference.trim().toUpperCase();

      // 1. Send update to server API
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: cleanRef, bookingStatus: "CONFIRMED" }),
      }).catch(() => {});

      // 2. Update store state
      set((s) => ({
        organizationBookings: s.organizationBookings.map((b) => {
          const bRef = (b.bookingReference || b.reference || b.id || "").toUpperCase();
          if (bRef === cleanRef || bRef.includes(cleanRef) || cleanRef.includes(bRef)) {
            const { checkedInAt, ...rest } = b as any;
            return { ...rest, bookingStatus: "CONFIRMED" };
          }
          return b;
        }),
      }));

      // 3. Update local storage copies
      if (typeof window !== "undefined") {
        try {
          const updateStorage = (key: string) => {
            const list = JSON.parse(localStorage.getItem(key) || "[]");
            const updated = list.map((b: any) => {
              const bRef = (b.bookingReference || b.reference || b.id || "").toUpperCase();
              if (bRef === cleanRef || bRef.includes(cleanRef) || cleanRef.includes(bRef)) {
                const { checkedInAt, ...rest } = b;
                return { ...rest, bookingStatus: "CONFIRMED" };
              }
              return b;
            });
            localStorage.setItem(key, JSON.stringify(updated));
          };
          updateStorage("tikora_bookings");
          updateStorage("tikora_provider_bookings");
          updateStorage("tikora_admin_bookings");
        } catch {}
      }

      set((s) => ({
        assignments: s.assignments.map((a, idx) =>
          idx === 0 ? { ...a, scannedSeats: Math.max(0, a.scannedSeats - 1) } : a
        ),
      }));

      return true;
    } catch (err) {
      console.error("undoCheckInBooking error:", err);
      return false;
    }
  },

  verifyTicket: (reference: string) => {
    let rawRef = reference.trim();
    // Support parsing raw QR code string: TIKORA-PASS:<ref>:<amount>:PAID
    if (rawRef.startsWith("TIKORA-PASS:")) {
      const parts = rawRef.split(":");
      if (parts[1]) {
        rawRef = parts[1];
      }
    }
    const cleanRef = rawRef.toUpperCase();

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
    if (!cleanRef || cleanRef.length < 4 || cleanRef.startsWith("INV") || cleanRef.includes("FAKE")) {
      outcome = {
        result: "INVALID",
        ticketReference: cleanRef || "UNKNOWN_QR",
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
    else if (cleanRef.includes("EXP") || cleanRef === "TH-EXP-001") {
      outcome = {
        result: "EXPIRED",
        ticketReference: cleanRef,
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
      (activeCategory === "CINEMA" && (cleanRef.startsWith("TH-BUS") || cleanRef.startsWith("TH-EVT") || cleanRef.startsWith("TH-SPT"))) ||
      (activeCategory === "BUS" && (cleanRef.startsWith("TH-CNM") || cleanRef.startsWith("TH-EVT") || cleanRef.startsWith("TH-SPT"))) ||
      (activeCategory === "EVENT" && (cleanRef.startsWith("TH-BUS") || cleanRef.startsWith("TH-CNM") || cleanRef.startsWith("TH-SPT"))) ||
      (activeCategory === "SPORTS" && (cleanRef.startsWith("TH-BUS") || cleanRef.startsWith("TH-CNM") || cleanRef.startsWith("TH-EVT")))
    ) {
      const foreignCategory = cleanRef.startsWith("TH-CNM")
        ? "Cinema"
        : cleanRef.startsWith("TH-BUS")
        ? "Bus Coach"
        : cleanRef.startsWith("TH-EVT")
        ? "Event Festival"
        : "Stadium Sports";

      outcome = {
        result: "WRONG_ASSIGNMENT",
        ticketReference: cleanRef,
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
        (v) => v.ticketReference === cleanRef && v.result === "VALID"
      );

      if (existingValidScan) {
        outcome = {
          result: "ALREADY_USED",
          ticketReference: cleanRef,
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
        // Resolve real booking data from persistent storage if available
        let matchedPassenger = "Verified Patron";
        let matchedSeat = "Standard Entry";
        let matchedService = serviceTitle;
        let matchedCat = activeCategory;

        if (typeof window !== "undefined") {
          try {
            const stored = [
              ...(JSON.parse(localStorage.getItem("tikora_bookings") || "[]")),
              ...(JSON.parse(localStorage.getItem("tikora_provider_bookings") || "[]")),
              ...(JSON.parse(localStorage.getItem("tikora_admin_bookings") || "[]")),
            ];
            const found = stored.find(
              (b: any) =>
                (b.bookingReference && b.bookingReference.toUpperCase() === cleanRef) ||
                (b.reference && b.reference.toUpperCase() === cleanRef) ||
                (b.id && String(b.id).toUpperCase() === cleanRef) ||
                (b.bookingReference && cleanRef.includes(b.bookingReference.toUpperCase())) ||
                (b.reference && cleanRef.includes(b.reference.toUpperCase()))
            );
            if (found) {
              matchedPassenger = found.customerName || found.passengerName || matchedPassenger;
              matchedSeat =
                (found.selectedSeats && found.selectedSeats.join(", ")) ||
                (found.seats && found.seats.join(", ")) ||
                found.selectedTier ||
                matchedSeat;
              matchedService = found.serviceTitle || found.ticket?.title || matchedService;
              if (found.category) matchedCat = found.category;
            }
          } catch {}
        }

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
          ticketReference: cleanRef,
          passengerName: matchedPassenger,
          seatNumber: matchedSeat,
          serviceTitle: matchedService,
          category: matchedCat,
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
