"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import MobileMenu from "./MobileMenu";
import { flags, nav, telLink, site } from "@/data/site";

export default function Header() {
  const [skrolovan, setSkrolovan] = useState(false);
  const [otvoren, setOtvoren] = useState(false);
  const zatvoriMenu = useCallback(() => setOtvoren(false), []);
  const otvoriMenu = useCallback(() => {
    setOtvoren(true);
    // Dva frejma ostavljaju React-u vreme da ukloni `inert` pre fokusiranja.
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() =>
        document.getElementById("zatvori-mobilni-meni")?.focus(),
      ),
    );
  }, []);

  useEffect(() => {
    const naSkrol = () => setSkrolovan(window.scrollY > 24);
    naSkrol();
    window.addEventListener("scroll", naSkrol, { passive: true });
    return () => window.removeEventListener("scroll", naSkrol);
  }, []);

  const linkovi = nav.filter((n) => !("flag" in n) || flags[n.flag]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-meko ${
          skrolovan
            ? "border-b border-linija-tamna bg-sumrak/95 backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-ugljen/60 to-transparent"
        }`}
      >
        <div className="sadrzaj flex items-center justify-between gap-5 py-4 lg:py-5">
          <Link
            href="/"
            aria-label={`${site.name} — početna`}
            className="shrink-0 py-1"
          >
            {/* pun lockup od sm nadalje, kompaktni na telefonu */}
            <Image
              src="/logo/alekom-lockup-dark.svg"
              alt={site.name}
              width={248}
              height={78}
              priority
              className="hidden h-11 w-auto md:h-12 xl:h-[3.35rem] sm:block"
            />
            <Image
              src="/logo/alekom-lockup-compact-dark.svg"
              alt={site.name}
              width={168}
              height={44}
              priority
              className="h-8 w-auto sm:hidden"
            />
          </Link>

          <nav aria-label="Glavna navigacija" className="hidden xl:block">
            <ul className="flex items-center gap-7 text-[0.91rem] tracking-wide text-mist-2">
              {linkovi.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="relative py-2.5 transition-colors duration-300 hover:text-platno"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="/kontakt#procena"
              className="hidden min-h-[48px] items-center bg-bakar-dugme px-5 text-[0.9rem] font-semibold text-white transition-colors duration-300 hover:bg-bakar-dugme-hover xl:inline-flex"
            >
              Pošaljite fotografiju
            </a>
            <a
              href={telLink}
              className="inline-flex min-h-[48px] items-center bg-bakar-dugme px-4 py-3.5 text-[0.9rem] font-semibold text-white transition-colors duration-300 hover:bg-bakar-dugme-hover sm:px-5 xl:border xl:border-mist-3 xl:bg-transparent xl:text-platno xl:hover:border-bakar xl:hover:bg-transparent xl:hover:text-bakar-svetli"
            >
              <span className="sm:hidden">Pozovite</span>
              <span className="hidden sm:inline">{site.phone.display}</span>
            </a>
            <button
              type="button"
              onClick={otvoriMenu}
              aria-label="Otvorite meni"
              aria-expanded={otvoren}
              aria-controls="mobilni-meni"
              className="ml-1 grid h-12 w-12 place-items-center text-platno xl:hidden"
            >
              <span aria-hidden className="grid gap-[5px]">
                <span className="block h-px w-6 bg-current" />
                <span className="block h-px w-6 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu otvoren={otvoren} zatvori={zatvoriMenu} />
    </>
  );
}
