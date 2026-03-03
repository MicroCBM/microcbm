import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./utils";
import { isTokenExpired } from "./libs/jwt";

const publicPaths = new Set([
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.RESET_PASSWORD,
]);

function isPublicPath(pathname: string): boolean {
  return publicPaths.has(pathname) || pathname.startsWith("/auth/");
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const isPublic = isPublicPath(pathname);

  if (token && isTokenExpired(token)) {
    const response = isPublic
      ? NextResponse.next()
      : NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, req.nextUrl));
    response.cookies.delete("token");
    response.cookies.delete("userData");
    return response;
  }

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, req.nextUrl));
  }

  if (isPublic && token) {
    return NextResponse.redirect(new URL(ROUTES.HOME, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};
