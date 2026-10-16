"use server";

import { requireStaff } from "@/lib/auth";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import { run, check, str } from "./utils";

/**
 * Files are uploaded straight from the browser to Supabase Storage (see
 * components/admin/media/upload.js); this records the upload in the
 * `media` table so it shows up in the library.
 */
export async function registerMedia(input) {
  return run(async () => {
    const { supabase, user } = await requireStaff();
    const path = str(input?.path, 500);
    if (!path) throw new Error("Missing file path.");
    const { data: pub } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

    return check(
      await supabase
        .from("media")
        .insert({
          path,
          url: pub.publicUrl,
          name: str(input?.name, 250),
          alt: str(input?.alt, 250),
          mime_type: str(input?.mime_type, 100),
          size: Number(input?.size) || null,
          width: Number(input?.width) || null,
          height: Number(input?.height) || null,
          uploaded_by: user.id,
        })
        .select()
        .single()
    );
  });
}

export async function updateMediaAlt(id, alt) {
  return run(async () => {
    const { supabase } = await requireStaff();
    return check(await supabase.from("media").update({ alt: str(alt, 250) }).eq("id", id).select().single());
  });
}

export async function deleteMedia(id) {
  return run(async () => {
    const { supabase } = await requireStaff();
    const item = check(await supabase.from("media").select("path").eq("id", id).single());
    const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([item.path]);
    if (error) throw new Error(error.message);
    check(await supabase.from("media").delete().eq("id", id));
    return { id };
  });
}
