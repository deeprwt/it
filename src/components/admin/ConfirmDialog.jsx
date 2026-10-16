"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * AlertDialog wrapper for destructive confirmations.
 * Works uncontrolled (pass `trigger`) or controlled (`open` + `onOpenChange`).
 * `onConfirm` may be async; return `false` to keep the dialog open.
 */
export function ConfirmDialog({
  trigger,
  open: openProp,
  onOpenChange,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  destructive = true,
  onConfirm,
  children,
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : internalOpen;

  const setOpen = (value) => {
    if (pending) return;
    if (!controlled) setInternalOpen(value);
    onOpenChange?.(value);
  };

  async function handleConfirm() {
    setPending(true);
    let keepOpen = false;
    try {
      keepOpen = (await onConfirm?.()) === false;
    } finally {
      setPending(false);
    }
    if (!keepOpen) {
      if (!controlled) setInternalOpen(false);
      onOpenChange?.(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                destructive
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : "border-warning/30 bg-warning/10 text-warning"
              )}
            >
              <AlertTriangle className="h-5 w-5" aria-hidden />
            </span>
            <div className="space-y-1.5">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
            </div>
          </div>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <Button variant={destructive ? "destructive" : "default"} onClick={handleConfirm} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
