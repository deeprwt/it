import { EyeOff, Gauge, Layers, SearchCheck } from "lucide-react";
import { listPageSeo } from "@/lib/admin-data";
import { getSiteSettings } from "@/lib/cms";
import { scoreLabel } from "@/lib/seo-score";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { PagesSeoTable } from "@/components/admin/seo/PagesSeoTable";

export const metadata = { title: "Pages SEO" };

const BAR = { success: "bg-success", warning: "bg-warning", destructive: "bg-destructive" };

export default async function PagesSeoPage({ searchParams }) {
  const [params, pages, settings] = await Promise.all([searchParams, listPageSeo(), getSiteSettings()]);

  const average = pages.length ? Math.round(pages.reduce((s, p) => s + p.score, 0) / pages.length) : 0;
  const configured = pages.filter((p) => p.configured).length;
  const noindex = pages.filter((p) => p.seo?.no_index).length;
  const { label, tone } = scoreLabel(average);

  const rows = pages.map((p) => ({
    path: p.path,
    label: p.label,
    group: p.group,
    configured: p.configured,
    score: p.score,
    metaTitle: p.seo?.meta_title || "",
    defaultTitle: p.title ? (p.path === "/" ? p.title : settings.titleTemplate.replace("%s", p.title)) : settings.defaultTitle,
    noIndex: Boolean(p.seo?.no_index),
    updatedAt: p.seo?.updated_at || null,
  }));

  return (
    <>
      <PageHeader
        title="Pages SEO"
        description="Meta titles, descriptions, social cards and sitemap settings for every page on the site."
        icon={SearchCheck}
        breadcrumbs={[{ label: "Pages SEO" }]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Average score" value={`${average}/100`} sub={label} icon={Gauge} tone={tone}>
          <Progress value={average} indicatorClassName={BAR[tone]} aria-label={`Average SEO score ${average} of 100`} />
        </StatCard>
        <StatCard
          label="Pages configured"
          value={`${configured} / ${pages.length}`}
          sub={configured < pages.length ? `${pages.length - configured} still use code defaults` : "Every page has custom SEO"}
          icon={Layers}
          tone="brand"
        >
          <Progress value={pages.length ? (configured / pages.length) * 100 : 0} aria-label="Pages configured" />
        </StatCard>
        <StatCard
          label="Hidden from search"
          value={noindex}
          sub={noindex ? "page(s) set to noindex" : "All pages are indexable"}
          icon={EyeOff}
          tone={noindex ? "warning" : "success"}
        />
      </div>

      <PagesSeoTable rows={rows} openAdd={params?.add === "1"} />
    </>
  );
}
