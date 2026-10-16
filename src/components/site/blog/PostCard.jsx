import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spotlight } from "@/components/site/effects/Interactive";
import { formatDate } from "@/lib/format";
import { isOptimizable } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Deterministic hue from a string, for posts without a cover image. */
function hueFor(text = "") {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

export function PostCover({ post, className, priority = false, sizes = "(min-width: 1024px) 33vw, 100vw" }) {
  if (post.cover_image) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl bg-muted", className)}>
        <Image
          src={post.cover_image}
          alt={post.cover_image_alt || post.title}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={!isOptimizable(post.cover_image)}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    );
  }
  const hue = hueFor(post.slug);
  return (
    <div
      className={cn("relative overflow-hidden rounded-xl", className)}
      style={{
        backgroundImage: `radial-gradient(at 20% 25%, hsl(${hue} 90% 60% / 0.55), transparent 55%), radial-gradient(at 85% 80%, hsl(${(hue + 70) % 360} 90% 60% / 0.45), transparent 55%)`,
        backgroundColor: "hsl(var(--card))",
      }}
    >
      <div className="absolute inset-0 bg-grid-lines [background-size:24px_24px] opacity-40" />
      <span className="absolute bottom-4 left-4 font-mono text-xs uppercase tracking-widest text-foreground/80">
        {`// ${post.category?.name || "notes"}`}
      </span>
      <span
        aria-hidden
        className="absolute right-4 top-2 font-display text-7xl font-extrabold text-foreground/10 transition-transform duration-700 group-hover:scale-110"
      >
        {"</>"}
      </span>
    </div>
  );
}

export function PostCard({ post, className }) {
  return (
    <Spotlight
      asChild
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-card/50 p-3 transition-colors duration-500 hover:bg-card",
        className
      )}
    >
      <Link href={`/blog/${post.slug}`}>
        <span className="spotlight-border" aria-hidden />
        <PostCover post={post} className="aspect-[16/10]" />
        <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {post.category?.name && (
              <Badge variant="brand" className="font-mono text-[10px] uppercase tracking-widest">
                {post.category.name}
              </Badge>
            )}
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          </div>
          <h3 className="mt-4 text-balance font-display text-xl font-bold leading-snug tracking-tight transition-colors group-hover:text-brand md:text-2xl">
            {post.title}
          </h3>
          {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>}
          <div className="mt-auto flex items-center justify-between pt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {post.reading_time || 1} min read
            </span>
            <ArrowUpRight className="h-4 w-4 transition-all duration-300 group-hover:rotate-45 group-hover:text-brand" />
          </div>
        </div>
      </Link>
    </Spotlight>
  );
}
