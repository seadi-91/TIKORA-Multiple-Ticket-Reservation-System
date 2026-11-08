"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  Building2,
  Ticket,
  Crown,
  UserCheck,
  UserX,
  MoreVertical,
  X,
  Mail,
  Phone,
  Calendar,
  Lock,
  CheckCircle2,
  Eye,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { useAdminStore, AdminUser } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";

export default function AdminUsersPage() {
  const { users, toggleUserStatus, deleteUser, createAdminUser, isLoading, fetchPlatformData } = useAdminStore();

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // New admin form state
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserRole, setNewUserRole] = useState<"ADMIN" | "INSPECTOR">("ADMIN");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      (u.organizationName && u.organizationName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    createAdminUser({
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone || "+251 900 000 000",
      role: newUserRole,
    });

    setNewUserName("");
    setNewUserEmail("");
    setNewUserPhone("");
    setShowCreateModal(false);
  };

  const getRoleBadge = (role: AdminUser["role"]) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-500/20">
            <Crown className="w-2.5 h-2.5" /> SUPER ADMIN
          </span>
        );
      case "ORGANIZATION":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-500/20">
            <Building2 className="w-2.5 h-2.5" /> PROVIDER
          </span>
        );
      case "INSPECTOR":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 ring-1 ring-inset ring-cyan-500/20">
            <ShieldCheck className="w-2.5 h-2.5" /> INSPECTOR
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-500/20">
            <Users className="w-2.5 h-2.5" /> CUSTOMER
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            User Management & Access Governance
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit platform users, customers, provider administrators, field inspectors, and privileged accounts.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-md shadow-amber-600/25 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Privileged User</span>
        </button>
      </div>

      {/* Mobile Role Filter Dropdown */}
      <div className="block sm:hidden">
        <label className="text-micro font-bold text-muted-foreground uppercase tracking-wider block mb-1">
          Filter by Role
        </label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full h-7.5 px-2 text-micro rounded-md bg-card border border-slate-200/60 dark:border-slate-800/60 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-xs"
        >
          <option value="ALL">All Roles ({users.length})</option>
          <option value="CUSTOMER">Customers ({users.filter((u) => u.role === "CUSTOMER").length})</option>
          <option value="ORGANIZATION">Providers ({users.filter((u) => u.role === "ORGANIZATION").length})</option>
          <option value="INSPECTOR">Inspectors ({users.filter((u) => u.role === "INSPECTOR").length})</option>
          <option value="ADMIN">Super Admins ({users.filter((u) => u.role === "ADMIN").length})</option>
        </select>
      </div>

      {/* Desktop Role Filter Tabs */}
      <div className="hidden sm:flex flex-wrap items-center gap-1.5 border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
        {[
          { label: "All Users", value: "ALL", count: users.length },
          { label: "Customers", value: "CUSTOMER", count: users.filter((u) => u.role === "CUSTOMER").length },
          { label: "Providers", value: "ORGANIZATION", count: users.filter((u) => u.role === "ORGANIZATION").length },
          { label: "Inspectors", value: "INSPECTOR", count: users.filter((u) => u.role === "INSPECTOR").length },
          { label: "Super Admins", value: "ADMIN", count: users.filter((u) => u.role === "ADMIN").length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setRoleFilter(tab.value)}
            className={`px-2 py-0.5 text-micro font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              roleFilter === tab.value
                ? "bg-amber-600 text-white shadow-xs font-semibold"
                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-nano font-bold ${
                roleFilter === tab.value ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone number, or company..."
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
            <option value="SUSPENDED">Suspended</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Mobile View: High-Clarity Elevated Cards (< 640px) */}
      <div className="block sm:hidden space-y-3.5">
        {filteredUsers.length === 0 ? (
          <div className="py-12 text-center space-y-2 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            <Users className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
            <p className="text-xs font-semibold text-foreground">No users found</p>
            <p className="text-[11px] text-muted-foreground">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl bg-card border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:border-amber-500/30 transition-all p-4 space-y-3.5"
            >
              {/* Card Header: Avatar, Name, Role & 3-Dots */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-extrabold text-sm shadow-xs border border-amber-500/20 mt-0.5">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="font-bold text-foreground text-sm hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block"
                    >
                      {user.name}
                    </Link>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {getRoleBadge(user.role)}
                      {user.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : user.status === "SUSPENDED" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <ActionDropdown
                  items={[
                    {
                      label: "View Detail",
                      icon: <Eye className="w-4 h-4" />,
                      href: `/admin/users/${user.id}`,
                    },
                    ...(user.role !== "ADMIN"
                      ? [
                          {
                            label: user.status === "ACTIVE" ? "Suspend Account" : "Activate Account",
                            icon: user.status === "ACTIVE" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />,
                            variant: user.status === "ACTIVE" ? ("danger" as const) : ("success" as const),
                            onClick: () => toggleUserStatus(user.id),
                          },
                        ]
                      : []),
                    ...(user.organizationName
                      ? [
                          {
                            label: "View Organization",
                            icon: <Building2 className="w-4 h-4" />,
                            href: `/admin/providers?q=${encodeURIComponent(user.organizationName)}`,
                          },
                        ]
                      : []),
                    {
                      label: "Delete User",
                      icon: <Trash2 className="w-4 h-4" />,
                      variant: "danger" as const,
                      onClick: () => setUserToDelete(user),
                    },
                  ]}
                />
              </div>

              {/* Contact & Affiliation Box */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/50 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-mono">{user.phone}</span>
                  </span>
                  <span className="text-muted-foreground font-mono text-[10px]">
                    Joined: {user.createdAt}
                  </span>
                </div>
                {user.organizationName && (
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                    <span className="text-muted-foreground inline-flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Affiliated Org:</span>
                    </span>
                    <span className="font-semibold text-foreground truncate max-w-[170px]">
                      {user.organizationName}
                    </span>
                  </div>
                )}
              </div>

              {/* Activity & Financial Micro-Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-amber-500/[0.04] dark:bg-amber-500/[0.07] border border-amber-500/15 text-center">
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Spend / GMV
                  </span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5 block truncate">
                    {user.totalSpentETB ? `${user.totalSpentETB.toLocaleString()}` : "0"} <span className="text-[9px] font-normal">ETB</span>
                  </span>
                </div>
                <div className="border-x border-amber-500/15">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Bookings
                  </span>
                  <span className="text-xs font-extrabold text-foreground mt-0.5 block">
                    {user.totalBookings || 0} <span className="text-[9px] text-muted-foreground font-normal">orders</span>
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Role Level
                  </span>
                  <span className="text-xs font-black text-foreground mt-0.5 block truncate">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Direct Full-Width Dossier Button */}
              <Link
                href={`/admin/users/${user.id}`}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-500/10 dark:bg-slate-800/70 dark:hover:bg-amber-500/20 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-xs flex items-center justify-between transition-colors border border-slate-200/60 dark:border-slate-700/60"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>View User Dossier & Activity</span>
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
          <table className="w-full text-xs text-left min-w-[980px]">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5 min-w-[200px]">User & Identity</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[130px]">Role</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[170px]">Organization</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[150px]">Contact</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap min-w-[110px]">Registered</th>
                <th className="px-4 py-3.5 text-right w-12 shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block"
                        >
                          {user.name}
                        </Link>
                        <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {user.organizationName ? (
                      <span className="font-semibold text-foreground">{user.organizationName}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-muted-foreground whitespace-nowrap">{user.phone}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {user.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : user.status === "SUSPENDED" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground font-mono whitespace-nowrap">{user.createdAt}</td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap w-12">
                    <ActionDropdown
                      items={[
                        {
                          label: "View Detail",
                          icon: <Eye className="w-4 h-4" />,
                          href: `/admin/users/${user.id}`,
                        },
                        ...(user.role !== "ADMIN"
                          ? [
                              {
                                label: user.status === "ACTIVE" ? "Suspend Account" : "Activate Account",
                                icon: user.status === "ACTIVE" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />,
                                variant: user.status === "ACTIVE" ? ("danger" as const) : ("success" as const),
                                onClick: () => toggleUserStatus(user.id),
                              },
                            ]
                          : []),
                        ...(user.organizationName
                          ? [
                              {
                                label: "View Organization",
                                icon: <Building2 className="w-4 h-4" />,
                                href: `/admin/providers?q=${encodeURIComponent(user.organizationName)}`,
                              },
                            ]
                          : []),
                        {
                          label: "Delete User",
                          icon: <Trash2 className="w-4 h-4" />,
                          variant: "danger" as const,
                          onClick: () => setUserToDelete(user),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    No users matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Privileged User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateSubmit}
            className="w-full max-w-md rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Provision Privileged Account</h3>
                  <p className="text-[11px] text-muted-foreground">Administrative role creation</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Dawit Tadesse"
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="name@tikora.et"
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="+251 900 123 456"
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Privileged Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as "ADMIN" | "INSPECTOR")}
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-slate-200/50 dark:border-slate-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-semibold"
                >
                  <option value="ADMIN">Super Admin (Platform Administrator)</option>
                  <option value="INSPECTOR">Ticket Inspector (Platform Gate Staff)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-md shadow-amber-600/25"
              >
                Provision Account
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Confirm Delete Permanent Modal */}
      <ConfirmDeleteModal
        isOpen={!!userToDelete}
        itemType="User Account"
        itemName={userToDelete ? `${userToDelete.name} (${userToDelete.email})` : ""}
        warningMessage="This will permanently delete this user account, revoke all credentials, and remove associated data from the database."
        isDeleting={isDeletingUser}
        onConfirm={async () => {
          if (!userToDelete) return;
          setIsDeletingUser(true);
          try {
            await deleteUser(userToDelete.id);
            setUserToDelete(null);
          } catch (err) {
            console.error("Failed to delete user:", err);
          } finally {
            setIsDeletingUser(false);
          }
        }}
        onClose={() => {
          if (!isDeletingUser) setUserToDelete(null);
        }}
      />
    </div>
  );
}
