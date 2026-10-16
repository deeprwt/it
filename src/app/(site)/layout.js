import Script from "next/script";
import { Header } from "@/components/site/layout/Header";
import { Footer } from "@/components/site/layout/Footer";
import { getSiteSettings } from "@/lib/cms";

export default async function SiteLayout({ children }) {
  const settings = await getSiteSettings();
  const gaId = settings.googleAnalyticsId;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-foreground"
      >
        Skip to content
      </a>
      <Header email={settings.email} />
      <main id="main">{children}</main>
      <Footer settings={settings} />

      {/* Film-grain texture over everything */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] bg-noise opacity-[0.035] mix-blend-overlay" />

      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
    </>
  );
}
