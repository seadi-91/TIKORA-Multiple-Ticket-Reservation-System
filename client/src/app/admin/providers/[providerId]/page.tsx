"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  ChevronLeft,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Percent,
  DollarSign,
  ShieldCheck,
  Download,
  ExternalLink,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";

interface PageProps {
  params: Promise<{ providerId: string }>;
}

export default function AdminProviderDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const {
    organizations,
    approveOrganization,
    rejectOrganization,
    suspendOrganization,
    activateOrganization,
    updateOrganizationCommission,
    verifyDocument,
    fetchPlatformData,
    isLoading,
  } = useAdminStore();

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  const org = organizations.find((o) => o.id === resolvedParams.providerId);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (isLoading && !org) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Loading provider organization...</p>
      </div>
    );
  }
  const [isEditingCommission, setIsEditingCommission] = useState(false);
  const [commissionInput, setCommissionInput] = useState(org?.commissionRate || 5.0);

  if (!org) {
    return (
      <div className="py-12 text-center space-y-4">
        <Building2 className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
        <h2 className="text-xl font-bold text-foreground">Provider Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested organization could not be located.</p>
        <Link
          href="/admin/providers"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Providers</span>
        </Link>
      </div>
    );
  }

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    rejectOrganization(org.id, rejectReason);
    setRejectModalOpen(false);
  };

  const handleCommissionSave = () => {
    updateOrganizationCommission(org.id, Number(commissionInput));
    setIsEditingCommission(false);
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/providers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Provider Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          {org.status === "PENDING" && (
            <>
              <button
                onClick={() => setRejectModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
              >
                Reject Application
              </button>
              <button
                onClick={() => approveOrganization(org.id)}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Organization</span>
              </button>
            </>
          )}

          {org.status === "APPROVED" && (
            <button
              onClick={() => suspendOrganization(org.id, "Administrative hold pending compliance audit")}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
            >
              Suspend Provider
            </button>
          )}

          {org.status === "SUSPENDED" && (
            <button
              onClick={() => activateOrganization(org.id)}
              className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              Reactivate Provider
            </button>
          )}
        </div>
      </div>

      {/* Main Provider Overview Header Card */}
      <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/20 shrink-0">
              {org.name?.charAt(0) || "P"}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{org.name}</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {org.category}
                </span>
                {org.status === "APPROVED" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                  </span>
                ) : org.status === "PENDING" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Clock className="w-2.5 h-2.5" /> PENDING REVIEW
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    <AlertTriangle className="w-2.5 h-2.5" /> SUSPENDED
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-3">
                <span>TIN: <strong className="font-mono text-foreground">{org.taxNumber}</strong></span>
                <span>•</span>
                <span>License: <strong className="font-mono text-foreground">{org.businessLicense}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 text-xs shrink-0">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Commission Rate</p>
              {isEditingCommission ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="30"
                    value={commissionInput}
                    onChange={(e) => setCommissionInput(Number(e.target.value))}
                    className="w-16 h-7 px-2 rounded-lg bg-card border border-slate-200/80 dark:border-slate-800/80 text-foreground font-bold text-xs"
                  />
                  <span className="text-xs font-bold">%</span>
                  <button
                    onClick={handleCommissionSave}
                    className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <Save className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsEditingCommission(false)}
                    className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-base text-foreground">{org.commissionRate}%</span>
                  <button
                    onClick={() => setIsEditingCommission(true)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                    title="Edit commission rate"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="border-l border-slate-200/60 dark:border-slate-800/60 pl-4">
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Revenue</p>
              <p className="font-bold text-base text-foreground mt-0.5">
                {(org.totalRevenue || 0).toLocaleString()} <span className="text-xs text-muted-foreground font-normal">ETB</span>
              </p>
            </div>
          </div>
        </div>

        {org.rejectionReason && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 space-y-1">
            <p className="font-bold">Administrative Hold / Suspension Reason:</p>
            <p>{org.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* Two Column Section: Organization Details & Compliance Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Organization & Legal Profile */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Commercial & Legal Registration</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-muted-foreground">Entity Legal Name</span>
                <span className="font-semibold text-foreground">{org.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-muted-foreground">Operational Sector</span>
                <span className="font-medium text-foreground">{org.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-muted-foreground">Tax Identification Number (TIN)</span>
                <span className="font-mono font-semibold text-foreground">{org.taxNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-muted-foreground">Commercial Business License</span>
                <span className="font-mono text-foreground">{org.businessLicense}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-muted-foreground">City & Headquarters</span>
                <span className="text-foreground">{org.city}, Ethiopia</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-muted-foreground">Physical Office Address</span>
                <span className="text-foreground">{org.address}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-muted-foreground">Application Date</span>
                <span className="font-mono text-foreground">{org.appliedDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-muted-foreground">Approved / Onboarded By</span>
                <span className="font-semibold text-foreground">Peter SuperAdmin (SUPER_ADMIN)</span>
              </div>
              {org.approvedDate && (
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-muted-foreground">Verification Approval Date</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{org.approvedDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Primary Administrator & Contact Details */}
          <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Official Contact & Representative</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-muted-foreground">Authorized Contact Person</span>
                <span className="font-semibold text-foreground">{org.contactPerson}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-muted-foreground">Primary Business Email</span>
                <span className="font-mono text-foreground">{org.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-muted-foreground">Official Phone Number</span>
                <span className="font-mono text-foreground">{org.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Regulatory Documents Review */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Submitted Regulatory Documents ({(org.documents || []).length})</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Verification of government credentials and operational licenses
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {(org.documents || []).map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs text-foreground">{doc.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {doc.type} • {doc.fileSize} • Uploaded {doc.uploadedAt}
                      </p>
                    </div>

                    <div>
                      {doc.status === "VERIFIED" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          VERIFIED
                        </span>
                      ) : doc.status === "REJECTED" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          REJECTED
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          PENDING
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-800/40 text-xs">
                    <button
                      onClick={() => alert(`Previewing document: ${doc.title}`)}
                      className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Inspect Document</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {doc.status !== "VERIFIED" && (
                        <button
                          onClick={() => verifyDocument(org.id, doc.id, "VERIFIED")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-colors"
                        >
                          Pass
                        </button>
                      )}
                      {doc.status !== "REJECTED" && (
                        <button
                          onClick={() => verifyDocument(org.id, doc.id, "REJECTED", "Document illegible or expired")}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-[10px] font-bold transition-colors"
                        >
                          Fail
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-foreground">Internal Super Admin Review Notes</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {org.notes || "No custom notes recorded for this provider organization."}
            </p>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleRejectSubmit}
            className="w-full max-w-md rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <h3 className="font-bold text-sm text-foreground">Reject Organization Application</h3>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-foreground">
                Specify Reason for Rejection / Document Defect
              </label>
              <textarea
                required
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Commercial registration license expired or mismatch in registered TIN name."
                className="w-full p-3 rounded-2xl bg-muted/40 border border-slate-200/60 dark:border-slate-800/60 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
