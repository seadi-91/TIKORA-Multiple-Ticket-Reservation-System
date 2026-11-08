import { BookingRecord, BookingPriceBreakdown } from "@/types/booking.types";
import { TicketItem } from "@/types/ticket.types";

export const BookingService = {
  calculatePricing(basePrice: number, quantity: number, discount = 0): BookingPriceBreakdown {
    const subtotal = Math.round(basePrice * quantity);
    // Platform commission is deducted from the provider side (0% charged to customer)
    const serviceFee = 0;
    // VAT is strictly 5% calculated on subtotal
    const tax = Math.round(subtotal * 0.05);
    // Total price is subtotal + 5% VAT - discount
    const total = subtotal + tax - discount;

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

