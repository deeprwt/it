import { getAllPageSeo, getPublishedPosts, getSiteSettings } from "@/lib/cms";
import { staticPages } from "@/data/pages";

export const revalidate = 600;

/** sitemap.xml — static routes (with dashboard overrides) + every live blog post. */
export default async function sitemap() {
  const [settings, seoMap, posts] = await Promise.all([getSiteSettings(), getAllPageSeo(), getPublishedPosts()]);
  const base = settings.siteUrl;
  if (!settings.allowIndexing) return [];

  const pages = staticPages
    .map((page) => {
      const seo = seoMap[page.path];
      if (seo && (seo.no_index || seo.include_in_sitemap === false)) return null;
      return {
        url: `${base}${page.path === "/" ? "" : page.path}`,
        lastModified: seo?.updated_at ? new Date(seo.updated_at) : new Date(),
        changeFrequency: seo?.sitemap_changefreq || page.changefreq || "monthly",
        priority: Number(seo?.sitemap_priority ?? page.priority ?? 0.7),
      };
    })
    .filter(Boolean);

  const blog = posts
    .filter((p) => !p.no_index)
    .map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at || p.published_at),
      changeFrequency: "monthly",
      priority: p.featured ? 0.8 : 0.6,
    }));

  return [...pages, ...blog];
}
