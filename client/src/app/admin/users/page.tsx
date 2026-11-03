"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useAdminStore, AdminUser } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export default function AdminUsersPage() {
  const { users, toggleUserStatus, createAdminUser } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
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

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
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
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              roleFilter === tab.value
                ? "bg-amber-600 text-white shadow-sm shadow-amber-600/25"
                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                roleFilter === tab.value ? "bg-white/20 text-white" : "bg-muted-foreground/15 text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone number, or company..."
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
            <option value="SUSPENDED">Suspended</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Master Table (Elevated, Soft Borders, Modern Rows) */}
      <div className="rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/60 dark:bg-slate-800/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User & Identity</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Organization</th>
                <th className="px-4 py-3.5">Contact</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Registered</th>
                <th className="px-5 py-3.5 text-right w-14">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.06] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-3.5">
                    {user.organizationName ? (
                      <span className="font-semibold text-foreground">{user.organizationName}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-muted-foreground">{user.phone}</td>
                  <td className="px-4 py-3.5">
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
                  <td className="px-4 py-3.5 text-muted-foreground font-mono">{user.createdAt}</td>
                  <td className="px-5 py-3.5 text-right">
                    <ActionDropdown
                      items={[
                        {
                          label: "View Account Dossier",
                          icon: <UserCheck className="w-4 h-4" />,
                          onClick: () => setSelectedUser(user),
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

      {/* Inspect User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-sm flex items-center justify-center shadow-xs">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{selectedUser.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/20">
                <span className="text-muted-foreground">Role</span>
                <span>{getRoleBadge(selectedUser.role)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/20">
                <span className="text-muted-foreground">Status</span>
                <span className="font-bold text-foreground">{selectedUser.status}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/20">
                <span className="text-muted-foreground">Phone Number</span>
                <span className="font-mono text-foreground">{selectedUser.phone}</span>
              </div>
              {selectedUser.organizationName && (
                <div className="flex justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Assigned Organization</span>
                  <span className="font-semibold text-foreground">{selectedUser.organizationName}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-border/20">
                <span className="text-muted-foreground">Created Date</span>
                <span className="font-mono text-foreground">{selectedUser.createdAt}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/20">
                <span className="text-muted-foreground">Last Login Activity</span>
                <span className="font-mono text-foreground">{selectedUser.lastLogin}</span>
              </div>
              {selectedUser.totalBookings !== undefined && (
                <div className="flex justify-between py-1.5 border-b border-border/20">
                  <span className="text-muted-foreground">Lifetime Reservations</span>
                  <span className="font-extrabold text-foreground">{selectedUser.totalBookings} tickets</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                Close
              </button>
              {selectedUser.role !== "ADMIN" && (
                <button
                  onClick={() => {
                    toggleUserStatus(selectedUser.id);
                    setSelectedUser(null);
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs ${
                    selectedUser.status === "ACTIVE"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {selectedUser.status === "ACTIVE" ? "Suspend Account" : "Reactivate Account"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
