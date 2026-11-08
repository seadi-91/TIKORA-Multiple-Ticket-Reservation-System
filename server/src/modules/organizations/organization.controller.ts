import { Request, Response } from "express";
import { db } from "../../config/database";
import { AuditService } from "../admin/audit.service";

export class OrganizationController {
  /**
   * Helper to retrieve provider for the authenticated user
   */
  private static async getProviderForUser(userId: number, organizationId?: number) {
    if (organizationId) {
      const p = await db.orm.public.Provider.where({ id: organizationId }).first();
      if (p) return p;
    }

    const membership = await db.orm.public.ProviderMember.where({ userId })
      .include("provider")
      .first();

    if (membership && membership.provider) {
      return membership.provider;
    }

    // Fallback: check if any provider has this user's email
    const user = await db.orm.public.User.where({ id: userId }).first();
    if (user) {
      const p = await db.orm.public.Provider.where({ email: user.email }).first();
      if (p) return p;
    }

    return null;
  }

  /**
   * GET /api/provider/profile
   * Return real organization profile for current provider
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      let provider = await OrganizationController.getProviderForUser(user.id, user.organizationId);

      // If user is Admin inspecting or no provider linked yet, return the first registered provider
      if (!provider && user.role === "ADMIN") {
        const providers = await db.orm.public.Provider.all();
        if (providers.length > 0) {
          provider = providers[0];
        }
      }

      if (!provider) {
        res.status(404).json({ success: false, message: "Organization profile not found." });
        return;
      }

      const catSlug = (provider.providerType || "BUS").toLowerCase();
      let ticketCategory = await db.orm.public.TicketCategory.where({ slug: catSlug }).first();
      if (!ticketCategory) {
        ticketCategory = await db.orm.public.TicketCategory.where({ name: provider.providerType }).first();
      }
      const isCategoryActive = ticketCategory ? ticketCategory.isActive !== false : true;

      const mappedOrg = {
        id: String(provider.id),
        name: provider.name,
        legalName: provider.legalName || provider.name,
        category: provider.providerType,
        isCategoryActive,
        categoryStatus: isCategoryActive ? "ACTIVE" : "DEACTIVATED",
        categoryDeactivated: !isCategoryActive,
        verified: provider.verificationStatus === "APPROVED",
        approvalStatus: provider.verificationStatus,
        tinNumber: provider.tinNumber || "",
        registrationNumber: provider.registrationNumber || "",
        licenseNumber: provider.licenseNumber || "",
        email: provider.email,
        phone: provider.phone,
        website: provider.website || "",
        address: provider.address || "",
        city: provider.city || "Addis Ababa",
        description: provider.description || "",
        contactPerson: {
          fullName: provider.contactPersonName || user.name || "Operations Lead",
          role: "Operations Lead / Owner",
          phone: provider.contactPersonPhone || provider.phone,
          email: provider.contactPersonEmail || provider.email,
        },
        payoutAccount: {
          bankName: provider.bankName || "Commercial Bank of Ethiopia (CBE)",
          accountNumber: provider.accountNumber || "",
          accountHolder: provider.accountHolder || provider.name,
        },
        stats: {
          totalRevenue: 0,
          grossSales: 0,
          platformCommission: provider.commissionRate || 5.0,
          netPayout: 0,
          availableBalance: 0,
          totalBookings: 0,
          totalTicketsSold: 0,
          activeServices: 0,
          pendingBookings: 0,
          availableSeats: 0,
        },
      };

      res.status(200).json({ success: true, organization: mappedOrg });
    } catch (error: any) {
      console.error("Organization getProfile error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch organization profile." });
    }
  }

  /**
   * PUT /api/provider/profile
   * Update real organization profile in PostgreSQL
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      let provider = await OrganizationController.getProviderForUser(user.id, user.organizationId);
      if (!provider && user.role === "ADMIN") {
        const providers = await db.orm.public.Provider.all();
        if (providers.length > 0) provider = providers[0];
      }

      if (!provider) {
        res.status(404).json({ success: false, message: "Organization profile not found." });
        return;
      }

      const {
        name,
        legalName,
        tinNumber,
        registrationNumber,
        licenseNumber,
        email,
        phone,
        website,
        address,
        city,
        description,
        contactPerson,
        payoutAccount,
      } = req.body;

      const updated = await db.orm.public.Provider.where({ id: provider.id }).update({
        name: name !== undefined ? name.trim() : provider.name,
        legalName: legalName !== undefined ? legalName.trim() : provider.legalName,
        tinNumber: tinNumber !== undefined ? tinNumber.trim() : provider.tinNumber,
        registrationNumber: registrationNumber !== undefined ? registrationNumber.trim() : provider.registrationNumber,
        licenseNumber: licenseNumber !== undefined ? licenseNumber.trim() : provider.licenseNumber,
        email: email !== undefined ? email.toLowerCase().trim() : provider.email,
        phone: phone !== undefined ? phone.trim() : provider.phone,
        website: website !== undefined ? website.trim() : provider.website,
        address: address !== undefined ? address.trim() : provider.address,
        city: city !== undefined ? city.trim() : provider.city,
        description: description !== undefined ? description.trim() : provider.description,
        contactPersonName: contactPerson?.fullName !== undefined ? contactPerson.fullName.trim() : provider.contactPersonName,
        contactPersonPhone: contactPerson?.phone !== undefined ? contactPerson.phone.trim() : provider.contactPersonPhone,
        contactPersonEmail: contactPerson?.email !== undefined ? contactPerson.email.toLowerCase().trim() : provider.contactPersonEmail,
        bankName: payoutAccount?.bankName !== undefined ? payoutAccount.bankName.trim() : provider.bankName,
        accountNumber: payoutAccount?.accountNumber !== undefined ? payoutAccount.accountNumber.trim() : provider.accountNumber,
        accountHolder: payoutAccount?.accountHolder !== undefined ? payoutAccount.accountHolder.trim() : provider.accountHolder,
      });

      if (!updated) {
        res.status(500).json({ success: false, message: "Failed to update organization profile in database." });
        return;
      }

      await AuditService.record({
        userId: user.id,
        actorName: user.name || "Provider Admin",
        actorRole: user.role || "ORGANIZATION",
        target: `Provider #${provider.id} (${provider.name})`,
        action: "PROVIDER_PROFILE_UPDATED",
        entityType: "PROVIDER",
        entityId: String(provider.id),
        details: `Organization profile updated for ${provider.name}.`,
        ipAddress: req.ip || "127.0.0.1",
        severity: "INFO",
      });

      const mappedOrg = {
        id: String(updated.id),
        name: updated.name,
        legalName: updated.legalName || updated.name,
        category: updated.providerType,
        verified: updated.verificationStatus === "APPROVED",
        approvalStatus: updated.verificationStatus,
        tinNumber: updated.tinNumber || "",
        registrationNumber: updated.registrationNumber || "",
        licenseNumber: updated.licenseNumber || "",
        email: updated.email,
        phone: updated.phone,
        website: updated.website || "",
        address: updated.address || "",
        city: updated.city || "Addis Ababa",
        description: updated.description || "",
        contactPerson: {
          fullName: updated.contactPersonName || user.name || "Operations Lead",
          role: "Operations Lead / Owner",
          phone: updated.contactPersonPhone || updated.phone,
          email: updated.contactPersonEmail || updated.email,
        },
        payoutAccount: {
          bankName: updated.bankName || "Commercial Bank of Ethiopia (CBE)",
          accountNumber: updated.accountNumber || "",
          accountHolder: updated.accountHolder || updated.name,
        },
        stats: {
          totalRevenue: 0,
          grossSales: 0,
          platformCommission: updated.commissionRate || 5.0,
          netPayout: 0,
          availableBalance: 0,
          totalBookings: 0,
          totalTicketsSold: 0,
          activeServices: 0,
          pendingBookings: 0,
          availableSeats: 0,
        },
      };

      res.status(200).json({
        success: true,
        message: "Organization profile updated successfully.",
        organization: mappedOrg,
      });
    } catch (error: any) {
      console.error("Organization updateProfile error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to update organization profile." });
    }
  }
}
