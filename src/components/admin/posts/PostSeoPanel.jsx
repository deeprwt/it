"use client";

import { AlertTriangle, Search, Settings2, Share2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CharCounter } from "@/components/admin/CharCounter";
import { FormField, SwitchField } from "@/components/admin/FormField";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { SerpPreview } from "@/components/admin/SerpPreview";
import { SocialPreview } from "@/components/admin/SocialPreview";
import { TagInput } from "@/components/admin/TagInput";
import { applyTitleTemplate } from "@/components/admin/datetime";

/** SEO / Social / Advanced tabs for the post editor. */
export function PostSeoPanel({ form, update, site, categoryName }) {
  const defaultTitle = applyTitleTemplate(site.titleTemplate, form.title.trim());
  const serpTitle = form.meta_title.trim() || defaultTitle;
  const serpDescription = form.meta_description.trim() || form.excerpt.trim();
  const postUrl = `${site.siteUrl}/blog/${form.slug || "your-post"}`;
  const url = form.canonical_url.trim() && /^https?:\/\//.test(form.canonical_url.trim()) ? form.canonical_url.trim() : postUrl;

  return (
    <section className="rounded-2xl border bg-card">
      <Tabs defaultValue="seo">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Search & sharing</h2>
            <p className="text-xs text-muted-foreground">How this post appears on Google and social networks</p>
          </div>
          <TabsList>
            <TabsTrigger value="seo">
              <Search /> SEO
            </TabsTrigger>
            <TabsTrigger value="social">
              <Share2 /> Social
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Settings2 /> Advanced
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="seo" className="mt-0 space-y-5 p-5">
          <FormField
            id="focus_keyword"
            label="Focus keyword"
            hint="The main phrase you want this post to rank for. The SEO analysis checks title, URL, intro and density against it."
          >
            <Input
              id="focus_keyword"
              value={form.focus_keyword}
              onChange={(e) => update("focus_keyword", e.target.value)}
              placeholder="e.g. next.js seo checklist"
            />
          </FormField>

          <FormField
            id="meta_title"
            label="Meta title"
            aside={<CharCounter value={serpTitle} limit="title" />}
            hint={form.meta_title.trim() ? "Used exactly as written (the site title template is not added)." : "Leave empty to use the post title with the site template."}
          >
            <Input
              id="meta_title"
              value={form.meta_title}
              onChange={(e) => update("meta_title", e.target.value)}
              placeholder={defaultTitle || "Defaults to the post title"}
            />
          </FormField>

          <FormField
            id="meta_description"
            label="Meta description"
            aside={<CharCounter value={serpDescription} limit="description" />}
            hint="A compelling 120–160 character summary. Falls back to the excerpt."
          >
            <Textarea
              id="meta_description"
              rows={3}
              value={form.meta_description}
              onChange={(e) => update("meta_description", e.target.value)}
              placeholder={form.excerpt || "Summarise the post and include the focus keyword."}
            />
          </FormField>

          <FormField id="keywords" label="Keywords" hint="3–8 related phrases. Press Enter or comma to add; paste a comma-separated list to add many.">
            <TagInput
              id="keywords"
              value={form.keywords}
              onChange={(v) => update("keywords", v)}
              max={25}
              placeholder="e.g. technical seo, core web vitals"
            />
          </FormField>

          <FormField id="canonical_url" label="Canonical URL" optional hint="Only set this if the article was first published elsewhere.">
            <Input
              id="canonical_url"
              value={form.canonical_url}
              onChange={(e) => update("canonical_url", e.target.value)}
              placeholder={postUrl}
              inputMode="url"
            />
          </FormField>

          <SerpPreview title={serpTitle} description={serpDescription} url={url} siteName={site.siteName} />
        </TabsContent>

        <TabsContent value="social" className="mt-0 space-y-5 p-5">
          <FormField id="og_title" label="Social title" aside={<CharCounter value={form.og_title || serpTitle} max={70} min={0} />}>
            <Input
              id="og_title"
              value={form.og_title}
              onChange={(e) => update("og_title", e.target.value)}
              placeholder={serpTitle || "Defaults to the meta title"}
            />
          </FormField>
          <FormField id="og_description" label="Social description" aside={<CharCounter value={form.og_description || serpDescription} max={200} min={0} />}>
            <Textarea
              id="og_description"
              rows={3}
              value={form.og_description}
              onChange={(e) => update("og_description", e.target.value)}
              placeholder={serpDescription || "Defaults to the meta description"}
            />
          </FormField>
          <div className="grid gap-5 lg:grid-cols-2">
            <FormField label="Social image" hint="1200 × 630 px works everywhere. Falls back to the cover image, then an auto-generated card.">
              <ImagePicker aspect="og" value={form.og_image} onChange={({ url: u }) => update("og_image", u)} emptyHint="Using the cover image" />
            </FormField>
            <SocialPreview
              title={form.og_title || serpTitle || form.title}
              description={form.og_description || serpDescription}
              image={form.og_image || form.cover_image}
              url={postUrl}
              eyebrow={categoryName || "Blog"}
            />
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-0 space-y-3 p-5">
          {!site.allowIndexing && (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Search engines are blocked for the whole site in Settings → SEO defaults, so this post won&apos;t be indexed either way.
              </AlertDescription>
            </Alert>
          )}
          <SwitchField
            id="no_index"
            label="Hide from search engines (noindex)"
            description="Google won't show this post in results. Use for thin, duplicate or private content."
          >
            <Switch id="no_index" checked={form.no_index} onCheckedChange={(v) => update("no_index", v)} />
          </SwitchField>
          <SwitchField
            id="no_follow"
            label="Don't follow links (nofollow)"
            description="Tells search engines not to pass ranking credit through links on this page. Rarely needed for your own posts."
          >
            <Switch id="no_follow" checked={form.no_follow} onCheckedChange={(v) => update("no_follow", v)} />
          </SwitchField>
        </TabsContent>
      </Tabs>
    </section>
  );
}
