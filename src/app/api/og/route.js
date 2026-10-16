import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Auto-generated Open Graph card used whenever a page or post has no
 * custom social image:  /api/og?title=Hello&eyebrow=Blog
 */
// Brand typeface (Montserrat ExtraBold, SIL Open Font License) bundled with the route.
const montserrat = fetch(new URL("./montserrat-800.woff", import.meta.url)).then((r) => r.arrayBuffer());

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const fontData = await montserrat.catch(() => null);
  const title = (searchParams.get("title") || "Digital marketing that moves your brand").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") || "snowdox").slice(0, 40);
  const size = title.length > 70 ? 56 : title.length > 40 ? 66 : 78;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          background: "#050914",
          backgroundImage:
            "radial-gradient(circle at 10% 15%, rgba(4,182,255,0.28), transparent 42%), radial-gradient(circle at 92% 90%, rgba(0,88,244,0.40), transparent 48%)",
          color: "#F5F7FA",
          fontFamily: "sans-serif",
        }}
      >
        {/* Official lockup (public/brand) */}
        <img src={`${origin}/brand/snowdox-logo-full-dark.png`} width={282} height={120} alt="" />

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 26, color: "#2990FF", letterSpacing: 6, textTransform: "uppercase", fontFamily: "monospace" }}>
            {`// ${eyebrow}`}
          </div>
          <div style={{ display: "flex", fontFamily: "Montserrat", fontSize: size, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1040 }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "#97A1B4", fontFamily: "monospace" }}>
          <span>seo · web · apps · ai · growth</span>
          <span
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: 999,
              background: "linear-gradient(120deg, #0040D6, #006EF0)",
              color: "#FFFFFF",
              fontWeight: 700,
            }}
          >
            snowdox.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData ? [{ name: "Montserrat", data: fontData, weight: 800, style: "normal" }] : undefined,
    }
  );
}
