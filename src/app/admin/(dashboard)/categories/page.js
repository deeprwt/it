import { FolderTree } from "lucide-react";
import { listCategories } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/PageHeader";
import { CategoriesManager } from "@/components/admin/categories/CategoriesManager";

export const metadata = { title: "Categories" };

export default async function CategoriesPage({ searchParams }) {
  const [params, categories] = await Promise.all([searchParams, listCategories()]);
  return (
    <>
      <PageHeader
        title="Categories"
        description="Group blog posts into topics. Each category gets its own filter on the blog."
        icon={FolderTree}
        breadcrumbs={[{ label: "Blog posts", href: "/admin/posts" }, { label: "Categories" }]}
      />
      <CategoriesManager categories={categories} openNew={params?.new === "1"} />
    </>
  );
}
