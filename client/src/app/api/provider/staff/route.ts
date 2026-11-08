import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const STAFF_FILE = path.join(DATA_DIR, "staff.json");

function ensureStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STAFF_FILE)) {
      fs.writeFileSync(STAFF_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("[Storage] Failed to initialize staff storage:", err);
  }
}

function readStaff(): any[] {
  ensureStorage();
  try {
    if (fs.existsSync(STAFF_FILE)) {
      const content = fs.readFileSync(STAFF_FILE, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch (err) {
    console.error("[Storage] Failed to read staff.json:", err);
  }
  return [];
}

function writeStaff(staff: any[]) {
  ensureStorage();
  try {
    fs.writeFileSync(STAFF_FILE, JSON.stringify(staff, null, 2), "utf-8");
  } catch (err) {
    console.error("[Storage] Failed to write staff.json:", err);
  }
}

export async function GET() {
  try {
    const staff = readStaff();
    return NextResponse.json({ success: true, staff });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password, assignedStation, role } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const staffList = readStaff();
    const existingIdx = staffList.findIndex((s) => s.email?.toLowerCase() === email.toLowerCase());

    const staffMember = {
      id: `st-${Date.now()}`,
      fullName,
      email: email.toLowerCase(),
      phone: phone || "+251 91 123 4567",
      password, // Stored for mock auth fallback
      role: role || "INSPECTOR",
      assignedStation: assignedStation || "Main Gate Terminal",
      status: "ACTIVE",
      scannedTicketsCount: 0,
      lastActive: "Just now",
      dateAdded: new Date().toISOString().split("T")[0],
    };

    if (existingIdx >= 0) {
      staffList[existingIdx] = { ...staffList[existingIdx], ...staffMember };
    } else {
      staffList.unshift(staffMember);
    }

    writeStaff(staffList);

    return NextResponse.json({
      success: true,
      message: `Staff inspector ${fullName} registered successfully.`,
      staffMember,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

