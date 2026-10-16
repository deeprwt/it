import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Label + control + hint, with an optional right-aligned slot (e.g. a CharCounter).
 * @param {{ id?: string, label: React.ReactNode, hint?: React.ReactNode, aside?: React.ReactNode, error?: string, className?: string, children: React.ReactNode }} props
 */
export function FormField({ id, label, hint, aside, error, className, children, optional = false }) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className="text-[13px]">
          {label}
          {optional && <span className="ml-1.5 text-xs font-normal text-muted-foreground">Optional</span>}
        </Label>
        {aside}
      </div>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

/** Switch row with a title + explanation. */
export function SwitchField({ id, label, description, children, className }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 rounded-xl border bg-background/40 p-4", className)}>
      <div className="space-y-1">
        <Label htmlFor={id} className="text-sm">
          {label}
        </Label>
        {description && <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
