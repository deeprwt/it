import { Images } from "lucide-react";
import { listMedia } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/PageHeader";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";

export const metadata = { title: "Media" };

export default async function MediaPage() {
  const items = await listMedia();
  return (
    <>
      <PageHeader
        title="Media library"
        description="Upload images once and reuse them across posts, pages and social cards."
        icon={Images}
        breadcrumbs={[{ label: "Media" }]}
      />
      <MediaLibrary items={items} />
    </>
  );
}
