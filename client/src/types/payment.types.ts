export type PaymentStatus = "COMPLETED" | "PENDING" | "REFUNDED" | "FAILED";

export interface PaymentTransaction {
  id: string;
  transactionReference: string;
  bookingReference: string;
  ticketTitle: string;
  category: "BUS" | "CINEMA" | "EVENT" | "SPORTS";
  amount: number;
  currency: string;
  paymentMethod: "TELEBIRR" | "CBE_BIRR" | "CHAPA" | "BANK_CARD";
  status: PaymentStatus;
  date: string;
  receiptNumber: string;
}

