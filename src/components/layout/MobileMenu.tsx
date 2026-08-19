"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";

import {
  flags,
  nav,
  site,
  telLink,
  viberLink,
  whatsappLink,
} from "@/data/site";

/**
 * Mobilni meni preko celog ekrana.
 * Zamka fokusa, zatvaranje na Esc i blokada skrola dok je otvoren.
 */
export default function MobileMenu({
  otvoren,
  zatvori,
}: {
  otvoren: boolean;
  zatvori: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const dugmeZaZatvaranje = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (otvoren) dugmeZaZatvaranje.current?.focus();
  }, [otvoren]);

  useEffect(() => {
    if (!otvoren) return;

    const prethodni = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const fokusabilni = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      );

    const naTipku = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        zatvori();
        return;
      }
      if (e.key !== "Tab") return;
      const el = fokusabilni();
      const prvi = el[0];
      const zadnji = el[el.length - 1];
      if (!prvi || !zadnji) return;
      if (e.shiftKey && document.activeElement === prvi) {
        e.preventDefault();
        zadnji.focus();
      } else if (!e.shiftKey && document.activeElement === zadnji) {
        e.preventDefault();
        prvi.focus();
      }
    };

    document.addEventListener("keydown", naTipku);
    return () => {
      document.removeEventListener("keydown", naTipku);
      document.body.style.overflow = "";
      prethodni?.focus();
    };
  }, [otvoren, zatvori]);

  const linkovi = nav.filter((n) => !("flag" in n) || flags[n.flag]);

  return (
    <div
      id="mobilni-meni"
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Meni"
      aria-hidden={!otvoren}
      inert={!otvoren}
      className={`fixed inset-0 z-[60] bg-ugljen text-platno transition-[opacity,visibility] duration-400 ease-meko xl:hidden ${
        otvoren
          ? "visible opacity-100"
          : "invisible pointer-events-none opacity-0"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-eyebrow font-semibold uppercase text-mist-3">
            Meni
          </span>
          <button
            ref={dugmeZaZatvaranje}
            type="button"
            onClick={zatvori}
            aria-label="Zatvorite meni"
            className="grid h-11 w-11 place-items-center text-platno"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 pt-6">
          <ul>
            <li>
              <Link
                href="/"
                onClick={zatvori}
                className="block border-b border-linija-tamna py-5 font-display text-[1.7rem]"
              >
                Početna
              </Link>
            </li>
            {linkovi.map((l, i) => (
              <li
                key={l.href}
                style={{ transitionDelay: `${(i + 1) * 40}ms` }}
                className={`transition-all duration-500 ease-meko ${
                  otvoren ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                <Link
                  href={l.href}
                  onClick={zatvori}
                  className="block border-b border-linija-tamna py-5 font-display text-[1.7rem]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-linija-tamna px-5 py-5">
          <div className="grid gap-2.5">
            <a
              href={telLink}
              className="flex min-h-[52px] items-center justify-center bg-bakar-dugme font-semibold text-white"
            >
              Pozovite {site.phone.display}
            </a>
            <a
              href="/kontakt#procena"
              onClick={zatvori}
              className="flex min-h-[52px] items-center justify-center border border-mist-3 font-semibold"
            >
              Pošaljite fotografiju
            </a>
            {/* Viber i WhatsApp se prikazuju samo kada su potvrđeni. */}
            {flags.viber && (
              <a
                href={viberLink}
                className="flex min-h-[52px] items-center justify-center border border-mist-3 font-semibold"
              >
                Viber
              </a>
            )}
            {flags.whatsapp && (
              <a
                href={whatsappLink}
                className="flex min-h-[52px] items-center justify-center border border-mist-3 font-semibold"
              >
                WhatsApp
              </a>
            )}
          </div>
          <p className="mt-4 text-malo text-mist-3">{site.address.full}</p>
        </div>
      </div>
    </div>
  );
}
