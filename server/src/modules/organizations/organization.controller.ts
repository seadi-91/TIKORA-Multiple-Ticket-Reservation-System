import { Request, Response } from "express";
import bcrypt from "bcryptjs";
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

  /**
   * GET /api/provider/staff
   * Retrieve all staff and gate inspectors belonging to this provider
   */
  static async getStaff(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const provider = await OrganizationController.getProviderForUser(user.id, user.organizationId);
      if (!provider) {
        res.status(404).json({ success: false, message: "Provider not found." });
        return;
      }

      const members = await db.orm.public.ProviderMember.where({ providerId: provider.id })
        .include("user")
        .all();

      const roles = await db.orm.public.Role.all();
      const rolesMap = new Map<number, string>();
      roles.forEach((r) => rolesMap.set(r.id, r.name));

      const userRoles = await db.orm.public.UserRole.all();
      const userRoleMap = new Map<number, string>();
      userRoles.forEach((ur) => {
        const rName = rolesMap.get(ur.roleId);
        if (rName) userRoleMap.set(ur.userId, rName);
      });

      const staffList = members
        .filter((m) => m.user)
        .map((m) => {
          const u = m.user;
          const role = userRoleMap.get(u.id) || "INSPECTOR";
          return {
            id: String(u.id),
            fullName: `${u.firstName} ${u.lastName}`.trim(),
            email: u.email,
            phone: u.phone || "Not Provided",
            role,
            assignedStation: m.position || "Main Gate Terminal",
            status: u.isActive ? "ACTIVE" : "SUSPENDED",
            scannedTicketsCount: 0,
            lastActive: (u as any).updatedAt?.toISOString() || "Today",
            dateAdded: m.joinedAt?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
          };
        });

      res.status(200).json({ success: true, staff: staffList });
    } catch (error: any) {
      console.error("Organization getStaff error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch staff members." });
    }
  }

  /**
   * POST /api/provider/staff
   * Create a new staff / ticket inspector with login password and station
   */
  static async createStaff(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const provider = await OrganizationController.getProviderForUser(user.id, user.organizationId);
      if (!provider) {
        res.status(404).json({ success: false, message: "Provider not found." });
        return;
      }

      const { fullName, email, phone, password, assignedStation, role } = req.body;

      if (!fullName || !email || !password) {
        res.status(400).json({ success: false, message: "Full name, email, and password are required." });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await db.orm.public.User.where({ email: normalizedEmail }).first();
      if (existingUser) {
        res.status(409).json({ success: false, message: `An account with email ${email} already exists.` });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "Staff";
      const lastName = nameParts.slice(1).join(" ") || "";

      // 1. Create User in PostgreSQL
      const newStaffUser = await db.orm.public.User.create({
        firstName,
        lastName,
        email: normalizedEmail,
        phone: phone?.trim() || null,
        password: hashedPassword,
        isActive: true,
        isEmailVerified: true,
      });

      // 2. Assign INSPECTOR role
      const targetRoleName = role && ["INSPECTOR", "DISPATCHER", "MANAGER", "CASHIER"].includes(role) ? role : "INSPECTOR";
      let roleRecord = await db.orm.public.Role.where({ name: targetRoleName }).first();
      if (!roleRecord) {
        roleRecord = await db.orm.public.Role.create({
          name: targetRoleName,
          description: "Terminal Gate and Ticket Inspector",
        });
      }

      await db.orm.public.UserRole.create({
        userId: newStaffUser.id,
        roleId: roleRecord.id,
      });

      // 3. Link to Provider as ProviderMember
      const station = assignedStation?.trim() || "Main Gate Terminal";
      await db.orm.public.ProviderMember.create({
        providerId: provider.id,
        userId: newStaffUser.id,
        position: station,
        status: "ACTIVE",
      });

      // 4. Audit Log
      AuditService.record({
        userId: user.id,
        actorName: `${user.name || "Provider"}`,
        actorRole: "ORGANIZATION",
        target: `Staff Inspector: ${fullName}`,
        action: "STAFF_INSPECTOR_CREATED",
        entityType: "PROVIDER_MEMBER",
        entityId: String(newStaffUser.id),
        details: `New staff/inspector created for ${provider.name}: ${fullName} (${normalizedEmail}) assigned to ${station}.`,
        severity: "INFO",
      });

      const staffMember = {
        id: String(newStaffUser.id),
        fullName: `${newStaffUser.firstName} ${newStaffUser.lastName}`.trim(),
        email: newStaffUser.email,
        phone: newStaffUser.phone || "Not Provided",
        role: targetRoleName,
        assignedStation: station,
        status: "ACTIVE" as const,
        scannedTicketsCount: 0,
        lastActive: "Just now",
        dateAdded: new Date().toISOString().split("T")[0],
      };

      res.status(201).json({
        success: true,
        message: `Inspector ${fullName} created successfully.`,
        staffMember,
      });
    } catch (error: any) {
      console.error("Organization createStaff error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to create staff member." });
    }
  }

  /**
   * PATCH /api/provider/staff/:id/status
   */
  static async toggleStaffStatus(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const targetUserId = parseInt(idParam, 10);
      if (isNaN(targetUserId)) {
        res.status(400).json({ success: false, message: "Invalid staff user ID." });
        return;
      }

      const targetUser = await db.orm.public.User.where({ id: targetUserId }).first();
      if (!targetUser) {
        res.status(404).json({ success: false, message: "Staff user not found." });
        return;
      }

      const newActive = !targetUser.isActive;
      await db.orm.public.User.where({ id: targetUserId }).update({ isActive: newActive });

      res.status(200).json({
        success: true,
        message: `Staff status updated to ${newActive ? "ACTIVE" : "SUSPENDED"}.`,
        status: newActive ? "ACTIVE" : "SUSPENDED",
      });
    } catch (error: any) {
      console.error("Organization toggleStaffStatus error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to update staff status." });
    }
  }

  /**
   * DELETE /api/provider/staff/:id
   */
  static async deleteStaff(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const targetUserId = parseInt(idParam, 10);
      if (isNaN(targetUserId)) {
        res.status(400).json({ success: false, message: "Invalid staff user ID." });
        return;
      }

      await db.orm.public.ProviderMember.where({ userId: targetUserId }).delete().catch(() => {});
      await db.orm.public.UserRole.where({ userId: targetUserId }).delete().catch(() => {});
      await db.orm.public.User.where({ id: targetUserId }).delete().catch(() => {});

      res.status(200).json({ success: true, message: "Staff member removed successfully." });
    } catch (error: any) {
      console.error("Organization deleteStaff error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to remove staff member." });
    }
  }

  /**
   * GET /api/provider/notifications
   * Retrieve real notifications for current provider
   */
  static async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      let notifs: any[] = [];
      try {
        notifs = await db.orm.public.Notification.where({ userId: user.id }).all();
      } catch {}
      const mapped = notifs.map((n: any) => ({
        id: String(n.id),
        title: n.title,
        message: n.message,
        type: n.type,
        linkHref: n.link || "/provider/payments",
        link: n.link || "/provider/payments",
        referenceId: n.referenceId || undefined,
        isRead: n.isRead,
        createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString(),
      }));

      res.status(200).json({ success: true, notifications: mapped });
    } catch (error: any) {
      console.error("Organization getNotifications error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch notifications." });
    }
  }

  /**
   * PATCH /api/provider/notifications/:id/read
   */
  static async markNotificationRead(req: Request, res: Response): Promise<void> {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const notifId = parseInt(idParam, 10);
      if (!isNaN(notifId)) {
        try {
          await db.orm.public.Notification.where({ id: notifId }).update({ isRead: true });
        } catch {}
      }
      res.status(200).json({ success: true, message: "Notification marked as read." });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Failed to update notification." });
    }
  }

  /**
   * PATCH /api/provider/notifications/read-all
   */
  static async markAllNotificationsRead(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (user) {
        try {
          await db.orm.public.Notification.where({ userId: user.id }).update({ isRead: true });
        } catch {}
      }
      res.status(200).json({ success: true, message: "All notifications marked as read." });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Failed to update notifications." });
    }
  }

  /**
   * GET /api/provider/payouts
   * Retrieve payouts for current provider
   */
  static async getPayouts(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const provider = await OrganizationController.getProviderForUser(user.id, user.organizationId);
      if (!provider) {
        res.status(200).json({ success: true, payouts: [] });
        return;
      }

      let payouts: any[] = [];
      try {
        payouts = await db.orm.public.ProviderPayout.where({ providerId: provider.id }).all();
      } catch {}
      const mapped = payouts.map((p: any) => ({
        id: String(p.id),
        reference: p.payoutReference,
        providerId: String(p.providerId),
        providerName: provider.name,
        amount: Number(p.amount) || 0,
        fee: Number(p.fee) || 0,
        netAmount: Number(p.netAmount ?? p.amount) || 0,
        currency: p.currency || "ETB",
        payoutMethod: (p.paymentMethod || "CHAPA") as any,
        accountNumber: p.accountNumber || "",
        accountName: p.accountName || provider.name,
        status: (p.status === "COMPLETED" ? "PROCESSED" : p.status) as any,
        requestedAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
        processedAt: p.paidAt ? new Date(p.paidAt).toISOString() : undefined,
        notes: p.notes || undefined,
      }));

      res.status(200).json({ success: true, payouts: mapped });
    } catch (error: any) {
      console.error("Organization getPayouts error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch payouts." });
    }
  }
}
