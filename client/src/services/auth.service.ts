import {
  LoginCredentials,
  CustomerRegisterData,
  OrganizationRegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyOtpData,
  AuthResponse,
  AuthUser,
} from "@/types/auth.types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const authService = {
  getOAuthUrl(provider: "google" | "github", intent: "login" | "register" = "login"): string {
    return `${API_BASE_URL}/auth/${provider}?intent=${intent}`;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to log in. Please check your credentials.");
    }

    return res.json();
  },

  async registerCustomer(data: CustomerRegisterData): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register/customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Customer registration failed. Please try again.");
    }

    return res.json();
  },

  async registerOrganization(
    data: OrganizationRegisterData
  ): Promise<{ message: string; requiresApproval: boolean; user?: AuthUser; token?: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/register/organization`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Organization registration failed. Please try again.");
    }

    return res.json();
  },

  async getMe(token?: string): Promise<{ user: AuthUser }> {
    let resolvedToken = token;
    if (!resolvedToken && typeof window !== "undefined") {
      resolvedToken = localStorage.getItem("tikora_auth_token") || undefined;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (resolvedToken) {
      headers["Authorization"] = `Bearer ${resolvedToken}`;
    }

    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Session expired or unauthorized. Please log in.");
    }

    return res.json();
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignored
    }
  },

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Could not send password reset email.");
    }

    return res.json();
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to reset password.");
    }

    return res.json();
  },

  async verifyOtp(data: VerifyOtpData): Promise<{ verified: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Invalid or expired verification code.");
    }

    return res.json();
  },
};

export default authService;
