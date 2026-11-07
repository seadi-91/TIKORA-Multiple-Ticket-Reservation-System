export type UserRoleType = "CUSTOMER" | "ORGANIZATION" | "INSPECTOR" | "ADMIN";

export interface JwtUserPayload {
  id: number;
  email: string;
  name: string;
  role: UserRoleType;
  organizationId?: number;
  organizationCategory?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  createdAt?: string;
  status: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "INACTIVE";
}

export interface ClientAuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRoleType;
  status: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "INACTIVE";
  avatarUrl?: string;
  organizationId?: string;
  organizationCategory?: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthResponseDto {
  user: ClientAuthUser;
  token: string;
  message?: string;
}

declare global {
  namespace Express {
    interface User extends JwtUserPayload {}
  }
}
