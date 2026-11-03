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
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
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

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
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
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              categoryFilter === tab.value
                ? "bg-amber-600 text-white shadow-sm shadow-amber-600/25"
                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                categoryFilter === tab.value ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Status Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service title, terminal station, or provider name..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl bg-card border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Services Table (Elevated, Soft Borders, Modern Rows) */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Service & Route</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Provider Operator</th>
                <th className="px-4 py-3.5">Base Fare / Price</th>
                <th className="px-4 py-3.5">Tickets Sold</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right w-14">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredServices.map((srv) => (
                <tr key={srv.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-bold text-foreground text-xs">{srv.title}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>{srv.location}</span>
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-muted/50 text-foreground">
                      {getCategoryIcon(srv.category)}
                      {srv.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/admin/providers/${srv.providerId}`}
                      className="font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {srv.providerName}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 font-extrabold text-foreground">
                    {srv.price} <span className="text-[10px] text-muted-foreground font-normal">ETB</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-bold text-foreground">{srv.totalSold.toLocaleString()} tickets</p>
                      <p className="text-[10px] text-muted-foreground font-mono">Capacity: {srv.capacity}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
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
