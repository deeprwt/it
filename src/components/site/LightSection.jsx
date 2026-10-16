import { cn } from "@/lib/utils";

/**
 * A white "snow" section inside the dark site. Setting data-theme="light"
 * swaps every design token for this subtree, so any component inside that
 * uses tokens (bg-card, text-foreground, border…) renders in light mode.
 */
export function LightSection({ as: Tag = "section", className, children, grid = true, ...props }) {
  return (
    <Tag data-theme="light" className={cn("relative isolate overflow-hidden bg-background text-foreground", className)} {...props}>
      {grid && (
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid-lines mask-radial [background-size:56px_56px] opacity-70" />
      )}
      {children}
    </Tag>
  );
}
