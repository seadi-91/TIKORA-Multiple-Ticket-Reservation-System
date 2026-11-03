"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  ArrowRight,
  CheckCircle,
  Ticket,
  Bus,
  Film,
  Calendar,
  Trophy,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AUTH_ROUTES, APP_NAME } from "@/lib/constants";

export default function RegisterHubPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"customer" | "organization">("customer");

  const handleContinue = () => {
    if (selectedRole === "customer") {
      router.push(AUTH_ROUTES.REGISTER_CUSTOMER);
    } else {
      router.push(AUTH_ROUTES.REGISTER_ORGANIZATION);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-black/5 space-y-6">
      {/* Title */}
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] dark:bg-amber-950/80 border border-amber-200 dark:border-slate-700 text-[#F59E0B] dark:text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Join {APP_NAME}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
          Choose Account Type
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-neutral-400">
          Select how you plan to use {APP_NAME} to get started.
        </p>
      </div>

      {/* Account Type Selection Cards */}
      <div className="grid grid-cols-1 gap-4">
        {/* Option 1: Customer Account */}
        <div
          onClick={() => setSelectedRole("customer")}
          className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 relative ${
            selectedRole === "customer"
              ? "border-[#B45309] bg-[#FAF5ED] dark:bg-[#221B12] shadow-sm ring-1 ring-[#B45309]"
              : "border-[#E2E8F0] dark:border-neutral-800 bg-[#F8FAFC] dark:bg-neutral-900/50 hover:border-slate-300 dark:hover:border-neutral-700"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                  selectedRole === "customer"
                    ? "bg-[#B45309] text-white shadow-xs scale-105"
                    : "bg-white dark:bg-neutral-800 text-[#64748B] dark:text-neutral-400 border border-[#E2E8F0] dark:border-neutral-700"
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-white">
                    Individual Customer
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-[#64748B] dark:text-neutral-400">
                  Book and manage tickets across intercity buses, cinema showtimes, music concerts, and stadium sports derbies.
                </p>
              </div>
            </div>

            <div className="shrink-0 pt-0.5">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  selectedRole === "customer"
                    ? "border-[#B45309] bg-[#B45309] text-white"
                    : "border-neutral-300 dark:border-neutral-700 bg-white dark:neutral-800"
                }`}
              >
                {selectedRole === "customer" && <CheckCircle className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-[#E2E8F0] dark:border-slate-800/80 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-800 text-[#0F172A] dark:text-neutral-300 px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-neutral-700">
              <Ticket className="w-3.5 h-3.5 text-[#B45309] dark:text-[#D97706]" /> Digital QR Passes
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-800 text-[#0F172A] dark:text-neutral-300 px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-neutral-700">
              <Bus className="w-3.5 h-3.5 text-blue-600" /> Interactive Seat Maps
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-800 text-[#0F172A] dark:text-neutral-300 px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-neutral-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Telebirr & CBE Birr
            </span>
          </div>
        </div>

        {/* Option 2: Organization / Provider Account */}
        <div
          onClick={() => setSelectedRole("organization")}
          className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 relative ${
            selectedRole === "organization"
              ? "border-[#F59E0B] bg-[#FFFBEB]/50 dark:bg-amber-950/40 shadow-md ring-2 ring-amber-500/20"
              : "border-[#E2E8F0] dark:border-neutral-800 bg-[#F8FAFC] dark:bg-neutral-900/50 hover:border-emerald-300 dark:hover:border-emerald-900"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                  selectedRole === "organization"
                    ? "bg-[#F59E0B] text-white shadow-md shadow-amber-500/20 scale-105"
                    : "bg-white dark:bg-neutral-800 text-[#64748B] dark:text-neutral-400 border border-[#E2E8F0] dark:border-neutral-700"
                }`}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-white">
                    Organization / Ticket Provider
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                    Business Partner
                  </span>
                </div>
                <p className="text-xs text-[#64748B] dark:text-neutral-400">
                  For cinema theater chains, intercity bus fleet operators, festival concert organizers, and sports clubs.
                </p>
              </div>
            </div>

            <div className="shrink-0 pt-0.5">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  selectedRole === "organization"
                    ? "border-[#B45309] bg-[#B45309] text-white"
                    : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                }`}
              >
                {selectedRole === "organization" && <CheckCircle className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-[#E2E8F0] dark:border-slate-800/80 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-800 text-[#0F172A] dark:text-neutral-300 px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-neutral-700">
              <Film className="w-3.5 h-3.5 text-purple-600" /> Cinema Screens
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-800 text-[#0F172A] dark:text-neutral-300 px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-neutral-700">
              <Bus className="w-3.5 h-3.5 text-blue-600" /> Fleet Schedules
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-800 text-[#0F172A] dark:text-neutral-300 px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-neutral-700">
              <Calendar className="w-3.5 h-3.5 text-amber-600" /> Event Passes
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-800 text-[#0F172A] dark:text-neutral-300 px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-neutral-700">
              <Trophy className="w-3.5 h-3.5 text-rose-600" /> Stadium Tribunes
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-4 pt-1">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] px-5 py-3.5 text-sm font-bold text-white shadow-xs active:scale-[0.99] transition-all duration-200 cursor-pointer"
        >
          <span>
            Continue as {selectedRole === "customer" ? "Customer" : "Organization"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-[#64748B] dark:text-neutral-500">
          Inspector accounts for gate staff are provisioned by registered organization administrators.
        </p>
      </div>

      {/* Link back to Sign In */}
      <div className="text-center text-xs sm:text-sm text-[#64748B] dark:text-neutral-400 pt-3 border-t border-[#E2E8F0] dark:border-neutral-800">
        Already have a {APP_NAME} account?{" "}
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="font-bold text-[#B45309] dark:text-[#D97706] hover:text-[#92400E] transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
