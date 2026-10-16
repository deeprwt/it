import { getPublishedPosts, getSiteSettings } from "@/lib/cms";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 600;

const escape = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function GET() {
  const [settings, posts] = await Promise.all([getSiteSettings(), getPublishedPosts()]);
  const blogUrl = absoluteUrl("/blog", settings.siteUrl);

  const items = posts
    .slice(0, 50)
    .map((p) => {
      const link = absoluteUrl(`/blog/${p.slug}`, settings.siteUrl);
      return `    <item>
      <title>${escape(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
      ${p.excerpt ? `<description>${escape(p.excerpt)}</description>` : ""}
      ${p.category?.name ? `<category>${escape(p.category.name)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${settings.siteName} Blog`)}</title>
    <link>${blogUrl}</link>
    <description>${escape(settings.defaultDescription)}</description>
    <language>en</language>
    <atom:link href="${blogUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
