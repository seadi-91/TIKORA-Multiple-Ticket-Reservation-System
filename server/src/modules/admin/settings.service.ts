import fs from "fs";
import path from "path";
import { AuditService } from "./audit.service";

export interface PlatformSettingsData {
  // General & Branding
  platformName: string;
  siteName: string;
  logoUrl: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  headquartersAddress: string;
  footerEmail: string;
  footerPhone: string;
  footerLocation: string;
  copyrightText: string;
  operatingRegion: string;
  defaultTimezone: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maintenanceNotice: string;
  allowNewRegistrations: boolean;
  allowGuestCheckout: boolean;

  // Financial & Commissions
  currency: string;
  defaultCommissionRate: number;
  busCommissionRate: number;
  cinemaCommissionRate: number;
  eventCommissionRate: number;
  sportsCommissionRate: number;
  vatTaxRate: number;
  platformServiceFeeETB: number;
  cartHoldDurationMinutes: number;
  maxTicketsPerBooking: number;

  // Payments & Payouts
  telebirrEnabled: boolean;
  telebirrMerchantId: string;
  telebirrAutoSettle: boolean;
  cbeBirrEnabled: boolean;
  cbeBirrMerchantCode: string;
  chapaEnabled: boolean;
  chapaMode: "LIVE" | "TEST";
  minPayoutThresholdETB: number;
  payoutSchedule: "DAILY" | "WEEKLY" | "MANUAL";
  payoutProcessingFeeETB: number;

  // Refunds & Disputes
  autoApproveRefundThreshold: number;
  busCancellationCutoffHours: number;
  cinemaCancellationCutoffHours: number;
  eventCancellationCutoffHours: number;
  sportsCancellationCutoffHours: number;
  cancellationPenaltyRate: number;
  disputeAutoEscalateHours: number;

  // Security & Authentication
  twoFactorRequiredForAdmins: boolean;
  twoFactorRequiredForProviders: boolean;
  sessionTimeoutMinutes: number;
  maxFailedLoginsLockout: number;
  lockoutDurationMinutes: number;
  enforcePasswordComplexity: boolean;
  ipWhitelistingEnabled: boolean;
  whitelistedAdminIPs: string;
  auditLogRetentionDays: number;

  // QR Code & Gate Verification
  qrSignatureAlgorithm: "HMAC_SHA256" | "ECDSA_SECP256K1";
  qrDynamicRotationEnabled: boolean;
  qrRotationIntervalSeconds: number;
  offlineScanWindowHours: number;
  allowDuplicateCheckInOverride: boolean;

  // Notifications & Gateway Integration
  smsGatewayProvider: "ETHIO_TELECOM" | "TWILIO" | "CUSTOM_USSD";
  smsSenderId: string;
  smsTicketReceiptsEnabled: boolean;
  emailReceiptsEnabled: boolean;
  highValueTransactionAlertETB: number;
  systemAlertEmail: string;
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettingsData = {
  platformName: "TIKORA Ethiopia",
  siteName: "TIKORA",
  logoUrl: "",
  tagline: "Ethiopia's Unified Smart Ticket & Transit Hub",
  supportEmail: "support@tikora.et",
  supportPhone: "+251 11 667 8900",
  headquartersAddress: "Edna Mall Tower, Bole Sub-City, Addis Ababa, Ethiopia",
  footerEmail: "support@tikora.et",
  footerPhone: "+251 11 667 8900",
  footerLocation: "Edna Mall Tower, Bole Sub-City, Addis Ababa, Ethiopia",
  copyrightText: "© 2026 TIKORA Technologies Inc. All Rights Reserved.",
  operatingRegion: "Federal Democratic Republic of Ethiopia",
  defaultTimezone: "Africa/Addis_Ababa (UTC+3)",
  defaultLanguage: "en",
  maintenanceMode: false,
  maintenanceNotice: "System upgrade in progress. Public bookings will resume shortly.",
  allowNewRegistrations: true,
  allowGuestCheckout: true,

  currency: "ETB",
  defaultCommissionRate: 5.0,
  busCommissionRate: 5.0,
  cinemaCommissionRate: 5.0,
  eventCommissionRate: 5.0,
  sportsCommissionRate: 5.0,
  vatTaxRate: 5.0,
  platformServiceFeeETB: 10.0,
  cartHoldDurationMinutes: 10,
  maxTicketsPerBooking: 8,

  telebirrEnabled: true,
  telebirrMerchantId: "TELEBIRR-TIK-982194",
  telebirrAutoSettle: true,
  cbeBirrEnabled: true,
  cbeBirrMerchantCode: "CBE-BIRR-441029",
  chapaEnabled: true,
  chapaMode: "TEST",
  minPayoutThresholdETB: 1000,
  payoutSchedule: "WEEKLY",
  payoutProcessingFeeETB: 0,

  autoApproveRefundThreshold: 1500,
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
  lockoutDurationMinutes: 15,
  enforcePasswordComplexity: true,
  ipWhitelistingEnabled: false,
  whitelistedAdminIPs: "197.156.103.0/24, 197.156.104.0/24",
  auditLogRetentionDays: 90,

  qrSignatureAlgorithm: "HMAC_SHA256",
  qrDynamicRotationEnabled: true,
  qrRotationIntervalSeconds: 30,
  offlineScanWindowHours: 12,
  allowDuplicateCheckInOverride: false,

  smsGatewayProvider: "ETHIO_TELECOM",
  smsSenderId: "TIKORA",
  smsTicketReceiptsEnabled: true,
  emailReceiptsEnabled: true,
  highValueTransactionAlertETB: 20000,
  systemAlertEmail: "security-alerts@tikora.et",
};

export class SettingsService {
  private static getFilePath(): string {
    const configDir = path.resolve(process.cwd(), "src", "config");
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    return path.join(configDir, "platform-settings.json");
  }

  /**
   * Read settings from file with default fallbacks
   */
  static getSettings(): PlatformSettingsData {
    try {
      const filePath = this.getFilePath();
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(DEFAULT_PLATFORM_SETTINGS, null, 2), "utf8");
        return { ...DEFAULT_PLATFORM_SETTINGS };
      }
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PLATFORM_SETTINGS, ...parsed };
    } catch (error) {
      console.error("SettingsService.getSettings error:", error);
      return { ...DEFAULT_PLATFORM_SETTINGS };
    }
  }

  /**
   * Save updated settings and record audit log
   */
  static updateSettings(
    updates: Partial<PlatformSettingsData>,
    actor?: { name?: string; role?: string; ip?: string }
  ): PlatformSettingsData {
    try {
      const current = this.getSettings();
      const updated: PlatformSettingsData = {
        ...current,
        ...updates,
      };

      // Keep siteName and platformName in sync if either is updated
      if (updates.siteName && !updates.platformName) {
        updated.platformName = updates.siteName;
      } else if (updates.platformName && !updates.siteName) {
        updated.siteName = updates.platformName;
      }

      // Keep footer fields synced with support fields if not explicitly provided
      if (updates.supportEmail && !updates.footerEmail) {
        updated.footerEmail = updates.supportEmail;
      }
      if (updates.supportPhone && !updates.footerPhone) {
        updated.footerPhone = updates.supportPhone;
      }
      if (updates.headquartersAddress && !updates.footerLocation) {
        updated.footerLocation = updates.headquartersAddress;
      }

      const filePath = this.getFilePath();
      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf8");

      // Record in audit log
      AuditService.record({
        actorName: actor?.name || "System SuperAdmin",
        actorRole: actor?.role || "SUPER_ADMIN",
        target: "Platform System & Branding Settings",
        action: "PLATFORM_SETTINGS_UPDATED",
        entityType: "CONFIGURATION",
        details: `Updated platform configuration: Site Name '${updated.siteName}', Logo ${updated.logoUrl ? "Updated" : "Default"}, Footer Contact & Copyright updated.`,
        ipAddress: actor?.ip || "127.0.0.1",
        severity: "WARNING",
      }).catch((e) => console.error("Audit log error on settings update:", e));

      return updated;
    } catch (error) {
      console.error("SettingsService.updateSettings error:", error);
      return this.getSettings();
    }
  }

  /**
   * Retrieve public brand & contact settings
   */
  static getPublicSettings() {
    const s = this.getSettings();
    return {
      platformName: s.platformName,
      siteName: s.siteName,
      logoUrl: s.logoUrl,
      tagline: s.tagline,
      supportEmail: s.supportEmail,
      supportPhone: s.supportPhone,
      headquartersAddress: s.headquartersAddress,
      footerEmail: s.footerEmail || s.supportEmail,
      footerPhone: s.footerPhone || s.supportPhone,
      footerLocation: s.footerLocation || s.headquartersAddress,
      copyrightText: s.copyrightText,
      maintenanceMode: s.maintenanceMode,
      maintenanceNotice: s.maintenanceNotice,
    };
  }
}

