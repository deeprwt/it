-- ═══ Snowdox: complete setup (schema + seed + confirm admin login) ═══
-- Paste this whole file into Supabase → SQL Editor → Run. Safe to run more than once.

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


-- ════════════════════════════════════════════════════════════════════
--  Snowdox CMS — starter content. Run after schema.sql.
--  Idempotent: re-running never overwrites edits made in the dashboard.
-- ════════════════════════════════════════════════════════════════════

-- ── Global settings ─────────────────────────────────────────────────
update public.site_settings set
  site_name           = coalesce(site_name, 'Snowdox'),
  tagline             = coalesce(tagline, 'We code brands that move.'),
  title_template      = coalesce(title_template, '%s | Snowdox'),
  default_title       = coalesce(default_title, 'Snowdox — Design & Engineering Agency'),
  default_description = coalesce(default_description, 'Snowdox is a design & engineering agency building fast websites, digital products and AI-powered tools for brands that refuse to blend in.'),
  default_keywords    = case when cardinality(default_keywords) = 0
                          then array['web development agency','Next.js development','UI UX design agency','AI automation agency','SEO agency','Snowdox']
                          else default_keywords end,
  contact_email       = coalesce(contact_email, 'hello@snowdox.com'),
  address             = coalesce(address, 'Remote-first · Working worldwide'),
  socials             = case when socials = '{}'::jsonb
                          then '{"linkedin":"https://www.linkedin.com/company/snowdox","github":"https://github.com/snowdox","x":"https://x.com/snowdox","instagram":"https://www.instagram.com/snowdox"}'::jsonb
                          else socials end
where id = 1;

-- ── Page SEO for every public route ─────────────────────────────────
insert into public.page_seo (path, label, meta_title, meta_description, keywords, sitemap_priority, sitemap_changefreq) values
  ('/', 'Home',
   'Snowdox — Design & Engineering Agency for Bold Brands',
   'Snowdox builds blazing-fast websites, digital products and AI tools for brands that refuse to blend in. Design, engineering and growth under one roof.',
   array['design agency','web development agency','Next.js agency','product design studio','AI automation'], 1.0, 'weekly'),
  ('/services', 'Services',
   'Services — Web, Product, AI & Growth | Snowdox',
   'Web engineering, product design, mobile apps, AI automation, commerce and SEO — everything you need to launch and grow, from one accountable team.',
   array['web development services','UI UX design services','mobile app development','AI development','SEO services'], 0.9, 'monthly'),
  ('/services/web-development', 'Web Development',
   'Web Development Agency — Fast Next.js Websites | Snowdox',
   'High-performance websites and web apps built on Next.js — server-rendered, accessible, SEO-ready and edited through a headless CMS your team will love.',
   array['web development agency','Next.js development','headless CMS','website redesign','Core Web Vitals'], 0.8, 'monthly'),
  ('/services/product-design', 'UI/UX & Product Design',
   'Product Design & UI/UX Agency | Snowdox',
   'UX research, prototypes, design systems and brand identities that make people stop scrolling — designed in Figma and shipped in code.',
   array['UI UX design agency','product design','design systems','branding agency','Figma design'], 0.8, 'monthly'),
  ('/services/mobile-apps', 'Mobile App Development',
   'Mobile App Development — iOS & Android | Snowdox',
   'Cross-platform iOS and Android apps with React Native and Flutter: offline-ready, smooth at 60fps and wired to payments, analytics and your backend.',
   array['mobile app development','React Native agency','Flutter development','iOS app development','Android app development'], 0.8, 'monthly'),
  ('/services/ai-automation', 'AI & Automation',
   'AI Agents & Automation Agency | Snowdox',
   'LLM copilots, AI support agents, RAG search and workflow automation with guardrails, evaluations and measurable ROI.',
   array['AI agent development','AI automation agency','RAG development','LLM integration','chatbot development'], 0.8, 'monthly'),
  ('/services/ecommerce', 'E-commerce Development',
   'Shopify & Headless Commerce Development | Snowdox',
   'Shopify, Shopify Plus and headless storefronts engineered for speed and conversion — with subscriptions, integrations and CRO built in.',
   array['Shopify development','headless commerce','ecommerce development','Shopify Plus agency','conversion rate optimisation'], 0.8, 'monthly'),
  ('/services/seo-growth', 'SEO Services',
   'SEO Agency — Technical SEO & Content Growth | Snowdox',
   'Technical SEO, content strategy, schema markup and CRO that compound month after month — with transparent reporting tied to revenue.',
   array['SEO agency','technical SEO','content marketing','programmatic SEO','conversion optimisation'], 0.8, 'monthly'),
  ('/work', 'Work',
   'Our Work — Websites, Products & AI Tools | Snowdox',
   'Selected websites, digital products and AI tools designed, engineered and grown by the Snowdox studio.',
   array['agency portfolio','case studies','web design portfolio'], 0.8, 'monthly'),
  ('/about', 'About',
   'About Snowdox — The Studio Behind the Code',
   'Snowdox is a crew of designers and engineers obsessed with speed, craft and results. Meet the studio and learn how we work.',
   array['about Snowdox','design and engineering studio','remote agency'], 0.7, 'monthly'),
  ('/blog', 'Blog',
   'Snowdox Blog — Notes on Code, Design & Growth',
   'Practical articles on web engineering, product design, AI and SEO from the people shipping it every week at Snowdox.',
   array['web development blog','design blog','SEO tips','AI engineering'], 0.8, 'daily'),
  ('/careers', 'Careers',
   'Careers at Snowdox — Remote Design & Engineering Jobs',
   'Remote-first roles for engineers, designers and growth specialists who love shipping great work. See open positions at Snowdox.',
   array['remote developer jobs','design jobs','agency careers'], 0.5, 'monthly'),
  ('/contact', 'Contact',
   'Contact Snowdox — Start Your Project',
   'Tell us about your project. We reply within one business day with next steps, a timeline and a clear plan.',
   array['hire a web agency','contact Snowdox','start a project'], 0.7, 'yearly')
on conflict (path) do nothing;

-- ── Blog categories ─────────────────────────────────────────────────
insert into public.categories (name, slug, description) values
  ('Engineering', 'engineering', 'Web performance, architecture and the code behind great products.'),
  ('Design', 'design', 'Interfaces, systems and brand thinking.'),
  ('AI', 'ai', 'Practical AI for products and operations.'),
  ('SEO & Growth', 'seo-growth', 'Getting found, getting clicked, getting chosen.')
on conflict (slug) do nothing;

-- ── Starter posts ───────────────────────────────────────────────────
insert into public.posts (
  title, slug, excerpt, content, category_id, tags, keywords, focus_keyword, author_name,
  status, featured, reading_time, published_at, meta_title, meta_description
) values
(
  'Why your website should load in under a second',
  'website-load-under-one-second',
  'Speed is the most underrated conversion lever on the web. Here is how we budget for it, measure it and ship sub-second pages by default.',
  '<p>Website speed is not a technical vanity metric — it is a revenue lever. Every extra second a visitor waits is a second they spend reconsidering. In this article we break down how we make a <strong>website load in under a second</strong> without sacrificing a bold design.</p>
<h2>Start with a performance budget</h2>
<p>Before a single component is built, we agree on a budget: under 170&nbsp;KB of JavaScript on the critical path, a Largest Contentful Paint below 1.2&nbsp;seconds on a mid-range phone, and zero layout shift. A budget turns "make it fast" into a constraint the whole team can design around.</p>
<h2>Render on the server, hydrate only what moves</h2>
<p>Modern frameworks like <a href="https://nextjs.org">Next.js</a> let you stream HTML from the server and ship JavaScript only for interactive islands. Marketing pages rarely need much client code — navigation, a form and a few animations.</p>
<ul><li>Use server components for content-heavy sections.</li><li>Lazy-load anything below the fold.</li><li>Prefer CSS animations over JavaScript where possible.</li></ul>
<h2>Images are usually the culprit</h2>
<p>Serve modern formats (AVIF/WebP), size images to their container and always set explicit dimensions. A single unoptimised hero image can cost more than your entire JavaScript bundle.</p>
<h3>Fonts count too</h3>
<p>Self-host fonts, subset them and use <code>font-display: swap</code>. Two families with three weights is plenty for most brands.</p>
<h2>Measure in the field, not just the lab</h2>
<p>Lighthouse is a great smoke test, but real users are the truth. Track Core Web Vitals from real sessions and review them every sprint. If you want help hitting sub-second loads, <a href="/contact">talk to us</a>.</p>',
  (select id from public.categories where slug = 'engineering'),
  array['performance','nextjs','core web vitals'],
  array['website speed','page load time','core web vitals','Next.js performance','LCP'],
  'website load',
  'Snowdox Team', 'published', true, 3, now() - interval '2 days',
  'Why Your Website Should Load in Under a Second | Snowdox',
  'Speed is the most underrated conversion lever. Learn how to budget, measure and ship pages so your website loads in under a second — without boring design.'
),
(
  'Design systems that survive contact with engineering',
  'design-systems-that-survive-engineering',
  'A design system is only as good as the code that implements it. Here is how we keep Figma and production in sync from day one.',
  '<p>Most <strong>design systems</strong> die quietly: a beautiful Figma library that nobody in engineering actually uses. The fix is not more documentation — it is building the system in design and code at the same time.</p>
<h2>Tokens first, components second</h2>
<p>Colour, spacing, radius, type and motion live as tokens shared by Figma and the codebase. When the brand evolves, you change a token once and both worlds update.</p>
<h2>Design the states, not just the screens</h2>
<p>Loading, empty, error, disabled, hover, focus — every component needs every state designed. Engineers should never have to guess.</p>
<ul><li>Document each component with real content, not lorem ipsum.</li><li>Ship accessible defaults: focus rings, contrast, keyboard support.</li><li>Version the system like any other package.</li></ul>
<h2>Make it the easy path</h2>
<p>If using the system is slower than hand-rolling a component, people will hand-roll. Good systems are fast to adopt and pleasant to use. Want one for your product? <a href="/services/product-design">See our design services</a>.</p>',
  (select id from public.categories where slug = 'design'),
  array['design systems','figma','ui'],
  array['design systems','design tokens','component library','Figma to code','UI consistency'],
  'design systems',
  'Snowdox Team', 'published', false, 2, now() - interval '9 days',
  'Design Systems That Survive Contact With Engineering | Snowdox',
  'How to build design systems engineers actually use: shared tokens, fully designed states and a component library that stays in sync with Figma.'
),
(
  'How we build AI support agents that do not make things up',
  'ai-support-agents-without-hallucinations',
  'Retrieval, guardrails and evaluations: the unglamorous engineering that turns a chatbot demo into an AI support agent you can trust with customers.',
  '<p>Anyone can wire a chatbot to a language model in an afternoon. Building an <strong>AI support agent</strong> you can put in front of real customers takes a lot more engineering. Here is our playbook.</p>
<h2>Ground every answer in your own content</h2>
<p>We use retrieval-augmented generation (RAG): the agent searches your help centre, docs and policies, then answers only from what it found — with citations. No source, no answer.</p>
<h2>Guardrails before go-live</h2>
<ul><li>Redact personal data before it reaches the model.</li><li>Restrict which tools the agent may call, and when.</li><li>Escalate to a human whenever confidence is low.</li></ul>
<h2>Evaluate like you mean it</h2>
<p>We build a test set of real questions with expected answers and run it on every change: accuracy, tone, latency and cost per conversation. If a prompt tweak makes things worse, we know before customers do.</p>
<h3>Start small, then expand</h3>
<p>Launch on one channel and a narrow set of topics, measure, then widen the scope. Curious what an agent could handle for your team? <a href="/services/ai-automation">Explore AI &amp; automation</a>.</p>',
  (select id from public.categories where slug = 'ai'),
  array['ai','llm','rag'],
  array['AI support agent','RAG','LLM guardrails','AI customer support','AI evaluation'],
  'AI support agent',
  'Snowdox Team', 'published', false, 2, now() - interval '16 days',
  'How We Build AI Support Agents That Don''t Hallucinate | Snowdox',
  'Retrieval, guardrails and evaluations: the engineering that turns a chatbot demo into an AI support agent you can safely put in front of customers.'
)
on conflict (slug) do nothing;

-- ── Confirm the dashboard login's email (no confirmation link needed) ──
update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now())
where lower(email) = 'cravekart01@gmail.com';

notify pgrst, 'reload schema';

-- Check: should return 7 tables, 1 bucket, 1 admin
select
  (select count(*) from information_schema.tables where table_schema='public' and table_name in ('profiles','categories','posts','page_seo','site_settings','media','leads')) as tables,
  (select count(*) from storage.buckets where id='media') as media_bucket,
  (select string_agg(email || ' = ' || role, ', ') from public.profiles) as accounts,
  (select count(*) from public.posts) as posts;
