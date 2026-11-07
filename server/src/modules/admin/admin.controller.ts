import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../config/database";
import { UserRoleType } from "../../types/auth.types";
import { AuditService } from "./audit.service";

export class AdminController {
  /**
   * GET /api/admin/users
   * Retrieve all platform users with roles & organization details
   */
  static async getUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await db.orm.public.User.all();
      const roles = await db.orm.public.Role.all();
      const userRoles = await db.orm.public.UserRole.all();
      const providerMembers = await db.orm.public.ProviderMember.all();
      const providers = await db.orm.public.Provider.all();

      const rolesMap = new Map<number, string>();
      roles.forEach((r) => rolesMap.set(r.id, r.name));

      const userRoleMap = new Map<number, string>();
      userRoles.forEach((ur) => {
        const rName = rolesMap.get(ur.roleId);
        if (rName) userRoleMap.set(ur.userId, rName);
      });

      const providerMap = new Map<number, string>();
      providers.forEach((p) => providerMap.set(p.id, p.name));

      const userOrgMap = new Map<number, string>();
      providerMembers.forEach((pm) => {
        const orgName = providerMap.get(pm.providerId);
        if (orgName) userOrgMap.set(pm.userId, orgName);
      });

      const mappedUsers = users.map((u) => {
        const role = (userRoleMap.get(u.id) || "CUSTOMER") as UserRoleType;
        const orgName = userOrgMap.get(u.id);

        return {
          id: String(u.id),
          name: `${u.firstName} ${u.lastName}`.trim(),
          email: u.email,
          phone: u.phone || "Not Provided",
          role,
          status: u.isActive ? "ACTIVE" : "SUSPENDED",
          organizationName: orgName || undefined,
          createdAt: u.createdAt?.toString() || new Date().toISOString(),
          lastLogin: (u as any).updatedAt?.toString() || new Date().toISOString(),
          loyaltyPoints: u.loyaltyPoints || 0,
          city: u.city || "Addis Ababa",
          nationalId: u.nationalId || undefined,
        };
      });

      res.status(200).json({ success: true, users: mappedUsers });
    } catch (error: any) {
      console.error("Admin getUsers error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch users." });
    }
  }

  /**
   * PATCH /api/admin/users/:id/status
   * Toggle user active/suspended status
   */
  static async toggleUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const userId = parseInt(idParam, 10);
      if (isNaN(userId)) {
        res.status(400).json({ success: false, message: "Invalid user ID." });
        return;
      }

      const user = await db.orm.public.User.where({ id: userId }).first();
      if (!user) {
        res.status(404).json({ success: false, message: "User not found." });
        return;
      }

      const newStatus = req.body.status !== undefined ? Boolean(req.body.status) : !user.isActive;

      await db.orm.public.User.where({ id: userId }).update({
        isActive: newStatus,
      });

      const adminUser = (req as any).user;
      await AuditService.record({
        userId: adminUser?.id,
        actorName: adminUser?.name || "Administrator",
        actorRole: adminUser?.role || "ADMIN",
        target: `User #${userId} (${user.email})`,
        action: newStatus ? "USER_STATUS_ACTIVATED" : "USER_STATUS_SUSPENDED",
        entityType: "USER",
        entityId: String(userId),
        details: `User ${user.firstName} ${user.lastName} (${user.email}) status modified to ${newStatus ? "ACTIVE" : "SUSPENDED"}.`,
        ipAddress: req.ip || "127.0.0.1",
        severity: newStatus ? "INFO" : "WARNING",
      });

      res.status(200).json({
        success: true,
        message: `User status updated to ${newStatus ? "ACTIVE" : "SUSPENDED"}.`,
        isActive: newStatus,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Failed to update status." });
    }
  }

  /**
   * POST /api/admin/users
   * Create a new platform user (Admin, Inspector, Customer)
   */
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, role = "ADMIN", password } = req.body;
      if (!email || !name) {
        res.status(400).json({ success: false, message: "Name and email are required." });
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();
      const existing = await db.orm.public.User.where({ email: normalizedEmail }).first();
      if (existing) {
        res.status(400).json({ success: false, message: "Email is already registered." });
        return;
      }

      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "Account";

      const plainPassword = password || "Password@1234";
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const newUser = await db.orm.public.User.create({
        firstName,
        lastName,
        email: normalizedEmail,
        phone: phone || undefined,
        password: hashedPassword,
        isActive: true,
        isEmailVerified: true,
      });

      // Role assignment
      let targetRole = await db.orm.public.Role.where({ name: role }).first();
      if (!targetRole) {
        targetRole = await db.orm.public.Role.create({
          name: role,
          description: `${role} platform account`,
        });
      }

      await db.orm.public.UserRole.create({
        userId: newUser.id,
        roleId: targetRole.id,
      });

      const adminUser = (req as any).user;
      await AuditService.record({
        userId: adminUser?.id,
        actorName: adminUser?.name || "Administrator",
        actorRole: adminUser?.role || "ADMIN",
        target: `${role}: ${normalizedEmail}`,
        action: "USER_PROVISIONED",
        entityType: "USER",
        entityId: String(newUser.id),
        details: `Created new ${role} user account for ${newUser.firstName} ${newUser.lastName} (${newUser.email}).`,
        ipAddress: req.ip || "127.0.0.1",
        severity: "INFO",
      });

      res.status(201).json({
        success: true,
        user: {
          id: String(newUser.id),
          name: `${newUser.firstName} ${newUser.lastName}`.trim(),
          email: newUser.email,
          phone: newUser.phone || "Not Provided",
          role,
          status: "ACTIVE",
          createdAt: newUser.createdAt?.toString() || new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("Admin createUser error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to create user." });
    }
  }

  /**
   * GET /api/admin/providers
   * Retrieve all registered providers & verification status
   */
  static async getProviders(_req: Request, res: Response): Promise<void> {
    try {
      const providers = await db.orm.public.Provider.all();

      const mappedProviders = providers.map((p) => ({
        id: String(p.id),
        name: p.name,
        category: (p.providerType || "BUS") as any,
        businessLicense: p.licenseNumber || "N/A",
        taxNumber: p.tinNumber || "N/A",
        contactPerson: p.contactPersonName || p.name,
        email: p.email,
        phone: p.phone,
        address: p.address || "Addis Ababa",
        city: p.city || "Addis Ababa",
        status: (p.verificationStatus || (p.isActive ? "APPROVED" : "PENDING")) as any,
        appliedDate: p.createdAt?.toString() || new Date().toISOString(),
        approvedDate: p.isActive ? p.createdAt?.toString() : undefined,
        commissionRate: p.commissionRate || 5.0,
        totalServices: 0,
        totalBookings: 0,
        totalRevenue: 0,
        rating: 4.8,
        documents: [],
      }));

      res.status(200).json({ success: true, providers: mappedProviders });
    } catch (error: any) {
      console.error("Admin getProviders error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch providers." });
    }
  }

  /**
   * PATCH /api/admin/providers/:id/status
   */
  static async updateProviderStatus(req: Request, res: Response): Promise<void> {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const providerId = parseInt(idParam, 10);
      const { status } = req.body;

      if (isNaN(providerId) || !status) {
        res.status(400).json({ success: false, message: "Provider ID and status are required." });
        return;
      }

      const isApproved = status === "APPROVED";
      await db.orm.public.Provider.where({ id: providerId }).update({
        verificationStatus: status,
        isActive: isApproved,
      });

      // Find provider owner members and sync user status
      const members = await db.orm.public.ProviderMember.where({ providerId }).all();
      for (const m of members) {
        if (isApproved) {
          await db.orm.public.User.where({ id: m.userId }).update({ isActive: true });
        }
        // Send notification to provider owner
        try {
          await db.orm.public.Notification.create({
            userId: m.userId,
            title: isApproved ? "Provider Account Approved!" : "Provider Application Status",
            message: isApproved
              ? "Congratulations! Your provider account has been verified and approved. You now have full access to your provider dashboard."
              : `Your provider registration has been marked as ${status}. Please contact support for details.`,
            type: "PROVIDER_VERIFICATION",
            link: isApproved ? "/provider/dashboard" : "/pending-approval",
            referenceId: String(providerId),
            isRead: false,
          });
        } catch (notifErr) {
          console.error("Failed to notify provider member:", notifErr);
        }
      }

      const adminUser = (req as any).user;
      await AuditService.record({
        userId: adminUser?.id,
        actorName: adminUser?.name || "Administrator",
        actorRole: adminUser?.role || "ADMIN",
        target: `Provider #${providerId}`,
        action: `PROVIDER_STATUS_${status}`,
        entityType: "PROVIDER",
        entityId: String(providerId),
        details: `Provider #${providerId} verification status set to ${status} (isActive: ${isApproved}).`,
        ipAddress: req.ip || "127.0.0.1",
        severity: status === "REJECTED" ? "CRITICAL" : "INFO",
      });

      res.status(200).json({ success: true, message: `Provider status updated to ${status}.` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Failed to update provider status." });
    }
  }

  /**
   * GET /api/admin/inspectors
   * Retrieve all inspectors registered on the platform
   */
  static async getInspectors(_req: Request, res: Response): Promise<void> {
    try {
      const inspectorRole = await db.orm.public.Role.where({ name: "INSPECTOR" }).first();
      let inspectorUserIds: number[] = [];

      if (inspectorRole) {
        const userRoles = await db.orm.public.UserRole.where({ roleId: inspectorRole.id }).all();
        inspectorUserIds = userRoles.map((ur) => ur.userId);
      }

      const users = await db.orm.public.User.all();
      const inspectorUsers = users.filter((u) => inspectorUserIds.includes(u.id));

      const mappedInspectors = inspectorUsers.map((u) => ({
        id: String(u.id),
        badgeId: `INS-${String(u.id).padStart(4, "0")}`,
        name: `${u.firstName} ${u.lastName}`.trim(),
        email: u.email,
        phone: u.phone || "Not Provided",
        nationalId: u.nationalId || `ET-${String(u.id).padStart(6, "0")}`,
        organizationId: "1",
        organizationName: "TIKORA Platform Transit",
        category: "BUS" as any,
        status: (u.isActive ? "ACTIVE" : "INACTIVE") as any,
        totalScans: 0,
        validScans: 0,
        invalidScans: 0,
        flaggedTickets: 0,
        assignedStation: u.city ? `${u.city} Central Station` : "Addis Ababa Central Station",
        terminalGate: "Gate 01",
        deviceModel: "Sunmi V2 Pro Android POS Scanner",
        shiftSchedule: "Full Time: 08:00 - 17:00",
        lastActive: (u as any).updatedAt?.toString() || new Date().toISOString(),
        joinedDate: u.createdAt?.toString() || new Date().toISOString(),
      }));

      res.status(200).json({ success: true, inspectors: mappedInspectors });
    } catch (error: any) {
      console.error("Admin getInspectors error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch inspectors." });
    }
  }

  /**
   * GET /api/admin/overview
   * Retrieve platform aggregated statistics
   */
  static async getOverview(_req: Request, res: Response): Promise<void> {
    try {
      const users = await db.orm.public.User.all();
      const providers = await db.orm.public.Provider.all();
      const inspectorRole = await db.orm.public.Role.where({ name: "INSPECTOR" }).first();

      let inspectorCount = 0;
      if (inspectorRole) {
        const inspectorRoles = await db.orm.public.UserRole.where({ roleId: inspectorRole.id }).all();
        inspectorCount = inspectorRoles.length;
      }

      const activeProviders = providers.filter((p) => p.isActive).length;
      const pendingApprovals = providers.filter((p) => p.verificationStatus === "PENDING").length;

      res.status(200).json({
        success: true,
        stats: {
          totalUsers: users.length,
          activeProviders,
          pendingApprovals,
          activeInspectors: inspectorCount,
          totalBookings: 0,
          totalGMV: 0,
          platformRevenue: 0,
          activeTickets: 0,
          refundsRequested: 0,
        },
      });
    } catch (error: any) {
      console.error("Admin getOverview error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch platform overview." });
    }
  }

  /**
   * GET /api/admin/audit-logs
   * Retrieve all audit logs from PostgreSQL
   */
  static async getAuditLogs(_req: Request, res: Response): Promise<void> {
    try {
      const logs = await AuditService.getAll();
      const mappedLogs = logs.map((l) => ({
        id: String(l.id),
        action: l.action,
        actorName: l.actorName || "System Administrator",
        actorRole: l.actorRole || "ADMIN",
        target: l.target || "Platform System",
        details: l.details || "",
        ipAddress: l.ipAddress || "127.0.0.1",
        timestamp: l.createdAt
          ? new Date(l.createdAt).toISOString().replace("T", " ").substring(0, 16)
          : new Date().toISOString().replace("T", " ").substring(0, 16),
        severity: (l.severity as "INFO" | "WARNING" | "CRITICAL") || "INFO",
      }));

      res.status(200).json({ success: true, auditLogs: mappedLogs });
    } catch (error: any) {
      console.error("Admin getAuditLogs error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch audit logs." });
    }
  }

  /**
   * POST /api/admin/audit-logs
   * Record an audit event into PostgreSQL
   */
  static async createAuditLog(req: Request, res: Response): Promise<void> {
    try {
      const { action, actorName, actorRole, target, details, ipAddress, severity } = req.body;
      if (!action) {
        res.status(400).json({ success: false, message: "Action name is required." });
        return;
      }

      const adminUser = (req as any).user;
      const created = await AuditService.record({
        userId: adminUser?.id,
        actorName: actorName || adminUser?.name || "Administrator",
        actorRole: actorRole || adminUser?.role || "ADMIN",
        target: target || "System Configuration",
        action,
        entityType: "ADMIN_ACTION",
        details: details || "Admin action performed",
        ipAddress: ipAddress || req.ip || "127.0.0.1",
        severity: severity || "INFO",
      });

      res.status(201).json({
        success: true,
        log: created
          ? {
              id: String(created.id),
              action: created.action,
              actorName: created.actorName,
              actorRole: created.actorRole,
              target: created.target,
              details: created.details,
              ipAddress: created.ipAddress,
              timestamp: created.createdAt
                ? new Date(created.createdAt).toISOString().replace("T", " ").substring(0, 16)
                : new Date().toISOString().replace("T", " ").substring(0, 16),
              severity: created.severity || "INFO",
            }
          : null,
      });
    } catch (error: any) {
      console.error("Admin createAuditLog error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to create audit log." });
    }
  }
}
