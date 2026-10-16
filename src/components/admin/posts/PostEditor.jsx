"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, CalendarClock, CheckCircle2, CircleDot, ExternalLink, Loader2, RefreshCw, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CharCounter } from "@/components/admin/CharCounter";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SeoScoreCard } from "@/components/admin/SeoScoreCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useModKey, useTick, useUnsavedChangesWarning } from "@/components/admin/hooks";
import { PostSeoPanel } from "@/components/admin/posts/PostSeoPanel";
import { PostSettingsPanel } from "@/components/admin/posts/PostSettingsPanel";
import { savePost } from "@/lib/actions/posts";
import { analyzePost } from "@/lib/seo-score";
import { formatDate, formatRelative, slugify } from "@/lib/format";
import { cn } from "@/lib/utils";

function toForm(post, defaultAuthor) {
  return {
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    cover_image: post?.cover_image || "",
    cover_image_alt: post?.cover_image_alt || "",
    category_id: post?.category_id || "",
    tags: post?.tags || [],
    keywords: post?.keywords || [],
    focus_keyword: post?.focus_keyword || "",
    author_name: post?.author_name || (post ? "" : defaultAuthor || ""),
    status: post?.status || "draft",
    featured: Boolean(post?.featured),
    published_at: post?.published_at || "",
    meta_title: post?.meta_title || "",
    meta_description: post?.meta_description || "",
    canonical_url: post?.canonical_url || "",
    og_title: post?.og_title || "",
    og_description: post?.og_description || "",
    og_image: post?.og_image || "",
    no_index: Boolean(post?.no_index),
    no_follow: Boolean(post?.no_follow),
  };
}

const sameForm = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sanitizeSlug = (value) =>
  value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-");

export function PostEditor({ post, categories, site, defaultAuthor }) {
  const router = useRouter();
  const titleRef = React.useRef(null);
  const [form, setForm] = React.useState(() => toForm(post, defaultAuthor));
  const [saved, setSaved] = React.useState(() => toForm(post, defaultAuthor));
  const [savedStatus, setSavedStatus] = React.useState(post?.status || null);
  const [lastSavedAt, setLastSavedAt] = React.useState(post?.updated_at || null);
  const [slugTouched, setSlugTouched] = React.useState(Boolean(post));
  const [pendingAction, setPendingAction] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const postId = post?.id || null;

  React.useEffect(() => setMounted(true), []);
  useTick(30_000);

  const dirty = !sameForm(form, saved);
  useUnsavedChangesWarning(dirty && !pending);

  const update = React.useCallback((key, value) => setForm((f) => ({ ...f, [key]: value })), []);

  const deferredForm = React.useDeferredValue(form);
  const analysis = React.useMemo(() => analyzePost(deferredForm), [deferredForm]);
  const categoryName = categories.find((c) => c.id === form.category_id)?.name;

  const isLive = savedStatus === "published" && saved.published_at && new Date(saved.published_at) <= new Date();
  const isFuture = form.published_at && new Date(form.published_at) > new Date();

  function onTitleChange(value) {
    setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }));
  }

  function save(status, action) {
    if (pending) return;
    if (!form.title.trim()) {
      toast.error("Give your post a title first.");
      titleRef.current?.focus();
      return;
    }
    const nextStatus = status || form.status;
    const snapshot = {
      ...form,
      status: nextStatus,
      slug: form.slug || slugify(form.title),
      published_at: nextStatus === "published" && !form.published_at ? new Date().toISOString() : form.published_at,
    };

    setPendingAction(action);
    startTransition(async () => {
      const res = await savePost({ ...snapshot, id: postId || undefined });
      setPendingAction(null);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      const confirmed = { ...snapshot, slug: res.data.slug, status: res.data.status };
      setSaved(confirmed);
      setForm((f) => ({ ...f, slug: res.data.slug, status: res.data.status, published_at: confirmed.published_at }));
      setSavedStatus(res.data.status);
      setLastSavedAt(new Date().toISOString());
      setSlugTouched(true);

      const future = confirmed.published_at && new Date(confirmed.published_at) > new Date();
      if (res.data.status === "published" && savedStatus !== "published") {
        toast.success(future ? "Post scheduled" : "Post published", {
          description: future
            ? `Goes live ${formatDate(confirmed.published_at, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}.`
            : `Live at /blog/${res.data.slug}`,
        });
      } else {
        toast.success(res.data.status === "draft" ? "Draft saved" : "Changes saved");
      }

      if (!postId) router.replace(`/admin/posts/${res.data.id}`);
      else router.refresh();
    });
  }

  useModKey("s", () => save(undefined, "shortcut"));

  const primaryLabel = savedStatus === "published" ? "Update" : isFuture ? "Schedule" : "Publish";

  return (
    <div className="pb-10">
      {/* Sticky action bar */}
      <div className="sticky top-16 z-20 -mx-4 -mt-4 mb-6 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-xl md:-mx-6 md:-mt-6 md:px-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon" className="shrink-0 rounded-xl" aria-label="Back to posts">
              <Link href="/admin/posts">
                <ArrowLeft />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Back to posts</TooltipContent>
        </Tooltip>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{form.title.trim() || (postId ? "Untitled post" : "New post")}</p>
            {savedStatus && <StatusBadge status={savedStatus} publishedAt={saved.published_at} className="hidden sm:inline-flex" />}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
            {pending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden /> Saving…
              </>
            ) : dirty ? (
              <>
                <CircleDot className="h-3 w-3 text-warning" aria-hidden /> Unsaved changes
              </>
            ) : lastSavedAt ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-success" aria-hidden />
                <span suppressHydrationWarning>Saved · {formatRelative(lastSavedAt)}</span>
              </>
            ) : (
              "Not saved yet"
            )}
            <kbd className="ml-2 hidden rounded border bg-muted px-1 font-mono text-[10px] md:inline">⌘S</kbd>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isLive ? (
            <Button asChild variant="ghost" size="sm" className="rounded-lg">
              <a href={`/blog/${saved.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink /> <span className="hidden md:inline">Preview</span>
              </a>
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="rounded-lg">
                  <Button variant="ghost" size="sm" disabled className="rounded-lg" aria-label="Preview (available once published)">
                    <ExternalLink /> <span className="hidden md:inline">Preview</span>
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Publish the post to preview it live</TooltipContent>
            </Tooltip>
          )}

          {savedStatus !== "published" && (
            <Button variant="outline" size="sm" className="rounded-lg" onClick={() => save("draft", "draft")} disabled={pending}>
              {pendingAction === "draft" ? <Loader2 className="animate-spin" /> : <Save />}
              <span className="hidden sm:inline">Save draft</span>
            </Button>
          )}
          <Button
            variant="brand"
            size="sm"
            className="group rounded-lg"
            onClick={() => (savedStatus === "published" ? save(undefined, "primary") : save("published", "primary"))}
            disabled={pending}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            {pendingAction === "primary" ? <Loader2 className="animate-spin" /> : isFuture && savedStatus !== "published" ? <CalendarClock /> : <Send />}
            {primaryLabel}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Main column */}
        <div className="min-w-0 space-y-6 xl:col-span-8">
          <section className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6">
            <div className="space-y-2">
              <Label htmlFor="post-title" className="sr-only">
                Title
              </Label>
              <Input
                ref={titleRef}
                id="post-title"
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Post title"
                autoFocus={!postId}
                className="h-auto border-0 bg-transparent px-0 py-1 font-display text-3xl font-bold tracking-tight placeholder:text-muted-foreground/60 focus-visible:ring-0 sm:text-4xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="post-slug" className="text-[13px]">
                  URL slug
                </Label>
                {!slugTouched && form.title && <span className="text-[11px] text-muted-foreground">Auto-generated from the title</span>}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-input transition-colors focus-within:border-brand/70 focus-within:ring-2 focus-within:ring-brand/20">
                  <span className="flex h-full shrink-0 items-center border-r bg-muted/50 px-3 font-mono text-xs text-muted-foreground">/blog/</span>
                  <Input
                    id="post-slug"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      update("slug", sanitizeSlug(e.target.value));
                    }}
                    onBlur={() => update("slug", slugify(form.slug))}
                    placeholder="your-post-url"
                    className="h-full min-w-0 rounded-none border-0 font-mono text-sm focus-visible:ring-0"
                  />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        update("slug", slugify(form.title));
                        setSlugTouched(false);
                      }}
                      disabled={!form.title.trim()}
                      aria-label="Regenerate slug from title"
                    >
                      <RefreshCw />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Regenerate from title</TooltipContent>
                </Tooltip>
              </div>
              {savedStatus === "published" && form.slug !== saved.slug && (
                <p className="text-xs text-warning">Changing the slug of a live post breaks existing links to it.</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="post-excerpt" className="text-[13px]">
                  Excerpt
                </Label>
                <CharCounter value={form.excerpt} max={160} min={0} />
              </div>
              <Textarea
                id="post-excerpt"
                rows={3}
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                placeholder="A short summary shown on the blog index and used as the default meta description."
              />
            </div>
          </section>

          <RichTextEditor value={form.content} onChange={(html) => update("content", html)} toolbarClassName="top-32" />

          <PostSeoPanel form={form} update={update} site={site} categoryName={categoryName} />
        </div>

        {/* Sidebar */}
        <aside
          className={cn(
            "min-w-0 space-y-6 xl:col-span-4",
            "xl:sticky xl:top-36 xl:max-h-[calc(100vh-10rem)] xl:self-start xl:overflow-y-auto xl:pb-2 xl:pr-1"
          )}
          aria-label="Post settings"
        >
          <PostSettingsPanel form={form} update={update} categories={categories} defaultAuthor={defaultAuthor} mounted={mounted} />
          <SeoScoreCard analysis={analysis} />
        </aside>
      </div>
    </div>
  );
}
