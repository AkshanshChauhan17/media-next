import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "bookmyadspace_super_secret_key");

const roleRoutes: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/media-owner": ["MEDIA_OWNER", "ADMIN"],
  "/advertiser": ["ADVERTISER", "ADMIN"],
  "/auditor": ["AUDITOR", "ADMIN"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = Object.keys(roleRoutes).some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    const userRole = verified.payload.role as string;

    const matchedRoute = Object.keys(roleRoutes).find((route) =>
      pathname.startsWith(route)
    );

    if (matchedRoute && !roleRoutes[matchedRoute].includes(userRole)) {
      switch (userRole) {
        case "ADMIN":
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        case "MEDIA_OWNER":
          return NextResponse.redirect(new URL("/media-owner/dashboard", request.url));
        case "ADVERTISER":
          return NextResponse.redirect(new URL("/advertiser/dashboard", request.url));
        case "AUDITOR":
          return NextResponse.redirect(new URL("/auditor/dashboard", request.url));
        default:
          return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    request.cookies.delete("session");
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/media-owner/:path*",
    "/advertiser/:path*",
    "/auditor/:path*",
  ],
};