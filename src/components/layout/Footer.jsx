import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { site, offices, socials } from "@/data/site";
import { footerNav } from "@/data/navigation";
import { getIcon } from "@/lib/icons";
import { Logo } from "@/components/shared/Logo";
import { Container } from "@/components/shared/Container";

export function Footer() {
  const year = 2026;

  return (
    <footer className="border-t border-border bg-background">
      {/* CTA strip */}
      <Container className="border-b border-border py-14">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="eyebrow mb-3">
              <span className="h-px w-6 bg-accent" aria-hidden /> Let&apos;s build together
            </p>
            <h2 className="heading-xl max-w-2xl text-3xl text-foreground sm:text-4xl">
              Ready to create digital experiences that drive infinite results?
            </h2>
          </div>
          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-2 bg-accent px-7 py-4 text-sm font-semibold text-accent-foreground shadow-glow transition-transform hover:scale-[1.02]"
          >
            Start a project
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </Container>

      {/* Columns */}
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <Logo withTagline />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A prominent web design & development company crafting creative,
              result-oriented digital solutions since {site.foundedYear}.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <FooterColumn className="lg:col-span-2" title={footerNav.services.title} links={footerNav.services.links} />

          {/* Company */}
          <FooterColumn className="lg:col-span-2" title={footerNav.company.title} links={footerNav.company.links} />

          {/* Offices */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
              Our Offices
            </p>
            <ul className="space-y-5">
              {offices.map((office) => (
                <li key={office.id} className="text-sm">
                  <p className="font-medium text-foreground">
                    {office.flag} {office.label}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {office.role}
                    </span>
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-muted-foreground">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    <span>{office.address}</span>
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent"
              >
                <Mail className="h-3.5 w-3.5 text-accent" /> {site.email}
              </a>
              <a
                href={`tel:${site.phonePrimary.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent"
              >
                <Phone className="h-3.5 w-3.5 text-accent" /> {site.phonePrimary}
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="/" className="transition-colors hover:text-accent">
              Terms &amp; Conditions
            </Link>
            <span className="hidden sm:inline">{site.hours}</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, className }) {
  return (
    <div className={className}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
        {title}
      </p>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
