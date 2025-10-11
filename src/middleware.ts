import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./utils";

const protectedRoutes = [ROUTES.HOME];
const publicRoutes = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Check for token in cookies
  const token = req.cookies.get("token")?.value;

  // If it's a protected route and no token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, req.nextUrl));
  }

  // If it's a public route and user has token, redirect to home
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL(ROUTES.HOME, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
