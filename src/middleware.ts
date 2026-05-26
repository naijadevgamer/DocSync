// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionClientFromMiddleware } from "./lib/appwrite/config/server";
import { verifyToken } from "./lib/appwrite/helper/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ SIMPLE COOKIE CHECK - NO APPPWRITE SDK
  // const sessionCookie = request.cookies.get("my-custom-session")?.value;
  // const isLoggedIn = !!sessionCookie;

  const token = request.cookies.get("auth_token")?.value;

  console.log(token);
  let payload = null;

  if (token) {
    payload = await verifyToken(token);
  }

  const isLoggedIn = !!payload;

  // if (!payload) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // ✅ You now trust this
  const userId = payload?.userId;
  const userRole = payload?.role;

  // Public routes
  if (
    isLoggedIn &&
    (pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password"))
  ) {
    return NextResponse.redirect(
      new URL(`/patients/${userId}/dashboard`, request.url),
    );
  }

  if (
    !isLoggedIn &&
    (pathname.startsWith("/patients") || pathname.startsWith("/admin"))
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If an admin is removed, their auth token remains valid until expiry.
  // This middleware redirects them to their dashboard if they're no longer an admin.
  // Not foolproof, but adds a layer of protection before the token expires.
  if (isLoggedIn && pathname.startsWith("/admin")) {
    if (userRole !== "admin") {
      return NextResponse.redirect(
        new URL(`/patients/${userId}/dashboard`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/patients/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/verify",
  ],
};
