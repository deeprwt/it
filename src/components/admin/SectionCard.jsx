import { cn } from "@/lib/utils";

/** rounded-2xl card with an icon + title header row and an actions slot. */
export function SectionCard({ title, description, icon: Icon, actions, children, className, contentClassName }) {
  return (
    <section className={cn("rounded-2xl border bg-card", className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                <Icon className="h-4 w-4" />
              </span>
            )}
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
              {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn("p-5", contentClassName)}>{children}</div>
    </section>
  );
}
