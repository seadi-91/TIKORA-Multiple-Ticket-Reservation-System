import { ENV } from "../../config/environment";
import { db } from "../../config/database";
import { AuditService } from "../admin/audit.service";

export interface InitializeChapaDto {
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
  txRef?: string;
  returnUrl?: string;
}

export class PaymentService {
  /**
   * Initialize a hosted Chapa transaction
   */
  static async initializeChapaTransaction(dto: InitializeChapaDto, user?: any) {
    if (!dto.amount || dto.amount <= 0) {
      throw new Error("Payment amount must be greater than 0.");
    }

    if (!dto.email) {
      throw new Error("Customer email is required for payment processing.");
    }

    const txRef =
      dto.txRef || `TIKORA-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const fullName = [dto.firstName, dto.lastName].filter(Boolean).join(" ") || "TIKORA Guest";
    const firstName = dto.firstName || fullName.split(" ")[0] || "Valued";
    const lastName = dto.lastName || fullName.split(" ")[1] || "Customer";
    const phoneNumber = dto.phone || user?.phone || "+251911000000";

    let returnUrl = dto.returnUrl;
    if (returnUrl) {
      const sep = returnUrl.includes("?") ? "&" : "?";
      if (!returnUrl.includes("tx_ref=")) {
        returnUrl = `${returnUrl}${sep}tx_ref=${encodeURIComponent(txRef)}`;
      }
    } else {
      returnUrl = `${ENV.CLIENT_URL}/payments/callback?tx_ref=${encodeURIComponent(
        txRef
      )}&ticketId=${dto.ticketId || ""}`;
    }

    let cleanEmail = (dto.email || "").trim().toLowerCase();
    if (!cleanEmail.includes("@") || cleanEmail.endsWith(".et") || cleanEmail.includes("tikora.et")) {
      cleanEmail = cleanEmail.replace(/@tikora\.et$/, "@gmail.com");
      if (!cleanEmail.includes("@")) {
        cleanEmail = "customer@gmail.com";
      }
    }

    const chapaPayload = {
      amount: String(dto.amount),
      currency: dto.currency || "ETB",
      email: cleanEmail,
      first_name: firstName.replace(/[^a-zA-Z0-9]/g, "") || "Valued",
      last_name: lastName.replace(/[^a-zA-Z0-9]/g, "") || "Customer",
      phone_number: phoneNumber,
      tx_ref: txRef,
      callback_url: ENV.CHAPA_CALLBACK_URL,
      return_url: returnUrl,
      customization: {
        title: "TIKORA",
        description: "TIKORA Ticket Pass",
      },
    };

    console.log(`[Chapa] Initializing transaction ${txRef} for ${dto.amount} ETB...`);

    const res = await fetch(`${ENV.CHAPA_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chapaPayload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.status !== "success") {
      console.error("[Chapa] Initialization failed:", data);
      const errMsg =
        typeof data.message === "object" && data.message !== null
          ? Object.values(data.message).flat().join(", ")
          : data.message || "Failed to initialize payment gateway with Chapa.";
      throw new Error(errMsg);
    }

    const checkoutUrl = data.data?.checkout_url;
    if (!checkoutUrl) {
      throw new Error("No checkout URL returned from Chapa payment gateway.");
    }

    // Persist pending booking and payment in PostgreSQL
    let bookingId: number | null = null;
    try {
      const resolvedUserId = user?.id || 1;
      const subtotal = Math.round(dto.amount / 1.05);

      const booking = await db.orm.public.Booking.create({
        bookingNumber: `BKG-${txRef}`,
        userId: resolvedUserId,
        customerName: fullName,
        customerEmail: dto.email,
        customerPhone: phoneNumber,
        selectedSeats: dto.selectedSeats ? JSON.stringify(dto.selectedSeats) : null,
        selectedTier: dto.selectedTier || "Standard",
        paymentMethod: "CHAPA",
        paymentStatus: "PENDING",
        subtotal: Number(subtotal),
        serviceFee: 0, // Commission is deducted from provider, NOT added to customer
        discount: 0,
        totalAmount: Number(dto.amount),
        currency: dto.currency || "ETB",
        status: "PENDING",
        notes: `Ticket #${dto.ticketId || "N/A"} - ${dto.ticketTitle || "Reservation"}`,
      });

      bookingId = booking.id;

      await db.orm.public.Payment.create({
        bookingId: booking.id,
        transactionNumber: txRef,
        paymentMethod: "CHAPA",
        paymentProvider: "CHAPA_ET",
        amount: Number(dto.amount),
        currency: dto.currency || "ETB",
        status: "PENDING",
        externalReference: txRef,
      });

      if (dto.ticketId) {
        await db.orm.public.BookingItem.create({
          bookingId: booking.id,
          offeringId: Number(dto.ticketId) || 1,
          quantity: dto.quantity || 1,
          unitPrice: Number(subtotal),
          totalPrice: Number(dto.amount),
        }).catch(() => {});
      }
    } catch (dbErr) {
      console.warn("[Chapa] Warning: Could not record pending booking to DB:", dbErr);
    }

    // Audit log
    await AuditService.record({
      userId: user?.id,
      actorName: fullName,
      actorRole: user?.role || "CUSTOMER",
      target: `Chapa Transaction ${txRef}`,
      action: "PAYMENT_INITIALIZED",
      entityType: "PAYMENT",
      entityId: txRef,
      details: `Initialized Chapa checkout for ${dto.amount} ETB (${dto.ticketTitle || "Pass"}).`,
      ipAddress: "127.0.0.1",
      severity: "INFO",
    });

    return {
      success: true,
      checkoutUrl,
      txRef,
      bookingId,
      bookingNumber: `BKG-${txRef}`,
    };
  }

  /**
   * Verify transaction status with Chapa and update database
   */
  static async verifyChapaTransaction(txRef: string) {
    if (!txRef) {
      throw new Error("Transaction reference (tx_ref) is required.");
    }

    console.log(`[Chapa] Verifying transaction ${txRef}...`);

    const res = await fetch(`${ENV.CHAPA_BASE_URL}/transaction/verify/${txRef}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ENV.CHAPA_SECRET_KEY}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.status !== "success") {
      console.warn("[Chapa] Verification response:", data);
      return {
        success: false,
        verified: false,
        message: data.message || "Payment verification unconfirmed by gateway.",
        data: data.data,
      };
    }

    const paymentData = data.data;

    // Update database records to PAID and CONFIRMED
    try {
      const payment = await db.orm.public.Payment.where({ transactionNumber: txRef }).first();
      if (payment) {
        await db.orm.public.Payment.where({ id: payment.id }).update({
          status: "PAID",
          paidAt: new Date(),
          receiptNumber: paymentData.reference || String(paymentData.id || txRef),
        });

        await db.orm.public.Booking.where({ id: payment.bookingId }).update({
          status: "CONFIRMED",
          paymentStatus: "PAID",
          confirmedAt: new Date(),
          qrCodeData: `TIKORA-PASS:${txRef}:${payment.amount}:PAID`,
        });
      }
    } catch (err) {
      console.warn("[Chapa] Warning: Failed to update DB on verification:", err);
    }

    return {
      success: true,
      verified: true,
      message: "Payment successfully verified by Chapa gateway.",
      payment: paymentData,
    };
  }
}
