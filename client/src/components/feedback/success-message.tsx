import React from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessMessageProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SuccessMessage({ title, message, actionLabel, onAction }: SuccessMessageProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 dark:border-slate-700/60 bg-[#FFFBEB] dark:bg-amber-950/30 text-[#0F172A] dark:text-slate-200">
      <CheckCircle2 className="w-5 h-5 text-[#F59E0B] dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-bold text-[#D97706] dark:text-amber-300">{title}</h4>
        <p className="text-xs text-[#F59E0B] dark:text-amber-300/80 mt-0.5">{message}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-bold text-[#F59E0B] dark:text-amber-400 hover:underline cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default SuccessMessage;

