"use client";

import React, { useState } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  ShieldCheck,
  Smartphone,
  User,
} from "lucide-react";
import { useInspectorStore } from "@/stores/inspector.store";
import { toast } from "sonner";

export default function InspectorProfilePage() {
  const { profile, updateProfile } = useInspectorStore();

  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
      setIsSaving(false);
      toast.success("Inspector contact profile updated successfully.");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Inspector Personnel Credentials
        </h1>
        <p className="text-xs text-muted-foreground">
          Authorized verification officer profile registered by {profile.organizationName}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Official Badge Card */}
        <div className="space-y-4">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-amber-600 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
                {profile.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-card" />
            </div>

            <div>
              <h2 className="text-base font-bold text-foreground">{profile.fullName}</h2>
              <span className="text-xs text-amber-600 font-semibold">{profile.role}</span>
              <span className="text-[11px] font-mono text-muted-foreground block mt-1">
                ID: {profile.inspectorId}
              </span>
            </div>

            <div className="pt-2 border-t border-border/40 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned Org:</span>
                <span className="font-semibold text-foreground truncate max-w-[150px]">
                  {profile.organizationName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Station:</span>
                <span className="text-foreground">{profile.assignedStation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Primary Gate:</span>
                <span className="font-bold text-amber-600">{profile.terminalGate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Status:</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Active Duty
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registered:</span>
                <span className="text-muted-foreground">{profile.dateJoined}</span>
              </div>
            </div>
          </div>

          {/* Device & Hardware Info */}
          <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs space-y-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-muted-foreground text-[10px] block">
              Authorized Device Hardware
            </span>
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-semibold text-foreground block">
                  {profile.deviceInfo.deviceModel}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {profile.deviceInfo.scannerVersion}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Form & Non-Editable Notices */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Personal Contact Information</h3>
                <p className="text-xs text-muted-foreground">
                  Update your mobile phone and notification dispatch address
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                Editable Fields
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Officer Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Mobile Dispatch Phone
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "Saving..." : "Save Profile Details"}
              </button>
            </div>
          </form>

          {/* Read-Only Organizational Restrictions Card */}
          <div className="bg-muted/20 border border-border/60 rounded-xl p-5 text-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Security & Permission Restrictions</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Ticket Inspectors are created and provisioned directly by the Provider Owner. Your
              organization affiliation (<strong>{profile.organizationName}</strong>), assigned
              terminal station, and supervisory role cannot be altered from this portal. Contact your
              operations manager for transfer requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

