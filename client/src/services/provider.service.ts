import { API_BASE_URL } from "./auth.service";
import { ProviderOrganization, ProviderStaffMember } from "@/stores/provider.store";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("tikora_auth_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const providerService = {
  async getProfile(): Promise<ProviderOrganization> {
    const res = await fetch(`${API_BASE_URL}/provider/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch organization profile.");
    }

    const data = await res.json();
    return data.organization;
  },

  async updateProfile(payload: Partial<ProviderOrganization>): Promise<ProviderOrganization> {
    const res = await fetch(`${API_BASE_URL}/provider/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update organization profile.");
    }

    const data = await res.json();
    return data.organization;
  },

  async getStaff(): Promise<ProviderStaffMember[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/provider/staff`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.staff)) {
          return data.staff;
        }
      }
    } catch {}

    // Fallback to Next.js API route
    try {
      const res = await fetch("/api/provider/staff");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.staff)) {
          return data.staff;
        }
      }
    } catch {}

    return [];
  },

  async createStaff(payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    assignedStation?: string;
    role?: string;
  }): Promise<ProviderStaffMember> {
    let result: ProviderStaffMember | null = null;
    let serverError = "";

    // 1. Try Express backend
    try {
      const res = await fetch(`${API_BASE_URL}/provider/staff`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.staffMember) {
          result = data.staffMember;
        }
      } else {
        const err = await res.json().catch(() => ({}));
        serverError = err.message || "";
      }
    } catch {}

    // 2. Also sync to Next.js route for client persistence
    try {
      const res = await fetch("/api/provider/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.staffMember && !result) {
          result = data.staffMember;
        }
      }
    } catch {}

    if (result) return result;
    if (serverError) throw new Error(serverError);

    // Fallback in-memory
    return {
      id: `st-${Date.now()}`,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      role: (payload.role as any) || "INSPECTOR",
      assignedStation: payload.assignedStation || "Main Gate Terminal",
      status: "ACTIVE",
      scannedTicketsCount: 0,
      lastActive: "Just now",
      dateAdded: new Date().toISOString().split("T")[0],
    };
  },

  async toggleStaffStatus(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/provider/staff/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
      });
    } catch {}

    try {
      await fetch(`/api/provider/staff/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
    } catch {}
  },

  async deleteStaff(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/provider/staff/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
    } catch {}

    try {
      await fetch(`/api/provider/staff/${id}`, {
        method: "DELETE",
      });
    } catch {}
  },
};

