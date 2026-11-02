"use client";

import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: FormSelectOption[];
  placeholderOption?: string;
  leftIcon?: React.ReactNode;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholderOption = "Select an option",
      leftIcon,
      id,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1 font-black">*</span>}
          </label>
        )}

        <div className="relative group">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-indigo-600 dark:text-slate-500 dark:group-focus-within:text-indigo-400 transition-colors">
              {leftIcon}
            </div>
          )}

          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "block w-full appearance-none rounded-xl border bg-slate-50/60 px-4 py-2.5 text-sm text-slate-900 transition-all duration-200 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900 dark:focus:bg-slate-900 shadow-xs",
              leftIcon ? "pl-10" : "pl-4",
              "pr-10",
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15 dark:border-rose-600 dark:focus:ring-rose-500/20"
                : "border-slate-200/90 hover:border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/15 dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20",
              className
            )}
            {...props}
          >
            {placeholderOption && (
              <option value="" disabled>
                {placeholderOption}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error ? (
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 animate-in fade-in-50">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
export default FormSelect;
