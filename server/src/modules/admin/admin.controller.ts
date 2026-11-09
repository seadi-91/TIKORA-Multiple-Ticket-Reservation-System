import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../config/database";
import { UserRoleType } from "../../types/auth.types";
import { AuditService } from "./audit.service";
import { TicketService } from "../tickets/ticket.service";
import { SettingsService } from "./settings.service";

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

      const providerMembers = await db.orm.public.ProviderMember.all();
      const providers = await db.orm.public.Provider.all();
      const providerMap = new Map<number, any>();
      providers.forEach((p) => providerMap.set(p.id, p));

      const memberOrgMap = new Map<number, any>();
      providerMembers.forEach((pm) => {
        const prov = providerMap.get(pm.providerId);
        if (prov) {
          memberOrgMap.set(pm.userId, {
            organizationId: String(prov.id),
            organizationName: prov.name,
            category: prov.providerType,
            assignedStation: pm.position,
          });
        }
      });

      const mappedInspectors = inspectorUsers.map((u) => {
        const orgInfo = memberOrgMap.get(u.id);
        const joinedDate = u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
        const lastActive = (u as any).updatedAt ? new Date((u as any).updatedAt).toISOString().split("T")[0] : "Just now";
        return {
          id: String(u.id),
          badgeId: `INS-${String(u.id).padStart(4, "0")}`,
          name: `${u.firstName} ${u.lastName}`.trim() || u.email || "Field Inspector",
          email: u.email,
          phone: u.phone || "Not Provided",
          nationalId: u.nationalId || `ET-${String(u.id).padStart(6, "0")}`,
          organizationId: orgInfo?.organizationId || "1",
          organizationName: orgInfo?.organizationName || "TIKORA Platform Transit",
          organizationCategory: (orgInfo?.category || "BUS") as any,
          category: (orgInfo?.category || "BUS") as any,
          status: (u.isActive ? "ACTIVE" : "INACTIVE") as any,
          totalScans: 0,
          validScans: 0,
          invalidScans: 0,
          flaggedScans: 0,
          flaggedTickets: 0,
          assignedStation: orgInfo?.assignedStation || (u.city ? `${u.city} Central Station` : "Addis Ababa Central Station"),
          terminalGate: "Gate 01",
          deviceModel: "Sunmi V2 Pro Android POS Scanner",
          appVersion: "v2.4.1",
          shiftSchedule: "Full Time: 08:00 - 17:00",
          lastActive,
          createdAt: joinedDate,
          joinedDate,
          addedBy: {
            name: "Platform Security & Admin",
            email: "security@tikora.et",
            role: "SYSTEM_SUPER_ADMIN",
          },
        };
      });

      res.status(200).json({ success: true, inspectors: mappedInspectors });
    } catch (error: any) {
      console.error("Admin getInspectors error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch inspectors." });
    }
  }

  /**
   * GET /api/admin/overview
   * Retrieve platform aggregated statistics directly from PostgreSQL
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
      const activeTickets = (await db.orm.public.TicketOffering.where({ status: "ACTIVE" }).all()).length;

      // Query bookings and payments from DB
      let bookingsCount = 0;
      let totalGMV = 0;
      let platformRevenue = 0;
      try {
        const bookings = await db.orm.public.Booking.all();
        bookingsCount = bookings.length;
        totalGMV = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
        platformRevenue = bookings.reduce(
          (sum, b) => sum + (Number(b.serviceFee) || Math.round((Number(b.totalAmount) || 0) * 0.05)),
          0
        );
      } catch (err) {
        console.warn("Booking table query warning:", err);
      }

      // Query refunds from DB
      let refundsRequested = 0;
      try {
        const pendingRefunds = await db.orm.public.Refund.where({ status: "PENDING" }).all();
        refundsRequested = pendingRefunds.length;
      } catch (err) {
        console.warn("Refund table query warning:", err);
      }

      res.status(200).json({
        success: true,
        stats: {
          totalUsers: users.length,
          activeProviders,
          pendingApprovals,
          activeInspectors: inspectorCount,
          totalBookings: bookingsCount,
          totalGMV,
          platformRevenue,
          activeTickets,
          refundsRequested,
        },
      });
    } catch (error: any) {
      console.error("Admin getOverview error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch platform overview." });
    }
  }

  /**
   * GET /api/admin/bookings
   * Retrieve all platform customer bookings from PostgreSQL
   */
  static async getBookings(_req: Request, res: Response): Promise<void> {
    try {
      const bookings = await db.orm.public.Booking.all();
      const providers = await db.orm.public.Provider.all();
      const providerMap = new Map<number, any>();
      providers.forEach((p) => providerMap.set(p.id, p));

      const platformSettings = SettingsService.getSettings();
      const defaultVatRate = Number(platformSettings.vatTaxRate) || 5.0;

      const mappedBookings = bookings.map((b) => {
        const prov = b.providerId ? providerMap.get(b.providerId) : null;
        const totalAmount = Number(b.totalAmount) || 0;
        const customerPaid = totalAmount;

        // Preserve snapshotted historical VAT rate, or fall back to platform setting at calculation time
        const vatRate =
          (b as any).vatRate !== undefined && (b as any).vatRate !== null
            ? Number((b as any).vatRate)
            : defaultVatRate;
        let subtotal = Number(b.subtotal);
        let vatAmount = 0;

        if (subtotal > 0 && subtotal <= totalAmount) {
          vatAmount = Math.round((totalAmount - subtotal) * 100) / 100;
        } else {
          // Compute pre-tax base fare from gross customer payment (e.g., 1050 -> base 1000, vat 50)
          subtotal = Math.round((totalAmount / (1 + vatRate / 100)) * 100) / 100;
          vatAmount = Math.max(0, Math.round((totalAmount - subtotal) * 100) / 100);
        }

        // Platform commission is deducted from pre-tax base (customerPaid - vat)
        // Preserve snapshotted rate if available; otherwise use category/provider/platform default
        const provCategory = (prov?.category as string)?.toUpperCase();
        const categoryCommission =
          provCategory === "BUS"
            ? platformSettings.busCommissionRate
            : provCategory === "CINEMA"
            ? platformSettings.cinemaCommissionRate
            : provCategory === "EVENT"
            ? platformSettings.eventCommissionRate
            : provCategory === "SPORTS"
            ? platformSettings.sportsCommissionRate
            : platformSettings.defaultCommissionRate;

        const commissionRate =
          (b as any).commissionRate !== undefined && (b as any).commissionRate !== null
            ? Number((b as any).commissionRate)
            : prov?.commissionRate || categoryCommission || platformSettings.defaultCommissionRate || 5.0;

        const platformFee = Math.round(subtotal * (commissionRate / 100) * 100) / 100;
        const providerPayout = Math.max(0, Math.round((subtotal - platformFee) * 100) / 100);

        let parsedSeats: string[] = [];
        try {
          if (Array.isArray(b.selectedSeats)) {
            parsedSeats = b.selectedSeats;
          } else if (typeof b.selectedSeats === "string") {
            parsedSeats = JSON.parse(b.selectedSeats);
          }
        } catch {
          parsedSeats = ["Standard Seat"];
        }

        return {
          id: String(b.id),
          reference: b.bookingNumber || `TIKORA-BKG-${b.id}`,
          customerName: b.customerName || "Valued Customer",
          customerEmail: b.customerEmail || "",
          customerPhone: b.customerPhone || "",
          providerId: String(b.providerId || "1"),
          providerName: prov?.name || "Verified Organization",
          serviceTitle: "TIKORA Travel Pass",
          category: (prov?.category as any) || "BUS",
          quantity: parsedSeats.length || 1,
          seatNumbers: parsedSeats,
          seats: parsedSeats,
          totalAmount,
          customerPaid,
          subtotal,
          baseFare: subtotal,
          vatAmount,
          vatRate,
          commissionRate,
          platformFee,
          providerPayout,
          providerNet: providerPayout,
          paymentMethod: (b.paymentMethod as any) || "CHAPA",
          paymentStatus: (b.paymentStatus as any) || "PAID",
          bookingStatus: (b.status as any) || "CONFIRMED",
          bookingDate: b.createdAt ? new Date(b.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        };
      });

      res.status(200).json({ success: true, bookings: mappedBookings });
    } catch (error: any) {
      console.error("Admin getBookings error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch bookings." });
    }
  }

  /**
   * GET /api/admin/refunds
   * Retrieve all platform refund requests from PostgreSQL
   */
  static async getRefunds(_req: Request, res: Response): Promise<void> {
    try {
      const refunds = await db.orm.public.Refund.all();
      const mappedRefunds = refunds.map((r) => ({
        id: String(r.id),
        bookingId: String(r.bookingId),
        paymentId: String(r.paymentId),
        amount: Number(r.amount) || 0,
        reason: r.reason || "Customer requested refund",
        status: (r.status as any) || "PENDING",
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        processedAt: r.processedAt ? new Date(r.processedAt).toISOString() : undefined,
      }));

      res.status(200).json({ success: true, refunds: mappedRefunds });
    } catch (error: any) {
      console.error("Admin getRefunds error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch refunds." });
    }
  }

  /**
   * GET /api/admin/support
   * Retrieve all customer support tickets from PostgreSQL
   */
  static async getSupportTickets(_req: Request, res: Response): Promise<void> {
    try {
      const tickets = await db.orm.public.SupportTicket.all();
      const users = await db.orm.public.User.all();
      const userMap = new Map<number, any>();
      users.forEach((u) => userMap.set(u.id, u));

      const mappedTickets = tickets.map((t) => {
        const requester = userMap.get(t.userId);
        return {
          id: String(t.id),
          ticketNumber: t.ticketNumber || `TKT-${t.id}`,
          requesterName: requester ? `${requester.firstName} ${requester.lastName}`.trim() : "Platform User",
          requesterRole: "CUSTOMER",
          requesterEmail: requester?.email || "customer@tikora.et",
          subject: t.subject || "Customer Support Inquiry",
          category: (t.category as any) || "TICKET_ISSUE",
          priority: (t.priority as any) || "MEDIUM",
          status: (t.status as any) || "OPEN",
          createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
          messages: [
            {
              sender: requester ? `${requester.firstName} ${requester.lastName}`.trim() : "Customer",
              isStaff: false,
              message: t.description || "",
              timestamp: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
            },
          ],
        };
      });

      res.status(200).json({ success: true, supportTickets: mappedTickets });
    } catch (error: any) {
      console.error("Admin getSupportTickets error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch support tickets." });
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

  /**
   * DELETE /api/admin/audit-logs
   * Delete selected or all audit logs
   */
  static async deleteAuditLogs(req: Request, res: Response): Promise<void> {
    try {
      const { ids, deleteAll } = req.body || {};
      if (deleteAll) {
        await AuditService.clearAll();
        res.status(200).json({ success: true, message: "All audit logs deleted successfully." });
        return;
      }

      if (Array.isArray(ids) && ids.length > 0) {
        await AuditService.deleteLogs(ids);
        res.status(200).json({ success: true, message: `Deleted ${ids.length} audit logs.` });
        return;
      }

      res.status(400).json({ success: false, message: "No audit log IDs provided." });
    } catch (error: any) {
      console.error("Admin deleteAuditLogs error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to delete audit logs." });
    }
  }

  /**
   * GET /api/admin/notifications
   * Retrieve platform notifications for admin
   */
  static async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const adminUser = (req as any).user;
      const notifs = await db.orm.public.Notification.where({ userId: adminUser.id }).all();
      const mapped = notifs.map((n) => ({
        id: String(n.id),
        title: n.title,
        message: n.message,
        type: n.type,
        link: n.link || "/admin/tickets",
        referenceId: n.referenceId || undefined,
        isRead: n.isRead,
        createdAt: n.createdAt?.toString() || new Date().toISOString(),
      }));

      res.status(200).json({ success: true, notifications: mapped });
    } catch (error: any) {
      console.error("Admin getNotifications error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch notifications." });
    }
  }

  /**
   * DELETE /api/admin/users/:id
   * Permanently delete user from platform
   */
  static async deleteUser(req: Request, res: Response): Promise<void> {
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

      // Cleanup user dependencies
      await db.orm.public.UserRole.where({ userId }).delete().catch(() => {});
      await db.orm.public.ProviderMember.where({ userId }).delete().catch(() => {});
      await db.orm.public.RefreshToken.where({ userId }).delete().catch(() => {});
      await db.orm.public.PasswordReset.where({ userId }).delete().catch(() => {});
      await db.orm.public.Notification.where({ userId }).delete().catch(() => {});
      await db.orm.public.AuditLog.where({ userId }).delete().catch(() => {});

      await db.orm.public.User.where({ id: userId }).delete();

      const adminUser = (req as any).user;
      await AuditService.record({
        userId: adminUser?.id,
        actorName: adminUser?.name || "System Admin",
        actorRole: adminUser?.role || "ADMIN",
        target: `User #${userId} (${user.email})`,
        action: "USER_DELETED_PERMANENTLY",
        entityType: "USER",
        entityId: String(userId),
        details: `Permanently deleted user account ${user.firstName} ${user.lastName} (${user.email}).`,
        ipAddress: req.ip || "127.0.0.1",
        severity: "WARNING",
      });

      res.status(200).json({ success: true, message: "User permanently deleted." });
    } catch (error: any) {
      console.error("Admin deleteUser error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to delete user." });
    }
  }

  /**
   * DELETE /api/admin/providers/:id
   * Permanently delete provider organization
   */
  static async deleteProvider(req: Request, res: Response): Promise<void> {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const providerId = parseInt(idParam, 10);
      if (isNaN(providerId)) {
        res.status(400).json({ success: false, message: "Invalid provider ID." });
        return;
      }

      const provider = await db.orm.public.Provider.where({ id: providerId }).first();
      if (!provider) {
        res.status(404).json({ success: false, message: "Provider organization not found." });
        return;
      }

      // Cleanup offerings and tickets
      const offerings = await db.orm.public.TicketOffering.where({ providerId }).all();
      for (const off of offerings) {
        await db.orm.public.TicketPrice.where({ offeringId: off.id }).delete().catch(() => {});
        await db.orm.public.TicketInventory.where({ offeringId: off.id }).delete().catch(() => {});
        await db.orm.public.BookingItem.where({ offeringId: off.id }).delete().catch(() => {});
        await db.orm.public.TicketOffering.where({ id: off.id }).delete().catch(() => {});
      }

      await db.orm.public.ProviderMember.where({ providerId }).delete().catch(() => {});
      await db.orm.public.ProviderDocument.where({ providerId }).delete().catch(() => {});

      await db.orm.public.Provider.where({ id: providerId }).delete();

      const adminUser = (req as any).user;
      await AuditService.record({
        userId: adminUser?.id,
        actorName: adminUser?.name || "System Admin",
        actorRole: adminUser?.role || "ADMIN",
        target: `Provider #${providerId} (${provider.name})`,
        action: "PROVIDER_DELETED_PERMANENTLY",
        entityType: "PROVIDER",
        entityId: String(providerId),
        details: `Permanently deleted provider organization "${provider.name}" (ID #${providerId}).`,
        ipAddress: req.ip || "127.0.0.1",
        severity: "WARNING",
      });

      res.status(200).json({ success: true, message: "Provider organization permanently deleted." });
    } catch (error: any) {
      console.error("Admin deleteProvider error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to delete provider." });
    }
  }

  /**
   * GET /api/admin/categories
   * Retrieve all ticket categories from DB
   */
  static async getCategories(_req: Request, res: Response): Promise<void> {
    try {
      await TicketService.ensureCategories();
      const categories = await db.orm.public.TicketCategory.all();
      const providers = await db.orm.public.Provider.all();
      const offerings = await db.orm.public.TicketOffering.all();

      const mapped = categories.map((cat) => {
        const catKey = (cat.slug || "custom").toUpperCase();
        const provCount = providers.filter(
          (p) => (p.providerType || "").toUpperCase() === catKey
        ).length;
        const offerCount = offerings.filter(
          (o) => o.categoryId === cat.id
        ).length;

        return {
          id: String(cat.id),
          name: cat.name,
          slug: cat.slug,
          category: catKey,
          description: cat.description || "",
          commissionRate: Number(cat.commissionRate || 5.0),
          isActive: Boolean(cat.isActive),
          icon: cat.icon || undefined,
          totalProviders: provCount,
          totalBookings: offerCount * 12,
        };
      });

      res.status(200).json({ success: true, categories: mapped });
    } catch (error: any) {
      console.error("Admin getCategories error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch categories." });
    }
  }

  /**
   * POST /api/admin/categories
   * Create a new category in PostgreSQL
   */
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, slug, description, commissionRate, icon, isActive } = req.body;
      if (!name) {
        res.status(400).json({ success: false, message: "Category name is required." });
        return;
      }

      const generatedSlug = (slug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const existing = await db.orm.public.TicketCategory.where({ slug: generatedSlug }).first();
      if (existing) {
        res.status(400).json({ success: false, message: `Category with slug "${generatedSlug}" already exists.` });
        return;
      }

      const category = await db.orm.public.TicketCategory.create({
        name: name.trim(),
        slug: generatedSlug,
        description: description ? description.trim() : null,
        commissionRate: Number(commissionRate || 5.0),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        icon: icon || null,
      });

      const adminUser = (req as any).user;
      await AuditService.record({
        userId: adminUser?.id,
        actorName: adminUser?.name || "System Admin",
        actorRole: adminUser?.role || "ADMIN",
        target: `Category #${category.id} (${category.name})`,
        action: "CATEGORY_CREATED",
        entityType: "CATEGORY",
        entityId: String(category.id),
        details: `Created new platform sector category "${category.name}" (slug: /${category.slug}) with commission rate ${category.commissionRate}%.`,
        ipAddress: req.ip || "127.0.0.1",
        severity: "INFO",
      });

      res.status(201).json({
        success: true,
        message: "Category created successfully in database.",
        category: {
          id: String(category.id),
          name: category.name,
          slug: category.slug,
          category: category.slug.toUpperCase(),
          description: category.description || "",
          commissionRate: Number(category.commissionRate),
          isActive: category.isActive,
          icon: category.icon,
          totalProviders: 0,
          totalBookings: 0,
        },
      });
    } catch (error: any) {
      console.error("Admin createCategory error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to create category." });
    }
  }

  /**
   * PATCH /api/admin/categories/:id
   * Update category status (active/inactive), commission rate, name, description
   */
  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const categoryId = parseInt(idParam, 10);
      if (isNaN(categoryId)) {
        res.status(400).json({ success: false, message: "Invalid category ID." });
        return;
      }

      const existing = await db.orm.public.TicketCategory.where({ id: categoryId }).first();
      if (!existing) {
        res.status(404).json({ success: false, message: "Category not found in database." });
        return;
      }

      const updateData: any = {};
      if (req.body.isActive !== undefined) updateData.isActive = Boolean(req.body.isActive);
      if (req.body.commissionRate !== undefined) updateData.commissionRate = Number(req.body.commissionRate);
      if (req.body.name !== undefined) updateData.name = String(req.body.name).trim();
      if (req.body.description !== undefined) updateData.description = String(req.body.description).trim();
      if (req.body.icon !== undefined) updateData.icon = req.body.icon;

      await db.orm.public.TicketCategory.where({ id: categoryId }).update(updateData);
      const updated = await db.orm.public.TicketCategory.where({ id: categoryId }).first();

      const adminUser = (req as any).user;
      const actionName = req.body.isActive !== undefined
        ? req.body.isActive ? "CATEGORY_ACTIVATED" : "CATEGORY_DEACTIVATED"
        : "CATEGORY_UPDATED";

      await AuditService.record({
        userId: adminUser?.id,
        actorName: adminUser?.name || "System Admin",
        actorRole: adminUser?.role || "ADMIN",
        target: `Category #${categoryId} (${existing.name})`,
        action: actionName,
        entityType: "CATEGORY",
        entityId: String(categoryId),
        details: `Updated category #${categoryId} properties: ${JSON.stringify(updateData)}.`,
        ipAddress: req.ip || "127.0.0.1",
        severity: "INFO",
      });

      res.status(200).json({
        success: true,
        message: "Category updated successfully.",
        category: {
          id: String(updated?.id || categoryId),
          name: updated?.name || existing.name,
          slug: updated?.slug || existing.slug,
          category: (updated?.slug || existing.slug).toUpperCase(),
          description: updated?.description || "",
          commissionRate: Number(updated?.commissionRate || existing.commissionRate),
          isActive: Boolean(updated?.isActive),
          icon: updated?.icon,
        },
      });
    } catch (error: any) {
      console.error("Admin updateCategory error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to update category." });
    }
  }

  /**
   * DELETE /api/admin/categories/:id
   * Permanently delete category from database
   */
  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const categoryId = parseInt(idParam, 10);
      if (isNaN(categoryId)) {
        res.status(400).json({ success: false, message: "Invalid category ID." });
        return;
      }

      const existing = await db.orm.public.TicketCategory.where({ id: categoryId }).first();
      if (!existing) {
        res.status(404).json({ success: false, message: "Category not found in database." });
        return;
      }

      // If has offerings, delete them
      const offerings = await db.orm.public.TicketOffering.where({ categoryId }).all();
      for (const off of offerings) {
        await db.orm.public.TicketPrice.where({ offeringId: off.id }).delete().catch(() => {});
        await db.orm.public.TicketInventory.where({ offeringId: off.id }).delete().catch(() => {});
        await db.orm.public.BookingItem.where({ offeringId: off.id }).delete().catch(() => {});
        await db.orm.public.TicketOffering.where({ id: off.id }).delete().catch(() => {});
      }

      await db.orm.public.TicketCategory.where({ id: categoryId }).delete();

      const adminUser = (req as any).user;
      await AuditService.record({
        userId: adminUser?.id,
        actorName: adminUser?.name || "System Admin",
        actorRole: adminUser?.role || "ADMIN",
        target: `Category #${categoryId} (${existing.name})`,
        action: "CATEGORY_DELETED_PERMANENTLY",
        entityType: "CATEGORY",
        entityId: String(categoryId),
        details: `Permanently deleted category "${existing.name}" (slug: /${existing.slug}, ID #${categoryId}).`,
        ipAddress: req.ip || "127.0.0.1",
        severity: "WARNING",
      });

      res.status(200).json({ success: true, message: "Category permanently deleted from database." });
    } catch (error: any) {
      console.error("Admin deleteCategory error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to delete category." });
    }
  }
}
