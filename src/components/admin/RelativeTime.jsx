"use client";

import * as React from "react";
import { formatDate, formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

/** "3 hours ago" that re-renders every minute; full date in the title tooltip. */
export function RelativeTime({ value, className, fallback = "—" }) {
  const [, tick] = React.useReducer((n) => n + 1, 0);

  React.useEffect(() => {
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!value) return <span className={cn("text-muted-foreground", className)}>{fallback}</span>;

  return (
    <time
      dateTime={new Date(value).toISOString()}
      title={formatDate(value, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
      className={className}
      suppressHydrationWarning
    >
      {formatRelative(value)}
    </time>
  );
}
