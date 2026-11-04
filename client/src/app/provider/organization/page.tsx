"use client";

import React, { useState } from "react";
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
  Save,
  Upload,
  User,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { PageContainer } from "@/components/layout/page-container";

export default function ProviderOrganizationPage() {
  const { organization, updateOrganization, toggleApprovalStatus } = useProviderStore();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: organization.name,
    legalName: organization.legalName,
    tinNumber: organization.tinNumber,
    registrationNumber: organization.registrationNumber,
    licenseNumber: organization.licenseNumber,
    email: organization.email,
    phone: organization.phone,
    website: organization.website,
    address: organization.address,
    city: organization.city,
    description: organization.description,
    contactName: organization.contactPerson.fullName,
    contactRole: organization.contactPerson.role,
    contactPhone: organization.contactPerson.phone,
    contactEmail: organization.contactPerson.email,
    bankName: organization.payoutAccount.bankName,
    accountNumber: organization.payoutAccount.accountNumber,
    accountHolder: organization.payoutAccount.accountHolder,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization({
      name: formData.name,
      legalName: formData.legalName,
      tinNumber: formData.tinNumber,
      registrationNumber: formData.registrationNumber,
      licenseNumber: formData.licenseNumber,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      address: formData.address,
      city: formData.city,
      description: formData.description,
      contactPerson: {
        fullName: formData.contactName,
        role: formData.contactRole,
        phone: formData.contactPhone,
        email: formData.contactEmail,
      },
      payoutAccount: {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountHolder: formData.accountHolder,
      },
    });

    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/provider" className="hover:text-[#B45309]">
              Provider Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0F172A] dark:text-white">Organization Profile</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
            Organization Identity & Verification
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your legal entity registration, business license, and settlement payout accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/provider/organization/verification"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Uploaded Documents</span>
          </Link>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span>{isEditing ? "Cancel Edit" : "Edit Details"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Organization profile updated successfully!</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left 4 Cols: Organization Badge & Status Card */}
        <div className="lg:col-span-4 space-y-5 sm:space-y-6">
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-5 sm:p-6 shadow-xs text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#B45309] to-[#D97706] text-white flex items-center justify-center font-bold text-base shadow-md">
              {organization.name.substring(0, 2).toUpperCase()}
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                {organization.name}
              </h2>
              <span className="text-xs text-slate-400 block mt-0.5">{organization.legalName}</span>
            </div>

            {/* Approval Status Badge */}
            <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Platform Verification Status
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  {organization.approvalStatus === "APPROVED"
                    ? "Approved by Super Admin"
                    : organization.approvalStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Authorized for live digital ticketing and online merchant payments.
              </p>
            </div>

            {/* Demo Status Switcher for UI Verification */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
                Simulate Status State (UI Test):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(["APPROVED", "PENDING_APPROVAL", "SUSPENDED"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => toggleApprovalStatus(st)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      organization.approvalStatus === st
                        ? "bg-[#B45309] text-white border-[#B45309]"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {st === "APPROVED" ? "Approved" : st === "PENDING_APPROVAL" ? "Pending" : "Suspended"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Bank Settlement Widget */}
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#B45309]" />
              <h3 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
                Payout Bank Ledger
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/15 dark:border-amber-900/40 space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">Bank Institution</span>
              <strong className="text-xs text-[#0F172A] dark:text-white block font-bold">
                {organization.payoutAccount.bankName}
              </strong>
              <div className="pt-1.5 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  {organization.payoutAccount.accountNumber}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">Active</span>
              </div>
            </div>

            <Link
              href="/provider/payments"
              className="w-full text-center block pt-1 text-xs font-bold text-[#B45309] dark:text-amber-400 hover:underline"
            >
              View Settlement Statement & Payouts →
            </Link>
          </div>
        </div>

        {/* Right 8 Cols: Entity Information Details & Form */}
        <div className="lg:col-span-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-5 sm:p-6 shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* General Legal Information */}
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#B45309]" />
                <span>Commercial Registration & Tax Identifiers</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Organization Name (Display)
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#B45309]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Registered Legal Entity Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#B45309]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Tax Identification Number (TIN)
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.tinNumber}
                    onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white font-mono disabled:opacity-75 focus:outline-none focus:border-[#B45309]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Commercial License No.
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white font-mono disabled:opacity-75 focus:outline-none focus:border-[#B45309]"
                  />
                </div>
              </div>
            </div>

            {/* Official Contact & Location */}
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B45309]" />
                <span>Headquarters & Digital Contacts</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Official Dispatch Email
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#B45309]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Telephone Hotline
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#B45309]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Headquarters Address
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#B45309]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Public Description / About Merchant
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditing}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#B45309]"
                  />
                </div>
              </div>
            </div>

            {/* Authorized Representative */}
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-[#B45309]" />
                <span>Authorized Contact Person</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#B45309]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Corporate Role
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.contactRole}
                    onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#B45309]"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Organization Profile</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
