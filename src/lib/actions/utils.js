import "server-only";

/** Wrap a server action body so it always resolves to { ok, data | error }. */
export async function run(fn) {
  try {
    const data = await fn();
    return { ok: true, data: data ?? null };
  } catch (error) {
    const message = friendlyError(error);
    if (process.env.NODE_ENV !== "production") console.error("[action]", error);
    return { ok: false, error: message };
  }
}

function friendlyError(error) {
  const msg = error?.message || "Something went wrong.";
  if (error?.code === "23505" || /duplicate key/i.test(msg)) {
    if (/slug/i.test(msg)) return "That URL slug is already in use — pick another one.";
    return "That record already exists.";
  }
  if (/row-level security/i.test(msg)) return "You don't have permission to do that.";
  return msg;
}

/** Throw a Supabase error so `run` can format it. */
export function check({ data, error }) {
  if (error) {
    const err = new Error(error.message);
    err.code = error.code;
    throw err;
  }
  return data;
}

export const str = (value, max = 500) => {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s ? s.slice(0, max) : null;
};

export const strArray = (value, { max = 30, maxLen = 80 } = {}) => {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const out = [];
  for (const item of value) {
    const s = String(item || "").trim().slice(0, maxLen);
    const key = s.toLowerCase();
    if (s && !seen.has(key)) {
      seen.add(key);
      out.push(s);
    }
    if (out.length >= max) break;
  }
  return out;
};

export const bool = (value) => value === true || value === "true" || value === "on";

export const url = (value) => {
  const s = str(value, 2048);
  if (!s) return null;
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  throw new Error(`"${s}" is not a valid URL. Use a full https:// link or a path starting with /.`);
};
