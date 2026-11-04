"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Send,
  User,
  ShieldCheck,
} from "lucide-react";
import { useProviderStore, ProviderStaffMember } from "@/stores/provider.store";
import { TicketCategory } from "@/types/ticket.types";
import { toast } from "sonner";

const getSectorStaffConfig = (cat: TicketCategory) => {
  switch (cat) {
    case "CINEMA":
      return {
        sectorName: "Cinema Screening Operations",
        stationLabel: "Auditorium / Screening Hall Station",
        stationDefault: "Hall 1 Entrance (VIP Laser)",
        emailPlaceholder: "usher@centurycinema.et",
        stationPlaceholder: "e.g. Hall 1 Entrance (VIP Laser Dolby Atmos)",
        roles: [
          {
            role: "INSPECTOR" as const,
            title: "Cinema Hall Usher & QR Scanner",
            desc: "Validates patron QR passes at screening room entrance using mobile inspector camera.",
          },
          {
            role: "DISPATCHER" as const,
            title: "Projection & Floor Supervisor",
            desc: "Oversees movie schedule runtimes, hall readiness, and auditorium turnover.",
          },
          {
            role: "CASHIER" as const,
            title: "Box Office & Concessions Cashier",
            desc: "Processes walk-in ticket counter sales and snack bar concessions.",
          },
          {
            role: "MANAGER" as const,
            title: "Cinema Hall General Manager",
            desc: "Supervises theater staff, film programming schedule, and daily ticket box-office audits.",
          },
        ],
        manifestDesc: "Permit viewing auditorium seating manifests and patron contact details.",
      };
    case "EVENT":
      return {
        sectorName: "Concerts & Festival Operations",
        stationLabel: "Venue Entrance / Gate Turnstile",
        stationDefault: "Main Gate Turnstile A",
        emailPlaceholder: "staff@addislive.et",
        stationPlaceholder: "e.g. Main Gate Turnstile A (Millennium Hall)",
        roles: [
          {
            role: "INSPECTOR" as const,
            title: "Festival Gate Scanner",
            desc: "Validates VIP and General QR wristbands and digital passes at venue entry turnstiles.",
          },
          {
            role: "DISPATCHER" as const,
            title: "VIP Accreditation Lead",
            desc: "Manages stage-access credentials, VIP wristband issuance, and guest-list entries.",
          },
          {
            role: "CASHIER" as const,
            title: "Gate Box Office Cashier",
            desc: "Handles on-site ticket sales, wristband replacements, and token charges.",
          },
          {
            role: "MANAGER" as const,
            title: "Event Production Manager",
            desc: "Oversees venue capacity, crowd control marshalling, and emergency protocols.",
          },
        ],
        manifestDesc: "Permit viewing attendee manifests, VIP lists, and ticketing contact details.",
      };
    case "SPORTS":
      return {
        sectorName: "Stadium & Sports Operations",
        stationLabel: "Stadium Gate Turnstile / Section",
        stationDefault: "Stadium Gate 4 (Grandstand VIP)",
        emailPlaceholder: "stewards@stgeorgesports.et",
        stationPlaceholder: "e.g. Stadium Gate 4 (Grandstand VIP)",
        roles: [
          {
            role: "INSPECTOR" as const,
            title: "Stadium Turnstile Scanner",
            desc: "Scans matchday tickets at stadium turnstiles and grandstand entrances.",
          },
          {
            role: "DISPATCHER" as const,
            title: "Tribune Marshal Lead",
            desc: "Directs sector security, seating section crowd safety, and VIP box access.",
          },
          {
            role: "CASHIER" as const,
            title: "Stadium Box Office Cashier",
            desc: "Processes matchday counter ticket sales and match program passes.",
          },
          {
            role: "MANAGER" as const,
            title: "Matchday Arena Director",
            desc: "Supervises stadium ticketing gates, federations liaison, and security coordination.",
          },
        ],
        manifestDesc: "Permit viewing stadium spectator manifests and matchday passholder lists.",
      };
    default:
      return {
        sectorName: "Intercity Bus Operations",
        stationLabel: "Departure Terminal / Gate",
        stationDefault: "Autobus Tera Gate 3",
        emailPlaceholder: "solomon@selambus.et",
        stationPlaceholder: "e.g. Autobus Tera Gate 3 (Hawassa Gate)",
        roles: [
          {
            role: "INSPECTOR" as const,
            title: "Gate Ticket Inspector",
            desc: "Validates passenger QR passes via inspector mobile scanner app at departure gates.",
          },
          {
            role: "DISPATCHER" as const,
            title: "Fleet Dispatcher",
            desc: "Assigns drivers, monitors coach departures, and oversees passenger manifests.",
          },
          {
            role: "CASHIER" as const,
            title: "Counter Cashier",
            desc: "Processes counter walk-in reservations and cash ticket issuance at terminals.",
          },
          {
            role: "MANAGER" as const,
            title: "Branch Manager",
            desc: "Supervises terminal operations, reviews daily sales reports, and adjusts schedules.",
          },
        ],
        manifestDesc: "Permit viewing passenger names, seat assignments, and phone contact details.",
      };
  }
};

export default function InviteStaffPage() {
  const router = useRouter();
  const organization = useProviderStore((state) => state.organization);
  const { addStaffMember } = useProviderStore();
  const sectorConfig = getSectorStaffConfig(organization.category);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "+251 ",
    role: "INSPECTOR" as ProviderStaffMember["role"],
    assignedStation: sectorConfig.stationDefault,
  });

  const [permissions, setPermissions] = useState({
    scanTickets: true,
    viewManifest: true,
    editListings: false,
    processRefunds: false,
    viewFinancials: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Please fill in the staff member's name and email.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addStaffMember({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        assignedStation: formData.assignedStation,
        status: "INVITED",
        lastActive: "Never (Invitation Pending)",
      });

      setIsSubmitting(false);
      toast.success(
        `Staff invitation successfully dispatched to ${formData.email} with mobile app activation credentials.`
      );
      router.push("/provider/staff");
    }, 600);
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
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                {organization.category} Sector
              </span>
              <span className="text-xs text-muted-foreground">{organization.name}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Invite Staff & Gate Inspector
            </h1>
            <p className="text-xs text-muted-foreground">
              Add authorized personnel for ticket validation, dispatch, or counter booking for {sectorConfig.sectorName}.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              1. Staff Identification
            </h3>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Full Legal Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Solomon Abebe"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={sectorConfig.emailPlaceholder}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+251 91 123 4567"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              2. Assign System Role
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sectorConfig.roles.map((item) => {
                const isSelected = formData.role === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: item.role })}
                    className={`flex flex-col text-left p-3.5 rounded-xl border text-xs transition-all ${isSelected
                        ? "border-amber-600 bg-amber-500/10 text-foreground ring-1 ring-amber-600/30"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-foreground text-xs">{item.title}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                {sectorConfig.stationLabel}
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.assignedStation}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedStation: e.target.value })
                  }
                  placeholder={sectorConfig.stationPlaceholder}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Granular Permissions */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              3. Permission Matrix
            </h3>

            <div className="space-y-2.5">
              {[
                {
                  key: "scanTickets",
                  label: "Scan & Validate QR Tickets",
                  desc: "Grant access to the TIKORA Inspector camera app for boarding validation.",
                },
                {
                  key: "viewManifest",
                  label: "View Manifests & Attendee Lists",
                  desc: sectorConfig.manifestDesc,
                },
                {
                  key: "editListings",
                  label: "Modify Service Schedules & Listings",
                  desc: "Permit publishing or altering departure times and seat capacities.",
                },
                {
                  key: "processRefunds",
                  label: "Process Customer Refund Requests",
                  desc: "Permit approving or declining passenger cancellation claims.",
                },
                {
                  key: "viewFinancials",
                  label: "Access Financial Ledger & Bank Withdrawals",
                  desc: "Permit viewing revenue reports and executing bank payout settlements.",
                },
              ].map((perm) => (
                <label
                  key={perm.key}
                  className="flex items-start gap-3 p-2.5 rounded-lg border border-border/50 hover:bg-muted/20 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={permissions[perm.key as keyof typeof permissions]}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        [perm.key]: e.target.checked,
                      })
                    }
                    className="mt-0.5 rounded border-border/70 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      {perm.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{perm.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Summary & Submit */}
        <div className="space-y-6">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Invitation Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Designation:</span>
                <span className="font-semibold text-amber-600">{formData.role}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Terminal:</span>
                <span className="font-semibold text-foreground line-clamp-1">
                  {formData.assignedStation}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Activation Method:</span>
                <span className="text-foreground">Secure Email + SMS PIN</span>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 text-[11px] text-muted-foreground space-y-1 border border-border/40">
              <p>
                An email invitation containing login credentials and download link for the TIKORA
                Inspector application will be delivered upon sending.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? "Dispatching Invitation..." : "Send Staff Invitation"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
