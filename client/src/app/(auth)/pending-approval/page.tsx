"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, Home } from "lucide-react";
import { AUTH_ROUTES } from "@/lib/constants";

export default function PendingApprovalPage() {
  return (
    <div className="w-full space-y-6">
      {/* Status Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl shadow-indigo-950/40 p-6 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-950/40">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            Pending Verification
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Application Received!
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Thank you for registering your organization with Tikora. Our compliance team is currently reviewing your business credentials.
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
                <strong className="text-white">Profile Submitted:</strong> Your organization information and business license numbers are securely stored.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 font-bold text-[10px]">
                2
              </div>
              <p>
                <strong className="text-white">Commercial Audit:</strong> Tikora verifies your commercial license and tax numbers (typically within 24 hours).
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 font-bold text-[10px]">
                3
              </div>
              <p>
                <strong className="text-white">Portal Activation:</strong> You will receive an official approval email allowing you to create schedules, seat maps, and publish tickets.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>

          <Link
            href={AUTH_ROUTES.LOGIN}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 text-xs font-bold text-white hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>Back to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Support footer */}
      <div className="text-center text-xs text-slate-500">
        Have questions or need expedited verification?{" "}
        <a href="mailto:support@tikora.com" className="font-semibold text-indigo-400 underline hover:text-indigo-300">
          Contact Partner Support
        </a>
      </div>
    </div>
  );
}
