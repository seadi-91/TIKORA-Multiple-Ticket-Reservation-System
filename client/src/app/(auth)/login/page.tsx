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
      // Simulate authentication API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const normalizedEmail = email.toLowerCase().trim();
      let role: "CUSTOMER" | "ORGANIZATION" | "INSPECTOR" | "ADMIN" = "CUSTOMER";
      let name = "Tikora Member";
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
        name = "Partner Organization";
        redirectPath = "/provider/dashboard";
      } else if (
        normalizedEmail.includes("inspector") ||
        normalizedEmail.includes("scanner") ||
        normalizedEmail.includes("staff")
      ) {
        role = "INSPECTOR";
        name = "Ticket Inspector";
        redirectPath = "/inspector/scanner";
      }

      setAuth(
        {
          id: `usr_${Date.now()}`,
          email: normalizedEmail,
          name,
          role,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        },
        "tikora_jwt_session_token"
      );

      router.push(redirectPath);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Tikora@2026");
    setError(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Title & Introduction */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Single Unified Sign In</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-slate-400">
          Sign in to access your tickets, route fleets, or administrative dashboard.
        </p>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl shadow-indigo-950/40 p-6 sm:p-9 space-y-6">
        <FormError message={error} />

        <form onSubmit={handleLogin} className="space-y-4">
          <FormInput
            label="Email or Phone Number"
            type="email"
            placeholder="name@tikora.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <FormInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-md border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 transition-colors"
              />
              <span className="text-slate-300 font-medium">Keep me signed in</span>
            </label>

            <Link
              href={AUTH_ROUTES.FORGOT_PASSWORD}
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Sign In</span>
                </>
              )}
            </div>
          </button>
        </form>

        {/* Unified Demo Account Selector (Click to auto-fill) */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Instant Demo Sign-in</span>
            <span className="text-indigo-400 font-semibold lowercase">click any chip</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo("customer@tikora.com")}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("cinema.partner@tikora.com")}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-white hover:border-purple-500/50 transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Provider</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("inspector@tikora.com")}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-white hover:border-emerald-500/50 transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspector</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("admin@tikora.com")}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-white hover:border-rose-500/50 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Redirect to Register */}
      <div className="text-center text-sm text-slate-400">
        New to Tikora?{" "}
        <Link
          href={AUTH_ROUTES.REGISTER}
          className="font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
        >
          Create an account
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
