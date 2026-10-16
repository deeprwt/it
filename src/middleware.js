import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/auth"];

/**
 * Runs only on /admin routes: refreshes the Supabase session cookie and
 * bounces signed-out visitors to the login screen.
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (!isSupabaseConfigured) {
    if (isPublicAdminPath || pathname === "/admin/setup") return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/setup", request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // IMPORTANT: getUser() revalidates the token with Supabase Auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicAdminPath && pathname !== "/admin/setup") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
