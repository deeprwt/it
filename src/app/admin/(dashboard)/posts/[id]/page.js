import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPost, listCategories } from "@/lib/admin-data";
import { getSiteSettings } from "@/lib/cms";
import { PostEditor } from "@/components/admin/posts/PostEditor";

export const metadata = { title: "Edit post" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditPostPage({ params }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const [post, categories, settings, { profile }] = await Promise.all([
    getPost(id),
    listCategories(),
    getSiteSettings(),
    getSession(),
  ]);
  if (!post) notFound();

  return (
    <PostEditor
      key={post.id}
      post={post}
      categories={categories}
      defaultAuthor={profile?.full_name || ""}
      site={{
        siteName: settings.siteName,
        siteUrl: settings.siteUrl,
        titleTemplate: settings.titleTemplate,
        allowIndexing: settings.allowIndexing,
      }}
    />
  );
}
