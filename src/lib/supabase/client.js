"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

let browserClient;

/** Browser client (shares the auth cookies set by the server). */
export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}
