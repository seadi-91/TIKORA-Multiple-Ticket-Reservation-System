"use client";

import React, { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { providerService } from "@/services/provider.service";

export default function OrganizationDetailsPage() {
  const { organization, updateOrganization } = useProviderStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    providerService.getProfile().then((data) => {
      if (data) updateOrganization(data);
    }).catch(() => {});
  }, [updateOrganization]);

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
          <Link href="/provider/organization" className="hover:text-amber-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Profile</span>
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">Corporate Registry</span>
        </div>

        <Link
          href="/provider/organization/verification"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-slate-200/60 dark:border-slate-800/60 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-all shadow-2xs"
        >
          <FileText className="w-3 h-3" />
          <span>Verification Audit</span>
        </Link>
      </div>

      <div className="rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              {(organization.name || "TK").substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xs sm:text-sm font-bold text-foreground">
                  {organization.name}
                </h1>
                {organization.approvalStatus === "APPROVED" ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold border border-amber-500/20">
                    <span>Pending Verification</span>
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground block mt-0.5">{organization.legalName || organization.name}</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Category Sector</span>
            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
              {organization.category}
            </span>
          </div>
        </div>

        {/* Detailed Grid - Minimized Text */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40 space-y-1">
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">Tax Identification</span>
            <span className="font-mono text-xs font-bold text-foreground block">
              TIN: {organization.tinNumber || "Not Provided"}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 pt-0.5">
              <CheckCircle className="w-2.5 h-2.5" />
              <span>Tax Registration Active</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40 space-y-1">
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">Commercial Operating License</span>
            <span className="font-mono text-xs font-bold text-foreground block">
              {organization.licenseNumber || "Pending Submission"}
            </span>
            <span className="text-[10px] text-muted-foreground">Class-A Commercial Authority</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40 space-y-1">
            <span className="text-[9px] font-bold uppercase text-muted-foreground block">Headquarters & Jurisdiction</span>
            <span className="text-[11px] font-semibold text-foreground block truncate">
              {organization.address || "Addis Ababa"}
            </span>
            <span className="text-[10px] text-muted-foreground">{organization.city || "Addis Ababa"}, Ethiopia</span>
          </div>
        </div>

        {/* Operational Profile */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <h3 className="text-xs font-bold text-foreground">
            Operational Scope & Services Description
          </h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {organization.description || "Authorized digital ticketing partner on Tikora platform."}
          </p>
        </div>
      </div>
    </div>
  );
}
