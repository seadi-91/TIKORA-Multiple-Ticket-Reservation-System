import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Server-side persistent storage for confirmed bookings and payments
const DATA_DIR = path.join(process.cwd(), ".data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

function ensureStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(BOOKINGS_FILE)) {
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("[Storage] Failed to initialize data directory:", err);
  }
}

function readStoredBookings(): any[] {
  ensureStorage();
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const content = fs.readFileSync(BOOKINGS_FILE, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch (err) {
    console.error("[Storage] Failed to read bookings.json:", err);
  }
  return [];
}

function writeStoredBookings(bookings: any[]) {
  ensureStorage();
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
  } catch (err) {
    console.error("[Storage] Failed to write bookings.json:", err);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference") || searchParams.get("txRef");
    const bookings = readStoredBookings();

    if (reference) {
      const matched = bookings.find(
        (b) =>
          b.bookingReference === reference ||
          b.id === reference ||
          (b.bookingReference && b.bookingReference.includes(reference))
      );
      if (matched) {
        return NextResponse.json({ success: true, booking: matched });
      }
      return NextResponse.json({ success: false, message: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, bookings });
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
    const { booking, txRef } = body;

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking payload is required." },
        { status: 400 }
      );
    }

    const bookings = readStoredBookings();
    const targetRef = booking.bookingReference || txRef || booking.id;

    const existingIndex = bookings.findIndex(
      (b) =>
        b.bookingReference === targetRef ||
        b.id === targetRef ||
        b.id === booking.id
    );

    const updatedBooking = {
      ...booking,
      bookingReference: targetRef,
      bookingStatus: "CONFIRMED",
      paymentStatus: "PAID",
      paymentMethod: booking.paymentMethod || "CHAPA",
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      bookings[existingIndex] = { ...bookings[existingIndex], ...updatedBooking };
    } else {
      bookings.unshift(updatedBooking);
    }

    writeStoredBookings(bookings);

    return NextResponse.json({
      success: true,
      message: "Booking and payment recorded to database successfully.",
      booking: updatedBooking,
    });
  } catch (err: any) {
    console.error("[POST /api/bookings] Error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

