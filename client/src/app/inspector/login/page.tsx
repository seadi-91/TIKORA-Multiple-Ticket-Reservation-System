"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  QrCode,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export default function InspectorLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage("Please enter your officer credentials.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Authenticate as Inspector
      setAuth(
        {
          id: "stf-1",
          name: "Solomon Abebe",
          email: identifier.includes("@") ? identifier : "solomon.a@selambus.et",
          role: "INSPECTOR",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        },
        "mock-inspector-jwt-token"
      );

      toast.success("Inspector session authenticated. Loading gate posts...");
      router.push("/inspector/scanner");
    }, 600);
  };

  const handleAutofillDemo = () => {
    setIdentifier("solomon.a@selambus.et");
    setPassword("Inspector2026!");
    toast.info("Demo credentials filled.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md space-y-6">
        {/* Branding & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-bold flex items-center justify-center mx-auto shadow-lg shadow-amber-600/30">
            <QrCode className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            TIKORA Inspector Portal
          </h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Authorized gate verification console for staff registered by approved providers.
          </p>
        </div>

        {/* Security Rule Callout */}
        <div className="bg-amber-500/10 border border-amber-600/30 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Restricted Access:</strong> Public registration is prohibited. You must use the
            staff login credentials dispatched by your organization administrator.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-xl space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Officer Email or Mobile Phone
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. solomon.a@selambus.et"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Staff Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border/70 text-amber-600 focus:ring-amber-500"
                />
                <span>Keep active on this scanner</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  toast.info("Password resets are managed by your Provider Operations Lead.")
                }
                className="text-amber-600 hover:underline font-medium text-[11px]"
              >
                Forgot PIN?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <span>{loading ? "Verifying Credentials..." : "Access Scanner Console"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Demo Credentials Quickfill */}
          <div className="pt-3 border-t border-border/40 text-center">
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="text-xs text-muted-foreground hover:text-amber-600 transition-colors font-medium underline"
            >
              Click here to autofill Inspector Demo credentials
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Received an invitation link from your provider?</p>
          <Link
            href="/inspector/activate"
            className="text-amber-600 font-bold hover:underline"
          >
            Accept Staff Invitation & Activate Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
