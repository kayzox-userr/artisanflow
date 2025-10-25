import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { determineHomeRoute, normalizeRole, ROLE_ACCESS, type FeatureKey } from "@/lib/roles";

const protectedPrefixes = ["/dashboard", "/admin"];

const pathToFeature = (pathname: string): FeatureKey => {
  if (pathname.startsWith("/dashboard/clients")) return "clients";
  if (pathname.startsWith("/dashboard/stats")) return "stats";
  if (pathname.startsWith("/dashboard/settings")) return "settings";
  if (pathname.startsWith("/admin")) return "admin";
  return "dashboard";
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  const isAuthRoute = pathname.startsWith("/auth/");
  const requiresAuth = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!session && requiresAuth) {
    const redirectUrl = new URL("/auth/sign-in", req.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (!session) {
    return res;
  }

  const role = normalizeRole(session.user.user_metadata?.role as string | null);
  const allowedFeatures = ROLE_ACCESS[role];

  if (isAuthRoute) {
    return NextResponse.redirect(new URL(determineHomeRoute(role), req.url));
  }

  if (requiresAuth) {
    const requestedFeature = pathToFeature(pathname);
    if (!allowedFeatures.includes(requestedFeature)) {
      return NextResponse.redirect(new URL(determineHomeRoute(role), req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*", "/admin/:path*"],
};
