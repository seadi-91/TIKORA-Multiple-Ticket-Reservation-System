"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  FileText,
  Bus,
  Film,
  Calendar,
  Trophy,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useAdminStore, AdminOrganization } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";

export default function AdminProvidersPage() {
  const {
    organizations,
    approveOrganization,
    rejectOrganization,
    suspendOrganization,
    activateOrganization,
    deleteOrganization,
    fetchPlatformData,
  } = useAdminStore();

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [orgToDelete, setOrgToDelete] = useState<AdminOrganization | null>(null);
  const [isDeletingOrg, setIsDeletingOrg] = useState(false);

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.businessLicense.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.taxNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || org.status === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || org.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BUS":
        return <Bus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "CINEMA":
        return <Film className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "SPORTS":
        return <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
            <AlertTriangle className="w-3 h-3" /> Suspended
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-1 ring-inset ring-slate-500/20">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Provider Organizations & Fleet Directory
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit transportation companies, cinema multiplexes, event producers, and sports clubs operating on TIKORA.
          </p>
        </div>

        <Link
          href="/admin/verifications"
          className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-md shadow-amber-600/25 flex items-center gap-2 self-start sm:self-auto"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Compliance Document Queue</span>
        </Link>
      </div>

      {/* Mobile Filter Dropdown */}
      <div className="block sm:hidden">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
          Filter by Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full h-10 px-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
        >
          <option value="ALL">All Providers ({organizations.length})</option>
          <option value="PENDING">Pending Review ({organizations.filter((o) => o.status === "PENDING").length})</option>
          <option value="APPROVED">Verified & Approved ({organizations.filter((o) => o.status === "APPROVED").length})</option>
          <option value="SUSPENDED">Suspended ({organizations.filter((o) => o.status === "SUSPENDED").length})</option>
          <option value="REJECTED">Rejected ({organizations.filter((o) => o.status === "REJECTED").length})</option>
        </select>
      </div>

      {/* Desktop Status Filter Tabs */}
      <div className="hidden sm:flex items-center gap-1.5 border-b border-slate-200/40 dark:border-slate-800/40 pb-2 overflow-x-auto no-scrollbar">
        {[
          { label: "All Providers", value: "ALL", count: organizations.length },
          {
            label: "Pending Review",
            value: "PENDING",
            count: organizations.filter((o) => o.status === "PENDING").length,
          },
          {
            label: "Verified & Approved",
            value: "APPROVED",
            count: organizations.filter((o) => o.status === "APPROVED").length,
          },
          {
            label: "Suspended",
            value: "SUSPENDED",
            count: organizations.filter((o) => o.status === "SUSPENDED").length,
          },
          {
            label: "Rejected",
            value: "REJECTED",
            count: organizations.filter((o) => o.status === "REJECTED").length,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-2 py-0.5 text-micro font-medium rounded-md transition-all shrink-0 flex items-center gap-1 cursor-pointer ${statusFilter === tab.value
                ? "bg-amber-600 text-white shadow-xs font-semibold"
                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-nano font-bold ${statusFilter === tab.value ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
                }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search provider by name, TIN number, license, or city..."
            className="w-full h-7.5 pl-7.5 pr-2.5 text-micro rounded-md bg-card border border-slate-200/50 dark:border-slate-800/50 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-7.5 px-2 text-micro rounded-md bg-card border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-semibold"
          >
            <option value="ALL">All Categories</option>
            <option value="BUS">Bus Transportation</option>
            <option value="CINEMA">Cinema & Film</option>
            <option value="EVENT">Concerts & Events</option>
            <option value="SPORTS">Sports & Tournaments</option>
          </select>
        </div>
      </div>

      {/* Mobile View: High-Clarity Elevated Cards */}
      <div className="block sm:hidden space-y-3.5">
        {filteredOrgs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            No organizations found matching your search.
          </div>
        ) : (
          filteredOrgs.map((org) => (
            <div
              key={org.id}
              className="rounded-2xl bg-card border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:border-amber-500/30 transition-all p-4 space-y-3.5"
            >
              {/* Card Header: Initial Avatar, Org Name, Sector & Actions */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-extrabold text-sm shadow-xs border border-amber-500/20 mt-0.5">
                    {org.name?.charAt(0) || "P"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/providers/${org.id}`}
                      className="font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block text-sm"
                    >
                      {org.name}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted/70 text-foreground border border-slate-200/50 dark:border-slate-700/50">
                        {getCategoryIcon(org.category)}
                        <span>{org.category}</span>
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-700/50">
                        TIN: {org.taxNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {getStatusBadge(org.status)}
                  <ActionDropdown
                    items={[
                      {
                        label: "View Detail",
                        icon: <Eye className="w-4 h-4" />,
                        href: `/admin/providers/${org.id}`,
                      },
                      ...(org.status === "PENDING"
                        ? [
                          {
                            label: "Approve Provider",
                            icon: <CheckCircle2 className="w-4 h-4" />,
                            variant: "success" as const,
                            onClick: () => approveOrganization(org.id),
                          },
                          {
                            label: "Reject Application",
                            icon: <XCircle className="w-4 h-4" />,
                            variant: "danger" as const,
                            onClick: () => rejectOrganization(org.id, "Administrative compliance review"),
                          },
                        ]
                        : []),
                      ...(org.status === "APPROVED"
                        ? [
                          {
                            label: "Suspend Account",
                            icon: <XCircle className="w-4 h-4" />,
                            variant: "danger" as const,
                            onClick: () => suspendOrganization(org.id, "Administrative review"),
                          },
                        ]
                        : []),
                      ...(org.status === "SUSPENDED"
                        ? [
                          {
                            label: "Reactivate Account",
                            icon: <CheckCircle2 className="w-4 h-4" />,
                            variant: "success" as const,
                            onClick: () => activateOrganization(org.id),
                          },
                        ]
                        : []),
                      {
                        label: "Compliance Documents",
                        icon: <FileText className="w-4 h-4" />,
                        href: `/admin/verifications`,
                      },
                      {
                        label: "Commission Rate",
                        icon: <Sparkles className="w-4 h-4" />,
                        href: `/admin/commissions`,
                      },
                      {
                        label: "Delete Provider",
                        icon: <Trash2 className="w-4 h-4" />,
                        variant: "danger" as const,
                        onClick: () => setOrgToDelete(org),
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Contact & Location Strip */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Contact Person
                  </span>
                  <span className="font-semibold text-foreground text-xs">{org.contactPerson}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1.5 border-t border-slate-200/40 dark:border-slate-700/40">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{org.city}</span>
                  </span>
                  <a
                    href={`tel:${org.phone}`}
                    className="inline-flex items-center gap-1.5 font-mono text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{org.phone}</span>
                  </a>
                </div>
              </div>

              {/* Financial & Operational KPI Micro-Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-amber-500/[0.04] dark:bg-amber-500/[0.07] border border-amber-500/15 text-center">
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Gross Revenue
                  </span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5 block truncate">
                    {(org.totalRevenue || 0).toLocaleString()} <span className="text-[9px] font-normal">ETB</span>
                  </span>
                </div>
                <div className="border-x border-amber-500/15">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Active Svcs
                  </span>
                  <span className="text-xs font-extrabold text-foreground mt-0.5 block">
                    {org.totalServices} <span className="text-[9px] text-muted-foreground font-normal">svcs</span>
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Commission
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {org.commissionRate}%
                  </span>
                </div>
              </div>

              {/* Direct Full-Width Action Button */}
              <Link
                href={`/admin/providers/${org.id}`}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-500/10 dark:bg-slate-800/70 dark:hover:bg-amber-500/20 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-xs flex items-center justify-between transition-colors border border-slate-200/60 dark:border-slate-700/60"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>View Provider Details & Dossier</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Table with Spacious Columns & Horizontal Scroll */}
      <div className="hidden sm:block rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[1060px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 min-w-[220px]">Organization Name</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Registration & TIN</th>
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[210px]">Contact & City</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[90px]">Commission</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[130px]">Services / GMV</th>
                <th className="px-4 py-3.5 text-right w-12 shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredOrgs.map((org) => (
                <tr key={org.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5 min-w-[220px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-extrabold text-sm shadow-xs">
                        {org.name?.charAt(0) || "P"}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/providers/${org.id}`}
                          className="font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block text-xs"
                        >
                          {org.name}
                        </Link>
                        <p className="text-[11px] text-muted-foreground truncate">{org.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-muted/50 text-foreground">
                      {getCategoryIcon(org.category)}
                      {org.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-mono text-[11px]">
                      <p className="font-bold text-foreground">{org.taxNumber}</p>
                      <p className="text-muted-foreground text-[10px]">{org.businessLicense}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap min-w-[210px]">
                    <div>
                      <p className="font-bold text-foreground text-xs">{org.contactPerson}</p>
                      <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                        {org.city} • <span className="font-mono">{org.phone}</span>
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">{getStatusBadge(org.status)}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap font-extrabold text-foreground">{org.commissionRate}%</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-foreground">{org.totalServices} services</p>
                      <p className="text-[11px] text-muted-foreground">
                        {(org.totalRevenue || 0).toLocaleString()} ETB
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap w-12">
                    <ActionDropdown
                      items={[
                        {
                          label: "View Detail",
                          icon: <Eye className="w-4 h-4" />,
                          href: `/admin/providers/${org.id}`,
                        },
                        ...(org.status === "PENDING"
                          ? [
                            {
                              label: "Approve Provider",
                              icon: <CheckCircle2 className="w-4 h-4" />,
                              variant: "success" as const,
                              onClick: () => approveOrganization(org.id),
                            },
                            {
                              label: "Reject Application",
                              icon: <XCircle className="w-4 h-4" />,
                              variant: "danger" as const,
                              onClick: () => rejectOrganization(org.id, "Administrative compliance review"),
                            },
                          ]
                          : []),
                        ...(org.status === "APPROVED"
                          ? [
                            {
                              label: "Suspend Account",
                              icon: <XCircle className="w-4 h-4" />,
                              variant: "danger" as const,
                              onClick: () => suspendOrganization(org.id, "Administrative review"),
                            },
                          ]
                          : []),
                        ...(org.status === "SUSPENDED"
                          ? [
                            {
                              label: "Reactivate Account",
                              icon: <CheckCircle2 className="w-4 h-4" />,
                              variant: "success" as const,
                              onClick: () => activateOrganization(org.id),
                            },
                          ]
                          : []),
                        {
                          label: "Compliance Documents",
                          icon: <FileText className="w-4 h-4" />,
                          href: `/admin/verifications`,
                        },
                        {
                          label: "Commission Rate",
                          icon: <Sparkles className="w-4 h-4" />,
                          href: `/admin/commissions`,
                        },
                        {
                          label: "Delete Provider",
                          icon: <Trash2 className="w-4 h-4" />,
                          variant: "danger" as const,
                          onClick: () => setOrgToDelete(org),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}

              {filteredOrgs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                    No providers found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Confirm Delete Provider Modal */}
      <ConfirmDeleteModal
        isOpen={!!orgToDelete}
        itemType="Provider Organization"
        itemName={orgToDelete ? orgToDelete.name : ""}
        warningMessage="This will permanently delete this provider organization, all their listed tickets, documents, and provider memberships from the database."
        isDeleting={isDeletingOrg}
        onConfirm={async () => {
          if (!orgToDelete) return;
          setIsDeletingOrg(true);
          try {
            await deleteOrganization(orgToDelete.id);
            setOrgToDelete(null);
          } catch (err) {
            console.error("Failed to delete organization:", err);
          } finally {
            setIsDeletingOrg(false);
          }
        }}
        onClose={() => {
          if (!isDeletingOrg) setOrgToDelete(null);
        }}
      />
    </div>
  );
}
