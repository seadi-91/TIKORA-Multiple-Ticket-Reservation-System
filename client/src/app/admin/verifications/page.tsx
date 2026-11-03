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
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
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

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3 overflow-x-auto no-scrollbar flex-nowrap">
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

      {/* Document Grid / Table (Elevated, Soft Borders, Modern Rows) */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Document Title</th>
                <th className="px-4 py-3.5">Organization</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Uploaded</th>
                <th className="px-4 py-3.5">Size & Format</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Verification Action</th>
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
