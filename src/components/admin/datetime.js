/** ISO string → value for <input type="datetime-local"> in the viewer's timezone. */
export function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

/** datetime-local value (viewer's timezone) → ISO string, or "" when empty/invalid. */
export function fromLocalInput(value) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

export function applyTitleTemplate(template, title) {
  if (!title) return "";
  return (template || "%s").includes("%s") ? template.replace("%s", title) : title;
}
