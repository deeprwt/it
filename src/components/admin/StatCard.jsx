import { cn } from "@/lib/utils";

const TONES = {
  brand: "border-brand/20 bg-brand/10 text-brand",
  violet: "border-brand-2/20 bg-brand-2/10 text-brand-2",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  destructive: "border-destructive/20 bg-destructive/10 text-destructive",
  muted: "border-border bg-muted text-muted-foreground",
};

/**
 * KPI tile: icon chip + label, a big proportional figure, a sub line and an optional footer (e.g. a Progress).
 * @param {{ label: string, value: React.ReactNode, sub?: React.ReactNode, icon?: any, tone?: keyof TONES, className?: string, children?: React.ReactNode }} props
 */
export function StatCard({ label, value, sub, icon: Icon, tone = "brand", className, children }) {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-glow",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", TONES[tone] || TONES.brand)}>
            <Icon className="h-4 w-4" />
          </span>
        )}
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="mt-5 text-3xl font-bold leading-none tracking-tight text-foreground">{value}</p>
      {sub && <p className="mt-2 text-xs text-muted-foreground">{sub}</p>}
      {children && <div className="mt-auto pt-4">{children}</div>}
    </div>
  );
}

export function compactNumber(value) {
  const n = Number(value) || 0;
  if (Math.abs(n) < 10000) return n.toLocaleString("en-US");
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
