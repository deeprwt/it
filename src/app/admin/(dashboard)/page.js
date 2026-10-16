import { Eye, FileCheck2, Gauge, Inbox } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/admin-data";
import { scoreLabel } from "@/lib/seo-score";
import { Progress } from "@/components/ui/progress";
import { StatCard, compactNumber } from "@/components/admin/StatCard";
import { GreetingHero } from "@/components/admin/overview/GreetingHero";
import { LeadsChart, PublishingChart } from "@/components/admin/overview/ActivityCharts";
import {
  RecentLeadsCard,
  RecentPostsCard,
  SeoHealthCard,
  SeoIssuesCard,
  TopPostsCard,
} from "@/components/admin/overview/OverviewPanels";

export const metadata = { title: "Overview" };

const BAR = { success: "bg-success", warning: "bg-warning", destructive: "bg-destructive" };

export default async function OverviewPage() {
  const [{ profile }, data] = await Promise.all([getSession(), getDashboardData()]);
  const { totals, seo } = data;
  const { tone } = scoreLabel(seo.average);

  return (
    <>
      <GreetingHero profile={profile} seoScore={seo.average} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Published posts"
          value={totals.published.toLocaleString("en-US")}
          sub={`${totals.drafts} draft${totals.drafts === 1 ? "" : "s"} · ${totals.scheduled} scheduled`}
          icon={FileCheck2}
          tone="brand"
        />
        <StatCard
          label="Total views"
          value={compactNumber(totals.views)}
          sub={`across ${totals.published} live post${totals.published === 1 ? "" : "s"}`}
          icon={Eye}
          tone="violet"
        />
        <StatCard
          label="New leads"
          value={totals.newLeads.toLocaleString("en-US")}
          sub={`of ${totals.leads.toLocaleString("en-US")} total`}
          icon={Inbox}
          tone="success"
        />
        <StatCard label="Avg SEO score" value={`${seo.average}/100`} sub={scoreLabel(seo.average).label} icon={Gauge} tone={tone}>
          <Progress value={seo.average} indicatorClassName={BAR[tone]} aria-label={`Average SEO score ${seo.average} of 100`} />
        </StatCard>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-7">
          <PublishingChart data={data.postsByMonth} />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <SeoHealthCard seo={seo} />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <LeadsChart data={data.leadsByWeek} />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <SeoIssuesCard issues={seo.issues} />
        </div>
        <div className="col-span-12 xl:col-span-8">
          <RecentPostsCard posts={data.recentPosts} />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <TopPostsCard posts={data.topPosts} />
        </div>
        <div className="col-span-12">
          <RecentLeadsCard leads={data.recentLeads} />
        </div>
      </div>
    </>
  );
}
