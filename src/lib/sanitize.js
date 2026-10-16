import "server-only";
import sanitizeHtml from "sanitize-html";
import { slugify, stripHtml } from "@/lib/format";

/**
 * Cleans blog HTML from the editor before it is rendered on the public
 * site, adds anchor ids to headings and returns a table of contents.
 */
export function renderPostHtml(html = "") {
  const clean = sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "p", "br", "hr", "a", "strong", "b", "em", "i", "u", "s", "del", "mark",
      "ul", "ol", "li", "blockquote", "code", "pre", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td", "span", "sub", "sup",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
      code: ["class"],
      pre: ["class"],
      span: ["class"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href || "");
        return {
          tagName,
          attribs: external ? { ...attribs, target: "_blank", rel: "noopener noreferrer" } : attribs,
        };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy", decoding: "async" } }),
    },
  });

  const toc = [];
  const used = new Set();
  const withIds = clean.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level, inner) => {
    const text = stripHtml(inner);
    let id = slugify(text) || `section-${toc.length + 1}`;
    while (used.has(id)) id = `${id}-${used.size}`;
    used.add(id);
    toc.push({ id, text, level: Number(level) });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });

  return { html: withIds, toc };
}
