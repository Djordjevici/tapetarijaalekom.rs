import type { MouseEvent } from "react";

/**
 * Browser ne ponavlja navigaciju kada se klikne već aktivna hash adresa.
 * Ručno ponovi samo taj slučaj; sve ostale klikove prepuštamo Next-u/browseru.
 */
export function ponoviHashNavigaciju(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
): void {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const url = new URL(href, window.location.href);
  if (
    !url.hash ||
    url.pathname !== window.location.pathname ||
    url.hash !== window.location.hash
  ) {
    return;
  }

  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}
