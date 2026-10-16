# Snowdox — Agency Website + SEO Dashboard

A dark, loud agency website for **Snowdox** with a Supabase-powered admin
dashboard. Blog posts, every page's SEO (meta title, description, keywords,
social images, canonical, robots, sitemap, JSON-LD) and global site settings
are edited from the dashboard. Changes go live immediately.

| Layer      | Choice                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| Framework  | Next.js 15 (App Router, JavaScript)                                     |
| Backend    | Supabase (Postgres + Auth + Storage, Row Level Security)                 |
| UI         | shadcn/ui on Radix + Tailwind CSS v3, lucide icons                       |
| Editor     | Tiptap rich-text editor                                                 |
| Charts     | Recharts (via the shadcn chart wrapper)                                 |
| Fonts      | Syne (display) · Inter (body) · JetBrains Mono (code)                    |

---

## 1. Setup

```bash
npm install
cp .env.example .env.local      # then fill in the values
npm run dev                     # http://localhost:3000
```

### Supabase (one time)

1. Create a project at [supabase.com](https://supabase.com).
2. Copy **Project URL** and the **anon / publishable key** (Project Settings → API)
   into `.env.local`.
3. Open **SQL Editor** and run, in order:
   - [`supabase/schema.sql`](supabase/schema.sql) — tables, RLS policies, storage bucket, triggers
   - [`supabase/seed.sql`](supabase/seed.sql) — page SEO defaults, categories, 3 starter posts
4. **Authentication → Users → Add user** — create your account.
   **The first account becomes `admin` automatically.** Later accounts start as
   `viewer`; promote them in Dashboard → Settings → Team.
5. Recommended: Authentication → Sign In / Providers → turn off *Allow new users to sign up*.
6. For password-reset emails, add `http://localhost:3000/admin/auth/callback`
   (and your production URL) under Authentication → URL Configuration → Redirect URLs.

Sign in at **`/admin`**.

> Without Supabase env vars the public site still runs on code defaults and
> `/admin` shows a setup screen.

---

## 2. What the dashboard manages

| Screen          | What you can do                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------- |
| **Overview**    | Publishing activity, leads per week, SEO health, issues to fix, top & recent posts                   |
| **Blog Posts**  | Write with the rich editor, cover images, categories, tags, **keywords**, focus keyword, scheduling   |
| **Post SEO**    | Meta title/description with live Google preview, OG/Twitter image & preview, canonical, noindex/nofollow, live SEO score |
| **Categories**  | Create / rename / delete blog categories                                                            |
| **Pages SEO**   | Every route (Home, Services, each service, Work, About, Blog, Careers, Contact) — meta title, description, keywords, OG image, canonical, robots, sitemap priority/frequency, custom JSON-LD |
| **Media**       | Drag-and-drop uploads to Supabase Storage, alt text, copy URL                                        |
| **Leads**       | Contact-form submissions with status pipeline + CSV export                                           |
| **Settings**    | Site name/URL, title template, default description/keywords/OG image, indexing kill-switch, socials, Google Analytics, Google/Bing verification, team roles, account |

### How SEO reaches the pages

```
Dashboard edit ──► server action ──► Supabase (RLS: admin/editor only)
                                │
                                └─► revalidateTag("seo" | "posts" | "settings")
Public page ──► generateMetadata() ──► lib/seo.js ──► lib/cms.js (cached reads)
```

Precedence for every field: **dashboard value → page's code fallback →
route registry default (`src/data/pages.js`) → global settings**. Pages without a
custom social image get an auto-generated branded card from `/api/og`.

Also generated from the database: `sitemap.xml`, `robots.txt`, `/blog/rss.xml`,
and JSON-LD (Organization, WebSite, Service, FAQ, Breadcrumb, Blog, BlogPosting).

**Adding a new page?** Add it to `src/data/pages.js` and use
`buildPageMetadata("/your-path")` in its `generateMetadata` — it instantly appears
in Dashboard → Pages SEO.

---

## 3. Project structure

```
supabase/                 schema.sql · seed.sql
src/
├── middleware.js         guards /admin (Supabase session refresh)
├── app/
│   ├── layout.js         fonts + global metadata from settings
│   ├── (site)/           public website (Header/Footer layout)
│   │   ├── page.js       home
│   │   ├── services/ · services/[slug]/ · work/ · about/ · careers/ · contact/
│   │   └── blog/ · blog/[slug]/ · blog/rss.xml/
│   ├── admin/            dashboard (login, overview, posts, seo, media, leads, settings)
│   ├── api/og/           dynamic Open Graph images
│   └── sitemap.js · robots.js · not-found.js · icon.svg
├── components/
│   ├── ui/               shadcn primitives
│   ├── admin/            dashboard components
│   ├── site/             website sections, cards, effects (animations)
│   └── brand/Logo.jsx
├── data/                 site copy: services, work, careers, navigation, page registry
└── lib/
    ├── supabase/         server / browser / public clients
    ├── actions/          server actions (posts, seo, settings, media, leads, auth)
    ├── cms.js            cached public reads
    ├── seo.js            metadata + JSON-LD builders
    ├── seo-score.js      live SEO analysis used by the editors
    └── admin-data.js     dashboard reads
```

## 4. Service pages — one design per service

Each service has its **own page layout**, not a shared template
(`src/components/site/services/pages.jsx`), with copy in `src/data/services.js`:

| Service | Hero visual | Unique sections |
| --- | --- | --- |
| Web Development | Lighthouse report in a browser | Performance budget + code, comparison table |
| UI/UX & Product Design | Figma-style canvas with live cursor | Design-system showcase, design principles |
| Mobile App Development | iOS + Android phones with push toast | Built-in features grid, cross-platform vs native table |
| AI & Automation | Support agent answering with sources | Workflow diagram, use cases by team, guardrails checklist |
| E-commerce Development | Product page + cart drawer | Conversion funnel |
| SEO Services | Google results where your site climbs to #1 | KPIs, sample monthly report (chart + keyword table), audit scores |

Shared blocks (sub-services grid, process, tools tabs, industries, FAQ) live in
`services/blocks.jsx`. White sections use `<LightSection>`, which flips the theme
tokens locally, so any token-based component renders correctly on white.
Technology logos come from `simple-icons` and are server-rendered
(`src/components/site/tech/registry.js`).

## 5. Motion & effects (`src/components/site/effects`)

- **CodeSnow** — code glyphs falling like snow, depth-layered, pushed away by the cursor
- **ScrambleText** — text "decodes" from random glyphs (hero, eyebrows, nav hover)
- **TypingTerminal** — hero terminal that types and deploys on loop
- **TerminalPlayground** — an interactive shell (`help`, `services`, `cd blog`, `sudo hire snowdox`)
- **ScrollWords** — manifesto words light up as you scroll
- **Spotlight** cards, **Magnetic** buttons, **Counter**, **Marquee**, git-log process timeline,
  glitch footer wordmark, reading-progress bar

All effects pause off-screen and respect `prefers-reduced-motion`.

## 6. Before launch — content to replace

`src/data/work.js` (case studies), `src/data/site.js` (`stats`, socials, email),
and `src/data/careers.js` contain **placeholder content**. Replace them with real
projects and numbers.

The previous site's files were moved to `_legacy/` (not part of the build) —
delete that folder once you no longer need it.
