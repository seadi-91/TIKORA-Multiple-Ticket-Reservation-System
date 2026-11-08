"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Ticket,
  Search,
  Building2,
  Bus,
  Film,
  Calendar,
  Trophy,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  X,
  ShieldCheck,
  TrendingUp,
  Layers,
  Check,
  Info,
  Star,
  Trash2,
} from "lucide-react";
import { useAdminStore, AdminService } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { formatCurrency } from "@/lib/format-currency";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";

export default function AdminTicketsPage() {
  const { services, toggleServiceStatus, deleteService, fetchPlatformData } = useAdminStore();

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedDetailTicket, setSelectedDetailTicket] = useState<AdminService | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<AdminService | null>(null);
  const [isDeletingTicket, setIsDeletingTicket] = useState(false);

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

  const getTimeLabel = (category: string) => {
    switch (category) {
      case "CINEMA":
        return "Showtime / Starts At";
      case "BUS":
        return "Departure Time";
      case "SPORTS":
        return "Match Kickoff";
      default:
        return "Gate Opens / Starts";
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
            Monitor, audit, inspect details, and toggle active status across all bus departures, movie showtimes, concert passes, and stadium matches.
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
              {/* Card Header: Title, Category & Actions */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground text-sm leading-snug line-clamp-1">
                    {srv.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                      {srv.category}
                    </span>
                    <span className="text-muted-foreground">•</span>
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

                <ActionDropdown
                  items={[
                    {
                      label: "View Ticket Details",
                      icon: <Eye className="w-4 h-4" />,
                      onClick: () => setSelectedDetailTicket(srv),
                    },
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
                      label: "Open Public Pass View",
                      icon: <ExternalLink className="w-4 h-4" />,
                      href: `/tickets/${srv.id}`,
                    },
                    {
                      label: "Delete Ticket",
                      icon: <Trash2 className="w-4 h-4" />,
                      variant: "danger" as const,
                      onClick: () => setTicketToDelete(srv),
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
                <button
                  type="button"
                  onClick={() => setSelectedDetailTicket(srv)}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-amber-500/20"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>View Details</span>
                </button>
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
          <table className="w-full text-xs text-left min-w-[980px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 min-w-[200px]">Service & Route</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Category</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">Provider Operator</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Base Fare / Price</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[130px]">Tickets Sold</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">Status</th>
                <th className="px-5 py-3.5 text-right w-28 shrink-0">Actions</th>
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
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">
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
                    <div className="flex items-center justify-end">
                      <ActionDropdown
                        items={[
                          {
                            label: "View Ticket Details",
                            icon: <Eye className="w-4 h-4" />,
                            onClick: () => setSelectedDetailTicket(srv),
                          },
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
                            label: "Open Public Pass View",
                            icon: <ExternalLink className="w-4 h-4" />,
                            href: `/tickets/${srv.id}`,
                          },
                          {
                            label: "Delete Ticket",
                            icon: <Trash2 className="w-4 h-4" />,
                            variant: "danger" as const,
                            onClick: () => setTicketToDelete(srv),
                          },
                        ]}
                      />
                    </div>
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

      {/* Admin Ticket Detail Modal */}
      {selectedDetailTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-3 bg-muted/20 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground text-base sm:text-lg leading-tight truncate">
                    Ticket Listing & Inventory Audit
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                    #{selectedDetailTicket.id}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Complete service specifications, admission tiers, and live inventory allocation
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDetailTicket(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
              {/* Cover Image Banner */}
              {selectedDetailTicket.imageUrl && (
                <div className="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-slate-900 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedDetailTicket.imageUrl}
                    alt={selectedDetailTicket.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                  {/* Top Overlay Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-black tracking-wider uppercase text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      {selectedDetailTicket.category}
                    </span>

                    {selectedDetailTicket.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active Listing
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md">
                        <XCircle className="w-3.5 h-3.5" /> Inactive / Paused
                      </span>
                    )}
                  </div>

                  {/* Bottom Overlay Title & Details */}
                  <div className="absolute bottom-3 left-3 right-3 space-y-1">
                    {selectedDetailTicket.badge && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        {selectedDetailTicket.badge}
                      </span>
                    )}
                    <h4 className="text-white font-black text-lg sm:text-xl drop-shadow-sm line-clamp-2">
                      {selectedDetailTicket.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-200 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold">
                        <Building2 className="w-3.5 h-3.5 text-amber-400" />
                        {selectedDetailTicket.providerName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {selectedDetailTicket.city || "Ethiopia"}
                      </span>
                      {selectedDetailTicket.rating && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-300 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {selectedDetailTicket.rating.toFixed(1)}
                            {selectedDetailTicket.reviewCount ? ` (${selectedDetailTicket.reviewCount} reviews)` : ""}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 5-Column Financial & Inventory Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div className="p-3 rounded-2xl bg-amber-500/[0.04] border border-amber-500/15 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Base Price
                  </span>
                  <span className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 mt-0.5 block">
                    {formatCurrency(selectedDetailTicket.price)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Standard Fare</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Passes Sold
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-foreground mt-0.5 block">
                    {selectedDetailTicket.totalSold.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Confirmed</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                    Remaining
                  </span>
                  <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {(selectedDetailTicket.availableSeats ?? Math.max(0, selectedDetailTicket.capacity - selectedDetailTicket.totalSold)).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">Seats Open</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60 text-center">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Total Capacity
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-foreground mt-0.5 block font-mono">
                    {selectedDetailTicket.capacity}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Max Inventory</span>
                </div>

                <div className="p-3 rounded-2xl bg-blue-500/[0.05] border border-blue-500/20 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">
                    Gross GMV
                  </span>
                  <span className="text-sm sm:text-base font-black text-blue-600 dark:text-blue-400 mt-0.5 block">
                    {(selectedDetailTicket.totalSold * selectedDetailTicket.price).toLocaleString()} ETB
                  </span>
                  <span className="text-[10px] text-blue-600/70 dark:text-blue-400/70">Revenue</span>
                </div>
              </div>

              {/* Occupancy Progress Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                    <span>Inventory Occupancy Rate</span>
                  </span>
                  <span className="text-foreground">
                    {Math.round((selectedDetailTicket.totalSold / (selectedDetailTicket.capacity || 1)) * 100)}% Occupied
                    <span className="text-muted-foreground font-normal ml-1">
                      ({selectedDetailTicket.totalSold} / {selectedDetailTicket.capacity})
                    </span>
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((selectedDetailTicket.totalSold / (selectedDetailTicket.capacity || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Schedule, Departure & Venue Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Time & Date Block */}
                <div className="p-4 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 space-y-2.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block tracking-wider">
                    {getTimeLabel(selectedDetailTicket.category)}
                  </span>
                  <div className="flex items-center gap-2 font-black text-foreground text-base">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{selectedDetailTicket.time || "Scheduled Time"}</span>
                    {selectedDetailTicket.duration && (
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {selectedDetailTicket.duration}
                      </span>
                    )}
                  </div>
                  {selectedDetailTicket.date && (
                    <div className="flex items-center gap-1.5 text-muted-foreground font-semibold pt-1 border-t border-slate-100 dark:border-slate-800/60">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Scheduled Date: {selectedDetailTicket.date}</span>
                    </div>
                  )}
                </div>

                {/* Location & Station Block */}
                <div className="p-4 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 space-y-2.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">
                    Operating Terminal / Venue / City
                  </span>
                  <div className="flex items-start gap-2 font-bold text-foreground text-sm">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="leading-snug">{selectedDetailTicket.venue || selectedDetailTicket.location}</p>
                      {selectedDetailTicket.city && (
                        <p className="text-xs text-muted-foreground font-normal mt-0.5">
                          City: {selectedDetailTicket.city}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Provider: </span>
                    <Link
                      href={`/admin/providers/${selectedDetailTicket.providerId}`}
                      className="font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 underline underline-offset-2"
                    >
                      {selectedDetailTicket.providerName}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Admission Tiers & Pricing Breakdown */}
              {selectedDetailTicket.tiers && selectedDetailTicket.tiers.length > 0 && (
                <div className="p-4 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-500" />
                      <span>Admission Tiers & Ticket Categories ({selectedDetailTicket.tiers.length})</span>
                    </h5>
                    <span className="text-[10px] text-muted-foreground">Allocated Pricing</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedDetailTicket.tiers.map((tier: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-foreground text-xs">{tier.name}</p>
                            {tier.available !== undefined && (
                              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                {tier.available} seats available
                              </p>
                            )}
                          </div>
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">
                            {tier.price} ETB
                          </span>
                        </div>

                        {tier.perks && tier.perks.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                            {tier.perks.map((perk: string, pIdx: number) => (
                              <span
                                key={pIdx}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium"
                              >
                                ✓ {perk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Included Amenities & Features */}
              {selectedDetailTicket.amenities && selectedDetailTicket.amenities.length > 0 && (
                <div className="p-4 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Included Amenities & Passenger Features</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedDetailTicket.amenities.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-foreground border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Public Description & Overview */}
              {selectedDetailTicket.description && (
                <div className="p-4 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-500" />
                    <span>Service Overview & Public Description</span>
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line pt-1">
                    {selectedDetailTicket.description}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-muted/20 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/tickets/${selectedDetailTicket.id}`}
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                  <span>Open Public Pass</span>
                </Link>

                <Link
                  href="/admin/bookings"
                  className="px-3.5 py-2 rounded-xl bg-card hover:bg-muted text-foreground text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-800/60"
                >
                  <Ticket className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>View Bookings</span>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleServiceStatus(selectedDetailTicket.id);
                    setSelectedDetailTicket((prev) =>
                      prev ? { ...prev, status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : null
                    );
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    selectedDetailTicket.status === "ACTIVE"
                      ? "bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 border-rose-200 dark:border-rose-900"
                      : "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200 dark:border-emerald-900"
                  }`}
                >
                  {selectedDetailTicket.status === "ACTIVE" ? (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Deactivate Service</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Activate Service</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDetailTicket(null)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Delete Ticket Modal */}
      <ConfirmDeleteModal
        isOpen={!!ticketToDelete}
        itemType="Ticket Listing"
        itemName={ticketToDelete ? `${ticketToDelete.title} (#${ticketToDelete.id})` : ""}
        warningMessage="This will permanently delete this ticket offering, allocated seat inventories, tier prices, and active listings from the platform."
        isDeleting={isDeletingTicket}
        onConfirm={async () => {
          if (!ticketToDelete) return;
          setIsDeletingTicket(true);
          try {
            await deleteService(ticketToDelete.id);
            if (selectedDetailTicket?.id === ticketToDelete.id) {
              setSelectedDetailTicket(null);
            }
            setTicketToDelete(null);
          } catch (err) {
            console.error("Failed to delete ticket:", err);
          } finally {
            setIsDeletingTicket(false);
          }
        }}
        onClose={() => {
          if (!isDeletingTicket) setTicketToDelete(null);
        }}
      />
    </div>
  );
}
