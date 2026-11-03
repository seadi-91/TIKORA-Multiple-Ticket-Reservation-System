"use client";

import React, { useState } from "react";
import {
  Bell,
  Building2,
  Landmark,
  Lock,
  Save,
  ShieldCheck,
} from "lucide-react";
import { useProviderStore } from "@/stores/provider.store";
import { toast } from "sonner";

export default function ProviderSettingsPage() {
  const { organization, updateOrganization } = useProviderStore();

  const [activeTab, setActiveTab] = useState<"GENERAL" | "PAYOUT" | "NOTIFICATIONS" | "SECURITY">(
    "GENERAL"
  );

  // Form states
  const [generalForm, setGeneralForm] = useState({
    name: organization.name,
    legalName: organization.legalName,
    email: organization.email,
    phone: organization.phone,
    website: organization.website,
    address: organization.address,
    city: organization.city,
    description: organization.description,
  });

  const [payoutForm, setPayoutForm] = useState({
    bankName: organization.payoutAccount.bankName,
    accountNumber: organization.payoutAccount.accountNumber,
    accountHolder: organization.payoutAccount.accountHolder,
  });

  const [notifPreferences, setNotifPreferences] = useState({
    bookingSMS: true,
    bookingEmail: true,
    lowStockAlerts: true,
    payoutDisbursedSMS: true,
    dailyDigestEmail: false,
  });

  const [securityForm, setSecurityForm] = useState({
    twoFactorEnabled: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateOrganization({
        name: generalForm.name,
        legalName: generalForm.legalName,
        email: generalForm.email,
        phone: generalForm.phone,
        website: generalForm.website,
        address: generalForm.address,
        city: generalForm.city,
        description: generalForm.description,
      });
      setIsSaving(false);
      toast.success("Organization profile updated successfully.");
    }, 500);
  };

  const handleSavePayout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateOrganization({
        payoutAccount: {
          bankName: payoutForm.bankName,
          accountNumber: payoutForm.accountNumber,
          accountHolder: payoutForm.accountHolder,
        },
      });
      setIsSaving(false);
      toast.success("Payout bank account settings updated.");
    }, 500);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSecurityForm({
        ...securityForm,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Security credentials & 2FA preferences updated.");
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Provider Account Settings
          </h1>
          <p className="text-xs text-muted-foreground">
            Configure organization branding, bank payouts, staff notifications, and API security.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/60 gap-4 overflow-x-auto text-xs font-semibold">
        {[
          { id: "GENERAL" as const, label: "Organization Profile", icon: Building2 },
          { id: "PAYOUT" as const, label: "Payout Bank Account", icon: Landmark },
          { id: "NOTIFICATIONS" as const, label: "Notification Triggers", icon: Bell },
          { id: "SECURITY" as const, label: "Security & API Keys", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-amber-600 text-amber-600 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: General & Profile */}
      {activeTab === "GENERAL" && (
        <form onSubmit={handleSaveGeneral} className="space-y-6 max-w-3xl">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Corporate Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Brand Display Name
                </label>
                <input
                  type="text"
                  required
                  value={generalForm.name}
                  onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Registered Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={generalForm.legalName}
                  onChange={(e) => setGeneralForm({ ...generalForm, legalName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Public Organization Description
              </label>
              <textarea
                rows={3}
                value={generalForm.description}
                onChange={(e) =>
                  setGeneralForm({ ...generalForm, description: e.target.value })
                }
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Business Email
                </label>
                <input
                  type="email"
                  required
                  value={generalForm.email}
                  onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Dispatch Phone
                </label>
                <input
                  type="text"
                  required
                  value={generalForm.phone}
                  onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Official Website
                </label>
                <input
                  type="url"
                  value={generalForm.website}
                  onChange={(e) => setGeneralForm({ ...generalForm, website: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Headquarters Physical Address
                </label>
                <input
                  type="text"
                  value={generalForm.address}
                  onChange={(e) => setGeneralForm({ ...generalForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">City</label>
                <input
                  type="text"
                  value={generalForm.city}
                  onChange={(e) => setGeneralForm({ ...generalForm, city: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                />
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
          </div>
        </form>
      )}

      {/* TAB 2: Payout Bank Account */}
      {activeTab === "PAYOUT" && (
        <form onSubmit={handleSavePayout} className="space-y-6 max-w-3xl">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Designated Bank Beneficiary
            </h3>

            <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground">
              Funds requested via the Payments portal will be electronically transferred via RTGS
              or direct API to this designated bank account within 2-4 business hours.
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Financial Institution / Bank
              </label>
              <select
                value={payoutForm.bankName}
                onChange={(e) => setPayoutForm({ ...payoutForm, bankName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
              >
                <option value="Commercial Bank of Ethiopia (CBE)">
                  Commercial Bank of Ethiopia (CBE)
                </option>
                <option value="Awash Bank">Awash Bank</option>
                <option value="Bank of Abyssinia">Bank of Abyssinia</option>
                <option value="Dashen Bank">Dashen Bank</option>
                <option value="Telebirr Merchant Payout">Telebirr Merchant Payout</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Bank Account Number / IBAN
                </label>
                <input
                  type="text"
                  required
                  value={payoutForm.accountNumber}
                  onChange={(e) =>
                    setPayoutForm({ ...payoutForm, accountNumber: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Exact Account Holder Name
                </label>
                <input
                  type="text"
                  required
                  value={payoutForm.accountHolder}
                  onChange={(e) =>
                    setPayoutForm({ ...payoutForm, accountHolder: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "Updating..." : "Save Bank Payout Account"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: Notifications */}
      {activeTab === "NOTIFICATIONS" && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Automated Alerts & Delivery Channels
            </h3>

            <div className="space-y-3">
              {[
                {
                  key: "bookingSMS",
                  title: "SMS Notification on Confirmed Bookings",
                  desc: "Send an instant operational SMS to the dispatch phone whenever 5+ seats are reserved.",
                },
                {
                  key: "bookingEmail",
                  title: "Email Booking Receipts",
                  desc: "Deliver copies of passenger booking confirmations and voucher PDF attachments.",
                },
                {
                  key: "lowStockAlerts",
                  title: "Low Inventory Warning Trigger",
                  desc: "Notify dispatch manager when coach seats or cinema tickets drop below 15% availability.",
                },
                {
                  key: "payoutDisbursedSMS",
                  title: "Bank Payout Settlement SMS",
                  desc: "Receive real-time confirmation SMS whenever TicketHub settles payouts to your CBE account.",
                },
                {
                  key: "dailyDigestEmail",
                  title: "Daily Departure & Revenue Digest",
                  desc: "Receive an automated morning PDF summary at 05:00 AM with all daily schedules.",
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/20 cursor-pointer transition-colors"
                >
                  <div className="pr-4">
                    <span className="text-xs font-semibold text-foreground block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-relaxed">
                      {item.desc}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={(notifPreferences as any)[item.key]}
                    onChange={(e) =>
                      setNotifPreferences({
                        ...notifPreferences,
                        [item.key]: e.target.checked,
                      })
                    }
                    className="mt-1 rounded border-border/70 text-amber-600 focus:ring-amber-500"
                  />
                </label>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  toast.success("Notification preferences saved successfully.");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
              >
                <Save className="w-3.5 h-3.5" /> Save Notification Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Security & API Keys */}
      {activeTab === "SECURITY" && (
        <form onSubmit={handleSaveSecurity} className="space-y-6 max-w-3xl">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Two-Factor Authentication (2FA)
            </h3>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Two-Factor Authentication is Enabled
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Required for initiating bank payouts and deleting routes.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSecurityForm({
                    ...securityForm,
                    twoFactorEnabled: !securityForm.twoFactorEnabled,
                  });
                  toast.info("2FA settings updated.");
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border/70 hover:bg-muted text-foreground"
              >
                {securityForm.twoFactorEnabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>

          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Change Provider Portal Password
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={securityForm.currentPassword}
                  onChange={(e) =>
                    setSecurityForm({ ...securityForm, currentPassword: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={securityForm.newPassword}
                    onChange={(e) =>
                      setSecurityForm({ ...securityForm, newPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={(e) =>
                      setSecurityForm({ ...securityForm, confirmPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-background text-foreground"
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
                <Lock className="w-3.5 h-3.5" /> Update Password
              </button>
            </div>
          </div>

          {/* Webhook API Integration */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Terminal Gate API Webhooks
            </h3>
            <p className="text-xs text-muted-foreground">
              Integrate your internal fleet tracking and automated turnstile turnstiles.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="th_live_sec_9948192841_selam_dispatch"
                  className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-border/70 bg-muted/40 font-mono text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("th_live_sec_9948192841_selam_dispatch");
                    toast.success("API Secret Key copied to clipboard.");
                  }}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-border/70 hover:bg-muted text-foreground"
                >
                  Copy Key
                </button>
              </div>
              <span className="text-[11px] text-muted-foreground block">
                Last regenerated on Oct 12, 2026. Keep this token strictly confidential.
              </span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
