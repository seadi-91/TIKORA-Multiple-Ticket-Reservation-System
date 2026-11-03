"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  QrCode,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export default function InspectorActivationPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);

  const inviteData = {
    providerName: "Selam Bus Lines S.C.",
    inspectorName: "Solomon Abebe",
    email: "solomon.a@selambus.et",
    assignedStation: "Autobus Tera Central Terminal",
    terminalGate: "Gate 3 (Intercity Express)",
    token: "INV-SELAM-9941",
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      toast.error("Passwords do not match or are empty.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      setAuth(
        {
          id: "stf-1",
          name: inviteData.inspectorName,
          email: inviteData.email,
          role: "INSPECTOR",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        },
        "mock-inspector-jwt-token"
      );

      toast.success("Account activated! Welcome to the TicketHub Inspector network.");
      router.push("/inspector/scanner");
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-bold flex items-center justify-center mx-auto shadow-lg shadow-amber-600/30">
            <QrCode className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            Inspector Account Activation
          </h1>
          <p className="text-xs text-muted-foreground">
            You have been invited by <strong>{inviteData.providerName}</strong> to join as an authorized Gate Inspector.
          </p>
        </div>

        {/* Invitation Credentials Preview */}
        <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="bg-muted/20 p-3.5 rounded-xl border border-border/50 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Officer Name:</span>
              <span className="font-bold text-foreground">{inviteData.inspectorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dispatch Email:</span>
              <span className="font-mono text-foreground">{inviteData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assigned Station:</span>
              <span className="text-foreground">{inviteData.assignedStation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Primary Gate:</span>
              <span className="font-bold text-amber-600">{inviteData.terminalGate}</span>
            </div>
          </div>

          <form onSubmit={handleActivate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Set Scanner Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat secure password"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-border/70 text-amber-600 focus:ring-amber-500"
              />
              <span>
                I agree to the Inspector Code of Conduct and federal passenger ticket verification protocols.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <span>{loading ? "Activating Scanner..." : "Accept Invitation & Activate"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <Link href="/inspector/login" className="hover:underline">
            Already activated your password? Log in here →
          </Link>
        </div>
      </div>
    </div>
  );
}
