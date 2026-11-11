"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, KeyRound, CheckCircle, Send, AlertCircle, ArrowRight } from "lucide-react";
import { FormInput } from "@/components/forms/form-input";
import { FormError } from "@/components/forms/form-error";
import { AUTH_ROUTES } from "@/lib/constants";
import { authService } from "@/services/auth.service";
import { useLanguage } from "@/providers/language-provider";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError(t("auth.enterEmail", "Please enter your registered email address."));
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword({ email: cleanEmail });
      setIsSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("auth.failedResetCode", "Failed to send reset code. Please check your email."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[410px] sm:max-w-[490px] mx-auto rounded-3xl backdrop-blur-2xl bg-white/90 dark:bg-[#161922]/85 border border-slate-200/90 dark:border-white/10 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] space-y-5 relative overflow-hidden transition-colors duration-200">
      {/* Specular sheen line */}
      <div className="absolute -inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />
      <div>
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] dark:text-slate-400 hover:text-[#B45309] dark:hover:text-amber-400 mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("auth.backToSignIn", "Back to Sign In")}</span>
        </Link>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#B45309] dark:text-[#D97706]">
            {t("auth.accountRecovery", "Account Recovery")}
          </span>
        </div>
        <h2 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
          {t("auth.forgotPasswordTitle", "Forgot your password?")}
        </h2>
        <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
          {t(
            "auth.forgotPasswordSubtitle",
            "Enter your registered email address and we will verify it in our database and dispatch a 6-digit recovery OTP code."
          )}
        </p>
      </div>

      {error && (
        <div className="space-y-3">
          <FormError message={error} onDismiss={() => setError(null)} />
          {error.toLowerCase().includes("not found") && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2">
              <span>{t("auth.noAccount", "Don't have an account yet?")}</span>
              <Link
                href="/register?type=customer"
                className="font-bold underline text-amber-900 dark:text-amber-200 hover:opacity-80 shrink-0"
              >
                {t("auth.createAccount", "Register Now")}
              </Link>
            </div>
          )}
        </div>
      )}

      {isSubmitted ? (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
              {t("auth.checkInbox", "Verification Code Dispatched!")}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-300 mt-1">
              A 6-digit verification code has been dispatched via email from{" "}
              <strong className="text-amber-700 dark:text-amber-400">TIKORA Security</strong> to{" "}
              <strong className="text-[#0F172A] dark:text-white">{email}</strong>. Please check your inbox or spam folder.
            </p>
          </div>

          <div className="pt-1">
            <Link
              href={`${AUTH_ROUTES.VERIFY_OTP}?email=${encodeURIComponent(email)}`}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-bold transition-all shadow-sm"
            >
              <span>{t("auth.enterOtpCode", "Enter 6-Digit OTP Code")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label={t("auth.emailLabel", "Email Address")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abebe@example.com"
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
                <span>{t("auth.checkingEmail", "Verifying email & sending code...")}</span>
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t("auth.sendOtpBtn", "Verify Email & Send 6-Digit OTP")}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
