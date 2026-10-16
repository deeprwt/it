"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cms";
import { pageByPath } from "@/data/pages";
import { run, check, str, strArray, bool, url } from "./utils";

const CHANGEFREQ = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

function normalizePath(path) {
  const p = String(path || "").trim();
  if (!p.startsWith("/")) throw new Error("Page path must start with /");
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}

function parseJsonLd(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    throw new Error("Structured data must be valid JSON.");
  }
}

/** Upsert the SEO record for one route. */
export async function savePageSeo(input) {
  return run(async () => {
    const { supabase, user } = await requireStaff();
    const path = normalizePath(input?.path);
    const priority = Number(input?.sitemap_priority);

    const values = {
      path,
      label: str(input?.label, 120) || pageByPath[path]?.label || path,
      meta_title: str(input?.meta_title, 120),
      meta_description: str(input?.meta_description, 320),
      keywords: strArray(input?.keywords, { max: 25, maxLen: 80 }),
      canonical_url: url(input?.canonical_url),
      og_title: str(input?.og_title, 120),
      og_description: str(input?.og_description, 320),
      og_image: url(input?.og_image),
      og_image_alt: str(input?.og_image_alt, 250),
      twitter_card: input?.twitter_card === "summary" ? "summary" : "summary_large_image",
      no_index: bool(input?.no_index),
      no_follow: bool(input?.no_follow),
      json_ld: parseJsonLd(input?.json_ld),
      include_in_sitemap: input?.include_in_sitemap === undefined ? true : bool(input.include_in_sitemap),
      sitemap_priority: Number.isFinite(priority) ? Math.min(1, Math.max(0, Math.round(priority * 10) / 10)) : 0.7,
      sitemap_changefreq: CHANGEFREQ.includes(input?.sitemap_changefreq) ? input.sitemap_changefreq : "monthly",
      updated_by: user.id,
    };

    const saved = check(await supabase.from("page_seo").upsert(values, { onConflict: "path" }).select().single());
    revalidateTag(CACHE_TAGS.seo);
    revalidatePath(path);
    revalidatePath("/sitemap.xml");
    return saved;
  });
}

/** Remove the override so the page falls back to its code defaults. */
export async function resetPageSeo(path) {
  return run(async () => {
    const { supabase } = await requireStaff();
    const p = normalizePath(path);
    check(await supabase.from("page_seo").delete().eq("path", p));
    revalidateTag(CACHE_TAGS.seo);
    revalidatePath(p);
    return { path: p };
  });
}
