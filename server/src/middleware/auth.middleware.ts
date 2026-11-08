import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { db } from "../config/database";
import { UserRoleType } from "../types/auth.types";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.tikora_auth_token) {
      token = req.cookies.tikora_auth_token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided. Please log in.",
      });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token.",
      });
      return;
    }

    // Verify user in database
    const user = await db.orm.public.User.first({ id: decoded.id });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User account not found.",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Forbidden: Your account has been suspended or deactivated.",
      });
      return;
    }

    req.user = decoded;
    (req as any).currentUser = user;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: " + (error?.message || "Invalid authentication token"),
    });
  }
}

export function authorize(...roles: UserRoleType[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Authentication required.",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access denied. Required role: ${roles.join(", ")}. Your role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
}

export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.tikora_auth_token) {
      token = req.cookies.tikora_auth_token;
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        req.user = decoded;
      }
    }
  } catch {}
  next();
}
