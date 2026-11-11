import { API_BASE_URL } from "./auth.service";
import {
  useAdminStore,
  AdminUser,
  AdminOrganization,
  AdminInspector,
  PlatformStats,
  AdminAuditLog,
  AdminService,
  AdminCategory,
  AdminBooking,
  AdminRefund,
  AdminSupportTicket,
  AdminPayout,
  AdminSettings,
} from "@/stores/admin.store";

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
    return (data.inspectors || []).map((i: any) => ({
      id: String(i.id),
      badgeId: i.badgeId || `INS-${String(i.id).padStart(4, "0")}`,
      name: i.name || "Field Inspector",
      email: i.email || "",
      phone: i.phone || "N/A",
      nationalId: i.nationalId || `ET-FAN-${String(i.id).padStart(6, "0")}`,
      organizationId: String(i.organizationId || "1"),
      organizationName: i.organizationName || "Verified Organization",
      organizationCategory: (i.organizationCategory || i.category || "BUS") as any,
      assignedStation: i.assignedStation || "Addis Ababa Central Station",
      addedBy: i.addedBy || {
        name: "Platform Security & Admin",
        email: "security@tikora.et",
        role: "SYSTEM_SUPER_ADMIN",
      },
      createdAt: i.createdAt || i.joinedDate || new Date().toISOString().split("T")[0],
      lastActive: i.lastActive || "Just now",
      status: (i.status === "ACTIVE" ? "ACTIVE" : i.status === "SUSPENDED" ? "SUSPENDED" : "INACTIVE") as any,
      totalScans: Number(i.totalScans || 0),
      validScans: Number(i.validScans || 0),
      flaggedScans: Number(i.flaggedScans || i.flaggedTickets || 0),
      deviceModel: i.deviceModel || "Sunmi V2 Pro Android POS Scanner",
      appVersion: i.appVersion || "Tikora Gate v2.4.1",
      shiftSchedule: i.shiftSchedule || "Full Time: 08:00 - 17:00",
    }));
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

  async deleteAuditLogs(ids: string[]): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/audit-logs`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids }),
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async clearAllAuditLogs(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/audit-logs`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ deleteAll: true }),
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getSettings(): Promise<AdminSettings> {
    const res = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch platform settings.");
    }

    const data = await res.json();
    return data.settings;
  },

  async getPublicSettings(): Promise<Partial<AdminSettings>> {
    try {
      const res = await fetch(`${API_BASE_URL}/platform/settings`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) return data.settings;
      }
    } catch {}
    return {};
  },

  async updateSettings(payload: Partial<AdminSettings>): Promise<AdminSettings> {
    const res = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: "PUT",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update platform settings.");
    }

    const data = await res.json();
    return data.settings;
  },

  async uploadLogo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      headers: {
        Authorization: typeof window !== "undefined" ? `Bearer ${localStorage.getItem("tikora_token") || ""}` : "",
      },
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to upload logo image.");
    }

    const data = await res.json();
    return data.url || data.imageUrl || "";
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
    return (data.tickets || []).map((t: any) => {
      const capacity = Number(t.totalSeats || t.capacity || 100);
      const totalSold = Number(
        t.totalSold !== undefined
          ? t.totalSold
          : t.soldQuantity !== undefined
          ? t.soldQuantity
          : Math.max(0, capacity - (t.availableSeats ?? capacity))
      );
      const remainingCapacity = Number(
        t.remainingCapacity !== undefined
          ? t.remainingCapacity
          : t.availableSeats !== undefined
          ? t.availableSeats
          : Math.max(0, capacity - totalSold)
      );

      return {
        id: String(t.id),
        title: t.title,
        category: t.category,
        providerId: String(t.providerId || "1"),
        providerName: t.organizer || "Verified Provider",
        location: `${t.city || "Addis Ababa"} • ${t.time} (${t.category === "CINEMA" ? "Showtime" : "Departure"})`,
        price: t.price,
        status: t.status === "AVAILABLE" ? "ACTIVE" : (t.status || "ACTIVE"),
        totalSold: Math.max(0, totalSold),
        capacity,
        availableSeats: Math.max(0, remainingCapacity),
        remainingCapacity: Math.max(0, remainingCapacity),
        startDate: `${t.date} ${t.time}`,
        rating: t.rating || 5.0,
        imageUrl: t.imageUrl,
        time: t.time,
        date: t.date,
        venue: t.location,
        city: t.city,
        description: t.description,
        tiers: t.tiers,
        amenities: t.amenities,
        badge: t.badge,
        duration: t.duration,
        currency: t.currency || "ETB",
        reviewCount: t.reviewCount || 0,
        organizerVerified: t.organizerVerified,
      };
    });
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

  async deleteBooking(bookingId: string, bookingRef?: string): Promise<boolean> {
    try {
      const refQuery = bookingRef ? `&reference=${encodeURIComponent(bookingRef)}` : "";
      await fetch(`/api/bookings?id=${encodeURIComponent(bookingId)}${refQuery}`, {
        method: "DELETE",
      });
    } catch {}

    try {
      await fetch(`${API_BASE_URL}/admin/bookings/${encodeURIComponent(bookingId)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
    } catch {}

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

  async getBookings(): Promise<AdminBooking[]> {
    let backendBookings: AdminBooking[] = [];
    try {
      const res = await fetch(`${API_BASE_URL}/admin/bookings`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        backendBookings = (data.bookings || []).map((b: any) => {
          const s = b.seatNumbers || b.seats || [];
          return {
            ...b,
            seatNumbers: s,
            seats: s,
            quantity: b.quantity || s.length || 1,
          };
        });
      }
    } catch {}

    let clientApiBookings: AdminBooking[] = [];
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          const adminSettings = useAdminStore.getState().settings;
          clientApiBookings = data.bookings.map((b: any) => {
            const total = Number(
              b.pricing?.total ||
                b.customerPaid ||
                b.totalAmount ||
                (b.ticket?.price ? b.ticket.price * (b.quantity || 1) : 500)
            );
            const bCategory = (b.category || b.ticket?.category || "BUS") as string;
            const catRate =
              bCategory === "BUS"
                ? adminSettings.busCommissionRate
                : bCategory === "CINEMA"
                ? adminSettings.cinemaCommissionRate
                : bCategory === "EVENT"
                ? adminSettings.eventCommissionRate
                : bCategory === "SPORTS"
                ? adminSettings.sportsCommissionRate
                : adminSettings.defaultCommissionRate ?? 5.0;

            const vatRate = Number(b.pricing?.vatRate ?? b.vatRate ?? adminSettings.vatTaxRate ?? 5.0);
            const commissionRate = Number(b.pricing?.commissionRate ?? b.commissionRate ?? catRate);
            const customerPaid = total;
            const vatAmount = Number(
              b.pricing?.vatAmount ??
                b.vatAmount ??
                Math.round(((total * vatRate) / (100 + vatRate)) * 100) / 100
            );
            const baseFare = Math.max(0, Math.round((customerPaid - vatAmount) * 100) / 100);
            const platformFee = Number(
              b.pricing?.platformFee ??
                b.platformFee ??
                Math.round(baseFare * (commissionRate / 100) * 100) / 100
            );
            const providerPayout = Number(
              b.pricing?.providerNet ??
                b.providerNet ??
                b.providerPayout ??
                Math.max(0, Math.round((baseFare - platformFee) * 100) / 100)
            );
            const seats =
              (b.selectedSeats && b.selectedSeats.length > 0 && b.selectedSeats) ||
              (b.seats && b.seats.length > 0 && b.seats) ||
              [b.selectedTier || "Standard Pass"];

            return {
              id: String(b.id || b.bookingReference),
              reference: String(b.bookingReference || b.reference || b.id),
              customerName: b.customerName || "Valued Customer",
              customerEmail: b.customerEmail || "customer@tikora.et",
              customerPhone: b.customerPhone || "0911000000",
              providerId: String(b.ticket?.providerId || b.providerId || "1"),
              providerName: b.ticket?.organizer || b.providerName || "Verified Organization",
              serviceTitle: b.serviceTitle || b.ticket?.title || "TIKORA Experience Pass",
              category: (b.category || b.ticket?.category || "BUS") as any,
              quantity: b.quantity || seats.length || 1,
              seatNumbers: seats,
              seats,
              totalAmount: total,
              customerPaid,
              subtotal: baseFare,
              baseFare,
              vatAmount,
              vatRate,
              commissionRate,
              platformFee,
              providerPayout,
              providerNet: providerPayout,
              paymentMethod: (b.paymentMethod || "CHAPA") as any,
              paymentStatus: (b.paymentStatus || "PAID") as any,
              bookingStatus: (b.bookingStatus || "CONFIRMED") as any,
              bookingDate: b.createdAt
                ? new Date(b.createdAt).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
              travelDate: b.ticket?.date || b.travelDate,
              departureTime: b.ticket?.time || b.departureTime,
            };
          });
        }
      }
    } catch {}

    const map = new Map<string, AdminBooking>();
    for (const b of backendBookings) {
      if (!String(b.id || "").startsWith("bkg-") && !String(b.reference || "").startsWith("TIKORA-BKG-10")) {
        map.set(b.reference, b);
      }
    }
    for (const b of clientApiBookings) {
      if (!String(b.id || "").startsWith("bkg-") && !String(b.reference || "").startsWith("TIKORA-BKG-10")) {
        map.set(b.reference, b);
      }
    }

    return Array.from(map.values());
  },

  async getRefunds(): Promise<AdminRefund[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/refunds`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        return data.refunds || [];
      }
    } catch {}
    return [];
  },

  async getSupportTickets(): Promise<AdminSupportTicket[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/support`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        return data.supportTickets || [];
      }
    } catch {}
    return [];
  },
};

