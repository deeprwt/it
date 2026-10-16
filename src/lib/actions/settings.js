"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cms";
import { run, check, str, strArray, bool, url } from "./utils";

const SOCIAL_KEYS = ["linkedin", "github", "x", "instagram", "dribbble", "youtube", "facebook"];

export async function saveSettings(input) {
  return run(async () => {
    const { supabase } = await requireStaff();

    const template = str(input?.title_template, 120) || "%s | Snowdox";
    if (!template.includes("%s")) throw new Error('Title template must contain "%s" where the page title goes.');

    const socials = {};
    for (const key of SOCIAL_KEYS) {
      const value = url(input?.socials?.[key]);
      if (value) socials[key] = value;
    }

    const siteUrl = url(input?.site_url);
    if (siteUrl && !/^https?:\/\//i.test(siteUrl)) throw new Error("Site URL must be a full https:// address.");

    const values = {
      site_name: str(input?.site_name, 80) || "Snowdox",
      site_url: siteUrl ? siteUrl.replace(/\/$/, "") : null,
      tagline: str(input?.tagline, 160),
      title_template: template,
      default_title: str(input?.default_title, 120),
      default_description: str(input?.default_description, 320),
      default_keywords: strArray(input?.default_keywords, { max: 25, maxLen: 80 }),
      default_og_image: url(input?.default_og_image),
      twitter_handle: str(input?.twitter_handle, 40),
      google_site_verification: str(input?.google_site_verification, 200),
      bing_site_verification: str(input?.bing_site_verification, 200),
      google_analytics_id: str(input?.google_analytics_id, 40),
      allow_indexing: input?.allow_indexing === undefined ? true : bool(input.allow_indexing),
      contact_email: str(input?.contact_email, 320),
      contact_phone: str(input?.contact_phone, 40),
      address: str(input?.address, 300),
      socials,
    };

    if (values.google_analytics_id && !/^G-[A-Z0-9]+$/i.test(values.google_analytics_id)) {
      throw new Error("Google Analytics ID should look like G-XXXXXXXXXX.");
    }

    const saved = check(await supabase.from("site_settings").update(values).eq("id", 1).select().single());
    revalidateTag(CACHE_TAGS.settings);
    revalidatePath("/", "layout");
    return saved;
  });
}

/** Admin only: change a team member's role. */
export async function updateMemberRole(id, role) {
  return run(async () => {
    if (!["admin", "editor", "viewer"].includes(role)) throw new Error("Unknown role.");
    const { supabase, user } = await requireStaff({ adminOnly: true });
    if (id === user.id && role !== "admin") throw new Error("You can't remove your own admin access.");
    return check(await supabase.from("profiles").update({ role }).eq("id", id).select("id, role").single());
  });
}
