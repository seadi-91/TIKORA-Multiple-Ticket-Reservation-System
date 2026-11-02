"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  Check,
  UserPlus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FormInput } from "@/components/forms/form-input";
import { FormError } from "@/components/forms/form-error";
import { AUTH_ROUTES } from "@/lib/constants";

export default function CustomerRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live password requirements
  const hasMinLength = formData.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!hasMinLength || !hasUpperCase || !hasNumber) {
      setError("Please meet all password strength requirements.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must accept the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccess(true);
      setTimeout(() => {
        router.push(AUTH_ROUTES.LOGIN);
      }, 1400);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create customer account. Please try again.");
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
          href={AUTH_ROUTES.REGISTER}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Account Types
        </Link>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
            Customer Profile
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Create Your Account
        </h2>
        <p className="text-sm text-slate-400">
          Book buses, cinema seats, concerts, and stadium sports in one wallet.
        </p>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl shadow-indigo-950/40 p-6 sm:p-9 space-y-6">
        <FormError message={error} />

        {success && (
          <div className="rounded-2xl bg-emerald-950/50 border border-emerald-500/40 p-4 text-emerald-300 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-bold">Account created successfully!</p>
              <p className="text-xs text-emerald-400">Redirecting to login portal...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            placeholder="Abebe Kebede"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            autoComplete="name"
            leftIcon={<User className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <FormInput
              label="Phone Number"
              type="tel"
              placeholder="+251 91 234 5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              autoComplete="tel"
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="new-password"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              autoComplete="new-password"
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>

          {/* Live Password Checklist */}
          {formData.password.length > 0 && (
            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-2 text-xs text-slate-400">
              <p className="font-bold text-slate-300">Password Checklist:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400 font-semibold" : ""}`}>
                  <Check className={`w-3.5 h-3.5 ${hasMinLength ? "opacity-100" : "opacity-30"}`} />
                  8+ characters
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpperCase ? "text-emerald-400 font-semibold" : ""}`}>
                  <Check className={`w-3.5 h-3.5 ${hasUpperCase ? "opacity-100" : "opacity-30"}`} />
                  One uppercase letter
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-400 font-semibold" : ""}`}>
                  <Check className={`w-3.5 h-3.5 ${hasNumber ? "opacity-100" : "opacity-30"}`} />
                  One number (0-9)
                </div>
                <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-emerald-400 font-semibold" : ""}`}>
                  <Check className={`w-3.5 h-3.5 ${passwordsMatch ? "opacity-100" : "opacity-30"}`} />
                  Passwords match
                </div>
              </div>
            </div>
          )}

          {/* Terms Agreement */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded-md border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-400 leading-relaxed">
                I agree to the{" "}
                <a href="#terms" className="font-semibold text-indigo-400 underline hover:text-indigo-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#privacy" className="font-semibold text-indigo-400 underline hover:text-indigo-300">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Customer Account</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secured with end-to-end TLS encryption</span>
        </div>
      </div>

      {/* Redirect to Login */}
      <div className="text-center text-sm text-slate-400">
        Already have a Tikora account?{" "}
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
