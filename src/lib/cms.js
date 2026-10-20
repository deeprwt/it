import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { site as siteDefaults } from "@/data/site";

/**
 * Public, cached reads from Supabase.
 *
 * Every getter is wrapped in `unstable_cache` with a tag; dashboard server
 * actions call `revalidateTag(...)` so edits go live instantly, while
 * visitors get static-speed pages. All getters degrade gracefully to code
 * defaults when Supabase is not configured or unreachable.
 */

export const CACHE_TAGS = {
  settings: "settings",
  seo: "seo",
  posts: "posts",
  categories: "categories",
};

const POST_LIST_FIELDS =
  "id, title, slug, excerpt, cover_image, cover_image_alt, tags, keywords, author_name, featured, reading_time, no_index, published_at, updated_at, category:categories(id, name, slug)";

async function safe(fn, fallback, label) {
  if (!isSupabaseConfigured) return fallback;
  try {
    return await fn();
  } catch (error) {
    console.error(`[cms] ${label} failed:`, error?.message || error);
    return fallback;
  }
}

function throwIf(error) {
  if (error) throw new Error(error.message);
}

// ── Site settings ────────────────────────────────────────────────────

const fetchSettings = unstable_cache(
  async () => {
    const { data, error } = await createPublicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
    throwIf(error);
    return data;
  },
  ["site-settings"],
  { tags: [CACHE_TAGS.settings], revalidate: 3600 }
);

/** Settings merged over code defaults — always returns a complete object. */
export const getSiteSettings = cache(async () => {
  const row = (await safe(fetchSettings, null, "site settings")) || {};
  const pick = (value, fallback) => (value === null || value === undefined || value === "" ? fallback : value);
  // Once settings exist in the database, the dashboard is the source of truth:
  // a cleared URL removes that icon. Code defaults only apply before setup.
  const socials = row.id ? { ...(row.socials || {}) } : { ...siteDefaults.socials };

  return {
    siteName: pick(row.site_name, siteDefaults.name),
    siteUrl: pick(row.site_url, siteDefaults.url).replace(/\/$/, ""),
    tagline: pick(row.tagline, siteDefaults.tagline),
    titleTemplate: pick(row.title_template, siteDefaults.titleTemplate),
    defaultTitle: pick(row.default_title, `${pick(row.site_name, siteDefaults.name)} — Design & Engineering Agency`),
    defaultDescription: pick(row.default_description, siteDefaults.description),
    defaultKeywords: row.default_keywords?.length ? row.default_keywords : siteDefaults.keywords,
    defaultOgImage: pick(row.default_og_image, ""),
    twitterHandle: pick(row.twitter_handle, ""),
    googleSiteVerification: pick(row.google_site_verification, ""),
    bingSiteVerification: pick(row.bing_site_verification, ""),
    googleAnalyticsId: pick(row.google_analytics_id, ""),
    allowIndexing: row.allow_indexing ?? true,
    email: pick(row.contact_email, siteDefaults.email),
    phone: pick(row.contact_phone, siteDefaults.phone),
    address: pick(row.address, siteDefaults.address),
    socials,
  };
});

// ── Page SEO ─────────────────────────────────────────────────────────

const fetchAllPageSeo = unstable_cache(
  async () => {
    const { data, error } = await createPublicClient().from("page_seo").select("*");
    throwIf(error);
    return data || [];
  },
  ["page-seo-all"],
  { tags: [CACHE_TAGS.seo], revalidate: 3600 }
);

export const getAllPageSeo = cache(async () => {
  const rows = await safe(fetchAllPageSeo, [], "page seo");
  return Object.fromEntries(rows.map((row) => [row.path, row]));
});

export async function getPageSeo(path) {
  const map = await getAllPageSeo();
  return map[path] || null;
}

// ── Blog ─────────────────────────────────────────────────────────────

const fetchPublishedPosts = unstable_cache(
  async () => {
    const { data, error } = await createPublicClient()
      .from("posts")
      .select(POST_LIST_FIELDS)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(500);
    throwIf(error);
    return data || [];
  },
  ["posts-published"],
  // Short revalidate so scheduled posts appear close to their publish time.
  { tags: [CACHE_TAGS.posts], revalidate: 300 }
);

export const getPublishedPosts = cache(async () => safe(fetchPublishedPosts, [], "published posts"));

export async function getLatestPosts(limit = 3) {
  const posts = await getPublishedPosts();
  return posts.slice(0, limit);
}

const fetchPostBySlug = unstable_cache(
  async (slug) => {
    const { data, error } = await createPublicClient()
      .from("posts")
      .select("*, category:categories(id, name, slug)")
      .eq("slug", slug)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    throwIf(error);
    return data;
  },
  ["post-by-slug"],
  { tags: [CACHE_TAGS.posts], revalidate: 300 }
);

export const getPostBySlug = cache(async (slug) => safe(() => fetchPostBySlug(slug), null, `post ${slug}`));

/** Related = same category or overlapping tags/keywords, newest first. */
export async function getRelatedPosts(post, limit = 3) {
  const posts = await getPublishedPosts();
  const terms = new Set([...(post.tags || []), ...(post.keywords || [])].map((t) => t.toLowerCase()));

  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => {
      let score = p.category?.id && p.category.id === post.category?.id ? 3 : 0;
      for (const t of [...(p.tags || []), ...(p.keywords || [])]) if (terms.has(t.toLowerCase())) score += 1;
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.post);
}

const fetchCategories = unstable_cache(
  async () => {
    const { data, error } = await createPublicClient().from("categories").select("id, name, slug, description").order("name");
    throwIf(error);
    return data || [];
  },
  ["categories"],
  { tags: [CACHE_TAGS.categories], revalidate: 3600 }
);

export const getCategories = cache(async () => safe(fetchCategories, [], "categories"));
