"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { FolderPlus, FolderTree, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CharCounter } from "@/components/admin/CharCounter";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { FormField } from "@/components/admin/FormField";
import { deleteCategory, saveCategory } from "@/lib/actions/posts";
import { slugify } from "@/lib/format";

function CategoryDialog({ open, onOpenChange, category, onSaved }) {
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!open) return;
    setName(category?.name || "");
    setSlug(category?.slug || "");
    setDescription(category?.description || "");
    setSlugTouched(Boolean(category));
  }, [open, category]);

  function onSubmit(event) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    startTransition(async () => {
      const res = await saveCategory({ id: category?.id, name, slug: slug || slugify(name), description });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(category ? "Category updated" : "Category created");
      onOpenChange(false);
      onSaved?.();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !pending && onOpenChange(v)}>
      <DialogContent>
        <form onSubmit={onSubmit} className="grid gap-5">
          <DialogHeader>
            <DialogTitle>{category ? "Edit category" : "New category"}</DialogTitle>
            <DialogDescription>Categories group posts on the blog and help readers find related articles.</DialogDescription>
          </DialogHeader>
          <FormField id="cat-name" label="Name">
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="e.g. Engineering"
              autoFocus
            />
          </FormField>
          <FormField id="cat-slug" label="Slug" hint={slugTouched ? "Used in filter URLs." : "Generated from the name — edit to customise."}>
            <Input
              id="cat-slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
              }}
              placeholder="engineering"
              className="font-mono text-sm"
            />
          </FormField>
          <FormField id="cat-desc" label="Description" optional aside={<CharCounter value={description} max={300} min={0} />}>
            <Textarea
              id="cat-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What kind of posts live here?"
            />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              {category ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CategoriesManager({ categories, openNew = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(openNew);
  const [editing, setEditing] = React.useState(null);
  const [deleting, setDeleting] = React.useState(null);

  React.useEffect(() => {
    if (openNew) router.replace(pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = categories.filter((c) =>
    `${c.name} ${c.slug} ${c.description || ""}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  const totalPosts = categories.reduce((sum, c) => sum + c.post_count, 0);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  async function confirmDelete() {
    const res = await deleteCategory(deleting.id);
    if (!res.ok) {
      toast.error(res.error);
      return false;
    }
    toast.success("Category deleted");
    router.refresh();
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="tabular-nums">
              {categories.length}
            </Badge>
            categories · {totalPosts} categorised post{totalPosts === 1 ? "" : "s"}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {categories.length > 0 && (
              <div className="relative sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search categories…" className="pl-9" aria-label="Search categories" />
              </div>
            )}
            <Button variant="brand" onClick={openCreate} className="group rounded-xl">
              <Plus className="transition-transform duration-200 group-hover:rotate-90" /> New category
            </Button>
          </div>
        </div>

        {categories.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="No categories yet"
            description="Create a few topics like “Engineering”, “Design” or “Growth” to organise your blog."
            action={
              <Button variant="outline" size="sm" onClick={openCreate}>
                <FolderPlus /> Create the first category
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState compact icon={Search} title="No matching categories" description="Try a different search." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Posts</TableHead>
                <TableHead className="w-24 pr-5 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="pl-5">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand">
                        <FolderTree className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="font-medium text-foreground">{category.name}</span>
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="max-w-[22rem]">
                    {category.description ? (
                      <span className="line-clamp-2 text-sm text-muted-foreground">{category.description}</span>
                    ) : (
                      <span className="text-xs italic text-muted-foreground">No description</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {category.post_count > 0 ? (
                      <Link
                        href={`/admin/posts?category=${category.id}`}
                        className="font-mono text-sm tabular-nums text-foreground underline-offset-4 hover:text-brand hover:underline"
                      >
                        {category.post_count}
                      </Link>
                    ) : (
                      <span className="font-mono text-sm tabular-nums text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-5">
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit ${category.name}`}
                            onClick={() => {
                              setEditing(category);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            aria-label={`Delete ${category.name}`}
                            onClick={() => setDeleting(category)}
                          >
                            <Trash2 />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} category={editing} onSaved={() => router.refresh()} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={`Delete “${deleting?.name || ""}”?`}
        description={
          deleting?.post_count
            ? `${deleting.post_count} post${deleting.post_count === 1 ? "" : "s"} in this category will become uncategorized. The posts themselves are not deleted.`
            : "No posts use this category. This can't be undone."
        }
        confirmLabel="Delete category"
        onConfirm={confirmDelete}
      />
    </>
  );
}
