"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  QrCode,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  AlertCircle,
  KeyRound,
  Check,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useInspectorStore } from "@/stores/inspector.store";
import { toast } from "sonner";

function InspectorActivationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const { updateProfile } = useInspectorStore();

  // URL search params with intelligent defaults
  const inviteToken = searchParams.get("token") || "INV-SELAM-9941";
  const providerParam = searchParams.get("provider") || "Selam Bus Lines S.C.";
  const nameParam = searchParams.get("name") || "Solomon Abebe";
  const emailParam = searchParams.get("email") || "solomon.a@selambus.et";
  const stationParam = searchParams.get("station") || "Autobus Tera Central Terminal";
  const gateParam = searchParams.get("gate") || "Gate 3 (Intercity Express)";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password validation checks
  const hasMinLength = password.length >= 6;
  const hasStrongLength = password.length >= 8;
  const hasMixedChars = /[0-9!@#$%^&*]/.test(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password) {
      setErrorMessage("Please enter a secure password.");
      toast.error("Please enter a secure password.");
      return;
    }

    if (!hasMinLength) {
      setErrorMessage("Password must be at least 6 characters long.");
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      toast.error("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("You must accept the Inspector Code of Conduct to activate.");
      toast.error("You must accept the terms.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Authenticate Inspector user session in auth store
      setAuth(
        {
          id: "stf-1",
          name: nameParam,
          email: emailParam,
          role: "INSPECTOR",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        },
        "mock-inspector-jwt-token"
      );

      // Update Inspector Store profile
      updateProfile({
        fullName: nameParam,
        email: emailParam,
        organizationName: providerParam,
        assignedStation: stationParam,
        terminalGate: gateParam,
        status: "ACTIVE",
      });

      toast.success("Account activated! Welcome to the TicketHub Inspector network.");
      router.push("/inspector/scanner");
    }, 600);
  };

  const handleAutofillDemo = () => {
    setPassword("Inspector2026!");
    setConfirmPassword("Inspector2026!");
    setTermsAccepted(true);
    setErrorMessage(null);
    toast.info("Demo password loaded. Ready to activate.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC] dark:bg-[#0F1117] text-[#0F172A] dark:text-[#F8FAFC]">
      <div className="w-full max-w-md space-y-5">
        {/* Top Brand & Portal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-bold flex items-center justify-center mx-auto shadow-lg shadow-amber-600/25 ring-1 ring-amber-400/30">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-3 h-3" />
            <span>OFFICIAL INSPECTOR ONBOARDING</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
            Inspector Account Activation
          </h1>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You have been invited by{" "}
            <strong className="text-foreground">{providerParam}</strong> to operate as an
            authorized ticket verification officer.
          </p>
        </div>

        {/* Activation Card */}
        <div className="bg-card border border-border/70 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          {/* Organization Dispatch Credential Summary */}
          <div className="bg-muted/30 p-3.5 rounded-xl border border-border/50 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Provider:</span>
              </span>
              <span className="font-bold text-foreground truncate max-w-[200px]">
                {providerParam}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Officer Name:</span>
              </span>
              <span className="font-semibold text-foreground">{nameParam}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Dispatch Email:</span>
              <span className="font-mono text-foreground">{emailParam}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Station:</span>
              </span>
              <span className="text-foreground truncate max-w-[200px]">{stationParam}</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/30">
              <span className="text-muted-foreground">Assigned Gate:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {gateParam}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-muted-foreground" />
                <span>Invite Token:</span>
              </span>
              <span className="font-mono font-bold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                {inviteToken}
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleActivate} className="space-y-4">
            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Create Scanner Password
                </label>
                {password.length > 0 && (
                  <span
                    className={`text-[10px] font-bold ${
                      hasStrongLength && hasMixedChars
                        ? "text-emerald-600"
                        : hasMinLength
                        ? "text-amber-600"
                        : "text-rose-600"
                    }`}
                  >
                    {hasStrongLength && hasMixedChars
                      ? "Strong"
                      : hasMinLength
                      ? "Fair"
                      : "Too short"}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Confirm Password
                </label>
                {passwordsMatch && (
                  <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Passwords match
                  </span>
                )}
                {passwordsMismatch && (
                  <span className="text-[10px] font-semibold text-rose-600">
                    Passwords do not match
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Repeat your password"
                  className={`w-full pl-9 pr-10 py-2 text-xs rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 transition-all ${
                    passwordsMismatch
                      ? "border-rose-500 focus:ring-rose-500/30"
                      : passwordsMatch
                      ? "border-emerald-500 focus:ring-emerald-500/30"
                      : "border-border/70 focus:ring-amber-500/30 focus:border-amber-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password requirement hints */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground pt-0.5">
              <span className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-600 font-semibold" : ""}`}>
                {hasMinLength ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground ml-1" />}
                <span>At least 6 characters</span>
              </span>
              <span className={`flex items-center gap-1 ${hasMixedChars ? "text-emerald-600 font-semibold" : ""}`}>
                {hasMixedChars ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground ml-1" />}
                <span>Letters & symbols/numbers</span>
              </span>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-border/70 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <span className="text-[11px] leading-relaxed">
                I accept the Inspector Code of Conduct and authorize audit logging of all boarding pass scans performed on this terminal.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              <span>{loading ? "Activating Scanner..." : "Accept Invitation & Activate Scanner"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="pt-2 border-t border-border/40 text-center">
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3 h-3" />
              <span>Fill sample password for demo test</span>
            </button>
          </div>
        </div>

        {/* Footer navigation */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <Link
            href="/inspector/login"
            className="text-foreground hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors"
          >
            Already activated your password? Log in to Scanner →
          </Link>
          <p className="text-[11px] text-muted-foreground">
            Ticket Inspectors are created and assigned directly by Provider Owners. Public registration is not permitted.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InspectorActivationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC] dark:bg-[#0F1117] text-foreground">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading inspector invitation...</span>
          </div>
        </div>
      }
    >
      <InspectorActivationContent />
    </Suspense>
  );
}
