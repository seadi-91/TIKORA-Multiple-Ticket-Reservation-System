import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getDataDirs(): string[] {
  const dirs = [
    path.join(process.cwd(), "client", ".data"),
    path.join(process.cwd(), ".data"),
  ];
  return Array.from(new Set(dirs));
}

const PAYOUTS_FILE = "payouts.json";
const NOTIFICATIONS_FILE = "notifications.json";
const BOOKINGS_FILE = "bookings.json";

function ensureDirectory() {
  for (const dir of getDataDirs()) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (err) {
      console.error("[Storage] Failed to initialize data directory:", err);
    }
  }
}

function readJsonFile<T>(fileName: string, fallback: T): T {
  ensureDirectory();
  for (const dir of getDataDirs()) {
    try {
      const filePath = path.join(dir, fileName);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(content || "[]");
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as unknown as T;
        }
      }
    } catch (err) {
      console.error(`[Storage] Failed to read ${fileName}:`, err);
    }
  }
  return fallback;
}

function writeJsonFile(fileName: string, data: any) {
  ensureDirectory();
  for (const dir of getDataDirs()) {
    try {
      const filePath = path.join(dir, fileName);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error(`[Storage] Failed to write ${fileName}:`, err);
    }
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get("providerId");
    const providerName = searchParams.get("providerName");

    const payouts = readJsonFile<any[]>(PAYOUTS_FILE, []);

    if (providerId || providerName) {
      const filtered = payouts.filter((p) => {
        const idMatch = providerId && String(p.providerId) === String(providerId);
        const nameMatch =
          providerName &&
          p.providerName &&
          p.providerName.toLowerCase().trim() === providerName.toLowerCase().trim();
        return idMatch || nameMatch;
      });
      return NextResponse.json({ success: true, payouts: filtered });
    }

    return NextResponse.json({ success: true, payouts });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      providerId,
      providerName,
      providerEmail,
      amount,
      netAmount,
      fee = 0,
      payoutMethod = "CHAPA",
      notes,
      payoutReference,
      accountNumber,
      bankName,
      accountHolder,
      remainingBalance = 0,
    } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid payout amount is required." },
        { status: 400 }
      );
    }

    const ref = payoutReference || `CHAPA-PO-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const actualNetAmount = Number(netAmount !== undefined ? netAmount : numAmount - Number(fee));

    // 1. Record payout with idempotency check
    const payouts = readJsonFile<any[]>(PAYOUTS_FILE, []);
    const existingPayout = payouts.find(
      (p) => p.reference === ref || (p.id && (p.id === body.id || p.id === `payout-${ref}`))
    );

    let recordedPayout = existingPayout;

    if (!existingPayout) {
      recordedPayout = {
        id: body.id || `payout-${Date.now()}`,
        reference: ref,
        providerId: String(providerId || "1"),
        providerName: providerName || "Provider",
        amount: numAmount,
        fee: Number(fee),
        netAmount: actualNetAmount,
        currency: "ETB",
        status: "COMPLETED",
        payoutMethod: payoutMethod || "CHAPA",
        bankName: bankName || "Commercial Bank of Ethiopia (CBE)",
        accountNumber: accountNumber || "",
        accountName: accountHolder || providerName || "Provider",
        requestedAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
        notes: notes || `Chapa transfer payout dispatched by admin to ${providerName || "Provider"}`,
      };

      payouts.unshift(recordedPayout);
      writeJsonFile(PAYOUTS_FILE, payouts);
    }

    // 2. Create notification for the provider in notifications.json (English only, deduplicated)
    const notifications = readJsonFile<any[]>(NOTIFICATIONS_FILE, []);
    const remainingNum = Number(remainingBalance) || 0;
    const existingNotif = notifications.find((n) => n.referenceId === ref);

    let newNotification = existingNotif;
    if (!existingNotif) {
      newNotification = {
        id: `notif-${Date.now()}`,
        providerId: String(providerId || "1"),
        providerName: providerName || "Provider",
        type: "PAYMENT",
        title: "Payout Dispatched Successfully",
        message: `Admin has transferred ${actualNetAmount.toLocaleString()} ETB via Chapa. Remaining balance on platform: ${remainingNum.toLocaleString()} ETB.`,
        linkHref: "/provider/payments",
        link: "/provider/payments",
        isRead: false,
        createdAt: new Date().toISOString(),
        referenceId: ref,
      };

      notifications.unshift(newNotification);
      writeJsonFile(NOTIFICATIONS_FILE, notifications.slice(0, 50));
    }

    // 4. Forward to Express backend to dispatch official SMTP email and audit log
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      await fetch(`${backendUrl}/admin/providers/${providerId || 1}/payout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          fee: Number(fee),
          payoutMethod,
          notes,
          payoutReference: ref,
          providerName,
          providerEmail,
          remainingBalance: remainingNum,
        }),
      }).catch(() => {});
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Payout transfer recorded successfully and provider notified.",
      payout: recordedPayout,
      notification: newNotification,
      remainingBalance: remainingNum,
    });
  } catch (err: any) {
    console.error("[POST /api/admin/payout] Error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const providerId = searchParams.get("providerId");

    let payouts = readJsonFile<any[]>(PAYOUTS_FILE, []);
    const initialCount = payouts.length;

    if (providerId) {
      const cleanPId = String(providerId).replace(/^org-/, "").trim().toLowerCase();
      payouts = payouts.filter((p) => {
        const pId = String(p.providerId || "").replace(/^org-/, "").trim().toLowerCase();
        return pId !== cleanPId;
      });
    } else if (id) {
      payouts = payouts.filter((p) => String(p.id) !== String(id) && String(p.reference) !== String(id));
    } else {
      return NextResponse.json({ success: false, message: "ID or providerId required." }, { status: 400 });
    }

    writeJsonFile(PAYOUTS_FILE, payouts);
    return NextResponse.json({ success: true, message: "Payout(s) deleted.", deletedCount: initialCount - payouts.length });
  } catch (err: any) {
    console.error("[DELETE /api/admin/payout] Error:", err);
    return NextResponse.json({ success: false, message: err?.message || "Internal server error." }, { status: 500 });
  }
}


