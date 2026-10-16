import { notFound } from "next/navigation";
import { JsonLd, PageJsonLd } from "@/components/site/JsonLd";
import { servicePages } from "@/components/site/services/pages";
import { getSiteSettings } from "@/lib/cms";
import { buildPageMetadata, serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { serviceBySlug, serviceSlugs, serviceMetaTitle } from "@/data/services";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) return {};
  return buildPageMetadata(`/services/${slug}`, {
    title: serviceMetaTitle(service),
    description: service.short,
    eyebrow: service.title,
    keywords: service.tags,
  });
}

/** Every service has its own bespoke page design — see components/site/services/pages.jsx. */
export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  const Page = servicePages[slug];
  if (!service || !Page) notFound();

  const settings = await getSiteSettings();
  const path = `/services/${slug}`;

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(service, settings),
          faqSchema(service.faqs),
          breadcrumbSchema(
            [
              { name: "Home", url: "/" },
              { name: "Services", url: "/services" },
              { name: service.title, url: path },
            ],
            settings
          ),
        ]}
      />
      <PageJsonLd path={path} />
      <Page service={service} settings={settings} />
    </>
  );
}
