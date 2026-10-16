"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Images, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaPickerDialog } from "@/components/admin/media/MediaPickerDialog";
import { cn } from "@/lib/utils";

const ASPECTS = {
  video: "aspect-video",
  og: "aspect-[1.91/1]",
  square: "aspect-square",
};

/**
 * Current image + Choose / Upload / Remove. Calls `onChange({ url, alt })`.
 * @param {{ value?: string, onChange: (v: {url: string, alt: string}) => void, aspect?: "video"|"og"|"square", emptyHint?: string, className?: string }} props
 */
export function ImagePicker({ value, onChange, aspect = "video", emptyHint = "No image selected", className }) {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState("library");
  const [broken, setBroken] = React.useState(false);

  React.useEffect(() => setBroken(false), [value]);

  const openWith = (next) => {
    setTab(next);
    setOpen(true);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className={cn("relative w-full overflow-hidden rounded-xl border bg-muted/50", ASPECTS[aspect] || ASPECTS.video)}>
        {value && !broken ? (
          <Image
            src={value}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1280px) 400px, 100vw"
            className="object-cover"
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border text-center">
            <ImagePlus className="h-6 w-6 text-muted-foreground" aria-hidden />
            <p className="px-4 text-xs text-muted-foreground">{broken ? "This image couldn't be loaded" : emptyHint}</p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => openWith("library")}>
          <Images /> {value ? "Change" : "Choose"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => openWith("upload")}>
          <Upload /> Upload
        </Button>
        {value && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onChange({ url: "", alt: "" })}
          >
            <Trash2 /> Remove
          </Button>
        )}
      </div>
      <MediaPickerDialog open={open} onOpenChange={setOpen} defaultTab={tab} onSelect={onChange} />
    </div>
  );
}
