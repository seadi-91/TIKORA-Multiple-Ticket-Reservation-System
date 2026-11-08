import { NextResponse } from "next/server";

const CHAPA_SECRET_KEY =
  process.env.CHAPA_SECRET_KEY || "CHASECK_TEST-kWkkoI6YlIJm6m5zR6Z2ERwmuqKWanPQ";
const CHAPA_BASE_URL =
  process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ txRef: string }> }
) {
  try {
    const { txRef } = await params;

    if (!txRef) {
      return NextResponse.json(
        { success: false, verified: false, message: "Transaction reference is required." },
        { status: 400 }
      );
    }

    console.log(`[Next.js Chapa API] Verifying transaction ${txRef}...`);

    const chapaRes = await fetch(`${CHAPA_BASE_URL}/transaction/verify/${encodeURIComponent(txRef)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
    });

    const chapaData = await chapaRes.json().catch(() => ({}));

    if (!chapaRes.ok || chapaData.status !== "success") {
      console.warn("[Next.js Chapa API] Verification unconfirmed:", chapaData);
      return NextResponse.json({
        success: false,
        verified: false,
        message: chapaData.message || "Payment verification unconfirmed by gateway.",
        data: chapaData.data,
      });
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Payment successfully verified by Chapa gateway.",
      payment: chapaData.data,
    });
  } catch (err: any) {
    console.error("[Next.js Chapa API] Verification Error:", err);
    return NextResponse.json(
      { success: false, verified: false, message: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

