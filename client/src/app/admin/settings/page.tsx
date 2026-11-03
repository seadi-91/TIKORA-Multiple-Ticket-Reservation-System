"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  ShieldCheck,
  CreditCard,
  DollarSign,
  Lock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  Globe,
  Bell,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminStore();

  const [activeTab, setActiveTab] = useState<"GENERAL" | "FINANCIAL" | "PAYMENTS" | "SECURITY">("GENERAL");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states initialized with store settings
  const [platformName, setPlatformName] = useState(settings.platformName);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [allowNewRegistrations, setAllowNewRegistrations] = useState(settings.allowNewRegistrations);

  const [defaultCommissionRate, setDefaultCommissionRate] = useState(settings.defaultCommissionRate);
  const [currency, setCurrency] = useState(settings.currency);
  const [autoApproveRefundThreshold, setAutoApproveRefundThreshold] = useState(
    settings.autoApproveRefundThreshold
  );

  const [telebirrEnabled, setTelebirrEnabled] = useState(settings.telebirrEnabled);
  const [cbeBirrEnabled, setCbeBirrEnabled] = useState(settings.cbeBirrEnabled);
  const [chapaEnabled, setChapaEnabled] = useState(settings.chapaEnabled);

  const [twoFactorRequiredForAdmins, setTwoFactorRequiredForAdmins] = useState(
    settings.twoFactorRequiredForAdmins
  );
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(
    settings.sessionTimeoutMinutes
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      platformName,
      supportEmail,
      supportPhone,
      maintenanceMode,
      allowNewRegistrations,
      defaultCommissionRate: Number(defaultCommissionRate),
      currency,
      autoApproveRefundThreshold: Number(autoApproveRefundThreshold),
      telebirrEnabled,
      cbeBirrEnabled,
      chapaEnabled,
      twoFactorRequiredForAdmins,
      sessionTimeoutMinutes: Number(sessionTimeoutMinutes),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Platform Configuration & System Governance
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure enterprise-wide operational defaults, financial margins, integrated payment gateways, and security policies.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings successfully persisted & logged!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
        {[
          { label: "General & Branding", value: "GENERAL", icon: Globe },
          { label: "Financial & Commission", value: "FINANCIAL", icon: DollarSign },
          { label: "Payment Gateways", value: "PAYMENTS", icon: CreditCard },
          { label: "Security & Policy", value: "SECURITY", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 ${
                activeTab === tab.value
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Form Container */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: General */}
        {activeTab === "GENERAL" && (
          <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
            <div className="border-b border-border/30 pb-3">
              <h3 className="font-bold text-sm text-foreground">General Platform Identity</h3>
              <p className="text-xs text-muted-foreground">Public brand and operational customer support metadata</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Platform Display Name</label>
                <input
                  type="text"
                  required
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-border/80 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Primary Support Email</label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-border/80 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Official Helpdesk Phone</label>
                <input
                  type="text"
                  required
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-border/80 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Operating Region</label>
                <input
                  type="text"
                  disabled
                  value="Federal Democratic Republic of Ethiopia"
                  className="w-full h-9 px-3 rounded-xl bg-muted/20 border border-border/40 text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            {/* Platform Toggles */}
            <div className="pt-4 border-t border-border/30 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50">
                <div className="space-y-0.5">
                  <p className="font-bold text-xs text-foreground">Maintenance Mode</p>
                  <p className="text-[11px] text-muted-foreground">
                    When active, public customer bookings are paused while Super Admin access remains open.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    maintenanceMode ? "bg-amber-600 justify-end" : "bg-muted-foreground/30 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50">
                <div className="space-y-0.5">
                  <p className="font-bold text-xs text-foreground">Allow New Provider Self-Applications</p>
                  <p className="text-[11px] text-muted-foreground">
                    Accept new transport and entertainment business registrations via public portal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowNewRegistrations(!allowNewRegistrations)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    allowNewRegistrations ? "bg-amber-600 justify-end" : "bg-muted-foreground/30 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Financial */}
        {activeTab === "FINANCIAL" && (
          <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
            <div className="border-b border-border/30 pb-3">
              <h3 className="font-bold text-sm text-foreground">Financial & Take-Rate Policies</h3>
              <p className="text-xs text-muted-foreground">Platform fees, currency units, and automated refund parameters</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Default Platform Commission (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="30"
                  value={defaultCommissionRate}
                  onChange={(e) => setDefaultCommissionRate(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-border/80 text-foreground font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Operating Currency</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-border/80 text-foreground font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Auto-Approve Refund Limit (ETB)</label>
                <input
                  type="number"
                  value={autoApproveRefundThreshold}
                  onChange={(e) => setAutoApproveRefundThreshold(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-border/80 text-foreground font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Payments */}
        {activeTab === "PAYMENTS" && (
          <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
            <div className="border-b border-border/30 pb-3">
              <h3 className="font-bold text-sm text-foreground">Integrated Payment Gateways</h3>
              <p className="text-xs text-muted-foreground">Toggle supported payment providers across Ethiopia</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50">
                <div className="space-y-0.5">
                  <p className="font-bold text-xs text-foreground">Telebirr (Ethio Telecom Gateway)</p>
                  <p className="text-[11px] text-muted-foreground">
                    Enables in-app USSD push, QR checkout, and instant mobile wallet settlement.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTelebirrEnabled(!telebirrEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    telebirrEnabled ? "bg-amber-600 justify-end" : "bg-muted-foreground/30 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50">
                <div className="space-y-0.5">
                  <p className="font-bold text-xs text-foreground">CBE Birr (Commercial Bank of Ethiopia)</p>
                  <p className="text-[11px] text-muted-foreground">
                    Supports CBE account debit, mobile banking API, and batch provider payouts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCbeBirrEnabled(!cbeBirrEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    cbeBirrEnabled ? "bg-amber-600 justify-end" : "bg-muted-foreground/30 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50">
                <div className="space-y-0.5">
                  <p className="font-bold text-xs text-foreground">Chapa Financial Technologies</p>
                  <p className="text-[11px] text-muted-foreground">
                    International Visa, Mastercard, and multi-bank aggregations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setChapaEnabled(!chapaEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    chapaEnabled ? "bg-amber-600 justify-end" : "bg-muted-foreground/30 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === "SECURITY" && (
          <div className="p-6 rounded-3xl bg-card border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
            <div className="border-b border-border/30 pb-3">
              <h3 className="font-bold text-sm text-foreground">Platform Security & Access Governance</h3>
              <p className="text-xs text-muted-foreground">Administrative session parameters and multi-factor mandates</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50">
                <div className="space-y-0.5">
                  <p className="font-bold text-xs text-foreground">Enforce Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-muted-foreground">
                    Requires TOTP authenticator app verification for all accounts with Super Admin privileges.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorRequiredForAdmins(!twoFactorRequiredForAdmins)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    twoFactorRequiredForAdmins ? "bg-amber-600 justify-end" : "bg-muted-foreground/30 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-semibold text-foreground">Staff Session Inactivity Timeout (Minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="480"
                  value={sessionTimeoutMinutes}
                  onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                  className="w-48 h-9 px-3 rounded-xl bg-muted/40 border border-border/80 text-foreground font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Persist Platform Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
