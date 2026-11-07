import { API_BASE_URL } from "./auth.service";
import { ProviderOrganization } from "@/stores/provider.store";

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
};

