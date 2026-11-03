"use client";

import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightAction,
      type = "text",
      id,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === "password";
    const inputType = isPasswordField ? (showPassword ? "text" : "password") : type;

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1 font-black">*</span>}
          </label>
        )}

        <div className="relative group">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-amber-600 dark:text-slate-500 dark:group-focus-within:text-indigo-400 transition-colors">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={cn(
              "block w-full rounded-xl border bg-slate-50/60 px-4 py-2.5 text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-400 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:bg-slate-900 dark:focus:bg-slate-900 shadow-xs",
              leftIcon ? "pl-10" : "pl-4",
              isPasswordField || rightAction ? "pr-11" : "pr-4",
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15 dark:border-rose-600 dark:focus:ring-rose-500/20"
                : "border-slate-200/90 hover:border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/15 dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-amber-500 dark:focus:ring-amber-500/20",
              className
            )}
            {...props}
          />

          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}

          {!isPasswordField && rightAction && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightAction}
            </div>
          )}
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

FormInput.displayName = "FormInput";
export default FormInput;
