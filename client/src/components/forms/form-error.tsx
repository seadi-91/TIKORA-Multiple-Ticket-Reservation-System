"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorProps {
  message?: string | null;
  className?: string;
  onDismiss?: () => void;
}

export function FormError({ message, className, onDismiss }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center justify-between gap-2.5 rounded-xl bg-rose-50/80 border border-rose-200/90 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300 animate-in fade-in-50 duration-200 shadow-xs",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
        <span className="font-medium text-xs sm:text-sm leading-tight">{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-rose-200/50 dark:hover:bg-rose-900/50 text-rose-500 hover:text-rose-700 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default FormError;
