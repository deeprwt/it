/**
 * Creates the Snowdox database: runs supabase/schema.sql then supabase/seed.sql.
 *
 *   npm run db:setup            → schema + seed
 *   npm run db:setup -- --schema-only
 *   npm run db:setup -- --confirm you@example.com   (also confirms that login's email)
 *
 * Needs DATABASE_URL in .env.local — Supabase → Project Settings → Database →
 * Connection string → "Session pooler" URI (with your database password).
 * Both SQL files are idempotent, so running this again is safe.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";

function loadEnv(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv(resolve(".env.local"));
loadEnv(resolve(".env"));

const url = process.env.DATABASE_URL;
if (!url || url.includes("[YOUR-PASSWORD]")) {
  console.error(
    "✗ DATABASE_URL is missing.\n  Add it to .env.local — Supabase → Project Settings → Database → Connection string → Session pooler."
  );
  process.exit(1);
}

const files = ["supabase/schema.sql", ...(process.argv.includes("--schema-only") ? [] : ["supabase/seed.sql"])];
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  const { rows } = await client.query("select current_database() as db, version() as v");
  console.log(`✓ connected to ${rows[0].db} (${rows[0].v.split(" ").slice(0, 2).join(" ")})`);

  for (const file of files) {
    const sql = readFileSync(resolve(file), "utf8");
    const started = Date.now();
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("commit");
      console.log(`✓ ${file} applied in ${Date.now() - started}ms`);
    } catch (err) {
      await client.query("rollback");
      throw new Error(`${file}: ${err.message}${err.position ? ` (at character ${err.position})` : ""}`);
    }
  }

  // Optional: mark one account's email as confirmed (skips the confirmation email).
  const ci = process.argv.indexOf("--confirm");
  if (ci > -1 && process.argv[ci + 1]) {
    const email = process.argv[ci + 1].toLowerCase();
    const res = await client.query(
      "update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now()) where lower(email) = $1 returning id",
      [email]
    );
    console.log(res.rowCount ? `✓ confirmed ${email}` : `✗ no account found for ${email}`);
  }

  // Ask PostgREST to pick up the new tables immediately.
  await client.query("notify pgrst, 'reload schema'");

  const check = await client.query(`
    select
      (select count(*) from information_schema.tables where table_schema = 'public'
         and table_name in ('profiles','categories','posts','page_seo','site_settings','media','leads')) as tables,
      (select count(*) from storage.buckets where id = 'media') as bucket,
      (select count(*) from public.page_seo) as pages,
      (select count(*) from public.posts) as posts,
      (select count(*) from public.categories) as categories,
      (select count(*) from public.profiles where role = 'admin') as admins`);
  const c = check.rows[0];
  console.log(`✓ ${c.tables}/7 tables · media bucket: ${c.bucket === "1" ? "yes" : "no"} · ${c.pages} page SEO rows · ${c.posts} posts · ${c.categories} categories · ${c.admins} admin(s)`);
  if (c.admins === "0") console.log("→ Next: create your login in Supabase → Authentication → Users (the first account becomes admin).");
} catch (err) {
  console.error("✗", err.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
