import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper to safely parse JWT payload on the edge
function parseJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const tokenCookie =
    request.cookies.get("tikora_auth_token")?.value ||
    request.cookies.get("token")?.value;

  const isAuthRoute =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isProtectedRoute =
    pathname === "/customer" ||
    pathname.startsWith("/customer/") ||
    pathname === "/provider" ||
    pathname.startsWith("/provider/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/inspector" ||
    pathname.startsWith("/inspector/");

  const userPayload = tokenCookie ? parseJwtPayload(tokenCookie) : null;
  const isAuthenticated = Boolean(tokenCookie && userPayload && userPayload.id);

  // 1. If trying to access protected route without valid authentication:
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Role-based route guard
  if (isProtectedRoute && isAuthenticated && userPayload?.role) {
    const role = userPayload.role;

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/customer", request.url));
    }

    if (
      pathname.startsWith("/provider") &&
      role !== "ORGANIZATION" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/customer", request.url));
    }

    if (
      pathname.startsWith("/inspector") &&
      role !== "INSPECTOR" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/customer", request.url));
    }
  }

  // 3. If already logged in and visiting login or register, redirect to appropriate portal
  // (Unless visiting with a token parameter, in which case allow the login page to display the success confirmation)
  if (
    isAuthRoute &&
    isAuthenticated &&
    userPayload?.role &&
    !request.nextUrl.searchParams.has("token")
  ) {
    const role = userPayload.role;
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (role === "ORGANIZATION") {
      return NextResponse.redirect(new URL("/provider/dashboard", request.url));
    }
    if (role === "INSPECTOR") {
      return NextResponse.redirect(new URL("/inspector/scanner", request.url));
    }
    return NextResponse.redirect(new URL("/customer", request.url));
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: [
    "/customer",
    "/customer/:path*",
    "/provider",
    "/provider/:path*",
    "/admin",
    "/admin/:path*",
    "/inspector",
    "/inspector/:path*",
    "/login",
    "/register",
    "/register/:path*",
    "/forgot-password",
    "/reset-password",
  ],
};
