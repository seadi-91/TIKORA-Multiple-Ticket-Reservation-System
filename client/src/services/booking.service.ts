import { BookingPriceBreakdown } from "@/types/booking.types";
import { useAdminStore } from "@/stores/admin.store";

export const BookingService = {
  calculatePricing(
    basePrice: number,
    quantity: number,
    discount = 0,
    category?: string,
    customVatRate?: number,
    customCommissionRate?: number
  ): BookingPriceBreakdown {
    const settings = useAdminStore.getState().settings;

    // Resolve VAT rate dynamically from active platform settings (default 5.0%)
    const vatRate =
      typeof customVatRate === "number"
        ? customVatRate
        : Number(settings?.vatTaxRate ?? 5.0);

    // Resolve sector-specific commission rate dynamically from active platform settings
    let defaultCatRate = Number(settings?.defaultCommissionRate ?? 5.0);
    if (category) {
      const upper = category.toUpperCase();
      if (upper === "BUS") defaultCatRate = Number(settings?.busCommissionRate ?? defaultCatRate);
      else if (upper === "CINEMA") defaultCatRate = Number(settings?.cinemaCommissionRate ?? defaultCatRate);
      else if (upper === "EVENT") defaultCatRate = Number(settings?.eventCommissionRate ?? defaultCatRate);
      else if (upper === "SPORTS") defaultCatRate = Number(settings?.sportsCommissionRate ?? defaultCatRate);
    }

    const commissionRate =
      typeof customCommissionRate === "number"
        ? customCommissionRate
        : defaultCatRate;

    const subtotal = Math.round(basePrice * quantity);
    // VAT is calculated strictly on pre-tax subtotal using active VAT percentage
    const tax = Math.round(subtotal * (vatRate / 100) * 100) / 100;
    // Total price customer pays is subtotal + statutory VAT - loyalty discount
    const total = Math.round((subtotal + tax - discount) * 100) / 100;

    // Platform commission is deducted from pre-tax base fare (provider side)
    const platformCommission = Math.round(subtotal * (commissionRate / 100) * 100) / 100;
    // Net provider settlement = subtotal - platform fee
    const providerNet = Math.max(0, Math.round((subtotal - platformCommission) * 100) / 100);

    return {
      basePrice,
      quantity,
      subtotal,
      serviceFee: 0,
      tax,
      discount,
      total,
      vatRate,
      commissionRate,
      platformCommission,
      providerNet,
    };
  },

  generateBookingReference(category: string): string {
    const prefix = category.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `TH-${prefix}-${randomNum}`;
  },
};

