import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

const PROTECTED_PREFIXES = ["/dashboard", "/chat", "/mail"];
const AUTH_PREFIXES = ["/auth"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Convenient alias for /login -> /auth/v1/login
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/auth/v1/login", request.url));
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = sessionCookie ? await verifySessionToken(sessionCookie) : null;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthPage = AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isRoot = pathname === "/";

  // Root path handling
  if (isRoot) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard/ecommerce", request.url));
    }
    return NextResponse.redirect(new URL("/auth/v1/login", request.url));
  }

  // Protected route check
  if (isProtected && !user) {
    const loginUrl = new URL("/auth/v1/login", request.url);
    const callback = `${pathname}${search}`;
    loginUrl.searchParams.set("callbackUrl", callback);
    return NextResponse.redirect(loginUrl);
  }

  // Already authenticated user trying to access login/register
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard/ecommerce", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - public asset extensions (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
