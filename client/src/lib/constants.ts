export const APP_NAME = "TIKORA";
export const APP_TAGLINE = "Your Unified Multi-Ticket Reservation Platform";

export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  ORGANIZATION: "ORGANIZATION",
  INSPECTOR: "INSPECTOR",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const TICKET_CATEGORIES = {
  BUS: "BUS",
  CINEMA: "CINEMA",
  EVENT: "EVENT",
  SPORTS: "SPORTS",
} as const;

export type TicketCategory = (typeof TICKET_CATEGORIES)[keyof typeof TICKET_CATEGORIES];

export const ORGANIZATION_TYPES = [
  {
    id: "CINEMA",
    title: "Cinema & Movie Theaters",
    description: "Manage theater halls, screen schedules, seat maps, and premiere tickets.",
    badge: "Cinema Halls",
  },
  {
    id: "BUS",
    title: "Intercity Bus & Transportation",
    description: "Manage travel routes, departure times, fleet buses, and passenger seat assignments.",
    badge: "Transport Services",
  },
  {
    id: "EVENT",
    title: "Live Concerts & Events",
    description: "Sell tickets for festivals, concerts, conferences, and private exhibitions.",
    badge: "Event Planners",
  },
  {
    id: "SPORTS",
    title: "Sports Clubs & Stadiums",
    description: "Host football matches, tournaments, club memberships, and stadium VIP stands.",
    badge: "Stadiums & Clubs",
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

