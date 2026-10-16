"use client";

import Link from "next/link";
import { CalendarClock, FolderTree, ImageIcon, Send, Settings2, Star, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/admin/FormField";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { SectionCard } from "@/components/admin/SectionCard";
import { TagInput } from "@/components/admin/TagInput";
import { fromLocalInput, toLocalInput } from "@/components/admin/datetime";
import { formatDate } from "@/lib/format";

/** Right-hand column of the post editor: publish options, taxonomy and cover image. */
export function PostSettingsPanel({ form, update, categories, defaultAuthor, mounted }) {
  const scheduled = form.status === "published" && form.published_at && new Date(form.published_at) > new Date();

  return (
    <>
      <SectionCard title="Publish" description="Status, timing and byline" icon={Send}>
        <div className="space-y-4">
          <FormField id="status" label="Status">
            <Select value={form.status} onValueChange={(v) => update("status", v)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            id="published_at"
            label="Publish date"
            hint="Leave empty to publish immediately. A future date + Published status = scheduled."
          >
            <Input
              id="published_at"
              type="datetime-local"
              value={mounted ? toLocalInput(form.published_at) : ""}
              onChange={(e) => update("published_at", fromLocalInput(e.target.value))}
            />
          </FormField>
          {scheduled && (
            <Badge variant="brand" className="w-full justify-center py-1.5">
              <CalendarClock aria-hidden />
              <span suppressHydrationWarning>
                Goes live {formatDate(form.published_at, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
            </Badge>
          )}

          <div className="flex items-center justify-between gap-3 rounded-xl border bg-background/40 px-3 py-3">
            <Label htmlFor="featured" className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-warning" aria-hidden /> Featured post
            </Label>
            <Switch id="featured" checked={form.featured} onCheckedChange={(v) => update("featured", v)} />
          </div>

          <FormField id="author_name" label="Author name">
            <Input
              id="author_name"
              value={form.author_name}
              onChange={(e) => update("author_name", e.target.value)}
              placeholder={defaultAuthor || "Snowdox team"}
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard
        title="Category"
        icon={FolderTree}
        actions={
          <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
            <Link href="/admin/categories">
              <Settings2 /> Manage
            </Link>
          </Button>
        }
      >
        <Select value={form.category_id || "none"} onValueChange={(v) => update("category_id", v === "none" ? "" : v)}>
          <SelectTrigger aria-label="Category">
            <SelectValue placeholder="Uncategorized" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Uncategorized</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {categories.length === 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            No categories yet —{" "}
            <Link href="/admin/categories?new=1" className="text-brand underline-offset-4 hover:underline">
              create one
            </Link>
            .
          </p>
        )}
      </SectionCard>

      <SectionCard title="Tags" description="Shown on the post and used for related articles" icon={Tags}>
        <TagInput value={form.tags} onChange={(v) => update("tags", v)} max={15} maxLength={40} placeholder="e.g. nextjs, performance" aria-label="Tags" />
      </SectionCard>

      <SectionCard title="Cover image" description="Also the default social image" icon={ImageIcon}>
        <div className="space-y-4">
          <ImagePicker
            value={form.cover_image}
            onChange={({ url, alt }) => {
              update("cover_image", url);
              if (url && alt && !form.cover_image_alt) update("cover_image_alt", alt);
              if (!url) update("cover_image_alt", "");
            }}
            emptyHint="Recommended 1600 × 900 px"
          />
          <FormField id="cover_image_alt" label="Alt text" hint="Describe the image for screen readers and image search.">
            <Input
              id="cover_image_alt"
              value={form.cover_image_alt}
              onChange={(e) => update("cover_image_alt", e.target.value)}
              placeholder="e.g. Dashboard showing Core Web Vitals scores"
              disabled={!form.cover_image}
            />
          </FormField>
        </div>
      </SectionCard>
    </>
  );
}
