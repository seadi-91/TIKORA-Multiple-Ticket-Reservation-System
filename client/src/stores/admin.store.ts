"use client";

import { create } from "zustand";
import { adminService } from "@/services/admin.service";

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
  addedBy: {
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
  status: "ACTIVE" | "INACTIVE" | "FLAGGED";
  totalSold: number;
  capacity: number;
  startDate: string;
  rating: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  category: "BUS" | "CINEMA" | "EVENT" | "SPORTS";
  commissionRate: number;
  totalProviders: number;
  totalBookings: number;
  isActive: boolean;
  description: string;
}

export interface AdminBooking {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  providerName: string;
  serviceTitle: string;
  category: "BUS" | "CINEMA" | "EVENT" | "SPORTS";
  quantity: number;
  seatNumbers: string[];
  totalAmount: number;
  platformFee: number;
  paymentMethod: "TELEBIRR" | "CBE_BIRR" | "CHAPA" | "CASH";
  paymentStatus: "PAID" | "PENDING" | "REFUNDED" | "FAILED";
  bookingStatus: "CONFIRMED" | "CANCELLED" | "COMPLETED";
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
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  headquartersAddress: string;
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
  updateCategoryCommission: (categoryId: string, rate: number) => void;
  toggleCategoryActive: (categoryId: string) => void;

  processPayout: (id: string, approve: boolean, notes?: string) => void;
  processRefund: (id: string, approve: boolean, notes?: string) => void;
  replyToSupportTicket: (id: string, reply: string, updateStatus?: "OPEN" | "IN_PROGRESS" | "RESOLVED") => void;

  updateSettings: (newSettings: Partial<AdminSettings>) => void;
  addAuditLog: (entry: Omit<AdminAuditLog, "id" | "timestamp">) => void;

  isLoading: boolean;
  fetchPlatformData: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isLoading: false,

  fetchPlatformData: async () => {
    set({ isLoading: true });
    try {
      const [users, providers, inspectors, stats, auditLogs] = await Promise.all([
        adminService.getUsers().catch(() => []),
        adminService.getProviders().catch(() => []),
        adminService.getInspectors().catch(() => []),
        adminService.getOverview().catch(() => null),
        adminService.getAuditLogs().catch(() => []),
      ]);

      set((state) => ({
        users: users.length > 0 ? users : state.users,
        organizations: providers,
        inspectors,
        stats: stats ? { ...state.stats, ...stats } : state.stats,
        auditLogs: auditLogs.length > 0 ? auditLogs : state.auditLogs,
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

  organizations: [],
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

  bookings: [],
  payouts: [],
  refunds: [],
  supportTickets: [],
  auditLogs: [],

  settings: {
    // General & Branding
    platformName: "TIKORA Ethiopia",
    tagline: "Ethiopia's Unified Smart Ticket & Transit Hub",
    supportEmail: "support@tikora.et",
    supportPhone: "+251 115 500 000",
    headquartersAddress: "Bole Medhanialem, Mega Building 4th Floor, Addis Ababa",
    operatingRegion: "Federal Democratic Republic of Ethiopia",
    defaultTimezone: "Africa/Addis_Ababa (UTC+3)",
    defaultLanguage: "en",
    maintenanceMode: false,
    maintenanceNotice: "System upgrade in progress. Public bookings will resume shortly.",
    allowNewRegistrations: true,
    allowGuestCheckout: true,

    // Financial & Commissions
    currency: "ETB",
    defaultCommissionRate: 5.0,
    busCommissionRate: 4.5,
    cinemaCommissionRate: 6.0,
    eventCommissionRate: 7.5,
    sportsCommissionRate: 5.0,
    vatTaxRate: 15.0,
    platformServiceFeeETB: 10,
    cartHoldDurationMinutes: 10,
    maxTicketsPerBooking: 8,

    // Payments & Payouts
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

    // Refunds & Disputes
    autoApproveRefundThreshold: 300,
    busCancellationCutoffHours: 4,
    cinemaCancellationCutoffHours: 2,
    eventCancellationCutoffHours: 24,
    sportsCancellationCutoffHours: 6,
    cancellationPenaltyRate: 10.0,
    disputeAutoEscalateHours: 48,

    // Security & Authentication
    twoFactorRequiredForAdmins: true,
    twoFactorRequiredForProviders: false,
    sessionTimeoutMinutes: 60,
    maxFailedLoginsLockout: 5,
    lockoutDurationMinutes: 30,
    enforcePasswordComplexity: true,
    ipWhitelistingEnabled: false,
    whitelistedAdminIPs: "197.156.104.22, 196.188.241.10",
    auditLogRetentionDays: 90,

    // QR Code & Gate Verification
    qrSignatureAlgorithm: "HMAC_SHA256",
    qrDynamicRotationEnabled: true,
    qrRotationIntervalSeconds: 60,
    offlineScanWindowHours: 12,
    allowDuplicateCheckInOverride: false,

    // Notifications & Gateway Integration
    smsGatewayProvider: "ETHIO_TELECOM",
    smsSenderId: "TIKORA",
    smsTicketReceiptsEnabled: true,
    emailReceiptsEnabled: true,
    highValueTransactionAlertETB: 50000,
    systemAlertEmail: "security-ops@tikora.et",
  },

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

  toggleServiceStatus: (id: string) => {
    set((state) => ({
      services: state.services.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          return { ...s, status: nextStatus };
        }
        return s;
      }),
    }));
  },

  updateCategoryCommission: (categoryId: string, rate: number) => {
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId ? { ...c, commissionRate: rate } : c
      ),
    }));
  },

  toggleCategoryActive: (categoryId: string) => {
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId ? { ...c, isActive: !c.isActive } : c
      ),
    }));
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

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));

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
}));

