"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { img } from "@/data/images";
import type { ImageKey } from "@/types";

/**
 * Klizač pre/posle.
 *
 * Radi mišem, dodirom i tastaturom. Slike stoje u kontejneru sa fiksnim
 * odnosom strana, pa nema pomeranja layouta i kadrovi su uvek poravnati.
 *
 * Pri prvom ulasku u vidno polje pušta tihu demonstraciju. Ona se prekida
 * na prvi dodir, klik ili tipku i više se ne ponavlja. Uz uključen
 * `prefers-reduced-motion` demonstracija se ne pokreće.
 */
export default function PrePosle({
  pre,
  posle,
  odnos = "3 / 2",
  sizes = "(max-width: 1024px) 100vw, 60vw",
  labelPre = "Pre",
  labelPosle = "Posle",
}: {
  pre: ImageKey;
  posle: ImageKey;
  odnos?: string;
  sizes?: string;
  labelPre?: string;
  labelPosle?: string;
}) {
  const slikaPre = img(pre);
  const slikaPosle = img(posle);

  const okvir = useRef<HTMLDivElement>(null);
  const [procenat, setProcenat] = useState(50);
  const [vuce, setVuce] = useState(false);
  const diranoRef = useRef(false);
  const animacijaRef = useRef<number | null>(null);
  const naslovId = useId();

  const prekiniDemo = useCallback(() => {
    diranoRef.current = true;
    if (animacijaRef.current !== null) {
      cancelAnimationFrame(animacijaRef.current);
      animacijaRef.current = null;
    }
  }, []);

  const postavi = useCallback((clientX: number) => {
    const el = okvir.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const v = ((clientX - r.left) / r.width) * 100;
    setProcenat(Math.max(0, Math.min(100, v)));
  }, []);

  // tiha demonstracija pri prvom ulasku u vidno polje
  useEffect(() => {
    const el = okvir.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const obs = new IntersectionObserver(
      ([unos]) => {
        if (!unos?.isIntersecting || diranoRef.current) return;
        obs.disconnect();

        const tacke = [50, 72, 30, 50];
        const trajanje = 1800;
        const start = performance.now();

        const korak = (sada: number) => {
          if (diranoRef.current) return;
          const t = Math.min((sada - start) / trajanje, 1);
          const p = t * (tacke.length - 1);
          const i = Math.min(Math.floor(p), tacke.length - 2);
          const f = p - i;
          const meko = f * f * (3 - 2 * f);
          const a = tacke[i] ?? 50;
          const b = tacke[i + 1] ?? 50;
          setProcenat(a + (b - a) * meko);
          if (t < 1) animacijaRef.current = requestAnimationFrame(korak);
        };
        animacijaRef.current = requestAnimationFrame(korak);
      },
      { threshold: 0.45 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (animacijaRef.current !== null) {
        cancelAnimationFrame(animacijaRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!vuce) return;
    const kreni = (e: PointerEvent) => postavi(e.clientX);
    const stani = () => setVuce(false);
    window.addEventListener("pointermove", kreni);
    window.addEventListener("pointerup", stani);
    window.addEventListener("pointercancel", stani);
    return () => {
      window.removeEventListener("pointermove", kreni);
      window.removeEventListener("pointerup", stani);
      window.removeEventListener("pointercancel", stani);
    };
  }, [vuce, postavi]);

  const naTipku = (e: React.KeyboardEvent) => {
    const korak = e.shiftKey ? 10 : 2;
    let nov: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") nov = procenat - korak;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") nov = procenat + korak;
    if (e.key === "Home") nov = 0;
    if (e.key === "End") nov = 100;
    if (e.key === "PageDown") nov = procenat - 20;
    if (e.key === "PageUp") nov = procenat + 20;
    if (nov === null) return;
    e.preventDefault();
    prekiniDemo();
    setProcenat(Math.max(0, Math.min(100, nov)));
  };

  const zaokruzen = Math.round(procenat);

  return (
    <div
      ref={okvir}
      className="relative select-none overflow-hidden rounded-slika bg-orah/20"
      style={{ aspectRatio: odnos, touchAction: "pan-y" }}
      onPointerDown={(e) => {
        prekiniDemo();
        setVuce(true);
        postavi(e.clientX);
      }}
    >
      {/* posle: donji sloj, vidi se sa desne strane klizača */}
      <Image
        src={slikaPosle.src}
        alt={slikaPosle.alt}
        width={slikaPosle.width}
        height={slikaPosle.height}
        sizes={sizes}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* pre: gornji sloj, isečen po poziciji klizača */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - procenat}% 0 0)` }}
      >
        <Image
          src={slikaPre.src}
          alt={slikaPre.alt}
          width={slikaPre.width}
          height={slikaPre.height}
          sizes={sizes}
          className="h-full w-full object-cover"
        />
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 bg-ugljen/78 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-platno backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: procenat > 12 ? 1 : 0 }}
      >
        {labelPre}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 bg-ugljen/78 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-platno backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: procenat < 88 ? 1 : 0 }}
      >
        {labelPosle}
      </span>

      {/* vertikalna linija klizača */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px bg-platno/90"
        style={{ left: `${procenat}%` }}
      />

      <div
        role="slider"
        tabIndex={0}
        aria-labelledby={naslovId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={zaokruzen}
        aria-valuetext={`Prikazano ${zaokruzen}% fotografije „${labelPre}“`}
        aria-orientation="horizontal"
        onKeyDown={naTipku}
        onFocus={prekiniDemo}
        className={`absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-platno/70 bg-ugljen/80 backdrop-blur-sm transition-transform duration-200 ${
          vuce ? "scale-95" : "hover:scale-105"
        }`}
        style={{ left: `${procenat}%` }}
      >
        <span id={naslovId} className="sr-only">
          Klizač za poređenje fotografija pre i posle
        </span>
        <span aria-hidden className="flex items-center gap-[3px] text-platno">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path
              d="M5.5 2 2 6l3.5 4M10.5 2 14 6l-3.5 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
