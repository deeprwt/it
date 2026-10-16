"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, FilePlus2, Pencil, Search, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/admin/EmptyState";
import { FormField } from "@/components/admin/FormField";
import { RelativeTime } from "@/components/admin/RelativeTime";
import { ScoreBadge } from "@/components/admin/StatusBadge";

const GROUPS = ["All", "Main", "Services", "Custom"];
export const seoEditHref = (path) => `/admin/seo/edit?path=${encodeURIComponent(path)}`;

function AddPathDialog({ open, onOpenChange }) {
  const router = useRouter();
  const [path, setPath] = React.useState("/");
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (open) {
      setPath("/");
      setError(null);
    }
  }, [open]);

  function onSubmit(event) {
    event.preventDefault();
    let value = path.trim().replace(/\s+/g, "-");
    if (!value.startsWith("/")) return setError("The path must start with “/”, e.g. /landing/black-friday.");
    if (value.length > 1) value = value.replace(/\/+$/, "");
    if (/[?#]/.test(value)) return setError("Leave out query strings and #fragments — just the path.");
    // Existing paths simply open their editor.
    onOpenChange(false);
    router.push(seoEditHref(value));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit} className="grid gap-5">
          <DialogHeader>
            <DialogTitle>Add a custom path</DialogTitle>
            <DialogDescription>
              Set SEO for a route that isn&apos;t in the page registry — a landing page, a campaign URL or a page added later.
            </DialogDescription>
          </DialogHeader>
          <FormField id="custom-path" label="Page path" error={error} hint="Relative to your site URL, e.g. /landing/launch-week">
            <Input
              id="custom-path"
              value={path}
              onChange={(e) => {
                setPath(e.target.value);
                setError(null);
              }}
              className="font-mono"
              aria-invalid={Boolean(error)}
              autoFocus
            />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand">
              Continue <ArrowRight />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PagesSeoTable({ rows, openAdd = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [group, setGroup] = React.useState("All");
  const [query, setQuery] = React.useState("");
  const [addOpen, setAddOpen] = React.useState(openAdd);

  React.useEffect(() => {
    if (openAdd) router.replace(pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = Object.fromEntries(GROUPS.map((g) => [g, g === "All" ? rows.length : rows.filter((r) => r.group === g).length]));
  const q = query.trim().toLowerCase();
  const filtered = rows.filter(
    (r) => (group === "All" || r.group === group) && (!q || `${r.label} ${r.path} ${r.metaTitle}`.toLowerCase().includes(q))
  );

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
          <Tabs value={group} onValueChange={setGroup}>
            <TabsList>
              {GROUPS.map((g) => (
                <TabsTrigger key={g} value={g}>
                  {g}
                  <span className="rounded bg-muted px-1.5 font-mono text-[10px] tabular-nums text-muted-foreground">{counts[g]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pages or paths…" className="pl-9" aria-label="Search pages" />
          </div>
          <Button variant="outline" onClick={() => setAddOpen(true)} className="rounded-xl">
            <FilePlus2 /> Add custom path
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        group === "Custom" && !q ? (
          <EmptyState
            icon={FilePlus2}
            title="No custom paths yet"
            description="Add SEO for landing pages or routes that aren't in the page registry."
            action={
              <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
                <FilePlus2 /> Add custom path
              </Button>
            }
          />
        ) : (
          <EmptyState compact icon={SearchX} title="No pages match" description="Try another search or group." />
        )
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Page</TableHead>
              <TableHead>Meta title</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Indexing</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="pr-5 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.path} className="group">
                <TableCell className="pl-5">
                  <Link href={seoEditHref(row.path)} className="block min-w-[10rem] rounded outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span className="flex items-center gap-2 font-medium text-foreground group-hover:text-brand">
                      {row.label}
                      {row.group === "Custom" && <Badge variant="violet">Custom</Badge>}
                    </span>
                    <span className="block font-mono text-xs text-muted-foreground">{row.path}</span>
                  </Link>
                </TableCell>
                <TableCell className="max-w-[22rem]">
                  {row.metaTitle ? (
                    <span className="line-clamp-1 text-sm text-foreground">{row.metaTitle}</span>
                  ) : (
                    <span className="line-clamp-1 text-xs text-muted-foreground">Default: {row.defaultTitle}</span>
                  )}
                </TableCell>
                <TableCell>
                  <ScoreBadge score={row.score} />
                </TableCell>
                <TableCell>
                  {row.noIndex ? (
                    <Badge variant="warning">
                      <EyeOff aria-hidden /> Noindex
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Eye aria-hidden className="text-success" /> Indexed
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {row.updatedAt ? <RelativeTime value={row.updatedAt} /> : <span className="italic">Using defaults</span>}
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <Button asChild variant="outline" size="sm" className="rounded-lg">
                    <Link href={seoEditHref(row.path)}>
                      <Pencil /> Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AddPathDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
