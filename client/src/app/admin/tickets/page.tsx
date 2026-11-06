"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Search,
  Filter,
  Building2,
  Bus,
  Film,
  Calendar,
  Trophy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  MapPin,
  DollarSign,
  ArrowRight,
  Users,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function AdminTicketsPage() {
  const { services, toggleServiceStatus } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredServices = services.filter((srv) => {
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "ALL" || srv.category === categoryFilter;
    const matchesStatus = statusFilter === "ALL" || srv.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Platform Services & Ticket Inventory
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor and audit all active bus departures, movie showtimes, concert passes, and stadium matches.
          </p>
        </div>

        <Link
          href="/admin/categories"
          className="px-4 py-2 text-xs font-bold rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 hover:bg-muted text-foreground transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <span>Category Settings</span>
        </Link>
      </div>

      {/* Mobile Category Dropdown */}
      <div className="block sm:hidden">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
          Filter by Category
        </label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full h-10 px-3 text-xs rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
        >
          <option value="ALL">All Listings ({services.length})</option>
          <option value="BUS">Bus Routes ({services.filter((s) => s.category === "BUS").length})</option>
          <option value="CINEMA">Cinema Showtimes ({services.filter((s) => s.category === "CINEMA").length})</option>
          <option value="EVENT">Live Events ({services.filter((s) => s.category === "EVENT").length})</option>
          <option value="SPORTS">Sports Fixtures ({services.filter((s) => s.category === "SPORTS").length})</option>
        </select>
      </div>

      {/* Desktop Category Tabs */}
      <div className="hidden sm:flex flex-wrap items-center gap-1.5 border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
        {[
          { label: "All Listings", value: "ALL", count: services.length },
          { label: "Bus Routes", value: "BUS", count: services.filter((s) => s.category === "BUS").length },
          { label: "Cinema Showtimes", value: "CINEMA", count: services.filter((s) => s.category === "CINEMA").length },
          { label: "Live Events", value: "EVENT", count: services.filter((s) => s.category === "EVENT").length },
          { label: "Sports Fixtures", value: "SPORTS", count: services.filter((s) => s.category === "SPORTS").length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategoryFilter(tab.value)}
            className={`px-2 py-0.5 text-micro font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              categoryFilter === tab.value
                ? "bg-amber-600 text-white shadow-xs font-semibold"
                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-nano font-bold ${
                categoryFilter === tab.value ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Status Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service title, terminal station, or provider name..."
            className="w-full h-7.5 pl-7.5 pr-2.5 text-micro rounded-md bg-card border border-slate-200/50 dark:border-slate-800/50 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-7.5 px-2 text-micro rounded-md bg-card border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Mobile View: High-Clarity Elevated Cards */}
      <div className="block sm:hidden space-y-3.5">
        {filteredServices.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            No services found matching filters.
          </div>
        ) : (
          filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="rounded-2xl bg-card border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:border-amber-500/30 transition-all p-4 space-y-3.5"
            >
              {/* Card Header: Category Icon, Title, Status & Actions */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-extrabold text-sm shadow-xs border border-amber-500/20 mt-0.5">
                    {getCategoryIcon(srv.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground text-sm leading-snug line-clamp-1">
                      {srv.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted/70 text-foreground border border-slate-200/50 dark:border-slate-700/50">
                        {srv.category}
                      </span>
                      {srv.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-1 ring-inset ring-slate-500/20">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <ActionDropdown
                  items={[
                    {
                      label: srv.status === "ACTIVE" ? "Deactivate Service" : "Activate Service",
                      icon: srv.status === "ACTIVE" ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />,
                      variant: srv.status === "ACTIVE" ? ("danger" as const) : ("success" as const),
                      onClick: () => toggleServiceStatus(srv.id),
                    },
                    {
                      label: "View Operator Organization",
                      icon: <Building2 className="w-4 h-4" />,
                      href: `/admin/providers/${srv.providerId}`,
                    },
                    {
                      label: "View Related Bookings",
                      icon: <Ticket className="w-4 h-4" />,
                      href: `/admin/bookings`,
                    },
                  ]}
                />
              </div>

              {/* Route & Operator Strip */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/50 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-medium text-foreground">{srv.location}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                  <span className="text-muted-foreground">Operator:</span>
                  <Link
                    href={`/admin/providers/${srv.providerId}`}
                    className="font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {srv.providerName}
                  </Link>
                </div>
              </div>

              {/* 3-Column Performance Micro-Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-amber-500/[0.04] dark:bg-amber-500/[0.07] border border-amber-500/15 text-center">
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Base Fare
                  </span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5 block truncate">
                    {srv.price} <span className="text-[9px] font-normal">ETB</span>
                  </span>
                </div>
                <div className="border-x border-amber-500/15">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Sold Passes
                  </span>
                  <span className="text-xs font-extrabold text-foreground mt-0.5 block">
                    {srv.totalSold.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Total Capacity
                  </span>
                  <span className="text-xs font-extrabold text-foreground font-mono mt-0.5 block">
                    {srv.capacity}
                  </span>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex items-center gap-2 pt-0.5">
                <Link
                  href={`/admin/providers/${srv.providerId}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-500/10 dark:bg-slate-800/70 dark:hover:bg-amber-500/20 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200/60 dark:border-slate-700/60"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>View Operator</span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleServiceStatus(srv.id)}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors border ${
                    srv.status === "ACTIVE"
                      ? "bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 border-rose-200/60 dark:border-rose-900/50"
                      : "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-600 border-emerald-200/60 dark:border-emerald-900/50"
                  }`}
                >
                  {srv.status === "ACTIVE" ? (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Deactivate</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Activate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Table with Spacious Columns & Horizontal Scroll */}
      <div className="hidden sm:block rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[950px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 min-w-[200px]">Service & Route</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Provider Operator</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Base Fare / Price</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[130px]">Tickets Sold</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">Status</th>
                <th className="px-4 py-3.5 text-right w-12 shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredServices.map((srv) => (
                <tr key={srv.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5 min-w-[200px]">
                    <div>
                      <p className="font-bold text-foreground text-xs">{srv.title}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>{srv.location}</span>
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-muted/50 text-foreground">
                      {getCategoryIcon(srv.category)}
                      {srv.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Link
                      href={`/admin/providers/${srv.providerId}`}
                      className="font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {srv.providerName}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap font-extrabold text-foreground">
                    {srv.price} <span className="text-[10px] text-muted-foreground font-normal">ETB</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-foreground">{srv.totalSold.toLocaleString()} tickets</p>
                      <p className="text-[10px] text-muted-foreground font-mono">Capacity: {srv.capacity}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {srv.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-1 ring-inset ring-slate-500/20">
                        <XCircle className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <ActionDropdown
                      items={[
                        {
                          label: srv.status === "ACTIVE" ? "Deactivate Service" : "Activate Service",
                          icon: srv.status === "ACTIVE" ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />,
                          variant: srv.status === "ACTIVE" ? ("danger" as const) : ("success" as const),
                          onClick: () => toggleServiceStatus(srv.id),
                        },
                        {
                          label: "View Operator Organization",
                          icon: <Building2 className="w-4 h-4" />,
                          href: `/admin/providers/${srv.providerId}`,
                        },
                        {
                          label: "View Related Bookings",
                          icon: <Ticket className="w-4 h-4" />,
                          href: `/admin/bookings`,
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}

              {filteredServices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    No services found matching filters.
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
