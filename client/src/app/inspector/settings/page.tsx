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
  Database,
  RefreshCw,
  Zap,
  KeyRound,
  ShieldAlert,
  Phone,
  Radio,
  Sliders,
  Check,
  Clock,
  Sparkles,
  ChevronDown,
  Info,
} from "lucide-react";
import { useInspectorStore } from "@/stores/inspector.store";
import { useTheme } from "@/providers/theme-provider";
import { toast } from "sonner";

type SettingsTab = "HARDWARE" | "SYNC" | "SECURITY" | "PROFILE";

export default function InspectorSettingsPage() {
  const {
    profile,
    scannerSoundEnabled,
    setScannerSound,
    scannerVibrateEnabled,
    setScannerVibrate,
    autoResetDurationSec,
    setAutoResetDuration,
  } = useInspectorStore();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<SettingsTab>("HARDWARE");

  // Hardware scanner options
  const [flashlightAssist, setFlashlightAssist] = useState(true);
  const [rapidCrowdMode, setRapidCrowdMode] = useState(false);
  const [cameraPreference, setCameraPreference] = useState("BACK_WIDE");

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Just now");
  const [dataSaverMode, setDataSaverMode] = useState(false);

  // Security & PIN state
  const [quickPin, setQuickPin] = useState("4829");
  const [autoLockTimeout, setAutoLockTimeout] = useState("5");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Play browser synthesizer beep for audio chime test
  const playTestBeep = (type: "valid" | "alert") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "valid") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
        toast.success("Playing valid pass chime (880Hz)");
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
        toast.warning("Playing alert warning buzzer (220Hz)");
      }
    } catch {
      toast.info(`Audio alert simulated for ${type}`);
    }
  };

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime("Just now");
      toast.success("Database cache refreshed: 1,240 valid passes synced to local memory.");
    }, 1000);
  };

  const handlePinSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPin.length !== 4 || !/^\d+$/.test(quickPin)) {
      toast.error("Gate Handover PIN must be exactly 4 numeric digits.");
      return;
    }
    toast.success("Gate Handover PIN updated successfully.");
  };

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
    }, 600);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "HARDWARE", label: "Scanner & Hardware", icon: Smartphone },
    { id: "SYNC", label: "Offline & Gate Sync", icon: Database },
    { id: "SECURITY", label: "PIN & Security", icon: Lock },
    { id: "PROFILE", label: "Profile & Dispatch", icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Inspector Identity Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-base shrink-0 border border-amber-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-foreground truncate">
                {profile.fullName}
              </h1>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300">
                {profile.inspectorId}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {profile.organizationName} • {profile.assignedStation} ({profile.terminalGate})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-foreground">{profile.deviceInfo.deviceModel}</span>
          </div>
        </div>
      </div>

      {/* Mobile Tab Selector (Compact Select Dropdown for screens < 640px) */}
      <div className="sm:hidden">
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
          Select Settings Category
        </label>
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as SettingsTab)}
            className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 text-xs font-bold text-foreground appearance-none shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Desktop / Tablet Segmented Pill Bar */}
      <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-white dark:bg-[#161922] text-amber-600 dark:text-amber-400 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HARDWARE & SCANNER PREFERENCES */}
      {activeTab === "HARDWARE" && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-600" />
                <span>Scanner Hardware & Feedback</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Configure camera sensors, haptic motor vibration, and audio chimes for fast boarding gates.
              </p>
            </div>

            <div className="space-y-3">
              {/* Audio Chime Switch */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    Audio Chime on Verification
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Play distinct pleasant chime for valid pass and buzz for duplicates or rejected passes.
                  </span>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => playTestBeep("valid")}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Test Chime
                  </button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scannerSoundEnabled}
                      onChange={(e) => {
                        setScannerSound(e.target.checked);
                        toast.info(`Audio chime ${e.target.checked ? "enabled" : "muted"}`);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                  </label>
                </div>
              </div>

              {/* Haptic Vibration */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    Haptic Vibration Feedback
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Tactile buzz on barcode capture to confirm scan without looking at the screen.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
                  <input
                    type="checkbox"
                    checked={scannerVibrateEnabled}
                    onChange={(e) => {
                      setScannerVibrate(e.target.checked);
                      toast.info(`Haptic vibration ${e.target.checked ? "enabled" : "disabled"}`);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                </label>
              </div>

              {/* Flashlight Auto-Assist */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    Torch Flashlight Auto-Assist
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Automatically activate rear LED light when scanning tickets in dimly lit bus bays or cinema halls.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
                  <input
                    type="checkbox"
                    checked={flashlightAssist}
                    onChange={(e) => {
                      setFlashlightAssist(e.target.checked);
                      toast.info(`Flashlight assist ${e.target.checked ? "enabled" : "disabled"}`);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                </label>
              </div>

              {/* Auto-Dismiss Timer */}
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2.5">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Auto-Dismiss Result Timer
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Automatically return camera viewfinder to active scanning after verifying a ticket.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
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
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                        autoResetDurationSec === sec
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {sec === 0 ? "Manual Only" : `${sec} Seconds`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Continuous Rapid Crowd Mode */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    Continuous Rapid Scan Mode (High-Density Crowds)
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    Bypasses full result modals during peak gate rush hours to maximize passenger throughput.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
                  <input
                    type="checkbox"
                    checked={rapidCrowdMode}
                    onChange={(e) => {
                      setRapidCrowdMode(e.target.checked);
                      toast.info(`Rapid crowd mode ${e.target.checked ? "activated" : "deactivated"}`);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OFFLINE & GATE SYNC */}
      {activeTab === "SYNC" && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-600" />
                <span>Offline Ticket Database & Gate Sync</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Ensures zero downtime at boarding gates even during total mobile network dropouts.
              </p>
            </div>

            {/* Offline Cache Status Card */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-foreground">
                      In-Memory Cache Active
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    1,240 digital tickets for today are stored in encrypted device storage.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleForceSync}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? "Syncing..." : "Force Sync Now"}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-amber-500/15 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Last Synced</span>
                  <span className="font-mono font-bold text-foreground">{lastSyncTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Offline Scans Queued</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    0 pending
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Cache Size</span>
                  <span className="font-mono font-bold text-foreground">420 KB</span>
                </div>
              </div>
            </div>

            {/* Data Saver Mode Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  Low Bandwidth / Data Saver Mode
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  Disables high-resolution seat previews and passenger profile photos on 2G/3G connections.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={dataSaverMode}
                  onChange={(e) => {
                    setDataSaverMode(e.target.checked);
                    toast.info(`Data saver ${e.target.checked ? "enabled" : "disabled"}`);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PIN & TERMINAL SECURITY */}
      {activeTab === "SECURITY" && (
        <div className="space-y-4">
          {/* Quick Gate Handover PIN */}
          <form onSubmit={handlePinSave} className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Rapid Gate Handover PIN</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Set a 4-digit numeric code to quickly hand over the terminal scanner to another inspector.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-full sm:w-48">
                <input
                  type="password"
                  maxLength={4}
                  value={quickPin}
                  onChange={(e) => setQuickPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="4 Digits"
                  className="w-full px-4 py-2.5 text-center text-sm tracking-widest font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
              >
                Update PIN
              </button>
            </div>
          </form>

          {/* Change Inspector Password */}
          <form onSubmit={handlePasswordSubmit} className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Change Portal Password</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Update your login password for the Tikora Inspector application.
              </p>
            </div>

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
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
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
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? "Hide Passwords" : "Show Passwords"}</span>
                </button>

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors disabled:opacity-60"
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: PROFILE & DISPATCH */}
      {activeTab === "PROFILE" && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Field Inspector Dispatch Profile</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Your credentials are cryptographically bound to {profile.organizationName}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-muted-foreground block">Inspector Full Name</span>
                <span className="font-bold text-foreground text-sm">{profile.fullName}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-muted-foreground block">Official Badge Code</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {profile.inspectorId}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-muted-foreground block">Assigned Provider</span>
                <span className="font-bold text-foreground">{profile.organizationName}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-muted-foreground block">Station & Gate Post</span>
                <span className="font-bold text-foreground">{profile.assignedStation} • {profile.terminalGate}</span>
              </div>
            </div>

            {/* Supervisor Hotline */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-foreground block">
                  Station Supervisor Emergency Dispatch
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Direct line for ticket counterfeiting, violence, or terminal gate lockouts.
                </span>
              </div>
              <a
                href="tel:+251911234567"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-xs self-start sm:self-auto shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Dispatch (+251 911 234 567)</span>
              </a>
            </div>

            {/* Theme Selector */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-foreground block">
                Visual Theme Preference
              </span>
              <p className="text-[11px] text-muted-foreground">
                Dark theme is recommended for outdoor gate shifts to extend mobile device battery life.
              </p>
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {[
                  { id: "light" as const, label: "Light", icon: Sun },
                  { id: "dark" as const, label: "Dark", icon: Moon },
                  { id: "system" as const, label: "System", icon: Laptop },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                        isSelected
                          ? "border-amber-600 bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-amber-600/30 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
