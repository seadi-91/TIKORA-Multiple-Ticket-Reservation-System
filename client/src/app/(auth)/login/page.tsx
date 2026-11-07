"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { GoogleIcon } from "@/components/ui/google-icon";
import { GithubIcon } from "@/components/ui/github-icon";
import { FormInput } from "@/components/forms/form-input";
import { FormError } from "@/components/forms/form-error";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { AUTH_ROUTES } from "@/lib/constants";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const navigateToRolePortal = (userRole: string, status?: string) => {
    if (userRole === "ORGANIZATION" && (status === "PENDING_APPROVAL" || status === "INACTIVE")) {
      router.push("/pending-approval");
      return;
    }

    const redirectParam = searchParams.get("redirect");
    if (redirectParam && redirectParam.startsWith("/")) {
      router.push(redirectParam);
      return;
    }

    if (userRole === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (userRole === "ORGANIZATION") {
      router.push("/provider/dashboard");
    } else if (userRole === "INSPECTOR") {
      router.push("/inspector/scanner");
    } else {
      router.push("/customer");
    }
  };

  // Detect OAuth Token or Error in URL parameters
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "AccountNotRegistered") {
        setError("Account not found. This Google or GitHub account is not registered. Please register first.");
      } else if (errorParam === "AccountDeactivated") {
        setError("Your account has been deactivated. Please contact support.");
      } else if (errorParam === "GoogleAuthFailed") {
        setError("Google sign-in was cancelled or encountered an error.");
      } else if (errorParam === "GitHubAuthFailed") {
        setError("GitHub sign-in was cancelled or encountered an error.");
      } else {
        setError(decodeURIComponent(errorParam));
      }
      return;
    }

    const token = searchParams.get("token");
    if (token) {
      setLoading(true);
      setError(null);
      authService
        .getMe(token)
        .then((res) => {
          setAuth(res.user, token);
          setIsSuccess(true);
          const isPending =
            res.user.role === "ORGANIZATION" &&
            (res.user.status === "PENDING_APPROVAL" || res.user.status === "INACTIVE");
          setSuccessMessage(
            isPending
              ? "Account Under Review! Redirecting to application status..."
              : "Login Successful! Redirecting to your dashboard..."
          );
          setTimeout(() => {
            navigateToRolePortal(res.user.role, res.user.status);
          }, 1100);
        })
        .catch((err) => {
          setError(err?.message || "Failed to finalize session.");
          setLoading(false);
        });
    }
  }, [searchParams, router, setAuth]);

  const handleGoogleAuth = () => {
    setError(null);
    setSuccessMessage(null);
    setGoogleLoading(true);
    window.location.href = authService.getOAuthUrl("google", "login");
  };

  const handleGithubAuth = () => {
    setError(null);
    setSuccessMessage(null);
    setGithubLoading(true);
    window.location.href = authService.getOAuthUrl("github", "login");
  };

  // Handle single unified login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await authService.login({
        email: email.trim(),
        password,
        rememberMe,
      });

      // Update auth store with user & JWT token
      setAuth(res.user, res.token);
      setIsSuccess(true);
      const isPending =
        res.user.role === "ORGANIZATION" &&
        (res.user.status === "PENDING_APPROVAL" || res.user.status === "INACTIVE");
      setSuccessMessage(
        isPending
          ? "Account Under Review! Redirecting to application status..."
          : "Login Successful! Redirecting to your dashboard..."
      );

      setTimeout(() => {
        navigateToRolePortal(res.user.role, res.user.status);
      }, 1100);
    } catch (err: any) {
      setError(err?.message || "Failed to sign in. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl backdrop-blur-2xl bg-white/85 dark:bg-[#161922]/85 border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.1)] space-y-6 relative overflow-hidden transition-colors duration-200">
      {/* Subtle specular line */}
      <div className="absolute -inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/80 dark:via-white/20 to-transparent pointer-events-none" />

      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>Unified Access</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Sign In to TIKORA
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Access your digital ticket wallet, bookings, or operator portal.
        </p>
      </div>

      {error && (
        <div className="space-y-2">
          <FormError message={error} onDismiss={() => setError(null)} />
          {(error.includes("not registered") || searchParams.get("error") === "AccountNotRegistered") && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2">
              <span>Don&apos;t have an account yet?</span>
              <Link
                href="/register?type=customer"
                className="font-bold underline text-amber-900 dark:text-amber-200 hover:opacity-80 shrink-0"
              >
                Register Now &rarr;
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Continue with Google & GitHub */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading || githubLoading || loading}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white hover:bg-slate-50 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-2xs active:scale-[0.99] cursor-pointer disabled:opacity-60"
        >
          {googleLoading ? (
            <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon className="w-4 h-4 shrink-0" />
          )}
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={handleGithubAuth}
          disabled={googleLoading || githubLoading || loading}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white hover:bg-slate-50 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-2xs active:scale-[0.99] cursor-pointer disabled:opacity-60"
        >
          {githubLoading ? (
            <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <GithubIcon className="w-4 h-4 shrink-0 text-slate-900 dark:text-white" />
          )}
          <span>Continue with GitHub</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200/80 dark:border-white/10" />
          <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            Or with email
          </span>
          <div className="flex-grow border-t border-slate-200/80 dark:border-white/10" />
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
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
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            autoComplete="current-password"
            required
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 dark:text-slate-100 focus:ring-slate-900 dark:focus:ring-white border-slate-300 dark:border-slate-700"
              />
              <span>Remember me</span>
            </label>

            <Link
              href={AUTH_ROUTES.FORGOT_PASSWORD}
              className="font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || isSuccess}
          className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75 cursor-pointer ${
            isSuccess
              ? "bg-emerald-600 hover:bg-emerald-600 text-white shadow-emerald-500/20"
              : "bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          }`}
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
              <span>Login Successful!</span>
            </>
          ) : loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-slate-950/30 dark:border-t-slate-950 rounded-full animate-spin" />
              <span>Verifying credentials...</span>
            </span>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </>
          )}
        </button>

        {/* Success Feedback Alert right at the bottom of the login form */}
        {successMessage && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 p-3.5 text-emerald-800 dark:text-emerald-200 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm text-emerald-900 dark:text-emerald-100">
                Login Successful!
              </span>
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 truncate">
                Welcome back! Redirecting to your dashboard...
              </span>
            </div>
          </div>
        )}
      </form>

      {/* Footer Register Link */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
        <span>Don&apos;t have an account yet? </span>
        <Link
          href={AUTH_ROUTES.REGISTER_CUSTOMER}
          className="font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 hover:underline"
        >
          Create Customer Account
        </Link>
      </div>
    </div>
  );
}

export default function UnifiedLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl backdrop-blur-2xl bg-white/85 dark:bg-[#161922]/85 border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 flex items-center justify-center min-h-[300px]">
          <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
