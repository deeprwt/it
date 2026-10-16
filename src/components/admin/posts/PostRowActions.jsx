"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Archive,
  ArchiveRestore,
  CopyPlus,
  ExternalLink,
  EyeOff,
  Loader2,
  MoreHorizontal,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { isPostLive } from "@/components/admin/StatusBadge";
import { deletePost, duplicatePost, setPostStatus } from "@/lib/actions/posts";

export function PostRowActions({ post }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const live = isPostLive(post);

  function changeStatus(status, message) {
    startTransition(async () => {
      const res = await setPostStatus(post.id, status);
      if (!res.ok) toast.error(res.error);
      else {
        toast.success(message);
        router.refresh();
      }
    });
  }

  function duplicate() {
    startTransition(async () => {
      const res = await duplicatePost(post.id);
      if (!res.ok) toast.error(res.error);
      else {
        toast.success("Post duplicated", { description: "Opening the copy as a draft." });
        router.push(`/admin/posts/${res.data.id}`);
      }
    });
  }

  async function remove() {
    const res = await deletePost(post.id);
    if (!res.ok) {
      toast.error(res.error);
      return false;
    }
    toast.success("Post deleted");
    router.refresh();
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${post.title}`} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="truncate">{post.title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/posts/${post.id}`}>
              <Pencil /> Edit
            </Link>
          </DropdownMenuItem>
          {live && (
            <DropdownMenuItem asChild>
              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink /> View live
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={duplicate}>
            <CopyPlus /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {post.status === "published" ? (
            <DropdownMenuItem onSelect={() => changeStatus("draft", "Post unpublished — it's a draft again")}>
              <EyeOff /> Unpublish
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => changeStatus("published", "Post published")}>
              <Send /> Publish
            </DropdownMenuItem>
          )}
          {post.status === "archived" ? (
            <DropdownMenuItem onSelect={() => changeStatus("draft", "Post restored as a draft")}>
              <ArchiveRestore /> Restore to draft
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => changeStatus("archived", "Post archived")}>
              <Archive /> Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setConfirmOpen(true)} className="text-destructive focus:text-destructive">
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this post?"
        description={
          <>
            “{post.title}” will be permanently removed{live ? " and its URL will stop working" : ""}. This can&apos;t be undone.
          </>
        }
        confirmLabel="Delete post"
        onConfirm={remove}
      />
    </>
  );
}
