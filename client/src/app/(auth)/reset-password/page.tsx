"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowLeft, CheckCircle2, ShieldCheck, Check, X, Sparkles } from "lucide-react";
import { FormInput } from "@/components/forms/form-input";
import { FormError } from "@/components/forms/form-error";
import { AUTH_ROUTES } from "@/lib/constants";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useLanguage } from "@/providers/language-provider";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qEmail = searchParams.get("email");
    const qToken = searchParams.get("token");

    if (qEmail) setEmail(qEmail);
    if (qToken) setToken(qToken);

    if (typeof window !== "undefined") {
      if (!qEmail) {
        const storedEmail = sessionStorage.getItem("tikora_reset_email");
        if (storedEmail) setEmail(storedEmail);
      }
      if (!qToken) {
        const storedToken = sessionStorage.getItem("tikora_reset_token");
        if (storedToken) setToken(storedToken);
      }
    }
  }, [searchParams]);

  const passwordChecks = [
    { label: t("auth.pwLength", "At least 8 characters"), met: password.length >= 8 },
    { label: t("auth.pwNumber", "At least 1 number"), met: /\d/.test(password) },
    { label: t("auth.pwUpper", "At least 1 uppercase letter"), met: /[A-Z]/.test(password) },
    { label: t("auth.pwMatch", "Passwords match"), met: password.length > 0 && password === confirmPassword },
  ];

  const allChecksMet = passwordChecks.every((c) => c.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!allChecksMet) {
      setError(t("auth.satisfyRequirements", "Please ensure all password requirements are satisfied."));
      return;
    }

    setLoading(true);

    try {
      const res = await authService.resetPassword({
        email: email || undefined,
        token: token || undefined,
        password,
        confirmPassword,
      });

      // Clear temporary reset storage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("tikora_reset_token");
        sessionStorage.removeItem("tikora_reset_email");
      }

      // Automatically sign in the user
      if (res.user && res.token) {
        setAuth(res.user, res.token);
      }

      setSuccess(true);

      // Redirect into their portal ("password change adrgo ygba")
      setTimeout(() => {
        const role = res.user?.role;
        if (role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (role === "ORGANIZATION") {
          router.push("/provider/dashboard");
        } else if (role === "INSPECTOR") {
          router.push("/inspector/scanner");
        } else {
          router.push("/customer");
        }
      }, 1400);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("auth.failedResetPw", "Failed to reset password. Please request a new verification code."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[410px] sm:max-w-[500px] mx-auto rounded-3xl backdrop-blur-2xl bg-white/90 dark:bg-[#161922]/85 border border-slate-200/90 dark:border-white/10 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] space-y-5 relative overflow-hidden transition-colors duration-200">
      {/* Specular sheen line */}
      <div className="absolute -inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

      {/* Header */}
      <div>
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] dark:text-amber-300 hover:text-[#F59E0B] mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("auth.backToSignIn", "Back to Sign In")}</span>
        </Link>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-[#FFFBEB] dark:bg-amber-950/80 text-[#F59E0B] dark:text-amber-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#F59E0B] dark:text-amber-400">
            {t("auth.securityUpdate", "Security Update")}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
          {t("auth.setNewPassword", "Set New Password")}
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-neutral-400 mt-1">
          {t("auth.enterNewPasswordSub", "Choose a secure password. You will be automatically logged in after saving.")}
        </p>
      </div>

      <FormError message={error} onDismiss={() => setError(null)} />

      {success ? (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 p-5 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-bold">{t("auth.passwordChangedSuccess", "Password updated successfully!")}</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              {t("auth.autoLoggedInRedirect", "You are now logged in. Redirecting to your dashboard...")}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label={t("auth.newPasswordLabel", "New Password")}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4 text-[#64748B]" />}
          />

          <FormInput
            label={t("auth.confirmPasswordLabel", "Confirm New Password")}
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4 text-[#64748B]" />}
          />

          {/* Password Requirements Checklist */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-neutral-900/60 border border-[#E2E8F0] dark:border-slate-800/80 space-y-2 text-xs">
            <span className="font-semibold text-[#0F172A] dark:text-neutral-300">
              {t("auth.checklistTitle", "Password Checklist:")}
            </span>
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
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 px-5 py-3 text-sm font-bold shadow-sm active:scale-[0.99] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t("auth.updatingPassword", "Updating & logging in...")}</span>
              </span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{t("auth.saveAndLoginBtn", "Update Password & Log In")}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-slate-500">
          Loading password reset...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
