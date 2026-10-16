import { PageHero } from "@/components/site/PageHero";
import { BlogIndex } from "@/components/site/blog/BlogIndex";
import { CtaSection } from "@/components/site/sections/CtaSection";
import { JsonLd, PageJsonLd } from "@/components/site/JsonLd";
import { getCategories, getPublishedPosts, getSiteSettings } from "@/lib/cms";
import { absoluteUrl, buildPageMetadata, breadcrumbSchema } from "@/lib/seo";

export const revalidate = 300;

export function generateMetadata() {
  return buildPageMetadata("/blog");
}

export default async function BlogPage() {
  const [settings, posts, categories] = await Promise.all([getSiteSettings(), getPublishedPosts(), getCategories()]);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${settings.siteName} Blog`,
    url: absoluteUrl("/blog", settings.siteUrl),
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(`/blog/${p.slug}`, settings.siteUrl),
      datePublished: p.published_at,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          blogSchema,
          breadcrumbSchema(
            [
              { name: "Home", url: "/" },
              { name: "Blog", url: "/blog" },
            ],
            settings
          ),
        ]}
      />
      <PageJsonLd path="/blog" />
      <PageHero
        eyebrow="blog"
        title="Notes from the"
        accent="build log."
        description="Practical writing on web engineering, product design, AI and SEO — straight from the people shipping it."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Blog" }]}
        className="pb-12 md:pb-16"
      />
      <BlogIndex posts={posts} categories={categories} />
      <CtaSection email={settings.email} />
    </>
  );
}
