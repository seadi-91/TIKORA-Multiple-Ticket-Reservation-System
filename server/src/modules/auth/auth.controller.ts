import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { signToken } from "../../utils/jwt";
import { ENV } from "../../config/environment";
import { JwtUserPayload } from "../../types/auth.types";

export class AuthController {
  /**
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const identifier = req.body.identifier || req.body.email || req.body.phone;
      const { password } = req.body;
      const result = await AuthService.login(identifier, password);

      res.cookie("tikora_auth_token", result.token, {
        httpOnly: false, // Accessible to client-side scripts as well
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error?.message || "Authentication failed. Invalid email or password.",
      });
    }
  }

  /**
   * POST /api/auth/register/customer
   */
  static async registerCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, email, phone, password } = req.body;
      const result = await AuthService.registerCustomer({
        fullName,
        email,
        phone,
        password,
      });

      res.cookie("tikora_auth_token", result.token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error?.message || "Customer registration failed.",
      });
    }
  }

  /**
   * POST /api/auth/register/organization
   */
  static async registerOrganization(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.registerOrganization(req.body);

      if (result.token) {
        res.cookie("tikora_auth_token", result.token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error?.message || "Organization registration failed.",
      });
    }
  }

  /**
   * GET /api/auth/me
   */
  static async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ success: false, message: "Unauthorized: Missing user." });
        return;
      }

      const user = await AuthService.getCurrentUser(req.user.id);
      res.status(200).json({ user });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error?.message || "Failed to fetch user session.",
      });
    }
  }

  /**
   * OAuth Callback handler (Google & GitHub)
   */
  static handleOAuthCallback(req: Request, res: Response): void {
    try {
      const user = req.user as any;
      if (!user || !user.id) {
        return res.redirect(`${ENV.CLIENT_URL}/login?error=OAuthAuthenticationFailed`);
      }

      const jwtPayload: JwtUserPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || "CUSTOMER",
        status: user.status || "ACTIVE",
      };

      const token = signToken(jwtPayload);

      // Set cookie on response
      res.cookie("tikora_auth_token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Redirect back directly to login page with token for in-place success confirmation
      res.redirect(`${ENV.CLIENT_URL}/login?token=${encodeURIComponent(token)}`);
    } catch (error: any) {
      res.redirect(
        `${ENV.CLIENT_URL}/login?error=${encodeURIComponent(error?.message || "OAuthLoginFailed")}`
      );
    }
  }

  /**
   * POST /api/auth/logout
   */
  static logout(_req: Request, res: Response): void {
    res.clearCookie("tikora_auth_token");
    res.status(200).json({ success: true, message: "Logged out successfully." });
  }

  /**
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const identifier = req.body.email || req.body.identifier;
      const result = await AuthService.requestPasswordReset(identifier);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error?.message || "Failed to process forgot password request.",
      });
    }
  }

  /**
   * POST /api/auth/verify-otp
   */
  static async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const result = await AuthService.verifyPasswordResetOtp(email, otp);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error?.message || "Verification code validation failed.",
      });
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.resetPassword(req.body);

      // Auto-login: Set authentication cookie
      res.cookie("tikora_auth_token", result.token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error?.message || "Failed to reset password.",
      });
    }
  }
}
