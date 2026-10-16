import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ReadingProgress } from "@/components/site/effects/Interactive";
import { Reveal } from "@/components/site/effects/Reveal";
import { PostCard } from "@/components/site/blog/PostCard";
import { ShareButtons, TableOfContents, ViewTracker } from "@/components/site/blog/PostClient";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaSection } from "@/components/site/sections/CtaSection";
import { JsonLd } from "@/components/site/JsonLd";
import { getPostBySlug, getPublishedPosts, getRelatedPosts, getSiteSettings } from "@/lib/cms";
import { absoluteUrl, blogPostingSchema, breadcrumbSchema, buildPostMetadata } from "@/lib/seo";
import { renderPostHtml } from "@/lib/sanitize";
import { formatDate, initials } from "@/lib/format";
import { isOptimizable } from "@/lib/images";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  return buildPostMetadata(post);
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [settings, related] = await Promise.all([getSiteSettings(), getRelatedPosts(post, 3)]);
  const { html, toc } = renderPostHtml(post.content || "");
  const url = absoluteUrl(`/blog/${post.slug}`, settings.siteUrl);
  const updated = post.updated_at && new Date(post.updated_at) - new Date(post.published_at) > 864e5;

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema(post, settings),
          breadcrumbSchema(
            [
              { name: "Home", url: "/" },
              { name: "Blog", url: "/blog" },
              { name: post.title, url: `/blog/${post.slug}` },
            ],
            settings
          ),
        ]}
      />
      <ReadingProgress targetId="article" />
      <ViewTracker slug={post.slug} />

      <article id="article">
        <header className="relative isolate overflow-hidden pb-12 pt-32 md:pt-40">
          <div className="absolute inset-0 -z-10 bg-grid-lines mask-radial [background-size:56px_56px] opacity-50" />
          <div className="absolute -top-32 left-1/2 -z-10 h-[26rem] w-[40rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[130px]" />

          <div className="container max-w-4xl">
            <Button asChild variant="ghost" size="sm" className="-ml-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <Link href="/blog">
                <ArrowLeft /> All articles
              </Link>
            </Button>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {post.category?.name && (
                <Badge variant="brand" className="font-mono text-[10px] uppercase tracking-widest">
                  <Link href={`/blog?category=${post.category.slug}`}>{post.category.name}</Link>
                </Badge>
              )}
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {post.reading_time || 1} min read
              </span>
            </div>

            <Reveal>
              <h1 className="mt-6 text-balance font-display text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
            </Reveal>
            {post.excerpt && (
              <Reveal delay={100}>
                <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">{post.excerpt}</p>
              </Reveal>
            )}

            <Reveal delay={180} className="mt-10 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback>{initials(post.author_name || settings.siteName)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold">{post.author_name || `${settings.siteName} Team`}</p>
                  <p className="flex flex-wrap items-center gap-x-3 font-mono text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={post.published_at}>{formatDate(post.published_at, { month: "long", day: "numeric", year: "numeric" })}</time>
                    </span>
                    {updated && (
                      <span className="inline-flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" /> Updated {formatDate(post.updated_at)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <ShareButtons url={url} title={post.title} />
            </Reveal>
          </div>
        </header>

        {post.cover_image && (
          <div className="container max-w-6xl">
            <Reveal className="relative aspect-[16/8] overflow-hidden rounded-2xl border border-white/10 bg-muted">
              <Image
                src={post.cover_image}
                alt={post.cover_image_alt || post.title}
                fill
                priority
                sizes="(min-width: 1280px) 1150px, 100vw"
                unoptimized={!isOptimizable(post.cover_image)}
                className="object-cover"
              />
            </Reveal>
          </div>
        )}

        <div className="container mt-14 grid grid-cols-1 max-w-6xl gap-12 pb-20 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-1">
            <div className="prose-snowdox md:prose-lg" dangerouslySetInnerHTML={{ __html: html }} />

            {(post.tags?.length > 0 || post.keywords?.length > 0) && (
              <div className="mt-14">
                <Separator className="mb-8 bg-white/10" />
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">{"// tagged"}</p>
                <div className="flex flex-wrap gap-2">
                  {(post.tags?.length ? post.tags : post.keywords).map((tag) => (
                    <Badge key={tag} asChild variant="outline" className="border-white/10 px-3 py-1 font-normal text-muted-foreground hover:border-brand hover:text-brand">
                      <Link href={`/blog?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28 space-y-10">
              <TableOfContents items={toc} />
              <div className="rounded-2xl border border-white/10 bg-card/60 p-6">
                <p className="font-display text-xl font-bold">Need this built?</p>
                <p className="mt-2 text-sm text-muted-foreground">We design and ship this kind of thing every week.</p>
                <Button asChild variant="brand" className="mt-5 w-full rounded-full">
                  <Link href="/contact">Talk to us</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section border-t border-white/[0.06]">
          <div className="container">
            <SectionHeading eyebrow="keep reading" title="Related articles" />
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection email={settings.email} />
    </>
  );
}
