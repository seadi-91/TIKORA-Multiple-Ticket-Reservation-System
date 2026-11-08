import { API_BASE_URL } from "./auth.service";
import { AdminUser, AdminOrganization, AdminInspector, PlatformStats, AdminAuditLog, AdminService, AdminCategory } from "@/stores/admin.store";

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

  async getTickets(): Promise<AdminService[]> {
    const res = await fetch(`${API_BASE_URL}/tickets`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return (data.tickets || []).map((t: any) => ({
      id: String(t.id),
      title: t.title,
      category: t.category,
      providerId: String(t.providerId || "1"),
      providerName: t.organizer || "Verified Provider",
      location: `${t.city || "Addis Ababa"} • ${t.time} (${t.category === "CINEMA" ? "Showtime" : "Departure"})`,
      price: t.price,
      status: t.status === "AVAILABLE" ? "ACTIVE" : "INACTIVE",
      totalSold: (t.totalSeats || 50) - (t.availableSeats || 50),
      capacity: t.totalSeats || 50,
      startDate: `${t.date} ${t.time}`,
      rating: t.rating || 5.0,
      imageUrl: t.imageUrl,
      time: t.time,
      date: t.date,
      venue: t.location,
      city: t.city,
      description: t.description,
      availableSeats: t.availableSeats,
      tiers: t.tiers,
      amenities: t.amenities,
      badge: t.badge,
      duration: t.duration,
      currency: t.currency || "ETB",
      reviewCount: t.reviewCount || 0,
      organizerVerified: t.organizerVerified,
    }));
  },

  async toggleTicketStatus(ticketId: string, currentStatus: string): Promise<string> {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to update ticket status on server");
    }
    return newStatus;
  },

  async getNotifications(): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/admin/notifications`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.notifications || [];
  },

  async deleteUser(userId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to delete user.");
    }
    return true;
  },

  async deleteProvider(providerId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/admin/providers/${providerId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to delete provider.");
    }
    return true;
  },

  async deleteTicket(ticketId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to delete ticket.");
    }
    return true;
  },

  async getCategories(): Promise<AdminCategory[]> {
    const res = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.categories || [];
  },

  async createCategory(payload: {
    name: string;
    slug?: string;
    description?: string;
    commissionRate?: number;
    icon?: string;
    isActive?: boolean;
  }): Promise<AdminCategory> {
    const res = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create category.");
    }

    const data = await res.json();
    return data.category;
  },

  async updateCategory(id: string, payload: Partial<AdminCategory>): Promise<AdminCategory> {
    const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update category.");
    }

    const data = await res.json();
    return data.category;
  },

  async deleteCategory(categoryId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to delete category.");
    }

    return true;
  },
};

