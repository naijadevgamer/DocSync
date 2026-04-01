// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionClientFromMiddleware } from "./lib/appwrite/server";
import { verifyToken } from "./lib/appwrite/jwt";

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
  const userRole = payload?.role;

  console.log("Middleware - Path:", pathname);
  console.log("Middleware - Has auth cookie:", isLoggedIn);

  // Public routes
  if (
    isLoggedIn &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/patients/dashboard", request.url));
  }

  if (!isLoggedIn && pathname.startsWith("/verify")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protected routes
  if (pathname.startsWith("/patients") && !isLoggedIn) {
    // if (!isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
    // }
    // return NextResponse.next();
  }

  // In middleware
  // const userRole = request.cookies.get("user_role")?.value;
  // if (pathname.startsWith("/admin") && userRole !== "admin") {

  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  if (pathname.startsWith("/admin")) {
    const session = await getSession(request);
    console.log("Session user:", session);
    if (!session?.labels?.includes("admin")) {
      return NextResponse.redirect(new URL("/patients/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

async function getSession(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    const { account } = createSessionClientFromMiddleware(cookieHeader);

    const user = await account.get();

    return user;
  } catch {
    return null;
  }
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
