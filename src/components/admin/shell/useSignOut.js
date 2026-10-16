"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { signOut } from "@/lib/actions/auth";

/** Sign out inside a transition so callers can show a pending state. */
export function useSignOut() {
  const [pending, startTransition] = useTransition();
  const run = () =>
    startTransition(async () => {
      try {
        await signOut();
      } catch (error) {
        // redirect() surfaces as a navigation, anything else is a real failure
        if (!String(error?.digest || "").startsWith("NEXT_REDIRECT")) toast.error("Couldn't sign out. Please try again.");
      }
    });
  return [pending, run];
}
