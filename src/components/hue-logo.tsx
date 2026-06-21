"use client";

import { useId } from "react";

/* ----------------------------------------------------------------------------
   Hue logo mark — the "open-book H" badge, ported from the hue-mobile app icon
   (assets/images/android-icon-foreground.png) and recolored to the web's
   warm-stone palette.

   The geometry is traced 1:1 from the source PNG in a 1024×1024 space:
   a left "page" parallelogram beside a perspective "H" letterform. Only the
   badge gradient changes — the mobile app's blue becomes a warm
   chart-2 → chart-4 → chart-5 sweep, and the glyph keeps its light fill.

   Gradient ids are made unique per instance with useId so the logo can render
   more than once on a page (nav + footer) without colliding.
---------------------------------------------------------------------------- */

interface Props {
  /** Rendered square size in px. */
  size?: number;
  className?: string;
  /** Accessible label; pass an empty string to mark the mark decorative. */
  title?: string;
}

export default function HueLogo({ size = 28, className, title = "Hue" }: Props) {
  const gradientId = useId();
  const decorative = title === "";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative || undefined}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-2)" />
          <stop offset="55%" stopColor="var(--chart-4)" />
          <stop offset="100%" stopColor="var(--chart-5)" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" rx="230" fill={`url(#${gradientId})`} />
      <g fill="var(--primary-foreground)">
        {/* Left "page" — a perspective parallelogram, tallest at the spine. */}
        <path d="M492 206 L492 817 L271 760 L271 260 Z" />
        {/* Right "page" — the H letterform, in matching perspective. */}
        <path d="M521 206 L618 230 L618 468 L683 462 L683 245 L752 262 L752 763 L683 775 L683 555 L618 558 L618 793 L521 817 Z" />
      </g>
    </svg>
  );
}
