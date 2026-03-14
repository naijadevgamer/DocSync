import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionClient } from "@/lib/appwrite/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // PUBLIC ROUTES
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify")
  ) {
    const session = await getSession(request);

    if (
      session &&
      (pathname.startsWith("/login") || pathname.startsWith("/register"))
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // PROTECTED ROUTES
  if (pathname.startsWith("/patients") || pathname.startsWith("/admin")) {
    const session = await getSession(request);

    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // EMAIL VERIFICATION CHECK
    if (!session.emailVerification && pathname.startsWith("/patients")) {
      return NextResponse.redirect(new URL("/verify", request.url));
    }

    // ADMIN PERMISSION
    if (pathname.startsWith("/admin") && !session.labels?.includes("admin")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

async function getSession(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    const client = createSessionClient(cookieHeader);
    const { account } = client;

    return await account.get();
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
