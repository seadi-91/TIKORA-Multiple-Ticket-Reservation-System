import { Request, Response } from "express";
import { db } from "../../config/database";
import { UserRoleType } from "../../types/auth.types";

export class UserController {
  /**
   * GET /api/users/profile
   * Return full profile of authenticated user
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ success: false, message: "Unauthorized." });
        return;
      }

      const user = await db.orm.public.User.first({ id: req.user.id });
      if (!user) {
        res.status(404).json({ success: false, message: "User not found." });
        return;
      }

      const userRoles = await db.orm.public.UserRole.where({ userId: user.id })
        .include("role")
        .all();

      let role: UserRoleType = "CUSTOMER";
      if (userRoles.length > 0 && userRoles[0].role) {
        role = userRoles[0].role.name as UserRoleType;
      }

      let organizationName: string | undefined;
      let organizationId: string | undefined;

      if (role === "ORGANIZATION" || role === "INSPECTOR") {
        const membership = await db.orm.public.ProviderMember.where({ userId: user.id })
          .include("provider")
          .first();

        if (membership && membership.provider) {
          organizationName = membership.provider.name;
          organizationId = String(membership.provider.id);
        }
      }

      res.status(200).json({
        success: true,
        user: {
          id: String(user.id),
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          phone: user.phone || undefined,
          city: user.city || "Addis Ababa",
          address: user.address || undefined,
          gender: user.gender || "MALE",
          dateOfBirth: user.dateOfBirth?.toISOString().split("T")[0] || undefined,
          loyaltyPoints: user.loyaltyPoints || 0,
          role,
          status: user.isActive ? "ACTIVE" : "INACTIVE",
          avatarUrl: user.profileImage || undefined,
          organizationName,
          organizationId,
          createdAt: user.createdAt?.toString() || new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("UserController getProfile error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to fetch profile." });
    }
  }

  /**
   * PUT /api/users/profile
   * Update personal profile details
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ success: false, message: "Unauthorized." });
        return;
      }

      const {
        fullName,
        firstName,
        lastName,
        phone,
        city,
        address,
        gender,
        dateOfBirth,
        profileImage,
      } = req.body;

      const updateData: any = {};

      if (fullName) {
        const parts = fullName.trim().split(" ");
        updateData.firstName = parts[0] || "User";
        updateData.lastName = parts.slice(1).join(" ") || "";
      } else {
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
      }

      if (phone !== undefined) updateData.phone = phone;
      if (city !== undefined) updateData.city = city;
      if (address !== undefined) updateData.address = address;
      if (gender !== undefined) updateData.gender = gender;
      if (profileImage !== undefined) updateData.profileImage = profileImage;

      if (dateOfBirth) {
        try {
          updateData.dateOfBirth = new Date(dateOfBirth);
        } catch {
          // ignore invalid date
        }
      }

      await db.orm.public.User.where({ id: req.user.id }).update(updateData);

      const updatedUser = await db.orm.public.User.first({ id: req.user.id });
      if (!updatedUser) {
        res.status(500).json({ success: false, message: "Failed to reload updated profile." });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: String(updatedUser.id),
          name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
          email: updatedUser.email,
          phone: updatedUser.phone || undefined,
          city: updatedUser.city || undefined,
          gender: updatedUser.gender || "MALE",
          dateOfBirth: updatedUser.dateOfBirth?.toISOString().split("T")[0] || undefined,
          avatarUrl: updatedUser.profileImage || undefined,
        },
      });
    } catch (error: any) {
      console.error("UserController updateProfile error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to update profile." });
    }
  }
}
