import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Auto-generated Open Graph card used whenever a page or post has no
 * custom social image:  /api/og?title=Hello&eyebrow=Blog
 */
export function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Design & engineering studio").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") || "snowdox").slice(0, 40);
  const size = title.length > 70 ? 58 : title.length > 40 ? 70 : 84;

  const arms = [0, 60, 120, 180, 240, 300];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#06070A",
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(10,228,255,0.28), transparent 42%), radial-gradient(circle at 92% 88%, rgba(139,92,246,0.32), transparent 45%)",
          color: "#F4F7FA",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            {arms.map((deg) => (
              <g key={deg} transform={`rotate(${deg} 16 16)`} stroke="#0AE4FF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="16" y1="16" x2="16" y2="5" />
                <polyline points="12.6,7 16,10.2 19.4,7" />
              </g>
            ))}
          </svg>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
            snowdox<span style={{ color: "#0AE4FF" }}>_</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 26, color: "#0AE4FF", letterSpacing: 6, textTransform: "uppercase", fontFamily: "monospace" }}>
            {`// ${eyebrow}`}
          </div>
          <div style={{ display: "flex", fontSize: size, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2.5, maxWidth: 1040 }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "#8A9099", fontFamily: "monospace" }}>
          <span>web · product · ai · growth</span>
          <span style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: "linear-gradient(120deg, #0AE4FF, #8B5CF6)", color: "#06070A", fontWeight: 700 }}>
            snowdox.com
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
