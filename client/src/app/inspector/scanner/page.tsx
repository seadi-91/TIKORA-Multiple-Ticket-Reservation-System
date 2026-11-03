"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bus,
  Camera,
  CameraOff,
  CheckCircle2,
  Clock,
  Flashlight,
  FlashlightOff,
  History,
  Keyboard,
  MapPin,
  Maximize2,
  Minimize2,
  QrCode,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  SwitchCamera,
  Ticket,
  User,
  Volume2,
  VolumeX,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useInspectorStore, VerificationResultType } from "@/stores/inspector.store";
import { toast } from "sonner";

export default function TicketScannerPage() {
  const {
    profile,
    assignments,
    currentAssignmentId,
    setCurrentAssignment,
    verifyTicket,
    scannerSoundEnabled,
    setScannerSound,
  } = useInspectorStore();

  const activeAssignment =
    assignments.find((a) => a.id === currentAssignmentId) || assignments[0];

  const [cameraActive, setCameraActive] = useState(true);
  const [torchActive, setTorchActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [manualCode, setManualCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeOutcome, setActiveOutcome] = useState<ReturnType<typeof verifyTicket> | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Play synthetic audio chime using Web Audio API
  const playAudioBeep = (type: VerificationResultType) => {
    if (!scannerSoundEnabled) return;
    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "VALID") {
        // High double success chime
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else {
        // Low double buzz
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Audio not permitted or supported
    }
  };

  // Execute verification logic
  const handlePerformVerification = (codeToVerify: string) => {
    if (!codeToVerify.trim()) {
      toast.error("Please enter or scan a ticket reference code");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const outcome = verifyTicket(codeToVerify);
      setActiveOutcome(outcome);
      setIsVerifying(false);
      setManualCode("");
      playAudioBeep(outcome.result);

      if (outcome.result === "VALID") {
        toast.success(`Access Approved: ${outcome.passengerName} (Seat ${outcome.seatNumber || "--"})`);
      } else if (outcome.result === "ALREADY_USED") {
        toast.warning("Duplicate Pass Detected! Already Scanned.");
      } else if (outcome.result === "WRONG_ASSIGNMENT") {
        toast.info("Wrong Service / Venue for this pass.");
      } else {
        toast.error("Invalid Voucher Signature.");
      }

      // Start auto-dismiss countdown (5s)
      setCountdown(5);
    }, 400);
  };

  // Auto reset timer
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setActiveOutcome(null);
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePerformVerification(manualCode);
  };

  const handleDismissResult = () => {
    setActiveOutcome(null);
    setCountdown(null);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Assignment Bar */}
      <div className="bg-card border border-border/70 rounded-xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-600/20">
            <Bus className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <span>{activeAssignment.title}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[11px] text-muted-foreground">
              {activeAssignment.venueOrTerminal} • {activeAssignment.gate} • Departs {activeAssignment.scheduledTime}
            </span>
          </div>
        </div>

        {/* Change Gate Session Selector */}
        <div className="flex items-center gap-2">
          <select
            value={currentAssignmentId}
            onChange={(e) => setCurrentAssignment(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-border/70 bg-background text-foreground"
          >
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.gate} - {a.title.slice(0, 24)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Viewport Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Viewfinder Column */}
        <div className="md:col-span-2 space-y-3">
          <div className="relative aspect-4/3 sm:aspect-16/11 bg-slate-950 rounded-2xl overflow-hidden border border-border/70 shadow-lg flex flex-col items-center justify-center text-white select-none">
            {/* Simulated Live Viewfinder Background */}
            <div className="absolute inset-0 bg-radial from-slate-900 via-slate-950 to-black opacity-90" />

            {/* Scanning Laser Line (Animated) */}
            {cameraActive && !activeOutcome && (
              <div className="absolute inset-x-8 h-0.5 bg-amber-500 shadow-[0_0_15px_#F59E0B] z-10 animate-[bounce_2.5s_infinite]" />
            )}

            {/* Target Reticle / Alignment Frame */}
            <div className="relative z-10 w-56 h-56 sm:w-64 sm:h-64 border-2 border-white/20 rounded-2xl flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-500 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-500 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-500 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-500 rounded-br-lg" />

              {cameraActive ? (
                <div className="text-center p-4 space-y-1.5">
                  <QrCode className="w-12 h-12 text-white/40 mx-auto" />
                  <span className="text-xs font-semibold text-white/70 block">
                    Align Ticket QR Code
                  </span>
                  <span className="text-[10px] text-white/50 block">
                    Keep voucher within frame
                  </span>
                </div>
              ) : (
                <div className="text-center p-4 space-y-1.5">
                  <CameraOff className="w-10 h-10 text-white/40 mx-auto" />
                  <span className="text-xs font-semibold text-white/70 block">Camera Paused</span>
                </div>
              )}
            </div>

            {/* Viewfinder Top Controls */}
            <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-semibold border border-white/10 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Camera Feed
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTorchActive(!torchActive)}
                  className={`p-2 rounded-full backdrop-blur-md border transition-colors ${
                    torchActive
                      ? "bg-amber-500 text-black border-amber-400"
                      : "bg-black/60 text-white/80 border-white/10 hover:text-white"
                  }`}
                  title="Flashlight"
                >
                  {torchActive ? (
                    <Flashlight className="w-3.5 h-3.5" />
                  ) : (
                    <FlashlightOff className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCameraFacing(cameraFacing === "environment" ? "user" : "environment")
                  }
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/10 hover:text-white transition-colors"
                  title="Flip camera"
                >
                  <SwitchCamera className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setScannerSound(!scannerSoundEnabled)}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/10 hover:text-white transition-colors"
                  title="Audio Chime"
                >
                  {scannerSoundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Viewfinder Bottom Toggle Button */}
            <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setCameraActive(!cameraActive)}
                className="px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white/90 text-xs font-semibold border border-white/10 hover:bg-black transition-colors"
              >
                {cameraActive ? "Pause Camera" : "Resume Camera"}
              </button>
            </div>
          </div>

          {/* Quick Mock QR Scans (Field Simulator for demonstration) */}
          <div className="bg-card border border-border/70 rounded-xl p-3 shadow-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Quick QR Simulator Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => handlePerformVerification("TH-BUS-8829")}
                className="p-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-left transition-colors"
              >
                <span className="font-bold text-[11px] block">Valid Pass</span>
                <span className="font-mono text-[10px] text-muted-foreground">TH-BUS-8829</span>
              </button>

              <button
                type="button"
                disabled={isVerifying}
                onClick={() => handlePerformVerification("TH-BUS-8829")}
                className="p-2 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-left transition-colors"
              >
                <span className="font-bold text-[11px] block">Duplicate QR</span>
                <span className="font-mono text-[10px] text-muted-foreground">Rescan 8829</span>
              </button>

              <button
                type="button"
                disabled={isVerifying}
                onClick={() => handlePerformVerification("TH-CNM-4419")}
                className="p-2 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-left transition-colors"
              >
                <span className="font-bold text-[11px] block">Wrong Service</span>
                <span className="font-mono text-[10px] text-muted-foreground">Cinema Pass</span>
              </button>

              <button
                type="button"
                disabled={isVerifying}
                onClick={() => handlePerformVerification("FAKE-SIGNATURE-001")}
                className="p-2 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-left transition-colors"
              >
                <span className="font-bold text-[11px] block">Invalid / Forged</span>
                <span className="font-mono text-[10px] text-muted-foreground">Bad Key</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Manual Entry & Verification Result Card */}
        <div className="space-y-4">
          {/* Active Result Card (When a ticket is verified) */}
          {activeOutcome ? (
            <div
              className={`rounded-xl border p-4 shadow-md space-y-3 animate-in fade-in zoom-in-95 duration-150 ${
                activeOutcome.result === "VALID"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-foreground"
                  : activeOutcome.result === "ALREADY_USED"
                  ? "bg-amber-500/10 border-amber-500/40 text-foreground"
                  : activeOutcome.result === "WRONG_ASSIGNMENT"
                  ? "bg-purple-500/10 border-purple-500/40 text-foreground"
                  : "bg-rose-500/10 border-rose-500/40 text-foreground"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeOutcome.result === "VALID" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  {activeOutcome.result === "ALREADY_USED" && (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  )}
                  {activeOutcome.result === "WRONG_ASSIGNMENT" && (
                    <ShieldAlert className="w-5 h-5 text-purple-600" />
                  )}
                  {activeOutcome.result === "INVALID" && (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  {activeOutcome.result === "EXPIRED" && (
                    <Clock className="w-5 h-5 text-amber-600" />
                  )}

                  <span className="font-bold text-xs uppercase tracking-wider">
                    {activeOutcome.result === "VALID"
                      ? "Boarding Approved"
                      : activeOutcome.result === "ALREADY_USED"
                      ? "Duplicate Ticket Warning"
                      : activeOutcome.result === "WRONG_ASSIGNMENT"
                      ? "Wrong Terminal / Service"
                      : activeOutcome.result === "EXPIRED"
                      ? "Expired Voucher"
                      : "Invalid Voucher"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDismissResult}
                  className="p-1 rounded hover:bg-black/10 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Passenger & Ticket Breakdown */}
              <div className="bg-card/90 rounded-lg p-3 text-xs space-y-2 border border-border/50">
                <div className="flex justify-between items-center border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">Ticket Reference:</span>
                  <span className="font-mono font-bold text-amber-600 text-xs">
                    {activeOutcome.ticketReference}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">Passenger:</span>
                  <span className="font-bold text-foreground">
                    {activeOutcome.passengerName}
                  </span>
                </div>

                {activeOutcome.seatNumber && (
                  <div className="flex justify-between items-center border-b border-border/40 pb-1.5">
                    <span className="text-muted-foreground">Allocated Seat:</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {activeOutcome.seatNumber}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Verified At:</span>
                  <span className="text-muted-foreground font-mono">
                    {activeOutcome.verifiedAt}
                  </span>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed italic text-muted-foreground">
                &quot;{activeOutcome.message}&quot;
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleDismissResult}
                  className={`w-full py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors ${
                    activeOutcome.result === "VALID"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {activeOutcome.result === "VALID" ? "Admit & Scan Next" : "Dismiss"}
                  {countdown !== null && ` (${countdown}s)`}
                </button>
              </div>
            </div>
          ) : (
            /* Standby Status Card */
            <div className="bg-card border border-border/70 rounded-xl p-4 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center border border-amber-600/20">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Scanner Standby</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Point device camera at customer QR voucher or enter alphanumeric reference below.
                </p>
              </div>
            </div>
          )}

          {/* Manual Reference Input Form */}
          <div className="bg-card border border-border/70 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Manual Ticket Entry</span>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TH-BUS-8829"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-border/70 bg-background text-foreground uppercase tracking-wider"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || !manualCode.trim()}
                className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify Reference"}
              </button>
            </form>
          </div>

          {/* Inspector Field Instructions */}
          <div className="bg-muted/30 border border-border/50 rounded-xl p-3 text-xs text-muted-foreground space-y-1">
            <span className="font-semibold text-foreground text-[11px] block">
              Gate Inspection Protocol:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li>Verify national ID matches boarding passenger name.</li>
              <li>Inspect luggage baggage tag stubs before admitting.</li>
              <li>Report duplicate barcodes immediately to station manager.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
