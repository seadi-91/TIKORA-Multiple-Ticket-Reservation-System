"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderTree,
  Bus,
  Film,
  Calendar,
  Trophy,
  CheckCircle2,
  XCircle,
  Percent,
  Building2,
  Ticket,
  Save,
  Edit,
  ArrowRight,
  Plus,
  Trash2,
  X,
  Music,
  Sparkles,
  Landmark,
  Loader2,
} from "lucide-react";
import { useAdminStore, AdminCategory } from "@/stores/admin.store";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";

export default function AdminCategoriesPage() {
  const {
    categories,
    organizations,
    bookings,
    services,
    fetchPlatformData,
    createCategory,
    updateCategoryDetails,
    toggleCategoryActive,
    deleteCategory,
  } = useAdminStore();

  useEffect(() => {
    fetchPlatformData();
  }, [fetchPlatformData]);

  // Add Category Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCommissionRate, setNewCommissionRate] = useState<number>(5.0);
  const [newIcon, setNewIcon] = useState("Ticket");

  // Edit Category Modal State (triggered from 3-dots dropdown)
  const [categoryToEdit, setCategoryToEdit] = useState<AdminCategory | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCommissionRate, setEditCommissionRate] = useState<number>(5.0);
  const [editIcon, setEditIcon] = useState("Ticket");
  const [isUpdating, setIsUpdating] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState("");

  // Delete Category Confirmation Modal State (triggered from 3-dots dropdown)
  const [catToDelete, setCatToDelete] = useState<AdminCategory | null>(null);
  const [isDeletingCat, setIsDeletingCat] = useState(false);

  const getCategoryIcon = (category: string, iconName?: string) => {
    const icon = iconName || category;
    switch (icon) {
      case "BUS":
      case "Bus":
        return <Bus className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "CINEMA":
      case "Film":
        return <Film className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "SPORTS":
      case "Trophy":
        return <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "EVENT":
      case "Music":
        return <Music className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "Landmark":
        return <Landmark className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case "Sparkles":
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case "FolderTree":
        return <FolderTree className="w-4 h-4 text-indigo-500" />;
      default:
        return <Ticket className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  const handleOpenEdit = (cat: AdminCategory) => {
    setCategoryToEdit(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDescription(cat.description || "");
    setEditCommissionRate(cat.commissionRate || 5.0);
    setEditIcon(cat.icon || "Ticket");
    setEditErrorMessage("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryToEdit) return;
    setEditErrorMessage("");

    if (!editName.trim()) {
      setEditErrorMessage("Category name is required.");
      return;
    }

    setIsUpdating(true);
    try {
      await updateCategoryDetails(categoryToEdit.id, {
        name: editName.trim(),
        description: editDescription.trim(),
        commissionRate: Number(editCommissionRate || 5.0),
        icon: editIcon,
      });
      setCategoryToEdit(null);
    } catch (err: any) {
      setEditErrorMessage(err.message || "Failed to update category. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!newName.trim()) {
      setErrorMessage("Category name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCategory({
        name: newName.trim(),
        slug: newSlug.trim() || undefined,
        description: newDescription.trim() || undefined,
        commissionRate: Number(newCommissionRate || 5.0),
        icon: newIcon,
      });

      setNewName("");
      setNewSlug("");
      setNewDescription("");
      setNewCommissionRate(5.0);
      setNewIcon("Ticket");
      setShowAddModal(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header with Compact Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold tracking-tight text-foreground">
            Platform Categories & Sector Commissions
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Configure sector-wide commission rates, operational availability, and category descriptions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 text-[11px] font-bold rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white transition-all shadow-xs shadow-amber-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>

          <Link
            href="/admin/commissions"
            className="px-3 py-1.5 text-[11px] font-semibold rounded-xl bg-card border border-slate-200/60 dark:border-slate-800/60 hover:bg-muted text-foreground transition-all flex items-center gap-1 shadow-xs"
          >
            <Percent className="w-3.5 h-3.5 text-amber-500" />
            <span>Commission Tiers</span>
          </Link>
        </div>
      </div>

      {/* Categories Grid with Compact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {categories.map((cat) => {
          const catKey = (cat.slug || cat.category || "").toUpperCase();
          const provCount = organizations.filter(
            (o) => (o.category || "").toUpperCase() === catKey
          ).length;
          const serviceCount = services.filter(
            (s) => (s.category || "").toUpperCase() === catKey
          ).length;
          const bookingCount = bookings.filter(
            (b) => (b.category || "").toUpperCase() === catKey
          ).length;

          return (
            <div
              key={cat.id}
              className="p-4 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-2xs space-y-3 hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Header: Icon, Name, Slug + 3-Dots Action Dropdown */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                      {getCategoryIcon(cat.category, cat.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-xs sm:text-sm text-foreground leading-tight truncate">
                          {cat.name}
                        </h3>
                        {cat.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        slug: /{cat.slug}
                      </p>
                    </div>
                  </div>

                  {/* All Actions in 3-Dots Menu (Edit, Activate/Deactivate, Delete) */}
                  <ActionDropdown
                    items={[
                      {
                        label: "Edit Category",
                        icon: <Edit className="w-3.5 h-3.5" />,
                        onClick: () => handleOpenEdit(cat),
                      },
                      {
                        label: cat.isActive ? "Deactivate Category" : "Activate Category",
                        icon: cat.isActive ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />,
                        variant: cat.isActive ? ("danger" as const) : ("success" as const),
                        onClick: () => toggleCategoryActive(cat.id),
                      },
                      {
                        label: "Delete Permanently",
                        icon: <Trash2 className="w-3.5 h-3.5" />,
                        variant: "danger" as const,
                        onClick: () => setCatToDelete(cat),
                      },
                    ]}
                  />
                </div>

                {/* Description */}
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {cat.description || "No description provided for this sector category."}
                </p>
              </div>

              {/* Metrics Bar with Compact Typography */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-4 gap-2 text-[10px]">
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Providers</p>
                  <p className="font-extrabold text-xs text-foreground mt-0.5">
                    {provCount}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Listings</p>
                  <p className="font-extrabold text-xs text-foreground mt-0.5">
                    {serviceCount}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Bookings</p>
                  <p className="font-extrabold text-xs text-foreground mt-0.5">
                    {bookingCount > 0 ? bookingCount.toLocaleString() : (cat.totalBookings || 0).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Commission</p>
                  <p className="font-black text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    {cat.commissionRate}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Category Modal (Triggered via 3-dots) */}
      {categoryToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Edit className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h3 className="font-bold text-foreground text-xs sm:text-sm">Edit Category</h3>
                  <p className="text-[10px] text-muted-foreground">
                    Update sector details and commission rate in PostgreSQL
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCategoryToEdit(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {editErrorMessage && (
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-semibold">
                {editErrorMessage}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block font-bold text-foreground text-[11px] mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted/40 border border-slate-200/60 dark:border-slate-800/60 text-foreground font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-foreground text-[11px] mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editSlug}
                    className="w-full h-8 px-2.5 rounded-lg bg-muted/70 border border-slate-200/40 dark:border-slate-800/40 text-muted-foreground font-mono text-[11px] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground text-[11px] mb-1">
                    Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={editCommissionRate}
                    onChange={(e) => setEditCommissionRate(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-lg bg-muted/40 border border-slate-200/60 dark:border-slate-800/60 text-foreground font-bold text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground text-[11px] mb-1">
                  Sector Icon
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: "Ticket", icon: Ticket },
                    { label: "Film", icon: Film },
                    { label: "Bus", icon: Bus },
                    { label: "Trophy", icon: Trophy },
                    { label: "Music", icon: Music },
                    { label: "Landmark", icon: Landmark },
                    { label: "Sparkles", icon: Sparkles },
                    { label: "FolderTree", icon: FolderTree },
                  ].map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setEditIcon(item.label)}
                        className={`p-1.5 rounded-lg border flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                          editIcon === item.label
                            ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold"
                            : "border-slate-200/60 dark:border-slate-800/60 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                        <span className="text-[9px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground text-[11px] mb-1">
                  Category Description
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 rounded-lg bg-muted/40 border border-slate-200/60 dark:border-slate-800/60 text-foreground text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500/40 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setCategoryToEdit(null)}
                  disabled={isUpdating}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-[11px] transition-all shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3" />
                      <span>Save Changes to DB</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Category Modal with Compact Design */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h3 className="font-bold text-foreground text-xs sm:text-sm">Add Platform Category</h3>
                  <p className="text-[10px] text-muted-foreground">
                    Define a new sector category and persist to PostgreSQL
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-semibold">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block font-bold text-foreground text-[11px] mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (!newSlug) {
                      setNewSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)+/g, "")
                      );
                    }
                  }}
                  placeholder="e.g. Festival & Fair, Standup Comedy"
                  className="w-full h-8 px-2.5 rounded-lg bg-muted/40 border border-slate-200/60 dark:border-slate-800/60 text-foreground font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-foreground text-[11px] mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="e.g. festival"
                    className="w-full h-8 px-2.5 rounded-lg bg-muted/40 border border-slate-200/60 dark:border-slate-800/60 text-foreground font-mono font-semibold text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground text-[11px] mb-1">
                    Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={newCommissionRate}
                    onChange={(e) => setNewCommissionRate(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-lg bg-muted/40 border border-slate-200/60 dark:border-slate-800/60 text-foreground font-bold text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground text-[11px] mb-1">
                  Sector Icon
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: "Ticket", icon: Ticket },
                    { label: "Film", icon: Film },
                    { label: "Bus", icon: Bus },
                    { label: "Trophy", icon: Trophy },
                    { label: "Music", icon: Music },
                    { label: "Landmark", icon: Landmark },
                    { label: "Sparkles", icon: Sparkles },
                    { label: "FolderTree", icon: FolderTree },
                  ].map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setNewIcon(item.label)}
                        className={`p-1.5 rounded-lg border flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                          newIcon === item.label
                            ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold"
                            : "border-slate-200/60 dark:border-slate-800/60 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                        <span className="text-[9px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground text-[11px] mb-1">
                  Category Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Overview of services and ticket reservation types..."
                  className="w-full p-2 rounded-lg bg-muted/40 border border-slate-200/60 dark:border-slate-800/60 text-foreground text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500/40 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-[11px] transition-all shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3" />
                      <span>Save Category to DB</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Category Modal */}
      <ConfirmDeleteModal
        isOpen={!!catToDelete}
        itemType="Category Sector"
        itemName={catToDelete ? `${catToDelete.name} (/${catToDelete.slug})` : ""}
        warningMessage="This will permanently delete this category from PostgreSQL database, along with any unassigned sector offerings."
        isDeleting={isDeletingCat}
        onConfirm={async () => {
          if (!catToDelete) return;
          setIsDeletingCat(true);
          try {
            await deleteCategory(catToDelete.id);
            setCatToDelete(null);
          } catch (err) {
            console.error("Failed to delete category:", err);
          } finally {
            setIsDeletingCat(false);
          }
        }}
        onClose={() => {
          if (!isDeletingCat) setCatToDelete(null);
        }}
      />
    </div>
  );
}
