"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  ArrowLeft,
  FileCheck,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";

export default function OrganizationVerificationPage() {
  const { organization } = useProviderStore();

  const [documents, setDocuments] = useState([
    {
      id: "doc-1",
      name: "Commercial Registration Certificate",
      fileName: "Selam_Bus_Commercial_Registration_2024.pdf",
      fileSize: "2.4 MB",
      uploadDate: "2025-01-14",
      status: "APPROVED",
      issuedBy: "Ministry of Trade and Regional Integration",
    },
    {
      id: "doc-2",
      name: "Federal TIN Certificate",
      fileName: "TIN_Registration_0048192841.pdf",
      fileSize: "1.1 MB",
      uploadDate: "2025-01-14",
      status: "APPROVED",
      issuedBy: "Ministry of Revenues (Federal)",
    },
    {
      id: "doc-3",
      name: "Passenger Transport Operating License",
      fileName: "MOT_CrossCountry_Permit_2026.pdf",
      fileSize: "3.8 MB",
      uploadDate: "2025-02-01",
      status: "APPROVED",
      issuedBy: "Federal Transport Authority",
    },
    {
      id: "doc-4",
      name: "Commercial Bank Account Confirmation Letter",
      fileName: "CBE_Account_Verification_Letter.pdf",
      fileSize: "980 KB",
      uploadDate: "2025-02-10",
      status: "APPROVED",
      issuedBy: "Commercial Bank of Ethiopia",
    },
  ]);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;

    setDocuments([
      ...documents,
      {
        id: `doc-${Date.now()}`,
        name: newDocName,
        fileName: selectedFile ? selectedFile.name : `${newDocName.replace(/\s+/g, "_")}.pdf`,
        fileSize: "1.5 MB",
        uploadDate: new Date().toISOString().split("T")[0],
        status: "PENDING",
        issuedBy: "Under Super-Admin Audit",
      },
    ]);

    setNewDocName("");
    setSelectedFile(null);
    setUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/provider/organization" className="hover:text-[#B45309] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Organization</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0F172A] dark:text-white">Document Compliance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Verification & Legal Compliance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Super-Admin verified corporate credentials and digital operating documents.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Compliance Overview Banner */}
      <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Provider Account Fully Approved
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300/80">
              All 4 primary regulatory certificates are validated. Your ticket sales and bank payouts are active.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shrink-0">
          Super-Admin Verified
        </span>
      </div>

      {/* Document Records Table */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#B45309]" />
            <span>Uploaded Certificates ({documents.length})</span>
          </h2>
          <span className="text-xs text-slate-400">PDF, JPG or PNG up to 10MB</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-50/50 dark:bg-slate-800/20">
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Issuing Authority</th>
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Date Uploaded</th>
                <th className="py-3 px-4 text-center">Audit Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F172A] dark:text-white">
                    {doc.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {doc.issuedBy}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {doc.fileName} <span className="text-[10px] text-slate-400">({doc.fileSize})</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {doc.uploadDate}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === "APPROVED"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {doc.status === "APPROVED" ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{doc.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => alert(`Previewing ${doc.fileName}`)}
                      className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-[#B45309] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="View Document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
              Upload Verification Certificate
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Document Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Renewed Transport Operating Permit"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#B45309]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Choose File (PDF or Image)
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#B45309] file:text-white cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold"
                >
                  Submit for Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
