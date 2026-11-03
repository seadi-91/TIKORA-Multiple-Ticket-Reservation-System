"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Send,
  Shield,
  Smartphone,
  XCircle,
} from "lucide-react";
import { useInspectorStore } from "@/stores/inspector.store";
import { toast } from "sonner";

export default function InspectorHelpPage() {
  const { profile } = useInspectorStore();

  const [issueCategory, setIssueCategory] = useState("SCANNER_CAMERA");
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What should I do if a passenger presents an 'ALREADY USED' duplicate QR code?",
      a: "Politely advise the passenger that this specific ticket voucher was already scanned and admitted. Check the timestamp shown on your scanner result. If they claim a companion booked it, inspect their booking SMS reference or contact the station dispatcher.",
    },
    {
      q: "What if the camera has trouble reading the passenger's phone screen?",
      a: "Ask the passenger to increase their mobile phone screen brightness to 100%. If reflection or glare is heavy, tilt the device slightly or use the Flashlight toggle in the scanner view. If the QR is still unreadable, type the 10-character code (e.g. TH-BUS-8829) into the Manual Entry box.",
    },
    {
      q: "Why does the scanner say 'WRONG TERMINAL / SERVICE'?",
      a: "The ticket presented is a genuine TIKORA voucher, but for a different route, movie screening, or concert (e.g. Cinema instead of Bus). Check the expected service shown in the result box and guide the passenger to their correct terminal or venue.",
    },
    {
      q: "Can I inspect tickets without an active internet connection?",
      a: "Yes. The TIKORA Inspector client caches the passenger manifest for your active gate assignment locally. When internet connectivity is restored, all offline verifications sync automatically to the central server.",
    },
  ];

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) {
      toast.error("Please enter a description of the issue.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIssueDescription("");
      toast.success(
        "Support ticket submitted to Provider Operations. A dispatcher will assist shortly."
      );
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Inspector Field Manual & Support
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Gate verification guidelines, troubleshooting protocols, and direct dispatch contacts.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-xs text-foreground">Green: Boarding Approved</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Verify allocated seat number on coach or stadium tribune. Admit passenger and scan next.
          </p>
        </div>

        <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-xs text-foreground">Amber: Duplicate Detected</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Barcode was already checked in. Disallow entry and refer passenger to terminal supervisor.
          </p>
        </div>

        <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-xs text-foreground">Red: Invalid Signature</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Unrecognized cryptographic voucher. Does not exist in the TIKORA central registry.
          </p>
        </div>
      </div>

      {/* Main Grid: FAQ & Contact / Report */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: FAQs */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              Frequently Asked Gate Inspection Questions
            </h3>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden text-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-3.5 text-left font-semibold text-foreground flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform ${
                        openFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="p-3.5 pt-0 text-[11px] text-muted-foreground leading-relaxed border-t border-slate-100 dark:border-slate-800/30 bg-slate-50/50 dark:bg-slate-800/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Dispatch Hotline & Issue Reporter */}
        <div className="space-y-4">
          {/* Dispatch Hotline Card */}
          <div className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Provider Dispatch Hotline
            </h3>

            <div className="space-y-2">
              <span className="font-bold text-foreground block">{profile.organizationName}</span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-mono font-medium">+251 11 551 2288</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>Meskel Square Behind Stadium, Addis Ababa</span>
              </div>
            </div>
          </div>

          {/* Quick Issue Report Form */}
          <form
            onSubmit={handleSubmitSupport}
            className="bg-card border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-3 text-xs"
          >
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Report Hardware / App Issue
            </h3>

            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">Issue Category</label>
              <select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border/70 bg-background text-foreground"
              >
                <option value="SCANNER_CAMERA">Camera Viewfinder Problem</option>
                <option value="BATTERY_OVERHEAT">Device Overheating / Battery</option>
                <option value="BARCODE_UNREADABLE">Unreadable High-Density QR</option>
                <option value="NETWORK_SYNC">Offline Sync Delay</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe gate location or error code..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border/70 bg-background text-foreground resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Send to Operations"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

