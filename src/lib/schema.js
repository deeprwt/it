import { site, offices } from "@/data/site";

/** Organization / LocalBusiness JSON-LD for the homepage. */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  description: site.description,
  foundingDate: String(site.foundedYear),
  email: site.email,
  telephone: site.phonePrimary,
  sameAs: [
    "https://www.linkedin.com/company/ribbonit-private-limited/",
    "https://www.instagram.com/ribbonit.official/",
    "https://www.facebook.com/ribbonit/",
    "https://twitter.com/ribbonit",
  ],
  address: offices.map((o) => ({
    "@type": "PostalAddress",
    name: o.label,
    streetAddress: o.address,
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "180",
  },
};

/** Service JSON-LD for a /services/[slug] page. */
export function serviceSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.eyebrow,
    description: service.heroSummary,
    provider: {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
    },
    areaServed: "Worldwide",
  };
}

/** FAQPage JSON-LD from a list of {q, a}. */
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

/** BreadcrumbList JSON-LD. items: [{name, url}] */
export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.url}`,
    })),
  };
}
