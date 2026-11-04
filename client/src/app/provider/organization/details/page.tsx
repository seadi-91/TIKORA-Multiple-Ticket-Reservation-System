"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  FileText,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  Calendar,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";

export default function OrganizationDetailsPage() {
  const { organization } = useProviderStore();

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/provider/organization" className="hover:text-[#B45309] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Organization</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0F172A] dark:text-white">Corporate Details</span>
        </div>

        <Link
          href="/provider/organization/verification"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#B45309]"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Verification Audit</span>
        </Link>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#B45309] text-white flex items-center justify-center font-bold text-base shadow-xs">
              {organization.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                  {organization.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
              <span className="text-xs text-slate-400 block mt-0.5">{organization.legalName}</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Registration Code</span>
            <span className="font-mono text-sm font-bold text-[#0F172A] dark:text-white">
              {organization.registrationNumber}
            </span>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Federal Tax Identification</span>
            <span className="font-mono text-sm font-bold text-[#0F172A] dark:text-white block">
              TIN: {organization.tinNumber}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Tax Compliance Verified</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Ministry of Transport License</span>
            <span className="font-mono text-sm font-bold text-[#0F172A] dark:text-white block">
              {organization.licenseNumber}
            </span>
            <span className="text-[11px] text-slate-400">Class A Cross-Country Operating Permit</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Official Headquarters</span>
            <span className="text-xs font-semibold text-[#0F172A] dark:text-white block">
              {organization.address}
            </span>
            <span className="text-[11px] text-slate-400">{organization.city}, Ethiopia</span>
          </div>
        </div>

        {/* Operational Profile */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
            Operational Scope & Services
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {organization.description}
          </p>
        </div>
      </div>
    </div>
  );
}
