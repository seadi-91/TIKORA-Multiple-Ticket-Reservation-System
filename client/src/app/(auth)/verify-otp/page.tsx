"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft, RefreshCw, KeyRound, CheckCircle2 } from "lucide-react";
import { FormError } from "@/components/forms/form-error";
import { AUTH_ROUTES } from "@/lib/constants";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

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

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setError(null);
    setResendSuccess(true);
    setTimeout(() => setResendSuccess(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push(AUTH_ROUTES.RESET_PASSWORD);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid verification code. Please check and try again.");
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] dark:text-slate-400 hover:text-[#B45309] mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#B45309] dark:text-[#D97706]">
            Security Verification
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
          Enter 6-Digit Code
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-neutral-400 mt-1">
          We sent a verification code to your email. Enter it below to proceed to password reset.
        </p>
      </div>

      <FormError message={error} onDismiss={() => setError(null)} />

      {resendSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>A fresh verification code has been dispatched to your email!</span>
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
              className="font-bold text-[#B45309] dark:text-[#D97706] hover:text-[#92400E] inline-flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Resend code
            </button>
          ) : (
            <span>
              Resend code in <strong className="text-[#B45309] dark:text-[#D97706] font-bold">{timer}s</strong>
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join("").length < 6}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] px-5 py-3.5 text-sm font-bold text-white shadow-xs active:scale-[0.99] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Continue</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
