export type NotificationType =
  | "BOOKING_CONFIRMATION"
  | "PAYMENT_SUCCESS"
  | "REMINDER"
  | "CANCELLATION"
  | "REFUND"
  | "PROMOTION";

export interface CustomerNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  referenceId?: string;
}

