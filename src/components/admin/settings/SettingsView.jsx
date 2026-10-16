"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  Dribbble,
  Facebook,
  Github,
  Globe,
  Instagram,
  KeyRound,
  Linkedin,
  Loader2,
  Plug,
  Save,
  SearchCheck,
  Share2,
  ShieldCheck,
  Twitter,
  Users,
  XCircle,
  Youtube,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CharCounter } from "@/components/admin/CharCounter";
import { FormField, SwitchField } from "@/components/admin/FormField";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { SaveBar } from "@/components/admin/SaveBar";
import { SectionCard } from "@/components/admin/SectionCard";
import { TagInput } from "@/components/admin/TagInput";
import { useModKey, useUnsavedChangesWarning } from "@/components/admin/hooks";
import { AccountPanel } from "@/components/admin/settings/AccountPanel";
import { TeamPanel } from "@/components/admin/settings/TeamPanel";
import { saveSettings } from "@/lib/actions/settings";
import { cn } from "@/lib/utils";

const SOCIALS = [
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://www.linkedin.com/company/…" },
  { key: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/…" },
  { key: "x", label: "X (Twitter)", icon: Twitter, placeholder: "https://x.com/…" },
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/…" },
  { key: "dribbble", label: "Dribbble", icon: Dribbble, placeholder: "https://dribbble.com/…" },
  { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@…" },
  { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/…" },
];

function toForm(row) {
  return {
    site_name: row?.site_name || "",
    site_url: row?.site_url || "",
    tagline: row?.tagline || "",
    contact_email: row?.contact_email || "",
    contact_phone: row?.contact_phone || "",
    address: row?.address || "",
    title_template: row?.title_template || "%s | Snowdox",
    default_title: row?.default_title || "",
    default_description: row?.default_description || "",
    default_keywords: row?.default_keywords || [],
    default_og_image: row?.default_og_image || "",
    allow_indexing: row?.allow_indexing ?? true,
    twitter_handle: row?.twitter_handle || "",
    google_analytics_id: row?.google_analytics_id || "",
    google_site_verification: row?.google_site_verification || "",
    bing_site_verification: row?.bing_site_verification || "",
    socials: Object.fromEntries(SOCIALS.map((s) => [s.key, row?.socials?.[s.key] || ""])),
  };
}

function SaveRow({ pending, dirty, onSave, disabled }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t pt-5">
      {dirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
      <Button variant="brand" onClick={onSave} disabled={pending || disabled}>
        {pending ? <Loader2 className="animate-spin" /> : <Save />} Save changes
      </Button>
    </div>
  );
}

function ValidityHint({ ok, okText, badText }) {
  const Icon = ok ? CheckCircle2 : XCircle;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs", ok ? "text-success" : "text-destructive")}>
      <Icon className="h-3.5 w-3.5" aria-hidden /> {ok ? okText : badText}
    </span>
  );
}

export function SettingsView({ settings, team, profile, email, isAdmin, initialTab = "general" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = React.useState(initialTab);
  const [form, setForm] = React.useState(() => toForm(settings));
  const [saved, setSaved] = React.useState(() => toForm(settings));
  const [pending, startTransition] = React.useTransition();
  const missingRow = !settings;

  // Follow ?tab= when it changes from elsewhere (header menu, command palette).
  React.useEffect(() => setTab(initialTab), [initialTab]);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  useUnsavedChangesWarning(dirty && !pending);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateSocial = (key, value) => setForm((f) => ({ ...f, socials: { ...f.socials, [key]: value } }));

  function onTabChange(next) {
    setTab(next);
    const qs = next === "general" ? "" : `?tab=${next}`;
    router.replace(`${pathname}${qs}`, { scroll: false });
  }

  function save() {
    if (pending || missingRow) return;
    const snapshot = form;
    startTransition(async () => {
      const res = await saveSettings(snapshot);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setSaved(snapshot);
      toast.success("Settings saved", { description: "Changes are live on the website." });
      router.refresh();
    });
  }

  useModKey("s", () => {
    if (dirty) save();
  });

  const templateOk = form.title_template.includes("%s");
  const gaOk = !form.google_analytics_id || /^G-[A-Z0-9]+$/i.test(form.google_analytics_id.trim());
  const urlOk = !form.site_url || /^https?:\/\/[^\s]+$/i.test(form.site_url.trim());
  const siteName = form.site_name || "Snowdox";

  const tabs = [
    { value: "general", label: "General", icon: Building2 },
    { value: "seo", label: "SEO defaults", icon: SearchCheck },
    { value: "social", label: "Social", icon: Share2 },
    { value: "integrations", label: "Integrations", icon: Plug },
    ...(isAdmin ? [{ value: "team", label: "Team", icon: Users }] : []),
    { value: "account", label: "Account", icon: KeyRound },
  ];

  return (
    <>
      {missingRow && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Settings row not found</AlertTitle>
          <AlertDescription>
            Run <code className="font-mono text-xs">supabase/schema.sql</code> in the Supabase SQL editor — it creates the single
            settings row this page edits.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={tab} onValueChange={onTabChange} orientation="vertical" className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="no-scrollbar -mx-1 overflow-x-auto px-1 lg:mx-0 lg:overflow-visible lg:px-0">
          <TabsList className="h-auto w-max gap-1 p-1 lg:sticky lg:top-20 lg:w-full lg:flex-col lg:items-stretch lg:rounded-2xl lg:border lg:bg-card lg:p-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="justify-start gap-2.5 px-3 py-2 lg:data-[state=active]:bg-brand/10 lg:data-[state=active]:text-foreground lg:data-[state=active]:shadow-none"
                >
                  <Icon /> {t.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="min-w-0">
          <TabsContent value="general" className="mt-0 space-y-6">
            <SectionCard title="Site identity" description="Used in titles, schema markup and the footer" icon={Globe}>
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField id="site_name" label="Site name">
                    <Input id="site_name" value={form.site_name} onChange={(e) => update("site_name", e.target.value)} placeholder="Snowdox" />
                  </FormField>
                  <FormField
                    id="site_url"
                    label="Site URL"
                    error={!urlOk ? "Use a full address starting with https://" : undefined}
                    hint="Your production domain — used for canonical URLs and the sitemap."
                  >
                    <Input
                      id="site_url"
                      value={form.site_url}
                      onChange={(e) => update("site_url", e.target.value)}
                      placeholder="https://snowdox.com"
                      inputMode="url"
                      aria-invalid={!urlOk}
                    />
                  </FormField>
                </div>
                <FormField id="tagline" label="Tagline" aside={<CharCounter value={form.tagline} max={160} min={0} />}>
                  <Input id="tagline" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="We code brands that move." />
                </FormField>
              </div>
            </SectionCard>

            <SectionCard title="Contact details" description="Shown on the contact page and in structured data" icon={Building2}>
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField id="contact_email" label="Contact email">
                    <Input id="contact_email" type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} placeholder="hello@snowdox.com" />
                  </FormField>
                  <FormField id="contact_phone" label="Phone" optional>
                    <Input id="contact_phone" type="tel" value={form.contact_phone} onChange={(e) => update("contact_phone", e.target.value)} placeholder="+1 555 0100" />
                  </FormField>
                </div>
                <FormField id="address" label="Address" optional>
                  <Textarea id="address" rows={2} value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Remote-first · Working worldwide" />
                </FormField>
                <SaveRow pending={pending} dirty={dirty} onSave={save} disabled={missingRow} />
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="seo" className="mt-0 space-y-6">
            <SectionCard title="Titles & descriptions" description="Fallbacks for pages without their own SEO" icon={SearchCheck}>
              <div className="space-y-5">
                <FormField
                  id="title_template"
                  label="Title template"
                  aside={<ValidityHint ok={templateOk} okText="Contains %s" badText='Must contain "%s"' />}
                  hint={
                    <>
                      <span className="font-mono">%s</span> is replaced by each page&apos;s title. Example:{" "}
                      <span className="font-medium text-foreground">{templateOk ? form.title_template.replace("%s", "About us") : "—"}</span>
                    </>
                  }
                >
                  <Input
                    id="title_template"
                    value={form.title_template}
                    onChange={(e) => update("title_template", e.target.value)}
                    placeholder="%s | Snowdox"
                    className="font-mono"
                    aria-invalid={!templateOk}
                  />
                </FormField>
                <FormField id="default_title" label="Default title" aside={<CharCounter value={form.default_title} limit="title" />} hint="Used for the home page and any page without a title.">
                  <Input
                    id="default_title"
                    value={form.default_title}
                    onChange={(e) => update("default_title", e.target.value)}
                    placeholder={`${siteName} — Design & Engineering Agency`}
                  />
                </FormField>
                <FormField id="default_description" label="Default description" aside={<CharCounter value={form.default_description} limit="description" />}>
                  <Textarea
                    id="default_description"
                    rows={3}
                    value={form.default_description}
                    onChange={(e) => update("default_description", e.target.value)}
                    placeholder="A one or two sentence pitch for your studio."
                  />
                </FormField>
                <FormField id="default_keywords" label="Default keywords" hint="Applied to pages that don't define their own.">
                  <TagInput id="default_keywords" value={form.default_keywords} onChange={(v) => update("default_keywords", v)} max={25} />
                </FormField>
              </div>
            </SectionCard>

            <SectionCard title="Default social image" description="Fallback Open Graph image (1200 × 630)" icon={Share2}>
              <div className="max-w-md">
                <ImagePicker aspect="og" value={form.default_og_image} onChange={({ url }) => update("default_og_image", url)} emptyHint="Pages use an auto-generated branded card" />
              </div>
            </SectionCard>

            <SectionCard title="Search engine visibility" icon={ShieldCheck}>
              <div className="space-y-4">
                <SwitchField
                  id="allow_indexing"
                  label="Allow search engines to index the site"
                  description="Turn off for staging sites. When off, every page is served with noindex, nofollow."
                >
                  <Switch id="allow_indexing" checked={form.allow_indexing} onCheckedChange={(v) => update("allow_indexing", v)} />
                </SwitchField>
                {!form.allow_indexing && (
                  <Alert variant="warning">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Your site is hidden from Google</AlertTitle>
                    <AlertDescription>
                      No page will appear in search results while this is off. Existing rankings drop over the following weeks.
                    </AlertDescription>
                  </Alert>
                )}
                <SaveRow pending={pending} dirty={dirty} onSave={save} disabled={missingRow || !templateOk} />
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="social" className="mt-0 space-y-6">
            <SectionCard title="Social profiles" description="Linked in the footer and in Organization schema (sameAs)" icon={Share2}>
              <div className="space-y-5">
                <FormField id="twitter_handle" label="X / Twitter handle" hint="Used for twitter:site on shared links.">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                    <Input
                      id="twitter_handle"
                      value={form.twitter_handle.replace(/^@/, "")}
                      onChange={(e) => update("twitter_handle", e.target.value ? `@${e.target.value.replace(/^@+/, "")}` : "")}
                      placeholder="snowdox"
                      className="pl-8"
                    />
                  </div>
                </FormField>
                <div className="grid gap-4 md:grid-cols-2">
                  {SOCIALS.map((s) => {
                    const Icon = s.icon;
                    return (
                      <FormField key={s.key} id={`social-${s.key}`} label={s.label}>
                        <div className="relative">
                          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                          <Input
                            id={`social-${s.key}`}
                            value={form.socials[s.key]}
                            onChange={(e) => updateSocial(s.key, e.target.value)}
                            placeholder={s.placeholder}
                            inputMode="url"
                            className="pl-10"
                          />
                        </div>
                      </FormField>
                    );
                  })}
                </div>
                <SaveRow pending={pending} dirty={dirty} onSave={save} disabled={missingRow} />
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="integrations" className="mt-0 space-y-6">
            <SectionCard title="Analytics" description="Google Analytics 4" icon={BarChart3}>
              <FormField
                id="google_analytics_id"
                label="GA4 measurement ID"
                error={!gaOk ? "Should look like G-XXXXXXXXXX" : undefined}
                hint="Find it in Google Analytics → Admin → Data streams → your web stream. Leave empty to disable tracking."
              >
                <Input
                  id="google_analytics_id"
                  value={form.google_analytics_id}
                  onChange={(e) => update("google_analytics_id", e.target.value.toUpperCase())}
                  placeholder="G-XXXXXXXXXX"
                  className="font-mono sm:max-w-xs"
                  aria-invalid={!gaOk}
                />
              </FormField>
            </SectionCard>

            <SectionCard title="Site verification" description="Prove ownership to search consoles" icon={ShieldCheck}>
              <div className="space-y-5">
                <FormField
                  id="google_site_verification"
                  label="Google Search Console"
                  hint={
                    <>
                      Choose the <strong className="text-foreground">HTML tag</strong> method and paste only the{" "}
                      <span className="font-mono">content</span> value.
                    </>
                  }
                >
                  <Input
                    id="google_site_verification"
                    value={form.google_site_verification}
                    onChange={(e) => update("google_site_verification", e.target.value)}
                    placeholder="e.g. 4b1Kd0…"
                    className="font-mono"
                  />
                </FormField>
                <FormField
                  id="bing_site_verification"
                  label="Bing Webmaster Tools"
                  hint={
                    <>
                      Paste the <span className="font-mono">msvalidate.01</span> meta tag&apos;s content value.
                    </>
                  }
                >
                  <Input
                    id="bing_site_verification"
                    value={form.bing_site_verification}
                    onChange={(e) => update("bing_site_verification", e.target.value)}
                    placeholder="e.g. 1A2B3C4D…"
                    className="font-mono"
                  />
                </FormField>
                <SaveRow pending={pending} dirty={dirty} onSave={save} disabled={missingRow || !gaOk} />
              </div>
            </SectionCard>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="team" className="mt-0">
              <TeamPanel team={team} currentUserId={profile?.id} />
            </TabsContent>
          )}

          <TabsContent value="account" className="mt-0">
            <AccountPanel profile={profile} email={email} />
          </TabsContent>
        </div>
      </Tabs>

      <SaveBar show={dirty && !missingRow} pending={pending} onSave={save} onDiscard={() => setForm(saved)} message="You have unsaved settings" />
    </>
  );
}
