import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageContainerProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function PageContainer({
  title,
  subtitle,
  breadcrumbs,
  action,
  children,
}: PageContainerProps) {
  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs */}
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-xs text-[#64748B] dark:text-slate-400 mb-2">
            <Link href="/" className="hover:text-[#F59E0B] transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-[#F59E0B] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-[#0F172A] dark:text-white">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
}

export default PageContainer;

