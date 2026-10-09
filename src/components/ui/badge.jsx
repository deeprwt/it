import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border px-3 py-1 text-xs font-medium uppercase tracking-widest transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-secondary text-foreground",
        accent: "border-accent/40 bg-accent/10 text-accent",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
