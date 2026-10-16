"use client";

import { CircleDot, Loader2, Save, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Floating "unsaved changes" bar with Discard / Save. */
export function SaveBar({ show, pending, onSave, onDiscard, saveLabel = "Save changes", message = "You have unsaved changes" }) {
  return (
    <div
      aria-hidden={!show}
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 transition-all duration-300",
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
    >
      <div
        role="status"
        className={cn(
          "flex w-full max-w-lg items-center gap-3 rounded-2xl border bg-popover/95 py-2 pl-4 pr-2 shadow-elegant backdrop-blur-xl",
          show && "pointer-events-auto"
        )}
      >
        <CircleDot className="h-4 w-4 shrink-0 text-warning" aria-hidden />
        <p className="flex-1 truncate text-sm text-foreground">{message}</p>
        {onDiscard && (
          <Button variant="ghost" size="sm" onClick={onDiscard} disabled={pending} tabIndex={show ? 0 : -1}>
            <Undo2 /> <span className="hidden sm:inline">Discard</span>
          </Button>
        )}
        <Button variant="brand" size="sm" onClick={onSave} disabled={pending} tabIndex={show ? 0 : -1}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />}
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}
