"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, FilterX, Loader2, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { EmptyState } from "@/components/admin/EmptyState";
import { RelativeTime } from "@/components/admin/RelativeTime";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useDebouncedValue } from "@/components/admin/hooks";
import { PostRowActions } from "@/components/admin/posts/PostRowActions";
import { cn } from "@/lib/utils";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "scheduled", label: "Scheduled" },
  { value: "archived", label: "Archived" },
];

function PostThumb({ src }) {
  const [broken, setBroken] = React.useState(false);
  return (
    <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
      {src && !broken ? (
        <Image src={src} alt="" fill unoptimized sizes="56px" className="object-cover" onError={() => setBroken(true)} />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand/10 to-brand-2/10">
          <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
        </span>
      )}
    </span>
  );
}

export function PostsView({ posts, total, page, pageSize, categories, filters }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = React.useTransition();
  const [search, setSearch] = React.useState(filters.q);
  const debounced = useDebouncedValue(search, 350);
  const hasFilters = Boolean(filters.q) || filters.status !== "all" || filters.category !== "all";

  const buildUrl = React.useCallback(
    (patch) => {
      const next = { ...filters, page: 1, ...patch };
      const params = new URLSearchParams();
      if (next.q) params.set("q", next.q);
      if (next.status && next.status !== "all") params.set("status", next.status);
      if (next.category && next.category !== "all") params.set("category", next.category);
      if (next.page > 1) params.set("page", String(next.page));
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [filters, pathname]
  );

  const navigate = (patch, { push = false } = {}) =>
    startTransition(() => (push ? router.push(buildUrl(patch)) : router.replace(buildUrl(patch), { scroll: false })));

  React.useEffect(() => {
    const q = debounced.trim();
    if (q !== filters.q) navigate({ q });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  function clearFilters() {
    setSearch("");
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
          <Tabs value={filters.status} onValueChange={(status) => navigate({ status })}>
            <TabsList>
              {STATUS_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or slug…"
              className="pl-9 pr-9"
              aria-label="Search posts"
            />
            {pending ? (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden />
            ) : (
              search && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSearch("")}
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                  aria-label="Clear search"
                >
                  <X />
                </Button>
              )
            )}
          </div>
          <Select value={filters.category} onValueChange={(category) => navigate({ category })}>
            <SelectTrigger className="sm:w-52" aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table — keeps the previous frame dimmed while the next page loads */}
      <div className={cn("transition-opacity", pending && "pointer-events-none opacity-60")} aria-busy={pending}>
        {posts.length === 0 ? (
          total > 0 ? (
            <EmptyState
              icon={FileText}
              title="Nothing on this page"
              description="This page is past the end of the list."
              action={
                <Button variant="outline" size="sm" onClick={() => navigate({ page: 1 })}>
                  Back to page 1
                </Button>
              }
            />
          ) : hasFilters ? (
            <EmptyState
              icon={FilterX}
              title="No posts match your filters"
              description="Try a different search term, status or category."
              action={
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <FilterX /> Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={FileText}
              title="No posts yet"
              description="Your blog is a blank canvas. Write the first article and track its SEO score as you type."
              action={
                <Button asChild variant="brand" size="sm">
                  <Link href="/admin/posts/new">
                    <Plus /> Write your first post
                  </Link>
                </Button>
              }
            />
          )
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Post</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Focus keyword</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-12 pr-5">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} className="group">
                  <TableCell className="pl-5">
                    <Link href={`/admin/posts/${post.id}`} className="flex min-w-[16rem] max-w-[26rem] items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <PostThumb src={post.cover_image} />
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-foreground transition-colors group-hover:text-brand">
                          {post.title}
                        </span>
                        <span className="block truncate font-mono text-xs text-muted-foreground">/blog/{post.slug}</span>
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {post.category?.name || <span className="italic">Uncategorized</span>}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={post.status} publishedAt={post.published_at} />
                  </TableCell>
                  <TableCell className="max-w-[12rem]">
                    {post.focus_keyword ? (
                      <span className="block truncate text-foreground">{post.focus_keyword}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">No keyword</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                    {(post.views || 0).toLocaleString("en-US")}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    <RelativeTime value={post.updated_at} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <PostRowActions post={post} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {total > 0 && (
        <div className="border-t px-5 py-3">
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={total}
            disabled={pending}
            onPageChange={(p) => navigate({ page: p }, { push: true })}
          />
        </div>
      )}
    </div>
  );
}
