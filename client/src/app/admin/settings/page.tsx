"use client";

import React, { useState, useMemo } from "react";
import {
  Globe,
  DollarSign,
  CreditCard,
  Lock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  Bell,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Search,
  Download,
  RotateCcw,
  Sliders,
  Check,
  ChevronRight,
  Percent,
  Clock,
  Smartphone,
  Zap,
  Layers,
  Sparkles,
  Filter,
  Menu,
  X,
} from "lucide-react";
import { useAdminStore, AdminSettings } from "@/stores/admin.store";
import { formatCurrency } from "@/lib/format-currency";
import { toast } from "sonner";

type SettingSection =
  | "GENERAL"
  | "AVAILABILITY"
  | "COMMISSIONS"
  | "TAX"
  | "PAYMENTS"
  | "PAYOUTS"
  | "REFUNDS"
  | "CUTOFFS"
  | "SECURITY_AUTH"
  | "INTRUSION"
  | "IP_AUDIT"
  | "QR_ENGINE"
  | "GATE_POLICIES"
  | "SMS_ALERTS";

interface NavItem {
  id: SettingSection;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminStore();

  const [activeSection, setActiveSection] = useState<SettingSection>("GENERAL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Form state initialized with store settings
  const [form, setForm] = useState<AdminSettings>({ ...settings });

  // Update specific field
  const updateField = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Detect unsaved changes
  const unsavedKeys = useMemo(() => {
    return (Object.keys(form) as (keyof AdminSettings)[]).filter(
      (key) => form[key] !== settings[key]
    );
  }, [form, settings]);

  const hasUnsavedChanges = unsavedKeys.length > 0;

  // Handle Save
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings(form);
    toast.success("Platform settings saved successfully!", {
      description: `${unsavedKeys.length || "All"} configuration values persisted & audit-logged.`,
    });
  };

  // Handle Discard
  const handleDiscard = () => {
    setForm({ ...settings });
    toast.info("Changes discarded. Restored current active configuration.");
  };

  // Handle Reset to Factory Defaults
  const handleResetToDefaults = () => {
    const factoryDefaults: AdminSettings = {
      platformName: "TIKORA Ethiopia",
      tagline: "Ethiopia's Unified Smart Ticket & Transit Hub",
      supportEmail: "support@tikora.et",
      supportPhone: "+251 115 500 000",
      headquartersAddress: "Bole Medhanialem, Mega Building 4th Floor, Addis Ababa",
      operatingRegion: "Federal Democratic Republic of Ethiopia",
      defaultTimezone: "Africa/Addis_Ababa (UTC+3)",
      defaultLanguage: "en",
      maintenanceMode: false,
      maintenanceNotice: "System upgrade in progress. Public bookings will resume shortly.",
      allowNewRegistrations: true,
      allowGuestCheckout: true,
      currency: "ETB",
      defaultCommissionRate: 5.0,
      busCommissionRate: 4.5,
      cinemaCommissionRate: 6.0,
      eventCommissionRate: 7.5,
      sportsCommissionRate: 5.0,
      vatTaxRate: 15.0,
      platformServiceFeeETB: 10,
      cartHoldDurationMinutes: 10,
      maxTicketsPerBooking: 8,
      telebirrEnabled: true,
      telebirrMerchantId: "TB-ET-994821",
      telebirrAutoSettle: true,
      cbeBirrEnabled: true,
      cbeBirrMerchantCode: "CBE-BIRR-44018",
      chapaEnabled: true,
      chapaMode: "LIVE",
      minPayoutThresholdETB: 1000,
      payoutSchedule: "DAILY",
      payoutProcessingFeeETB: 25,
      autoApproveRefundThreshold: 300,
      busCancellationCutoffHours: 4,
      cinemaCancellationCutoffHours: 2,
      eventCancellationCutoffHours: 24,
      sportsCancellationCutoffHours: 6,
      cancellationPenaltyRate: 10.0,
      disputeAutoEscalateHours: 48,
      twoFactorRequiredForAdmins: true,
      twoFactorRequiredForProviders: false,
      sessionTimeoutMinutes: 60,
      maxFailedLoginsLockout: 5,
      lockoutDurationMinutes: 30,
      enforcePasswordComplexity: true,
      ipWhitelistingEnabled: false,
      whitelistedAdminIPs: "197.156.104.22, 196.188.241.10",
      auditLogRetentionDays: 90,
      qrSignatureAlgorithm: "HMAC_SHA256",
      qrDynamicRotationEnabled: true,
      qrRotationIntervalSeconds: 60,
      offlineScanWindowHours: 12,
      allowDuplicateCheckInOverride: false,
      smsGatewayProvider: "ETHIO_TELECOM",
      smsSenderId: "TIKORA",
      smsTicketReceiptsEnabled: true,
      emailReceiptsEnabled: true,
      highValueTransactionAlertETB: 50000,
      systemAlertEmail: "security-ops@tikora.et",
    };

    setForm(factoryDefaults);
    updateSettings(factoryDefaults);
    setShowResetConfirm(false);
    toast.success("Factory defaults restored successfully!");
  };

  // Export JSON configuration file
  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(form, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `tikora-settings-${new Date().toISOString().split("T")[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Configuration exported as JSON file.");
  };

  // Sidebar navigation structure grouped by domain
  const navGroups: NavGroup[] = [
    {
      group: "SYSTEM & BRAND",
      items: [
        {
          id: "GENERAL",
          label: "General & Brand",
          sub: "Identity, contacts, region",
          icon: Globe,
        },
        {
          id: "AVAILABILITY",
          label: "Portal Availability",
          sub: "Maintenance, self-signups",
          icon: Zap,
        },
      ],
    },
    {
      group: "FINANCIAL & COMMISSIONS",
      items: [
        {
          id: "COMMISSIONS",
          label: "Take-Rates & Limits",
          sub: "Global, bus, cinema, sports %",
          icon: Percent,
        },
        {
          id: "TAX",
          label: "Taxes & Surcharges",
          sub: "VAT 15%, service fee, Birr",
          icon: DollarSign,
        },
        {
          id: "PAYMENTS",
          label: "Payment Gateways",
          sub: "Telebirr, CBE Birr, Chapa",
          icon: CreditCard,
        },
        {
          id: "PAYOUTS",
          label: "Payout Settlement",
          sub: "Thresholds, schedule, fees",
          icon: Building2,
        },
        {
          id: "REFUNDS",
          label: "Refunds & Disputes",
          sub: "Auto-approvals, penalties",
          icon: RotateCcw,
        },
        {
          id: "CUTOFFS",
          label: "Cancellation Deadlines",
          sub: "Departure cutoff notice",
          icon: Clock,
        },
      ],
    },
    {
      group: "SECURITY & COMPLIANCE",
      items: [
        {
          id: "SECURITY_AUTH",
          label: "Authentication & 2FA",
          sub: "TOTP mandates, timeouts",
          icon: Lock,
        },
        {
          id: "INTRUSION",
          label: "Intrusion Shield",
          sub: "Brute-force lockout & WAF",
          icon: ShieldAlert,
        },
        {
          id: "IP_AUDIT",
          label: "IP Bounds & Audits",
          sub: "CIDR whitelists, log tenure",
          icon: ShieldCheck,
        },
      ],
    },
    {
      group: "ENGINE & INTEGRATIONS",
      items: [
        {
          id: "QR_ENGINE",
          label: "QR Security Engine",
          sub: "HMAC signatures, anti-copy",
          icon: QrCode,
        },
        {
          id: "GATE_POLICIES",
          label: "Gate Scan Policies",
          sub: "Offline manifest, overrides",
          icon: CheckCircle2,
        },
        {
          id: "SMS_ALERTS",
          label: "SMS & Ops Alerts",
          sub: "Ethio Telecom SMS, alerts",
          icon: Bell,
        },
      ],
    },
  ];

  // Filter items based on search query
  const filteredNavGroups = useMemo(() => {
    if (!searchQuery.trim()) return navGroups;
    const q = searchQuery.toLowerCase();
    return navGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.sub.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/60 dark:border-slate-800/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider border border-amber-500/20">
              Enterprise Governance
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">TIKORA v2.4</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            System & Platform Configuration
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Export settings JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Reset default values"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleDiscard}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Discard
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              hasUnsavedChanges
                ? "bg-[#B45309] hover:bg-[#92400E] ring-2 ring-amber-500/30 animate-pulse"
                : "bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500"
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{hasUnsavedChanges ? `Save (${unsavedKeys.length})` : "Save Settings"}</span>
          </button>
        </div>
      </div>

      {/* Floating Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="font-bold text-amber-800 dark:text-amber-300">
              {unsavedKeys.length} pending setting {unsavedKeys.length === 1 ? "change" : "changes"}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDiscard}
              className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
            >
              Discard All
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              className="px-2.5 py-1 rounded-lg bg-[#B45309] text-white text-[11px] font-bold hover:bg-[#92400E] cursor-pointer"
            >
              Save Now
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MINIMUM WIDTH PARENT CARD WITH SIDEBAR STRUCTURE
          Left: Navigation Menu
          Right: Focused Configuration Details Panel
          ========================================================================= */}
      <div className="rounded-3xl bg-white dark:bg-[#161922] border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[640px]">
        {/* Mobile Settings Section Bar (Filter Button & Direct Dropdown) */}
        <div className="md:hidden p-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-foreground shadow-2xs hover:border-amber-500/40 transition-all cursor-pointer active:scale-95"
          >
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            <span>Sections</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          </button>

          {/* Quick Dropdown selector for mobile */}
          <div className="flex-1 min-w-0">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value as SettingSection)}
              className="w-full h-9 px-2.5 text-xs rounded-xl bg-card border border-slate-200/80 dark:border-slate-800 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30 truncate"
            >
              {navGroups.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Left-Side Slide-Out Drawer (when Filter / Sections is tapped) */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileDrawerOpen(false)}
            />

            {/* Left Drawer Container */}
            <div className="relative w-[300px] max-w-[85vw] h-full bg-white dark:bg-[#11131a] border-r border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col p-4 space-y-3.5 z-10 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Filter className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-foreground">Settings Navigation</h3>
                    <p className="text-[10px] text-muted-foreground">Select section to configure</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Search Input inside Drawer */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter settings..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#161922] border border-slate-200 dark:border-slate-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Navigation Items list inside Drawer */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                {filteredNavGroups.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block">
                      {group.group}
                    </span>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setActiveSection(item.id);
                              setMobileDrawerOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                              isActive
                                ? "bg-[#B45309] text-white shadow-xs font-bold"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                              <div className="min-w-0">
                                <span className="text-xs truncate block leading-tight">{item.label}</span>
                                <span className={`text-[9px] truncate block ${isActive ? "text-white/80" : "text-slate-400"}`}>
                                  {item.sub}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-slate-400/40"}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[10px] text-muted-foreground flex items-center justify-between">
                <span>TIKORA Governance</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Live v2.4</span>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Left Settings Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 border-r border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-[#11131a] p-3 sm:p-4 flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Quick Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter settings..."
                className="w-full pl-8 pr-7 py-1.5 rounded-xl text-xs bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Navigation Category Groups */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
              {filteredNavGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block">
                    {group.group}
                  </span>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer group ${
                            isActive
                              ? "bg-[#B45309] text-white shadow-xs font-bold"
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-transform ${
                                isActive
                                  ? "text-white"
                                  : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                              }`}
                            />
                            <div className="min-w-0">
                              <span className="text-xs truncate block leading-tight">
                                {item.label}
                              </span>
                              <span
                                className={`text-[9px] truncate block ${
                                  isActive
                                    ? "text-white/80"
                                    : "text-slate-400 dark:text-slate-500"
                                }`}
                              >
                                {item.sub}
                              </span>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                              isActive ? "text-white translate-x-0.5" : "text-slate-400/40 opacity-0 group-hover:opacity-100"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-3 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200/80 dark:border-slate-800 text-[10px] text-muted-foreground space-y-1">
            <div className="flex items-center justify-between font-bold text-foreground">
              <span>Platform Core</span>
              <span className="text-emerald-600 dark:text-emerald-400">Online</span>
            </div>
            <p className="text-[9px] leading-tight">
              All settings synchronize in real-time across microservices.
            </p>
          </div>
        </aside>

        {/* Right Settings Content Panel */}
        <main className="flex-1 min-w-0 p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-6 overflow-y-auto">
          {/* SECTION 1: GENERAL & IDENTITY */}
          {activeSection === "GENERAL" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  System & Brand
                </span>
                <h2 className="text-base font-bold text-foreground">General Platform Identity</h2>
                <p className="text-xs text-muted-foreground">
                  Public marketplace name, support communication routing, and headquarters data.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Platform Display Name</label>
                  <input
                    type="text"
                    value={form.platformName}
                    onChange={(e) => updateField("platformName", e.target.value)}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-foreground font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Marketplace Tagline</label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => updateField("tagline", e.target.value)}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Primary Support Email</label>
                  <input
                    type="email"
                    value={form.supportEmail}
                    onChange={(e) => updateField("supportEmail", e.target.value)}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-foreground font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Helpdesk Telephone Hotline</label>
                  <input
                    type="text"
                    value={form.supportPhone}
                    onChange={(e) => updateField("supportPhone", e.target.value)}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-foreground font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-foreground">Registered Headquarters Office</label>
                  <input
                    type="text"
                    value={form.headquartersAddress}
                    onChange={(e) => updateField("headquartersAddress", e.target.value)}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Jurisdiction & Region</label>
                  <input
                    type="text"
                    disabled
                    value={form.operatingRegion}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-muted-foreground cursor-not-allowed text-[11px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Default Operating Timezone</label>
                  <input
                    type="text"
                    disabled
                    value={form.defaultTimezone}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-muted-foreground cursor-not-allowed text-[11px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: PORTAL AVAILABILITY */}
          {activeSection === "AVAILABILITY" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                  Access Controls
                </span>
                <h2 className="text-base font-bold text-foreground">Portal Availability & Governance</h2>
                <p className="text-xs text-muted-foreground">
                  System maintenance state, provider onboarding, and public booking permissions.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Maintenance Mode Toggle */}
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/70 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-foreground block">Maintenance Mode</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Temporarily pause public ticket purchases and booking creations. Super Admins
                      retain full system console access.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("maintenanceMode", !form.maintenanceMode)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      form.maintenanceMode ? "bg-[#B45309]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                        form.maintenanceMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Maintenance Broadcast Notice */}
                {form.maintenanceMode && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1.5 text-xs animate-in fade-in">
                    <label className="font-bold text-amber-900 dark:text-amber-300">
                      Public Maintenance Notice Text
                    </label>
                    <textarea
                      rows={2}
                      value={form.maintenanceNotice}
                      onChange={(e) => updateField("maintenanceNotice", e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                {/* Allow Provider Signups */}
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/70 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-foreground block">
                      Allow Provider Self-Registration
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Permit bus lines, event organizers, and cinema theatres to register business accounts online.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("allowNewRegistrations", !form.allowNewRegistrations)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      form.allowNewRegistrations ? "bg-[#B45309]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                        form.allowNewRegistrations ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Allow Guest Checkout */}
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/70 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-foreground block">
                      Allow Guest One-Click Checkout
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Enable phone-number SMS verification checkout without requiring account password creation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("allowGuestCheckout", !form.allowGuestCheckout)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      form.allowGuestCheckout ? "bg-[#B45309]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                        form.allowGuestCheckout ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: COMMISSIONS & MARGINS */}
          {activeSection === "COMMISSIONS" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Revenue Architecture
                </span>
                <h2 className="text-base font-bold text-foreground">Commissions & Booking Limits</h2>
                <p className="text-xs text-muted-foreground">
                  Global and industry-specific marketplace take-rates and anti-scalping limits.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Default Platform Commission (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="30"
                      value={form.defaultCommissionRate}
                      onChange={(e) => updateField("defaultCommissionRate", Number(e.target.value))}
                      className="w-full h-8.5 pl-3 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground focus:outline-none focus:border-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Cart Hold Expiry Window (Minutes)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="3"
                      max="30"
                      value={form.cartHoldDurationMinutes}
                      onChange={(e) => updateField("cartHoldDurationMinutes", Number(e.target.value))}
                      className="w-full h-8.5 pl-3 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground focus:outline-none focus:border-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-[11px]">min</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Max Tickets Per Single Order</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={form.maxTicketsPerBooking}
                    onChange={(e) => updateField("maxTicketsPerBooking", Number(e.target.value))}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Specific Category Rates */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Industry-Specific Take-Rates
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">Intercity Bus</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        value={form.busCommissionRate}
                        onChange={(e) => updateField("busCommissionRate", Number(e.target.value))}
                        className="w-16 h-7 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                      />
                      <span className="text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">Cinema & IMAX</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        value={form.cinemaCommissionRate}
                        onChange={(e) => updateField("cinemaCommissionRate", Number(e.target.value))}
                        className="w-16 h-7 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                      />
                      <span className="text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">Concerts & Events</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        value={form.eventCommissionRate}
                        onChange={(e) => updateField("eventCommissionRate", Number(e.target.value))}
                        className="w-16 h-7 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                      />
                      <span className="text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">Stadium Sports</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        value={form.sportsCommissionRate}
                        onChange={(e) => updateField("sportsCommissionRate", Number(e.target.value))}
                        className="w-16 h-7 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                      />
                      <span className="text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: TAX & SURCHARGES */}
          {activeSection === "TAX" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                  Statutory Compliance
                </span>
                <h2 className="text-base font-bold text-foreground">Tax Rates & Platform Fees</h2>
                <p className="text-xs text-muted-foreground">
                  Ethiopian Ministry of Revenues VAT rate and fixed booking service fees.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Value-Added Tax (Ethiopian VAT %)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      value={form.vatTaxRate}
                      onChange={(e) => updateField("vatTaxRate", Number(e.target.value))}
                      className="w-full h-8.5 pl-3 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground focus:outline-none focus:border-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Passenger Platform Surcharge (Fixed ETB)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.platformServiceFeeETB}
                      onChange={(e) => updateField("platformServiceFeeETB", Number(e.target.value))}
                      className="w-full h-8.5 pl-3 pr-12 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground focus:outline-none focus:border-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-[10px]">ETB</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">System Accounting Currency</label>
                  <input
                    type="text"
                    disabled
                    value={`${form.currency} - Ethiopian Birr`}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-muted-foreground cursor-not-allowed font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: PAYMENT GATEWAYS */}
          {activeSection === "PAYMENTS" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  Ethiopian Fintech Rails
                </span>
                <h2 className="text-base font-bold text-foreground">Integrated Payment Gateways</h2>
                <p className="text-xs text-muted-foreground">
                  Connect Telebirr, CBE Birr mobile banking, and Chapa card processing.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Telebirr */}
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-foreground block">Telebirr (Ethio Telecom)</span>
                      <span className="text-[11px] text-muted-foreground">
                        In-app USSD push & mobile QR settlement
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField("telebirrEnabled", !form.telebirrEnabled)}
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                        form.telebirrEnabled ? "bg-[#B45309]" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                          form.telebirrEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Merchant App ID</label>
                      <input
                        type="text"
                        value={form.telebirrMerchantId}
                        onChange={(e) => updateField("telebirrMerchantId", e.target.value)}
                        className="w-full h-8 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px]"
                      />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[11px] font-bold">Instant Settlement</span>
                      <button
                        type="button"
                        onClick={() => updateField("telebirrAutoSettle", !form.telebirrAutoSettle)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          form.telebirrAutoSettle ? "bg-emerald-500/15 text-emerald-600" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {form.telebirrAutoSettle ? "Auto" : "Batch"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* CBE Birr */}
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-foreground block">CBE Birr (Commercial Bank of Ethiopia)</span>
                      <span className="text-[11px] text-muted-foreground">Direct account debit & batch provider payouts</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField("cbeBirrEnabled", !form.cbeBirrEnabled)}
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                        form.cbeBirrEnabled ? "bg-[#B45309]" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                          form.cbeBirrEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="pt-1">
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Corporate Merchant Code</label>
                    <input
                      type="text"
                      value={form.cbeBirrMerchantCode}
                      onChange={(e) => updateField("cbeBirrMerchantCode", e.target.value)}
                      className="w-full sm:w-72 h-8 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Chapa */}
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-foreground block">Chapa Financial Technologies</span>
                      <span className="text-[11px] text-muted-foreground">Visa, Mastercard & international passenger cards</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField("chapaEnabled", !form.chapaEnabled)}
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                        form.chapaEnabled ? "bg-[#B45309]" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                          form.chapaEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-[11px] font-bold text-slate-500">Mode:</span>
                    <button
                      type="button"
                      onClick={() => updateField("chapaMode", "LIVE")}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                        form.chapaMode === "LIVE" ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600"
                      }`}
                    >
                      ● Live
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("chapaMode", "TEST")}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                        form.chapaMode === "TEST" ? "bg-amber-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600"
                      }`}
                    >
                      Sandbox
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: PAYOUT SETTLEMENT */}
          {activeSection === "PAYOUTS" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Disbursements
                </span>
                <h2 className="text-base font-bold text-foreground">Operator Payout Governance</h2>
                <p className="text-xs text-muted-foreground">
                  Minimum withdrawal threshold and automated batch payout schedules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Minimum Withdrawal Threshold (ETB)</label>
                  <input
                    type="number"
                    value={form.minPayoutThresholdETB}
                    onChange={(e) => updateField("minPayoutThresholdETB", Number(e.target.value))}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Bank Transfer Fee (Fixed ETB)</label>
                  <input
                    type="number"
                    value={form.payoutProcessingFeeETB}
                    onChange={(e) => updateField("payoutProcessingFeeETB", Number(e.target.value))}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-foreground">Automated Payout Schedule</label>
                  <select
                    value={form.payoutSchedule}
                    onChange={(e) => updateField("payoutSchedule", e.target.value as any)}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-foreground font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="DAILY">Daily Automated Disbursement (03:00 AM EAT)</option>
                    <option value="WEEKLY">Weekly Batch Disbursement (Mondays 08:00 AM EAT)</option>
                    <option value="MANUAL">Manual Super Admin Approval Required</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: REFUNDS & DISPUTES */}
          {activeSection === "REFUNDS" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                  Claims Policy
                </span>
                <h2 className="text-base font-bold text-foreground">Refunds & Dispute Governance</h2>
                <p className="text-xs text-muted-foreground">
                  Automated customer refund limits, penalty take-rates, and SLA escalation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Auto-Approve Refund Limit (ETB)</label>
                  <input
                    type="number"
                    value={form.autoApproveRefundThreshold}
                    onChange={(e) => updateField("autoApproveRefundThreshold", Number(e.target.value))}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    Claims under this amount execute automatically via Telebirr/CBE API.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Cancellation Penalty Deducted (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.cancellationPenaltyRate}
                    onChange={(e) => updateField("cancellationPenaltyRate", Number(e.target.value))}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Dispute Auto-Escalate SLA (Hours)</label>
                  <input
                    type="number"
                    value={form.disputeAutoEscalateHours}
                    onChange={(e) => updateField("disputeAutoEscalateHours", Number(e.target.value))}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: CANCELLATION CUTOFFS */}
          {activeSection === "CUTOFFS" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Lead Times
                </span>
                <h2 className="text-base font-bold text-foreground">Sector Cancellation Deadlines</h2>
                <p className="text-xs text-muted-foreground">
                  Minimum hours required before trip or event departure for eligible customer cancellation.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-foreground block">Intercity Bus Lines</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={form.busCancellationCutoffHours}
                      onChange={(e) => updateField("busCancellationCutoffHours", Number(e.target.value))}
                      className="w-20 h-7.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                    />
                    <span className="text-xs text-muted-foreground">hours before trip</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-foreground block">Cinema & IMAX Theatres</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={form.cinemaCancellationCutoffHours}
                      onChange={(e) => updateField("cinemaCancellationCutoffHours", Number(e.target.value))}
                      className="w-20 h-7.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                    />
                    <span className="text-xs text-muted-foreground">hours before movie</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-foreground block">Concerts & Festivals</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={form.eventCancellationCutoffHours}
                      onChange={(e) => updateField("eventCancellationCutoffHours", Number(e.target.value))}
                      className="w-20 h-7.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                    />
                    <span className="text-xs text-muted-foreground">hours before gate</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-foreground block">Premier League Matches</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={form.sportsCancellationCutoffHours}
                      onChange={(e) => updateField("sportsCancellationCutoffHours", Number(e.target.value))}
                      className="w-20 h-7.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                    />
                    <span className="text-xs text-muted-foreground">hours before kickoff</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: AUTHENTICATION & 2FA */}
          {activeSection === "SECURITY_AUTH" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Identity Protection
                </span>
                <h2 className="text-base font-bold text-foreground">Authentication & 2FA Policies</h2>
                <p className="text-xs text-muted-foreground">
                  TOTP authenticator app mandates and operator session limits.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-xs text-foreground block">Mandate 2FA for Super Admins</span>
                    <span className="text-[11px] text-muted-foreground">
                      Require Google Authenticator TOTP token at login
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("twoFactorRequiredForAdmins", !form.twoFactorRequiredForAdmins)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      form.twoFactorRequiredForAdmins ? "bg-[#B45309]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                        form.twoFactorRequiredForAdmins ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-xs text-foreground block">Mandate 2FA for Operators & Bus Lines</span>
                    <span className="text-[11px] text-muted-foreground">
                      Require OTP verification for merchant dispatch personnel
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("twoFactorRequiredForProviders", !form.twoFactorRequiredForProviders)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      form.twoFactorRequiredForProviders ? "bg-[#B45309]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                        form.twoFactorRequiredForProviders ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-1 max-w-xs space-y-1">
                  <label className="font-semibold text-foreground text-xs">
                    Staff Inactivity Timeout (Minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="480"
                    value={form.sessionTimeoutMinutes}
                    onChange={(e) => updateField("sessionTimeoutMinutes", Number(e.target.value))}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 10: INTRUSION SHIELD */}
          {activeSection === "INTRUSION" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                  Brute-Force WAF
                </span>
                <h2 className="text-base font-bold text-foreground">Intrusion Shield & Rate Limits</h2>
                <p className="text-xs text-muted-foreground">
                  Automatic IP ban thresholds and password complexity rules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Failed Attempts Before Lockout</label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={form.maxFailedLoginsLockout}
                    onChange={(e) => updateField("maxFailedLoginsLockout", Number(e.target.value))}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">IP Lockout Duration (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={form.lockoutDurationMinutes}
                    onChange={(e) => updateField("lockoutDurationMinutes", Number(e.target.value))}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground"
                  />
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between">
                  <span className="font-bold text-foreground">Enforce Complex Passwords (10+ characters & symbols)</span>
                  <button
                    type="button"
                    onClick={() => updateField("enforcePasswordComplexity", !form.enforcePasswordComplexity)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      form.enforcePasswordComplexity ? "bg-[#B45309]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                        form.enforcePasswordComplexity ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 11: IP WHITELIST & AUDITS */}
          {activeSection === "IP_AUDIT" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  Perimeter Defense
                </span>
                <h2 className="text-base font-bold text-foreground">IP Whitelisting & Audit Logs</h2>
                <p className="text-xs text-muted-foreground">
                  Restrict Super Admin access by IP addresses and define audit log retention.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground block">Super Admin IP Whitelisting</span>
                    <span className="text-[11px] text-muted-foreground">Block console access from non-whitelisted IPs</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("ipWhitelistingEnabled", !form.ipWhitelistingEnabled)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      form.ipWhitelistingEnabled ? "bg-[#B45309]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                        form.ipWhitelistingEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Permitted Admin CIDRs / IPs</label>
                  <input
                    type="text"
                    disabled={!form.ipWhitelistingEnabled}
                    value={form.whitelistedAdminIPs}
                    onChange={(e) => updateField("whitelistedAdminIPs", e.target.value)}
                    placeholder="e.g. 197.156.104.22, 196.188.241.10"
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1 max-w-sm">
                  <label className="font-semibold text-foreground">Audit Log Retention Policy</label>
                  <select
                    value={form.auditLogRetentionDays}
                    onChange={(e) => updateField("auditLogRetentionDays", Number(e.target.value))}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value={30}>30 Days (Standard Operations)</option>
                    <option value={90}>90 Days (Enterprise Regulatory)</option>
                    <option value={180}>180 Days (Financial Audit)</option>
                    <option value={365}>365 Days (Full Tax Fiscal Year)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 12: QR ENGINE */}
          {activeSection === "QR_ENGINE" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Cryptographic Tokens
                </span>
                <h2 className="text-base font-bold text-foreground">QR Verification Engine</h2>
                <p className="text-xs text-muted-foreground">
                  Anti-screenshot protection and signature algorithms for mobile boarding passes.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1 max-w-sm">
                  <label className="font-semibold text-foreground">Signature Cryptographic Scheme</label>
                  <select
                    value={form.qrSignatureAlgorithm}
                    onChange={(e) => updateField("qrSignatureAlgorithm", e.target.value as any)}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value="HMAC_SHA256">HMAC-SHA256 (High Throughput, Low Latency)</option>
                    <option value="ECDSA_SECP256K1">ECDSA Secp256k1 (Asymmetric Public Key Scheme)</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-foreground block">Dynamic Anti-Screenshot Rolling Token</span>
                    <span className="text-[11px] text-muted-foreground">
                      Rotates QR cryptographic challenge every {form.qrRotationIntervalSeconds} seconds
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("qrDynamicRotationEnabled", !form.qrDynamicRotationEnabled)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      form.qrDynamicRotationEnabled ? "bg-[#B45309]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                        form.qrDynamicRotationEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 13: GATE SCAN POLICIES */}
          {activeSection === "GATE_POLICIES" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Field Operations
                </span>
                <h2 className="text-base font-bold text-foreground">Turnstile & Inspector Rules</h2>
                <p className="text-xs text-muted-foreground">
                  Offline manifest validation on remote highway routes and check-in overrides.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1 max-w-sm">
                  <label className="font-semibold text-foreground">Offline Inspector Cache (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="48"
                    value={form.offlineScanWindowHours}
                    onChange={(e) => updateField("offlineScanWindowHours", Number(e.target.value))}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground"
                  />
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    Enables inspectors to validate boarding passes in rural corridors without network coverage.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-foreground block">Duplicate Entry Manual Override</span>
                    <span className="text-[11px] text-muted-foreground">
                      Allow gate officer to override pass re-entry warning with supervisor pin
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("allowDuplicateCheckInOverride", !form.allowDuplicateCheckInOverride)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      form.allowDuplicateCheckInOverride ? "bg-[#B45309]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                        form.allowDuplicateCheckInOverride ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 14: SMS & ALERTS */}
          {activeSection === "SMS_ALERTS" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  Telecommunications
                </span>
                <h2 className="text-base font-bold text-foreground">SMS Gateway & Ops Triggers</h2>
                <p className="text-xs text-muted-foreground">
                  Ethio Telecom bulk SMS dispatch and automated high-value alert thresholds.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">SMS Gateway Carrier</label>
                  <select
                    value={form.smsGatewayProvider}
                    onChange={(e) => updateField("smsGatewayProvider", e.target.value as any)}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-semibold text-foreground"
                  >
                    <option value="ETHIO_TELECOM">Ethio Telecom Bulk SMS API</option>
                    <option value="TWILIO">Twilio Global Gateway</option>
                    <option value="CUSTOM_USSD">Custom USSD Direct Pipe</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Official SMS Sender ID</label>
                  <input
                    type="text"
                    value={form.smsSenderId}
                    onChange={(e) => updateField("smsSenderId", e.target.value)}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono font-bold text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">High-Value Transaction Trigger (ETB)</label>
                  <input
                    type="number"
                    value={form.highValueTransactionAlertETB}
                    onChange={(e) => updateField("highValueTransactionAlertETB", Number(e.target.value))}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-bold text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Security Ops Email Endpoint</label>
                  <input
                    type="email"
                    value={form.systemAlertEmail}
                    onChange={(e) => updateField("systemAlertEmail", e.target.value)}
                    className="w-full h-8.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-foreground"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Right Panel Footer Save Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-[11px] text-muted-foreground">
              {hasUnsavedChanges
                ? `${unsavedKeys.length} unsaved changes pending`
                : "All parameters synchronized"}
            </span>

            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer font-medium"
                >
                  Discard
                </button>
              )}
              <button
                type="button"
                onClick={() => handleSave()}
                className="px-4 py-1.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Section</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Reset Confirmation Dialog Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#161922] border border-amber-500/30 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-foreground">Restore Factory Defaults?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This will reset all platform commissions, payment gateway parameters, refund thresholds, and security policies to TIKORA defaults.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
