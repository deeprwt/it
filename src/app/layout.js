import { Inter, Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/cms";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Brand typeface (from the Snowdox brand guide): Montserrat for headings.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

function safeUrl(value) {
  try {
    return new URL(value);
  } catch {
    return new URL("http://localhost:3000");
  }
}

/** Global defaults — every value is editable in Dashboard → Settings. */
export async function generateMetadata() {
  const s = await getSiteSettings();

  return {
    metadataBase: safeUrl(s.siteUrl),
    title: { default: s.defaultTitle, template: s.titleTemplate },
    description: s.defaultDescription,
    applicationName: s.siteName,
    keywords: s.defaultKeywords,
    creator: s.siteName,
    publisher: s.siteName,
    formatDetection: { telephone: false },
    verification: {
      google: s.googleSiteVerification || undefined,
      other: s.bingSiteVerification ? { "msvalidate.01": s.bingSiteVerification } : undefined,
    },
    robots: s.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
    alternates: {
      types: { "application/rss+xml": "/blog/rss.xml" },
    },
  };
}

export const viewport = {
  themeColor: "#050914",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground">{children}</body>
    </html>
  );
}
