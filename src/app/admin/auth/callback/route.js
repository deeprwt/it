import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Landing URL for Supabase email links (password reset, magic link, invites).
 * Supports both the PKCE `code` flow and `token_hash` + `type` email templates.
 */
export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const nextParam = url.searchParams.get("next") || "/admin";
  const next = nextParam.startsWith("/admin") && !nextParam.startsWith("//") ? nextParam : "/admin";

  if (!isSupabaseConfigured) return NextResponse.redirect(new URL("/admin/setup", url.origin));

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) return NextResponse.redirect(new URL(type === "recovery" ? "/admin/reset-password" : next, url.origin));
  }

  return NextResponse.redirect(new URL("/admin/login?error=link", url.origin));
}
