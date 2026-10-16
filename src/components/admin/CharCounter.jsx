import { AlertTriangle, CheckCircle2, CircleDashed, XCircle } from "lucide-react";
import { LIMITS } from "@/lib/seo-score";
import { cn } from "@/lib/utils";

/**
 * "48 / 60" counter that turns green inside the recommended range.
 * Pass `limit="title" | "description"` to use the SEO LIMITS, or explicit `min` / `max`.
 */
export function CharCounter({ value = "", limit, min, max, className }) {
  const range = limit ? LIMITS[limit] : null;
  const lo = min ?? range?.min ?? 0;
  const hi = max ?? range?.max ?? 160;
  const length = (value || "").trim().length;

  let tone = "muted";
  if (length > hi) tone = "destructive";
  else if (length > 0 && length < lo) tone = "warning";
  else if (length > 0) tone = "success";

  const Icon = { muted: CircleDashed, success: CheckCircle2, warning: AlertTriangle, destructive: XCircle }[tone];
  const hint =
    tone === "destructive"
      ? `${length - hi} over the limit`
      : tone === "warning"
        ? `${lo - length} more for best results`
        : tone === "success"
          ? "Good length"
          : lo
            ? `Aim for ${lo}–${hi}`
            : `Up to ${hi}`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap font-mono text-[11px] tabular-nums",
        tone === "muted" && "text-muted-foreground",
        tone === "success" && "text-success",
        tone === "warning" && "text-warning",
        tone === "destructive" && "text-destructive",
        className
      )}
      title={hint}
    >
      <Icon className="h-3 w-3" aria-hidden />
      <span>
        {length} / {hi}
      </span>
      <span className="sr-only">characters. {hint}</span>
    </span>
  );
}
