"use client";

import { useEffect, useRef, useState } from "react";

import {
  flags,
  site,
  telLink,
  viberLink,
  whatsappLink,
} from "@/data/site";

/**
 * Jedno plutajuće dugme koje otvara kanale kontakta.
 * Sve nepotvrđene kanale skriva flag, pa se ne gomilaju dugmad na ekranu.
 */
export default function FloatingContact() {
  const [otvoren, setOtvoren] = useState(false);
  const [vidljiv, setVidljiv] = useState(false);
  const kutija = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const naSkrol = () => setVidljiv(window.scrollY > 600);
    naSkrol();
    window.addEventListener("scroll", naSkrol, { passive: true });
    return () => window.removeEventListener("scroll", naSkrol);
  }, []);

  useEffect(() => {
    if (!otvoren) return;
    const vanKutije = (e: MouseEvent) => {
      if (!kutija.current?.contains(e.target as Node)) setOtvoren(false);
    };
    const naEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOtvoren(false);
    };
    document.addEventListener("mousedown", vanKutije);
    document.addEventListener("keydown", naEsc);
    return () => {
      document.removeEventListener("mousedown", vanKutije);
      document.removeEventListener("keydown", naEsc);
    };
  }, [otvoren]);

  const stavke = [
    { label: `Pozovite ${site.phone.display}`, href: telLink, prikazi: true },
    { label: "Viber", href: viberLink, prikazi: flags.viber },
    { label: "WhatsApp", href: whatsappLink, prikazi: flags.whatsapp },
    { label: "Pošaljite fotografiju", href: "#procena", prikazi: true },
  ].filter((s) => s.prikazi);

  return (
    <div
      ref={kutija}
      className={`fixed bottom-24 right-4 z-40 hidden transition-all duration-500 ease-meko md:bottom-6 md:block ${
        vidljiv
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <div
        id="kontakt-opcije"
        hidden={!otvoren}
        className="mb-2.5 w-64 border border-linija-tamna bg-sumrak p-2 shadow-2xl"
      >
        <ul>
          {stavke.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                onClick={() => setOtvoren(false)}
                className="flex min-h-[46px] items-center px-3 text-malo font-medium text-platno transition-colors duration-200 hover:text-bakar-svetli"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => setOtvoren((v) => !v)}
        aria-expanded={otvoren}
        aria-controls="kontakt-opcije"
        className="ml-auto flex min-h-[52px] items-center gap-2.5 bg-bakar-dugme px-5 text-malo font-semibold text-white shadow-xl transition-colors duration-300 hover:bg-bakar-dugme-hover"
      >
        <span
          aria-hidden
          className={`transition-transform duration-300 ease-meko ${
            otvoren ? "rotate-45" : ""
          }`}
        >
          {otvoren ? "＋" : "✆"}
        </span>
        {otvoren ? "Zatvorite" : "Kontakt"}
      </button>
    </div>
  );
}
