import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  FileText,
  Inbox,
  PartyPopper,
  Plus,
  SearchCheck,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/admin/EmptyState";
import { RelativeTime } from "@/components/admin/RelativeTime";
import { SectionCard } from "@/components/admin/SectionCard";
import { ScoreBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { UserAvatar } from "@/components/admin/shell/UserAvatar";
import { compactNumber } from "@/components/admin/StatCard";
import { scoreLabel } from "@/lib/seo-score";
import { cn } from "@/lib/utils";

function ViewAll({ href, children = "View all" }) {
  return (
    <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">
      <Link href={href}>
        {children} <ArrowRight />
      </Link>
    </Button>
  );
}

// ── SEO health ───────────────────────────────────────────────────────

const HEALTH = [
  { key: "good", label: "Good", range: "80–100", icon: CheckCircle2, bar: "bg-success", text: "text-success" },
  { key: "needsWork", label: "Needs work", range: "50–79", icon: AlertTriangle, bar: "bg-warning", text: "text-warning" },
  { key: "poor", label: "Poor", range: "0–49", icon: XCircle, bar: "bg-destructive", text: "text-destructive" },
];

export function SeoHealthCard({ seo }) {
  const total = seo.good + seo.needsWork + seo.poor;
  const { label, tone } = scoreLabel(seo.average);

  return (
    <SectionCard
      title="SEO health"
      description={`${total} page${total === 1 ? "" : "s"} analysed`}
      icon={SearchCheck}
      actions={<ViewAll href="/admin/seo">Pages SEO</ViewAll>}
      className="h-full"
    >
      <div className="flex items-end justify-between gap-4">
        <p className="leading-none">
          <span className="text-5xl font-bold tracking-tight text-foreground">{seo.average}</span>
          <span className="ml-1 text-sm text-muted-foreground">/ 100 average</span>
        </p>
        <Badge variant={tone}>
          {tone === "success" ? <CheckCircle2 /> : tone === "warning" ? <AlertTriangle /> : <XCircle />}
          {label}
        </Badge>
      </div>

      {total > 0 ? (
        <>
          <div className="mt-6 flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-muted" role="img" aria-label={HEALTH.map((h) => `${seo[h.key]} ${h.label}`).join(", ")}>
            {HEALTH.filter((h) => seo[h.key] > 0).map((h) => (
              <span key={h.key} className={cn("h-full basis-0", h.bar)} style={{ flexGrow: seo[h.key] }} />
            ))}
          </div>
          <ul className="mt-5 space-y-2">
            {HEALTH.map((h) => {
              const Icon = h.icon;
              const count = seo[h.key];
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <li key={h.key} className="flex items-center gap-3 rounded-xl border bg-background/40 px-3 py-2.5">
                  <Icon className={cn("h-4 w-4 shrink-0", h.text)} aria-hidden />
                  <span className="flex-1 text-sm font-medium text-foreground">
                    {h.label} <span className="font-normal text-muted-foreground">· score {h.range}</span>
                  </span>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">{pct}%</span>
                  <span className="w-8 text-right text-sm font-semibold tabular-nums text-foreground">{count}</span>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <EmptyState compact icon={SearchCheck} title="No pages registered" />
      )}
    </SectionCard>
  );
}

// ── SEO issues ───────────────────────────────────────────────────────

export function SeoIssuesCard({ issues = [] }) {
  return (
    <SectionCard
      title="SEO issues to fix"
      description="Lowest-scoring pages first"
      icon={AlertTriangle}
      actions={<ViewAll href="/admin/seo" />}
      className="h-full"
      contentClassName="p-3"
    >
      {issues.length === 0 ? (
        <EmptyState
          compact
          icon={PartyPopper}
          title="All pages look healthy"
          description="Every registered page scores 80 or more. Keep it up!"
        />
      ) : (
        <ul className="space-y-1">
          {issues.map((issue) => (
            <li key={issue.path}>
              <Link
                href={`/admin/seo/edit?path=${encodeURIComponent(issue.path)}`}
                className="group flex items-start gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ScoreBadge score={issue.score} className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className="truncate">{issue.label}</span>
                    <span className="truncate font-mono text-[11px] font-normal text-muted-foreground">{issue.path}</span>
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {issue.problems.length ? issue.problems.join(" · ") : "Minor improvements available"}
                  </p>
                </div>
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

// ── Recent posts ─────────────────────────────────────────────────────

export function RecentPostsCard({ posts = [] }) {
  return (
    <SectionCard
      title="Recent posts"
      description="Latest edits across all statuses"
      icon={FileText}
      actions={<ViewAll href="/admin/posts" />}
      className="h-full"
      contentClassName="p-0"
    >
      {posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No posts yet"
          description="Write your first article — it's the fastest way to grow organic traffic."
          action={
            <Button asChild variant="brand" size="sm">
              <Link href="/admin/posts/new">
                <Plus /> New post
              </Link>
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Post</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="pr-5 text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="pl-5">
                  <Link href={`/admin/posts/${post.id}`} className="group flex min-w-[14rem] items-center gap-3">
                    <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {post.cover_image ? (
                        <Image src={post.cover_image} alt="" fill unoptimized sizes="48px" className="object-cover" />
                      ) : (
                        <FileText className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-foreground group-hover:text-brand">{post.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{post.category?.name || "Uncategorized"}</span>
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge status={post.status} publishedAt={post.published_at} />
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                  {(post.views || 0).toLocaleString("en-US")}
                </TableCell>
                <TableCell className="whitespace-nowrap pr-5 text-right text-xs text-muted-foreground">
                  <RelativeTime value={post.updated_at} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </SectionCard>
  );
}

// ── Top posts ────────────────────────────────────────────────────────

export function TopPostsCard({ posts = [] }) {
  const max = Math.max(1, ...posts.map((p) => p.views || 0));
  return (
    <SectionCard title="Top posts" description="Most viewed, all time" icon={TrendingUp} className="h-full" contentClassName="p-3">
      {posts.length === 0 ? (
        <EmptyState compact icon={Eye} title="No views yet" description="Published posts will be ranked here by views." />
      ) : (
        <ol className="space-y-1">
          {posts.map((post, i) => {
            const pct = Math.round(((post.views || 0) / max) * 100);
            return (
              <li key={post.id}>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border bg-muted/60 font-mono text-xs font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium text-foreground group-hover:text-brand">{post.title}</span>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                        {compactNumber(post.views || 0)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
                      <div className="h-full rounded-full bg-chart-1" style={{ width: `${Math.max(pct, 2)}%` }} />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </SectionCard>
  );
}

// ── Recent leads ─────────────────────────────────────────────────────

export function RecentLeadsCard({ leads = [] }) {
  return (
    <SectionCard
      title="Recent leads"
      description="Newest contact form submissions"
      icon={Inbox}
      actions={<ViewAll href="/admin/leads">Open inbox</ViewAll>}
    >
      {leads.length === 0 ? (
        <EmptyState
          compact
          icon={Inbox}
          title="Your inbox is empty"
          description="When someone fills in the contact form on the website, they'll show up here."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {leads.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/admin/leads?lead=${lead.id}`}
                className="group flex h-full flex-col gap-3 rounded-xl border bg-background/40 p-4 outline-none transition-all hover:-translate-y-0.5 hover:border-brand/30 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar profile={{ full_name: lead.name }} className="h-9 w-9" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground group-hover:text-brand">{lead.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{lead.company || lead.email}</p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <StatusBadge kind="lead" status={lead.status} />
                  <RelativeTime value={lead.created_at} className="text-[11px] text-muted-foreground" />
                </div>
                {lead.service && <p className="truncate text-xs text-muted-foreground">{lead.service}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
