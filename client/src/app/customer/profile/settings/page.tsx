"use client";

import React, { useState } from "react";
import {
  Lock,
  Bell,
  Sun,
  Moon,
  Laptop,
  Globe,
  ShieldAlert,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { useTheme } from "@/providers/theme-provider";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export default function CustomerSettingsPage() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuthStore();

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Notification toggles
  const [bookingSms, setBookingSms] = useState(true);
  const [paymentEmail, setPaymentEmail] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [promos, setPromos] = useState(false);

  // Language state
  const [language, setLanguage] = useState("EN");

  // Deletion dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const getPasswordStrength = () => {
    if (!newPassword) return null;
    if (newPassword.length < 6) return { label: "Too Weak", color: "text-red-500 bg-red-100" };
    if (newPassword.length < 10) return { label: "Good", color: "text-amber-600 bg-amber-100" };
    return { label: "Strong", color: "text-emerald-700 bg-emerald-100" };
  };

  const strength = getPasswordStrength();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 4000);
  };

  return (
    <PageContainer
      title="Account Settings"
      subtitle="Manage your security credentials, notification preferences, display appearance, and privacy."
      breadcrumbs={[{ label: "Customer Dashboard", href: "/customer" }, { label: "Settings" }]}
    >
      <div className="space-y-8 max-w-4xl">
        {/* 1. Security & Change Password */}
        <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Security & Password</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Update your login password and manage authentication credentials.
              </p>
            </div>
          </div>

          {passwordSaved && (
            <div className="p-4 rounded-xl bg-[#FFFBEB] dark:bg-amber-950/60 border border-emerald-300 dark:border-slate-700 text-[#F59E0B] dark:text-amber-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Password successfully updated!</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300">
                  New Password
                </label>
                {strength && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${strength.color}`}>
                    Strength: {strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 pr-10 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white text-xs focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* 2. Notification Preferences */}
        <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Notification Channels</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Choose which notifications you wish to receive via SMS and Email.
              </p>
            </div>
          </div>

          <div className="space-y-4 max-w-xl">
            {[
              { label: "SMS Booking Confirmations", desc: "Receive immediate SMS with boarding pass links on purchase", val: bookingSms, set: setBookingSms },
              { label: "Email Tax E-Receipts", desc: "Official VAT invoice delivered to your verified inbox", val: paymentEmail, set: setPaymentEmail },
              { label: "Upcoming Event Reminders", desc: "Alerts 24 hours and 2 hours prior to movie or bus departure", val: eventReminders, set: setEventReminders },
              { label: "Promotions & Festival Presales", desc: "Early bird tickets and discount codes (e.g. MARAKI15)", val: promos, set: setPromos },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0C0E14] border border-[#E2E8F0] dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">{item.label}</h4>
                  <p className="text-[11px] text-[#64748B] dark:text-amber-300/70">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={item.val}
                  onChange={(e) => item.set(e.target.checked)}
                  className="w-4 h-4 rounded text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Appearance & Theme */}
        <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Appearance & Theme</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Customize your interface color palette preference.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
            {[
              { id: "light", label: "Light Mode", icon: Sun, desc: "Bright daylight" },
              { id: "dark", label: "Dark Mode", icon: Moon, desc: "Midnight obsidian" },
              { id: "system", label: "System Sync", icon: Laptop, desc: "Matches device OS" },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = theme === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setTheme(m.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#F59E0B] bg-[#FFFBEB] dark:bg-amber-950/60 ring-1 ring-[#F59E0B]"
                      : "border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14]"
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#F59E0B] mb-2" />
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">{m.label}</h4>
                  <span className="text-[10px] text-[#64748B] dark:text-amber-300/70">{m.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Language Selection */}
        <div className="rounded-3xl bg-white dark:bg-[#161922] border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] dark:bg-amber-950 text-[#F59E0B] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Language & Region</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Choose your preferred language for ticket text and alerts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
            {[
              { id: "EN", label: "English", sub: "Default" },
              { id: "AM", label: "አማርኛ (Amharic)", sub: "Active" },
              { id: "OM", label: "Afaan Oromoo", sub: "Active" },
              { id: "TI", label: "ትግርኛ (Tigrinya)", sub: "Active" },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  language === lang.id
                    ? "border-[#F59E0B] bg-[#FFFBEB] dark:bg-amber-950/60 font-bold text-[#F59E0B]"
                    : "border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0C0E14] text-[#0F172A] dark:text-white"
                }`}
              >
                <span className="text-xs font-bold block">{lang.label}</span>
                <span className="text-[10px] text-[#64748B] dark:text-amber-400/60">{lang.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Active Session & Sign Out */}
        <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/50 dark:border-slate-800/40 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Active Session</h3>
              <p className="text-xs text-muted-foreground">Log out of your current device session securely.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground max-w-lg">
              Signing out terminates your current active session on this device and clears all cached tickets and wallet passes.
            </p>
            <button
              type="button"
              onClick={() => {
                logout();
                toast.success("Signed out successfully");
                window.location.href = "/login";
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer shrink-0"
            >
              Sign Out of TIKORA
            </button>
          </div>
        </div>

        {/* 6. Privacy & Account Deletion */}
        <div className="rounded-3xl bg-white dark:bg-[#161922] border border-rose-200 dark:border-rose-950/60 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-rose-100 dark:border-rose-950/40 pb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-950 dark:text-rose-200">Danger Zone & Privacy</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Permanently purge your booking history, customer wallet, and account credentials.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-[#64748B] dark:text-amber-300/70 max-w-lg">
              Once initiated, your account deletion is irreversible. All unredeemed digital passes will become void.
            </p>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            >
              Request Account Deletion
            </button>
          </div>
        </div>
      </div>

      {/* Account Deletion Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#161922] border border-rose-200 dark:border-rose-900 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Delete Customer Account?</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Type <strong className="text-rose-600 font-mono">DELETE</strong> below to confirm deletion of your TIKORA profile and active wallet passes.
              </p>
              <input
                type="text"
                placeholder="Type DELETE"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-rose-300 text-center font-mono font-bold text-xs mt-3 text-rose-600"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmationText !== "DELETE"}
                onClick={() => {
                  alert("Account deletion request submitted.");
                  setShowDeleteDialog(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 disabled:opacity-50 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
