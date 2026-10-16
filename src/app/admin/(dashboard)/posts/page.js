import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { listCategories, listPosts } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { PostsView } from "@/components/admin/posts/PostsView";

export const metadata = { title: "Blog posts" };

const STATUSES = ["all", "published", "draft", "scheduled", "archived"];
const first = (v) => (Array.isArray(v) ? v[0] : v);

export default async function PostsPage({ searchParams }) {
  const params = await searchParams;
  const q = String(first(params?.q) || "").slice(0, 100);
  const status = STATUSES.includes(first(params?.status)) ? first(params.status) : "all";
  const category = first(params?.category) || "all";
  const page = Math.max(1, Number.parseInt(first(params?.page), 10) || 1);

  const [result, categories] = await Promise.all([
    listPosts({ search: q, status, category, page }),
    listCategories(),
  ]);

  return (
    <>
      <PageHeader
        title="Blog posts"
        description="Write, schedule and optimise articles for search."
        icon={FileText}
        breadcrumbs={[{ label: "Blog posts" }]}
        actions={
          <Button asChild variant="brand" className="group rounded-xl">
            <Link href="/admin/posts/new">
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Plus className="transition-transform duration-200 group-hover:rotate-90" /> New post
            </Link>
          </Button>
        }
      />
      <PostsView
        posts={result.posts}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        categories={categories}
        filters={{ q, status, category }}
      />
    </>
  );
}
