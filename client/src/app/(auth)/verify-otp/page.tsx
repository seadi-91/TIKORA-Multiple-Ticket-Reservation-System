"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowLeft, RefreshCw, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { FormError } from "@/components/forms/form-error";
import { AUTH_ROUTES } from "@/lib/constants";
import { authService } from "@/services/auth.service";
import { useLanguage } from "@/providers/language-provider";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const emailParam = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (emailParam && !email) {
      setEmail(emailParam);
    }
  }, [emailParam, email]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtp(digits);
      const lastInput = document.getElementById(`otp-5`);
      lastInput?.focus();
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError(t("auth.enterEmailToResend", "Email address is missing. Please go back to forgot password."));
      return;
    }

    setResending(true);
    setError(null);

    try {
      await authService.forgotPassword({ email });
      setTimer(60);
      setCanResend(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      setError(err?.message || "Failed to resend verification code.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (!email) {
      setError(t("auth.enterEmail", "Please provide the email address used for reset."));
      return;
    }

    if (code.length < 6) {
      setError(t("auth.enterCompleteCode", "Please enter the complete 6-digit verification code."));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authService.verifyOtp({ email: email.trim(), otp: code });
      
      // Store temporary reset token in sessionStorage for extra reliability
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tikora_reset_token", res.resetToken);
        sessionStorage.setItem("tikora_reset_email", email.trim());
      }

      // Navigate to reset-password with email and token
      router.push(
        `${AUTH_ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(email.trim())}&token=${encodeURIComponent(res.resetToken)}`
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("auth.invalidVerificationCode", "Invalid verification code. Please check and try again."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[410px] sm:max-w-[490px] mx-auto rounded-3xl backdrop-blur-2xl bg-white/90 dark:bg-[#161922]/85 border border-slate-200/90 dark:border-white/10 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] space-y-5 relative overflow-hidden transition-colors duration-200">
      {/* Specular sheen line */}
      <div className="absolute -inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

      {/* Header */}
      <div>
        <Link
          href={AUTH_ROUTES.FORGOT_PASSWORD}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] dark:text-slate-400 hover:text-[#B45309] dark:hover:text-amber-400 mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("auth.backToEmail", "Change Email")}</span>
        </Link>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#B45309] dark:text-[#D97706]">
            {t("auth.securityVerification", "Security Verification")}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
          {t("auth.enterOtpTitle", "Enter 6-Digit Code")}
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-neutral-400 mt-1">
          {email ? (
            <>
              {t("auth.codeSentTo", "We dispatched a 6-digit verification code from")}{" "}
              <strong className="text-amber-700 dark:text-amber-400 font-semibold">TIKORA Security</strong>{" "}
              {t("auth.toEmail", "to")}{" "}
              <strong className="text-slate-900 dark:text-white font-semibold">{email}</strong>.{" "}
              {t("auth.checkInboxSub", "Please check your inbox.")}
            </>
          ) : (
            t("auth.enterCodeSub", "Enter the 6-digit verification code sent to your registered email.")
          )}
        </p>
      </div>

      <FormError message={error} onDismiss={() => setError(null)} />

      {resendSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t("auth.resendSuccess", "A fresh verification code has been dispatched to your email from TIKORA Security!")}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2 sm:gap-3 max-w-sm mx-auto">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className="w-12 h-14 sm:w-13 sm:h-15 text-center text-2xl font-bold rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-neutral-900/80 text-[#0F172A] dark:text-white focus:border-[#B45309] dark:focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-[#B45309]/20 transition-all shadow-xs"
              autoFocus={idx === 0}
            />
          ))}
        </div>

        <div className="text-center text-xs text-[#64748B] dark:text-neutral-400">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-bold text-[#B45309] dark:text-[#D97706] hover:text-[#92400E] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
              <span>{resending ? t("auth.resending", "Sending...") : t("auth.resendCode", "Resend code")}</span>
            </button>
          ) : (
            <span>
              {t("auth.resendIn", "Resend code in")}{" "}
              <strong className="text-[#B45309] dark:text-[#D97706] font-bold">{timer}s</strong>
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join("").length < 6}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 px-5 py-3 text-sm font-bold shadow-sm active:scale-[0.99] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
              <span>{t("auth.verifyingCode", "Checking OTP Code...")}</span>
            </span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>{t("auth.verifyAndContinue", "Verify Code & Continue")}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-slate-500">
          Loading verification...
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
