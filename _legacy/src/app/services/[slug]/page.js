import { notFound } from "next/navigation";
import { services, serviceSlugs } from "@/data/services";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";

// Pre-render every service page at build time.
export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) return {};

  return {
    title: `${service.eyebrow} — Ribbon IT`,
    description: service.heroSummary,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: `${service.eyebrow} — Ribbon IT`,
      description: service.heroSummary,
      url: `/services/${slug}`,
    },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const data = services[slug];

  if (!data) notFound();

  const service = { ...data, image: `/services/${slug}.webp` };

  const jsonLd = [
    serviceSchema(service),
    faqSchema(service.faqs),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
      { name: service.eyebrow, url: `/services/${slug}` },
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
