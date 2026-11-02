"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  FileText,
  MapPin,
  User,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { FormError } from "@/components/forms/form-error";
import { AUTH_ROUTES } from "@/lib/constants";
import { OrganizationCategory } from "@/types/auth.types";

export default function OrganizationRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    organizationName: "",
    category: "CINEMA" as OrganizationCategory,
    businessLicense: "",
    taxNumber: "",
    contactPersonName: "",
    email: "",
    phone: "",
    address: "",
    city: "Addis Ababa",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    { value: "CINEMA", label: "Cinema & Movie Theater Chain" },
    { value: "BUS", label: "Intercity Bus & Fleet Transport" },
    { value: "EVENT", label: "Live Events, Festivals & Concerts" },
    { value: "SPORTS", label: "Sports Clubs & Stadiums" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.organizationName ||
      !formData.businessLicense ||
      !formData.contactPersonName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.password
    ) {
      setError("Please fill in all mandatory business fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must accept the Tikora Provider Partnership Agreement.");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      router.push(AUTH_ROUTES.PENDING_APPROVAL);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration could not be completed. Please try again.");
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
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
            Provider Registration
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Register Organization
        </h2>
        <p className="text-sm text-slate-400">
          Sell tickets, configure seating charts, and scan QR passes with Tikora.
        </p>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl shadow-indigo-950/40 p-6 sm:p-9 space-y-6">
        <FormError message={error} />

        {/* Verification Notice */}
        <div className="rounded-2xl bg-indigo-950/40 border border-indigo-500/30 p-4 text-xs text-indigo-300 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold text-white">Verification Notice:</strong> Organization accounts require document verification before ticket publishing is enabled on the public portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Business Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Business Profile</span>
            </div>

            <FormInput
              label="Organization / Company Name"
              placeholder="e.g., Cinema Ethiopia, Selam Bus, Millennium Events"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              required
              leftIcon={<Building2 className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Ticketing Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as OrganizationCategory })}
                options={categoryOptions}
                required
              />

              <FormInput
                label="Commercial License Number"
                placeholder="e.g., BL-2024-9871"
                value={formData.businessLicense}
                onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                required
                leftIcon={<FileText className="w-4 h-4" />}
              />
            </div>

            <FormInput
              label="Tax Identification Number (TIN - Optional)"
              placeholder="e.g., 0012345678"
              value={formData.taxNumber}
              onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
              leftIcon={<FileText className="w-4 h-4" />}
            />
          </div>

          {/* Section 2: Contact Person */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Account Representative</span>
            </div>

            <FormInput
              label="Contact Person Name"
              placeholder="Primary account administrator full name"
              value={formData.contactPersonName}
              onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
              required
              leftIcon={<User className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Official Email Address"
                type="email"
                placeholder="contact@yourcompany.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <FormInput
                label="Official Phone Number"
                type="tel"
                placeholder="+251 11 555 1234"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Office Physical Address"
                placeholder="Bole Subcity, House 456"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                leftIcon={<MapPin className="w-4 h-4" />}
              />

              <FormInput
                label="City / Region"
                placeholder="Addis Ababa"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Section 3: Credentials */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>Portal Password</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                leftIcon={<Lock className="w-4 h-4" />}
                helperText="Minimum 8 characters"
              />

              <FormInput
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Agreement Checkbox */}
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
                <a href="#partner-terms" className="font-semibold text-indigo-400 underline hover:text-indigo-300">
                  Provider Partnership Agreement
                </a>{" "}
                and confirm that all submitted business registration information is authentic.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Building2 className="w-4 h-4" />
                <span>Submit Provider Application</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Redirect to Login */}
      <div className="text-center text-sm text-slate-400">
        Already have a provider account?{" "}
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
