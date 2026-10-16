"use client";

import * as React from "react";
import { ChartColumn, Table2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

/**
 * Card frame for a chart: header (icon, title, headline figure), a Chart | Table switch
 * so every value is reachable without hovering, and an optional footer.
 * @param {{ title: string, description?: string, icon?: any, headline?: React.ReactNode, headlineLabel?: string,
 *   columns: {key: string, label: string, align?: "left"|"right"}[], rows: object[], empty?: React.ReactNode,
 *   footer?: React.ReactNode, className?: string, children: React.ReactNode }} props
 */
export function ChartCard({ title, description, icon: Icon, headline, headlineLabel, columns, rows, empty, footer, className, children }) {
  const [view, setView] = React.useState("chart");

  return (
    <section className={cn("flex h-full flex-col rounded-2xl border bg-card", className)} aria-label={title}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b bg-gradient-to-r from-brand/5 to-transparent px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {headline !== undefined && (
            <div className="text-right">
              <p className="text-2xl font-bold leading-none text-foreground">{headline}</p>
              {headlineLabel && (
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{headlineLabel}</p>
              )}
            </div>
          )}
          <ToggleGroup
            type="single"
            size="sm"
            value={view}
            onValueChange={(v) => v && setView(v)}
            className="rounded-lg border p-0.5"
            aria-label={`${title} view`}
          >
            <ToggleGroupItem value="chart" aria-label="Show chart" className="h-7 min-w-7 px-1.5">
              <ChartColumn />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Show table" className="h-7 min-w-7 px-1.5">
              <Table2 />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="flex-1 p-5">
        {view === "chart" ? (
          empty || children
        ) : (
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {columns.map((c) => (
                    <TableHead key={c.key} className={cn(c.align === "right" && "text-right")}>
                      {c.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={i}>
                    {columns.map((c) => (
                      <TableCell key={c.key} className={cn("py-2", c.align === "right" && "text-right font-mono tabular-nums")}>
                        {row[c.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      {footer && <div className="border-t px-5 py-3 text-xs text-muted-foreground">{footer}</div>}
    </section>
  );
}
