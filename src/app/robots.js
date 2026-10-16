import { getSiteSettings } from "@/lib/cms";

export const revalidate = 600;

export default async function robots() {
  const settings = await getSiteSettings();

  // Global kill-switch from Dashboard → Settings → SEO (useful for staging).
  if (!settings.allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${settings.siteUrl}/sitemap.xml`,
    host: settings.siteUrl,
  };
}
