import "server-only";
import { getSession } from "@/lib/auth";
import { staticPages } from "@/data/pages";
import { analyzePage } from "@/lib/seo-score";

/**
 * Dashboard reads. All run as the signed-in user (RLS applies) and are
 * never cached — the dashboard always shows live data.
 */

async function db() {
  const { supabase } = await getSession();
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

function unwrap({ data, error, count }) {
  if (error) throw new Error(error.message);
  return count !== undefined && count !== null ? { data, count } : data;
}

export const PAGE_SIZE = 10;

/**
 * @param {{ search?: string, status?: string, category?: string, page?: number }} params
 * @returns {Promise<{ posts: object[], total: number, page: number, pageSize: number }>}
 */
export async function listPosts({ search = "", status = "all", category = "all", page = 1 } = {}) {
  const supabase = await db();
  const from = (Math.max(1, page) - 1) * PAGE_SIZE;

  let query = supabase
    .from("posts")
    .select(
      "id, title, slug, status, featured, views, reading_time, published_at, updated_at, created_at, cover_image, focus_keyword, meta_title, meta_description, keywords, author_name, category:categories(id, name)",
      { count: "exact" }
    )
    .order("updated_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (search) query = query.or(`title.ilike.%${search.replace(/[%,()]/g, "")}%,slug.ilike.%${search.replace(/[%,()]/g, "")}%`);
  if (status === "scheduled") {
    query = query.eq("status", "published").gt("published_at", new Date().toISOString());
  } else if (status !== "all") {
    query = query.eq("status", status);
  }
  if (category !== "all") query = query.eq("category_id", category);

  const { data, count } = unwrap(await query);
  return { posts: data || [], total: count || 0, page, pageSize: PAGE_SIZE };
}

export async function getPost(id) {
  const supabase = await db();
  return unwrap(await supabase.from("posts").select("*").eq("id", id).maybeSingle());
}

export async function listCategories() {
  const supabase = await db();
  const categories = unwrap(await supabase.from("categories").select("*").order("name"));
  const counts = unwrap(await supabase.from("posts").select("category_id"));
  const tally = {};
  for (const row of counts || []) if (row.category_id) tally[row.category_id] = (tally[row.category_id] || 0) + 1;
  return (categories || []).map((c) => ({ ...c, post_count: tally[c.id] || 0 }));
}

/**
 * Every registered route merged with its DB SEO row and a health score.
 * Rows in the DB that are not in the registry (custom paths) are included too.
 */
export async function listPageSeo() {
  const supabase = await db();
  const rows = unwrap(await supabase.from("page_seo").select("*")) || [];
  const byPath = Object.fromEntries(rows.map((r) => [r.path, r]));

  const registered = staticPages.map((page) => {
    const seo = byPath[page.path] || null;
    const effective = {
      meta_title: seo?.meta_title || "",
      meta_description: seo?.meta_description || "",
      og_image: seo?.og_image || "",
      keywords: seo?.keywords || [],
      no_index: seo?.no_index || false,
    };
    const { score, checks } = analyzePage(effective);
    return { ...page, seo, configured: Boolean(seo), score, checks };
  });

  const custom = rows
    .filter((r) => !staticPages.some((p) => p.path === r.path))
    .map((seo) => {
      const { score, checks } = analyzePage(seo);
      return { path: seo.path, label: seo.label || seo.path, group: "Custom", seo, configured: true, score, checks };
    });

  return [...registered, ...custom];
}

export async function getPageSeoRow(path) {
  const supabase = await db();
  return unwrap(await supabase.from("page_seo").select("*").eq("path", path).maybeSingle());
}

export async function getSettingsRow() {
  const supabase = await db();
  return unwrap(await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle());
}

export async function listMedia() {
  const supabase = await db();
  return unwrap(await supabase.from("media").select("*").order("created_at", { ascending: false }).limit(500)) || [];
}

export async function listLeads({ status = "all" } = {}) {
  const supabase = await db();
  let query = supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(500);
  if (status !== "all") query = query.eq("status", status);
  return unwrap(await query) || [];
}

export async function listTeam() {
  const supabase = await db();
  return unwrap(await supabase.from("profiles").select("*").order("created_at")) || [];
}

/**
 * Everything the overview screen needs in one call.
 * @returns {Promise<{
 *   totals: { posts: number, published: number, drafts: number, scheduled: number, views: number, leads: number, newLeads: number, media: number },
 *   postsByMonth: { month: string, published: number }[],
 *   leadsByWeek: { week: string, leads: number }[],
 *   topPosts: object[], recentPosts: object[], recentLeads: object[],
 *   seo: { average: number, good: number, needsWork: number, poor: number, issues: object[] }
 * }>}
 */
export async function getDashboardData() {
  const supabase = await db();
  const now = new Date();

  const [postsRes, leadsRes, mediaRes, pages] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, slug, status, views, published_at, updated_at, created_at, cover_image, category:categories(name)")
      .order("updated_at", { ascending: false }),
    supabase.from("leads").select("id, name, email, company, service, status, created_at").order("created_at", { ascending: false }),
    supabase.from("media").select("id", { count: "exact", head: true }),
    listPageSeo(),
  ]);

  const posts = unwrap(postsRes) || [];
  const leads = unwrap(leadsRes) || [];
  const mediaCount = mediaRes.count || 0;

  const isLive = (p) => p.status === "published" && p.published_at && new Date(p.published_at) <= now;
  const published = posts.filter(isLive);

  // Last 6 months of publishing activity
  const postsByMonth = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    postsByMonth.push({
      month: d.toLocaleDateString("en-US", { month: "short" }),
      published: published.filter((p) => {
        const t = new Date(p.published_at);
        return t >= d && t < next;
      }).length,
    });
  }

  // Last 8 weeks of leads
  const leadsByWeek = [];
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
  for (let i = 7; i >= 0; i--) {
    const from = new Date(startOfWeek);
    from.setDate(from.getDate() - i * 7);
    const to = new Date(from);
    to.setDate(to.getDate() + 7);
    leadsByWeek.push({
      week: from.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      leads: leads.filter((l) => {
        const t = new Date(l.created_at);
        return t >= from && t < to;
      }).length,
    });
  }

  const scores = pages.map((p) => p.score);
  const average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const issues = pages
    .filter((p) => p.score < 80)
    .sort((a, b) => a.score - b.score)
    .slice(0, 6)
    .map((p) => ({
      path: p.path,
      label: p.label,
      score: p.score,
      problems: p.checks.filter((c) => c.status !== "pass").map((c) => c.label),
    }));

  return {
    totals: {
      posts: posts.length,
      published: published.length,
      drafts: posts.filter((p) => p.status === "draft").length,
      scheduled: posts.filter((p) => p.status === "published" && p.published_at && new Date(p.published_at) > now).length,
      views: posts.reduce((sum, p) => sum + (p.views || 0), 0),
      leads: leads.length,
      newLeads: leads.filter((l) => l.status === "new").length,
      media: mediaCount,
    },
    postsByMonth,
    leadsByWeek,
    topPosts: [...published].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
    recentPosts: posts.slice(0, 6),
    recentLeads: leads.slice(0, 5),
    seo: {
      average,
      good: scores.filter((s) => s >= 80).length,
      needsWork: scores.filter((s) => s >= 50 && s < 80).length,
      poor: scores.filter((s) => s < 50).length,
      issues,
    },
  };
}
