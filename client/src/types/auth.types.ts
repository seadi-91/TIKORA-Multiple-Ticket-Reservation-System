export type UserRole = "CUSTOMER" | "ORGANIZATION" | "INSPECTOR" | "ADMIN";

export type OrganizationCategory = "BUS" | "CINEMA" | "EVENT" | "SPORTS";

export type AccountStatus = "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "INACTIVE";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  organizationId?: string;
  emailVerified?: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface CustomerRegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface OrganizationRegisterData {
  organizationName: string;
  category: OrganizationCategory;
  businessLicense: string;
  taxNumber?: string;
  contactPersonName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
  token?: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
  message?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

