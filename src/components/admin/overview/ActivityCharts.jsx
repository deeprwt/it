"use client";

import Link from "next/link";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CalendarRange, Inbox, PenLine, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { EmptyState } from "@/components/admin/EmptyState";
import { ChartCard } from "@/components/admin/overview/ChartCard";

// Single-series charts: slot 1 of the validated categorical palette, no legend (the card title names it).
const publishingConfig = { published: { label: "Posts published", color: "hsl(var(--chart-1))" } };
const leadsConfig = { leads: { label: "Leads", color: "hsl(var(--chart-1))" } };

const axisProps = { tickLine: false, axisLine: false, tickMargin: 8, tick: { fontSize: 11 } };

export function PublishingChart({ data = [] }) {
  const total = data.reduce((sum, d) => sum + (d.published || 0), 0);
  const range = data.length ? `${data[0].month} – ${data[data.length - 1].month}` : "";

  return (
    <ChartCard
      title="Publishing activity"
      description="Posts that went live per month"
      icon={PenLine}
      headline={total}
      headlineLabel="last 6 months"
      columns={[
        { key: "month", label: "Month" },
        { key: "published", label: "Published", align: "right" },
      ]}
      rows={data}
      empty={
        total === 0 && (
          <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed">
            <EmptyState
              compact
              icon={PenLine}
              title="Nothing published yet"
              description="Publish your first post and your cadence shows up here."
              action={
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/posts/new">
                    <Plus /> Write a post
                  </Link>
                </Button>
              }
            />
          </div>
        )
      }
      footer={
        <span className="inline-flex items-center gap-1.5">
          <CalendarRange className="h-3.5 w-3.5" aria-hidden /> {range}
        </span>
      }
    >
      <ChartContainer config={publishingConfig} className="aspect-auto h-[260px] w-full">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" {...axisProps} />
          <YAxis allowDecimals={false} width={36} {...axisProps} />
          <ChartTooltip cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.5 }} content={<ChartTooltipContent indicator="line" />} />
          <Bar
            dataKey="published"
            fill="var(--color-published)"
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
            activeBar={{ fillOpacity: 0.8 }}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}

export function LeadsChart({ data = [] }) {
  const total = data.reduce((sum, d) => sum + (d.leads || 0), 0);
  const thisWeek = data.length ? data[data.length - 1].leads : 0;
  const lastWeek = data.length > 1 ? data[data.length - 2].leads : 0;
  const diff = thisWeek - lastWeek;

  return (
    <ChartCard
      title="Leads per week"
      description="Contact form submissions, last 8 weeks"
      icon={Inbox}
      headline={total}
      headlineLabel="last 8 weeks"
      columns={[
        { key: "week", label: "Week of" },
        { key: "leads", label: "Leads", align: "right" },
      ]}
      rows={data}
      empty={
        total === 0 && (
          <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed">
            <EmptyState
              compact
              icon={Inbox}
              title="No leads yet"
              description="Submissions from the website contact form will be charted here."
            />
          </div>
        )
      }
      footer={
        total > 0 && (
          <span>
            <span className="font-medium text-foreground">{thisWeek}</span> this week ·{" "}
            {diff === 0 ? "same as last week" : `${diff > 0 ? "+" : "−"}${Math.abs(diff)} vs last week`}
          </span>
        )
      }
    >
      <ChartContainer config={leadsConfig} className="aspect-auto h-[260px] w-full">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="week" {...axisProps} minTickGap={16} />
          <YAxis allowDecimals={false} width={36} {...axisProps} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Area
            type="monotone"
            dataKey="leads"
            stroke="var(--color-leads)"
            strokeWidth={2}
            fill="var(--color-leads)"
            fillOpacity={0.1}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))", fill: "var(--color-leads)" }}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
