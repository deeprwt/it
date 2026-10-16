import { cn } from "@/lib/utils";

/**
 * Friendly placeholder for empty lists and fresh installs.
 * @param {{ icon?: any, title: string, description?: React.ReactNode, action?: React.ReactNode, className?: string, compact?: boolean, bordered?: boolean }} props
 */
export function EmptyState({ icon: Icon, title, description, action, className, compact = false, bordered = false }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 px-4 py-8" : "gap-3 px-6 py-14",
        bordered && "rounded-2xl border border-dashed bg-card/50",
        className
      )}
    >
      {Icon && (
        <span
          className={cn(
            "relative flex items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-brand",
            compact ? "h-10 w-10" : "h-14 w-14"
          )}
        >
          <span aria-hidden className="absolute inset-0 rounded-2xl bg-brand/10 blur-xl" />
          <Icon className={cn("relative", compact ? "h-5 w-5" : "h-6 w-6")} />
        </span>
      )}
      <div className="max-w-sm space-y-1">
        <p className={cn("font-semibold text-foreground", compact ? "text-sm" : "text-base")}>{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-2 flex flex-wrap items-center justify-center gap-2">{action}</div>}
    </div>
  );
}
