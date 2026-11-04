"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  FileText,
  Building2,
  ArrowRight,
  Eye,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function AdminVerificationsPage() {
  const { organizations, verifyDocument } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Flatten documents with their parent organization data
  const allDocs = organizations.flatMap((org) =>
    org.documents.map((doc) => ({
      ...doc,
      orgId: org.id,
      orgName: org.name,
      orgCategory: org.category,
      orgTIN: org.taxNumber,
      orgStatus: org.status,
    }))
  );

  const filteredDocs = allDocs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.orgTIN.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || doc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = allDocs.filter((d) => d.status === "PENDING").length;
  const verifiedCount = allDocs.filter((d) => d.status === "VERIFIED").length;
  const rejectedCount = allDocs.filter((d) => d.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Document Compliance & Regulatory Audit
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit transportation permits, municipal business licenses, tax clearance certificates, and event safety insurance.
          </p>
        </div>

        <Link
          href="/admin/providers"
          className="px-3.5 py-2 text-xs font-semibold rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 hover:bg-muted text-foreground transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Provider Directory</span>
        </Link>
      </div>

      {/* Mobile Filter Dropdown */}
      <div className="block sm:hidden">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
          Filter Documents by Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full h-10 px-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
        >
          <option value="ALL">All Documents ({allDocs.length})</option>
          <option value="PENDING">Pending Review ({pendingCount})</option>
          <option value="VERIFIED">Verified & Compliant ({verifiedCount})</option>
          <option value="REJECTED">Rejected / Defective ({rejectedCount})</option>
        </select>
      </div>

      {/* Desktop Status Filter Tabs */}
      <div className="hidden sm:flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3 overflow-x-auto no-scrollbar flex-nowrap">
        {[
          { label: "All Documents", value: "ALL", count: allDocs.length },
          { label: "Pending Review", value: "PENDING", count: pendingCount },
          { label: "Verified & Compliant", value: "VERIFIED", count: verifiedCount },
          { label: "Rejected / Defective", value: "REJECTED", count: rejectedCount },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              statusFilter === tab.value
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === tab.value ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter documents by title, company name, or TIN..."
          className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
        />
      </div>

      {/* Mobile View: High-Clarity Elevated Cards */}
      <div className="block sm:hidden space-y-3.5">
        {filteredDocs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            No compliance documents found matching your filter criteria.
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={`${doc.orgId}-${doc.id}`}
              className="rounded-2xl bg-card border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:border-amber-500/30 transition-all p-4 space-y-3.5"
            >
              {/* Card Header: Doc Title, Org Name & Status */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-extrabold text-sm shadow-xs border border-amber-500/20 mt-0.5">
                    <FileText className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground text-sm leading-snug line-clamp-1">
                      {doc.title}
                    </h3>
                    <Link
                      href={`/admin/providers/${doc.orgId}`}
                      className="font-semibold text-xs text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block mt-0.5"
                    >
                      {doc.orgName}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted/70 text-foreground border border-slate-200/50 dark:border-slate-700/50">
                        {doc.orgCategory}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200/40 dark:border-slate-700/40">
                        TIN: {doc.orgTIN}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {doc.status === "VERIFIED" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  ) : doc.status === "REJECTED" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
                      <XCircle className="w-3 h-3" /> Rejected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}

                  <ActionDropdown
                    items={[
                      {
                        label: "Verify & Approve",
                        icon: <CheckCircle2 className="w-4 h-4" />,
                        variant: "success" as const,
                        onClick: () => verifyDocument(doc.orgId, doc.id, "VERIFIED", "Compliance verified"),
                      },
                      {
                        label: "Reject Document",
                        icon: <XCircle className="w-4 h-4" />,
                        variant: "danger" as const,
                        onClick: () => verifyDocument(doc.orgId, doc.id, "REJECTED", "Document invalid or expired"),
                      },
                      {
                        label: "View Organization",
                        icon: <Building2 className="w-4 h-4" />,
                        href: `/admin/providers/${doc.orgId}`,
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Regulatory & File Details Strip */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/50 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Format & Size:</span>
                  <span className="font-mono text-foreground font-semibold">
                    {doc.type} • {doc.fileSize}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                  <span className="text-muted-foreground">Uploaded Timestamp:</span>
                  <span className="font-mono text-muted-foreground">{doc.uploadedAt}</span>
                </div>
              </div>

              {/* Verification Actions Footer */}
              {doc.status === "PENDING" ? (
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => verifyDocument(doc.orgId, doc.id, "VERIFIED", "Compliance verified")}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Pass</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => verifyDocument(doc.orgId, doc.id, "REJECTED", "Document invalid or expired")}
                    className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-1 transition-colors border border-rose-200/60 dark:border-rose-900/50 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              ) : (
                <Link
                  href={`/admin/providers/${doc.orgId}`}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-500/10 dark:bg-slate-800/70 dark:hover:bg-amber-500/20 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-xs flex items-center justify-between transition-colors border border-slate-200/60 dark:border-slate-700/60"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>View Provider Dossier</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </Link>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Document Grid / Table with Spacious Columns & Horizontal Scroll */}
      <div className="hidden sm:block rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[950px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 min-w-[180px]">Document Title</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Organization</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Uploaded</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Size & Format</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">Status</th>
                <th className="px-5 py-3.5 text-right whitespace-nowrap w-28">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredDocs.map((doc) => (
                <tr key={`${doc.orgId}-${doc.id}`} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{doc.title}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">TIN: {doc.orgTIN}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/admin/providers/${doc.orgId}`}
                      className="font-medium text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {doc.orgName}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-muted text-muted-foreground">
                      {doc.orgCategory}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-muted-foreground">{doc.uploadedAt}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {doc.type} • {doc.fileSize}
                  </td>
                  <td className="px-4 py-3.5">
                    {doc.status === "VERIFIED" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : doc.status === "REJECTED" ? (
                      <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> Pending Review
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end">
                      <ActionDropdown
                        items={[
                          {
                            label: "Inspect Document",
                            icon: <Eye className="w-3.5 h-3.5" />,
                            onClick: () => alert(`Reviewing document: ${doc.title}`),
                          },
                          ...(doc.status !== "VERIFIED"
                            ? [
                                {
                                  label: "Approve Document",
                                  icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                                  variant: "success" as const,
                                  onClick: () => verifyDocument(doc.orgId, doc.id, "VERIFIED"),
                                },
                              ]
                            : []),
                          ...(doc.status !== "REJECTED"
                            ? [
                                {
                                  label: "Reject Document",
                                  icon: <XCircle className="w-3.5 h-3.5" />,
                                  variant: "danger" as const,
                                  onClick: () =>
                                    verifyDocument(doc.orgId, doc.id, "REJECTED", "Document mismatch or incomplete"),
                                },
                              ]
                            : []),
                          {
                            label: "View Provider Profile",
                            icon: <Building2 className="w-3.5 h-3.5" />,
                            href: `/admin/providers/${doc.orgId}`,
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    No compliance documents matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
