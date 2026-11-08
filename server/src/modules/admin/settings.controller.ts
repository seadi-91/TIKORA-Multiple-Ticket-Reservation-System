import { Request, Response } from "express";
import { SettingsService } from "./settings.service";

export class SettingsController {
  /**
   * GET /api/admin/settings
   * Retrieve all platform settings
   */
  static async getSettings(_req: Request, res: Response): Promise<void> {
    try {
      const settings = SettingsService.getSettings();
      res.status(200).json({ success: true, settings });
    } catch (error: any) {
      console.error("SettingsController.getSettings error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch settings." });
    }
  }

  /**
   * PUT /api/admin/settings
   * Update platform settings
   */
  static async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const updates = req.body || {};
      const user = (req as any).user;
      const updated = SettingsService.updateSettings(updates, {
        name: user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || "Admin",
        role: user?.role || "SUPER_ADMIN",
        ip: req.ip || "127.0.0.1",
      });

      res.status(200).json({
        success: true,
        message: "Platform settings updated and persisted successfully.",
        settings: updated,
      });
    } catch (error: any) {
      console.error("SettingsController.updateSettings error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to update settings." });
    }
  }

  /**
   * GET /api/settings or /api/platform/settings
   * Public settings for navbar, footer, and branding
   */
  static async getPublicSettings(_req: Request, res: Response): Promise<void> {
    try {
      const settings = SettingsService.getPublicSettings();
      res.status(200).json({ success: true, settings });
    } catch (error: any) {
      console.error("SettingsController.getPublicSettings error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch public settings." });
    }
  }
}

