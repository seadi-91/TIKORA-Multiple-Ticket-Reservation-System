import { BookingRecord, BookingPriceBreakdown } from "@/types/booking.types";
import { TicketItem } from "@/types/ticket.types";

export const BookingService = {
  calculatePricing(basePrice: number, quantity: number, discount = 0): BookingPriceBreakdown {
    const subtotal = basePrice * quantity;
    const serviceFee = Math.round(subtotal * 0.05); // 5% platform charge
    const tax = Math.round((subtotal + serviceFee) * 0.15); // 15% VAT
    const total = subtotal + serviceFee + tax - discount;

    return {
      basePrice,
      quantity,
      subtotal,
      serviceFee,
      tax,
      discount,
      total,
    };
  },

  generateBookingReference(category: string): string {
    const prefix = category.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `TH-${prefix}-${randomNum}`;
  },
};

