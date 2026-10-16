import { getPageSeo } from "@/lib/cms";

function serialize(data) {
  // Escape "<" so content can never close the <script> tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Renders one or more JSON-LD objects. */
export function JsonLd({ data }) {
  if (!data) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(data) }} />;
}

/** Custom structured data added for this route in Dashboard → Pages SEO. */
export async function PageJsonLd({ path }) {
  const seo = await getPageSeo(path);
  if (!seo?.json_ld) return null;
  return <JsonLd data={seo.json_ld} />;
}
