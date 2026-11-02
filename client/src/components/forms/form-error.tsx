"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorProps {
  message?: string | null;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-2.5 rounded-xl bg-rose-50/80 border border-rose-200/90 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300 animate-in fade-in-50 duration-200 shadow-xs",
        className
      )}
    >
      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
      <span className="font-medium text-xs sm:text-sm leading-tight">{message}</span>
    </div>
  );
}

export default FormError;
