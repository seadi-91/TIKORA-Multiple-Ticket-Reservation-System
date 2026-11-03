"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  UserCheck,
  Building2,
  Shield,
  QrCode,
  Sparkles,
} from "lucide-react";
import { FormInput } from "@/components/forms/form-input";
import { FormError } from "@/components/forms/form-error";
import { useAuthStore } from "@/stores/auth.store";
import { AUTH_ROUTES } from "@/lib/constants";

export default function UnifiedLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle single unified login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const normalizedEmail = email.toLowerCase().trim();
      let role: "CUSTOMER" | "ORGANIZATION" | "INSPECTOR" | "ADMIN" = "CUSTOMER";
      let name = "Abebe Bekele";
      let redirectPath = "/customer";

      if (normalizedEmail.includes("admin")) {
        role = "ADMIN";
        name = "System Administrator";
        redirectPath = "/admin/dashboard";
      } else if (
        normalizedEmail.includes("org") ||
        normalizedEmail.includes("cinema") ||
        normalizedEmail.includes("bus") ||
        normalizedEmail.includes("provider")
      ) {
        role = "ORGANIZATION";
        name = "Selam Bus Operations";
        redirectPath = "/provider/dashboard";
      } else if (normalizedEmail.includes("inspector") || normalizedEmail.includes("scanner")) {
        role = "INSPECTOR";
        name = "Station Gate Officer";
        redirectPath = "/inspector/scanner";
      } else {
        role = "CUSTOMER";
        name = "Abebe Bekele";
        redirectPath = "/customer";
      }

      setAuth(
        {
          id: `usr-${Date.now()}`,
          name,
          email: normalizedEmail,
          role,
          status: "ACTIVE",
          emailVerified: true,
          createdAt: new Date().toISOString(),
        },
        "mock-jwt-token-tikora"
      );

      router.push(redirectPath);
    } catch (err: any) {
      setError(err?.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPreset = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword("DemoPassword123!");
    setError(null);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-black/5 space-y-6">
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="text-2xl font-black tracking-tight text-[#0F172A] dark:text-white">
          Sign In to TIKORA
        </h2>
        <p className="text-xs text-[#64748B] dark:text-slate-400">
          Access your digital ticket wallet, bookings, or operator portal.
        </p>
      </div>

      {error && <FormError message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleLogin} className="space-y-4">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          leftIcon={<Mail className="w-4 h-4 text-[#64748B]" />}
          autoComplete="email"
          required
        />

        <div className="space-y-1">
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4 text-[#64748B]" />}
            autoComplete="current-password"
            required
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#64748B] dark:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#B45309] focus:ring-[#B45309]"
              />
              <span>Remember me</span>
            </label>

            <Link
              href={AUTH_ROUTES.FORGOT_PASSWORD}
              className="font-bold text-[#B45309] dark:text-[#D97706] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying credentials...</span>
            </span>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In to Customer Hub</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </>
          )}
        </button>
      </form>

      {/* 1-Click Demo autofill presets */}
      <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] dark:text-slate-400 uppercase">
          <span>Quick 1-Click Demo Login</span>
          <Sparkles className="w-3.5 h-3.5 text-[#B45309] dark:text-[#D97706]" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoPreset("abebe.customer@tikora.et")}
            className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0F1117] border border-[#E2E8F0] dark:border-slate-800 text-left hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-[#B45309] dark:text-[#D97706] shrink-0" />
            <div className="truncate">
              <span className="block text-[11px] font-bold text-[#0F172A] dark:text-white">Customer</span>
              <span className="block text-[9px] text-[#64748B] truncate">abebe.customer</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleDemoPreset("selam.bus@tikora.et")}
            className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0F1117] border border-[#E2E8F0] dark:border-slate-800 text-left hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="truncate">
              <span className="block text-[11px] font-bold text-[#0F172A] dark:text-white">Provider</span>
              <span className="block text-[9px] text-[#64748B] truncate">selam.bus</span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Register Link */}
      <div className="text-center text-xs text-[#64748B] dark:text-slate-400 pt-1">
        <span>Don&apos;t have an account yet? </span>
        <Link
          href={AUTH_ROUTES.REGISTER_CUSTOMER}
          className="font-bold text-[#B45309] dark:text-[#D97706] hover:underline"
        >
          Create Customer Account
        </Link>
      </div>
    </div>
  );
}
