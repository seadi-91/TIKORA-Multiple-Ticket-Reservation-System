import { CustomerProfile } from "@/types/user.types";

export const UserService = {
  getCurrentCustomer(): CustomerProfile | null {
    if (typeof window !== "undefined") {
      try {
        const userJson = localStorage.getItem("tikora_auth_user");
        if (userJson) {
          const user = JSON.parse(userJson);
          return {
            id: user.id || "cust-user",
            name: user.name || "Customer",
            email: user.email || "",
            phone: user.phone || "",
            role: user.role || "CUSTOMER",
            status: "ACTIVE",
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            totalBookings: 0,
            loyaltyPoints: 0,
          };
        }
      } catch {}
    }
    return null;
  },
};
