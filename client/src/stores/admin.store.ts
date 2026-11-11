"use client";

import { create } from "zustand";
import { adminService } from "@/services/admin.service";
import { TicketService } from "@/services/ticket.service";

export interface PlatformStats {
  totalGMV: number;
  platformRevenue: number;
  totalBookings: number;
  activeProviders: number;
  pendingApprovals: number;
  totalUsers: number;
  activeTickets: number;
  activeInspectors: number;
  refundsRequested: number;
}

export interface VerificationDocument {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  fileSize: string;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  uploadedAt: string;
  notes?: string;
}

export interface AdminOrganization {
  id: string;
  name: string;
  category: "BUS" | "CINEMA" | "EVENT" | "SPORTS";
  logoUrl?: string;
  businessLicense: string;
  taxNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "SUSPENDED";
  appliedDate: string;
  approvedDate?: string;
  rejectionReason?: string;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
  rating: number;
  commissionRate: number;
  documents: VerificationDocument[];
  notes?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  amharicName?: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "ORGANIZATION" | "INSPECTOR" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  organizationName?: string;
  createdAt: string;
  lastLogin: string;
  totalBookings?: number;
  nationalId?: string;
  faydaStatus?: "VERIFIED" | "PENDING" | "NOT_LINKED";
  kycStatus?: "VERIFIED" | "PENDING" | "REJECTED";
  kycLevel?: number;
  gender?: "Male" | "Female";
  dateOfBirth?: string;
  city?: string;
  woreda?: string;
  kebele?: string;
  address?: string;
  preferredPayment?: "TELEBIRR" | "CBE_BIRR" | "CHAPA";
  walletBalanceETB?: number;
  totalSpentETB?: number;
  loyaltyPoints?: number;
  twoFactorEnabled?: boolean;
  ipAddress?: string;
  deviceInfo?: string;
  suspendedReason?: string;
  notes?: string;
  addedBy?: {
    name: string;
    email: string;
    role: string;
  };
}

export interface AdminInspector {
  id: string;
  badgeId: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  avatar?: string;
  organizationId: string;
  organizationName: string;
  organizationCategory: "BUS" | "CINEMA" | "EVENT" | "SPORTS";
  assignedStation: string;
  addedBy?: {
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  lastActive: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  totalScans: number;
  validScans: number;
  flaggedScans: number;
  deviceModel: string;
  appVersion: string;
  shiftSchedule: string;
}

export interface AdminService {
  id: string;
  title: string;
  category: "BUS" | "CINEMA" | "EVENT" | "SPORTS";
  providerId: string;
  providerName: string;
  location: string;
  price: number;
  status: "ACTIVE" | "INACTIVE" | "FLAGGED" | "SOLD_OUT";
  totalSold: number;
  capacity: number;
  startDate: string;
  rating: number;
  imageUrl?: string;
  time?: string;
  date?: string;
  venue?: string;
  city?: string;
  description?: string;
  availableSeats?: number;
  remainingCapacity?: number;
  tiers?: any[];
  amenities?: string[];
  badge?: string;
  duration?: string;
  currency?: string;
  reviewCount?: number;
  organizerVerified?: boolean;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  category: "BUS" | "CINEMA" | "EVENT" | "SPORTS" | string;
  commissionRate: number;
  totalProviders: number;
  totalBookings: number;
  isActive: boolean;
  description: string;
  icon?: string;
}

export interface AdminBooking {
  id: string;
  reference: string;
  bookingReference?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  providerName: string;
  serviceTitle: string;
  category: "BUS" | "CINEMA" | "EVENT" | "SPORTS";
  quantity: number;
  seatNumbers: string[];
  seats?: string[];
  providerId?: string;
  providerPayout?: number;
  providerNet?: number;
  travelDate?: string;
  departureTime?: string;
  totalAmount: number;
  customerPaid?: number;
  subtotal?: number;
  baseFare?: number;
  vatAmount?: number;
  vatRate?: number;
  commissionRate?: number;
  platformFee: number;
  paymentMethod: "TELEBIRR" | "CBE_BIRR" | "CHAPA" | "CASH";
  paymentStatus: "PAID" | "PENDING" | "REFUNDED" | "FAILED";
  bookingStatus: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "CHECKED_IN";
  bookingDate: string;
}

export interface AdminPayout {
  id: string;
  reference: string;
  providerId: string;
  providerName: string;
  amount: number;
  fee: number;
  netAmount: number;
  payoutMethod: "TELEBIRR" | "CBE" | "AWASH_BANK" | "BANK_OF_ABYSSINIA";
  accountNumber: string;
  accountName: string;
  status: "PENDING" | "PROCESSED" | "REJECTED";
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

export interface AdminRefund {
  id: string;
  reference: string;
  bookingReference: string;
  customerName: string;
  providerName: string;
  serviceTitle: string;
  amount: number;
  reason: string;
  customerReasonDetails: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  decisionDate?: string;
  decisionNotes?: string;
}

export interface AdminSupportTicket {
  id: string;
  ticketNumber: string;
  requesterName: string;
  requesterRole: "CUSTOMER" | "PROVIDER" | "INSPECTOR";
  requesterEmail: string;
  subject: string;
  category: "PAYMENT" | "VERIFICATION" | "TICKET_ISSUE" | "DISPUTE" | "TECHNICAL";
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  messages: {
    sender: string;
    isStaff: boolean;
    message: string;
    timestamp: string;
  }[];
}

export interface AdminAuditLog {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  target: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

export interface AdminSettings {
  // General & Branding
  platformName: string;
  siteName?: string;
  logoUrl?: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  headquartersAddress: string;
  footerEmail?: string;
  footerPhone?: string;
  footerLocation?: string;
  copyrightText?: string;
  operatingRegion: string;
  defaultTimezone: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maintenanceNotice: string;
  allowNewRegistrations: boolean;
  allowGuestCheckout: boolean;

  // Financial & Commissions
  currency: string;
  defaultCommissionRate: number;
  busCommissionRate: number;
  cinemaCommissionRate: number;
  eventCommissionRate: number;
  sportsCommissionRate: number;
  vatTaxRate: number;
  platformServiceFeeETB: number;
  cartHoldDurationMinutes: number;
  maxTicketsPerBooking: number;

  // Payments & Payouts
  telebirrEnabled: boolean;
  telebirrMerchantId: string;
  telebirrAutoSettle: boolean;
  cbeBirrEnabled: boolean;
  cbeBirrMerchantCode: string;
  chapaEnabled: boolean;
  chapaMode: "LIVE" | "TEST";
  minPayoutThresholdETB: number;
  payoutSchedule: "DAILY" | "WEEKLY" | "MANUAL";
  payoutProcessingFeeETB: number;

  // Refunds & Disputes
  autoApproveRefundThreshold: number;
  busCancellationCutoffHours: number;
  cinemaCancellationCutoffHours: number;
  eventCancellationCutoffHours: number;
  sportsCancellationCutoffHours: number;
  cancellationPenaltyRate: number;
  disputeAutoEscalateHours: number;

  // Security & Authentication
  twoFactorRequiredForAdmins: boolean;
  twoFactorRequiredForProviders: boolean;
  sessionTimeoutMinutes: number;
  maxFailedLoginsLockout: number;
  lockoutDurationMinutes: number;
  enforcePasswordComplexity: boolean;
  ipWhitelistingEnabled: boolean;
  whitelistedAdminIPs: string;
  auditLogRetentionDays: number;

  // QR Code & Gate Verification
  qrSignatureAlgorithm: "HMAC_SHA256" | "ECDSA_SECP256K1";
  qrDynamicRotationEnabled: boolean;
  qrRotationIntervalSeconds: number;
  offlineScanWindowHours: number;
  allowDuplicateCheckInOverride: boolean;

  // Notifications & Gateway Integration
  smsGatewayProvider: "ETHIO_TELECOM" | "TWILIO" | "CUSTOM_USSD";
  smsSenderId: string;
  smsTicketReceiptsEnabled: boolean;
  emailReceiptsEnabled: boolean;
  highValueTransactionAlertETB: number;
  systemAlertEmail: string;
}

interface AdminState {
  stats: PlatformStats;
  organizations: AdminOrganization[];
  users: AdminUser[];
  inspectors: AdminInspector[];
  services: AdminService[];
  categories: AdminCategory[];
  bookings: AdminBooking[];
  payouts: AdminPayout[];
  refunds: AdminRefund[];
  supportTickets: AdminSupportTicket[];
  auditLogs: AdminAuditLog[];
  settings: AdminSettings;

  // Actions
  approveOrganization: (id: string) => void;
  rejectOrganization: (id: string, reason: string) => void;
  suspendOrganization: (id: string, reason?: string) => void;
  activateOrganization: (id: string) => void;
  updateOrganizationCommission: (id: string, rate: number) => void;
  verifyDocument: (orgId: string, docId: string, status: "VERIFIED" | "REJECTED", notes?: string) => void;

  toggleUserStatus: (id: string) => void;
  createAdminUser: (data: { name: string; email: string; phone: string; role: "ADMIN" | "INSPECTOR" }) => void;

  toggleInspectorStatus: (id: string) => void;
  updateInspectorAssignment: (id: string, station: string) => void;
  createInspector: (data: {
    badgeId: string;
    name: string;
    email: string;
    phone: string;
    nationalId: string;
    organizationId: string;
    organizationName: string;
    organizationCategory: "BUS" | "CINEMA" | "EVENT" | "SPORTS";
    assignedStation: string;
    deviceModel: string;
    shiftSchedule: string;
  }) => void;

  toggleServiceStatus: (id: string) => void;
  deleteUser: (id: string) => Promise<boolean>;
  deleteOrganization: (id: string) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  createCategory: (payload: {
    name: string;
    slug?: string;
    description?: string;
    commissionRate?: number;
    icon?: string;
  }) => Promise<AdminCategory>;
  updateCategoryCommission: (categoryId: string, rate: number) => Promise<void>;
  updateCategoryDetails: (id: string, payload: Partial<AdminCategory>) => Promise<AdminCategory>;
  toggleCategoryActive: (categoryId: string) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<boolean>;

  processPayout: (id: string, approve: boolean, notes?: string) => void;
  deletePayout: (id: string) => void;
  recordPayout: (payout: AdminPayout) => Promise<void>;
  processRefund: (id: string, approve: boolean, notes?: string) => void;
  replyToSupportTicket: (id: string, reply: string, updateStatus?: "OPEN" | "IN_PROGRESS" | "RESOLVED") => void;
  addBooking: (booking: AdminBooking) => void;
  deleteBooking: (id: string, reference?: string) => Promise<boolean>;

  updateSettings: (newSettings: Partial<AdminSettings>) => void;
  fetchPublicSettings: () => Promise<void>;
  addAuditLog: (entry: Omit<AdminAuditLog, "id" | "timestamp">) => void;
  deleteAuditLogs: (ids: string[]) => Promise<void>;
  clearAllAuditLogs: () => Promise<void>;

  isLoading: boolean;
  fetchPlatformData: () => Promise<void>;
}

const DEFAULT_INITIAL_SETTINGS: AdminSettings = {
  platformName: "TIKORA",
  siteName: "TIKORA",
  logoUrl: "",
  tagline: "Ethiopia's Unified Smart Ticket & Transit Hub",
  supportEmail: "support@tikora.et",
  supportPhone: "+251 11 667 8900",
  headquartersAddress: "Edna Mall Tower, Bole Sub-City, Addis Ababa, Ethiopia",
  footerEmail: "support@tikora.et",
  footerPhone: "+251 11 667 8900",
  footerLocation: "Edna Mall Tower, Bole Sub-City, Addis Ababa, Ethiopia",
  copyrightText: "© 2026 TIKORA Technologies Inc. All Rights Reserved.",
  operatingRegion: "Federal Democratic Republic of Ethiopia",
  defaultTimezone: "Africa/Addis_Ababa (UTC+3)",
  defaultLanguage: "en",
  maintenanceMode: false,
  maintenanceNotice: "System upgrade in progress. Public bookings will resume shortly.",
  allowNewRegistrations: true,
  allowGuestCheckout: true,
  currency: "ETB",
  defaultCommissionRate: 5.0,
  busCommissionRate: 5.0,
  cinemaCommissionRate: 5.0,
  eventCommissionRate: 5.0,
  sportsCommissionRate: 5.0,
  vatTaxRate: 5.0,
  platformServiceFeeETB: 10,
  cartHoldDurationMinutes: 10,
  maxTicketsPerBooking: 8,
  telebirrEnabled: true,
  telebirrMerchantId: "TB-ET-994821",
  telebirrAutoSettle: true,
  cbeBirrEnabled: true,
  cbeBirrMerchantCode: "CBE-BIRR-44018",
  chapaEnabled: true,
  chapaMode: "LIVE",
  minPayoutThresholdETB: 1000,
  payoutSchedule: "DAILY",
  payoutProcessingFeeETB: 25,
  autoApproveRefundThreshold: 300,
  busCancellationCutoffHours: 4,
  cinemaCancellationCutoffHours: 2,
  eventCancellationCutoffHours: 24,
  sportsCancellationCutoffHours: 6,
  cancellationPenaltyRate: 10.0,
  disputeAutoEscalateHours: 48,
  twoFactorRequiredForAdmins: true,
  twoFactorRequiredForProviders: false,
  sessionTimeoutMinutes: 60,
  maxFailedLoginsLockout: 5,
  lockoutDurationMinutes: 15,
  enforcePasswordComplexity: true,
  ipWhitelistingEnabled: false,
  whitelistedAdminIPs: "197.156.103.0/24, 197.156.104.0/24",
  auditLogRetentionDays: 90,
  qrSignatureAlgorithm: "HMAC_SHA256",
  qrDynamicRotationEnabled: true,
  qrRotationIntervalSeconds: 30,
  offlineScanWindowHours: 12,
  allowDuplicateCheckInOverride: false,
  smsGatewayProvider: "ETHIO_TELECOM",
  smsSenderId: "TIKORA",
  smsTicketReceiptsEnabled: true,
  emailReceiptsEnabled: true,
  highValueTransactionAlertETB: 20000,
  systemAlertEmail: "security-alerts@tikora.et",
};

export const DEFAULT_PLATFORM_ORGANIZATIONS: AdminOrganization[] = [
  {
    id: "3",
    name: "Adiss Abeba Stadium",
    category: "SPORTS",
    businessLicense: "LIC-ETH-SPT-2024-003",
    taxNumber: "TIN-0091827364",
    contactPerson: "Addis Stadium Operations",
    email: "stadium@tikora.et",
    phone: "+251991826380",
    address: "Addis Ababa Stadium, Stadium Area, Addis Ababa",
    city: "Addis Ababa",
    status: "APPROVED",
    appliedDate: "2026-01-10T08:00:00.000Z",
    approvedDate: "2026-01-11T10:00:00.000Z",
    commissionRate: 5.0,
    totalServices: 1,
    totalBookings: 4,
    totalRevenue: 4725,
    rating: 4.9,
    documents: [],
  },
  {
    id: "1",
    name: "Selam Bus Lines",
    category: "BUS",
    businessLicense: "BUS-LIC-2024-8891",
    taxNumber: "TIN-0098765432",
    contactPerson: "Selam Bus Dispatch",
    email: "selambus@tikora.et",
    phone: "+251911223344",
    address: "Meskel Square, Addis Ababa",
    city: "Addis Ababa",
    status: "APPROVED",
    appliedDate: "2026-01-05T08:00:00.000Z",
    approvedDate: "2026-01-06T09:00:00.000Z",
    commissionRate: 5.0,
    totalServices: 2,
    totalBookings: 0,
    totalRevenue: 0,
    rating: 4.8,
    documents: [],
  },
  {
    id: "2",
    name: "Century Cinema Multiplex",
    category: "CINEMA",
    businessLicense: "CIN-LIC-2024-5541",
    taxNumber: "TIN-0044556677",
    contactPerson: "Century Cinema Box Office",
    email: "cinema@tikora.et",
    phone: "+251911334455",
    address: "Century Mall, Gurd Shola, Addis Ababa",
    city: "Addis Ababa",
    status: "APPROVED",
    appliedDate: "2026-01-08T08:00:00.000Z",
    approvedDate: "2026-01-09T11:00:00.000Z",
    commissionRate: 5.0,
    totalServices: 2,
    totalBookings: 0,
    totalRevenue: 0,
    rating: 4.7,
    documents: [],
  },
  {
    id: "4",
    name: "Kuriftu Resort & Live Events",
    category: "EVENT",
    businessLicense: "EVT-LIC-2024-1190",
    taxNumber: "TIN-0033221199",
    contactPerson: "Kuriftu Event Coordinator",
    email: "events@tikora.et",
    phone: "+251911778899",
    address: "Bishoftu / Bole Road, Addis Ababa",
    city: "Addis Ababa",
    status: "APPROVED",
    appliedDate: "2026-01-12T08:00:00.000Z",
    approvedDate: "2026-01-13T14:00:00.000Z",
    commissionRate: 5.0,
    totalServices: 1,
    totalBookings: 0,
    totalRevenue: 0,
    rating: 4.9,
    documents: [],
  },
];

const getInitialAdminSettings = (): AdminSettings => {
  return DEFAULT_INITIAL_SETTINGS;
};

const getInitialAdminBookings = (): AdminBooking[] => {
  return [];
};

const getInitialAdminPayouts = (): AdminPayout[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("tikora_admin_payouts");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
};

export const rehydrateAdminStore = () => {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("tikora_platform_settings");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        useAdminStore.setState((prev) => ({
          settings: { ...prev.settings, ...parsed },
        }));
      }
    }
  } catch {}

  try {
    const rawBookings = localStorage.getItem("tikora_admin_bookings");
    if (rawBookings) {
      const parsedBookings = JSON.parse(rawBookings);
      if (Array.isArray(parsedBookings)) {
        // Exclude legacy mock default bookings (bkg-101 .. bkg-108)
        const realOnly = parsedBookings.filter(
          (b: any) =>
            !String(b.id || "").startsWith("bkg-") &&
            !String(b.reference || "").startsWith("TIKORA-BKG-10")
        );
        localStorage.setItem("tikora_admin_bookings", JSON.stringify(realOnly));
        useAdminStore.setState({ bookings: realOnly });
      }
    } else {
      useAdminStore.setState({ bookings: [] });
    }
  } catch {}

  try {
    const rawPayouts = localStorage.getItem("tikora_admin_payouts");
    if (rawPayouts) {
      const parsedPayouts = JSON.parse(rawPayouts);
      if (Array.isArray(parsedPayouts)) {
        useAdminStore.setState({ payouts: parsedPayouts });
      }
    }
  } catch {}
};

export const useAdminStore = create<AdminState>((set, get) => ({
  isLoading: false,

  fetchPlatformData: async () => {
    set({ isLoading: true });
    try {
      const [
        users,
        providers,
        inspectors,
        stats,
        auditLogs,
        services,
        notifs,
        categories,
        bookingsList,
        refundsList,
        supportList,
        settingsData,
      ] = await Promise.all([
        adminService.getUsers().catch(() => []),
        adminService.getProviders().catch(() => []),
        adminService.getInspectors().catch(() => []),
        adminService.getOverview().catch(() => null),
        adminService.getAuditLogs().catch(() => []),
        adminService.getTickets().catch(() => []),
        adminService.getNotifications().catch(() => []),
        adminService.getCategories().catch(() => []),
        adminService.getBookings().catch(() => []),
        adminService.getRefunds().catch(() => []),
        adminService.getSupportTickets().catch(() => []),
        adminService.getSettings().catch(() => null),
      ]);

      let localBookingsList: AdminBooking[] = [];
      const cleanBackendBookings = (Array.isArray(bookingsList) ? bookingsList : []).filter(
        (b: any) =>
          !String(b.id || "").startsWith("bkg-") &&
          !String(b.reference || "").startsWith("TIKORA-BKG-10")
      );
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("tikora_admin_bookings");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              localBookingsList = parsed.filter(
                (b: any) =>
                  !String(b.id || "").startsWith("bkg-") &&
                  !String(b.reference || "").startsWith("TIKORA-BKG-10")
              );
            }
          }
        } catch {}
      }

      // Also query Next.js persistent storage for /api/bookings and /api/admin/payout
      let apiBookings: any[] = [];
      let apiPayouts: any[] = [];
      let hasApiPayouts = false;
      if (typeof window !== "undefined") {
        try {
          const [bRes, pRes] = await Promise.all([
            fetch("/api/bookings").then((r) => r.json()).catch(() => ({})),
            fetch("/api/admin/payout").then((r) => r.json()).catch(() => ({})),
          ]);
          if (bRes && Array.isArray(bRes.bookings)) apiBookings = bRes.bookings;
          if (pRes && Array.isArray(pRes.payouts)) {
            apiPayouts = pRes.payouts;
            hasApiPayouts = true;
          }
        } catch {}
      }

      // Merge and deduplicate all bookings
      const bookingsMap = new Map<string, any>();
      for (const b of [...cleanBackendBookings, ...apiBookings, ...localBookingsList]) {
        if (!b) continue;
        const key = String(b.bookingReference || b.reference || b.id || "");
        if (key && !bookingsMap.has(key)) {
          bookingsMap.set(key, b);
        }
      }
      const finalBookings = Array.from(bookingsMap.values()).filter(
        (b) =>
          !String(b.id || "").startsWith("bkg-") &&
          !String(b.reference || "").startsWith("TIKORA-BKG-10")
      );

      // Determine final authoritative payouts
      // When /api/admin/payout responds, it is the single authoritative source of truth.
      // This stops stale localStorage test payouts from ever overwriting or suppressing real active balances.
      let finalPayouts: AdminPayout[] = [];
      if (hasApiPayouts) {
        finalPayouts = apiPayouts;
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("tikora_admin_payouts", JSON.stringify(apiPayouts));
          } catch {}
        }
      } else {
        const payoutsMap = new Map<string, any>();
        for (const p of [...(get().payouts || [])]) {
          if (!p) continue;
          const key = String(p.reference || p.id || "");
          if (key && !payoutsMap.has(key)) {
            payoutsMap.set(key, p);
          }
        }
        finalPayouts = Array.from(payoutsMap.values());
      }

      // Blacklist of permanently deleted providers
      let deletedOrgIds: string[] = [];
      if (typeof window !== "undefined") {
        try {
          const rawDel = localStorage.getItem("tikora_deleted_providers");
          if (rawDel) deletedOrgIds = JSON.parse(rawDel);
        } catch {}
      }
      const isOrgDeleted = (id?: string, name?: string) => {
        if (!id && !name) return false;
        const cleanId = String(id || "").replace(/^org-/, "").trim().toLowerCase();
        const cleanName = (name || "").trim().toLowerCase();
        return deletedOrgIds.some((d) => {
          const cd = String(d).replace(/^org-/, "").trim().toLowerCase();
          return cd === cleanId || (cleanName && cd === cleanName);
        });
      };

      // Filter out bookings and payouts for permanently deleted providers
      const nonDeletedBookings = finalBookings.filter(
        (b) => !isOrgDeleted(b.providerId || (b as any).ticket?.providerId, b.providerName || (b as any).ticket?.organizer)
      );
      const nonDeletedPayouts = finalPayouts.filter((p) => !isOrgDeleted(p.providerId, p.providerName));

      // Reconcile organizations: defaults + backend providers + any provider from bookings or services
      const orgMap = new Map<string, AdminOrganization>();
      for (const def of DEFAULT_PLATFORM_ORGANIZATIONS) {
        if (!isOrgDeleted(def.id, def.name)) {
          orgMap.set(def.id, { ...def });
        }
      }
      if (Array.isArray(providers) && providers.length > 0) {
        for (const p of providers) {
          if (p && p.id && !isOrgDeleted(p.id, p.name)) {
            const sid = String(p.id);
            orgMap.set(sid, {
              ...(orgMap.get(sid) || {}),
              ...p,
              id: sid,
            });
          }
        }
      }
      for (const b of nonDeletedBookings) {
        const pId = String(b.providerId || (b as any).ticket?.providerId || "").replace(/^org-/, "").trim();
        const pName = (b.providerName || (b as any).ticket?.organizer || "").trim();
        if (pName && !isOrgDeleted(pId, pName)) {
          const matchedOrg = Array.from(orgMap.values()).find(
            (o) => (pId && o.id === pId) || o.name.toLowerCase() === pName.toLowerCase()
          );
          if (matchedOrg) {
            if (pId && matchedOrg.id !== pId) matchedOrg.id = pId;
          } else {
            const newId = pId || `org-${Date.now()}`;
            orgMap.set(newId, {
              id: newId,
              name: pName,
              category: (b.category as any) || "SPORTS",
              businessLicense: "LIC-VERIFIED-ET",
              taxNumber: "TIN-00984120",
              contactPerson: `${pName} Operations`,
              email: `${pName.toLowerCase().replace(/[^a-z0-9]/g, "")}@tikora.et`,
              phone: "+251991826380",
              address: (b as any).ticket?.location || "Addis Ababa",
              city: (b as any).ticket?.city || "Addis Ababa",
              status: "APPROVED",
              appliedDate: new Date().toISOString(),
              approvedDate: new Date().toISOString(),
              commissionRate: Number(b.commissionRate || 5.0),
              totalServices: 1,
              totalBookings: 0,
              totalRevenue: 0,
              rating: 4.9,
              documents: [],
            });
          }
        }
      }
      for (const org of orgMap.values()) {
        const cleanOrgId = String(org.id || "").replace(/^org-/, "").trim().toLowerCase();
        const cleanOrgName = (org.name || "").trim().toLowerCase().replace(/[\s\-_]+/g, "");
        const orgWord = (org.name || "").trim().toLowerCase().split(/\s+/)[0] || "";

        const matchedOrgBookings = nonDeletedBookings.filter((b: any) => {
          if (b.bookingStatus === "CANCELLED" || (b as any).status === "CANCELLED") return false;
          const bProvId = String(b.providerId || b.ticket?.providerId || "").replace(/^org-/, "").trim().toLowerCase();
          const byId = cleanOrgId && bProvId && cleanOrgId === bProvId;

          const rawBName = (b.providerName || b.ticket?.organizer || "").trim().toLowerCase();
          const normBName = rawBName.replace(/[\s\-_]+/g, "");
          const byName =
            cleanOrgName &&
            normBName &&
            (cleanOrgName === normBName ||
              cleanOrgName.includes(normBName) ||
              normBName.includes(cleanOrgName) ||
              cleanOrgName.replace("addis", "adiss") === normBName.replace("addis", "adiss") ||
              cleanOrgName.replace("adiss", "addis") === normBName.replace("adiss", "addis") ||
              (orgWord && rawBName.includes(orgWord)));

          const byCategoryMatch = org.category && b.category === org.category;
          return byId || byName || byCategoryMatch;
        });

        if (matchedOrgBookings.length > 0) {
          const orgGross = matchedOrgBookings.reduce((sum: number, b: any) => sum + (Number(b.customerPaid ?? b.totalAmount) || 0), 0);
          org.totalBookings = matchedOrgBookings.length;
          org.totalRevenue = orgGross;
        }
      }

      const reconciledOrgs = Array.from(orgMap.values());

      const computedGMV = nonDeletedBookings.reduce((sum: number, b: any) => sum + (Number(b.customerPaid ?? b.totalAmount) || 0), 0);
      const computedRev = nonDeletedBookings.reduce((sum: number, b: any) => sum + (Number(b.platformFee) || 0), 0);
      const computedRefunds = refundsList.filter((r: any) => r.status === "PENDING").length;

      // Accurately reconcile booked counts per service from confirmed bookings
      const bookingCountsByTitle = new Map<string, number>();
      const bookingCountsById = new Map<string, number>();

      for (const b of finalBookings) {
        if (b.bookingStatus === "CANCELLED" || (b as any).status === "CANCELLED") continue;
        const qty = Number(b.quantity) || (Array.isArray(b.seatNumbers) ? b.seatNumbers.length : 1);
        if (b.serviceTitle) {
          const tKey = b.serviceTitle.toLowerCase().trim();
          bookingCountsByTitle.set(tKey, (bookingCountsByTitle.get(tKey) || 0) + qty);
        }
        if ((b as any).ticketId) {
          bookingCountsById.set(String((b as any).ticketId), (bookingCountsById.get(String((b as any).ticketId)) || 0) + qty);
        }
      }

      const reconciledServices = services.map((s) => {
        const titleKey = s.title.toLowerCase().trim();
        const bookedByTitle = bookingCountsByTitle.get(titleKey) || 0;
        const bookedById = bookingCountsById.get(String(s.id)) || 0;
        const totalSold = Math.max(bookedByTitle, bookedById);
        const capacity = Number(s.capacity || 100);
        const remainingCapacity = Math.max(0, capacity - totalSold);
        return {
          ...s,
          totalSold,
          remainingCapacity,
          availableSeats: remainingCapacity,
          status: remainingCapacity === 0 ? ("SOLD_OUT" as const) : s.status,
        };
      });

      set((state) => ({
        users: users.length > 0 ? users : state.users,
        organizations: reconciledOrgs,
        inspectors: inspectors.length > 0 ? inspectors : state.inspectors,
        stats: {
          ...state.stats,
          ...(stats || {}),
          totalBookings: nonDeletedBookings.length,
          totalGMV: computedGMV,
          platformRevenue: computedRev,
          refundsRequested: Math.max(computedRefunds, stats?.refundsRequested || 0),
          totalUsers: users.length > 0 ? users.length : state.stats.totalUsers,
          activeProviders: reconciledOrgs.filter((p: any) => p.status === "APPROVED").length || state.stats.activeProviders,
          pendingApprovals: reconciledOrgs.filter((p: any) => p.status === "PENDING").length || state.stats.pendingApprovals,
          activeTickets: reconciledServices.length > 0 ? reconciledServices.length : state.stats.activeTickets,
          activeInspectors: inspectors.filter((i: any) => i.status === "ACTIVE").length || state.stats.activeInspectors,
        },
        auditLogs: auditLogs.length > 0 ? auditLogs : state.auditLogs,
        services: reconciledServices.length > 0 ? reconciledServices : state.services,
        categories: categories.length > 0 ? categories : state.categories,
        bookings: nonDeletedBookings,
        payouts: nonDeletedPayouts,
        refunds: refundsList.length > 0 ? refundsList : state.refunds,
        supportTickets: supportList.length > 0 ? supportList : state.supportTickets,
        settings: (() => {
          const s = settingsData ? { ...state.settings, ...settingsData } : state.settings;
          if (typeof window !== "undefined" && settingsData) {
            try {
              localStorage.setItem("tikora_platform_settings", JSON.stringify(s));
              window.dispatchEvent(new CustomEvent("tikora_settings_updated", { detail: s }));
            } catch {}
          }
          return s;
        })(),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to load platform data:", error);
      set({ isLoading: false });
    }
  },

  stats: {
    totalGMV: 0,
    platformRevenue: 0,
    totalBookings: 0,
    activeProviders: 0,
    pendingApprovals: 0,
    totalUsers: 0,
    activeTickets: 0,
    activeInspectors: 0,
    refundsRequested: 0,
  },

  organizations: DEFAULT_PLATFORM_ORGANIZATIONS,
  users: [],
  inspectors: [],
  services: [],

  categories: [
    {
      id: "cat-1",
      name: "Intercity Bus & Coach",
      slug: "bus",
      category: "BUS",
      commissionRate: 5.0,
      totalProviders: 0,
      totalBookings: 0,
      isActive: true,
      description: "Intercity scheduled transport, express luxury coaches, cross-regional routes.",
    },
    {
      id: "cat-2",
      name: "Cinema & Movie Theaters",
      slug: "cinema",
      category: "CINEMA",
      commissionRate: 5.0,
      totalProviders: 0,
      totalBookings: 0,
      isActive: true,
      description: "Multiplex cinemas, film premieres, reserved theater seating.",
    },
    {
      id: "cat-3",
      name: "Live Concerts & Events",
      slug: "event",
      category: "EVENT",
      commissionRate: 6.0,
      totalProviders: 0,
      totalBookings: 0,
      isActive: true,
      description: "Music concerts, cultural festivals, comedy shows, and corporate expos.",
    },
    {
      id: "cat-4",
      name: "Sports & Stadium Tournaments",
      slug: "sports",
      category: "SPORTS",
      commissionRate: 4.5,
      totalProviders: 0,
      totalBookings: 0,
      isActive: true,
      description: "Premier League football fixtures, basketball finals, athletics competitions.",
    },
  ],

  bookings: getInitialAdminBookings(),
  payouts: getInitialAdminPayouts(),
  refunds: [],
  supportTickets: [],
  auditLogs: [],

  settings: getInitialAdminSettings(),

  approveOrganization: (id: string) => {
    const org = get().organizations.find((o) => o.id === id);
    const orgName = org?.name || id;

    set((state) => ({
      organizations: state.organizations.map((o) =>
        o.id === id
          ? {
              ...o,
              status: "APPROVED",
              approvedDate: new Date().toISOString().split("T")[0],
              documents: o.documents.map((d) => ({ ...d, status: "VERIFIED" })),
            }
          : o
      ),
      stats: {
        ...state.stats,
        activeProviders: state.stats.activeProviders + 1,
        pendingApprovals: Math.max(0, state.stats.pendingApprovals - 1),
      },
    }));

    adminService.updateProviderStatus(id, "APPROVED").catch((err) => {
      console.error("Failed to approve provider on backend:", err);
    });

    get().addAuditLog({
      action: "ORGANIZATION_APPROVED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: orgName,
      details: `Super Admin approved organization application and verified commercial documents.`,
      ipAddress: "197.156.104.22",
      severity: "INFO",
    });
  },

  rejectOrganization: (id: string, reason: string) => {
    const org = get().organizations.find((o) => o.id === id);
    const orgName = org?.name || id;

    set((state) => ({
      organizations: state.organizations.map((o) =>
        o.id === id ? { ...o, status: "REJECTED", rejectionReason: reason } : o
      ),
      stats: {
        ...state.stats,
        pendingApprovals: Math.max(0, state.stats.pendingApprovals - 1),
      },
    }));

    adminService.updateProviderStatus(id, "REJECTED").catch((err) => {
      console.error("Failed to reject provider on backend:", err);
    });

    get().addAuditLog({
      action: "ORGANIZATION_REJECTED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: orgName,
      details: `Super Admin rejected organization application. Reason: ${reason}`,
      ipAddress: "197.156.104.22",
      severity: "WARNING",
    });
  },

  suspendOrganization: (id: string, reason?: string) => {
    const org = get().organizations.find((o) => o.id === id);
    const orgName = org?.name || id;

    set((state) => ({
      organizations: state.organizations.map((o) =>
        o.id === id ? { ...o, status: "SUSPENDED", rejectionReason: reason } : o
      ),
      stats: {
        ...state.stats,
        activeProviders: Math.max(0, state.stats.activeProviders - 1),
      },
    }));

    adminService.updateProviderStatus(id, "SUSPENDED").catch((err) => {
      console.error("Failed to suspend provider on backend:", err);
    });

    get().addAuditLog({
      action: "ORGANIZATION_SUSPENDED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: orgName,
      details: `Super Admin suspended organization operations. Reason: ${reason || "Policy violation"}`,
      ipAddress: "197.156.104.22",
      severity: "CRITICAL",
    });
  },

  activateOrganization: (id: string) => {
    const org = get().organizations.find((o) => o.id === id);
    const orgName = org?.name || id;

    set((state) => ({
      organizations: state.organizations.map((o) =>
        o.id === id ? { ...o, status: "APPROVED", rejectionReason: undefined } : o
      ),
      stats: {
        ...state.stats,
        activeProviders: state.stats.activeProviders + 1,
      },
    }));

    adminService.updateProviderStatus(id, "APPROVED").catch((err) => {
      console.error("Failed to reactivate provider on backend:", err);
    });

    get().addAuditLog({
      action: "ORGANIZATION_REACTIVATED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: orgName,
      details: `Super Admin restored active status to organization.`,
      ipAddress: "197.156.104.22",
      severity: "INFO",
    });
  },

  updateOrganizationCommission: (id: string, rate: number) => {
    const org = get().organizations.find((o) => o.id === id);
    set((state) => ({
      organizations: state.organizations.map((o) =>
        o.id === id ? { ...o, commissionRate: rate } : o
      ),
    }));

    get().addAuditLog({
      action: "COMMISSION_UPDATED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: org?.name || id,
      details: `Commission rate adjusted to ${rate}%.`,
      ipAddress: "197.156.104.22",
      severity: "INFO",
    });
  },

  verifyDocument: (orgId: string, docId: string, status: "VERIFIED" | "REJECTED", notes?: string) => {
    set((state) => ({
      organizations: state.organizations.map((o) =>
        o.id === orgId
          ? {
              ...o,
              documents: o.documents.map((d) =>
                d.id === docId ? { ...d, status, notes } : d
              ),
            }
          : o
      ),
    }));
  },

  toggleUserStatus: async (id: string) => {
    const user = get().users.find((u) => u.id === id);
    if (!user) return;
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
    }));

    try {
      await adminService.toggleUserStatus(id, user.status);
    } catch (err) {
      console.error("Failed to toggle status on server:", err);
      // rollback
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, status: user.status } : u)),
      }));
    }

    get().addAuditLog({
      action: newStatus === "ACTIVE" ? "USER_ACTIVATED" : "USER_SUSPENDED",
      actorName: "System Admin",
      actorRole: "ADMIN",
      target: `${user.name} (${user.email})`,
      details: `User account status modified to ${newStatus}.`,
      ipAddress: "127.0.0.1",
      severity: newStatus === "ACTIVE" ? "INFO" : "WARNING",
    });
  },

  createAdminUser: async (data) => {
    try {
      const createdUser = await adminService.createUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      });

      set((state) => ({
        users: [createdUser, ...state.users.filter((u) => u.email !== createdUser.email)],
        stats: {
          ...state.stats,
          totalUsers: state.stats.totalUsers + 1,
        },
      }));
    } catch (err) {
      console.error("Failed to create user on backend:", err);
      throw err;
    }
  },

  toggleInspectorStatus: (id: string) => {
    const inspector = get().inspectors.find((i) => i.id === id);
    if (!inspector) return;
    const nextStatus = inspector.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    set((state) => ({
      inspectors: state.inspectors.map((i) =>
        i.id === id ? { ...i, status: nextStatus } : i
      ),
    }));
    get().addAuditLog({
      action: "INSPECTOR_STATUS_CHANGED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: `${inspector.name} (${inspector.badgeId})`,
      details: `Inspector account transitioned from ${inspector.status} to ${nextStatus}.`,
      ipAddress: "197.156.104.22",
      severity: nextStatus === "SUSPENDED" ? "WARNING" : "INFO",
    });
  },

  updateInspectorAssignment: (id: string, station: string) => {
    const inspector = get().inspectors.find((i) => i.id === id);
    if (!inspector) return;
    set((state) => ({
      inspectors: state.inspectors.map((i) =>
        i.id === id ? { ...i, assignedStation: station } : i
      ),
    }));
    get().addAuditLog({
      action: "INSPECTOR_REASSIGNED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: `${inspector.name} (${inspector.badgeId})`,
      details: `Reassigned gate station to '${station}' for ${inspector.organizationName}.`,
      ipAddress: "197.156.104.22",
      severity: "INFO",
    });
  },

  createInspector: (data) => {
    const newInspector: AdminInspector = {
      id: `ins-${Date.now()}`,
      badgeId: data.badgeId || `INS-ET-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      nationalId: data.nationalId || `ET-FAN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      organizationCategory: data.organizationCategory,
      assignedStation: data.assignedStation,
      addedBy: {
        name: "Peter SuperAdmin",
        email: "admin@tikora.et",
        role: "Super Administrator",
      },
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      lastActive: "Just now",
      status: "ACTIVE",
      totalScans: 0,
      validScans: 0,
      flaggedScans: 0,
      deviceModel: data.deviceModel || "Sunmi V2 Pro Android POS Scanner",
      appVersion: "Tikora Gate v2.4.1",
      shiftSchedule: data.shiftSchedule || "Morning Shift: 08:00 - 16:00",
    };

    set((state) => ({
      inspectors: [newInspector, ...state.inspectors],
      stats: {
        ...state.stats,
        activeInspectors: state.stats.activeInspectors + 1,
      },
    }));

    get().addAuditLog({
      action: "INSPECTOR_PROVISIONED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: `${newInspector.name} (${newInspector.badgeId})`,
      details: `Provisioned field inspector for ${newInspector.organizationName} at ${newInspector.assignedStation}.`,
      ipAddress: "197.156.104.22",
      severity: "INFO",
    });
  },

  toggleServiceStatus: async (id: string) => {
    const service = get().services.find((s) => s.id === id);
    if (!service) return;

    const nextStatus = service.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, status: nextStatus } : s)),
    }));

    try {
      await adminService.toggleTicketStatus(id, service.status);
    } catch (err) {
      console.warn("Could not sync ticket status to backend, keeping local state:", err);
    }

    get().addAuditLog({
      action: nextStatus === "ACTIVE" ? "SERVICE_ACTIVATED" : "SERVICE_DEACTIVATED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: `${service.title} (${service.category})`,
      details: `Service #${service.id} status transitioned to ${nextStatus}.`,
      ipAddress: "127.0.0.1",
      severity: nextStatus === "INACTIVE" ? "WARNING" : "INFO",
    });
  },

  deleteUser: async (id: string) => {
    const user = get().users.find((u) => u.id === id);
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
      stats: {
        ...state.stats,
        totalUsers: Math.max(0, state.stats.totalUsers - 1),
      },
    }));

    try {
      await adminService.deleteUser(id);
    } catch (err) {
      console.warn("Could not delete user on backend:", err);
    }

    get().addAuditLog({
      action: "USER_DELETED_PERMANENTLY",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: user ? `${user.name} (${user.email})` : `User #${id}`,
      details: `User account #${id} was permanently deleted by Super Admin.`,
      ipAddress: "127.0.0.1",
      severity: "WARNING",
    });

    return true;
  },

  deleteOrganization: async (id: string) => {
    const org = get().organizations.find((o) => o.id === id);
    const orgName = org?.name || "";
    const cleanId = String(id).replace(/^org-/, "").trim();

    // 1. Record in persistent deleted providers blacklist so it is never resurrected
    if (typeof window !== "undefined") {
      try {
        const rawDel = localStorage.getItem("tikora_deleted_providers");
        const list: string[] = rawDel ? JSON.parse(rawDel) : [];
        if (!list.includes(cleanId)) list.push(cleanId);
        if (orgName && !list.includes(orgName.toLowerCase())) list.push(orgName.toLowerCase());
        localStorage.setItem("tikora_deleted_providers", JSON.stringify(list));
      } catch {}
    }

    // 2. Remove all bookings for this provider from localStorage & API
    if (typeof window !== "undefined") {
      try {
        const rawB = localStorage.getItem("tikora_admin_bookings");
        if (rawB) {
          const parsed = JSON.parse(rawB);
          if (Array.isArray(parsed)) {
            const rem = parsed.filter(
              (b: any) =>
                String(b.providerId || b.ticket?.providerId || "").replace(/^org-/, "") !== cleanId &&
                (!orgName || (b.providerName || b.ticket?.organizer || "").toLowerCase() !== orgName.toLowerCase())
            );
            localStorage.setItem("tikora_admin_bookings", JSON.stringify(rem));
          }
        }
      } catch {}
      try {
        const rawPB = localStorage.getItem("tikora_provider_bookings");
        if (rawPB) {
          const parsed = JSON.parse(rawPB);
          if (Array.isArray(parsed)) {
            const rem = parsed.filter(
              (b: any) =>
                String(b.providerId || b.ticket?.providerId || "").replace(/^org-/, "") !== cleanId &&
                (!orgName || (b.providerName || b.ticket?.organizer || "").toLowerCase() !== orgName.toLowerCase())
            );
            localStorage.setItem("tikora_provider_bookings", JSON.stringify(rem));
          }
        }
      } catch {}
    }
    fetch(`/api/bookings?providerId=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});

    // 3. Remove all payouts for this provider
    if (typeof window !== "undefined") {
      try {
        const rawP = localStorage.getItem("tikora_admin_payouts");
        if (rawP) {
          const parsed = JSON.parse(rawP);
          if (Array.isArray(parsed)) {
            const rem = parsed.filter((p: any) => String(p.providerId || "").replace(/^org-/, "") !== cleanId);
            localStorage.setItem("tikora_admin_payouts", JSON.stringify(rem));
          }
        }
      } catch {}
    }
    fetch(`/api/admin/payout?providerId=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});

    // 4. Update memory state
    const remainingBookings = get().bookings.filter(
      (b: any) =>
        String(b.providerId || b.ticket?.providerId || "").replace(/^org-/, "") !== cleanId &&
        (!orgName || (b.providerName || b.ticket?.organizer || "").toLowerCase() !== orgName.toLowerCase())
    );
    const remainingPayouts = (get().payouts || []).filter(
      (p: any) => String(p.providerId || "").replace(/^org-/, "") !== cleanId
    );

    const newGMV = remainingBookings.reduce((sum, b) => sum + (Number(b.customerPaid ?? b.totalAmount) || 0), 0);
    const newRev = remainingBookings.reduce((sum, b) => sum + (Number(b.platformFee) || 0), 0);

    set((state) => ({
      organizations: state.organizations.filter((o) => o.id !== id && String(o.id).replace(/^org-/, "") !== cleanId),
      services: state.services.filter((s) => s.providerId !== id && String(s.providerId).replace(/^org-/, "") !== cleanId),
      bookings: remainingBookings,
      payouts: remainingPayouts,
      stats: {
        ...state.stats,
        activeProviders: Math.max(0, state.stats.activeProviders - 1),
        totalBookings: remainingBookings.length,
        totalGMV: newGMV,
        platformRevenue: newRev,
      },
    }));

    try {
      await adminService.deleteProvider(id);
    } catch (err) {
      console.warn("Could not delete provider on backend:", err);
    }

    get().addAuditLog({
      action: "PROVIDER_DELETED_PERMANENTLY",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: org ? org.name : `Provider #${id}`,
      details: `Provider organization #${id} and all associated offerings, bookings, and financial balances were permanently deleted by Super Admin.`,
      ipAddress: "127.0.0.1",
      severity: "WARNING",
    });

    return true;
  },

  deleteBooking: async (id: string, reference?: string) => {
    const targetRef = reference || id;
    const cleanId = String(id).trim().toLowerCase();
    const cleanRef = String(targetRef).trim().toLowerCase();

    // 1. Update localStorage tikora_admin_bookings
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tikora_admin_bookings");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const rem = parsed.filter((b: any) => {
              const bId = String(b.id || "").trim().toLowerCase();
              const bRef = String(b.bookingReference || b.reference || "").trim().toLowerCase();
              return bId !== cleanId && bRef !== cleanRef && bId !== cleanRef;
            });
            localStorage.setItem("tikora_admin_bookings", JSON.stringify(rem));
          }
        }
      } catch {}
      try {
        const rawP = localStorage.getItem("tikora_provider_bookings");
        if (rawP) {
          const parsed = JSON.parse(rawP);
          if (Array.isArray(parsed)) {
            const rem = parsed.filter((b: any) => {
              const bId = String(b.id || "").trim().toLowerCase();
              const bRef = String(b.bookingReference || b.reference || "").trim().toLowerCase();
              return bId !== cleanId && bRef !== cleanRef && bId !== cleanRef;
            });
            localStorage.setItem("tikora_provider_bookings", JSON.stringify(rem));
          }
        }
      } catch {}
    }

    // 2. Call backend / persistent API
    try {
      await adminService.deleteBooking(id, reference);
    } catch (err) {
      console.warn("Failed to delete booking via API:", err);
    }

    // 3. Update store state
    const currentBookings = get().bookings;
    const remaining = currentBookings.filter((b) => {
      const bId = String(b.id || "").trim().toLowerCase();
      const bRef = String(b.bookingReference || (b as any).reference || "").trim().toLowerCase();
      return bId !== cleanId && bRef !== cleanRef && bId !== cleanRef;
    });

    const newGMV = remaining.reduce((sum, b) => sum + (Number(b.customerPaid ?? b.totalAmount) || 0), 0);
    const newRev = remaining.reduce((sum, b) => sum + (Number(b.platformFee) || 0), 0);

    set((state) => ({
      bookings: remaining,
      stats: {
        ...state.stats,
        totalBookings: remaining.length,
        totalGMV: newGMV,
        platformRevenue: newRev,
      },
    }));

    get().addAuditLog({
      action: "BOOKING_DELETED_PERMANENTLY",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: targetRef,
      details: `Booking ${targetRef} was permanently deleted by Super Admin.`,
      ipAddress: "127.0.0.1",
      severity: "WARNING",
    });

    return true;
  },

  deleteService: async (id: string) => {
    const srv = get().services.find((s) => s.id === id);
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
      stats: {
        ...state.stats,
        activeTickets: Math.max(0, state.stats.activeTickets - 1),
      },
    }));

    try {
      await adminService.deleteTicket(id);
    } catch (err) {
      console.warn("Could not delete ticket on backend:", err);
    }

    get().addAuditLog({
      action: "TICKET_DELETED_PERMANENTLY",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: srv ? `${srv.title} (${srv.category})` : `Ticket #${id}`,
      details: `Ticket listing #${id} was permanently deleted by Super Admin.`,
      ipAddress: "127.0.0.1",
      severity: "WARNING",
    });

    return true;
  },

  createCategory: async (payload) => {
    try {
      const created = await adminService.createCategory(payload);
      set((state) => ({
        categories: [...state.categories, created],
      }));
      get().addAuditLog({
        action: "CATEGORY_CREATED",
        actorName: "Peter SuperAdmin",
        actorRole: "SUPER_ADMIN",
        target: `${created.name} (/${created.slug})`,
        details: `Created new category "${created.name}" with commission ${created.commissionRate}%.`,
        ipAddress: "127.0.0.1",
        severity: "INFO",
      });
      return created;
    } catch (err) {
      console.error("Failed to create category on backend:", err);
      throw err;
    }
  },

  updateCategoryCommission: async (categoryId: string, rate: number) => {
    const cat = get().categories.find((c) => c.id === categoryId);
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId ? { ...c, commissionRate: rate } : c
      ),
    }));

    try {
      await adminService.updateCategory(categoryId, { commissionRate: rate });
    } catch (err) {
      console.warn("Could not sync category commission to backend:", err);
    }

    get().addAuditLog({
      action: "COMMISSION_UPDATED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: cat?.name || categoryId,
      details: `Commission rate adjusted to ${rate}% in database.`,
      ipAddress: "127.0.0.1",
      severity: "INFO",
    });
  },

  updateCategoryDetails: async (id: string, payload: Partial<AdminCategory>) => {
    try {
      const updated = await adminService.updateCategory(id, payload);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? { ...c, ...updated } : c)),
      }));

      get().addAuditLog({
        action: "CATEGORY_UPDATED",
        actorName: "Peter SuperAdmin",
        actorRole: "SUPER_ADMIN",
        target: `${updated.name} (/${updated.slug})`,
        details: `Updated category #${id} details in database.`,
        ipAddress: "127.0.0.1",
        severity: "INFO",
      });

      return updated;
    } catch (err) {
      console.error("Failed to update category details:", err);
      throw err;
    }
  },

  toggleCategoryActive: async (categoryId: string) => {
    const cat = get().categories.find((c) => c.id === categoryId);
    if (!cat) return;
    const nextActive = !cat.isActive;

    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId ? { ...c, isActive: nextActive } : c
      ),
    }));

    try {
      await adminService.updateCategory(categoryId, { isActive: nextActive });
      TicketService.fetchCategories().catch(() => {});
      TicketService.fetchTickets().catch(() => {});
    } catch (err) {
      console.warn("Could not sync category active state to backend:", err);
    }

    get().addAuditLog({
      action: nextActive ? "CATEGORY_ACTIVATED" : "CATEGORY_DEACTIVATED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: cat.name,
      details: `Category "${cat.name}" transitioned to ${nextActive ? "ACTIVE" : "DISABLED"} in database.`,
      ipAddress: "127.0.0.1",
      severity: nextActive ? "INFO" : "WARNING",
    });
  },

  deleteCategory: async (categoryId: string) => {
    const cat = get().categories.find((c) => c.id === categoryId);
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== categoryId),
    }));

    try {
      await adminService.deleteCategory(categoryId);
      TicketService.fetchCategories().catch(() => {});
      TicketService.fetchTickets().catch(() => {});
    } catch (err) {
      console.warn("Could not delete category on backend:", err);
      throw err;
    }

    get().addAuditLog({
      action: "CATEGORY_DELETED_PERMANENTLY",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: cat ? cat.name : `Category #${categoryId}`,
      details: `Permanently deleted category "${cat?.name || categoryId}" from database.`,
      ipAddress: "127.0.0.1",
      severity: "WARNING",
    });

    return true;
  },

  processPayout: (id: string, approve: boolean, notes?: string) => {
    const payout = get().payouts.find((p) => p.id === id);
    if (!payout) return;

    const nextStatus = approve ? "PROCESSED" : "REJECTED";

    set((state) => ({
      payouts: state.payouts.map((p) =>
        p.id === id
          ? {
              ...p,
              status: nextStatus,
              processedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              notes: notes || (approve ? "Disbursed via automated bank gateway." : "Payout rejected by admin."),
            }
          : p
      ),
    }));

    get().addAuditLog({
      action: approve ? "PAYOUT_PROCESSED" : "PAYOUT_REJECTED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: `${payout.reference} (${payout.providerName})`,
      details: `${approve ? "Approved and disbursed" : "Declined"} payout of ETB ${payout.netAmount.toLocaleString()}. Notes: ${notes || "None"}`,
      ipAddress: "197.156.104.22",
      severity: approve ? "INFO" : "WARNING",
    });
  },

  deletePayout: (id: string) => {
    const payout = get().payouts.find((p) => p.id === id);
    if (!payout) return;

    set((state) => ({
      payouts: state.payouts.filter((p) => p.id !== id),
    }));

    get().addAuditLog({
      action: "PAYOUT_RECORD_DELETED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: `${payout.reference} (${payout.providerName})`,
      details: `Permanently removed settlement payout record for ${payout.providerName}. Amount: ETB ${payout.netAmount.toLocaleString()}`,
      ipAddress: "197.156.104.22",
      severity: "WARNING",
    });
  },

  recordPayout: async (payout: AdminPayout) => {
    set((state) => {
      const updated = [payout, ...state.payouts.filter((p) => p.id !== payout.id && p.reference !== payout.reference)];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tikora_admin_payouts", JSON.stringify(updated));
        } catch {}
      }
      return { payouts: updated };
    });

    if (typeof window !== "undefined") {
      try {
        fetch("/api/admin/payout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payout),
        }).catch(() => {});
      } catch {}
    }

    get().addAuditLog({
      action: "PAYOUT_PROCESSED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: `${payout.reference} (${payout.providerName})`,
      details: `Transferred and settled payout of ETB ${payout.netAmount.toLocaleString()} to ${payout.providerName} via Chapa.`,
      ipAddress: "197.156.104.22",
      severity: "INFO",
    });
  },

  processRefund: (id: string, approve: boolean, notes?: string) => {
    const refund = get().refunds.find((r) => r.id === id);
    if (!refund) return;

    const nextStatus = approve ? "APPROVED" : "REJECTED";

    set((state) => ({
      refunds: state.refunds.map((r) =>
        r.id === id
          ? {
              ...r,
              status: nextStatus,
              decisionDate: new Date().toISOString().replace("T", " ").substring(0, 16),
              decisionNotes: notes || (approve ? "Approved by Super Admin policy." : "Declined after investigation."),
            }
          : r
      ),
      stats: {
        ...state.stats,
        refundsRequested: Math.max(0, state.stats.refundsRequested - 1),
      },
    }));

    get().addAuditLog({
      action: approve ? "REFUND_APPROVED" : "REFUND_REJECTED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: `${refund.reference} (${refund.customerName})`,
      details: `${approve ? "Approved refund" : "Rejected refund"} of ETB ${refund.amount} for booking ${refund.bookingReference}.`,
      ipAddress: "197.156.104.22",
      severity: approve ? "WARNING" : "INFO",
    });
  },

  replyToSupportTicket: (id: string, reply: string, updateStatus?: "OPEN" | "IN_PROGRESS" | "RESOLVED") => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    set((state) => ({
      supportTickets: state.supportTickets.map((t) =>
        t.id === id
          ? {
              ...t,
              status: updateStatus || t.status,
              messages: [
                ...t.messages,
                {
                  sender: "TIKORA Staff (Super Admin)",
                  isStaff: true,
                  message: reply,
                  timestamp: now,
                },
              ],
            }
          : t
      ),
    }));
  },

  addBooking: (booking: AdminBooking) => {
    const currentSettings = get().settings;
    const catObj = get().categories.find((c) => c.category === booking.category);
    let defaultCatRate = currentSettings.defaultCommissionRate ?? 5.0;
    if (booking.category === "BUS") defaultCatRate = currentSettings.busCommissionRate ?? defaultCatRate;
    else if (booking.category === "CINEMA") defaultCatRate = currentSettings.cinemaCommissionRate ?? defaultCatRate;
    else if (booking.category === "EVENT") defaultCatRate = currentSettings.eventCommissionRate ?? defaultCatRate;
    else if (booking.category === "SPORTS") defaultCatRate = currentSettings.sportsCommissionRate ?? defaultCatRate;

    const snapVatRate = Number(booking.vatRate ?? currentSettings.vatTaxRate ?? 5.0);
    const snapCommissionRate = Number(booking.commissionRate ?? catObj?.commissionRate ?? defaultCatRate);
    const customerPaid = Number(booking.customerPaid ?? booking.totalAmount) || 0;

    let vatAmount = Number(booking.vatAmount);
    if (!vatAmount && customerPaid > 0) {
      if (booking.subtotal && booking.subtotal < customerPaid) {
        vatAmount = Math.round((customerPaid - booking.subtotal) * 100) / 100;
      } else {
        const computedBase = Math.round((customerPaid / (1 + snapVatRate / 100)) * 100) / 100;
        vatAmount = Math.max(0, Math.round((customerPaid - computedBase) * 100) / 100);
      }
    }

    const preTaxBase = Math.max(0, Math.round((customerPaid - vatAmount) * 100) / 100);
    const platformFee = Number(booking.platformFee ?? Math.round(preTaxBase * (snapCommissionRate / 100) * 100) / 100);
    const providerNet = Number(booking.providerNet ?? booking.providerPayout ?? Math.max(0, Math.round((preTaxBase - platformFee) * 100) / 100));

    const snapshottedBooking: AdminBooking = {
      ...booking,
      customerPaid,
      totalAmount: customerPaid,
      subtotal: preTaxBase,
      baseFare: preTaxBase,
      vatAmount,
      vatRate: snapVatRate,
      commissionRate: snapCommissionRate,
      platformFee,
      providerNet,
      providerPayout: providerNet,
    };

    set((state) => {
      const existingIdx = state.bookings.findIndex(
        (b) => b.reference === snapshottedBooking.reference || b.id === snapshottedBooking.id
      );
      let updatedBookings: AdminBooking[];
      if (existingIdx >= 0) {
        updatedBookings = [...state.bookings];
        updatedBookings[existingIdx] = { ...updatedBookings[existingIdx], ...snapshottedBooking };
      } else {
        updatedBookings = [snapshottedBooking, ...state.bookings];
      }

      // Automatically decrement available seats and increment totalSold for matching ticket service
      const updatedServices = state.services.map((s) => {
        if (s.title === snapshottedBooking.serviceTitle || (snapshottedBooking.id && s.id === snapshottedBooking.id)) {
          const currentAvailable = Number(s.availableSeats ?? 50);
          const newAvailable = Math.max(0, currentAvailable - (snapshottedBooking.quantity || 1));
          return {
            ...s,
            availableSeats: newAvailable,
            totalSold: (s.totalSold || 0) + (snapshottedBooking.quantity || 1),
            status: newAvailable === 0 ? ("SOLD_OUT" as const) : s.status,
          };
        }
        return s;
      });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tikora_admin_bookings", JSON.stringify(updatedBookings));
        } catch {}
      }

      return {
        bookings: updatedBookings,
        services: updatedServices,
        stats: {
          ...state.stats,
          totalBookings: updatedBookings.length,
          totalGMV: updatedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        },
      };
    });
  },

  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    const updatedCategories = get().categories.map((c) => {
      if (c.category === "BUS" && newSettings.busCommissionRate !== undefined) {
        return { ...c, commissionRate: Number(newSettings.busCommissionRate) };
      }
      if (c.category === "CINEMA" && newSettings.cinemaCommissionRate !== undefined) {
        return { ...c, commissionRate: Number(newSettings.cinemaCommissionRate) };
      }
      if (c.category === "EVENT" && newSettings.eventCommissionRate !== undefined) {
        return { ...c, commissionRate: Number(newSettings.eventCommissionRate) };
      }
      if (c.category === "SPORTS" && newSettings.sportsCommissionRate !== undefined) {
        return { ...c, commissionRate: Number(newSettings.sportsCommissionRate) };
      }
      return c;
    });

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("tikora_platform_settings", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("tikora_settings_updated", { detail: updated }));
      } catch {}
    }

    set(() => ({
      settings: updated,
      categories: updatedCategories,
    }));

    // Asynchronously persist to backend API & PostgreSQL audit ledger
    adminService.updateSettings(newSettings).catch((err) => {
      console.warn("Could not persist settings to backend:", err);
    });

    get().addAuditLog({
      action: "PLATFORM_SETTINGS_UPDATED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: "System Configuration",
      details: "Super Admin updated platform configuration values.",
      ipAddress: "197.156.104.22",
      severity: "WARNING",
    });
  },

  fetchPublicSettings: async () => {
    try {
      const data = await adminService.getPublicSettings();
      if (data && Object.keys(data).length > 0) {
        const merged = { ...get().settings, ...data };
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("tikora_platform_settings", JSON.stringify(merged));
            window.dispatchEvent(new CustomEvent("tikora_settings_updated", { detail: merged }));
          } catch {}
        }
        set({ settings: merged });
      }
    } catch (e) {
      console.warn("Failed to fetch public settings:", e);
    }
  },

  addAuditLog: (entry) => {
    const newLog: AdminAuditLog = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    set((state) => ({
      auditLogs: [newLog, ...state.auditLogs],
    }));

    // Asynchronously persist to backend PostgreSQL database
    adminService.createAuditLog(entry).catch((err) => {
      console.warn("Could not persist audit log to DB:", err);
    });
  },

  deleteAuditLogs: async (ids: string[]) => {
    set((state) => ({
      auditLogs: state.auditLogs.filter((l) => !ids.includes(l.id)),
    }));
    await adminService.deleteAuditLogs(ids).catch(() => {});
  },

  clearAllAuditLogs: async () => {
    set({ auditLogs: [] });
    await adminService.clearAllAuditLogs().catch(() => {});
  },
}));

