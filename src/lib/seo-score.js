import { stripHtml, wordCount } from "@/lib/format";

/**
 * Live SEO analysis used by the dashboard editors (pure, client-safe).
 * Each check returns { id, label, status: "pass" | "warn" | "fail", hint }.
 */

export const LIMITS = {
  title: { min: 30, max: 60 },
  description: { min: 120, max: 160 },
  slug: { max: 75 },
  content: { min: 300, good: 900 },
};

const has = (haystack = "", needle = "") =>
  Boolean(needle) && haystack.toLowerCase().includes(needle.toLowerCase().trim());

function lengthCheck(id, label, value, { min, max }) {
  const len = (value || "").trim().length;
  if (!len) return { id, label, status: "fail", hint: `Add a ${label.toLowerCase()}.` };
  if (len < min) return { id, label, status: "warn", hint: `${len} chars — aim for ${min}–${max}.` };
  if (len > max) return { id, label, status: "warn", hint: `${len} chars — may be truncated after ${max}.` };
  return { id, label, status: "pass", hint: `${len} chars — perfect length.` };
}

export function scoreFromChecks(checks) {
  if (!checks.length) return 0;
  const points = checks.reduce((sum, c) => sum + (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0), 0);
  return Math.round((points / checks.length) * 100);
}

export function scoreLabel(score) {
  if (score >= 80) return { label: "Good", tone: "success" };
  if (score >= 50) return { label: "Needs work", tone: "warning" };
  return { label: "Poor", tone: "destructive" };
}

/** Analyse a blog post draft. */
export function analyzePost(post) {
  const keyword = (post.focus_keyword || "").trim();
  const title = post.meta_title || post.title || "";
  const description = post.meta_description || post.excerpt || "";
  const text = stripHtml(post.content || "");
  const words = wordCount(post.content || "");
  const firstParagraph = text.split(" ").slice(0, 120).join(" ");
  const html = post.content || "";
  const checks = [];

  checks.push(lengthCheck("title", "SEO title", title, LIMITS.title));
  checks.push(lengthCheck("description", "Meta description", description, LIMITS.description));

  if (!keyword) {
    checks.push({ id: "keyword", label: "Focus keyword", status: "fail", hint: "Set a focus keyword to analyse." });
  } else {
    checks.push({
      id: "kw-title",
      label: "Keyword in title",
      status: has(title, keyword) ? "pass" : "fail",
      hint: has(title, keyword) ? "Great — the title targets your keyword." : `Add "${keyword}" to the SEO title.`,
    });
    checks.push({
      id: "kw-desc",
      label: "Keyword in description",
      status: has(description, keyword) ? "pass" : "warn",
      hint: has(description, keyword) ? "Keyword appears in the description." : "Mention the keyword in the meta description.",
    });
    const slugKeyword = keyword.toLowerCase().replace(/\s+/g, "-");
    checks.push({
      id: "kw-slug",
      label: "Keyword in URL",
      status: has(post.slug, slugKeyword) ? "pass" : "warn",
      hint: has(post.slug, slugKeyword) ? "The slug contains the keyword." : `Consider a slug containing "${slugKeyword}".`,
    });
    checks.push({
      id: "kw-intro",
      label: "Keyword in introduction",
      status: has(firstParagraph, keyword) ? "pass" : "warn",
      hint: has(firstParagraph, keyword) ? "Keyword appears early in the content." : "Use the keyword in the first paragraph.",
    });
    const occurrences = keyword ? text.toLowerCase().split(keyword.toLowerCase()).length - 1 : 0;
    const density = words ? (occurrences * keyword.split(" ").length * 100) / words : 0;
    checks.push({
      id: "kw-density",
      label: "Keyword density",
      status: density >= 0.5 && density <= 2.5 ? "pass" : occurrences ? "warn" : "fail",
      hint: `${density.toFixed(1)}% (${occurrences}×) — aim for 0.5–2.5%.`,
    });
  }

  checks.push({
    id: "length",
    label: "Content length",
    status: words >= LIMITS.content.good ? "pass" : words >= LIMITS.content.min ? "warn" : "fail",
    hint: `${words} words — ${words >= LIMITS.content.good ? "nice depth." : `aim for ${LIMITS.content.good}+ for competitive topics.`}`,
  });

  const subheadings = (html.match(/<h[23][\s>]/gi) || []).length;
  checks.push({
    id: "headings",
    label: "Subheadings",
    status: subheadings >= 2 ? "pass" : subheadings === 1 ? "warn" : "fail",
    hint: subheadings ? `${subheadings} H2/H3 headings.` : "Break the content up with H2/H3 headings.",
  });

  const links = (html.match(/<a\s[^>]*href=/gi) || []).length;
  checks.push({
    id: "links",
    label: "Links",
    status: links >= 2 ? "pass" : links === 1 ? "warn" : "fail",
    hint: links ? `${links} link(s) in the content.` : "Add internal and outbound links.",
  });

  const images = html.match(/<img\s[^>]*>/gi) || [];
  const missingAlt = images.filter((img) => !/alt="[^"]+"/i.test(img)).length;
  checks.push({
    id: "cover",
    label: "Cover image & alt text",
    status: post.cover_image ? (post.cover_image_alt ? "pass" : "warn") : "fail",
    hint: post.cover_image
      ? post.cover_image_alt
        ? "Cover image has alt text."
        : "Describe the cover image in the alt text."
      : "Add a cover image — it is also used for social sharing.",
  });
  if (images.length) {
    checks.push({
      id: "img-alt",
      label: "Image alt attributes",
      status: missingAlt ? "warn" : "pass",
      hint: missingAlt ? `${missingAlt} image(s) missing alt text.` : "All images have alt text.",
    });
  }

  checks.push({
    id: "slug",
    label: "URL length",
    status: !post.slug ? "fail" : post.slug.length <= LIMITS.slug.max ? "pass" : "warn",
    hint: post.slug ? `${post.slug.length} chars.` : "Add a slug.",
  });

  checks.push({
    id: "keywords",
    label: "Keywords",
    status: post.keywords?.length >= 3 ? "pass" : post.keywords?.length ? "warn" : "fail",
    hint: post.keywords?.length ? `${post.keywords.length} keyword(s) added.` : "Add 3–8 related keywords.",
  });

  if (post.no_index) {
    checks.push({ id: "index", label: "Indexing", status: "warn", hint: "This post is set to noindex." });
  }

  return { checks, score: scoreFromChecks(checks) };
}

/** Analyse a static page's SEO record. */
export function analyzePage(seo = {}) {
  const checks = [
    lengthCheck("title", "Meta title", seo.meta_title, LIMITS.title),
    lengthCheck("description", "Meta description", seo.meta_description, LIMITS.description),
    {
      id: "og",
      label: "Social image",
      status: seo.og_image ? "pass" : "warn",
      hint: seo.og_image ? "Custom OG image set." : "Using the auto-generated card — upload a custom image for better CTR.",
    },
    {
      id: "keywords",
      label: "Keywords",
      status: seo.keywords?.length ? "pass" : "warn",
      hint: seo.keywords?.length ? `${seo.keywords.length} keyword(s).` : "Add target keywords for this page.",
    },
    {
      id: "index",
      label: "Indexable",
      status: seo.no_index ? "warn" : "pass",
      hint: seo.no_index ? "Hidden from search engines (noindex)." : "Visible to search engines.",
    },
  ];
  return { checks, score: scoreFromChecks(checks) };
}

/** Rough Google SERP pixel-width truncation (title ≈ 580px). */
export function serpTruncate(text = "", maxChars) {
  const t = text.trim();
  return t.length > maxChars ? `${t.slice(0, maxChars - 1).trimEnd()}…` : t;
}
