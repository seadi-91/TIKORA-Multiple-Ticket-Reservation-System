"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Building2,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  MapPin,
  FileText,
  ShieldCheck,
  Landmark,
  Fingerprint,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  Briefcase,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { AUTH_ROUTES, APP_NAME } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth.store";
import { OrganizationCategory } from "@/types/auth.types";
import { toast } from "sonner";

function RegisterWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // If URL has ?type=..., start at step 2 with that type
  const queryType = searchParams.get("type");
  const initialType =
    queryType === "organization" || queryType === "provider"
      ? "organization"
      : "customer";

  // Multi-step Wizard:
  // Step 1: Account Type Selection (Customer vs Provider)
  // For Customer: Step 2 = Profile Details, Step 3 = Security & Strong Password
  // For Provider: Step 2 = Business Entity, Step 3 = Representative & Settlement, Step 4 = Security & Strong Password
  const [step, setStep] = useState<number>(queryType ? 2 : 1);
  const [accountType, setAccountType] = useState<"customer" | "organization">(initialType);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);

  // Customer Form State
  const [customerData, setCustomerData] = useState({
    fullName: "",
    email: "",
    phone: "+251 ",
    city: "Addis Ababa",
    nationalId: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  // Provider Form State
  const [providerData, setProviderData] = useState({
    organizationName: "",
    category: "BUS" as OrganizationCategory,
    businessLicense: "",
    taxNumber: "",
    contactPersonName: "",
    email: "",
    phone: "+251 ",
    city: "Addis Ababa",
    address: "",
    settlementBank: "TELEBIRR",
    accountNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  // Total steps based on account type
  const totalSteps = accountType === "customer" ? 3 : 4;

  // Active password for evaluation
  const activePassword =
    accountType === "customer" ? customerData.password : providerData.password;
  const activeConfirmPassword =
    accountType === "customer" ? customerData.confirmPassword : providerData.confirmPassword;

  // Strong password checks
  const hasMinLength = activePassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(activePassword);
  const hasLowerCase = /[a-z]/.test(activePassword);
  const hasNumber = /[0-9]/.test(activePassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(activePassword);
  const passwordsMatch =
    activePassword.length > 0 &&
    activeConfirmPassword.length > 0 &&
    activePassword === activeConfirmPassword;

  // Password Strength Score (0 to 4)
  const strengthScore = [
    hasMinLength,
    hasUpperCase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (activePassword.length === 0) return { label: "Not entered", color: "text-muted-foreground" };
    if (strengthScore <= 1) return { label: "Weak password", color: "text-rose-500" };
    if (strengthScore === 2) return { label: "Fair password", color: "text-amber-500" };
    if (strengthScore === 3) return { label: "Good password", color: "text-blue-500" };
    return { label: "Strong password", color: "text-emerald-500" };
  };

  // -----------------------------------------------------------------
  // Step Navigation & Validations
  // -----------------------------------------------------------------
  const handleNextFromStep1 = () => {
    setError(null);
    setStep(2);
  };

  // Customer Step 2 -> Step 3
  const handleCustomerNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!customerData.email.trim() || !customerData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!customerData.phone.trim() || customerData.phone.trim().length < 9) {
      setError("Please enter a valid mobile phone number.");
      return;
    }

    setStep(3);
  };

  // Provider Step 2 -> Step 3
  const handleProviderNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!providerData.organizationName.trim()) {
      setError("Please enter legal organization name.");
      return;
    }
    if (!providerData.businessLicense.trim()) {
      setError("Please enter business license number (MOT/BL).");
      return;
    }
    if (!providerData.taxNumber.trim()) {
      setError("Please enter tax identification number (TIN).");
      return;
    }

    setStep(3);
  };

  // Provider Step 3 -> Step 4
  const handleProviderNextStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!providerData.contactPersonName.trim()) {
      setError("Please enter authorized contact person name.");
      return;
    }
    if (!providerData.email.trim() || !providerData.email.includes("@")) {
      setError("Please enter valid corporate email.");
      return;
    }
    if (!providerData.phone.trim() || providerData.phone.trim().length < 9) {
      setError("Please enter corporate contact phone number.");
      return;
    }
    if (!providerData.address.trim()) {
      setError("Please enter physical headquarters address.");
      return;
    }
    if (!providerData.accountNumber.trim()) {
      setError("Please enter payout bank account or till number.");
      return;
    }

    setStep(4);
  };

  // Final Customer Submission (at Step 3)
  const handleCustomerFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasMinLength || !hasUpperCase || !hasNumber) {
      setError("Password must be at least 8 characters with 1 uppercase letter and 1 number.");
      return;
    }

    if (customerData.password !== customerData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!customerData.agreeToTerms) {
      setError("Please accept the Terms of Service to complete registration.");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setAuth(
        {
          id: `cust-${Date.now()}`,
          name: customerData.fullName.trim(),
          email: customerData.email.trim().toLowerCase(),
          phone: customerData.phone.trim(),
          role: "CUSTOMER",
          status: "ACTIVE",
          emailVerified: true,
          createdAt: new Date().toISOString().split("T")[0],
        },
        "mock-jwt-token-customer"
      );

      toast.success("Account created successfully!");
      router.push("/customer");
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Final Provider Submission (at Step 4)
  const handleProviderFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasMinLength || !hasUpperCase || !hasNumber) {
      setError("Password must be at least 8 characters with 1 uppercase letter and 1 number.");
      return;
    }

    if (providerData.password !== providerData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!providerData.agreeToTerms) {
      setError("Please accept the TIKORA Provider Partnership Agreement.");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      setAuth(
        {
          id: `prov-${Date.now()}`,
          name: providerData.organizationName.trim(),
          email: providerData.email.trim().toLowerCase(),
          phone: providerData.phone.trim(),
          role: "ORGANIZATION",
          organizationId: `org-${Date.now()}`,
          status: "PENDING_APPROVAL",
          emailVerified: true,
          createdAt: new Date().toISOString().split("T")[0],
        },
        "mock-jwt-token-provider"
      );

      toast.success("Provider application submitted! Awaiting verification.");
      router.push(AUTH_ROUTES.PENDING_APPROVAL);
    } catch (err: any) {
      setError(err?.message || "Provider registration could not be completed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-lg shadow-black/5 space-y-4">
      {/* Top Stepper Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-foreground">
            Step {step} of {totalSteps}
          </span>
          <span className="font-medium text-muted-foreground">
            {step === 1 && "Account Type"}
            {step === 2 && (accountType === "customer" ? "Personal Details" : "Business Details")}
            {step === 3 && (accountType === "customer" ? "Security & Password" : "Contact & Settlement")}
            {step === 4 && "Security & Password"}
          </span>
        </div>

        {/* Linear progress bar */}
        <div className="flex items-center gap-1 w-full">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                idx + 1 <= step ? "bg-[#B45309]" : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Error Feedback Message */}
      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 1: ACCOUNT TYPE SELECTION */}
      {/* ------------------------------------------------------------- */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs text-muted-foreground">
              Select how you will be using {APP_NAME} to continue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Customer Option */}
            <div
              onClick={() => setAccountType("customer")}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                accountType === "customer"
                  ? "border-[#B45309] bg-amber-500/5 shadow-xs ring-1 ring-[#B45309]"
                  : "border-slate-200 dark:border-slate-800 bg-card hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      accountType === "customer"
                        ? "bg-[#B45309] text-white"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">
                        Customer Account
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Individual
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Book buses, concerts, cinema screenings, and sports tickets with digital QR passes.
                    </p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    accountType === "customer"
                      ? "border-[#B45309] bg-[#B45309] text-white"
                      : "border-slate-300 dark:border-slate-700 bg-background"
                  }`}
                >
                  {accountType === "customer" && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
            </div>

            {/* Provider Option */}
            <div
              onClick={() => setAccountType("organization")}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                accountType === "organization"
                  ? "border-[#B45309] bg-amber-500/5 shadow-xs ring-1 ring-[#B45309]"
                  : "border-slate-200 dark:border-slate-800 bg-card hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      accountType === "organization"
                        ? "bg-[#B45309] text-white"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">
                        Provider Partner
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Business
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Sell tickets, manage bus schedules, cinema halls, matchdays, and automated payouts.
                    </p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    accountType === "organization"
                      ? "border-[#B45309] bg-[#B45309] text-white"
                      : "border-slate-300 dark:border-slate-700 bg-background"
                  }`}
                >
                  {accountType === "organization" && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNextFromStep1}
            className="w-full py-2 px-4 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Sign In Link */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={AUTH_ROUTES.LOGIN}
              className="font-bold text-[#B45309] dark:text-amber-400 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CUSTOMER FLOW: STEP 2 (PERSONAL DETAILS) */}
      {/* ------------------------------------------------------------- */}
      {accountType === "customer" && step === 2 && (
        <form onSubmit={handleCustomerNextStep2} className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-[#B45309] dark:text-amber-400">
              Customer Details
            </span>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-foreground">Personal Details</h2>
            <p className="text-[11px] text-muted-foreground">
              Provide your contact information for ticket notifications and passes.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-semibold text-foreground mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={customerData.fullName}
                onChange={(e) => setCustomerData({ ...customerData, fullName: e.target.value })}
                placeholder="e.g. Dawit Hailemariam"
                className="w-full pl-8 pr-3 py-1.5 text-xs placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  placeholder="e.g. dawit@gmail.com"
                  className="w-full pl-8 pr-3 py-1.5 text-xs placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Mobile Phone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  placeholder="e.g. +251 911 234 567"
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-mono placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
                />
              </div>
            </div>
          </div>

          {/* City & National ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                City / Region
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={customerData.city}
                  onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
                >
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Hawassa">Hawassa</option>
                  <option value="Adama">Adama / Nazret</option>
                  <option value="Bahir Dar">Bahir Dar</option>
                  <option value="Dire Dawa">Dire Dawa</option>
                  <option value="Bishoftu">Bishoftu</option>
                  <option value="Gondar">Gondar</option>
                  <option value="Mekelle">Mekelle</option>
                  <option value="Other">Other Region</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                National ID / Fayda <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Fingerprint className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerData.nationalId}
                  onChange={(e) => setCustomerData({ ...customerData, nationalId: e.target.value })}
                  placeholder="e.g. ET-FAN-9821034"
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-mono placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              className="py-2 px-3.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next • Security</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CUSTOMER FLOW: STEP 3 (SECURITY & STRONG PASSWORD) */}
      {/* ------------------------------------------------------------- */}
      {accountType === "customer" && step === 3 && (
        <form onSubmit={handleCustomerFinalSubmit} className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(2);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Final Step
            </span>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-foreground">Set Strong Password</h2>
            <p className="text-[11px] text-muted-foreground">
              Create a secure password to protect your bookings and digital passes.
            </p>
          </div>

          {/* Password & Confirm Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={customerData.password}
                  onChange={(e) => setCustomerData({ ...customerData, password: e.target.value })}
                  placeholder="At least 8 chars"
                  className="w-full pl-8 pr-8 py-1.5 text-xs placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={customerData.confirmPassword}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, confirmPassword: e.target.value })
                  }
                  placeholder="Repeat password"
                  className="w-full pl-8 pr-8 py-1.5 text-xs placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Strength Indicator Meter */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-semibold text-muted-foreground">Password Strength:</span>
              <span className={`font-bold ${getStrengthLabel().color}`}>{getStrengthLabel().label}</span>
            </div>

            <div className="grid grid-cols-4 gap-1">
              <div className={`h-1 rounded-full ${strengthScore >= 1 ? "bg-rose-500" : "bg-slate-200 dark:bg-slate-800"}`} />
              <div className={`h-1 rounded-full ${strengthScore >= 2 ? "bg-amber-500" : "bg-slate-200 dark:bg-slate-800"}`} />
              <div className={`h-1 rounded-full ${strengthScore >= 3 ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-800"}`} />
              <div className={`h-1 rounded-full ${strengthScore >= 4 ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`} />
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[9px] text-muted-foreground pt-1">
              <span className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-600 font-semibold" : ""}`}>
                <CheckCircle2 className="w-2.5 h-2.5" /> 8+ characters
              </span>
              <span className={`flex items-center gap-1 ${hasUpperCase ? "text-emerald-600 font-semibold" : ""}`}>
                <CheckCircle2 className="w-2.5 h-2.5" /> 1 uppercase (A-Z)
              </span>
              <span className={`flex items-center gap-1 ${hasNumber ? "text-emerald-600 font-semibold" : ""}`}>
                <CheckCircle2 className="w-2.5 h-2.5" /> 1 number (0-9)
              </span>
              <span className={`flex items-center gap-1 ${passwordsMatch ? "text-emerald-600 font-semibold" : ""}`}>
                <CheckCircle2 className="w-2.5 h-2.5" /> Passwords match
              </span>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 text-[11px] text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={customerData.agreeToTerms}
                onChange={(e) =>
                  setCustomerData({ ...customerData, agreeToTerms: e.target.checked })
                }
                className="mt-0.5 rounded border-slate-300 text-[#B45309] focus:ring-[#B45309]"
              />
              <span>
                I agree to the{" "}
                <Link href="/about" className="text-[#B45309] dark:text-amber-400 font-semibold hover:underline">
                  Terms of Service
                </Link>{" "}
                and Privacy Policy.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(2);
              }}
              className="py-2 px-3.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{loading ? "Creating..." : "Complete Registration"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PROVIDER FLOW: STEP 2 (BUSINESS ENTITY) */}
      {/* ------------------------------------------------------------- */}
      {accountType === "organization" && step === 2 && (
        <form onSubmit={handleProviderNextStep2} className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-[#B45309] dark:text-amber-400">
              Business Entity
            </span>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-foreground">Company Information</h2>
            <p className="text-[11px] text-muted-foreground">
              Define your operating business category and legal registration numbers.
            </p>
          </div>

          {/* Operating Sector - Compact Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-foreground mb-1">
              Operating Sector <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={providerData.category}
                onChange={(e) =>
                  setProviderData({
                    ...providerData,
                    category: e.target.value as OrganizationCategory,
                  })
                }
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
              >
                <option value="BUS">Intercity Bus Transport</option>
                <option value="CINEMA">Cinema & Movie Theaters</option>
                <option value="EVENT">Live Events, Concerts & Festivals</option>
                <option value="SPORTS">Stadium Sports & Derbies</option>
              </select>
            </div>
          </div>

          {/* Legal Organization Name */}
          <div>
            <label className="block text-[11px] font-semibold text-foreground mb-1">
              Legal Business Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={providerData.organizationName}
                onChange={(e) =>
                  setProviderData({ ...providerData, organizationName: e.target.value })
                }
                placeholder="e.g. Selam Bus Line Share Company"
                className="w-full pl-8 pr-3 py-1.5 text-xs placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
              />
            </div>
          </div>

          {/* License & TIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Business License (MOT/BL) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={providerData.businessLicense}
                  onChange={(e) =>
                    setProviderData({ ...providerData, businessLicense: e.target.value })
                  }
                  placeholder="e.g. MOT/BL/2018/88921"
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-mono placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Tax Number (TIN) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={providerData.taxNumber}
                onChange={(e) => setProviderData({ ...providerData, taxNumber: e.target.value })}
                placeholder="e.g. TIN-0019283741"
                className="w-full px-3 py-1.5 text-xs font-mono placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              className="py-2 px-3.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next • Contact & Payout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PROVIDER FLOW: STEP 3 (CONTACT & SETTLEMENT) */}
      {/* ------------------------------------------------------------- */}
      {accountType === "organization" && step === 3 && (
        <form onSubmit={handleProviderNextStep3} className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(2);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-[#B45309] dark:text-amber-400">
              Contact & Payout
            </span>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-foreground">Representative & Payout</h2>
            <p className="text-[11px] text-muted-foreground">
              Provide corporate representative contact and settlement banking channel.
            </p>
          </div>

          {/* Contact Person, Email, Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Contact Person <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={providerData.contactPersonName}
                onChange={(e) =>
                  setProviderData({ ...providerData, contactPersonName: e.target.value })
                }
                placeholder="e.g. Solomon Tadesse"
                className="w-full px-3 py-1.5 text-xs placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Corporate Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={providerData.email}
                onChange={(e) => setProviderData({ ...providerData, email: e.target.value })}
                placeholder="e.g. ops@selambus.et"
                className="w-full px-3 py-1.5 text-xs placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Corporate Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={providerData.phone}
                onChange={(e) => setProviderData({ ...providerData, phone: e.target.value })}
                placeholder="e.g. +251 911 234 567"
                className="w-full px-3 py-1.5 text-xs font-mono placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
              />
            </div>
          </div>

          {/* City & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Headquarters City
              </label>
              <select
                value={providerData.city}
                onChange={(e) => setProviderData({ ...providerData, city: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
              >
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Hawassa">Hawassa</option>
                <option value="Adama">Adama / Nazret</option>
                <option value="Bahir Dar">Bahir Dar</option>
                <option value="Dire Dawa">Dire Dawa</option>
                <option value="Other">Other Region</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Physical Office Address
              </label>
              <input
                type="text"
                required
                value={providerData.address}
                onChange={(e) => setProviderData({ ...providerData, address: e.target.value })}
                placeholder="e.g. Meskel Square, Sunshine Plaza"
                className="w-full px-3 py-1.5 text-xs placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
              />
            </div>
          </div>

          {/* Settlement Channel & Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15">
            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Settlement Payout Channel
              </label>
              <div className="relative">
                <Landmark className="w-3.5 h-3.5 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={providerData.settlementBank}
                  onChange={(e) =>
                    setProviderData({ ...providerData, settlementBank: e.target.value })
                  }
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-background text-foreground focus:outline-none focus:border-[#B45309]"
                >
                  <option value="TELEBIRR">Telebirr SuperApp Merchant</option>
                  <option value="CBE">Commercial Bank of Ethiopia (CBE)</option>
                  <option value="AWASH">Awash Bank</option>
                  <option value="ABYSSINIA">Bank of Abyssinia</option>
                  <option value="DASHEN">Dashen Bank</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Account / Till Number
              </label>
              <input
                type="text"
                required
                value={providerData.accountNumber}
                onChange={(e) =>
                  setProviderData({ ...providerData, accountNumber: e.target.value })
                }
                placeholder="e.g. 1000192837482"
                className="w-full px-3 py-1.5 text-xs font-mono placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-background text-foreground focus:outline-none focus:border-[#B45309]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(2);
              }}
              className="py-2 px-3.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next • Security</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PROVIDER FLOW: STEP 4 (SECURITY & STRONG PASSWORD) */}
      {/* ------------------------------------------------------------- */}
      {accountType === "organization" && step === 4 && (
        <form onSubmit={handleProviderFinalSubmit} className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(3);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Final Step
            </span>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-foreground">Set Master Portal Password</h2>
            <p className="text-[11px] text-muted-foreground">
              Define the primary administrator password for your commercial provider dashboard.
            </p>
          </div>

          {/* Password & Confirm Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Portal Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={providerData.password}
                  onChange={(e) => setProviderData({ ...providerData, password: e.target.value })}
                  placeholder="At least 8 chars"
                  className="w-full pl-8 pr-8 py-1.5 text-xs placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={providerData.confirmPassword}
                  onChange={(e) =>
                    setProviderData({ ...providerData, confirmPassword: e.target.value })
                  }
                  placeholder="Repeat password"
                  className="w-full pl-8 pr-8 py-1.5 text-xs placeholder:text-[10.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:border-[#B45309]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Strength Indicator Meter */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-semibold text-muted-foreground">Password Strength:</span>
              <span className={`font-bold ${getStrengthLabel().color}`}>{getStrengthLabel().label}</span>
            </div>

            <div className="grid grid-cols-4 gap-1">
              <div className={`h-1 rounded-full ${strengthScore >= 1 ? "bg-rose-500" : "bg-slate-200 dark:bg-slate-800"}`} />
              <div className={`h-1 rounded-full ${strengthScore >= 2 ? "bg-amber-500" : "bg-slate-200 dark:bg-slate-800"}`} />
              <div className={`h-1 rounded-full ${strengthScore >= 3 ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-800"}`} />
              <div className={`h-1 rounded-full ${strengthScore >= 4 ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`} />
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[9px] text-muted-foreground pt-1">
              <span className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-600 font-semibold" : ""}`}>
                <CheckCircle2 className="w-2.5 h-2.5" /> 8+ characters
              </span>
              <span className={`flex items-center gap-1 ${hasUpperCase ? "text-emerald-600 font-semibold" : ""}`}>
                <CheckCircle2 className="w-2.5 h-2.5" /> 1 uppercase (A-Z)
              </span>
              <span className={`flex items-center gap-1 ${hasNumber ? "text-emerald-600 font-semibold" : ""}`}>
                <CheckCircle2 className="w-2.5 h-2.5" /> 1 number (0-9)
              </span>
              <span className={`flex items-center gap-1 ${passwordsMatch ? "text-emerald-600 font-semibold" : ""}`}>
                <CheckCircle2 className="w-2.5 h-2.5" /> Passwords match
              </span>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 text-[11px] text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={providerData.agreeToTerms}
                onChange={(e) =>
                  setProviderData({ ...providerData, agreeToTerms: e.target.checked })
                }
                className="mt-0.5 rounded border-slate-300 text-[#B45309] focus:ring-[#B45309]"
              />
              <span>
                We accept the{" "}
                <Link href="/about" className="text-[#B45309] dark:text-amber-400 font-semibold hover:underline">
                  TIKORA Provider Agreement
                </Link>{" "}
                and settlement commission framework.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(3);
              }}
              className="py-2 px-3.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-bold shadow-xs active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{loading ? "Submitting..." : "Submit Application"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function RegisterHubPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
          Loading registration...
        </div>
      }
    >
      <RegisterWizardContent />
    </Suspense>
  );
}
