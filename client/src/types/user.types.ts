import { UserRole, AccountStatus, OrganizationCategory } from "./auth.types";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: AccountStatus;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile extends User {
  role: "CUSTOMER";
  totalBookings: number;
  loyaltyPoints: number;
}

export interface OrganizationProfile extends User {
  role: "ORGANIZATION";
  organizationName: string;
  category: OrganizationCategory;
  businessLicense: string;
  taxNumber?: string;
  isVerified: boolean;
  city: string;
  address: string;
  website?: string;
  description?: string;
}

export interface InspectorProfile extends User {
  role: "INSPECTOR";
  organizationId: string;
  assignedStation?: string;
  activeScansCount: number;
}

