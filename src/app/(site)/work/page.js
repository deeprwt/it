import { PageHero } from "@/components/site/PageHero";
import { WorkGrid } from "@/components/site/work/WorkGrid";
import { StatsBand } from "@/components/site/sections/HomeSections";
import { CtaSection } from "@/components/site/sections/CtaSection";
import { JsonLd, PageJsonLd } from "@/components/site/JsonLd";
import { getSiteSettings } from "@/lib/cms";
import { buildPageMetadata, breadcrumbSchema } from "@/lib/seo";

export const revalidate = 3600;

export function generateMetadata() {
  return buildPageMetadata("/work");
}

export default async function WorkPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: "Home", url: "/" },
            { name: "Work", url: "/work" },
          ],
          settings
        )}
      />
      <PageJsonLd path="/work" />
      <PageHero
        eyebrow="selected work"
        title="Proof, not"
        accent="promises."
        description="A few of the products, platforms and storefronts we've designed, engineered and grown with our clients."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Work" }]}
      />
      <WorkGrid />
      <StatsBand />
      <CtaSection email={settings.email} />
    </>
  );
}
