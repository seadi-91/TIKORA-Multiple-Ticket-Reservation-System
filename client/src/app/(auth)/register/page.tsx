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
import { AUTH_ROUTES } from "@/lib/constants";

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
    <div className="w-full space-y-6">
      {/* Title */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Join Tikora Platform</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Choose Account Type
        </h2>
        <p className="text-sm text-slate-400">
          Select how you plan to use Tikora to set up your account.
        </p>
      </div>

      {/* Account Type Selection Cards */}
      <div className="grid grid-cols-1 gap-4">
        {/* Option 1: Customer Account */}
        <div
          onClick={() => setSelectedRole("customer")}
          className={`cursor-pointer rounded-3xl border p-5 sm:p-6 transition-all duration-300 relative ${
            selectedRole === "customer"
              ? "border-indigo-500 bg-indigo-950/40 shadow-xl shadow-indigo-950/60 ring-2 ring-indigo-500/30"
              : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                  selectedRole === "customer"
                    ? "bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Individual Customer
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Instant Access
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Book and manage tickets for yourself across intercity buses, cinema showtimes, concerts, and stadium sports.
                </p>
              </div>
            </div>

            <div className="shrink-0 pt-1">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  selectedRole === "customer"
                    ? "border-indigo-500 bg-indigo-600 text-white"
                    : "border-slate-700 bg-slate-800"
                }`}
              >
                {selectedRole === "customer" && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60">
              <Ticket className="w-3.5 h-3.5 text-indigo-400" /> Digital QR Wallet
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60">
              <Bus className="w-3.5 h-3.5 text-cyan-400" /> Interactive Seat Maps
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure Payments
            </span>
          </div>
        </div>

        {/* Option 2: Organization / Provider Account */}
        <div
          onClick={() => setSelectedRole("organization")}
          className={`cursor-pointer rounded-3xl border p-5 sm:p-6 transition-all duration-300 relative ${
            selectedRole === "organization"
              ? "border-indigo-500 bg-indigo-950/40 shadow-xl shadow-indigo-950/60 ring-2 ring-indigo-500/30"
              : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                  selectedRole === "organization"
                    ? "bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Organization / Ticket Provider
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Business Partner
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  For cinema theater chains, intercity bus fleet operators, concert event planners, and stadium sports clubs.
                </p>
              </div>
            </div>

            <div className="shrink-0 pt-1">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  selectedRole === "organization"
                    ? "border-indigo-500 bg-indigo-600 text-white"
                    : "border-slate-700 bg-slate-800"
                }`}
              >
                {selectedRole === "organization" && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60">
              <Film className="w-3.5 h-3.5 text-purple-400" /> Cinema Screens
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60">
              <Bus className="w-3.5 h-3.5 text-cyan-400" /> Fleet Schedules
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Event Passes
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60">
              <Trophy className="w-3.5 h-3.5 text-rose-400" /> Stadium Tribunes
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-4 pt-2">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] transition-all duration-200"
        >
          <span>
            Continue as {selectedRole === "customer" ? "Customer" : "Organization"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-slate-500">
          Inspector accounts for gate staff are provisioned by registered organization administrators.
        </p>
      </div>

      {/* Link back to Sign In */}
      <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-800">
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
