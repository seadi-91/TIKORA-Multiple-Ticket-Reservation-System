import { TicketCategory, TicketItem } from "./ticket.types";

export type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";

export interface PassengerInfo {
  fullName: string;
  phone: string;
  email: string;
  idNumber?: string;
  seatNumber?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string;
}

export interface BookingPriceBreakdown {
  basePrice: number;
  quantity: number;
  subtotal: number;
  serviceFee: number; // Platform fee
  platformFee?: number;
  tax: number; // VAT amount
  vatAmount?: number;
  discount: number;
  total: number;
  vatRate?: number; // Snapshot of VAT percentage at time of booking
  commissionRate?: number; // Snapshot of commission percentage at time of booking
  platformCommission?: number; // Snapshot of platform cut
  providerNet?: number; // Snapshot of provider net payout
}

export interface BookingRecord {
  id: string;
  bookingReference: string;
  ticketId: string;
  ticket: TicketItem;
  category: TicketCategory;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  passengers: PassengerInfo[];
  selectedSeats: string[];
  selectedTier?: string;
  quantity: number;
  pricing: BookingPriceBreakdown;
  subtotal?: number;
  customerPaid?: number;
  totalAmount?: number;
  vatAmount?: number;
  vatRate?: number;
  commissionRate?: number;
  platformFee?: number;
  providerNet?: number;
  providerPayout?: number;
  paymentMethod: string;
  paymentStatus: "PAID" | "PENDING" | "REFUNDED" | "FAILED";
  bookingStatus: BookingStatus;
  createdAt: string;
  qrCodeData: string;
  notes?: string;
}

export interface SeatInfo {
  id: string;
  row: string;
  number: number;
  label: string;
  type: "STANDARD" | "VIP" | "COUPLE" | "WINDOW" | "AISLE";
  price: number;
  isAvailable: boolean;
  isSelected?: boolean;
}

