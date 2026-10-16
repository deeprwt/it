"use client";

import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import { registerMedia } from "@/lib/actions/media";
import { slugify } from "@/lib/format";

export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "image/avif"];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function readDimensions(file) {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return resolve({});
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(src);
    };
    img.onerror = () => {
      resolve({});
      URL.revokeObjectURL(src);
    };
    img.src = src;
  });
}

/**
 * Upload one image to Supabase Storage and register it in the media library.
 * @param {File} file
 * @param {{ alt?: string }} [options]
 * @returns {Promise<{ id: string, url: string, path: string, alt: string | null }>} the media row
 */
export async function uploadImage(file, { alt } = {}) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) throw new Error(`${file.name}: unsupported file type.`);
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(`${file.name}: larger than 10 MB.`);

  const supabase = createClient();
  const now = new Date();
  const ext = (file.name.split(".").pop() || "img").toLowerCase();
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const path = `uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${base}-${crypto
    .randomUUID()
    .slice(0, 8)}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`${file.name}: ${error.message}`);

  const dims = await readDimensions(file);
  const result = await registerMedia({
    path,
    name: file.name,
    alt: alt || null,
    mime_type: file.type,
    size: file.size,
    ...dims,
  });
  if (!result.ok) throw new Error(result.error);
  return result.data;
}
