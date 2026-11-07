"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, ArrowRight, Home, RefreshCw, CheckCircle2 } from "lucide-react";
import { AUTH_ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export default function PendingApprovalPage() {
  const router = useRouter();
  const { token, setAuth } = useAuthStore();
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    if (!token) {
      router.push(AUTH_ROUTES.LOGIN);
      return;
    }
    setChecking(true);
    try {
      const res = await authService.getMe(token);
      setAuth(res.user, token);
      if (res.user.role === "ORGANIZATION" && res.user.status === "ACTIVE") {
        toast.success("Account Approved! Redirecting to provider portal...");
        router.push("/provider/dashboard");
      } else if (res.user.status === "SUSPENDED") {
        toast.error("Your provider application has been rejected. Please contact support.");
      } else {
        toast.info("Application is still under review by compliance.");
      }
    } catch {
      toast.error("Could not check verification status right now.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Status Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl shadow-black/40 p-6 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-950/40">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            Provider Account Under Review
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Application Received!
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Your provider account is currently pending administrator verification. Access to the provider dashboard is restricted until your commercial documents are approved.
          </p>
        </div>

        {/* Verification Timeline / Steps */}
        <div className="text-left bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-3.5">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Verification Steps:
          </p>

          <div className="space-y-3 text-xs text-slate-400">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 font-bold text-[10px]">
                ✓
              </div>
              <p>
                <strong className="text-white">Profile Submitted:</strong> Business details and commercial license numbers recorded in the audit registry.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 font-bold text-[10px]">
                2
              </div>
              <p>
                <strong className="text-white">Admin Review:</strong> Platform administrator reviews TIN, business credentials, and verification status.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 font-bold text-[10px]">
                3
              </div>
              <p>
                <strong className="text-white">Portal Activation:</strong> Upon administrator approval, full access to provider services, schedules, and ticket publishing is granted.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={checkStatus}
            disabled={checking}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white transition-all shadow-lg shadow-amber-600/20 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
            <span>{checking ? "Checking..." : "Check Approval Status"}</span>
          </button>

          <Link
            href={AUTH_ROUTES.LOGIN}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors"
          >
            <span>Back to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Support footer */}
      <div className="text-center text-xs text-slate-500">
        Have questions or need expedited verification?{" "}
        <a href="mailto:support@tikora.com" className="font-semibold text-amber-400 underline hover:text-amber-300">
          Contact Compliance Team
        </a>
      </div>
    </div>
  );
}
