"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Reveal } from "@/components/site/effects/Reveal";
import { PostCard, PostCover } from "./PostCard";
import { formatDate } from "@/lib/format";

export function BlogIndex({ posts, categories }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");

  // Deep links: /blog?tag=nextjs or /blog?category=engineering
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tag")) setTag(params.get("tag"));
    if (params.get("category")) setCategory(params.get("category"));
  }, []);

  const usedCategories = useMemo(
    () => categories.filter((c) => posts.some((p) => p.category?.slug === c.slug)),
    [categories, posts]
  );

  const featured = posts.find((p) => p.featured) || posts[0];
  const filtering = category !== "all" || query || tag;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (!filtering && p.id === featured?.id) return false;
      if (category !== "all" && p.category?.slug !== category) return false;
      if (tag && ![...(p.tags || []), ...(p.keywords || [])].some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      if (!q) return true;
      return [p.title, p.excerpt, ...(p.tags || []), ...(p.keywords || [])].join(" ").toLowerCase().includes(q);
    });
  }, [posts, category, query, tag, filtering, featured]);

  if (!posts.length) {
    return (
      <section className="pb-28">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-card/60 p-8 font-mono text-sm">
            <p>
              <span className="text-success">➜</span> <span className="text-brand">~/blog</span> ls -la
            </p>
            <p className="mt-2 text-muted-foreground">total 0</p>
            <p className="mt-4 text-foreground">First articles are compiling. Check back very soon.</p>
            <Button asChild variant="outline" className="mt-6 rounded-full font-sans">
              <Link href="/contact">
                Meanwhile, say hello <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-28">
      <div className="container">
        {!filtering && featured && (
          <Reveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid grid-cols-1 gap-8 rounded-2xl border border-white/[0.07] bg-card/50 p-3 transition-colors duration-500 hover:bg-card lg:grid-cols-2"
            >
              <PostCover post={featured} className="aspect-[16/10] lg:aspect-auto lg:min-h-[380px]" priority sizes="(min-width: 1024px) 50vw, 100vw" />
              <div className="flex flex-col justify-center p-4 lg:p-8">
                <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  <Badge variant="violet" className="font-mono text-[10px] uppercase tracking-widest">
                    Featured
                  </Badge>
                  {featured.category?.name && <span className="text-brand">{featured.category.name}</span>}
                  <time dateTime={featured.published_at}>{formatDate(featured.published_at)}</time>
                </div>
                <h2 className="mt-5 text-balance font-display text-3xl font-bold leading-tight tracking-tight transition-colors group-hover:text-brand md:text-5xl">
                  {featured.title}
                </h2>
                {featured.excerpt && <p className="mt-5 text-muted-foreground md:text-lg">{featured.excerpt}</p>}
                <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground">
                  Read article
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        <div className="mt-14 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <ToggleGroup
            type="single"
            value={category}
            onValueChange={(v) => v && setCategory(v)}
            aria-label="Filter by category"
            className="justify-start gap-2"
          >
            {[{ slug: "all", name: "All" }, ...usedCategories].map((c) => (
              <ToggleGroupItem
                key={c.slug}
                value={c.slug}
                className="h-9 rounded-full border border-white/10 px-4 font-mono text-xs uppercase tracking-widest data-[state=on]:border-brand data-[state=on]:bg-brand data-[state=on]:text-brand-foreground"
              >
                {c.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="grep articles…"
              aria-label="Search articles"
              className="h-10 rounded-full border-white/10 bg-card/60 pl-10 font-mono text-sm"
            />
          </div>
        </div>

        {tag && (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            Tagged
            <Badge variant="brand" className="gap-1.5">
              #{tag}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setTag("")}
                className="h-4 w-4 rounded-full p-0 hover:bg-transparent"
                aria-label="Clear tag filter"
              >
                <X className="!h-3 !w-3" />
              </Button>
            </Badge>
          </div>
        )}

        {results.length ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 80}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center font-mono text-sm text-muted-foreground">
            grep: no articles match. Try another search.
          </p>
        )}
      </div>
    </section>
  );
}
