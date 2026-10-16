"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cms";
import { slugify, readingTime } from "@/lib/format";
import { run, check, str, strArray, bool, url } from "./utils";

const STATUSES = ["draft", "published", "archived"];

function revalidateBlog(...slugs) {
  revalidateTag(CACHE_TAGS.posts);
  revalidatePath("/blog");
  revalidatePath("/");
  for (const slug of slugs.filter(Boolean)) revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}

function normalizePost(input) {
  const title = str(input.title, 200);
  if (!title) throw new Error("Give your post a title.");

  const slug = slugify(input.slug || title);
  if (!slug) throw new Error("The URL slug can't be empty.");

  const status = STATUSES.includes(input.status) ? input.status : "draft";
  const content = typeof input.content === "string" ? input.content.slice(0, 500_000) : "";

  let published_at = input.published_at ? new Date(input.published_at) : null;
  if (published_at && Number.isNaN(published_at.getTime())) published_at = null;
  if (status === "published" && !published_at) published_at = new Date();

  return {
    title,
    slug,
    excerpt: str(input.excerpt, 600),
    content,
    cover_image: url(input.cover_image),
    cover_image_alt: str(input.cover_image_alt, 250),
    category_id: input.category_id || null,
    tags: strArray(input.tags, { max: 15, maxLen: 40 }),
    keywords: strArray(input.keywords, { max: 25, maxLen: 80 }),
    focus_keyword: str(input.focus_keyword, 100),
    author_name: str(input.author_name, 120),
    status,
    featured: bool(input.featured),
    reading_time: readingTime(content),
    published_at: published_at ? published_at.toISOString() : null,
    meta_title: str(input.meta_title, 120),
    meta_description: str(input.meta_description, 320),
    canonical_url: url(input.canonical_url),
    og_title: str(input.og_title, 120),
    og_description: str(input.og_description, 320),
    og_image: url(input.og_image),
    no_index: bool(input.no_index),
    no_follow: bool(input.no_follow),
  };
}

/**
 * Create (no id) or update (with id) a post.
 * @returns {Promise<{ok: boolean, data?: {id: string, slug: string, status: string}, error?: string}>}
 */
export async function savePost(input) {
  return run(async () => {
    const { supabase, user, profile } = await requireStaff();
    const values = normalizePost(input || {});

    if (input?.id) {
      const previous = check(await supabase.from("posts").select("slug").eq("id", input.id).single());
      const saved = check(
        await supabase.from("posts").update(values).eq("id", input.id).select("id, slug, status").single()
      );
      revalidateBlog(previous.slug, saved.slug);
      return saved;
    }

    const saved = check(
      await supabase
        .from("posts")
        .insert({
          ...values,
          author_id: user.id,
          author_name: values.author_name || profile?.full_name || null,
        })
        .select("id, slug, status")
        .single()
    );
    revalidateBlog(saved.slug);
    return saved;
  });
}

export async function setPostStatus(id, status) {
  return run(async () => {
    if (!STATUSES.includes(status)) throw new Error("Unknown status.");
    const { supabase } = await requireStaff();
    const current = check(await supabase.from("posts").select("slug, published_at").eq("id", id).single());
    const patch = { status };
    if (status === "published" && !current.published_at) patch.published_at = new Date().toISOString();
    const saved = check(await supabase.from("posts").update(patch).eq("id", id).select("id, slug, status").single());
    revalidateBlog(saved.slug);
    return saved;
  });
}

export async function deletePost(id) {
  return run(async () => {
    const { supabase } = await requireStaff();
    const removed = check(await supabase.from("posts").delete().eq("id", id).select("slug").single());
    revalidateBlog(removed.slug);
    return { id };
  });
}

export async function duplicatePost(id) {
  return run(async () => {
    const { supabase, user } = await requireStaff();
    const source = check(await supabase.from("posts").select("*").eq("id", id).single());
    // eslint-disable-next-line no-unused-vars
    const { id: _id, created_at, updated_at, views, ...rest } = source;
    const copy = check(
      await supabase
        .from("posts")
        .insert({
          ...rest,
          title: `${source.title} (copy)`,
          slug: `${source.slug}-copy-${Date.now().toString(36).slice(-4)}`,
          status: "draft",
          published_at: null,
          featured: false,
          author_id: user.id,
        })
        .select("id, slug, status")
        .single()
    );
    return copy;
  });
}

// ── Categories ───────────────────────────────────────────────────────

export async function saveCategory(input) {
  return run(async () => {
    const { supabase } = await requireStaff();
    const name = str(input?.name, 80);
    if (!name) throw new Error("Category name is required.");
    const values = {
      name,
      slug: slugify(input?.slug || name),
      description: str(input?.description, 300),
    };
    const saved = input?.id
      ? check(await supabase.from("categories").update(values).eq("id", input.id).select().single())
      : check(await supabase.from("categories").insert(values).select().single());
    revalidateTag(CACHE_TAGS.categories);
    revalidateTag(CACHE_TAGS.posts);
    revalidatePath("/blog");
    return saved;
  });
}

export async function deleteCategory(id) {
  return run(async () => {
    const { supabase } = await requireStaff();
    check(await supabase.from("categories").delete().eq("id", id));
    revalidateTag(CACHE_TAGS.categories);
    revalidateTag(CACHE_TAGS.posts);
    revalidatePath("/blog");
    return { id };
  });
}
