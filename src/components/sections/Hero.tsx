"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { img } from "@/data/images";
import { site, telLink } from "@/data/site";

/**
 * Hero.
 *
 * Copy je potvrđena varijanta A. Alternativne varijante B i C stoje u
 * dokumentaciji (DIZAJN.md), ne u kodu.
 *
 * Na desktopu je primarna akcija slanje fotografije, na telefonu poziv —
 * zato su dugmad u obrnutom redu na malim ekranima.
 */
export default function Hero() {
  const slika = img("hero-radionica");
  const ref = useRef<HTMLDivElement>(null);
  const [pomeraj, setPomeraj] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // parallax samo na širim ekranima, telefoni ga ne dobijaju
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    let radi = false;
    const naSkrol = () => {
      if (radi) return;
      radi = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setPomeraj(Math.min(y * 0.14, 90));
        radi = false;
      });
    };
    window.addEventListener("scroll", naSkrol, { passive: true });
    return () => window.removeEventListener("scroll", naSkrol);
  }, []);

  return (
    <section className="zrno relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ugljen pb-14 pt-32 text-platno sm:pb-20">
      <div ref={ref} className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 scale-[1.08]"
          style={{ transform: `translate3d(0, ${pomeraj}px, 0) scale(1.08)` }}
        >
          <Image
            src={slika.src}
            alt={slika.alt}
            width={slika.width}
            height={slika.height}
            priority
            fetchPriority="high"
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </div>
        {/* dovoljno da tekst ima kontrast, ali da se fotografija i dalje čita */}
        <div className="absolute inset-0 bg-gradient-to-t from-ugljen via-ugljen/55 to-ugljen/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-sumrak/55 via-transparent to-transparent" />
      </div>

      <div className="sadrzaj relative">
        <p
          className="otkrij text-eyebrow font-semibold uppercase text-mist-2"
          data-vidljivo="true"
          style={{ "--kasnjenje": "80ms" } as React.CSSProperties}
        >
          Tapetarija u Novom Sadu — {site.foundedLabel}
        </p>

        <h1
          className="otkrij mt-5 max-w-4xl text-h1"
          data-vidljivo="true"
          style={{ "--kasnjenje": "180ms" } as React.CSSProperties}
        >
          Presvlačimo nameštaj
          <br />
          <span className="italic text-bakar-svetli">koji vredi zadržati.</span>
        </h1>

        <svg
          className="otkrij mt-7 h-3 w-[min(260px,60vw)]"
          data-vidljivo="true"
          style={{ "--kasnjenje": "300ms" } as React.CSSProperties}
          viewBox="0 0 260 12"
          fill="none"
          aria-hidden
        >
          <path
            d="M2 6 Q 33 2 65 6 T 130 6 T 195 6 T 258 6"
            stroke="#BE7242"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="5 8"
            className="animate-sav"
            style={{ strokeDashoffset: 120 }}
          />
        </svg>

        <p
          className="otkrij mt-6 max-w-md text-lede text-mist-1"
          data-vidljivo="true"
          style={{ "--kasnjenje": "380ms" } as React.CSSProperties}
        >
          Tapaciranje, obnova i šivenje po meri. Pošaljite fotografiju i
          zatražite procenu.
        </p>

        <div
          className="otkrij mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          data-vidljivo="true"
          style={{ "--kasnjenje": "470ms" } as React.CSSProperties}
        >
          {/* redosled na telefonu: poziv prvi */}
          <a
            href={telLink}
            className="order-1 flex min-h-[54px] items-center justify-center bg-bakar-dugme px-7 text-[0.94rem] font-semibold text-white transition-colors duration-300 hover:bg-bakar-dugme-hover sm:order-2 sm:bg-transparent sm:px-0 sm:text-platno sm:underline sm:decoration-mist-3 sm:decoration-1 sm:underline-offset-[6px] sm:hover:bg-transparent sm:hover:text-bakar-svetli"
          >
            <span className="sm:hidden">Pozovite odmah</span>
            <span className="hidden sm:inline">
              Pozovite {site.phone.display}
            </span>
          </a>
          <a
            href="#procena"
            className="order-2 flex min-h-[54px] items-center justify-center border border-mist-3 px-7 text-[0.94rem] font-semibold transition-colors duration-300 hover:border-bakar hover:text-bakar-svetli sm:order-1 sm:mr-7 sm:border-0 sm:bg-bakar-dugme sm:text-white sm:hover:bg-bakar-dugme-hover sm:hover:text-white"
          >
            <span className="sm:hidden">Pošaljite fotografiju</span>
            <span className="hidden sm:inline">
              Pošaljite fotografiju za procenu
            </span>
          </a>
        </div>

        <div
          className="otkrij mt-11 flex flex-col gap-2 border-t border-linija-tamna pt-6 text-malo text-mist-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3"
          data-vidljivo="true"
          style={{ "--kasnjenje": "560ms" } as React.CSSProperties}
        >
          <span>Radionica u Petrovaradinu</span>
          <span aria-hidden className="hidden h-1 w-1 rounded-full bg-bakar sm:block" />
          <span>Rad po meri i po dogovoru</span>
          <span aria-hidden className="hidden h-1 w-1 rounded-full bg-bakar sm:block" />
          <span>{site.foundedLabel}</span>
        </div>
      </div>

      <a
        href="#usluge"
        aria-label="Nastavite na usluge"
        className="absolute bottom-5 right-5 hidden text-mist-3 transition-colors duration-300 hover:text-platno lg:block"
      >
        <span className="flex flex-col items-center gap-2 text-[0.66rem] uppercase tracking-[0.18em]">
          Skrolujte
          <span aria-hidden className="h-9 w-px bg-current" />
        </span>
      </a>
    </section>
  );
}
