"use client";

import React, { useEffect, createContext, useContext } from "react";
import { useAdminStore, rehydrateAdminStore } from "@/stores/admin.store";
import { AlertTriangle, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";

interface PlatformSettingsContextValue {
  siteName: string;
  platformName: string;
  logoUrl: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  footerLocation: string;
  copyrightText: string;
  maintenanceMode: boolean;
  maintenanceNotice: string;
}

const PlatformSettingsContext = createContext<PlatformSettingsContextValue | null>(null);

export function PlatformSettingsProvider({ children }: { children: React.ReactNode }) {
  const { settings, fetchPublicSettings } = useAdminStore();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Rehydrate store from client localStorage immediately after mount
    rehydrateAdminStore();

    // 2. Fetch fresh public settings from backend API
    fetchPublicSettings().catch(() => {});

    const handleSettingsUpdated = (e?: any) => {
      const detail = e?.detail;
      if (detail) {
        useAdminStore.setState((prev) => ({
          settings: { ...prev.settings, ...detail },
        }));
      } else {
        fetchPublicSettings().catch(() => {});
      }
    };

    window.addEventListener("tikora_settings_updated", handleSettingsUpdated);
    window.addEventListener("storage", (e) => {
      if (e.key === "tikora_platform_settings") {
        handleSettingsUpdated();
      }
    });

    return () => {
      window.removeEventListener("tikora_settings_updated", handleSettingsUpdated);
    };
  }, [fetchPublicSettings]);

  // Dynamically update document title if not in admin console
  useEffect(() => {
    if (typeof document !== "undefined") {
      const brand = settings.siteName || settings.platformName || "TIKORA";
      if (!pathname?.startsWith("/admin")) {
        document.title = `${brand} - ${settings.tagline || "Ethiopia's Unified Ticket & Transit Hub"}`;
      }
    }
  }, [settings.siteName, settings.platformName, settings.tagline, pathname]);

  const value: PlatformSettingsContextValue = {
    siteName: settings.siteName || "TIKORA",
    platformName: settings.platformName || "TIKORA",
    logoUrl: settings.logoUrl || "",
    tagline: settings.tagline || "Ethiopia's Unified Smart Ticket & Transit Hub",
    supportEmail: settings.footerEmail || settings.supportEmail || "support@tikora.et",
    supportPhone: settings.footerPhone || settings.supportPhone || "+251 11 667 8900",
    footerLocation: settings.footerLocation || settings.headquartersAddress || "Addis Ababa, Ethiopia",
    copyrightText: settings.copyrightText || `© ${new Date().getFullYear()} ${settings.siteName || "TIKORA"} Technologies Inc. All Rights Reserved.`,
    maintenanceMode: Boolean(settings.maintenanceMode),
    maintenanceNotice: settings.maintenanceNotice || "Platform maintenance in progress. Public bookings will resume shortly.",
  };

  const isPublicOrCustomer = !pathname?.startsWith("/admin") && !pathname?.startsWith("/provider") && !pathname?.startsWith("/inspector");

  return (
    <PlatformSettingsContext.Provider value={value}>
      {/* Platform Maintenance Banner (Visible to guests & customers when active) */}
      {value.maintenanceMode && isPublicOrCustomer && (
        <div className="bg-amber-600 dark:bg-amber-700 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-md relative z-50">
          <Wrench className="w-4 h-4 shrink-0 animate-pulse" />
          <span className="text-center">{value.maintenanceNotice}</span>
        </div>
      )}
      {children}
    </PlatformSettingsContext.Provider>
  );
}

export function usePlatformSettings() {
  const context = useContext(PlatformSettingsContext);
  if (!context) {
    const { settings } = useAdminStore.getState();
    return {
      siteName: settings.siteName || "TIKORA",
      platformName: settings.platformName || "TIKORA",
      logoUrl: settings.logoUrl || "",
      tagline: settings.tagline || "Ethiopia's Unified Smart Ticket & Transit Hub",
      supportEmail: settings.footerEmail || settings.supportEmail || "support@tikora.et",
      supportPhone: settings.footerPhone || settings.supportPhone || "+251 11 667 8900",
      footerLocation: settings.footerLocation || settings.headquartersAddress || "Addis Ababa, Ethiopia",
      copyrightText: settings.copyrightText || `© ${new Date().getFullYear()} TIKORA Technologies Inc. All Rights Reserved.`,
      maintenanceMode: Boolean(settings.maintenanceMode),
      maintenanceNotice: settings.maintenanceNotice || "",
    };
  }
  return context;
}

