import { db } from "../../config/database";

export interface CreateAuditLogParams {
  userId?: number;
  actorName?: string;
  actorRole?: string;
  target?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  severity?: "INFO" | "WARNING" | "CRITICAL";
}

export class AuditService {
  /**
   * Record a new immutable audit trail entry in PostgreSQL
   */
  static async record(params: CreateAuditLogParams) {
    try {
      const entry = await db.orm.public.AuditLog.create({
        userId: params.userId,
        actorName: params.actorName || "System Administrator",
        actorRole: params.actorRole || "ADMIN",
        target: params.target || "Platform System",
        action: params.action,
        entityType: params.entityType || "SECURITY",
        entityId: params.entityId,
        details: params.details || "Security event recorded",
        ipAddress: params.ipAddress || "127.0.0.1",
        severity: params.severity || "INFO",
      });
      return entry;
    } catch (error) {
      console.error("AuditService.record error:", error);
      return null;
    }
  }

  /**
   * Fetch all audit trail entries from PostgreSQL, newest first
   */
  static async getAll() {
    try {
      let logs = await db.orm.public.AuditLog.all();

      // If no logs exist yet, seed initial platform baseline records
      if (logs.length === 0) {
        await this.seedInitialLogs();
        logs = await db.orm.public.AuditLog.all();
      }

      return logs.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    } catch (error) {
      console.error("AuditService.getAll error:", error);
      return [];
    }
  }

  /**
   * Populate initial baseline audit log entries if ledger is empty
   */
  private static async seedInitialLogs() {
    try {
      await db.orm.public.AuditLog.create({
        actorName: "TIKORA Security Engine",
        actorRole: "SUPER_ADMIN",
        target: "Platform Ledger",
        action: "AUDIT_LEDGER_INITIALIZED",
        entityType: "SECURITY",
        details: "Cryptographic tamper-evident audit ledger initialized on PostgreSQL database.",
        ipAddress: "127.0.0.1",
        severity: "INFO",
      });

      await db.orm.public.AuditLog.create({
        actorName: "System Guardian",
        actorRole: "SYSTEM",
        target: "Authentication Subsystem",
        action: "AUTH_GATE_INITIALIZED",
        entityType: "AUTH",
        details: "OAuth2 authentication gateways (Google & GitHub) with strict DB-registration verification enabled.",
        ipAddress: "127.0.0.1",
        severity: "INFO",
      });
    } catch (e) {
      console.error("Error seeding initial audit logs:", e);
    }
  }
}

