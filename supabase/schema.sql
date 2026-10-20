-- ════════════════════════════════════════════════════════════════════
--  Snowdox CMS — Supabase schema
--  Run this once in Supabase → SQL Editor (then run seed.sql).
--  Safe to re-run: every statement is idempotent.
-- ════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Helpers ──────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Profiles (one per auth user) ─────────────────────────────────────
-- role: admin  → everything, incl. team management
--       editor → content + SEO
--       viewer → can sign in, sees "access pending"

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  role        text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- The very first account becomes admin automatically; everyone after is a viewer
-- until an admin promotes them from Dashboard → Settings → Team.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    case when exists (select 1 from public.profiles where role = 'admin') then 'viewer' else 'admin' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: accounts created before this schema ran get a profile, and if
-- there is still no admin, the oldest account is promoted.
insert into public.profiles (id, email, full_name, role)
select u.id, u.email, coalesce(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1)), 'viewer'
from auth.users u
on conflict (id) do nothing;

update public.profiles set role = 'admin'
where id = (select p.id from public.profiles p join auth.users u on u.id = p.id order by u.created_at limit 1)
  and not exists (select 1 from public.profiles where role = 'admin');

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ── Blog categories ──────────────────────────────────────────────────

create table if not exists public.categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  description  text,
  created_at   timestamptz not null default now()
);

-- ── Blog posts ───────────────────────────────────────────────────────
-- A post is live when status = 'published' AND published_at <= now(),
-- so a future published_at schedules it.

create table if not exists public.posts (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  excerpt           text,
  content           text,                 -- HTML from the dashboard editor
  cover_image       text,
  cover_image_alt   text,
  category_id       uuid references public.categories (id) on delete set null,
  tags              text[] not null default '{}',
  keywords          text[] not null default '{}',
  focus_keyword     text,
  author_name       text,
  author_id         uuid references public.profiles (id) on delete set null,
  status            text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured          boolean not null default false,
  reading_time      integer,
  published_at      timestamptz,
  -- SEO
  meta_title        text,
  meta_description  text,
  canonical_url     text,
  og_title          text,
  og_description    text,
  og_image          text,
  no_index          boolean not null default false,
  no_follow         boolean not null default false,
  views             integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists posts_status_published_idx on public.posts (status, published_at desc);
create index if not exists posts_category_idx on public.posts (category_id);

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

-- Public view counter (called from the blog post page).
create or replace function public.increment_post_views(post_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.posts
     set views = views + 1
   where slug = post_slug and status = 'published' and published_at <= now();
$$;

-- ── Per-page SEO (keyed by route path, e.g. '/', '/about') ───────────

create table if not exists public.page_seo (
  path                 text primary key,
  label                text,
  meta_title           text,
  meta_description     text,
  keywords             text[] not null default '{}',
  canonical_url        text,
  og_title             text,
  og_description       text,
  og_image             text,
  og_image_alt         text,
  twitter_card         text not null default 'summary_large_image'
                       check (twitter_card in ('summary', 'summary_large_image')),
  no_index             boolean not null default false,
  no_follow            boolean not null default false,
  json_ld              jsonb,
  include_in_sitemap   boolean not null default true,
  sitemap_priority     numeric(2, 1) not null default 0.7 check (sitemap_priority between 0 and 1),
  sitemap_changefreq   text not null default 'monthly'
                       check (sitemap_changefreq in ('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never')),
  updated_by           uuid references public.profiles (id) on delete set null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

drop trigger if exists page_seo_updated_at on public.page_seo;
create trigger page_seo_updated_at before update on public.page_seo
  for each row execute function public.set_updated_at();

-- ── Global site settings (single row, id = 1) ────────────────────────

create table if not exists public.site_settings (
  id                        integer primary key default 1 check (id = 1),
  site_name                 text not null default 'Snowdox',
  site_url                  text,
  tagline                   text,
  title_template            text not null default '%s | Snowdox',
  default_title             text,
  default_description       text,
  default_keywords          text[] not null default '{}',
  default_og_image          text,
  twitter_handle            text,
  google_site_verification  text,
  bing_site_verification    text,
  google_analytics_id       text,
  allow_indexing            boolean not null default true,
  contact_email             text,
  contact_phone             text,
  address                   text,
  socials                   jsonb not null default '{}'::jsonb,
  updated_at                timestamptz not null default now()
);

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ── Media library (files live in the `media` storage bucket) ─────────

create table if not exists public.media (
  id           uuid primary key default gen_random_uuid(),
  path         text not null unique,     -- object path inside the bucket
  url          text not null,            -- public URL
  name         text,
  alt          text,
  mime_type    text,
  size         integer,
  width        integer,
  height       integer,
  uploaded_by  uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ── Leads (contact form submissions) ─────────────────────────────────

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  company     text,
  service     text,
  budget      text,
  message     text not null,
  source      text,
  status      text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'won', 'lost', 'archived')),
  created_at  timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);

-- ════════════════════════════════════════════════════════════════════
--  Row Level Security
-- ════════════════════════════════════════════════════════════════════

alter table public.profiles      enable row level security;
alter table public.categories    enable row level security;
alter table public.posts         enable row level security;
alter table public.page_seo      enable row level security;
alter table public.site_settings enable row level security;
alter table public.media         enable row level security;
alter table public.leads         enable row level security;

-- profiles
drop policy if exists "profiles: read own or staff" on public.profiles;
create policy "profiles: read own or staff" on public.profiles
  for select using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles: update own name" on public.profiles;
create policy "profiles: update own name" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()));

drop policy if exists "profiles: admin manages" on public.profiles;
create policy "profiles: admin manages" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- categories
drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read" on public.categories for select using (true);

drop policy if exists "categories: staff write" on public.categories;
create policy "categories: staff write" on public.categories
  for all using (public.is_staff()) with check (public.is_staff());

-- posts
drop policy if exists "posts: public read published" on public.posts;
create policy "posts: public read published" on public.posts
  for select using (status = 'published' and published_at <= now());

drop policy if exists "posts: staff read all" on public.posts;
create policy "posts: staff read all" on public.posts
  for select using (public.is_staff());

drop policy if exists "posts: staff write" on public.posts;
create policy "posts: staff write" on public.posts
  for all using (public.is_staff()) with check (public.is_staff());

-- page_seo
drop policy if exists "page_seo: public read" on public.page_seo;
create policy "page_seo: public read" on public.page_seo for select using (true);

drop policy if exists "page_seo: staff write" on public.page_seo;
create policy "page_seo: staff write" on public.page_seo
  for all using (public.is_staff()) with check (public.is_staff());

-- site_settings
drop policy if exists "site_settings: public read" on public.site_settings;
create policy "site_settings: public read" on public.site_settings for select using (true);

drop policy if exists "site_settings: staff write" on public.site_settings;
create policy "site_settings: staff write" on public.site_settings
  for update using (public.is_staff()) with check (public.is_staff());

-- media
drop policy if exists "media: public read" on public.media;
create policy "media: public read" on public.media for select using (true);

drop policy if exists "media: staff write" on public.media;
create policy "media: staff write" on public.media
  for all using (public.is_staff()) with check (public.is_staff());

-- leads: anyone may submit, only staff may read / manage
drop policy if exists "leads: public insert" on public.leads;
create policy "leads: public insert" on public.leads
  for insert with check (status = 'new');

drop policy if exists "leads: staff read" on public.leads;
create policy "leads: staff read" on public.leads for select using (public.is_staff());

drop policy if exists "leads: staff update" on public.leads;
create policy "leads: staff update" on public.leads
  for update using (public.is_staff()) with check (public.is_staff());

drop policy if exists "leads: staff delete" on public.leads;
create policy "leads: staff delete" on public.leads for delete using (public.is_staff());

grant execute on function public.increment_post_views(text) to anon, authenticated;

-- ════════════════════════════════════════════════════════════════════
--  Storage — public `media` bucket, staff-only writes
-- ════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
on conflict (id) do update set public = excluded.public;

drop policy if exists "media bucket: public read" on storage.objects;
create policy "media bucket: public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media bucket: staff insert" on storage.objects;
create policy "media bucket: staff insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "media bucket: staff update" on storage.objects;
create policy "media bucket: staff update" on storage.objects
  for update using (bucket_id = 'media' and public.is_staff());

drop policy if exists "media bucket: staff delete" on storage.objects;
create policy "media bucket: staff delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_staff());
