"use client";

import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/components/admin/hooks";
import { cn } from "@/lib/utils";

export function CopyButton({ value, label = "Copy", size = "sm", variant = "outline", className, iconOnly = false }) {
  const [copied, copy] = useCopy();
  return (
    <Button
      type="button"
      size={iconOnly ? "icon-sm" : size}
      variant={variant}
      className={cn(className)}
      aria-label={iconOnly ? label : undefined}
      onClick={async () => {
        const ok = await copy(value);
        if (!ok) toast.error("Couldn't copy — select the text and copy it manually.");
      }}
    >
      {copied ? <Check className="text-success" /> : <Copy />}
      {!iconOnly && (copied ? "Copied" : label)}
    </Button>
  );
}
