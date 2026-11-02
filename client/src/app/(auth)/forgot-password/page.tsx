"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, KeyRound, CheckCircle, Send, RefreshCw } from "lucide-react";
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
        setError("Failed to send reset link. Please verify your email and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
            Account Recovery
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Forgot Password?
        </h2>
        <p className="text-sm text-slate-400">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl shadow-indigo-950/40 p-6 sm:p-9 space-y-6">
        <FormError message={error} />

        {isSubmitted ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Check your inbox
              </h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                We sent a password recovery link to{" "}
                <span className="font-semibold text-indigo-300">{email}</span>.
                Follow the instructions to set your new password.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resend Email
              </button>

              <Link
                href={AUTH_ROUTES.LOGIN}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-xs font-bold text-white hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-600/30 transition-all"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Registered Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
              helperText="We will send a secure password reset link to this address."
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Redirect to Login */}
      <div className="text-center text-sm text-slate-400">
        Remembered your password?{" "}
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
