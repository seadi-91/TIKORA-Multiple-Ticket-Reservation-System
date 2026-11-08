"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bus,
  Film,
  Calendar,
  Trophy,
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
    fetchOrganizationServices,
  } = useInspectorStore();

  useEffect(() => {
    if (assignments.length === 0) {
      fetchOrganizationServices();
    }
  }, [assignments.length, fetchOrganizationServices]);

  const activeAssignment =
    assignments.find((a) => a.id === currentAssignmentId) || assignments[0] || {
      title: "Active Duty Post",
      gate: "Gate 1",
      venueOrTerminal: "Terminal",
      scheduledTime: "Now",
    };

  const [cameraActive, setCameraActive] = useState(true);
  const [torchActive, setTorchActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [manualCode, setManualCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeOutcome, setActiveOutcome] = useState<ReturnType<typeof verifyTicket> | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Sector-tailored terminology
  const getSectorMeta = () => {
    switch (profile.category) {
      case "CINEMA":
        return {
          icon: Film,
          label: "Auditorium Usher Scanner",
          unitLabel: "Patron",
          seatLabel: "Auditorium Seat / Hall",
          timePrefix: "Showtime:",
          successTitle: "Admission Approved",
        };
      case "BUS":
        return {
          icon: Bus,
          label: "Coach Boarding Scanner",
          unitLabel: "Passenger",
          seatLabel: "Coach Seat",
          timePrefix: "Departs:",
          successTitle: "Boarding Approved",
        };
      case "EVENT":
        return {
          icon: Calendar,
          label: "Festival Turnstile Scanner",
          unitLabel: "Guest",
          seatLabel: "Access Tier / Table",
          timePrefix: "Starts:",
          successTitle: "Entry Approved",
        };
      case "SPORTS":
        return {
          icon: Trophy,
          label: "Stadium Turnstile Scanner",
          unitLabel: "Fan",
          seatLabel: "Tribune Stand / Gate",
          timePrefix: "Kickoff:",
          successTitle: "Turnstile Approved",
        };
    }
  };

  const sector = getSectorMeta();
  const SectorIcon = sector.icon;

  // Play audio chime
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
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {}
  };

  // Perform verification
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
        toast.success(`Access Approved: ${outcome.passengerName} (${outcome.seatNumber || "--"})`);
      } else if (outcome.result === "ALREADY_USED") {
        toast.warning("Duplicate Pass Detected! Already Scanned.");
      } else if (outcome.result === "WRONG_ASSIGNMENT") {
        toast.info(outcome.message);
      } else {
        toast.error("Invalid Voucher Signature.");
      }

      setCountdown(5);
    }, 350);
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
      <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <SectorIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold text-foreground">
              <span className="text-sm">{activeAssignment.title}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[11px] text-muted-foreground">
              {profile.organizationName} • {activeAssignment.gate} • {sector.timePrefix} {activeAssignment.scheduledTime}
            </span>
          </div>
        </div>

        {/* Change Session Selector */}
        <div className="flex items-center gap-2">
          <select
            value={currentAssignmentId}
            onChange={(e) => setCurrentAssignment(e.target.value)}
            disabled={assignments.length === 0}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
          >
            {assignments.length === 0 ? (
              <option value="">No Active Duty Shift</option>
            ) : (
              assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.gate} - {a.title.slice(0, 24)}...
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Main Viewport Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Viewfinder Column */}
        <div className="md:col-span-2 space-y-3">
          <div className="relative aspect-4/3 sm:aspect-16/11 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col items-center justify-center text-white select-none">
            {/* Viewfinder Background */}
            <div className="absolute inset-0 bg-radial from-slate-900 via-slate-950 to-black opacity-90" />

            {/* Scanning Laser Line (Animated) */}
            {cameraActive && !activeOutcome && (
              <div className="absolute inset-x-8 h-0.5 bg-amber-500 shadow-[0_0_15px_#F59E0B] z-10 animate-[bounce_2.5s_infinite]" />
            )}

            {/* Target Reticle / Alignment Frame */}
            <div className="relative z-10 w-52 h-52 sm:w-60 sm:h-60 border border-white/20 rounded-2xl flex items-center justify-center">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-500 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-500 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-500 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-500 rounded-br-lg" />

              {cameraActive ? (
                <div className="text-center p-4 space-y-1.5">
                  <QrCode className="w-10 h-10 text-white/40 mx-auto" />
                  <span className="text-xs font-semibold text-white/80 block">
                    Align {profile.category === "CINEMA" ? "Cinema" : profile.category === "BUS" ? "Boarding" : "Pass"} QR Code
                  </span>
                  <span className="text-[10px] text-white/50 block">
                    {profile.organizationName}
                  </span>
                </div>
              ) : (
                <div className="text-center p-4 space-y-1.5">
                  <CameraOff className="w-10 h-10 text-white/40 mx-auto" />
                  <span className="text-xs font-semibold text-white/60 block">Camera Paused</span>
                </div>
              )}
            </div>

            {/* Top Toolbar Overlay */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{sector.label}</span>
              </div>

              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={() => setTorchActive(!torchActive)}
                  className={`p-1.5 rounded-full transition-colors ${
                    torchActive ? "bg-amber-500 text-black" : "text-white/80 hover:text-white"
                  }`}
                  title="Toggle Flashlight"
                >
                  {torchActive ? <Flashlight className="w-3.5 h-3.5" /> : <FlashlightOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setScannerSound(!scannerSoundEnabled)}
                  className={`p-1.5 rounded-full transition-colors ${
                    scannerSoundEnabled ? "text-white" : "text-white/40"
                  }`}
                  title="Toggle Sound"
                >
                  {scannerSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Live Scanner Operational Status */}
          <div className="p-4 rounded-2xl bg-card border border-slate-200/60 dark:border-slate-800/60 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-foreground">Camera Engine Online</span>
              <span className="text-muted-foreground">• Ready for QR & Code-128 scans</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {profile.organizationName}
            </span>
          </div>
        </div>

        {/* Right Column: Manual Entry & Active Result Card */}
        <div className="space-y-4">
          {/* Active Result Card */}
          {activeOutcome ? (
            <div
              className={`rounded-2xl border p-4 shadow-md space-y-3 transition-all ${
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
                  {activeOutcome.result === "VALID" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {activeOutcome.result === "ALREADY_USED" && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                  {activeOutcome.result === "WRONG_ASSIGNMENT" && <ShieldAlert className="w-5 h-5 text-purple-600" />}
                  {activeOutcome.result === "INVALID" && <XCircle className="w-5 h-5 text-rose-600" />}
                  {activeOutcome.result === "EXPIRED" && <Clock className="w-5 h-5 text-amber-600" />}

                  <span className="font-extrabold text-xs uppercase tracking-wider">
                    {activeOutcome.result === "VALID"
                      ? sector.successTitle
                      : activeOutcome.result === "ALREADY_USED"
                      ? "Duplicate Ticket Warning"
                      : activeOutcome.result === "WRONG_ASSIGNMENT"
                      ? "Cross-Sector Pass Rejected"
                      : "Invalid Voucher"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDismissResult}
                  className="p-1 rounded-lg hover:bg-black/10 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Breakdown */}
              <div className="bg-card/90 rounded-xl p-3 text-xs space-y-2 border border-border/50">
                <div className="flex justify-between items-center border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="font-mono font-bold text-amber-600 text-xs">
                    {activeOutcome.ticketReference}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">{sector.unitLabel}:</span>
                  <span className="font-bold text-foreground">{activeOutcome.passengerName}</span>
                </div>

                {activeOutcome.seatNumber && (
                  <div className="flex justify-between items-center border-b border-border/40 pb-1.5">
                    <span className="text-muted-foreground">{sector.seatLabel}:</span>
                    <span className="font-mono font-bold text-emerald-600">{activeOutcome.seatNumber}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="text-muted-foreground font-mono">{activeOutcome.verifiedAt}</span>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed italic">{activeOutcome.message}</p>

              {countdown !== null && (
                <div className="text-[10px] text-muted-foreground text-center font-mono">
                  Auto-dismiss in {countdown}s
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-center space-y-2">
              <QrCode className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-xs font-bold text-foreground">Waiting for Scan</p>
              <p className="text-[11px] text-muted-foreground">
                Scan via camera viewfinder or enter the code manually below.
              </p>
            </div>
          )}

          {/* Manual Code Input Form */}
          <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-amber-600" />
              <span>Manual Check-In</span>
            </h4>

            <form onSubmit={handleManualSubmit} className="space-y-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. TH-CNM-4419 or TH-BUS-8829"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              <button
                type="submit"
                disabled={isVerifying || !manualCode.trim()}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? "Verifying..." : "Validate Pass"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
