"use client";

import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  SquareCode,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MediaPickerDialog } from "@/components/admin/media/MediaPickerDialog";
import { readingTime, wordCount } from "@/lib/format";
import { cn } from "@/lib/utils";

const CONTENT_CLASS = cn(
  "tiptap prose prose-sm sm:prose-base max-w-none px-5 py-5 sm:px-8 sm:py-7 focus:outline-none",
  "prose-headings:font-display prose-headings:tracking-tight prose-headings:text-foreground",
  "prose-p:text-foreground/85 prose-li:text-foreground/85 prose-a:text-brand prose-a:underline-offset-4",
  "prose-strong:text-foreground prose-em:text-foreground/90",
  "prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:font-normal prose-code:text-brand prose-code:before:content-none prose-code:after:content-none",
  "prose-pre:rounded-xl prose-pre:border prose-pre:bg-muted prose-pre:text-foreground [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-foreground",
  "prose-blockquote:border-l-brand prose-blockquote:text-foreground/80 prose-hr:border-border prose-img:rounded-xl",
  "[&_li::marker]:text-muted-foreground prose-th:text-foreground prose-td:text-foreground/85"
);

function useModLabel() {
  const [mod, setMod] = React.useState("Ctrl+");
  React.useEffect(() => {
    if (/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)) setMod("⌘");
  }, []);
  return mod;
}

function normalizeHref(value) {
  const href = value.trim();
  if (!href) return "";
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(href)) return href;
  return `https://${href}`;
}

function ToolbarToggle({ icon: Icon, label, shortcut, pressed, onPressedChange, disabled }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle size="sm" pressed={pressed} onPressedChange={onPressedChange} aria-label={label} disabled={disabled}>
          <Icon />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>
        {label}
        {shortcut && <kbd className="ml-2 font-mono text-[10px] text-muted-foreground">{shortcut}</kbd>}
      </TooltipContent>
    </Tooltip>
  );
}

function ToolbarButton({ icon: Icon, label, shortcut, onClick, disabled }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {label}
        {shortcut && <kbd className="ml-2 font-mono text-[10px] text-muted-foreground">{shortcut}</kbd>}
      </TooltipContent>
    </Tooltip>
  );
}

function LinkControl({ editor }) {
  const [open, setOpen] = React.useState(false);
  const [href, setHref] = React.useState("");
  const active = editor.isActive("link");

  function onOpenChange(next) {
    if (next) setHref(editor.getAttributes("link").href || "");
    setOpen(next);
  }

  function apply(event) {
    event?.preventDefault();
    const url = normalizeHref(href);
    const chain = editor.chain().focus().extendMarkRange("link");
    if (!url) chain.unsetLink().run();
    else chain.setLink({ href: url }).run();
    setOpen(false);
  }

  function remove() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Toggle size="sm" pressed={active} aria-label="Link">
              <Link2 />
            </Toggle>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Link</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-80">
        <form onSubmit={apply} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="rte-link" className="text-[13px]">
              Link URL
            </Label>
            <Input
              id="rte-link"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="https://… or /blog/another-post"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">Select text first to turn it into a link.</p>
          </div>
          <div className="flex justify-end gap-2">
            {active && (
              <Button type="button" variant="ghost" size="sm" onClick={remove} className="text-destructive">
                <Unlink /> Remove
              </Button>
            )}
            <Button type="submit" size="sm">
              Apply
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Tiptap v2 editor with a toolbar. Emits HTML ("" when empty).
 * @param {{ value: string, onChange: (html: string) => void, placeholder?: string, toolbarClassName?: string, className?: string }} props
 */
export function RichTextEditor({ value = "", onChange, placeholder = "Start writing…", toolbarClassName, className }) {
  const mod = useModLabel();
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      TiptapLink.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }),
      TiptapImage,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editorProps: {
      attributes: { class: CONTENT_CLASS, "aria-label": "Post content", role: "textbox", "aria-multiline": "true" },
    },
    onUpdate: ({ editor: e }) => onChangeRef.current?.(e.isEmpty ? "" : e.getHTML()),
  });

  // Accept external resets (e.g. loading another post) without fighting the user's typing.
  React.useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if ((value || "") !== current) editor.commands.setContent(value || "", false);
  }, [value, editor]);

  const html = value || "";
  const words = wordCount(html);

  if (!editor) {
    return (
      <div className={cn("overflow-hidden rounded-2xl border bg-card", className)}>
        <div className="flex gap-1 border-b p-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
        <div className="space-y-3 p-8">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const chain = () => editor.chain().focus();

  return (
    <div className={cn("rounded-2xl border bg-card", className)}>
      <div
        role="toolbar"
        aria-label="Formatting"
        className={cn(
          "sticky top-16 z-10 flex flex-wrap items-center gap-0.5 rounded-t-2xl border-b bg-card/95 p-2 backdrop-blur",
          toolbarClassName
        )}
      >
        <ToolbarToggle icon={Bold} label="Bold" shortcut={`${mod}B`} pressed={editor.isActive("bold")} onPressedChange={() => chain().toggleBold().run()} />
        <ToolbarToggle icon={Italic} label="Italic" shortcut={`${mod}I`} pressed={editor.isActive("italic")} onPressedChange={() => chain().toggleItalic().run()} />
        <ToolbarToggle icon={UnderlineIcon} label="Underline" shortcut={`${mod}U`} pressed={editor.isActive("underline")} onPressedChange={() => chain().toggleUnderline().run()} />
        <ToolbarToggle icon={Strikethrough} label="Strikethrough" pressed={editor.isActive("strike")} onPressedChange={() => chain().toggleStrike().run()} />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarToggle icon={Heading2} label="Heading 2" pressed={editor.isActive("heading", { level: 2 })} onPressedChange={() => chain().toggleHeading({ level: 2 }).run()} />
        <ToolbarToggle icon={Heading3} label="Heading 3" pressed={editor.isActive("heading", { level: 3 })} onPressedChange={() => chain().toggleHeading({ level: 3 }).run()} />
        <ToolbarToggle icon={Heading4} label="Heading 4" pressed={editor.isActive("heading", { level: 4 })} onPressedChange={() => chain().toggleHeading({ level: 4 }).run()} />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarToggle icon={List} label="Bulleted list" pressed={editor.isActive("bulletList")} onPressedChange={() => chain().toggleBulletList().run()} />
        <ToolbarToggle icon={ListOrdered} label="Numbered list" pressed={editor.isActive("orderedList")} onPressedChange={() => chain().toggleOrderedList().run()} />
        <ToolbarToggle icon={Quote} label="Quote" pressed={editor.isActive("blockquote")} onPressedChange={() => chain().toggleBlockquote().run()} />
        <ToolbarToggle icon={Code} label="Inline code" shortcut={`${mod}E`} pressed={editor.isActive("code")} onPressedChange={() => chain().toggleCode().run()} />
        <ToolbarToggle icon={SquareCode} label="Code block" pressed={editor.isActive("codeBlock")} onPressedChange={() => chain().toggleCodeBlock().run()} />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <LinkControl editor={editor} />
        <ToolbarButton icon={ImagePlus} label="Insert image" onClick={() => setPickerOpen(true)} />
        <ToolbarButton icon={Minus} label="Horizontal rule" onClick={() => chain().setHorizontalRule().run()} />
        <div className="ml-auto flex items-center gap-0.5">
          <ToolbarButton icon={Undo2} label="Undo" shortcut={`${mod}Z`} onClick={() => chain().undo().run()} disabled={!editor.can().undo()} />
          <ToolbarButton icon={Redo2} label="Redo" shortcut={`${mod}⇧Z`} onClick={() => chain().redo().run()} disabled={!editor.can().redo()} />
        </div>
      </div>

      <EditorContent editor={editor} />

      <div className="flex items-center justify-between gap-3 rounded-b-2xl border-t bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">{words.toLocaleString("en-US")}</span> words ·{" "}
          {words ? readingTime(html) : 0} min read
        </span>
        <span className="hidden sm:inline">Tip: paste a link onto selected text to linkify it</span>
      </div>

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        title="Insert image"
        onSelect={({ url, alt }) => chain().setImage({ src: url, alt: alt || "" }).run()}
      />
    </div>
  );
}
