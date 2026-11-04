"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Smartphone,
  Trash2,
  XCircle,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { toast } from "sonner";

export default function StaffDetailPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = (params?.staffId as string) || "stf-1";

  const { staffMembers, toggleStaffStatus, deleteStaffMember } = useProviderStore();
  const member = staffMembers.find((s) => s.id === staffId) || staffMembers[0];

  const [assignedStation, setAssignedStation] = useState(
    member?.assignedStation || "Autobus Tera Gate 3"
  );
  const [isEditingStation, setIsEditingStation] = useState(false);

  // Scan logs for this staff member
  const [scanLogs] = useState([
    {
      id: "scan-1",
      time: "Today, 05:58 AM",
      ref: "TH-BUS-8829",
      passenger: "Dawit Hailemariam",
      seat: "04A",
      status: "VALID",
    },
    {
      id: "scan-2",
      time: "Today, 05:52 AM",
      ref: "TH-BUS-8830",
      passenger: "Tigist Alemu",
      seat: "04B",
      status: "VALID",
    },
    {
      id: "scan-3",
      time: "Today, 05:45 AM",
      ref: "TH-BUS-8835",
      passenger: "Yared Tesfaye",
      seat: "05A",
      status: "VALID",
    },
    {
      id: "scan-4",
      time: "Yesterday, 06:05 AM",
      ref: "TH-BUS-8802",
      passenger: "Alazar Mengistu",
      seat: "01B",
      status: "VALID",
    },
    {
      id: "scan-5",
      time: "Yesterday, 05:40 AM",
      ref: "TH-BUS-8799",
      passenger: "Duplicate QR Test",
      seat: "--",
      status: "DUPLICATE_REJECTED",
    },
  ]);

  if (!member) {
    return (
      <div className="p-8 text-center bg-card rounded-xl border border-border/60">
        <p className="text-muted-foreground text-sm">Staff member not found.</p>
        <Link
          href="/provider/staff"
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Staff Directory
        </Link>
      </div>
    );
  }

  const handleToggleStatus = () => {
    toggleStaffStatus(member.id);
    toast.success(`Access status for ${member.fullName} updated.`);
  };

  const handleSaveStation = () => {
    setIsEditingStation(false);
    toast.success(`Assigned terminal updated to "${assignedStation}".`);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${member.fullName}?`)) {
      deleteStaffMember(member.id);
      toast.success("Staff member removed.");
      router.push("/provider/staff");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/provider/staff"
            className="p-2 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-600/10 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-sm border border-amber-600/20">
              {member.fullName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                  {member.fullName}
                </h1>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${member.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : member.status === "INVITED"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    }`}
                >
                  {member.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {member.role} • Station: {member.assignedStation}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleStatus}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors"
          >
            {member.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-lg border border-rose-500/30 text-rose-600 hover:bg-rose-500/10 transition-colors"
            title="Delete staff member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Performance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <span className="text-muted-foreground text-xs block mb-1">Lifetime Passes Scanned</span>
          <div className="text-sm sm:text-base font-bold text-amber-600">
            {member.scannedTicketsCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-muted-foreground">Scanned at boarding gates</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <span className="text-muted-foreground text-xs block mb-1">Scan Accuracy</span>
          <div className="text-sm sm:text-base font-bold text-emerald-600">99.8%</div>
          <span className="text-[11px] text-muted-foreground">Zero false validations</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <span className="text-muted-foreground text-xs block mb-1">Authorized Device</span>
          <div className="text-sm font-bold text-foreground truncate mt-1">Galaxy A54 (Scanner)</div>
          <span className="text-[11px] text-muted-foreground">App v2.4 Installed</span>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs">
          <span className="text-muted-foreground text-xs block mb-1">Member Since</span>
          <div className="text-sm font-bold text-foreground mt-1">{member.dateAdded}</div>
          <span className="text-[11px] text-muted-foreground">Last active: {member.lastActive}</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Staff Profile & Station */}
        <div className="space-y-6">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Contact & Station
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </span>
                <span className="font-semibold text-foreground">{member.email}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone
                </span>
                <span className="font-semibold text-foreground">{member.phone}</span>
              </div>

              <div className="py-2 border-b border-border/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Station Assignment
                  </span>
                  {!isEditingStation && (
                    <button
                      type="button"
                      onClick={() => setIsEditingStation(true)}
                      className="text-amber-600 font-semibold text-[11px] hover:underline"
                    >
                      Change
                    </button>
                  )}
                </div>

                {isEditingStation ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={assignedStation}
                      onChange={(e) => setAssignedStation(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs rounded border border-border/70 bg-background"
                    />
                    <button
                      type="button"
                      onClick={handleSaveStation}
                      className="px-2.5 py-1 text-xs rounded bg-amber-600 text-white font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <span className="font-medium text-foreground block">{assignedStation}</span>
                )}
              </div>
            </div>
          </div>

          {/* Active Device Details */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Inspector Scanner Hardware
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-foreground block">
                  Samsung Galaxy A54 5G
                </span>
                <span className="text-[11px] text-muted-foreground">
                  IMEI: 3589210984182 • Last Synced 10m ago
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scan History & Audit Log */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Live Ticket Verification Log</h3>
                <p className="text-xs text-muted-foreground">
                  Real-time audit log of tickets scanned by {member.fullName}
                </p>
              </div>
              <QrCode className="w-4 h-4 text-amber-600" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Ticket Ref</th>
                    <th className="py-2.5 px-3">Passenger</th>
                    <th className="py-2.5 px-3 text-center">Seat</th>
                    <th className="py-2.5 px-3 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {scanLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 text-muted-foreground">{log.time}</td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-600">
                        {log.ref}
                      </td>
                      <td className="py-3 px-3 font-medium text-foreground">
                        {log.passenger}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-foreground">
                        {log.seat}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {log.status === "VALID" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Valid Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            <XCircle className="w-3 h-3 text-rose-600" /> Duplicate Detected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
