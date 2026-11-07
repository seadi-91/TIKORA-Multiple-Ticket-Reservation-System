import { Router } from "express";
import passport from "passport";
import { AuthController } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { ENV } from "../../config/environment";

const router = Router();

// Standard Auth Endpoints
router.post("/login", AuthController.login);
router.post("/register/customer", AuthController.registerCustomer);
router.post("/register/organization", AuthController.registerOrganization);
router.get("/me", authenticate, AuthController.getMe);
router.post("/logout", AuthController.logout);

// Google OAuth Initiation
router.get("/google", (req, res, next) => {
  const intent = req.query.intent === "register" ? "register" : "login";
  if (req.session) {
    (req.session as any).oauthIntent = intent;
  }
  const state = Buffer.from(JSON.stringify({ intent })).toString("base64");
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    state,
  })(req, res, next);
});

// Google OAuth Callback
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      console.error("Google OAuth error:", err);
      return res.redirect(`${ENV.CLIENT_URL}/login?error=GoogleAuthFailed`);
    }
    if (!user) {
      const errorType =
        info?.message === "AccountNotRegistered"
          ? "AccountNotRegistered"
          : "GoogleAuthFailed";
      return res.redirect(`${ENV.CLIENT_URL}/login?error=${errorType}`);
    }
    req.user = user;
    AuthController.handleOAuthCallback(req, res);
  })(req, res, next);
});

// GitHub OAuth Initiation
router.get("/github", (req, res, next) => {
  const intent = req.query.intent === "register" ? "register" : "login";
  if (req.session) {
    (req.session as any).oauthIntent = intent;
  }
  const state = Buffer.from(JSON.stringify({ intent })).toString("base64");
  passport.authenticate("github", {
    scope: ["user:email"],
    state,
  })(req, res, next);
});

// GitHub OAuth Callback
router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      console.error("GitHub OAuth error:", err);
      return res.redirect(`${ENV.CLIENT_URL}/login?error=GitHubAuthFailed`);
    }
    if (!user) {
      const errorType =
        info?.message === "AccountNotRegistered"
          ? "AccountNotRegistered"
          : "GitHubAuthFailed";
      return res.redirect(`${ENV.CLIENT_URL}/login?error=${errorType}`);
    }
    req.user = user;
    AuthController.handleOAuthCallback(req, res);
  })(req, res, next);
});

export default router;
