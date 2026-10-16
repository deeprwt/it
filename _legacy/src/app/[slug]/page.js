import { notFound } from "next/navigation";
import { catalog, catalogBySlug } from "@/data/catalog";
import { services } from "@/data/services";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";

// One static page per mirrored landing-page URL.
export function generateStaticParams() {
  return catalog.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = catalogBySlug[slug];
  if (!page) return {};
  return {
    title: page.h1,
    description: page.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `/${slug}`,
    },
  };
}

export default async function CatalogPage({ params }) {
  const { slug } = await params;
  const page = catalogBySlug[slug];
  if (!page) notFound();

  // Reuse the rich category template, overriding the hero with this
  // page's real title + meta description from the source site.
  const base = services[page.category] ?? services["web-development"];
  const service = {
    ...base,
    slug: page.slug,
    eyebrow: page.eyebrow,
    title: page.h1,
    heroSummary: page.description,
    image: `/services/${page.category}.webp`,
  };

  const jsonLd = [
    serviceSchema(service),
    faqSchema(service.faqs),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Solutions", url: "/solutions" },
      { name: page.h1, url: `/${slug}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceDetail service={service} />
    </>
  );
}
