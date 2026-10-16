"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertTriangle,
  Braces,
  CheckCircle2,
  ExternalLink,
  Eye,
  Loader2,
  Map as MapIcon,
  RotateCcw,
  Save,
  Search,
  Share2,
  Sparkles,
  WandSparkles,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CharCounter } from "@/components/admin/CharCounter";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormField, SwitchField } from "@/components/admin/FormField";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { PageHeader } from "@/components/admin/PageHeader";
import { SaveBar } from "@/components/admin/SaveBar";
import { SectionCard } from "@/components/admin/SectionCard";
import { SeoScoreCard } from "@/components/admin/SeoScoreCard";
import { SerpPreview } from "@/components/admin/SerpPreview";
import { SocialPreview } from "@/components/admin/SocialPreview";
import { TagInput } from "@/components/admin/TagInput";
import { applyTitleTemplate } from "@/components/admin/datetime";
import { useModKey, useUnsavedChangesWarning } from "@/components/admin/hooks";
import { resetPageSeo, savePageSeo } from "@/lib/actions/seo";
import { analyzePage } from "@/lib/seo-score";

const PRIORITIES = Array.from({ length: 11 }, (_, i) => (i / 10).toFixed(1));
const CHANGEFREQ = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

function toForm(row, registry, path) {
  const priority = row?.sitemap_priority ?? registry?.priority ?? 0.7;
  return {
    label: row?.label || registry?.label || path,
    meta_title: row?.meta_title || "",
    meta_description: row?.meta_description || "",
    keywords: row?.keywords || [],
    canonical_url: row?.canonical_url || "",
    og_title: row?.og_title || "",
    og_description: row?.og_description || "",
    og_image: row?.og_image || "",
    og_image_alt: row?.og_image_alt || "",
    twitter_card: row?.twitter_card || "summary_large_image",
    no_index: Boolean(row?.no_index),
    no_follow: Boolean(row?.no_follow),
    json_ld: row?.json_ld ? JSON.stringify(row.json_ld, null, 2) : "",
    include_in_sitemap: row ? row.include_in_sitemap !== false : true,
    sitemap_priority: Number(priority).toFixed(1),
    sitemap_changefreq: row?.sitemap_changefreq || registry?.changefreq || "monthly",
  };
}

function parseJson(text) {
  if (!text.trim()) return { state: "empty" };
  try {
    const value = JSON.parse(text);
    if (typeof value !== "object" || value === null) return { state: "error", message: "Structured data must be a JSON object or array." };
    const types = (Array.isArray(value) ? value : [value]).map((v) => v?.["@type"]).filter(Boolean);
    return { state: "valid", types };
  } catch (error) {
    return { state: "error", message: error.message };
  }
}

export function PageSeoEditor({ path, row, registry, site }) {
  const router = useRouter();
  const [form, setForm] = React.useState(() => toForm(row, registry, path));
  const [saved, setSaved] = React.useState(() => toForm(row, registry, path));
  const [hasRow, setHasRow] = React.useState(Boolean(row));
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  const update = React.useCallback((key, value) => setForm((f) => ({ ...f, [key]: value })), []);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  useUnsavedChangesWarning(dirty && !pending);

  const isHome = path === "/";
  const isCustom = !registry;
  const baseTitle = registry?.title || site.defaultTitle;
  const defaultTitle = isHome ? baseTitle : applyTitleTemplate(site.titleTemplate, baseTitle);
  const defaultDescription = registry?.description || site.defaultDescription;
  const resolvedTitle = form.meta_title.trim() || defaultTitle;
  const resolvedDescription = form.meta_description.trim() || defaultDescription;
  const pageUrl = `${site.siteUrl}${path === "/" ? "" : path}` || path;
  const serpUrl = /^https?:\/\//.test(form.canonical_url.trim()) ? form.canonical_url.trim() : pageUrl;
  const json = parseJson(form.json_ld);

  const deferred = React.useDeferredValue(form);
  const analysis = React.useMemo(() => analyzePage(deferred), [deferred]);

  function save() {
    if (pending) return;
    if (json.state === "error") {
      toast.error("Fix the structured data JSON before saving.");
      return;
    }
    const snapshot = form;
    startTransition(async () => {
      const res = await savePageSeo({
        path,
        ...snapshot,
        json_ld: snapshot.json_ld.trim() || null,
        sitemap_priority: Number(snapshot.sitemap_priority),
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setSaved(snapshot);
      setHasRow(true);
      toast.success("SEO saved", { description: `${snapshot.label} is updated on the live site.` });
      router.refresh();
    });
  }

  async function reset() {
    const res = await resetPageSeo(path);
    if (!res.ok) {
      toast.error(res.error);
      return false;
    }
    const defaults = toForm(null, registry, path);
    setForm(defaults);
    setSaved(defaults);
    setHasRow(false);
    toast.success("Reset to defaults", { description: "This page now uses the values from code." });
    router.refresh();
  }

  function insertExample() {
    const example = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: resolvedTitle,
      description: resolvedDescription,
      url: pageUrl,
      isPartOf: { "@type": "WebSite", name: site.siteName, url: site.siteUrl },
    };
    update("json_ld", JSON.stringify(example, null, 2));
  }

  useModKey("s", save);

  return (
    <div className="pb-24">
      <PageHeader
        title={form.label}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs">{path}</span>
            {isCustom && <Badge variant="violet">Custom path</Badge>}
            {hasRow ? <Badge variant="success">Customised</Badge> : <Badge variant="muted">Using code defaults</Badge>}
          </span>
        }
        icon={Search}
        breadcrumbs={[{ label: "Pages SEO", href: "/admin/seo" }, { label: form.label }]}
        actions={
          <>
            <Button asChild variant="ghost" className="rounded-xl">
              <a href={path} target="_blank" rel="noopener noreferrer">
                <ExternalLink /> View page
              </a>
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setConfirmReset(true)} disabled={!hasRow || pending}>
              <RotateCcw /> Reset to defaults
            </Button>
            <Button variant="brand" className="rounded-xl" onClick={save} disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <Save />} Save
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="min-w-0 space-y-6 xl:col-span-7">
          <SectionCard title="Search appearance" description="What Google shows in results" icon={Search}>
            <div className="space-y-5">
              {isCustom && (
                <FormField id="label" label="Label" hint="Only used inside the dashboard.">
                  <Input id="label" value={form.label} onChange={(e) => update("label", e.target.value)} />
                </FormField>
              )}
              <FormField
                id="meta_title"
                label="Meta title"
                aside={<CharCounter value={resolvedTitle} limit="title" />}
                hint={form.meta_title.trim() ? "Used exactly as written." : `Default comes from the page and the template “${site.titleTemplate}”.`}
              >
                <Input id="meta_title" value={form.meta_title} onChange={(e) => update("meta_title", e.target.value)} placeholder={defaultTitle} />
              </FormField>
              <FormField
                id="meta_description"
                label="Meta description"
                aside={<CharCounter value={resolvedDescription} limit="description" />}
                hint="Aim for 120–160 characters that make people want to click."
              >
                <Textarea
                  id="meta_description"
                  rows={3}
                  value={form.meta_description}
                  onChange={(e) => update("meta_description", e.target.value)}
                  placeholder={defaultDescription}
                />
              </FormField>
              <FormField id="keywords" label="Keywords" hint="Target phrases for this page. Enter or comma adds one; paste a list to add many.">
                <TagInput id="keywords" value={form.keywords} onChange={(v) => update("keywords", v)} max={25} placeholder="e.g. next.js agency" />
              </FormField>
              <FormField id="canonical_url" label="Canonical URL" optional hint="Leave empty to use this page's own URL.">
                <Input
                  id="canonical_url"
                  value={form.canonical_url}
                  onChange={(e) => update("canonical_url", e.target.value)}
                  placeholder={pageUrl}
                  inputMode="url"
                />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="Social sharing" description="Open Graph & X/Twitter cards" icon={Share2}>
            <div className="space-y-5">
              <FormField id="og_title" label="Social title" aside={<CharCounter value={form.og_title || resolvedTitle} max={70} min={0} />}>
                <Input id="og_title" value={form.og_title} onChange={(e) => update("og_title", e.target.value)} placeholder={resolvedTitle} />
              </FormField>
              <FormField id="og_description" label="Social description" aside={<CharCounter value={form.og_description || resolvedDescription} max={200} min={0} />}>
                <Textarea
                  id="og_description"
                  rows={3}
                  value={form.og_description}
                  onChange={(e) => update("og_description", e.target.value)}
                  placeholder={resolvedDescription}
                />
              </FormField>
              <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Social image" hint="1200 × 630 px. Without one, a branded card is generated automatically.">
                  <ImagePicker
                    aspect="og"
                    value={form.og_image}
                    onChange={({ url, alt }) => {
                      update("og_image", url);
                      if (url && alt && !form.og_image_alt) update("og_image_alt", alt);
                    }}
                    emptyHint={site.defaultOgImage ? "Using the site default image" : "Using the auto-generated card"}
                  />
                </FormField>
                <div className="space-y-5">
                  <FormField id="og_image_alt" label="Image alt text">
                    <Input
                      id="og_image_alt"
                      value={form.og_image_alt}
                      onChange={(e) => update("og_image_alt", e.target.value)}
                      placeholder="Describe the image"
                      disabled={!form.og_image}
                    />
                  </FormField>
                  <FormField id="twitter_card" label="X / Twitter card">
                    <Select value={form.twitter_card} onValueChange={(v) => update("twitter_card", v)}>
                      <SelectTrigger id="twitter_card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary_large_image">Large image</SelectItem>
                        <SelectItem value="summary">Small summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Indexing" description="Control how search engines treat this page" icon={Eye}>
            <div className="space-y-3">
              {!site.allowIndexing && (
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>Indexing is switched off for the whole site in Settings → SEO defaults.</AlertDescription>
                </Alert>
              )}
              <SwitchField id="no_index" label="Hide from search engines (noindex)" description="The page stays reachable by link but won't appear in Google.">
                <Switch id="no_index" checked={form.no_index} onCheckedChange={(v) => update("no_index", v)} />
              </SwitchField>
              <SwitchField id="no_follow" label="Don't follow links (nofollow)" description="Search engines won't pass ranking credit through links on this page.">
                <Switch id="no_follow" checked={form.no_follow} onCheckedChange={(v) => update("no_follow", v)} />
              </SwitchField>
            </div>
          </SectionCard>

          <SectionCard title="Sitemap" description="Entry in /sitemap.xml" icon={MapIcon}>
            <div className="space-y-4">
              <SwitchField
                id="include_in_sitemap"
                label="Include in sitemap"
                description="Helps search engines discover the page. Turn off for pages you don't want crawled."
              >
                <Switch id="include_in_sitemap" checked={form.include_in_sitemap} onCheckedChange={(v) => update("include_in_sitemap", v)} />
              </SwitchField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="sitemap_priority" label="Priority" hint="Relative importance, 0.0 – 1.0">
                  <Select value={form.sitemap_priority} onValueChange={(v) => update("sitemap_priority", v)} disabled={!form.include_in_sitemap}>
                    <SelectTrigger id="sitemap_priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField id="sitemap_changefreq" label="Change frequency" hint="How often the content usually changes">
                  <Select value={form.sitemap_changefreq} onValueChange={(v) => update("sitemap_changefreq", v)} disabled={!form.include_in_sitemap}>
                    <SelectTrigger id="sitemap_changefreq" className="capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANGEFREQ.map((f) => (
                        <SelectItem key={f} value={f} className="capitalize">
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Structured data"
            description="JSON-LD added to the page's <head>"
            icon={Braces}
            actions={
              <div className="flex gap-1">
                {json.state === "valid" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => update("json_ld", JSON.stringify(JSON.parse(form.json_ld), null, 2))}
                  >
                    <WandSparkles /> Format
                  </Button>
                )}
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={insertExample}>
                  <Sparkles /> Insert example
                </Button>
              </div>
            }
          >
            <div className="space-y-2">
              <Textarea
                aria-label="JSON-LD structured data"
                rows={12}
                spellCheck={false}
                value={form.json_ld}
                onChange={(e) => update("json_ld", e.target.value)}
                placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}'}
                className="font-mono text-xs leading-relaxed"
                aria-invalid={json.state === "error"}
              />
              <p className="flex items-start gap-1.5 text-xs" aria-live="polite">
                {json.state === "empty" && <span className="text-muted-foreground">Optional. Add schema.org markup to qualify for rich results.</span>}
                {json.state === "valid" && (
                  <>
                    <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
                    <span className="text-success">Valid JSON</span>
                    {json.types.length > 0 && <span className="text-muted-foreground">· {json.types.join(", ")}</span>}
                  </>
                )}
                {json.state === "error" && (
                  <>
                    <XCircle className="mt-px h-3.5 w-3.5 shrink-0 text-destructive" aria-hidden />
                    <span className="text-destructive">Invalid JSON — {json.message}</span>
                  </>
                )}
              </p>
            </div>
          </SectionCard>
        </div>

        <aside className="min-w-0 space-y-6 xl:sticky xl:top-20 xl:col-span-5 xl:max-h-[calc(100vh-6rem)] xl:self-start xl:overflow-y-auto xl:pb-2 xl:pr-1" aria-label="Previews">
          <section className="space-y-6 rounded-2xl border bg-card p-5">
            <SerpPreview title={resolvedTitle} description={resolvedDescription} url={serpUrl} siteName={site.siteName} />
            <SocialPreview
              title={form.og_title || resolvedTitle}
              description={form.og_description || resolvedDescription}
              image={form.og_image || site.defaultOgImage}
              url={pageUrl}
              eyebrow={registry?.label || form.label}
            />
          </section>
          <SeoScoreCard analysis={analysis} title="Page SEO score" />
        </aside>
      </div>

      <SaveBar show={dirty} pending={pending} onSave={save} onDiscard={() => setForm(saved)} />

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset to defaults?"
        description="Your custom title, description, social card, sitemap settings and structured data for this page will be removed. The page falls back to the values defined in code."
        confirmLabel="Reset page SEO"
        onConfirm={reset}
      />
    </div>
  );
}
