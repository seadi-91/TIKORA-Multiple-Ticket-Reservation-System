"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  itemName: string;
  itemType?: string;
  warningMessage?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  itemName,
  itemType = "Item",
  warningMessage,
  isDeleting = false,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-card border border-rose-500/20 dark:border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20 mt-0.5">
            <Trash2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 pr-6">
            <h3 className="text-base font-bold text-foreground leading-tight">
              {title || `Delete ${itemType} Permanently?`}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground font-bold font-mono">
                &ldquo;{itemName}&rdquo;
              </strong>
              ?
            </p>
          </div>
        </div>

        {/* Warning Box */}
        <div className="p-3.5 rounded-2xl bg-rose-500/[0.06] border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-bold">This action cannot be undone.</p>
            <p className="text-[11px] opacity-90 mt-0.5">
              {warningMessage ||
                "This will permanently erase this record, all associated tickets, bookings, and permissions from the database."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs transition-all shadow-sm hover:shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting Permanently...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

