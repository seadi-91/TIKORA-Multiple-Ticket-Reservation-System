import { CustomerProfile } from "@/types/user.types";

export const MOCK_CUSTOMER: CustomerProfile = {
  id: "cust-001",
  name: "Abebe Bekele",
  email: "abebe.customer@tikora.et",
  phone: "+251 91 123 4567",
  role: "CUSTOMER",
  status: "ACTIVE",
  emailVerified: true,
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  createdAt: "2025-01-10T10:00:00Z",
  updatedAt: "2026-10-15T12:00:00Z",
  totalBookings: 8,
  loyaltyPoints: 480,
};

export const UserService = {
  getCurrentCustomer(): CustomerProfile {
    return MOCK_CUSTOMER;
  },
};

