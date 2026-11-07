import { API_BASE_URL } from "./auth.service";
import { AdminUser, AdminOrganization, AdminInspector, PlatformStats, AdminAuditLog } from "@/stores/admin.store";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("tikora_auth_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const adminService = {
  async getUsers(): Promise<AdminUser[]> {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch platform users.");
    }

    const data = await res.json();
    return data.users || [];
  },

  async toggleUserStatus(userId: string, currentStatus: string): Promise<boolean> {
    const newStatus = currentStatus !== "ACTIVE";
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus }),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update user status.");
    }

    const data = await res.json();
    return data.isActive;
  },

  async createUser(payload: {
    name: string;
    email: string;
    phone?: string;
    role: "ADMIN" | "INSPECTOR" | "CUSTOMER";
    password?: string;
  }): Promise<AdminUser> {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create user.");
    }

    const data = await res.json();
    return data.user;
  },

  async getProviders(): Promise<AdminOrganization[]> {
    const res = await fetch(`${API_BASE_URL}/admin/providers`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch providers.");
    }

    const data = await res.json();
    return data.providers || [];
  },

  async updateProviderStatus(providerId: string, status: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/providers/${providerId}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update provider status.");
    }
  },

  async getInspectors(): Promise<AdminInspector[]> {
    const res = await fetch(`${API_BASE_URL}/admin/inspectors`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch inspectors.");
    }

    const data = await res.json();
    return data.inspectors || [];
  },

  async getOverview(): Promise<PlatformStats> {
    const res = await fetch(`${API_BASE_URL}/admin/overview`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch overview.");
    }

    const data = await res.json();
    return data.stats;
  },

  async getAuditLogs(): Promise<AdminAuditLog[]> {
    const res = await fetch(`${API_BASE_URL}/admin/audit-logs`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch audit logs.");
    }

    const data = await res.json();
    return data.auditLogs || [];
  },

  async createAuditLog(payload: Omit<AdminAuditLog, "id" | "timestamp">): Promise<AdminAuditLog | null> {
    const res = await fetch(`${API_BASE_URL}/admin/audit-logs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.log || null;
  },
};

