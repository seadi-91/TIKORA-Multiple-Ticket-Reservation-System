import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const STAFF_FILE = path.join(DATA_DIR, "staff.json");

function readStaff(): any[] {
  try {
    if (fs.existsSync(STAFF_FILE)) {
      const content = fs.readFileSync(STAFF_FILE, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch {}
  return [];
}

function writeStaff(staff: any[]) {
  try {
    fs.writeFileSync(STAFF_FILE, JSON.stringify(staff, null, 2), "utf-8");
  } catch {}
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ staffId: string }> }
) {
  try {
    const params = await props.params;
    const staffId = params.staffId;
    const staffList = readStaff();
    const idx = staffList.findIndex((s) => s.id === staffId);

    if (idx === -1) {
      return NextResponse.json({ success: false, message: "Staff member not found." }, { status: 404 });
    }

    const currentStatus = staffList[idx].status;
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    staffList[idx].status = newStatus;
    writeStaff(staffList);

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ staffId: string }> }
) {
  try {
    const params = await props.params;
    const staffId = params.staffId;
    const staffList = readStaff();
    const filtered = staffList.filter((s) => s.id !== staffId);
    writeStaff(filtered);

    return NextResponse.json({ success: true, message: "Staff member removed successfully." });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

