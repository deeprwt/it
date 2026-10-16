"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { run, str } from "./utils";

function safeNext(next) {
  return typeof next === "string" && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
}

/** @param {{ email: string, password: string, next?: string }} input */
export async function signIn(input) {
  const result = await run(async () => {
    const email = str(input?.email, 320);
    const password = String(input?.password || "");
    if (!email || !password) throw new Error("Enter your email and password.");

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
  });

  if (!result.ok) return result;
  redirect(safeNext(input?.next));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** Sends a reset link that lands on /admin/reset-password. */
export async function requestPasswordReset(input) {
  return run(async () => {
    const email = str(input?.email, 320);
    if (!email) throw new Error("Enter your email address.");

    const h = await headers();
    const origin = h.get("origin") || `${h.get("x-forwarded-proto") || "https"}://${h.get("host")}`;
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/admin/auth/callback?next=/admin/reset-password`,
    });
    if (error) throw new Error(error.message);
    return { sent: true };
  });
}

export async function updatePassword(input) {
  return run(async () => {
    const password = String(input?.password || "");
    if (password.length < 8) throw new Error("Use at least 8 characters.");
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
    return { updated: true };
  });
}

/** Update the signed-in user's display name. */
export async function updateProfile(input) {
  return run(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("You are signed out.");
    const full_name = str(input?.full_name, 120);
    const { error } = await supabase.from("profiles").update({ full_name }).eq("id", user.id);
    if (error) throw new Error(error.message);
    return { full_name };
  });
}
