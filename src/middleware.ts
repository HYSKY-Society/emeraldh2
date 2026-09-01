import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "insecure-dev-secret");

async function valid(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

// Customer /app paths that do NOT require a member session.
const PUBLIC_APP = new Set(["/app", "/app/signin", "/app/register"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---- Admin area ----
  if (pathname.startsWith("/admin")) {
    if (!(await valid(req.cookies.get("eh2_session")?.value))) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  if (pathname === "/login" && (await valid(req.cookies.get("eh2_session")?.value))) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // ---- Customer app ----
  if (pathname.startsWith("/app")) {
    const authed = await valid(req.cookies.get("eh2_member")?.value);
    if (!PUBLIC_APP.has(pathname) && !authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/app/signin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    if ((pathname === "/app/signin" || pathname === "/app/register") && authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/app/home";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/app/:path*"],
};
