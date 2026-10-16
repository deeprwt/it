import { services, serviceMetaTitle } from "@/data/services";

/**
 * Registry of every public route. The dashboard's "Pages SEO" screen lists
 * these, and each route's metadata falls back to the defaults below when no
 * row exists in the `page_seo` table yet.
 *
 * Add a new page here and it instantly becomes editable from the dashboard.
 */
export const staticPages = [
  {
    path: "/",
    label: "Home",
    group: "Main",
    title: "Snowdox — Design & Engineering Agency",
    description:
      "Snowdox builds blazing-fast websites, digital products and AI tools for brands that refuse to blend in. Design, engineering and growth under one roof.",
    priority: 1,
    changefreq: "weekly",
  },
  {
    path: "/services",
    label: "Services",
    group: "Main",
    title: "Services — Web, Product, AI & Growth",
    description:
      "Web engineering, product design, mobile apps, AI automation, commerce and SEO — everything you need to launch and grow, from one accountable team.",
    priority: 0.9,
    changefreq: "monthly",
  },
  ...services.map((s) => ({
    path: `/services/${s.slug}`,
    label: s.title,
    group: "Services",
    title: serviceMetaTitle(s),
    description: s.short,
    priority: 0.8,
    changefreq: "monthly",
  })),
  {
    path: "/work",
    label: "Work",
    group: "Main",
    title: "Work — Selected Projects",
    description: "Selected websites, products and AI tools designed and engineered by Snowdox.",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/about",
    label: "About",
    group: "Main",
    title: "About — The Studio Behind the Code",
    description:
      "Snowdox is a crew of designers and engineers obsessed with speed, craft and results. Meet the studio and how we work.",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/blog",
    label: "Blog",
    group: "Main",
    title: "Blog — Notes on Code, Design & Growth",
    description: "Practical articles on web engineering, product design, AI and SEO from the Snowdox team.",
    priority: 0.8,
    changefreq: "daily",
  },
  {
    path: "/careers",
    label: "Careers",
    group: "Main",
    title: "Careers — Join the Crew",
    description: "Remote-first roles for engineers, designers and growth specialists who love shipping great work.",
    priority: 0.5,
    changefreq: "monthly",
  },
  {
    path: "/contact",
    label: "Contact",
    group: "Main",
    title: "Contact — Start a Project",
    description: "Tell us about your project. We reply within one business day with next steps and a clear plan.",
    priority: 0.7,
    changefreq: "yearly",
  },
];

export const pageByPath = Object.fromEntries(staticPages.map((p) => [p.path, p]));
