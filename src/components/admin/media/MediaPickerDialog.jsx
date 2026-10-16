"use client";

import * as React from "react";
import Image from "next/image";
import { Check, ImageOff, Images, Link2, Search, Upload } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/admin/EmptyState";
import { UploadDropzone } from "@/components/admin/media/UploadDropzone";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

async function fetchLibrary() {
  const { data, error } = await createClient()
    .from("media")
    .select("id, url, name, alt, width, height, size, created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Pick an image from the media library, upload a new one, or paste a URL.
 * Calls `onSelect({ url, alt })`.
 */
export function MediaPickerDialog({ open, onOpenChange, onSelect, defaultTab = "library", title = "Choose an image" }) {
  const [tab, setTab] = React.useState(defaultTab);
  const [items, setItems] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState(null);
  const [alt, setAlt] = React.useState("");
  const [externalUrl, setExternalUrl] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setTab(defaultTab);
    setSelectedId(null);
    setAlt("");
    setQuery("");
    let cancelled = false;
    setError(null);
    fetchLibrary()
      .then((rows) => !cancelled && setItems(rows))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [open, defaultTab]);

  const filtered = React.useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((m) => `${m.name || ""} ${m.alt || ""}`.toLowerCase().includes(q));
  }, [items, query]);

  const selected = items?.find((m) => m.id === selectedId) || null;

  function choose(item) {
    setSelectedId(item.id);
    setAlt(item.alt || "");
  }

  function confirm() {
    if (!selected) return;
    onSelect?.({ url: selected.url, alt: alt.trim() || selected.alt || "" });
    onOpenChange(false);
  }

  function applyExternalUrl() {
    const url = externalUrl.trim();
    if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) return;
    onSelect?.({ url, alt: alt.trim() });
    setExternalUrl("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 p-0">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Pick from your media library or upload something new.</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="px-6 pt-4">
          <TabsList>
            <TabsTrigger value="library">
              <Images /> Library
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload /> Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by file name or alt text"
                className="pl-9"
                aria-label="Search media"
              />
            </div>

            <ScrollArea className="h-[340px] rounded-xl border bg-background/40">
              {error ? (
                <EmptyState compact icon={ImageOff} title="Couldn't load the library" description={error} />
              ) : items === null ? (
                <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-lg" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState
                  compact
                  icon={Images}
                  title={items.length ? "No matches" : "Your library is empty"}
                  description={items.length ? "Try a different search." : "Upload your first image to get started."}
                  action={
                    !items.length && (
                      <Button size="sm" variant="outline" onClick={() => setTab("upload")}>
                        <Upload /> Upload an image
                      </Button>
                    )
                  }
                />
              ) : (
                <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
                  {filtered.map((item) => {
                    const active = item.id === selectedId;
                    return (
                      <Button
                        key={item.id}
                        type="button"
                        variant="ghost"
                        onClick={() => choose(item)}
                        onDoubleClick={() => {
                          choose(item);
                          onSelect?.({ url: item.url, alt: item.alt || "" });
                          onOpenChange(false);
                        }}
                        aria-pressed={active}
                        aria-label={item.alt || item.name || "Image"}
                        className={cn(
                          "relative block aspect-square h-auto w-full overflow-hidden rounded-lg border-2 bg-muted p-0 hover:bg-muted",
                          active ? "border-brand ring-2 ring-brand/30" : "border-transparent hover:border-brand/40"
                        )}
                      >
                        <Image src={item.url} alt="" fill unoptimized sizes="160px" className="object-cover" />
                        {active && (
                          <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-glow">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            <div className="space-y-2">
              <Label htmlFor="media-picker-alt" className="text-[13px]">
                Alt text
              </Label>
              <Input
                id="media-picker-alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder={selected ? "Describe the image for screen readers & SEO" : "Select an image first"}
                disabled={!selected}
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-5">
            <UploadDropzone
              multiple={false}
              compact
              onUploaded={(rows) => {
                const row = rows[0];
                setItems((list) => [row, ...(list || [])]);
                setSelectedId(row.id);
                setAlt(row.alt || "");
                setTab("library");
              }}
            />
            <div className="space-y-2">
              <Label htmlFor="media-picker-url" className="flex items-center gap-1.5 text-[13px]">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground" /> Or use an image URL
              </Label>
              <div className="flex gap-2">
                <Input
                  id="media-picker-url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://images.example.com/photo.jpg"
                  inputMode="url"
                />
                <Button type="button" variant="outline" onClick={applyExternalUrl} disabled={!externalUrl.trim()}>
                  Use URL
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4 border-t px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="brand" onClick={confirm} disabled={!selected || tab !== "library"}>
            <Check />
            Use image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
