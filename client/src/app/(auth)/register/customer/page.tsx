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
import { useAuthStore } from "@/stores/auth.store";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

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
      setError("Please agree to the TIKORA Terms of Service.");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setAuth(
        {
          id: `cust-${Date.now()}`,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: "CUSTOMER",
          status: "ACTIVE",
          emailVerified: true,
          createdAt: new Date().toISOString(),
        },
        "mock-jwt-token-tikora"
      );

      setSuccess(true);
      setTimeout(() => {
        router.push("/customer");
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-black/5 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] dark:text-slate-400 hover:text-[#B45309]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          Customer Account
        </span>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight text-[#0F172A] dark:text-white">
          Create Your TIKORA Account
        </h2>
        <p className="text-xs text-[#64748B] dark:text-slate-400">
          Book bus seats, cinema premieres, and festival passes with digital QR delivery.
        </p>
      </div>

      {error && <FormError message={error} onDismiss={() => setError(null)} />}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Account created successfully! Redirecting to your customer dashboard...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Full Legal Name"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="Abebe Bekele"
          leftIcon={<User className="w-4 h-4 text-[#64748B]" />}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="abebe@example.com"
            leftIcon={<Mail className="w-4 h-4 text-[#64748B]" />}
            required
          />

          <FormInput
            label="Mobile Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+251 91 123 4567"
            leftIcon={<Phone className="w-4 h-4 text-[#64748B]" />}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4 text-[#64748B]" />}
            required
          />

          <FormInput
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4 text-[#64748B]" />}
            required
          />
        </div>

        {/* Live Password Checklist */}
        <div className="p-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F1117] border border-[#E2E8F0] dark:border-slate-800 space-y-1.5 text-[11px]">
          <span className="block font-bold text-[#64748B] dark:text-slate-400 text-[10px] uppercase">
            Security Checklist:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>8+ Characters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasUpperCase ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Uppercase letter</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>One number</span>
            </div>
            <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Passwords match</span>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-[#64748B] dark:text-slate-300 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
            className="w-4 h-4 rounded text-[#B45309] focus:ring-[#B45309] mt-0.5"
            required
          />
          <span>
            I agree to the TIKORA{" "}
            <Link href="/contact" className="text-[#B45309] dark:text-[#D97706] font-bold underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/contact" className="text-[#B45309] dark:text-[#D97706] font-bold underline">
              Privacy Policy
            </Link>.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3 px-4 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <span>Creating account...</span>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Complete Customer Registration</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-[#64748B] dark:text-slate-400 pt-1">
        <span>Already have an account? </span>
        <Link href={AUTH_ROUTES.LOGIN} className="font-bold text-[#B45309] dark:text-[#D97706] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
