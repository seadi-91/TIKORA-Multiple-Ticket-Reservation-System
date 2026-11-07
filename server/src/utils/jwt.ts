import jwt from "jsonwebtoken";
import { ENV } from "../config/environment";
import { JwtUserPayload } from "../types/auth.types";

export function signToken(payload: JwtUserPayload): string {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
}

export function verifyToken(token: string): JwtUserPayload {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtUserPayload;
}

