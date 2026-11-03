"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft, CheckCircle2, ShieldCheck, Check, X } from "lucide-react";
import { FormInput } from "@/components/forms/form-input";
import { FormError } from "@/components/forms/form-error";
import { AUTH_ROUTES } from "@/lib/constants";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "At least 1 number", met: /\d/.test(password) },
    { label: "At least 1 uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Passwords match", met: password.length > 0 && password === confirmPassword },
  ];

  const allChecksMet = passwordChecks.every((c) => c.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!allChecksMet) {
      setError("Please ensure all password requirements are satisfied.");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
      setTimeout(() => {
        router.push(AUTH_ROUTES.LOGIN);
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-black/5 space-y-6">
      {/* Header */}
      <div>
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] dark:text-amber-300 hover:text-[#F59E0B] mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-[#FFFBEB] dark:bg-amber-950/80 text-[#F59E0B] dark:text-amber-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#F59E0B] dark:text-amber-400">
            Security Update
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
          Set New Password
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-neutral-400 mt-1">
          Your new password must be secure and at least 8 characters long.
        </p>
      </div>

      <FormError message={error} onDismiss={() => setError(null)} />

      {success ? (
        <div className="rounded-2xl bg-emerald-50 dark:bg-amber-950/60 border border-amber-200 dark:border-slate-700 p-5 text-emerald-800 dark:text-amber-300 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#F59E0B] dark:text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-bold">Password updated successfully!</p>
            <p className="text-xs text-emerald-700 dark:text-amber-400">Redirecting to login portal...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4 text-[#64748B]" />}
          />

          <FormInput
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4 text-[#64748B]" />}
          />

          {/* Password Requirements Checklist */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-neutral-900/60 border border-[#E2E8F0] dark:border-slate-800/80 space-y-2 text-xs">
            <span className="font-semibold text-[#0F172A] dark:text-neutral-300">Password Checklist:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {passwordChecks.map((check, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 ${
                    check.met
                      ? "text-emerald-600 dark:text-amber-400 font-medium"
                      : "text-[#64748B] dark:text-neutral-500"
                  }`}
                >
                  {check.met ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-amber-400 shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  )}
                  <span>{check.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !allChecksMet}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Save New Password</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
