"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, FileImage, HardDrive, Images, Loader2, Ruler, Save, Search, SearchX, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CopyButton } from "@/components/admin/CopyButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { FormField } from "@/components/admin/FormField";
import { UploadDropzone } from "@/components/admin/media/UploadDropzone";
import { deleteMedia, updateMediaAlt } from "@/lib/actions/media";
import { formatBytes, formatDate } from "@/lib/format";

function MediaDetails({ item, onClose }) {
  const router = useRouter();
  const [alt, setAlt] = React.useState(item?.alt || "");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => setAlt(item?.alt || ""), [item?.id, item?.alt]);

  if (!item) return null;
  const altDirty = (alt || "") !== (item.alt || "");

  function saveAlt() {
    startTransition(async () => {
      const res = await updateMediaAlt(item.id, alt);
      if (!res.ok) toast.error(res.error);
      else {
        toast.success("Alt text saved");
        router.refresh();
      }
    });
  }

  async function remove() {
    const res = await deleteMedia(item.id);
    if (!res.ok) {
      toast.error(res.error);
      return false;
    }
    toast.success("Image deleted");
    onClose();
    router.refresh();
  }

  const meta = [
    { icon: Ruler, label: "Dimensions", value: item.width && item.height ? `${item.width} × ${item.height}px` : "—" },
    { icon: HardDrive, label: "File size", value: item.size ? formatBytes(item.size) : "—" },
    { icon: FileImage, label: "Type", value: item.mime_type?.replace("image/", "").toUpperCase() || "—" },
    { icon: CalendarDays, label: "Uploaded", value: formatDate(item.created_at) || "—" },
  ];

  return (
    <>
      <SheetHeader className="pr-10">
        <SheetTitle className="truncate">{item.name || "Image"}</SheetTitle>
        <SheetDescription>Copy the URL, describe the image, or remove it.</SheetDescription>
      </SheetHeader>

      <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
        <Image src={item.url} alt={item.alt || ""} fill unoptimized sizes="480px" className="object-contain" />
      </div>

      <FormField id="media-url" label="Public URL">
        <div className="flex gap-2">
          <Input id="media-url" value={item.url} readOnly className="font-mono text-xs" onFocus={(e) => e.target.select()} />
          <CopyButton value={item.url} label="Copy URL" iconOnly variant="outline" className="h-10 w-10 shrink-0" />
        </div>
      </FormField>

      <FormField
        id="media-alt"
        label="Alt text"
        hint="Describe what's in the image. Used as the default alt text wherever you insert it."
      >
        <Textarea id="media-alt" rows={3} value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. Team reviewing wireframes on a whiteboard" />
      </FormField>
      <Button onClick={saveAlt} disabled={!altDirty || pending} className="w-full" variant={altDirty ? "brand" : "outline"}>
        {pending ? <Loader2 className="animate-spin" /> : <Save />} Save alt text
      </Button>

      <Separator />

      <dl className="grid grid-cols-2 gap-3">
        {meta.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-xl border bg-card p-3">
              <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <Icon className="h-3.5 w-3.5" aria-hidden /> {m.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{m.value}</dd>
            </div>
          );
        })}
      </dl>

      <SheetFooter className="pt-2">
        <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setConfirmOpen(true)}>
          <Trash2 /> Delete image
        </Button>
      </SheetFooter>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this image?"
        description="The file is removed from storage. Posts or pages still pointing at this URL will show a broken image."
        confirmLabel="Delete image"
        onConfirm={remove}
      />
    </>
  );
}

export function MediaLibrary({ items }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const selected = items.find((m) => m.id === selectedId) || null;
  const totalSize = items.reduce((sum, m) => sum + (m.size || 0), 0);

  const q = query.trim().toLowerCase();
  const filtered = q ? items.filter((m) => `${m.name || ""} ${m.alt || ""}`.toLowerCase().includes(q)) : items;
  const missingAlt = items.filter((m) => !m.alt).length;

  return (
    <div className="space-y-6">
      <UploadDropzone
        onUploaded={(rows) => {
          toast.success(`${rows.length} image${rows.length === 1 ? "" : "s"} uploaded`);
          router.refresh();
        }}
      />

      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="tabular-nums">
              {items.length}
            </Badge>
            files · {formatBytes(totalSize)}
            {missingAlt > 0 && (
              <Badge variant="warning" className="ml-1">
                {missingAlt} missing alt text
              </Badge>
            )}
          </div>
          {items.length > 0 && (
            <div className="relative sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or alt text…" className="pl-9" aria-label="Search media" />
            </div>
          )}
        </div>

        <div className="p-4">
          {items.length === 0 ? (
            <EmptyState icon={Images} title="No images yet" description="Drop files in the area above to start building your library." />
          ) : filtered.length === 0 ? (
            <EmptyState compact icon={SearchX} title="No matches" description="Try a different search." />
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {filtered.map((item) => (
                <li key={item.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSelectedId(item.id);
                      setSheetOpen(true);
                    }}
                    aria-label={`Open ${item.name || "image"}`}
                    className="group block h-auto w-full overflow-hidden rounded-xl border bg-background/40 p-0 text-left hover:-translate-y-0.5 hover:border-brand/40 hover:bg-background/40 hover:shadow-glow"
                  >
                    <span className="relative block aspect-square w-full overflow-hidden bg-muted">
                      <Image
                        src={item.url}
                        alt={item.alt || ""}
                        fill
                        unoptimized
                        sizes="(min-width: 1280px) 16vw, (min-width: 768px) 25vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {!item.alt && (
                        <Badge variant="warning" className="absolute left-2 top-2 bg-background/80 backdrop-blur">
                          No alt
                        </Badge>
                      )}
                    </span>
                    <span className="block space-y-0.5 px-3 py-2">
                      <span className="block truncate text-xs font-medium text-foreground">{item.name || "Untitled"}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                        {formatBytes(item.size || 0)}
                      </span>
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Sheet open={sheetOpen && Boolean(selected)} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full gap-5 overflow-y-auto p-6 sm:max-w-md">
          <MediaDetails item={selected} onClose={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
