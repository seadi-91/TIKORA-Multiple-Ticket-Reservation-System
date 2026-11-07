import { API_BASE_URL } from "./auth.service";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("tikora_auth_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface UserProfileData {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  loyaltyPoints?: number;
  role: string;
  status: string;
  avatarUrl?: string;
  organizationName?: string;
  organizationId?: string;
  createdAt: string;
}

export const userService = {
  async getProfile(): Promise<UserProfileData> {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch user profile.");
    }

    const data = await res.json();
    return data.user;
  },

  async updateProfile(payload: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    address?: string;
    gender?: string;
    dateOfBirth?: string;
    profileImage?: string;
  }): Promise<{ message: string; user: Partial<UserProfileData> }> {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update profile.");
    }

    return res.json();
  },
};
