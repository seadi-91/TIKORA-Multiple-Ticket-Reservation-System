import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const TICKETS_FILE = path.join(DATA_DIR, "tickets.json");

function ensureStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(TICKETS_FILE)) {
      fs.writeFileSync(TICKETS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("[Storage] Failed to initialize tickets directory:", err);
  }
}

function readStoredTickets(): any[] {
  ensureStorage();
  try {
    if (fs.existsSync(TICKETS_FILE)) {
      const content = fs.readFileSync(TICKETS_FILE, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch (err) {
    console.error("[Storage] Failed to read tickets.json:", err);
  }
  return [];
}

function writeStoredTickets(tickets: any[]) {
  ensureStorage();
  try {
    fs.writeFileSync(TICKETS_FILE, JSON.stringify(tickets, null, 2), "utf-8");
  } catch (err) {
    console.error("[Storage] Failed to write tickets.json:", err);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const body = await req.json();
    const { totalSeats, availableSeats, status } = body;

    const tickets = readStoredTickets();
    const existingIndex = tickets.findIndex((t) => String(t.id) === String(ticketId));

    const updatedData = {
      id: ticketId,
      ...(totalSeats !== undefined && { totalSeats: Number(totalSeats) }),
      ...(availableSeats !== undefined && { availableSeats: Number(availableSeats) }),
      ...(status !== undefined && { status }),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      tickets[existingIndex] = { ...tickets[existingIndex], ...updatedData };
    } else {
      tickets.push(updatedData);
    }

    writeStoredTickets(tickets);

    // Try optional sync to Express backend (port 8000)
    try {
      const expressUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      fetch(`${expressUrl}/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status || "ACTIVE" }),
      }).catch(() => {});
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Ticket seat inventory updated successfully.",
      ticket: updatedData,
    });
  } catch (err: any) {
    console.error("[PATCH /api/tickets/[ticketId]] Error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

