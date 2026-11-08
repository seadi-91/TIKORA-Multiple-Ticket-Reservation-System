import bcrypt from "bcryptjs";
import { db } from "../../config/database";
import { signToken } from "../../utils/jwt";
import {
  UserRoleType,
  ClientAuthUser,
  AuthResponseDto,
  JwtUserPayload,
} from "../../types/auth.types";
import { AuditService } from "../admin/audit.service";

export interface RegisterCustomerInput {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
}

export interface RegisterOrganizationInput {
  organizationName: string;
  category: "BUS" | "CINEMA" | "EVENT" | "SPORTS";
  businessLicense: string;
  taxNumber?: string;
  contactPersonName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  password?: string;
}

export class AuthService {
  /**
   * Helper to format User entity to client-ready AuthUser
   */
  private static formatAuthUser(
    user: any,
    role: UserRoleType,
    organizationId?: number,
    organizationCategory?: string,
    accountStatus?: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "INACTIVE"
  ): ClientAuthUser {
    let status: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "INACTIVE" = user.isActive ? "ACTIVE" : "INACTIVE";
    if (accountStatus) {
      status = accountStatus;
    }

    return {
      id: String(user.id),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      phone: user.phone || undefined,
      role,
      status,
      avatarUrl: user.profileImage || undefined,
      organizationId: organizationId ? String(organizationId) : undefined,
      organizationCategory: organizationCategory as any,
      emailVerified: user.isEmailVerified,
      createdAt: user.createdAt?.toString() || new Date().toISOString(),
    };
  }

  /**
   * Login with email or phone number and password
   */
  static async login(identifier: string, password: string): Promise<AuthResponseDto> {
    if (!identifier || !password) {
      throw new Error("Email or phone number and password are required.");
    }

    const trimmed = identifier.trim();
    let user: any = null;

    if (trimmed.includes("@")) {
      const normalizedEmail = trimmed.toLowerCase();
      user = await db.orm.public.User.where({ email: normalizedEmail }).first();
    } else {
      // Phone number or username lookup
      const cleanPhone = trimmed.replace(/[\s\-\(\)]/g, "");

      // 1. Direct match with entered phone
      user = await db.orm.public.User.where({ phone: trimmed }).first();
      if (!user && cleanPhone !== trimmed) {
        user = await db.orm.public.User.where({ phone: cleanPhone }).first();
      }

      // 2. Ethiopian phone variations (+251..., 09..., 9..., 07..., 251...)
      if (!user) {
        const variants: string[] = [];
        if (cleanPhone.startsWith("+251")) {
          const rest = cleanPhone.slice(4);
          variants.push("0" + rest, rest, "251" + rest);
        } else if (cleanPhone.startsWith("251")) {
          const rest = cleanPhone.slice(3);
          variants.push("+" + cleanPhone, "0" + rest, rest);
        } else if (cleanPhone.startsWith("0")) {
          const rest = cleanPhone.slice(1);
          variants.push("+251" + rest, "251" + rest, rest);
        } else if (cleanPhone.startsWith("9") || cleanPhone.startsWith("7")) {
          variants.push("0" + cleanPhone, "+251" + cleanPhone, "251" + cleanPhone);
        }

        for (const variant of variants) {
          user = await db.orm.public.User.where({ phone: variant }).first();
          if (user) break;
        }
      }

      // 3. Fallback to username
      if (!user) {
        user = await db.orm.public.User.where({ username: trimmed }).first();
      }
    }

    if (!user) {
      throw new Error("Account not registered with this email or phone number. Please register first.");
    }

    if (!user.isActive) {
      throw new Error("Your account has been deactivated. Please contact support.");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // Determine user role
    const userRoles = await db.orm.public.UserRole.where({ userId: user.id })
      .include("role")
      .all();

    let role: UserRoleType = "CUSTOMER";
    if (userRoles.length > 0 && userRoles[0].role) {
      role = userRoles[0].role.name as UserRoleType;
    }

    // If organization, check ProviderMember and verification status
    let organizationId: number | undefined;
    let organizationCategory: string | undefined;
    let accountStatus: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "INACTIVE" = user.isActive ? "ACTIVE" : "INACTIVE";

    if (role === "ORGANIZATION") {
      const membership = await db.orm.public.ProviderMember.where({ userId: user.id })
        .include("provider")
        .first();

      if (membership && membership.provider) {
        organizationId = membership.provider.id;
        organizationCategory = membership.provider.providerType;

        const provStatus = membership.provider.verificationStatus;
        if (provStatus === "REJECTED") {
          throw new Error("Your provider application has been rejected by Tikora administrator. Please contact support.");
        }

        if (provStatus === "PENDING" || !membership.provider.isActive) {
          accountStatus = "PENDING_APPROVAL";
        } else if (provStatus === "APPROVED") {
          accountStatus = "ACTIVE";
        }
      } else {
        accountStatus = "PENDING_APPROVAL";
      }
    }

    // Issue JWT Token
    const jwtPayload: JwtUserPayload = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      role,
      organizationId,
      organizationCategory,
      status: accountStatus,
    };

    const token = signToken(jwtPayload);
    const clientUser = this.formatAuthUser(user, role, organizationId, organizationCategory, accountStatus);

    AuditService.record({
      userId: user.id,
      actorName: `${user.firstName} ${user.lastName}`.trim(),
      actorRole: role,
      target: "Session Auth",
      action: "USER_LOGIN_SUCCESS",
      entityType: "AUTH",
      entityId: String(user.id),
      details: `${role} account ${user.email} successfully logged in.`,
      severity: "INFO",
    });

    return {
      user: clientUser,
      token,
      message: "Successfully logged in.",
    };
  }

  /**
   * Register a new Customer
   */
  static async registerCustomer(data: RegisterCustomerInput): Promise<AuthResponseDto> {
    const { fullName, email, phone, password } = data;

    if (!email || !password || !fullName) {
      throw new Error("Full name, email, and password are required.");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing email
    const existing = await db.orm.public.User.where({ email: normalizedEmail }).first();
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    // Check existing phone if given
    if (phone) {
      const existingPhone = await db.orm.public.User.where({ phone: phone.trim() }).first();
      if (existingPhone) {
        throw new Error("An account with this phone number already exists.");
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Split name
    const parts = fullName.trim().split(" ");
    const firstName = parts[0] || "User";
    const lastName = parts.slice(1).join(" ") || "";

    // Create User
    const user = await db.orm.public.User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone: phone?.trim() || null,
      password: hashedPassword,
      isEmailVerified: true,
      isActive: true,
    });

    // Assign CUSTOMER role
    let role = await db.orm.public.Role.where({ name: "CUSTOMER" }).first();
    if (!role) {
      role = await db.orm.public.Role.create({
        name: "CUSTOMER",
        description: "Customer ticket buyer",
      });
    }

    await db.orm.public.UserRole.create({
      userId: user.id,
      roleId: role.id,
    });

    const jwtPayload: JwtUserPayload = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      role: "CUSTOMER",
      status: "ACTIVE",
    };

    const token = signToken(jwtPayload);
    const clientUser = this.formatAuthUser(user, "CUSTOMER");

    AuditService.record({
      userId: user.id,
      actorName: `${user.firstName} ${user.lastName}`.trim(),
      actorRole: "CUSTOMER",
      target: "Account Registration",
      action: "CUSTOMER_REGISTERED",
      entityType: "AUTH",
      entityId: String(user.id),
      details: `New customer account registered: ${user.email}.`,
      severity: "INFO",
    });

    return {
      user: clientUser,
      token,
      message: "Customer registration successful.",
    };
  }

  /**
   * Register a new Organization / Provider
   */
  static async registerOrganization(
    data: RegisterOrganizationInput
  ): Promise<{ message: string; requiresApproval: boolean; user?: ClientAuthUser; token?: string }> {
    const {
      organizationName,
      category,
      businessLicense,
      taxNumber,
      contactPersonName,
      email,
      phone,
      address,
      city,
      password,
    } = data;

    if (!organizationName || !email || !password || !contactPersonName) {
      throw new Error("Organization name, contact person, email, and password are required.");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    const existing = await db.orm.public.User.where({ email: normalizedEmail }).first();
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const parts = contactPersonName.trim().split(" ");
    const firstName = parts[0] || "Org";
    const lastName = parts.slice(1).join(" ") || "Contact";

    // 1. Create User
    const user = await db.orm.public.User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone: phone?.trim() || null,
      password: hashedPassword,
      city: city || null,
      address: address || null,
      isEmailVerified: true,
      isActive: true,
    });

    // 2. Assign ORGANIZATION role
    let role = await db.orm.public.Role.where({ name: "ORGANIZATION" }).first();
    if (!role) {
      role = await db.orm.public.Role.create({
        name: "ORGANIZATION",
        description: "Organization / Provider administrator",
      });
    }

    await db.orm.public.UserRole.create({
      userId: user.id,
      roleId: role.id,
    });

    // 3. Create Provider record
    const slugBase = organizationName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const slug = `${slugBase}-${Date.now()}`;

    const provider = await db.orm.public.Provider.create({
      name: organizationName.trim(),
      slug,
      providerType: category,
      licenseNumber: businessLicense,
      tinNumber: taxNumber || null,
      contactPersonName,
      contactPersonEmail: normalizedEmail,
      contactPersonPhone: phone,
      email: normalizedEmail,
      phone,
      address,
      city,
      verificationStatus: "PENDING",
      isActive: false,
    });

    // 4. Link User to Provider as ProviderMember (Owner)
    await db.orm.public.ProviderMember.create({
      providerId: provider.id,
      userId: user.id,
      position: "Owner",
      status: "ACTIVE",
    });

    // 5. Notify all Admin users in PostgreSQL database
    try {
      const adminRole = await db.orm.public.Role.where({ name: "ADMIN" }).first();
      if (adminRole) {
        const adminUserRoles = await db.orm.public.UserRole.where({ roleId: adminRole.id }).all();
        for (const ur of adminUserRoles) {
          await db.orm.public.Notification.create({
            userId: ur.userId,
            title: `New Provider Registration: ${provider.name}`,
            message: `${provider.name} (${category}) has registered for provider access. Review application and approve or reject.`,
            type: "PROVIDER_APPLICATION",
            link: `/admin/providers/${provider.id}`,
            referenceId: String(provider.id),
            isRead: false,
          });
        }
      }
    } catch (notifErr) {
      console.error("Failed to notify admins of new provider registration:", notifErr);
    }

    const jwtPayload: JwtUserPayload = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      role: "ORGANIZATION",
      organizationId: provider.id,
      organizationCategory: category,
      status: "PENDING_APPROVAL",
    };

    const token = signToken(jwtPayload);
    const clientUser = this.formatAuthUser(user, "ORGANIZATION", provider.id, category, "PENDING_APPROVAL");

    AuditService.record({
      userId: user.id,
      actorName: `${user.firstName} ${user.lastName}`.trim(),
      actorRole: "ORGANIZATION",
      target: `Provider: ${provider.name}`,
      action: "ORGANIZATION_REGISTERED_PENDING",
      entityType: "PROVIDER",
      entityId: String(provider.id),
      details: `New provider registered: ${provider.name} (${category}). Account is under review awaiting administrator approval.`,
      severity: "INFO",
    });

    return {
      message: "Organization registration submitted successfully. Your provider account is under review and awaiting administrator approval.",
      requiresApproval: true,
      user: clientUser,
      token,
    };
  }

  /**
   * Get Current Authenticated User Profile
   */
  static async getCurrentUser(userId: number): Promise<ClientAuthUser> {
    const user = await db.orm.public.User.first({ id: userId });
    if (!user) {
      throw new Error("User account not found.");
    }

    const userRoles = await db.orm.public.UserRole.where({ userId: user.id })
      .include("role")
      .all();

    let role: UserRoleType = "CUSTOMER";
    if (userRoles.length > 0 && userRoles[0].role) {
      role = userRoles[0].role.name as UserRoleType;
    }

    let organizationId: number | undefined;
    let organizationCategory: string | undefined;
    let accountStatus: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "INACTIVE" = user.isActive ? "ACTIVE" : "INACTIVE";

    if (role === "ORGANIZATION") {
      const membership = await db.orm.public.ProviderMember.where({ userId: user.id })
        .include("provider")
        .first();

      if (membership && membership.provider) {
        organizationId = membership.provider.id;
        organizationCategory = membership.provider.providerType;

        const provStatus = membership.provider.verificationStatus;
        if (provStatus === "PENDING" || !membership.provider.isActive) {
          accountStatus = "PENDING_APPROVAL";
        } else if (provStatus === "REJECTED") {
          accountStatus = "SUSPENDED";
        } else if (provStatus === "APPROVED") {
          accountStatus = "ACTIVE";
        }
      } else {
        accountStatus = "PENDING_APPROVAL";
      }
    }

    return this.formatAuthUser(user, role, organizationId, organizationCategory, accountStatus);
  }
}

