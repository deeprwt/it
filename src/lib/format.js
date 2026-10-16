/** Pure helpers — safe on both server and client. */

export function slugify(input = "") {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function stripHtml(html = "") {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function wordCount(html = "") {
  const text = stripHtml(html);
  return text ? text.split(" ").length : 0;
}

/** Minutes to read at ~225 wpm (minimum 1). */
export function readingTime(html = "") {
  return Math.max(1, Math.round(wordCount(html) / 225));
}

export function truncate(text = "", max = 160) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/** Formats in UTC so server and browser render identical strings (no hydration mismatch). */
export function formatDate(value, options = { month: "short", day: "numeric", year: "numeric" }) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { timeZone: "UTC", ...options });
}

export function formatRelative(value) {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const abs = Math.abs(diff);
  const units = [
    ["year", 31536e6],
    ["month", 2592e6],
    ["week", 6048e5],
    ["day", 864e5],
    ["hour", 36e5],
    ["minute", 6e4],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, ms] of units) {
    if (abs >= ms) return rtf.format(Math.round(-diff / ms), unit);
  }
  return "just now";
}

export function formatBytes(bytes = 0) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${units[i]}`;
}

export function initials(name = "") {
  return (
    name
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("") || "?"
  );
}
