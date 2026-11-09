export interface PlatformBookingRecord {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  providerId: string;
  providerName: string;
  serviceTitle: string;
  ticketId: string;
  category: "BUS" | "CINEMA" | "EVENT" | "SPORTS";
  quantity: number;
  seatNumbers: string[];
  seats: string[];
  totalAmount: number;
  customerPaid: number;
  subtotal: number;
  baseFare: number;
  vatAmount: number;
  vatRate: number;
  commissionRate: number;
  platformFee: number;
  providerPayout: number;
  providerNet: number;
  paymentMethod: "TELEBIRR" | "CBE_BIRR" | "CHAPA";
  paymentStatus: "PAID" | "PENDING" | "REFUNDED";
  bookingStatus: "CONFIRMED" | "CHECKED_IN" | "CANCELLED";
  bookingDate: string;
  createdAt?: string;
  travelDate?: string;
  departureTime?: string;
}

// Zero default bookings: only actual customer reservations appear in the system
export const DEFAULT_PLATFORM_BOOKINGS: PlatformBookingRecord[] = [];
