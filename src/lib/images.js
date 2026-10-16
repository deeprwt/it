/**
 * next/image only optimises hosts listed in next.config.mjs. Anything else
 * (e.g. an OG image URL pasted from another site) must be rendered
 * `unoptimized`, otherwise next/image throws at runtime.
 */
const OPTIMIZABLE_HOSTS = [/\.supabase\.co$/i, /\.supabase\.in$/i, /^images\.unsplash\.com$/i];

export function isOptimizable(src) {
  if (!src || typeof src !== "string") return false;
  if (src.startsWith("/")) return !src.startsWith("//");
  try {
    const { protocol, hostname } = new URL(src);
    return protocol === "https:" && OPTIMIZABLE_HOSTS.some((re) => re.test(hostname));
  } catch {
    return false;
  }
}
