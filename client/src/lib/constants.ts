export const APP_NAME = "TicketHub";
export const APP_TAGLINE = "Your Modern Multi-Category Ticket Reservation Platform";

// TicketHub Subdued Warm Amber & Bronze Color System (Muted & Premium)
export const BRAND_COLORS = {
  primary: "#B45309", // Warm Muted Amber / Refined Bronze
  primaryHover: "#92400E", // Deep Bronze Amber
  primaryLightBg: "#FAF5ED", // Soft Warm Linen Tint
  darkBg: "#0F1117", // Neutral Slate Charcoal
  darkCardBg: "#161922", // Elevated Slate Surface
  mainText: "#0F172A",
  secondaryText: "#64748B",
  pageBg: "#F8FAFC",
  white: "#FFFFFF",
  border: "#E2E8F0",
  error: "#EF4444",
  warning: "#D97706",
  success: "#10B981",
} as const;

export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  ORGANIZATION: "ORGANIZATION",
  INSPECTOR: "INSPECTOR",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const TICKET_CATEGORIES = {
  ALL: "ALL",
  BUS: "BUS",
  CINEMA: "CINEMA",
  EVENT: "EVENT",
  SPORTS: "SPORTS",
} as const;

export type TicketCategory = (typeof TICKET_CATEGORIES)[keyof typeof TICKET_CATEGORIES];

export const ETHIOPIAN_CITIES = [
  "Addis Ababa",
  "Hawassa",
  "Bahir Dar",
  "Adama (Nazret)",
  "Dire Dawa",
  "Gondar",
  "Mekelle",
  "Jimma",
  "Dessie",
  "Bishoftu",
  "Arba Minch",
] as const;

export const PAYMENT_METHODS = [
  {
    id: "TELEBIRR",
    name: "Telebirr SuperApp",
    description: "Instant mobile payment via Ethio Telecom Telebirr account or QR",
    icon: "Phone",
    color: "from-sky-500 to-blue-600",
    badge: "Most Popular",
  },
  {
    id: "CBE_BIRR",
    name: "CBE Birr",
    description: "Commercial Bank of Ethiopia digital wallet & mobile banking",
    icon: "Building2",
    color: "from-purple-600 to-indigo-700",
    badge: "Zero Fee",
  },
  {
    id: "CHAPA",
    name: "Chapa Payment Gateway",
    description: "Pay securely with any Ethiopian local debit card or mobile wallet",
    icon: "CreditCard",
    color: "from-emerald-600 to-teal-700",
    badge: "Instant Pass",
  },
  {
    id: "BANK_CARD",
    name: "Visa / Mastercard / Local Cards",
    description: "Direct debit or credit card checkout with 3D Secure verification",
    icon: "Wallet",
    color: "from-amber-600 to-orange-700",
    badge: "International",
  },
] as const;

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  REGISTER_CUSTOMER: "/register/customer",
  REGISTER_ORGANIZATION: "/register/organization",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_OTP: "/verify-otp",
  PENDING_APPROVAL: "/pending-approval",
} as const;

export const CUSTOMER_ROUTES = {
  OVERVIEW: "/customer",
  BOOKINGS: "/customer/bookings",
  TICKETS: "/customer/tickets",
  FAVORITES: "/customer/favorites",
  NOTIFICATIONS: "/customer/notifications",
  PAYMENTS: "/customer/payments",
  PROFILE: "/customer/profile",
  SETTINGS: "/customer/profile/settings",
  REFUNDS: "/customer/refunds",
  REVIEWS: "/customer/reviews",
} as const;
