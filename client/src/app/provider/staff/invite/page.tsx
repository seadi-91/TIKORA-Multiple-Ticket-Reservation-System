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
  User,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  KeyRound,
} from "lucide-react";
import { useProviderStore, ProviderStaffMember } from "@/stores/provider.store";
import { providerService } from "@/services/provider.service";
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
      };
    case "EVENT":
      return {
        sectorName: "Concerts & Festival Operations",
        stationLabel: "Venue Entrance / Gate Turnstile",
        stationDefault: "Main Gate Turnstile A",
        emailPlaceholder: "inspector@addislive.et",
        stationPlaceholder: "e.g. Main Gate Turnstile A (Millennium Hall)",
      };
    case "SPORTS":
      return {
        sectorName: "Stadium & Sports Operations",
        stationLabel: "Stadium Gate Turnstile / Section",
        stationDefault: "Stadium Gate 4 (Grandstand VIP)",
        emailPlaceholder: "inspector@stadiumsports.et",
        stationPlaceholder: "e.g. Stadium Gate 4 (Grandstand VIP)",
      };
    case "BUS":
    default:
      return {
        sectorName: "Intercity Bus Operations",
        stationLabel: "Departure Terminal / Gate",
        stationDefault: "Autobus Tera Gate 3",
        emailPlaceholder: "solomon@selambus.et",
        stationPlaceholder: "e.g. Autobus Tera Gate 3 (Hawassa Gate)",
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
    password: "",
    confirmPassword: "",
    assignedStation: sectorConfig.stationDefault,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Please enter the inspector's full name and email address.");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter a login password for this inspector.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create in PostgreSQL Database & persistent backend
      const createdStaff = await providerService.createStaff({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        assignedStation: formData.assignedStation.trim() || sectorConfig.stationDefault,
        role: "INSPECTOR",
      });

      // 2. Add to Provider Store & LocalStorage
      addStaffMember({
        id: createdStaff.id,
        fullName: createdStaff.fullName,
        email: createdStaff.email,
        phone: createdStaff.phone,
        role: "INSPECTOR",
        assignedStation: createdStaff.assignedStation,
        status: "ACTIVE",
        lastActive: "Just now (Account Active)",
      });

      toast.success(
        `Inspector ${formData.fullName} created successfully! They can now log in at /login with their credentials.`
      );
      router.push("/provider/staff");
    } catch (err: any) {
      toast.error(err.message || "Failed to create staff inspector.");
    } finally {
      setIsSubmitting(false);
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
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                {organization.name}
              </span>
              <span className="text-xs text-muted-foreground">{sectorConfig.sectorName}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Add Staff &amp; Gate Inspector
            </h1>
            <p className="text-xs text-muted-foreground">
              Register a ticket inspector with direct login credentials to validate passes and scan QR tickets for {organization.name}.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details & Login Credentials */}
          <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Inspector Profile &amp; Login Access
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Set up user identification and authentication password for inspector login.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold">
                Auto-Role: Gate Inspector
              </span>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
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
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Email Address (Login Identifier) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={sectorConfig.emailPlaceholder}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Mobile Phone Number <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+251 91 123 4567"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Login Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  The inspector will use this password to sign into the inspector scanner console.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Confirm Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Assigned Terminal Station */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                {sectorConfig.stationLabel} <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={formData.assignedStation}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedStation: e.target.value })
                  }
                  placeholder={sectorConfig.stationPlaceholder}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Operational Scope Notice */}
          <div className="bg-amber-500/[0.04] border border-amber-500/20 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-600 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Dedicated Inspector Portal Permissions</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              When this inspector signs in, they will be scoped strictly under <strong>{organization.name}</strong>.
              They can view live passenger manifests, scan digital QR passes, verify seat numbers, and update boarding check-ins.
            </p>
          </div>
        </div>

        {/* Right Col: Summary & Submit */}
        <div className="space-y-6">
          <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Account Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Organization:</span>
                <span className="font-bold text-foreground truncate max-w-[150px]">
                  {organization.name}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-semibold text-amber-600">Gate Inspector</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Terminal / Gate:</span>
                <span className="font-semibold text-foreground line-clamp-1 max-w-[150px]">
                  {formData.assignedStation || sectorConfig.stationDefault}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Account Status:</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Immediate Active Login</span>
                </span>
              </div>
            </div>

            <div className="bg-muted/40 rounded-xl p-3 text-[11px] text-muted-foreground space-y-1.5 border border-border/40">
              <p className="font-semibold text-foreground">Next Step for Inspector:</p>
              <p>
                1. Navigate to <strong>/login</strong>
              </p>
              <p>
                2. Enter email ({formData.email || "email"}) and the chosen password.
              </p>
              <p>
                3. The system will log them straight into the <strong>{organization.name} Inspector Scanner</strong>.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-1.5 py-3 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isSubmitting ? "Creating Inspector Account..." : "Create Inspector Account"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
