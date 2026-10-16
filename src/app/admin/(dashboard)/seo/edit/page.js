import { notFound } from "next/navigation";
import { getPageSeoRow } from "@/lib/admin-data";
import { getSiteSettings } from "@/lib/cms";
import { pageByPath } from "@/data/pages";
import { PageSeoEditor } from "@/components/admin/seo/PageSeoEditor";

export const metadata = { title: "Edit page SEO" };

export default async function EditPageSeoPage({ searchParams }) {
  const params = await searchParams;
  const raw = Array.isArray(params?.path) ? params.path[0] : params?.path;
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//") || raw.length > 300) notFound();
  const path = raw.length > 1 ? raw.replace(/\/+$/, "") : raw;

  const [row, settings] = await Promise.all([getPageSeoRow(path), getSiteSettings()]);
  const registry = pageByPath[path] || null;

  return (
    <PageSeoEditor
      key={path}
      path={path}
      row={row}
      registry={registry}
      site={{
        siteName: settings.siteName,
        siteUrl: settings.siteUrl,
        titleTemplate: settings.titleTemplate,
        defaultTitle: settings.defaultTitle,
        defaultDescription: settings.defaultDescription,
        defaultOgImage: settings.defaultOgImage,
        allowIndexing: settings.allowIndexing,
      }}
    />
  );
}
