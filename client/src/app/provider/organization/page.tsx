"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Save,
  User,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { providerService } from "@/services/provider.service";
import { TicketService } from "@/services/ticket.service";
import { toast } from "sonner";

export default function ProviderOrganizationPage() {
  const { organization, updateOrganization } = useProviderStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    legalName: "",
    tinNumber: "",
    registrationNumber: "",
    licenseNumber: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "Addis Ababa",
    description: "",
    contactName: "",
    contactRole: "",
    contactPhone: "",
    contactEmail: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });

  const syncFormFromOrg = (org: typeof organization) => {
    setFormData({
      name: org.name || "",
      legalName: org.legalName || org.name || "",
      tinNumber: org.tinNumber || "",
      registrationNumber: org.registrationNumber || "",
      licenseNumber: org.licenseNumber || "",
      email: org.email || "",
      phone: org.phone || "",
      website: org.website || "",
      address: org.address || "",
      city: org.city || "Addis Ababa",
      description: org.description || "",
      contactName: org.contactPerson?.fullName || "",
      contactRole: org.contactPerson?.role || "Operations Lead / Owner",
      contactPhone: org.contactPerson?.phone || org.phone || "",
      contactEmail: org.contactPerson?.email || org.email || "",
      bankName: org.payoutAccount?.bankName || "Commercial Bank of Ethiopia (CBE)",
      accountNumber: org.payoutAccount?.accountNumber || "",
      accountHolder: org.payoutAccount?.accountHolder || org.name || "",
    });
  };

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const liveOrg = await providerService.getProfile();
      if (liveOrg) {
        updateOrganization(liveOrg);
        syncFormFromOrg(liveOrg);
      } else {
        syncFormFromOrg(organization);
      }
    } catch (err: any) {
      console.warn("Could not fetch organization from API, using cached:", err);
      syncFormFromOrg(organization);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      name: formData.name.trim(),
      legalName: formData.legalName.trim(),
      tinNumber: formData.tinNumber.trim(),
      registrationNumber: formData.registrationNumber.trim(),
      licenseNumber: formData.licenseNumber.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      website: formData.website.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      description: formData.description.trim(),
      contactPerson: {
        fullName: formData.contactName.trim(),
        role: formData.contactRole.trim(),
        phone: formData.contactPhone.trim(),
        email: formData.contactEmail.trim(),
      },
      payoutAccount: {
        bankName: formData.bankName.trim(),
        accountNumber: formData.accountNumber.trim(),
        accountHolder: formData.accountHolder.trim(),
      },
    };

    try {
      const updated = await providerService.updateProfile(payload);
      updateOrganization(updated || payload);
      syncFormFromOrg(updated || { ...organization, ...payload });
      setIsEditing(false);
      toast.success("Organization profile updated and saved to database!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save organization changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED & APPROVED
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="w-2.5 h-2.5" /> REJECTED
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-2.5 h-2.5" /> SUSPENDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-2.5 h-2.5" /> PENDING REVIEW
          </span>
        );
    }
  };

  const isCatActive =
    organization.isCategoryActive !== false &&
    TicketService.isCategoryActive(organization.category || "BUS");

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Sector Category Deactivated Warning Banner */}
      {!isCatActive && (
        <div className="rounded-2xl p-4 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 text-foreground flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300">
              Operating Sector Category Currently Deactivated
            </h4>
            <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 leading-relaxed">
              Your registered sector (<strong>{organization.category}</strong>) has been deactivated by the platform admin. Your organization listings are currently hidden from customer and guest pages until reactivated.
            </p>
          </div>
        </div>
      )}

      {/* Page Header - Minimized Text */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-0.5 font-medium">
            <Link href="/provider/dashboard" className="hover:text-amber-600 transition-colors">
              Provider Portal
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">Organization Profile</span>
          </div>
          <h1 className="text-xs sm:text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Corporate Identity & Commercial Registry</span>
            {isLoading && <Loader2 className="w-3 h-3 animate-spin text-amber-600" />}
          </h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Verified entity credentials, legal business license, and settlement payout settings.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadProfile}
            disabled={isLoading}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-slate-200/60 dark:border-slate-800/60 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>

          <Link
            href="/provider/organization/verification"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-slate-200/60 dark:border-slate-800/60 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-all shadow-2xs"
          >
            <FileText className="w-3 h-3" />
            <span>Documents</span>
          </Link>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
              isEditing
                ? "bg-slate-200 dark:bg-slate-800 text-foreground hover:bg-slate-300"
                : "bg-amber-600 hover:bg-amber-700 text-white"
            }`}
          >
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout - Minimized Spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left 4 Columns: Compact Identity & Status Badge */}
        <div className="lg:col-span-4 space-y-3">
          <div className="rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 p-4 shadow-2xs text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {(organization.name || "TK").substring(0, 2).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xs sm:text-sm font-bold text-foreground truncate">
                {organization.name || "Tikora Provider"}
              </h2>
              <span className="text-[10px] text-muted-foreground block truncate">
                {organization.legalName || organization.name}
              </span>
              <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1">
                <span className="font-mono text-[9px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300">
                  Category: {organization.category || "BUS"}
                </span>
                {isCatActive ? (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                ) : (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    Deactivated by Admin
                  </span>
                )}
              </div>
            </div>

            {/* Live PostgreSQL Verification Status Badge */}
            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40 space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                Verification Ledger
              </span>
              <div>{getStatusBadge(organization.approvalStatus)}</div>
              <p className="text-[9px] text-muted-foreground leading-relaxed">
                {organization.approvalStatus === "APPROVED"
                  ? "Authorized for platform transit ticketing & live payouts."
                  : "Under compliance review. Administrative approval required."}
              </p>
            </div>
          </div>

          {/* Compact Settlement Account Widget */}
          <div className="rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-600" />
              <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                Payout Settlement Account
              </h3>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-0.5">
              <span className="text-[9px] text-muted-foreground block font-medium">Institution</span>
              <strong className="text-[11px] text-foreground block font-bold truncate">
                {organization.payoutAccount?.bankName || "Commercial Bank of Ethiopia"}
              </strong>
              <div className="pt-1 flex items-center justify-between text-[10px]">
                <span className="font-mono text-muted-foreground truncate">
                  {organization.payoutAccount?.accountNumber || "No Account Assigned"}
                </span>
                <span className="text-[9px] font-bold text-emerald-600 shrink-0">Active</span>
              </div>
            </div>

            <Link
              href="/provider/payments"
              className="w-full text-center block pt-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              View Settlement Statement & Payouts →
            </Link>
          </div>
        </div>

        {/* Right 8 Columns: Entity Form with Compact Typography */}
        <div className="lg:col-span-8 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 p-4 sm:p-5 shadow-2xs">
          <form onSubmit={handleSave} className="space-y-4">
            {/* Section 1: Commercial Registration */}
            <div>
              <h3 className="text-xs font-bold text-foreground pb-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Commercial Registry & Tax Identifiers</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Legal Entity Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Tax Number (TIN)
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.tinNumber}
                    onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Commercial License No.
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Headquarters */}
            <div>
              <h3 className="text-xs font-bold text-foreground pb-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Headquarters & Location Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Hotline Phone
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    City / Jurisdiction
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Official Website
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://provider.et"
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Physical Address
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Public Description
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Authorized Representative */}
            <div>
              <h3 className="text-xs font-bold text-foreground pb-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Authorized Contact Person</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Representative Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Official Position / Role
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.contactRole}
                    onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Direct Contact Phone
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Direct Contact Email
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Settlement Banking Information */}
            <div>
              <h3 className="text-xs font-bold text-foreground pb-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                <span>Settlement Bank Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                    Account Beneficiary Holder
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                    className="w-full h-8 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-foreground disabled:opacity-75 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            {isEditing && (
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-muted-foreground hover:text-foreground text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{isSaving ? "Saving..." : "Save Profile Changes"}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
