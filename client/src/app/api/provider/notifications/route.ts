import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const NOTIFICATIONS_FILE = path.join(DATA_DIR, "notifications.json");

function ensureDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("[Storage] Failed to initialize data directory:", err);
  }
}

function readNotifications(): any[] {
  ensureDirectory();
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const content = fs.readFileSync(NOTIFICATIONS_FILE, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch (err) {
    console.error("[Storage] Failed to read notifications.json:", err);
  }
  return [];
}

function writeNotifications(notifs: any[]) {
  ensureDirectory();
  try {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifs, null, 2), "utf-8");
  } catch (err) {
    console.error("[Storage] Failed to write notifications.json:", err);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get("providerId");
    const providerName = searchParams.get("providerName");
    const notifs = readNotifications();

    if (providerId || providerName) {
      const filtered = notifs.filter((n) => {
        const idMatch = !providerId || String(n.providerId) === String(providerId) || !n.providerId;
        const nameMatch =
          !providerName ||
          (n.providerName && n.providerName.toLowerCase().trim() === providerName.toLowerCase().trim()) ||
          !n.providerName;
        return idMatch && nameMatch;
      });
      return NextResponse.json({ success: true, notifications: filtered });
    }

    return NextResponse.json({ success: true, notifications: notifs });
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
    const notifs = readNotifications();

    const newNotif = {
      id: `notif-${Date.now()}`,
      providerId: body.providerId ? String(body.providerId) : undefined,
      providerName: body.providerName,
      type: body.type || "SYSTEM",
      title: body.title || "Notification",
      message: body.message || "",
      linkHref: body.linkHref || body.link || "/provider/dashboard",
      link: body.linkHref || body.link || "/provider/dashboard",
      isRead: false,
      createdAt: new Date().toISOString(),
      referenceId: body.referenceId,
    };

    notifs.unshift(newNotif);
    writeNotifications(notifs);

    return NextResponse.json({ success: true, notification: newNotif });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, markAll = false } = body;
    const notifs = readNotifications();

    if (markAll) {
      notifs.forEach((n) => (n.isRead = true));
    } else if (id) {
      const target = notifs.find((n) => n.id === id);
      if (target) {
        target.isRead = true;
      }
    }

    writeNotifications(notifs);
    return NextResponse.json({ success: true, message: "Notifications updated." });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

