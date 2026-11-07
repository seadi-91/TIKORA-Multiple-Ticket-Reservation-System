import bcrypt from "bcryptjs";
import { db } from "../../config/database";
import { signToken } from "../../utils/jwt";
import {
  UserRoleType,
  ClientAuthUser,
  AuthResponseDto,
  JwtUserPayload,
} from "../../types/auth.types";

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
    organizationCategory?: string
  ): ClientAuthUser {
    return {
      id: String(user.id),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      phone: user.phone || undefined,
      role,
      status: user.isActive ? "ACTIVE" : "INACTIVE",
      avatarUrl: user.profileImage || undefined,
      organizationId: organizationId ? String(organizationId) : undefined,
      organizationCategory: organizationCategory as any,
      emailVerified: user.isEmailVerified,
      createdAt: user.createdAt?.toString() || new Date().toISOString(),
    };
  }

  /**
   * Login with email and password
   */
  static async login(email: string, password: string):Promise<AuthResponseDto> {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await db.orm.public.User.where({ email: normalizedEmail }).first();
    if (!user) {
      throw new Error("Account not registered. Please create an account first.");
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

    // If organization, check ProviderMember
    let organizationId: number | undefined;
    let organizationCategory: string | undefined;

    if (role === "ORGANIZATION") {
      const membership = await db.orm.public.ProviderMember.where({ userId: user.id })
        .include("provider")
        .first();

      if (membership && membership.provider) {
        organizationId = membership.provider.id;
        organizationCategory = membership.provider.providerType;
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
      status: user.isActive ? "ACTIVE" : "INACTIVE",
    };

    const token = signToken(jwtPayload);
    const clientUser = this.formatAuthUser(user, role, organizationId, organizationCategory);

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
      isActive: true,
    });

    // 4. Link User to Provider as ProviderMember (Owner)
    await db.orm.public.ProviderMember.create({
      providerId: provider.id,
      userId: user.id,
      position: "Owner",
      status: "ACTIVE",
    });

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
    const clientUser = this.formatAuthUser(user, "ORGANIZATION", provider.id, category);

    return {
      message: "Organization registration submitted successfully. Your account is pending verification.",
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

    if (role === "ORGANIZATION") {
      const membership = await db.orm.public.ProviderMember.where({ userId: user.id })
        .include("provider")
        .first();

      if (membership && membership.provider) {
        organizationId = membership.provider.id;
        organizationCategory = membership.provider.providerType;
      }
    }

    return this.formatAuthUser(user, role, organizationId, organizationCategory);
  }
}

