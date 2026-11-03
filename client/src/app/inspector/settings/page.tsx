"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Eye,
  EyeOff,
  Laptop,
  Lock,
  Moon,
  Save,
  Shield,
  Smartphone,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useInspectorStore } from "@/stores/inspector.store";
import { useTheme } from "@/providers/theme-provider";
import { toast } from "sonner";

export default function InspectorSettingsPage() {
  const {
    scannerSoundEnabled,
    setScannerSound,
    scannerVibrateEnabled,
    setScannerVibrate,
    autoResetDurationSec,
    setAutoResetDuration,
  } = useInspectorStore();
  const { theme, setTheme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [notifs, setNotifs] = useState({
    assignmentAlerts: true,
    gateChangeAlerts: true,
    shiftReminders: true,
    soundAlerts: true,
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("New passwords do not match or are empty.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Inspector portal password updated successfully.");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Inspector Device & System Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure QR scanner hardware preferences, security credentials, and alerts.
        </p>
      </div>

      {/* Section 1: Scanner & Feedback Hardware */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-amber-600" />
          <span>Scanner Hardware & Feedback</span>
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Audio Beep on Verification
              </span>
              <span className="text-[11px] text-muted-foreground">
                Play distinct pleasant chime for valid pass and buzz for duplicates or invalid tickets.
              </span>
            </div>
            <input
              type="checkbox"
              checked={scannerSoundEnabled}
              onChange={(e) => {
                setScannerSound(e.target.checked);
                toast.info(`Audio chime ${e.target.checked ? "enabled" : "muted"}`);
              }}
              className="rounded-lg border-slate-300 dark:border-slate-700 text-amber-600 focus:ring-amber-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Haptic Vibration on Scan
              </span>
              <span className="text-[11px] text-muted-foreground">
                Vibrate mobile scanner hardware upon barcode capture.
              </span>
            </div>
            <input
              type="checkbox"
              checked={scannerVibrateEnabled}
              onChange={(e) => {
                setScannerVibrate(e.target.checked);
                toast.info(`Vibration ${e.target.checked ? "enabled" : "disabled"}`);
              }}
              className="rounded-lg border-slate-300 dark:border-slate-700 text-amber-600 focus:ring-amber-500"
            />
          </label>

          <div className="p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 space-y-2">
            <span className="text-xs font-semibold text-foreground block">
              Auto-Dismiss Result Timer
            </span>
            <p className="text-[11px] text-muted-foreground">
              Automatically return to active camera viewfinder after verifying a ticket.
            </p>
            <div className="flex gap-2 pt-1">
              {[3, 5, 10, 0].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    setAutoResetDuration(sec);
                    toast.success(
                      sec === 0
                        ? "Manual result dismissal enabled"
                        : `Auto-dismiss set to ${sec} seconds`
                    );
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    autoResetDurationSec === sec
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-slate-200/60 dark:bg-slate-700/60 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-foreground"
                  }`}
                >
                  {sec === 0 ? "Manual Only" : `${sec}s`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Display & Appearance */}
      <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Visual Theme
        </h3>
        <p className="text-xs text-muted-foreground">
          Dark mode is recommended for night gate operations to optimize mobile battery life.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "light" as const, label: "Light Theme", icon: Sun },
            { id: "dark" as const, label: "Dark Theme", icon: Moon },
            { id: "system" as const, label: "System Sync", icon: Laptop },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? "border-amber-600 bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-amber-600/30 shadow-xs"
                    : "border-slate-200/60 dark:border-slate-800/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 mb-1.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Change Password */}
      <form onSubmit={handlePasswordSubmit} className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-amber-600" />
          <span>Change Inspector Password</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Current Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPassword ? "Hide Passwords" : "Show Passwords"}</span>
            </button>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors disabled:opacity-60"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

