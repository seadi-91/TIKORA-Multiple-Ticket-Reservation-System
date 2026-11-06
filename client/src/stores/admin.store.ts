"use client";

import { create } from "zustand";

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
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: {
    totalGMV: 4850200,
    platformRevenue: 242510,
    totalBookings: 18420,
    activeProviders: 38,
    pendingApprovals: 5,
    totalUsers: 128500,
    activeTickets: 3420,
    activeInspectors: 142,
    refundsRequested: 7,
  },

  organizations: [
    {
      id: "org-1",
      name: "Selam Bus Line SC",
      category: "BUS",
      businessLicense: "MOT/BL/2018/88921",
      taxNumber: "TIN-0019283741",
      contactPerson: "Solomon Tadesse",
      email: "operations@selambus.et",
      phone: "+251 911 234 567",
      address: "Meskel Square, Addis Ababa",
      city: "Addis Ababa",
      status: "APPROVED",
      appliedDate: "2025-08-12",
      approvedDate: "2025-08-14",
      totalServices: 24,
      totalBookings: 8450,
      totalRevenue: 2112500,
      rating: 4.8,
      commissionRate: 5.0,
      notes: "Premier intercity bus operator. Fully licensed and certified.",
      documents: [
        {
          id: "doc-1",
          title: "Ministry of Transport Operator License",
          type: "PDF",
          fileUrl: "/docs/selam-transport-license.pdf",
          fileSize: "2.4 MB",
          status: "VERIFIED",
          uploadedAt: "2025-08-12",
        },
        {
          id: "doc-2",
          title: "Federal Tax Clearance Certificate",
          type: "PDF",
          fileUrl: "/docs/selam-tax-clearance.pdf",
          fileSize: "1.1 MB",
          status: "VERIFIED",
          uploadedAt: "2025-08-12",
        },
        {
          id: "doc-3",
          title: "Fleet Passenger Insurance Coverage",
          type: "PDF",
          fileUrl: "/docs/selam-insurance.pdf",
          fileSize: "3.8 MB",
          status: "VERIFIED",
          uploadedAt: "2025-08-12",
        },
      ],
    },
    {
      id: "org-2",
      name: "Abay Bus Transport",
      category: "BUS",
      businessLicense: "MOT/BL/2020/44319",
      taxNumber: "TIN-0038472910",
      contactPerson: "Mekonnen Haile",
      email: "admin@abaybus.com",
      phone: "+251 912 345 678",
      address: "Autobus Tera, Addis Ababa",
      city: "Addis Ababa",
      status: "APPROVED",
      appliedDate: "2025-09-01",
      approvedDate: "2025-09-03",
      totalServices: 18,
      totalBookings: 5120,
      totalRevenue: 1280000,
      rating: 4.6,
      commissionRate: 5.0,
      notes: "Northern routes specialist. Good punctuality record.",
      documents: [
        {
          id: "doc-4",
          title: "Commercial Registration & Business License",
          type: "PDF",
          fileUrl: "/docs/abay-license.pdf",
          fileSize: "1.9 MB",
          status: "VERIFIED",
          uploadedAt: "2025-09-01",
        },
        {
          id: "doc-5",
          title: "Tax Registration Identification",
          type: "PDF",
          fileUrl: "/docs/abay-tin.pdf",
          fileSize: "850 KB",
          status: "VERIFIED",
          uploadedAt: "2025-09-01",
        },
      ],
    },
    {
      id: "org-3",
      name: "Century Cinema Addis",
      category: "CINEMA",
      businessLicense: "MOT/CIN/2019/3321",
      taxNumber: "TIN-0099238471",
      contactPerson: "Hiwot Assefa",
      email: "bookings@centurycinema.com",
      phone: "+251 911 887 654",
      address: "Century Mall, Gurd Shola",
      city: "Addis Ababa",
      status: "APPROVED",
      appliedDate: "2025-09-15",
      approvedDate: "2025-09-16",
      totalServices: 12,
      totalBookings: 2900,
      totalRevenue: 580000,
      rating: 4.9,
      commissionRate: 5.0,
      notes: "Modern 4K Dolby Atmos screens.",
      documents: [
        {
          id: "doc-6",
          title: "City Culture & Tourism Cinema Permit",
          type: "PDF",
          fileUrl: "/docs/century-permit.pdf",
          fileSize: "2.1 MB",
          status: "VERIFIED",
          uploadedAt: "2025-09-15",
        },
      ],
    },
    {
      id: "org-4",
      name: "Ethiopian Premier League (EFF)",
      category: "SPORTS",
      businessLicense: "FED/SPT/2015/0012",
      taxNumber: "TIN-0010023456",
      contactPerson: "Dawit Kebede",
      email: "competitions@ethiopianpremierleague.et",
      phone: "+251 911 112 233",
      address: "Bole Medhanialem, EFF House",
      city: "Addis Ababa",
      status: "APPROVED",
      appliedDate: "2025-07-20",
      approvedDate: "2025-07-22",
      totalServices: 16,
      totalBookings: 6400,
      totalRevenue: 640000,
      rating: 4.7,
      commissionRate: 4.5,
      notes: "Official governing body for Premier League fixtures.",
      documents: [
        {
          id: "doc-7",
          title: "Federal Sports Commission Charter",
          type: "PDF",
          fileUrl: "/docs/eff-charter.pdf",
          fileSize: "4.2 MB",
          status: "VERIFIED",
          uploadedAt: "2025-07-20",
        },
      ],
    },
    {
      id: "org-5",
      name: "Millennium Grand Productions",
      category: "EVENT",
      businessLicense: "EVT/2021/9942",
      taxNumber: "TIN-0044556677",
      contactPerson: "Ermias Melaku",
      email: "info@millenniumevents.et",
      phone: "+251 913 456 789",
      address: "Bole Road, Millennium Hall",
      city: "Addis Ababa",
      status: "PENDING",
      appliedDate: "2026-11-01",
      totalServices: 4,
      totalBookings: 0,
      totalRevenue: 0,
      rating: 0,
      commissionRate: 5.0,
      notes: "Applied for upcoming international music and tech festivals.",
      documents: [
        {
          id: "doc-8",
          title: "Trade License & Event Safety Certification",
          type: "PDF",
          fileUrl: "/docs/millennium-safety.pdf",
          fileSize: "3.1 MB",
          status: "PENDING",
          uploadedAt: "2026-11-01",
        },
        {
          id: "doc-9",
          title: "TIN Registration Certificate",
          type: "PDF",
          fileUrl: "/docs/millennium-tin.pdf",
          fileSize: "1.2 MB",
          status: "PENDING",
          uploadedAt: "2026-11-01",
        },
      ],
    },
    {
      id: "org-6",
      name: "Walia Intercity Express",
      category: "BUS",
      businessLicense: "MOT/BL/2022/19482",
      taxNumber: "TIN-0077889900",
      contactPerson: "Kassahun Bekele",
      email: "ops@waliaexpress.et",
      phone: "+251 911 998 877",
      address: "Mercato, Addis Ababa",
      city: "Addis Ababa",
      status: "PENDING",
      appliedDate: "2026-11-02",
      totalServices: 6,
      totalBookings: 0,
      totalRevenue: 0,
      rating: 0,
      commissionRate: 5.0,
      notes: "Applying for Hawassa, Arba Minch, and Jimma routes.",
      documents: [
        {
          id: "doc-10",
          title: "Commercial Transport License",
          type: "PDF",
          fileUrl: "/docs/walia-license.pdf",
          fileSize: "2.8 MB",
          status: "PENDING",
          uploadedAt: "2026-11-02",
        },
      ],
    },
    {
      id: "org-7",
      name: "Red Fox Cinema Lounge",
      category: "CINEMA",
      businessLicense: "MOT/CIN/2024/0114",
      taxNumber: "TIN-0088991122",
      contactPerson: "Sara Tefera",
      email: "contact@redfoxcinema.et",
      phone: "+251 912 667 788",
      address: "Kazanchis, Addis Ababa",
      city: "Addis Ababa",
      status: "SUSPENDED",
      appliedDate: "2025-06-10",
      approvedDate: "2025-06-15",
      rejectionReason: "Repeated customer screening cancellation without prompt refund.",
      totalServices: 8,
      totalBookings: 450,
      totalRevenue: 67500,
      rating: 2.8,
      commissionRate: 6.0,
      notes: "Account suspended due to terms violation on ticket redemption.",
      documents: [
        {
          id: "doc-11",
          title: "Business License",
          type: "PDF",
          fileUrl: "/docs/redfox-license.pdf",
          fileSize: "1.4 MB",
          status: "VERIFIED",
          uploadedAt: "2025-06-10",
        },
      ],
    },
  ],

  users: [
    {
      id: "usr-1",
      name: "Abebe Bikila",
      amharicName: "አበበ ቢቂላ",
      email: "abebe.b@gmail.com",
      phone: "+251 911 123 456",
      role: "CUSTOMER",
      status: "ACTIVE",
      nationalId: "ET-FAN-1029384",
      faydaStatus: "VERIFIED",
      kycStatus: "VERIFIED",
      kycLevel: 2,
      gender: "Male",
      dateOfBirth: "1994-04-12",
      city: "Addis Ababa",
      woreda: "Woreda 03",
      kebele: "Kebele 08",
      address: "Bole Sub-City, Woreda 03, House 412, Addis Ababa",
      preferredPayment: "TELEBIRR",
      walletBalanceETB: 450,
      totalSpentETB: 18450,
      loyaltyPoints: 340,
      twoFactorEnabled: true,
      ipAddress: "197.156.103.42 (Addis Ababa - Ethio Telecom)",
      deviceInfo: "Samsung Galaxy S24 Ultra • Android 14 • Chrome 128",
      notes: "High-frequency verified platform customer. Excellent payment history.",
      addedBy: {
        name: "Telebirr SSO Auth",
        email: "system@telebirr.et",
        role: "Automated OAuth Gateway",
      },
      createdAt: "2025-06-14",
      lastLogin: "2026-11-02 18:32",
      totalBookings: 14,
    },
    {
      id: "usr-2",
      name: "Solomon Tadesse",
      amharicName: "ሰለሞን ታደሰ",
      email: "operations@selambus.et",
      phone: "+251 911 234 567",
      role: "ORGANIZATION",
      status: "ACTIVE",
      nationalId: "ET-FAN-9938102",
      faydaStatus: "VERIFIED",
      kycStatus: "VERIFIED",
      kycLevel: 3,
      gender: "Male",
      dateOfBirth: "1982-08-24",
      city: "Addis Ababa",
      woreda: "Woreda 06",
      kebele: "Kebele 14",
      address: "Kirkos Sub-City, Meskel Square, Selam Bus HQ Office 401, Addis Ababa",
      preferredPayment: "CBE_BIRR",
      walletBalanceETB: 0,
      totalSpentETB: 0,
      loyaltyPoints: 0,
      organizationName: "Selam Bus Line SC",
      twoFactorEnabled: true,
      ipAddress: "196.188.241.15 (Meskel Square Corporate Leased Line)",
      deviceInfo: "Dell Latitude 5530 • Windows 11 Enterprise",
      notes: "Chief Operations Officer & Primary Platform Contact for Selam Bus Line SC.",
      addedBy: {
        name: "Peter SuperAdmin",
        email: "admin@tikora.et",
        role: "Super Administrator",
      },
      createdAt: "2025-08-12",
      lastLogin: "2026-11-02 20:15",
      totalBookings: 8450,
    },
    {
      id: "usr-3",
      name: "Almaz Kebede",
      amharicName: "አልማዝ ከበደ",
      email: "almaz.selam@selambus.et",
      phone: "+251 912 998 877",
      role: "INSPECTOR",
      status: "ACTIVE",
      nationalId: "ET-FAN-9842103",
      faydaStatus: "VERIFIED",
      kycStatus: "VERIFIED",
      kycLevel: 2,
      gender: "Female",
      dateOfBirth: "1996-11-05",
      city: "Addis Ababa",
      woreda: "Woreda 01",
      kebele: "Kebele 02",
      address: "Addis Ketema, Autobus Tera Staff Quarters, Addis Ababa",
      preferredPayment: "TELEBIRR",
      walletBalanceETB: 0,
      totalSpentETB: 0,
      loyaltyPoints: 0,
      organizationName: "Selam Bus Line SC",
      twoFactorEnabled: true,
      ipAddress: "197.156.92.118 (Addis Ketema Cellular Gateway)",
      deviceInfo: "Sunmi V2 Pro Android POS Scanner • Tikora Gate v2.4.1",
      notes: "Field Inspector certified for QR verification at Autobus Tera Gate 1.",
      addedBy: {
        name: "Peter SuperAdmin",
        email: "admin@tikora.et",
        role: "Super Administrator",
      },
      createdAt: "2025-08-18",
      lastLogin: "2026-11-02 19:40",
      totalBookings: 0,
    },
    {
      id: "usr-4",
      name: "Peter SuperAdmin",
      amharicName: "ጴጥሮስ አድሚን",
      email: "admin@tikora.et",
      phone: "+251 900 000 001",
      role: "ADMIN",
      status: "ACTIVE",
      nationalId: "ET-FAN-0000001",
      faydaStatus: "VERIFIED",
      kycStatus: "VERIFIED",
      kycLevel: 3,
      gender: "Male",
      dateOfBirth: "1990-01-01",
      city: "Addis Ababa",
      woreda: "Woreda 07",
      kebele: "Kebele 22",
      address: "TIKORA Headquarters, Kazanchis, Addis Ababa",
      preferredPayment: "TELEBIRR",
      walletBalanceETB: 0,
      totalSpentETB: 0,
      loyaltyPoints: 1000,
      twoFactorEnabled: true,
      ipAddress: "196.188.110.5 (TIKORA HQ Fiber Gateway)",
      deviceInfo: "Apple MacBook Pro M3 Max • macOS Sonoma",
      notes: "Platform Root Super Administrator. Full access governance.",
      addedBy: {
        name: "System Root Initializer",
        email: "root@tikora.et",
        role: "Bootstrap Authority",
      },
      createdAt: "2025-01-01",
      lastLogin: "2026-11-02 21:05",
      totalBookings: 0,
    },
    {
      id: "usr-5",
      name: "Tigist Mengistu",
      amharicName: "ትዕግስት መንግስቱ",
      email: "tigist.m@yahoo.com",
      phone: "+251 913 887 654",
      role: "CUSTOMER",
      status: "ACTIVE",
      nationalId: "ET-FAN-5542109",
      faydaStatus: "VERIFIED",
      kycStatus: "VERIFIED",
      kycLevel: 2,
      gender: "Female",
      dateOfBirth: "1998-07-19",
      city: "Hawassa",
      woreda: "Menehariya Woreda",
      kebele: "Kebele 02",
      address: "Piazza Road, Near Lake View Hotel, Hawassa, Sidama",
      preferredPayment: "CBE_BIRR",
      walletBalanceETB: 200,
      totalSpentETB: 8900,
      loyaltyPoints: 120,
      twoFactorEnabled: true,
      ipAddress: "197.156.88.204 (Hawassa Regional Hub - Ethio Telecom)",
      deviceInfo: "iPhone 15 Pro • iOS 18 • Safari Mobile",
      notes: "Regular intercity bus traveler and cinema patron in Hawassa.",
      addedBy: {
        name: "CBE Birr SSO Auth",
        email: "system@cbe.com.et",
        role: "Automated OAuth Gateway",
      },
      createdAt: "2025-10-02",
      lastLogin: "2026-10-28 11:20",
      totalBookings: 6,
    },
    {
      id: "usr-6",
      name: "Yared Wolde",
      amharicName: "ያሬድ ወልዴ",
      email: "yared.w@baduser.com",
      phone: "+251 914 000 111",
      role: "CUSTOMER",
      status: "SUSPENDED",
      suspendedReason: "Suspicious refund claim and ticket resale attempt on social channels.",
      nationalId: "ET-FAN-8819203",
      faydaStatus: "PENDING",
      kycStatus: "REJECTED",
      kycLevel: 1,
      gender: "Male",
      dateOfBirth: "1992-03-30",
      city: "Addis Ababa",
      woreda: "Woreda 04",
      kebele: "Kebele 09",
      address: "Nifas Silk-Lafto, Kera Area, Addis Ababa",
      preferredPayment: "TELEBIRR",
      walletBalanceETB: 0,
      totalSpentETB: 1200,
      loyaltyPoints: 0,
      twoFactorEnabled: false,
      ipAddress: "197.156.12.99 (Nifas Silk Cellular)",
      deviceInfo: "Xiaomi Redmi Note 12 • Android 13",
      notes: "Account frozen following automated fraud detection trigger.",
      addedBy: {
        name: "Self Registration",
        email: "public@tikora.et",
        role: "Direct Web Register",
      },
      createdAt: "2025-11-12",
      lastLogin: "2026-09-14 08:10",
      totalBookings: 1,
    },
  ],

  inspectors: [
    {
      id: "ins-1",
      badgeId: "INS-ET-4081",
      name: "Almaz Kebede",
      email: "almaz.selam@selambus.et",
      phone: "+251 912 998 877",
      nationalId: "ET-FAN-9842103",
      organizationId: "org-1",
      organizationName: "Selam Bus Line SC",
      organizationCategory: "BUS",
      assignedStation: "Autobus Tera Gate 4 (Outbound Terminal)",
      addedBy: {
        name: "Peter SuperAdmin",
        email: "admin@tikora.et",
        role: "Super Administrator",
      },
      createdAt: "2025-08-18 10:30 AM",
      lastActive: "2026-11-03 17:45",
      status: "ACTIVE",
      totalScans: 12480,
      validScans: 12412,
      flaggedScans: 68,
      deviceModel: "Sunmi V2 Pro Android POS Scanner",
      appVersion: "Tikora Gate v2.4.1",
      shiftSchedule: "Morning Shift: 06:00 - 14:00",
    },
    {
      id: "ins-2",
      badgeId: "INS-ET-5012",
      name: "Dawit Hailu",
      email: "dawit.h@ednamall.et",
      phone: "+251 911 445 566",
      nationalId: "ET-FAN-7721904",
      organizationId: "org-2",
      organizationName: "Edna Mall Cinema",
      organizationCategory: "CINEMA",
      assignedStation: "Bole Edna Mall VIP Hall Gate 1",
      addedBy: {
        name: "Michael Assefa",
        email: "manager@ednamall.et",
        role: "Provider Admin",
      },
      createdAt: "2025-09-05 09:15 AM",
      lastActive: "2026-11-03 19:10",
      status: "ACTIVE",
      totalScans: 8920,
      validScans: 8895,
      flaggedScans: 25,
      deviceModel: "Zebra TC26 Touch Computer",
      appVersion: "Tikora Gate v2.4.1",
      shiftSchedule: "Evening Shift: 14:00 - 22:00",
    },
    {
      id: "ins-3",
      badgeId: "INS-ET-6029",
      name: "Kidus Yohannes",
      email: "kidus.y@redfoxevents.et",
      phone: "+251 922 334 455",
      nationalId: "ET-FAN-3310928",
      organizationId: "org-3",
      organizationName: "Red Fox Entertainment",
      organizationCategory: "EVENT",
      assignedStation: "Millennium Hall Gate 2 (VIP Entry)",
      addedBy: {
        name: "Peter SuperAdmin",
        email: "admin@tikora.et",
        role: "Super Administrator",
      },
      createdAt: "2025-10-12 14:00 PM",
      lastActive: "2026-11-01 22:30",
      status: "ACTIVE",
      totalScans: 15200,
      validScans: 15080,
      flaggedScans: 120,
      deviceModel: "Urovo i6310 Handheld Terminal",
      appVersion: "Tikora Gate v2.4.0",
      shiftSchedule: "Event Shift: 16:00 - 24:00",
    },
    {
      id: "ins-4",
      badgeId: "INS-ET-7184",
      name: "Mulugeta Assefa",
      email: "mulugeta.a@epl.et",
      phone: "+251 933 112 233",
      nationalId: "ET-FAN-5519823",
      organizationId: "org-4",
      organizationName: "Ethiopian Premier League",
      organizationCategory: "SPORTS",
      assignedStation: "Addis Ababa Stadium Gate 7 (Tribuna East)",
      addedBy: {
        name: "Peter SuperAdmin",
        email: "admin@tikora.et",
        role: "Super Administrator",
      },
      createdAt: "2025-11-01 11:45 AM",
      lastActive: "2026-11-02 16:00",
      status: "ACTIVE",
      totalScans: 22100,
      validScans: 21850,
      flaggedScans: 250,
      deviceModel: "Chainway C66 Barcode Scanner",
      appVersion: "Tikora Gate v2.4.1",
      shiftSchedule: "Match Day Shift: 10:00 - 18:00",
    },
    {
      id: "ins-5",
      badgeId: "INS-ET-8201",
      name: "Hanan Mohammed",
      email: "hanan.m@selambus.et",
      phone: "+251 944 556 677",
      nationalId: "ET-FAN-1298456",
      organizationId: "org-1",
      organizationName: "Selam Bus Line SC",
      organizationCategory: "BUS",
      assignedStation: "Kaliti Terminal Gate 1",
      addedBy: {
        name: "Solomon Tadesse",
        email: "operations@selambus.et",
        role: "Provider Admin",
      },
      createdAt: "2026-01-15 08:30 AM",
      lastActive: "2026-10-20 12:15",
      status: "SUSPENDED",
      totalScans: 4120,
      validScans: 4050,
      flaggedScans: 70,
      deviceModel: "Sunmi V2 Pro Android POS Scanner",
      appVersion: "Tikora Gate v2.3.9",
      shiftSchedule: "Pending Reassignment",
    },
  ],

  services: [
    {
      id: "srv-1",
      title: "Addis Ababa to Hawassa Luxury Express",
      category: "BUS",
      providerId: "org-1",
      providerName: "Selam Bus Line SC",
      location: "Meskel Square Terminal, Addis Ababa",
      price: 650,
      status: "ACTIVE",
      totalSold: 3420,
      capacity: 45,
      startDate: "Daily 06:00 AM",
      rating: 4.8,
    },
    {
      id: "srv-2",
      title: "Addis Ababa to Bahir Dar Comfort Coach",
      category: "BUS",
      providerId: "org-1",
      providerName: "Selam Bus Line SC",
      location: "Autobus Tera, Addis Ababa",
      price: 850,
      status: "ACTIVE",
      totalSold: 2890,
      capacity: 49,
      startDate: "Daily 05:30 AM",
      rating: 4.7,
    },
    {
      id: "srv-3",
      title: "Dune: Part Two (IMAX 3D Experience)",
      category: "CINEMA",
      providerId: "org-3",
      providerName: "Century Cinema Addis",
      location: "Hall 1, Century Mall",
      price: 250,
      status: "ACTIVE",
      totalSold: 1240,
      capacity: 220,
      startDate: "Nov 04, 2026 • 07:30 PM",
      rating: 4.9,
    },
    {
      id: "srv-4",
      title: "St. George vs Coffee FC (Sheger Derby)",
      category: "SPORTS",
      providerId: "org-4",
      providerName: "Ethiopian Premier League (EFF)",
      location: "Addis Ababa Stadium",
      price: 150,
      status: "ACTIVE",
      totalSold: 18500,
      capacity: 25000,
      startDate: "Nov 12, 2026 • 04:00 PM",
      rating: 4.8,
    },
    {
      id: "srv-5",
      title: "Addis Great Run 2026 (Official Entry)",
      category: "EVENT",
      providerId: "org-5",
      providerName: "Millennium Grand Productions",
      location: "Meskel Square",
      price: 400,
      status: "INACTIVE",
      totalSold: 0,
      capacity: 45000,
      startDate: "Nov 22, 2026 • 07:00 AM",
      rating: 0,
    },
  ],

  categories: [
    {
      id: "cat-1",
      name: "Intercity Bus & Coach",
      slug: "bus",
      category: "BUS",
      commissionRate: 5.0,
      totalProviders: 18,
      totalBookings: 11200,
      isActive: true,
      description: "Intercity scheduled transport, express luxury coaches, cross-regional routes.",
    },
    {
      id: "cat-2",
      name: "Cinema & Movie Theaters",
      slug: "cinema",
      category: "CINEMA",
      commissionRate: 5.0,
      totalProviders: 8,
      totalBookings: 3200,
      isActive: true,
      description: "Multiplex cinemas, film premieres, reserved theater seating.",
    },
    {
      id: "cat-3",
      name: "Live Concerts & Events",
      slug: "event",
      category: "EVENT",
      commissionRate: 6.0,
      totalProviders: 10,
      totalBookings: 2400,
      isActive: true,
      description: "Music concerts, cultural festivals, comedy shows, and corporate expos.",
    },
    {
      id: "cat-4",
      name: "Sports & Stadium Tournaments",
      slug: "sports",
      category: "SPORTS",
      commissionRate: 4.5,
      totalProviders: 6,
      totalBookings: 1620,
      isActive: true,
      description: "Premier League football fixtures, basketball finals, athletics competitions.",
    },
  ],

  bookings: [
    {
      id: "bk-1",
      reference: "TK-BUS-9901",
      customerName: "Abebe Bikila",
      customerEmail: "abebe.b@gmail.com",
      customerPhone: "+251 911 123 456",
      providerName: "Selam Bus Line SC",
      serviceTitle: "Addis Ababa to Hawassa Luxury Express",
      category: "BUS",
      quantity: 2,
      seatNumbers: ["12A", "12B"],
      totalAmount: 1300,
      platformFee: 65,
      paymentMethod: "TELEBIRR",
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
      bookingDate: "2026-11-02 14:22",
    },
    {
      id: "bk-1b",
      reference: "TK-CIN-8820",
      customerName: "Abebe Bikila",
      customerEmail: "abebe.b@gmail.com",
      customerPhone: "+251 911 123 456",
      providerName: "Century Cinema Addis",
      serviceTitle: "Dune: Part Two (IMAX 3D Experience)",
      category: "CINEMA",
      quantity: 2,
      seatNumbers: ["VIP-G4", "VIP-G5"],
      totalAmount: 500,
      platformFee: 25,
      paymentMethod: "TELEBIRR",
      paymentStatus: "PAID",
      bookingStatus: "COMPLETED",
      bookingDate: "2026-10-25 18:40",
    },
    {
      id: "bk-1c",
      reference: "TK-SPT-7712",
      customerName: "Abebe Bikila",
      customerEmail: "abebe.b@gmail.com",
      customerPhone: "+251 911 123 456",
      providerName: "Ethiopian Premier League (EFF)",
      serviceTitle: "St. George vs Coffee FC (Sheger Derby)",
      category: "SPORTS",
      quantity: 2,
      seatNumbers: ["Tribuna-10", "Tribuna-11"],
      totalAmount: 300,
      platformFee: 13.5,
      paymentMethod: "TELEBIRR",
      paymentStatus: "PAID",
      bookingStatus: "COMPLETED",
      bookingDate: "2026-10-18 15:30",
    },
    {
      id: "bk-1d",
      reference: "TK-EVT-4401",
      customerName: "Abebe Bikila",
      customerEmail: "abebe.b@gmail.com",
      customerPhone: "+251 911 123 456",
      providerName: "Millennium Grand Productions",
      serviceTitle: "Ethiopian New Year Grand Music Fest",
      category: "EVENT",
      quantity: 2,
      seatNumbers: ["VIP-A1", "VIP-A2"],
      totalAmount: 3000,
      platformFee: 180,
      paymentMethod: "TELEBIRR",
      paymentStatus: "PAID",
      bookingStatus: "COMPLETED",
      bookingDate: "2026-09-11 20:00",
    },
    {
      id: "bk-1e",
      reference: "TK-BUS-6612",
      customerName: "Abebe Bikila",
      customerEmail: "abebe.b@gmail.com",
      customerPhone: "+251 911 123 456",
      providerName: "Selam Bus Line SC",
      serviceTitle: "Addis Ababa to Bahir Dar Comfort Coach",
      category: "BUS",
      quantity: 1,
      seatNumbers: ["08A"],
      totalAmount: 850,
      platformFee: 42.5,
      paymentMethod: "TELEBIRR",
      paymentStatus: "PAID",
      bookingStatus: "COMPLETED",
      bookingDate: "2026-08-04 05:30",
    },
    {
      id: "bk-2",
      reference: "TK-CIN-4421",
      customerName: "Hanna Girma",
      customerEmail: "hanna.g@gmail.com",
      customerPhone: "+251 912 345 999",
      providerName: "Century Cinema Addis",
      serviceTitle: "Dune: Part Two (IMAX 3D Experience)",
      category: "CINEMA",
      quantity: 1,
      seatNumbers: ["F-14"],
      totalAmount: 250,
      platformFee: 12.5,
      paymentMethod: "CBE_BIRR",
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
      bookingDate: "2026-11-02 16:05",
    },
    {
      id: "bk-3",
      reference: "TK-SPT-1102",
      customerName: "Dawit Worku",
      customerEmail: "dawit.w@yahoo.com",
      customerPhone: "+251 913 222 333",
      providerName: "Ethiopian Premier League (EFF)",
      serviceTitle: "St. George vs Coffee FC (Sheger Derby)",
      category: "SPORTS",
      quantity: 4,
      seatNumbers: ["VIP-01", "VIP-02", "VIP-03", "VIP-04"],
      totalAmount: 600,
      platformFee: 27,
      paymentMethod: "CHAPA",
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
      bookingDate: "2026-11-01 19:12",
    },
    {
      id: "bk-4",
      reference: "TK-BUS-9872",
      customerName: "Mulugeta Tesfaye",
      customerEmail: "mulugeta.t@gmail.com",
      customerPhone: "+251 911 776 554",
      providerName: "Abay Bus Transport",
      serviceTitle: "Addis Ababa to Gondar Luxury Coach",
      category: "BUS",
      quantity: 1,
      seatNumbers: ["04A"],
      totalAmount: 950,
      platformFee: 47.5,
      paymentMethod: "TELEBIRR",
      paymentStatus: "REFUNDED",
      bookingStatus: "CANCELLED",
      bookingDate: "2026-10-31 09:30",
    },
    {
      id: "bk-5a",
      reference: "TK-CIN-9011",
      customerName: "Tigist Mengistu",
      customerEmail: "tigist.m@yahoo.com",
      customerPhone: "+251 913 887 654",
      providerName: "Century Cinema Addis",
      serviceTitle: "Gladiator II Premiere",
      category: "CINEMA",
      quantity: 2,
      seatNumbers: ["F-07", "F-08"],
      totalAmount: 500,
      platformFee: 25,
      paymentMethod: "CBE_BIRR",
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
      bookingDate: "2026-10-28 10:15",
    },
    {
      id: "bk-5b",
      reference: "TK-BUS-3312",
      customerName: "Tigist Mengistu",
      customerEmail: "tigist.m@yahoo.com",
      customerPhone: "+251 913 887 654",
      providerName: "Selam Bus Line SC",
      serviceTitle: "Hawassa to Addis Ababa Express",
      category: "BUS",
      quantity: 1,
      seatNumbers: ["04B"],
      totalAmount: 650,
      platformFee: 32.5,
      paymentMethod: "CBE_BIRR",
      paymentStatus: "PAID",
      bookingStatus: "COMPLETED",
      bookingDate: "2026-10-15 06:00",
    },
    {
      id: "bk-5c",
      reference: "TK-SPT-5541",
      customerName: "Tigist Mengistu",
      customerEmail: "tigist.m@yahoo.com",
      customerPhone: "+251 913 887 654",
      providerName: "Ethiopian Premier League (EFF)",
      serviceTitle: "Ethiopia Bunna vs Fasil Kenema",
      category: "SPORTS",
      quantity: 3,
      seatNumbers: ["Gate 3 - 44", "Gate 3 - 45", "Gate 3 - 46"],
      totalAmount: 450,
      platformFee: 20.25,
      paymentMethod: "CBE_BIRR",
      paymentStatus: "PAID",
      bookingStatus: "COMPLETED",
      bookingDate: "2026-10-08 16:00",
    },
    {
      id: "bk-5d",
      reference: "TK-EVT-1029",
      customerName: "Tigist Mengistu",
      customerEmail: "tigist.m@yahoo.com",
      customerPhone: "+251 913 887 654",
      providerName: "Millennium Grand Productions",
      serviceTitle: "Addis Great Run 2026 (Official Entry)",
      category: "EVENT",
      quantity: 2,
      seatNumbers: ["Bib #19820", "Bib #19821"],
      totalAmount: 800,
      platformFee: 48,
      paymentMethod: "CBE_BIRR",
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
      bookingDate: "2026-10-05 14:20",
    },
    {
      id: "bk-6a",
      reference: "TK-BUS-9871",
      customerName: "Yared Wolde",
      customerEmail: "yared.w@baduser.com",
      customerPhone: "+251 914 000 111",
      providerName: "Abay Bus Transport",
      serviceTitle: "Addis Ababa to Gondar Luxury Coach",
      category: "BUS",
      quantity: 1,
      seatNumbers: ["04A"],
      totalAmount: 950,
      platformFee: 47.5,
      paymentMethod: "TELEBIRR",
      paymentStatus: "REFUNDED",
      bookingStatus: "CANCELLED",
      bookingDate: "2026-10-31 09:30",
    },
  ],

  payouts: [
    {
      id: "pay-1",
      reference: "PAY-2026-081",
      providerId: "org-1",
      providerName: "Selam Bus Line SC",
      amount: 145000,
      fee: 7250,
      netAmount: 137750,
      payoutMethod: "CBE",
      accountNumber: "1000192837482",
      accountName: "Selam Bus Line Share Company",
      status: "PENDING",
      requestedAt: "2026-11-02 08:30",
    },
    {
      id: "pay-2",
      reference: "PAY-2026-080",
      providerId: "org-3",
      providerName: "Century Cinema Addis",
      amount: 42000,
      fee: 2100,
      netAmount: 39900,
      payoutMethod: "AWASH_BANK",
      accountNumber: "01320491823900",
      accountName: "Century Cinema Plc",
      status: "PENDING",
      requestedAt: "2026-11-01 14:15",
    },
    {
      id: "pay-3",
      reference: "PAY-2026-079",
      providerId: "org-2",
      providerName: "Abay Bus Transport",
      amount: 98000,
      fee: 4900,
      netAmount: 93100,
      payoutMethod: "TELEBIRR",
      accountNumber: "+251 912 345 678",
      accountName: "Abay Bus Transport Ltd",
      status: "PROCESSED",
      requestedAt: "2026-10-28 10:00",
      processedAt: "2026-10-28 16:30",
      notes: "Telebirr bulk disbursement batch #TB-88912",
    },
  ],

  refunds: [
    {
      id: "rf-1",
      reference: "RF-1049",
      bookingReference: "TK-BUS-9872",
      customerName: "Mulugeta Tesfaye",
      providerName: "Abay Bus Transport",
      serviceTitle: "Addis Ababa to Gondar Luxury Coach",
      amount: 950,
      reason: "Trip rescheduled by provider by more than 4 hours",
      customerReasonDetails:
        "Departure was moved from 06:00 AM to 11:30 AM without 24 hours prior notice. I could not travel at that time.",
      status: "APPROVED",
      requestedAt: "2026-10-31 10:00",
      decisionDate: "2026-10-31 11:45",
      decisionNotes: "Provider departure delay verified. 100% refund approved.",
    },
    {
      id: "rf-2",
      reference: "RF-1050",
      bookingReference: "TK-CIN-4490",
      customerName: "Bethelhem Assefa",
      providerName: "Red Fox Cinema Lounge",
      serviceTitle: "Gladiator II Premiere",
      amount: 250,
      reason: "Screening cancelled by cinema due to power outage",
      customerReasonDetails:
        "The generator failed 10 minutes into the movie and the show was halted.",
      status: "PENDING",
      requestedAt: "2026-11-02 12:10",
    },
    {
      id: "rf-3",
      reference: "RF-1051",
      bookingReference: "TK-BUS-9940",
      customerName: "Yared Wolde",
      providerName: "Selam Bus Line SC",
      serviceTitle: "Addis Ababa to Hawassa",
      amount: 650,
      reason: "Passenger missed departure",
      customerReasonDetails: "I arrived 15 minutes after the bus departed.",
      status: "REJECTED",
      requestedAt: "2026-11-01 07:30",
      decisionDate: "2026-11-01 09:00",
      decisionNotes:
        "Selam Bus policy stipulates arrival 30 mins prior to departure. Missed buses are non-refundable per terms.",
    },
  ],

  supportTickets: [
    {
      id: "tc-1",
      ticketNumber: "SUP-8821",
      requesterName: "Ermias Melaku",
      requesterRole: "PROVIDER",
      requesterEmail: "info@millenniumevents.et",
      subject: "Urgent: Expedited Organization Verification for Nov Festival",
      category: "VERIFICATION",
      priority: "HIGH",
      status: "OPEN",
      createdAt: "2026-11-02 09:15",
      messages: [
        {
          sender: "Ermias Melaku",
          isStaff: false,
          message:
            "Greetings TIKORA admin. We submitted our business license and event safety permits yesterday for Millennium Grand Productions. We have tickets to release by Wednesday. Kindly expedite verification.",
          timestamp: "2026-11-02 09:15",
        },
      ],
    },
    {
      id: "tc-2",
      ticketNumber: "SUP-8819",
      requesterName: "Hanna Girma",
      requesterRole: "CUSTOMER",
      requesterEmail: "hanna.g@gmail.com",
      subject: "SMS Ticket Confirmation delay on Telebirr payment",
      category: "PAYMENT",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      createdAt: "2026-11-01 16:30",
      messages: [
        {
          sender: "Hanna Girma",
          isStaff: false,
          message:
            "Telebirr debited 250 ETB for Century Cinema, but the SMS ticket with the QR code arrived 20 minutes late.",
          timestamp: "2026-11-01 16:30",
        },
        {
          sender: "TIKORA Support (Super Admin)",
          isStaff: true,
          message:
            "Hello Hanna, we audited the SMS gateway log and observed a temporary telecommunications queue spike. The booking is confirmed and valid on your dashboard.",
          timestamp: "2026-11-01 17:00",
        },
      ],
    },
  ],

  auditLogs: [
    {
      id: "log-1",
      action: "ORGANIZATION_APPROVED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: "Abay Bus Transport",
      details: "Approved transport operator license and enabled bus listing capabilities.",
      ipAddress: "197.156.104.22",
      timestamp: "2026-11-02 18:00",
      severity: "INFO",
    },
    {
      id: "log-2",
      action: "REFUND_APPROVED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: "RF-1049 (ETB 950.00)",
      details: "Approved 100% refund to customer Mulugeta Tesfaye due to operator departure delay.",
      ipAddress: "197.156.104.22",
      timestamp: "2026-10-31 11:45",
      severity: "WARNING",
    },
    {
      id: "log-3",
      action: "COMMISSION_UPDATED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: "Ethiopian Premier League (EFF)",
      details: "Set customized promotional commission rate to 4.5% for 2026 football season.",
      ipAddress: "197.156.104.22",
      timestamp: "2026-10-25 14:10",
      severity: "INFO",
    },
    {
      id: "log-4",
      action: "ORGANIZATION_SUSPENDED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: "Red Fox Cinema Lounge",
      details: "Temporary operational suspension due to unresolved customer dispute quota.",
      ipAddress: "197.156.104.22",
      timestamp: "2026-10-20 09:30",
      severity: "CRITICAL",
    },
  ],

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

  toggleUserStatus: (id: string) => {
    const user = get().users.find((u) => u.id === id);
    if (!user) return;
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
    }));

    get().addAuditLog({
      action: newStatus === "ACTIVE" ? "USER_ACTIVATED" : "USER_SUSPENDED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: `${user.name} (${user.email})`,
      details: `User account status modified to ${newStatus}.`,
      ipAddress: "197.156.104.22",
      severity: newStatus === "ACTIVE" ? "INFO" : "WARNING",
    });
  },

  createAdminUser: (data) => {
    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: "ACTIVE",
      nationalId: `ET-FAN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      faydaStatus: "VERIFIED",
      kycStatus: "VERIFIED",
      kycLevel: 2,
      city: "Addis Ababa",
      address: "Bole Sub-City, Addis Ababa, Ethiopia",
      twoFactorEnabled: true,
      totalBookings: 0,
      totalSpentETB: 0,
      loyaltyPoints: 0,
      addedBy: {
        name: "Peter SuperAdmin",
        email: "admin@tikora.et",
        role: "Super Administrator",
      },
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
    };

    set((state) => ({
      users: [newUser, ...state.users],
      stats: {
        ...state.stats,
        totalUsers: state.stats.totalUsers + 1,
      },
    }));

    get().addAuditLog({
      action: "STAFF_PROVISIONED",
      actorName: "Peter SuperAdmin",
      actorRole: "SUPER_ADMIN",
      target: `${data.name} (${data.email})`,
      details: `Provisioned privileged account with role: ${data.role}`,
      ipAddress: "197.156.104.22",
      severity: "WARNING",
    });
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
  },
}));

