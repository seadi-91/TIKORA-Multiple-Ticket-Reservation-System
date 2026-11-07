import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ENV } from "./environment";
import { db } from "./database";
import { UserRoleType } from "../types/auth.types";

function parseIntent(req: any): "login" | "register" {
  try {
    // 1. Check query state (highest priority, request-bound)
    if (req && req.query && req.query.state) {
      const stateStr = String(req.query.state);
      try {
        const decoded = Buffer.from(stateStr, "base64").toString("utf-8");
        const parsed = JSON.parse(decoded);
        if (parsed.intent === "register") return "register";
        if (parsed.intent === "login") return "login";
      } catch {
        if (stateStr.includes("register")) return "register";
        if (stateStr.includes("login")) return "login";
      }
    }

    // 2. Check query intent directly if passed
    if (req && req.query && req.query.intent) {
      if (req.query.intent === "register") return "register";
      if (req.query.intent === "login") return "login";
    }

    // 3. Fallback to session and immediately clear
    if (req && req.session && req.session.oauthIntent) {
      const sessionIntent = req.session.oauthIntent;
      delete req.session.oauthIntent;
      return sessionIntent === "register" ? "register" : "login";
    }
  } catch (err) {
    console.error("Error parsing OAuth state:", err);
  }

  // Default is strictly login: existing accounts only
  return "login";
}

export function configurePassport(): void {
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Google OAuth Strategy
  if (ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: ENV.GOOGLE_CLIENT_ID,
          clientSecret: ENV.GOOGLE_CLIENT_SECRET,
          callbackURL: ENV.GOOGLE_CALLBACK_URL,
          passReqToCallback: true,
        },
        async (req, _accessToken, _refreshToken, profile, done) => {
          try {
            const intent = parseIntent(req);
            const rawEmail = profile.emails?.[0]?.value;
            if (!rawEmail) {
              return done(new Error("No email associated with this Google account."));
            }

            const email = rawEmail.toLowerCase().trim();
            const avatarUrl = profile.photos?.[0]?.value;

            // Check if user already exists in DB
            let user = await db.orm.public.User.where({ email }).first();

            if (!user) {
              // Strictly enforce registration first: user creation is ONLY allowed if intent === 'register'
              if (intent !== "register") {
                console.warn(`[Google OAuth] BLOCKED: Account '${email}' is NOT registered in database. Intent: '${intent}'. Denying access.`);
                return done(null, false, { message: "AccountNotRegistered" });
              }

              // Otherwise (intent === "register"), create the new user
              console.log(`[Google OAuth] Registering new customer account: '${email}'`);
              const firstName =
                profile.name?.givenName ||
                profile.displayName?.split(" ")[0] ||
                "Google";
              const lastName =
                profile.name?.familyName ||
                profile.displayName?.split(" ").slice(1).join(" ") ||
                "User";

              const randomPassword = crypto.randomUUID();
              const hashedPassword = await bcrypt.hash(randomPassword, 10);

              user = await db.orm.public.User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                profileImage: avatarUrl,
                isEmailVerified: true,
                isActive: true,
              });

              // Assign CUSTOMER role
              let role = await db.orm.public.Role.where({ name: "CUSTOMER" }).first();
              if (!role) {
                role = await db.orm.public.Role.create({
                  name: "CUSTOMER",
                  description: "Standard customer ticket buyer",
                });
              }

              await db.orm.public.UserRole.create({
                userId: user.id,
                roleId: role.id,
              });
            } else if (avatarUrl && !user.profileImage) {
              // Update avatar if missing
              await db.orm.public.User.where({ id: user.id }).update({
                profileImage: avatarUrl,
              });
            }

            // Check if user is deactivated
            if (!user.isActive) {
              console.warn(`[Google OAuth] BLOCKED: Account '${email}' is deactivated.`);
              return done(null, false, { message: "AccountDeactivated" });
            }

            // Fetch user's role
            const userRoles = await db.orm.public.UserRole.where({ userId: user.id })
              .include("role")
              .all();

            let roleName: UserRoleType = "CUSTOMER";
            if (userRoles.length > 0 && userRoles[0].role) {
              roleName = userRoles[0].role.name as UserRoleType;
            }

            return done(null, {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              role: roleName,
              avatarUrl: user.profileImage || undefined,
              status: user.isActive ? "ACTIVE" : "INACTIVE",
              emailVerified: user.isEmailVerified,
              createdAt: (user.createdAt as any)?.toString() || new Date().toISOString(),
            });
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );
  }

  // GitHub OAuth Strategy
  if (ENV.GITHUB_CLIENT_ID && ENV.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: ENV.GITHUB_CLIENT_ID,
          clientSecret: ENV.GITHUB_CLIENT_SECRET,
          callbackURL: ENV.GITHUB_CALLBACK_URL,
          scope: ["user:email"],
          passReqToCallback: true,
        },
        async (req: any, _accessToken: string, _refreshToken: string, profile: any, done: any) => {
          try {
            const intent = parseIntent(req);
            let rawEmail = profile.emails?.[0]?.value;

            // If GitHub email is private, query GitHub emails API
            if (!rawEmail && _accessToken) {
              try {
                const emailRes = await fetch("https://api.github.com/user/emails", {
                  headers: {
                    Authorization: `Bearer ${_accessToken}`,
                    "User-Agent": "TIKORA-App",
                  },
                });
                if (emailRes.ok) {
                  const emails = (await emailRes.json()) as any[];
                  const primary =
                    emails.find((e: any) => e.primary && e.verified) ||
                    emails.find((e: any) => e.primary) ||
                    emails[0];
                  if (primary?.email) {
                    rawEmail = primary.email;
                  }
                }
              } catch (e) {
                console.warn("Could not retrieve private GitHub email:", e);
              }
            }

            if (!rawEmail) {
              rawEmail = `${profile.username || "user"}@github.tikora.com`;
            }

            const email = rawEmail.toLowerCase().trim();
            const avatarUrl = profile.photos?.[0]?.value;

            // Check if user already exists in DB
            let user = await db.orm.public.User.where({ email }).first();

            if (!user) {
              // Strictly enforce registration first: user creation is ONLY allowed if intent === 'register'
              if (intent !== "register") {
                console.warn(`[GitHub OAuth] BLOCKED: Account '${email}' is NOT registered in database. Intent: '${intent}'. Denying access.`);
                return done(null, false, { message: "AccountNotRegistered" });
              }

              // Otherwise (intent === "register"), create user
              console.log(`[GitHub OAuth] Registering new customer account: '${email}'`);
              const fullName = profile.displayName || profile.username || "GitHub User";
              const nameParts = fullName.split(" ");
              const firstName = nameParts[0] || "GitHub";
              const lastName = nameParts.slice(1).join(" ") || "User";

              const randomPassword = crypto.randomUUID();
              const hashedPassword = await bcrypt.hash(randomPassword, 10);

              user = await db.orm.public.User.create({
                firstName,
                lastName,
                email,
                username: profile.username || undefined,
                password: hashedPassword,
                profileImage: avatarUrl,
                isEmailVerified: true,
                isActive: true,
              });

              // Assign CUSTOMER role
              let role = await db.orm.public.Role.where({ name: "CUSTOMER" }).first();
              if (!role) {
                role = await db.orm.public.Role.create({
                  name: "CUSTOMER",
                  description: "Standard customer ticket buyer",
                });
              }

              await db.orm.public.UserRole.create({
                userId: user.id,
                roleId: role.id,
              });
            } else if (avatarUrl && !user.profileImage) {
              await db.orm.public.User.where({ id: user.id }).update({
                profileImage: avatarUrl,
              });
            }

            // Check if user is deactivated
            if (!user.isActive) {
              console.warn(`[GitHub OAuth] BLOCKED: Account '${email}' is deactivated.`);
              return done(null, false, { message: "AccountDeactivated" });
            }

            // Fetch user's role
            const userRoles = await db.orm.public.UserRole.where({ userId: user.id })
              .include("role")
              .all();

            let roleName: UserRoleType = "CUSTOMER";
            if (userRoles.length > 0 && userRoles[0].role) {
              roleName = userRoles[0].role.name as UserRoleType;
            }

            return done(null, {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              role: roleName,
              avatarUrl: user.profileImage || undefined,
              status: user.isActive ? "ACTIVE" : "INACTIVE",
              emailVerified: user.isEmailVerified,
              createdAt: (user.createdAt as any)?.toString() || new Date().toISOString(),
            });
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );
  }
}
