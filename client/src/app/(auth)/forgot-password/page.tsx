"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, KeyRound, CheckCircle, Send } from "lucide-react";
import { FormInput } from "@/components/forms/form-input";
import { FormError } from "@/components/forms/form-error";
import { AUTH_ROUTES } from "@/lib/constants";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send reset code. Please verify your email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-black/5 space-y-6">
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
            Account Recovery
          </span>
        </div>
        <h2 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
          Forgot your password?
        </h2>
        <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
          Enter your registered email address and we will dispatch a 6-digit recovery code.
        </p>
      </div>

      {error && <FormError message={error} onDismiss={() => setError(null)} />}

      {isSubmitted ? (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Check Your Inbox</h3>
          <p className="text-xs text-[#64748B] dark:text-slate-300">
            We sent a verification code to <strong className="text-[#0F172A] dark:text-white">{email}</strong>.
          </p>
          <Link
            href={`${AUTH_ROUTES.VERIFY_OTP}?email=${encodeURIComponent(email)}`}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#B45309] text-white text-xs font-bold hover:bg-[#92400E] transition-all shadow-xs"
          >
            Enter 6-Digit OTP Code
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abebe@example.com"
            leftIcon={<Mail className="w-4 h-4 text-[#64748B]" />}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Sending code...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send OTP Recovery Code</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
