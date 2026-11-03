import React from "react";
import Link from "next/link";
import { LucideIcon, Search } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  actionLabel,
  actionHref,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-[#E2E8F0] dark:border-slate-800 bg-white/50 dark:bg-[#0C0E14]/50 my-6">
      <div className="w-14 h-14 rounded-2xl bg-[#FFFBEB] dark:bg-amber-950/60 text-[#F59E0B] dark:text-amber-400 flex items-center justify-center mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-1.5">{title}</h3>
      <p className="text-sm text-[#64748B] dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-sm font-semibold transition-all shadow-md shadow-amber-500/10 active:scale-95"
        >
          {actionLabel}
        </Link>
      )}

      {actionLabel && onActionClick && !actionHref && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-sm font-semibold transition-all shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;

