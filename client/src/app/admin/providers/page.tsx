"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function AdminProvidersPage() {
  const { organizations, approveOrganization, suspendOrganization, activateOrganization } =
    useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

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
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
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

      {/* Status Filter Tabs (Mobile-Friendly Horizontal Scroll) */}
      <div className="flex items-center gap-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-3 overflow-x-auto no-scrollbar">
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
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 flex items-center gap-2 ${
              statusFilter === tab.value
                ? "bg-amber-600 text-white shadow-sm shadow-amber-600/25"
                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
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

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search provider by name, TIN number, license, or city..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="BUS">Bus Transportation</option>
            <option value="CINEMA">Cinema & Film</option>
            <option value="EVENT">Concerts & Events</option>
            <option value="SPORTS">Sports & Tournaments</option>
          </select>
        </div>
      </div>

      {/* Organizations Master Table (Dual View: Mobile Cards & Desktop Table) */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="block sm:hidden divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredOrgs.length === 0 ? (
            <div className="px-4 py-10 text-center text-muted-foreground text-xs">
              No organizations found matching your search.
            </div>
          ) : (
            filteredOrgs.map((org) => (
              <div key={org.id} className="p-4 space-y-3">
                {/* Header: Org Name, Category & Dropdown */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-extrabold text-xs shadow-xs">
                      {org.name.charAt(0)}
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

                  <ActionDropdown
                    items={[
                      {
                        label: "Inspect Dossier",
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
                    ]}
                  />
                </div>

                {/* Status and Category */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-muted/50 text-foreground">
                    {getCategoryIcon(org.category)}
                    {org.category}
                  </span>
                  {getStatusBadge(org.status)}
                  <span className="text-[11px] text-muted-foreground ml-auto font-mono">
                    TIN: {org.taxNumber}
                  </span>
                </div>

                {/* Contact and GMV */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/40 text-xs">
                  <div>
                    <p className="font-semibold text-foreground text-[11px]">{org.contactPerson}</p>
                    <p className="text-[10px] text-muted-foreground">{org.city} • {org.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600 dark:text-amber-400 font-mono text-xs">
                      {org.totalRevenue.toLocaleString()} ETB
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {org.totalServices} svcs • {org.commissionRate}% comm
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Organization Name</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Registration & TIN</th>
                <th className="px-4 py-3.5">Contact & City</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Commission</th>
                <th className="px-4 py-3.5">Services / GMV</th>
                <th className="px-5 py-3.5 text-right w-14">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredOrgs.map((org) => (
                <tr key={org.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-extrabold text-sm shadow-xs">
                        {org.name.charAt(0)}
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
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-muted/50 text-foreground">
                      {getCategoryIcon(org.category)}
                      {org.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-mono text-[11px]">
                      <p className="font-bold text-foreground">{org.taxNumber}</p>
                      <p className="text-muted-foreground truncate max-w-[140px] text-[10px]">{org.businessLicense}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-bold text-foreground">{org.contactPerson}</p>
                      <p className="text-[11px] text-muted-foreground">{org.city} • {org.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">{getStatusBadge(org.status)}</td>
                  <td className="px-4 py-3.5 font-extrabold text-foreground">{org.commissionRate}%</td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-bold text-foreground">{org.totalServices} services</p>
                      <p className="text-[11px] text-muted-foreground">
                        {org.totalRevenue.toLocaleString()} ETB
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <ActionDropdown
                      items={[
                        {
                          label: "Inspect Dossier",
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
    </div>
  );
}
