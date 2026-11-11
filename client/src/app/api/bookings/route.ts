import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Server-side persistent storage for confirmed bookings and payments
function getDataDirs(): string[] {
  const dirs = [
    path.join(process.cwd(), "client", ".data"),
    path.join(process.cwd(), ".data"),
  ];
  return Array.from(new Set(dirs));
}

function ensureStorage() {
  for (const dir of getDataDirs()) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const bFile = path.join(dir, "bookings.json");
      if (!fs.existsSync(bFile)) {
        fs.writeFileSync(bFile, JSON.stringify([], null, 2), "utf-8");
      }
    } catch (err) {
      console.error("[Storage] Failed to initialize data directory:", err);
    }
  }
}

function readStoredBookings(): any[] {
  ensureStorage();
  for (const dir of getDataDirs()) {
    try {
      const bFile = path.join(dir, "bookings.json");
      if (fs.existsSync(bFile)) {
        const content = fs.readFileSync(bFile, "utf-8");
        const parsed = JSON.parse(content || "[]");
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error("[Storage] Failed to read bookings.json:", err);
    }
  }
  return [];
}

function writeStoredBookings(bookings: any[]) {
  ensureStorage();
  for (const dir of getDataDirs()) {
    try {
      const bFile = path.join(dir, "bookings.json");
      fs.writeFileSync(bFile, JSON.stringify(bookings, null, 2), "utf-8");
    } catch (err) {
      console.error("[Storage] Failed to write bookings.json:", err);
    }
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

    const pId = booking.providerId || booking.ticket?.providerId;
    const pName = booking.providerName || booking.ticket?.organizer;
    const snapTotal = Number(booking.customerPaid ?? booking.pricing?.total ?? booking.totalAmount ?? 0);
    const snapVatRate = Number(booking.vatRate ?? booking.pricing?.vatRate ?? 5);
    const snapVat = Number(booking.vatAmount ?? booking.pricing?.tax ?? Math.round(((snapTotal * snapVatRate) / (100 + snapVatRate)) * 100) / 100);
    const snapSub = Number(booking.subtotal ?? booking.pricing?.subtotal ?? Math.max(0, snapTotal - snapVat));
    const snapCommRate = Number(booking.commissionRate ?? booking.pricing?.commissionRate ?? 5);
    const snapFee = Number(booking.platformFee ?? booking.pricing?.platformCommission ?? Math.round(snapSub * (snapCommRate / 100) * 100) / 100);
    const snapNet = Number(booking.providerNet ?? booking.pricing?.providerNet ?? Math.max(0, snapSub - snapFee));

    const existingIndex = bookings.findIndex(
      (b) =>
        b.bookingReference === targetRef ||
        b.id === targetRef ||
        b.id === booking.id
    );

    const updatedBooking = {
      ...booking,
      providerId: pId ? String(pId) : booking.providerId,
      providerName: pName || booking.providerName,
      bookingReference: targetRef,
      customerPaid: snapTotal,
      totalAmount: snapTotal,
      subtotal: snapSub,
      vatAmount: snapVat,
      vatRate: snapVatRate,
      commissionRate: snapCommRate,
      platformFee: snapFee,
      providerNet: snapNet,
      providerPayout: snapNet,
      bookingStatus: booking.bookingStatus || "CONFIRMED",
      paymentStatus: booking.paymentStatus || "PAID",
      paymentMethod: booking.paymentMethod || "CHAPA",
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      bookings[existingIndex] = { ...bookings[existingIndex], ...updatedBooking };
    } else {
      bookings.unshift(updatedBooking);
    }

    writeStoredBookings(bookings);

    // Create provider notification for this booking (English only, deduplicated)
    try {
      for (const dir of getDataDirs()) {
        const notifsPath = path.join(dir, "notifications.json");
        let notifs: any[] = [];
        if (fs.existsSync(notifsPath)) {
          try {
            notifs = JSON.parse(fs.readFileSync(notifsPath, "utf-8") || "[]");
          } catch {}
        }
        const existingNotif = notifs.find(
          (n) => n.referenceId === targetRef || (n.title && n.title.includes(targetRef))
        );
        if (!existingNotif) {
          notifs.unshift({
            id: `notif-${Date.now()}`,
            providerId: pId ? String(pId) : undefined,
            providerName: pName,
            type: "BOOKING",
            title: `New Ticket Booking (#${targetRef})`,
            message: `New booking for ${booking.ticket?.title || booking.serviceTitle || "Ticket"}. Customer: ${booking.customerName || "Customer"}, Amount: ${snapTotal.toLocaleString()} ETB.`,
            linkHref: "/provider/bookings",
            link: "/provider/bookings",
            isRead: false,
            referenceId: targetRef,
            createdAt: new Date().toISOString(),
          });
          fs.writeFileSync(notifsPath, JSON.stringify(notifs.slice(0, 50), null, 2), "utf-8");
        }
      }
    } catch {}

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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { reference, bookingStatus = "CHECKED_IN" } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, message: "Booking reference is required." },
        { status: 400 }
      );
    }

    const bookings = readStoredBookings();
    const target = reference.toUpperCase();

    const existingIndex = bookings.findIndex(
      (b) =>
        (b.bookingReference && b.bookingReference.toUpperCase() === target) ||
        (b.id && String(b.id).toUpperCase() === target) ||
        (b.bookingReference && b.bookingReference.toUpperCase().includes(target)) ||
        (target.includes(b.bookingReference ? b.bookingReference.toUpperCase() : "___"))
    );

    if (existingIndex >= 0) {
      bookings[existingIndex].bookingStatus = bookingStatus;
      bookings[existingIndex].checkedInAt = new Date().toISOString();
      bookings[existingIndex].updatedAt = new Date().toISOString();
      writeStoredBookings(bookings);

      return NextResponse.json({
        success: true,
        message: `Booking status updated to ${bookingStatus}.`,
        booking: bookings[existingIndex],
      });
    }

    return NextResponse.json(
      { success: false, message: "Booking not found in database." },
      { status: 404 }
    );
  } catch (err: any) {
    console.error("[PATCH /api/bookings] Error:", err);
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
    const reference = searchParams.get("reference");
    const providerId = searchParams.get("providerId");

    let bookings = readStoredBookings();
    const initialCount = bookings.length;

    if (providerId) {
      const cleanPId = String(providerId).replace(/^org-/, "").trim().toLowerCase();
      bookings = bookings.filter((b) => {
        const bId = String(b.providerId || b.ticket?.providerId || "").replace(/^org-/, "").trim().toLowerCase();
        return bId !== cleanPId;
      });
    } else if (id || reference) {
      const targets = [id, reference].filter(Boolean).map((s) => String(s).trim().toLowerCase());
      bookings = bookings.filter((b) => {
        const bId = String(b.id || "").trim().toLowerCase();
        const bRef = String(b.bookingReference || b.reference || "").trim().toLowerCase();
        return !targets.includes(bId) && !targets.includes(bRef);
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Booking ID, reference, or providerId required." },
        { status: 400 }
      );
    }

    writeStoredBookings(bookings);
    return NextResponse.json({
      success: true,
      message: "Booking(s) deleted permanently.",
      deletedCount: initialCount - bookings.length,
    });
  } catch (err: any) {
    console.error("[DELETE /api/bookings] Error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}


