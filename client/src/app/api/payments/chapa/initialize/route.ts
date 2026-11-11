import { NextResponse } from "next/server";

const CHAPA_SECRET_KEY =
  process.env.CHAPA_SECRET_KEY || "CHASECK_TEST-kWkkoI6YlIJm6m5zR6Z2ERwmuqKWanPQ";
const CHAPA_BASE_URL =
  process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amount,
      currency = "ETB",
      email,
      firstName,
      lastName,
      phone,
      ticketId,
      ticketTitle,
      category,
      selectedSeats,
      selectedTier,
      quantity = 1,
      returnUrl: clientReturnUrl,
      txRef: clientTxRef,
    } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid payment amount is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Customer email is required for payment." },
        { status: 400 }
      );
    }

    const txRef = clientTxRef || `TIKORA-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fName = firstName || "TIKORA";
    const lName = lastName || "Customer";
    const phoneNum = phone || "+251911000000";

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    // Keep full returnUrl including query parameters if provided by caller
    let returnUrl = clientReturnUrl ? clientReturnUrl.trim() : `${origin}/payments/callback`;

    let cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail.includes("@") || cleanEmail.endsWith(".et") || cleanEmail.includes("tikora.et")) {
      cleanEmail = cleanEmail.replace(/@tikora\.et$/, "@gmail.com");
      if (!cleanEmail.includes("@")) {
        cleanEmail = "customer@gmail.com";
      }
    }

    const chapaPayload = {
      amount: String(amount),
      currency: currency || "ETB",
      email: cleanEmail,
      first_name: fName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 30) || "Valued",
      last_name: lName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 30) || "Customer",
      phone_number: phoneNum,
      tx_ref: txRef,
      callback_url: `${origin}/api/payments/chapa/webhook`,
      return_url: returnUrl,
      customization: {
        title: "TIKORA",
        description: "TIKORA Ticket Pass",
      },
    };

    console.log(`[Next.js Chapa API] Initializing tx_ref ${txRef} for ${amount} ETB...`);

    const chapaRes = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chapaPayload),
    });

    const chapaData = await chapaRes.json().catch(() => ({}));

    if (!chapaRes.ok || chapaData.status !== "success") {
      console.error("[Next.js Chapa API] Initialization failed:", chapaData);
      const errMsg =
        typeof chapaData.message === "object" && chapaData.message !== null
          ? Object.values(chapaData.message).flat().join(", ")
          : chapaData.message || "Failed to initialize payment gateway with Chapa.";
      return NextResponse.json(
        {
          success: false,
          message: errMsg,
        },
        { status: chapaRes.status || 400 }
      );
    }

    const checkoutUrl = chapaData.data?.checkout_url;
    if (!checkoutUrl) {
      return NextResponse.json(
        { success: false, message: "No checkout URL returned from Chapa." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl,
      txRef,
      bookingNumber: `BKG-${txRef}`,
      message: "Chapa payment session initialized successfully.",
    });
  } catch (err: any) {
    console.error("[Next.js Chapa API] Error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

