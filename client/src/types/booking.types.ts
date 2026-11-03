import { TicketCategory, TicketItem } from "./ticket.types";

export type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";

export interface PassengerInfo {
  fullName: string;
  phone: string;
  email: string;
  idNumber?: string;
  seatNumber?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface BookingPriceBreakdown {
  basePrice: number;
  quantity: number;
  subtotal: number;
  serviceFee: number; // 5% platform charge
  tax: number; // 15% VAT
  discount: number;
  total: number;
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

