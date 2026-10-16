import "server-only";
import { getSiteSettings, getPageSeo } from "@/lib/cms";
import { pageByPath } from "@/data/pages";

/**
 * Turns dashboard SEO data into Next.js `Metadata`.
 *
 * Precedence for every field:  page_seo row (dashboard)  →  code fallback
 * passed by the page  →  route registry default  →  global site settings.
 */

export function absoluteUrl(path, siteUrl) {
  if (!path) return siteUrl;
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Dynamic branded OG card (see app/api/og/route.js). */
export function ogImagePath({ title, eyebrow }) {
  const params = new URLSearchParams({ title: title || "" });
  if (eyebrow) params.set("eyebrow", eyebrow);
  return `/api/og?${params.toString()}`;
}

function robotsFor({ allowIndexing, noIndex, noFollow }) {
  const index = allowIndexing && !noIndex;
  const follow = allowIndexing && !noFollow;
  return {
    index,
    follow,
    googleBot: { index, follow, "max-image-preview": "large", "max-snippet": -1 },
  };
}

/**
 * Metadata for a static route registered in data/pages.js.
 * @param {string} path  e.g. "/about"
 * @param {object} [fallback]  { title, description, eyebrow, keywords }
 */
export async function buildPageMetadata(path, fallback = {}) {
  const [settings, seo] = await Promise.all([getSiteSettings(), getPageSeo(path)]);
  const reg = pageByPath[path] || {};

  const dbTitle = seo?.meta_title?.trim();
  const baseTitle = fallback.title || reg.title || settings.defaultTitle;
  const isHome = path === "/";
  const title = dbTitle ? { absolute: dbTitle } : isHome ? { absolute: baseTitle } : baseTitle;
  const resolvedTitle = dbTitle || (isHome ? baseTitle : settings.titleTemplate.replace("%s", baseTitle));

  const description =
    seo?.meta_description?.trim() || fallback.description || reg.description || settings.defaultDescription;

  const keywords = seo?.keywords?.length ? seo.keywords : fallback.keywords || settings.defaultKeywords;
  const ogTitle = seo?.og_title?.trim() || resolvedTitle;
  const ogDescription = seo?.og_description?.trim() || description;
  const image =
    seo?.og_image ||
    fallback.image ||
    settings.defaultOgImage ||
    ogImagePath({ title: dbTitle || baseTitle, eyebrow: fallback.eyebrow || reg.label });

  const images = [{ url: image, width: 1200, height: 630, alt: seo?.og_image_alt || ogTitle }];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: seo?.canonical_url?.trim() || path },
    robots: robotsFor({
      allowIndexing: settings.allowIndexing,
      noIndex: seo?.no_index,
      noFollow: seo?.no_follow,
    }),
    openGraph: {
      type: "website",
      url: path,
      siteName: settings.siteName,
      title: ogTitle,
      description: ogDescription,
      images,
      locale: "en_US",
    },
    twitter: {
      card: seo?.twitter_card || "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [image],
      ...(settings.twitterHandle ? { site: settings.twitterHandle, creator: settings.twitterHandle } : {}),
    },
  };
}

/** Metadata for a blog post — all fields come from the post editor. */
export async function buildPostMetadata(post) {
  const settings = await getSiteSettings();
  const path = `/blog/${post.slug}`;
  const title = post.meta_title?.trim() || post.title;
  const description = post.meta_description?.trim() || post.excerpt || settings.defaultDescription;
  const ogTitle = post.og_title?.trim() || title;
  const ogDescription = post.og_description?.trim() || description;
  const image =
    post.og_image || post.cover_image || ogImagePath({ title: post.title, eyebrow: post.category?.name || "Blog" });

  return {
    title: post.meta_title?.trim() ? { absolute: title } : title,
    description,
    keywords: post.keywords?.length ? post.keywords : post.tags,
    authors: post.author_name ? [{ name: post.author_name }] : undefined,
    alternates: { canonical: post.canonical_url?.trim() || path },
    robots: robotsFor({
      allowIndexing: settings.allowIndexing,
      noIndex: post.no_index,
      noFollow: post.no_follow,
    }),
    openGraph: {
      type: "article",
      url: path,
      siteName: settings.siteName,
      title: ogTitle,
      description: ogDescription,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: post.author_name ? [post.author_name] : undefined,
      section: post.category?.name,
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.cover_image_alt || ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [image],
      ...(settings.twitterHandle ? { site: settings.twitterHandle, creator: settings.twitterHandle } : {}),
    },
  };
}

// ── JSON-LD builders ─────────────────────────────────────────────────

export function organizationSchema(settings) {
  const sameAs = Object.values(settings.socials || {}).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: settings.siteUrl,
    logo: absoluteUrl("/brand/snowdox-logo-512.png", settings.siteUrl),
    description: settings.defaultDescription,
    email: settings.email || undefined,
    telephone: settings.phone || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function websiteSchema(settings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName,
    url: settings.siteUrl,
  };
}

export function serviceSchema(service, settings) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    serviceType: service.title,
    areaServed: "Worldwide",
    provider: { "@type": "Organization", name: settings.siteName, url: settings.siteUrl },
  };
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items, settings) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url, settings.siteUrl),
    })),
  };
}

export function blogPostingSchema(post, settings) {
  const url = absoluteUrl(`/blog/${post.slug}`, settings.siteUrl);
  const image = post.og_image || post.cover_image;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: image ? absoluteUrl(image, settings.siteUrl) : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    keywords: (post.keywords || []).join(", ") || undefined,
    articleSection: post.category?.name,
    author: post.author_name ? { "@type": "Person", name: post.author_name } : { "@type": "Organization", name: settings.siteName },
    publisher: {
      "@type": "Organization",
      name: settings.siteName,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/snowdox-logo-512.png", settings.siteUrl) },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}
