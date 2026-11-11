import { PaymentTransaction } from "@/types/payment.types";
import { API_BASE_URL } from "./auth.service";

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("tikora_auth_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

export interface ChapaInitializeRequest {
  amount: number;
  currency?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  ticketId?: string | number;
  ticketTitle?: string;
  category?: string;
  selectedSeats?: string[];
  selectedTier?: string;
  quantity?: number;
  returnUrl?: string;
  txRef?: string;
}

export interface ChapaInitializeResponse {
  success: boolean;
  checkoutUrl: string;
  txRef: string;
  bookingId?: number;
  bookingNumber?: string;
  message?: string;
}

export interface ChapaVerifyResponse {
  success: boolean;
  verified: boolean;
  message: string;
  payment?: any;
}

export const PaymentService = {
  getPaymentHistory(): PaymentTransaction[] {
    return [];
  },

  /**
   * Initialize a hosted Chapa payment transaction
   */
  async initializeChapaPayment(payload: ChapaInitializeRequest): Promise<ChapaInitializeResponse> {
    // 1. Try Express backend endpoint (port 8000)
    try {
      const res = await fetch(`${API_BASE_URL}/payments/chapa/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.success && data.checkoutUrl) {
          return data;
        }
      }
    } catch {
      // Backend 8000 not reachable; continue to internal Next.js API route
    }

    // 2. Fallback to Next.js internal API route (/api/payments/chapa/initialize)
    const localRes = await fetch(`/api/payments/chapa/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    const localData = await localRes.json().catch(() => ({}));

    if (!localRes.ok || !localData.success) {
      throw new Error(localData.message || "Failed to initialize Chapa payment.");
    }

    return localData;
  },

  /**
   * Verify a Chapa transaction by reference code
   */
  async verifyChapaPayment(txRef: string): Promise<ChapaVerifyResponse> {
    // 1. Try Express backend endpoint (port 8000)
    try {
      const res = await fetch(`${API_BASE_URL}/payments/chapa/verify/${encodeURIComponent(txRef)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.success) {
          return data;
        }
      }
    } catch {
      // Backend 8000 not reachable; continue to internal Next.js API route
    }

    // 2. Fallback to Next.js internal API route (/api/payments/chapa/verify/[txRef])
    const localRes = await fetch(`/api/payments/chapa/verify/${encodeURIComponent(txRef)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const localData = await localRes.json().catch(() => ({}));

    if (!localRes.ok) {
      throw new Error(localData.message || "Failed to verify payment with gateway.");
    }

    return localData;
  },
};
