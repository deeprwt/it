import { site } from "@/data/site";
import { serviceSlugs } from "@/data/services";
import { catalog } from "@/data/catalog";

export default function sitemap() {
  const base = site.url;

  const core = ["", "/about", "/services", "/solutions", "/case-studies", "/blog", "/careers", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.8,
    })
  );

  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const catalogRoutes = catalog.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...core, ...serviceRoutes, ...catalogRoutes];
}
