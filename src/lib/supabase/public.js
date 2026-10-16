import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

let publicClient;

/**
 * Anonymous, cookie-less client for public reads. Because it never touches
 * cookies, pages that use it stay statically renderable / ISR-cacheable.
 */
export function createPublicClient() {
  if (!publicClient) {
    publicClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return publicClient;
}
