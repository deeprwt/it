import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const STAFF_ROLES = ["admin", "editor"];

/** Current user + profile for this request (deduped). */
export const getSession = cache(async () => {
  if (!isSupabaseConfigured) return { user: null, profile: null, supabase: null };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null, supabase };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile, supabase };
});

/** For server components: redirect to login when signed out. */
export async function requireUser() {
  const session = await getSession();
  if (!session.user) redirect("/admin/login");
  return session;
}

/**
 * For server actions: throws when the caller is not admin/editor.
 * RLS enforces the same rule in the database — this just fails fast with
 * a readable message.
 */
export async function requireStaff({ adminOnly = false } = {}) {
  const session = await getSession();
  if (!session.user) throw new Error("You are signed out. Please sign in again.");
  const role = session.profile?.role;
  if (adminOnly ? role !== "admin" : !STAFF_ROLES.includes(role)) {
    throw new Error("You don't have permission to do that.");
  }
  return session;
}
