"use client";

import * as React from "react";
import { CheckCircle2, CloudUpload, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES, uploadImage } from "@/lib/upload";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";

const CONCURRENCY = 3;

/**
 * Drag & drop / click-to-browse image uploader with a per-file status list.
 * Calls `onUploaded(rows)` once the batch settles (only successful rows).
 */
export function UploadDropzone({ multiple = true, onUploaded, className, compact = false }) {
  const inputId = React.useId();
  const inputRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const busy = items.some((i) => i.status === "uploading");

  const update = (key, patch) => setItems((list) => list.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []).slice(0, multiple ? 50 : 1);
    if (!files.length) return;

    const queue = files.map((file) => ({ key: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`, file }));
    setItems((list) => [
      ...queue.map(({ key, file }) => ({ key, name: file.name, size: file.size, status: "uploading", error: null })),
      ...list.filter((i) => i.status !== "done"),
    ]);

    const uploaded = [];
    let cursor = 0;
    async function worker() {
      while (cursor < queue.length) {
        const { key, file } = queue[cursor++];
        try {
          const row = await uploadImage(file);
          uploaded.push(row);
          update(key, { status: "done" });
        } catch (error) {
          update(key, { status: "error", error: error?.message || "Upload failed" });
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));
    if (inputRef.current) inputRef.current.value = "";
    if (uploaded.length) onUploaded?.(uploaded);
  }

  function onDrop(event) {
    event.preventDefault();
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
        }}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed text-center transition-all duration-200",
          compact ? "px-4 py-8" : "px-6 py-12",
          dragging ? "border-brand bg-brand/10" : "border-border bg-background/40 hover:border-brand/50 hover:bg-brand/5"
        )}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-lines opacity-40 [background-size:32px_32px] mask-radial" />
        <span
          className={cn(
            "relative flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-brand transition-transform duration-300",
            dragging ? "scale-110" : "group-hover:-translate-y-0.5"
          )}
        >
          <CloudUpload className="h-6 w-6" />
        </span>
        <div className="relative space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {dragging ? "Drop to upload" : multiple ? "Drag & drop images here" : "Drag & drop an image here"}
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WebP, GIF, SVG or AVIF · up to {formatBytes(MAX_UPLOAD_BYTES)} each
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative"
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          {busy ? <Loader2 className="animate-spin" /> : <CloudUpload />}
          {busy ? "Uploading…" : multiple ? "Browse files" : "Browse"}
        </Button>
        <Input
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          tabIndex={-1}
          aria-label="Choose image files"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple={multiple}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {items.length > 0 && (
        <ul className="space-y-2" aria-live="polite">
          {items.map((item) => (
            <li key={item.key} className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5">
              {item.status === "uploading" && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand" aria-hidden />}
              {item.status === "done" && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden />}
              {item.status === "error" && <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden />}
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="truncate font-medium text-foreground">{item.name}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {item.status === "uploading" ? "Uploading…" : item.status === "done" ? "Uploaded" : "Failed"} ·{" "}
                    {formatBytes(item.size)}
                  </span>
                </div>
                {item.status === "error" ? (
                  <p className="text-xs text-destructive">{item.error}</p>
                ) : (
                  <Progress
                    value={item.status === "done" ? 100 : 65}
                    className="h-1.5"
                    indicatorClassName={item.status === "done" ? "bg-success" : "animate-pulse bg-brand"}
                    aria-label={`${item.name} upload progress`}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
