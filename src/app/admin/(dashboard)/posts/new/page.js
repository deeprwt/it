import { getSession } from "@/lib/auth";
import { listCategories } from "@/lib/admin-data";
import { getSiteSettings } from "@/lib/cms";
import { PostEditor } from "@/components/admin/posts/PostEditor";

export const metadata = { title: "New post" };

export default async function NewPostPage() {
  const [{ profile }, categories, settings] = await Promise.all([getSession(), listCategories(), getSiteSettings()]);

  return (
    <PostEditor
      post={null}
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
