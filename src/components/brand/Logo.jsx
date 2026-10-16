import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official Snowdox logo (artwork extracted from the brand PDF into
 * /public/brand). Size it with a height class, e.g. className="h-10".
 *
 * variant:
 *   "auto"  — picks the dark- or light-background artwork from the nearest
 *             data-theme (dark site, white <LightSection>, admin light mode)
 *   "dark"  — always the version for dark backgrounds (white "Snow")
 *   "light" — always the version for light backgrounds (navy "Snow")
 */

const LOCKUP = { width: 575, height: 245 }; // compact & full lockups share this ratio
const MARK = { width: 180, height: 245 };

function Art({ name, size, variant, alt, className, priority }) {
  const show = (v) => variant === "auto" || variant === v;
  const base = cn("h-full w-auto max-w-none object-contain", className);
  return (
    <>
      {show("dark") && (
        <Image
          src={`/brand/snowdox-${name}-dark.svg`}
          alt={alt}
          width={size.width}
          height={size.height}
          priority={priority}
          unoptimized
          draggable={false}
          className={cn(base, variant === "auto" && "logo-on-dark")}
        />
      )}
      {show("light") && (
        <Image
          src={`/brand/snowdox-${name}-light.svg`}
          alt={alt}
          width={size.width}
          height={size.height}
          priority={priority}
          unoptimized
          draggable={false}
          className={cn(base, variant === "auto" && "logo-on-light")}
        />
      )}
    </>
  );
}

/** Mark + "Snowdox" wordmark. `tagline` adds "DIGITAL MARKETING". */
export function Logo({ className, tagline = false, variant = "auto", priority = false, imgClassName }) {
  return (
    <span className={cn("inline-flex h-10 shrink-0 select-none items-center", className)}>
      <Art
        name={tagline ? "logo-full" : "logo"}
        size={LOCKUP}
        variant={variant}
        alt={tagline ? "Snowdox Digital Marketing" : "Snowdox"}
        className={imgClassName}
        priority={priority}
      />
    </span>
  );
}

/** The "S" mark on its own (favicons, collapsed sidebar, avatars). */
export function LogoMark({ className, variant = "auto", priority = false }) {
  return (
    <span className={cn("inline-flex h-8 shrink-0 select-none items-center justify-center", className)}>
      <Art name="mark" size={MARK} variant={variant} alt="Snowdox" priority={priority} />
    </span>
  );
}
