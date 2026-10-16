import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  CircleDot,
  Clock,
  FilePen,
  MessageSquareText,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { scoreLabel } from "@/lib/seo-score";
import { cn } from "@/lib/utils";

/** Derive the display status of a post (scheduled = published with a future date). */
export function postDisplayStatus(status, publishedAt) {
  if (status === "published" && publishedAt && new Date(publishedAt) > new Date()) return "scheduled";
  return status || "draft";
}

export function isPostLive(post) {
  return post?.status === "published" && post?.published_at && new Date(post.published_at) <= new Date();
}

const POST = {
  draft: { label: "Draft", variant: "muted", icon: FilePen },
  published: { label: "Published", variant: "success", icon: CheckCircle2 },
  scheduled: { label: "Scheduled", variant: "brand", icon: Clock },
  archived: { label: "Archived", variant: "outline", icon: Archive },
};

export const LEAD_STATUSES = [
  { value: "new", label: "New", variant: "brand", icon: Sparkles },
  { value: "contacted", label: "Contacted", variant: "violet", icon: MessageSquareText },
  { value: "qualified", label: "Qualified", variant: "warning", icon: CircleDot },
  { value: "won", label: "Won", variant: "success", icon: Trophy },
  { value: "lost", label: "Lost", variant: "destructive", icon: XCircle },
  { value: "archived", label: "Archived", variant: "muted", icon: Archive },
];
const LEAD = Object.fromEntries(LEAD_STATUSES.map((s) => [s.value, s]));

/**
 * @param {{ status: string, publishedAt?: string, kind?: "post" | "lead", className?: string }} props
 */
export function StatusBadge({ status, publishedAt, kind = "post", className }) {
  const config = kind === "lead" ? LEAD[status] || LEAD.new : POST[postDisplayStatus(status, publishedAt)] || POST.draft;
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className={cn("gap-1", className)}>
      <Icon aria-hidden />
      {config.label}
    </Badge>
  );
}

const SCORE_ICON = { success: CheckCircle2, warning: AlertTriangle, destructive: XCircle };

/** SEO score pill — always icon + number + label, never colour alone. */
export function ScoreBadge({ score, showLabel = false, className }) {
  const { label, tone } = scoreLabel(score);
  const Icon = SCORE_ICON[tone];
  return (
    <Badge variant={tone} className={cn("gap-1 tabular-nums", className)} title={`SEO score ${score}/100 — ${label}`}>
      <Icon aria-hidden />
      {score}
      {showLabel ? <span className="font-normal">· {label}</span> : <span className="sr-only">/100, {label}</span>}
    </Badge>
  );
}
