"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveal na skrol.
 *
 * Sadržaj je od početka u DOM-u i čitljiv — animira se samo prozirnost i
 * pomeraj, pa animacija nikada ne odlaže prikaz. Bez JS-a ili sa uključenim
 * `prefers-reduced-motion` sve je odmah vidljivo (vidi globals.css).
 */
export default function Otkrij({
  children,
  kasnjenje = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  kasnjenje?: number;
  as?: "div" | "section" | "li" | "article" | "span";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [vidljivo, setVidljivo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVidljivo(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([unos]) => {
        if (unos?.isIntersecting) {
          setVidljivo(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error – ref je kompatibilan sa svim dozvoljenim tagovima
      ref={ref}
      className={`otkrij ${className}`}
      data-vidljivo={vidljivo}
      style={{ "--kasnjenje": `${kasnjenje}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
