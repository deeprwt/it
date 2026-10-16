"use server";

import { requireStaff } from "@/lib/auth";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { run, check, str } from "./utils";

const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost", "archived"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Public contact form submission. */
export async function submitLead(input) {
  return run(async () => {
    // Honeypot: real people never see or fill this field.
    if (str(input?.website)) return { received: true };

    const name = str(input?.name, 120);
    const email = str(input?.email, 320);
    const message = str(input?.message, 5000);
    if (!name) throw new Error("Please tell us your name.");
    if (!email || !EMAIL_RE.test(email)) throw new Error("Please enter a valid email address.");
    if (!message || message.length < 10) throw new Error("Tell us a little more about your project (10+ characters).");

    if (!isSupabaseConfigured) {
      throw new Error("The contact form isn't connected yet. Please email us directly.");
    }

    const { error } = await createPublicClient()
      .from("leads")
      .insert({
        name,
        email,
        message,
        company: str(input?.company, 160),
        service: str(input?.service, 120),
        budget: str(input?.budget, 60),
        source: str(input?.source, 200),
        status: "new",
      });
    if (error) throw new Error("We couldn't send your message. Please try again or email us directly.");
    return { received: true };
  });
}

export async function updateLeadStatus(id, status) {
  return run(async () => {
    if (!LEAD_STATUSES.includes(status)) throw new Error("Unknown status.");
    const { supabase } = await requireStaff();
    return check(await supabase.from("leads").update({ status }).eq("id", id).select("id, status").single());
  });
}

export async function deleteLead(id) {
  return run(async () => {
    const { supabase } = await requireStaff();
    check(await supabase.from("leads").delete().eq("id", id));
    return { id };
  });
}
