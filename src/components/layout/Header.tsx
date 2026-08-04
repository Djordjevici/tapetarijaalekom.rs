"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import MobileMenu from "./MobileMenu";
import { flags, nav, telLink, site } from "@/data/site";

export default function Header() {
  const [skrolovan, setSkrolovan] = useState(false);
  const [otvoren, setOtvoren] = useState(false);

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
        <div className="sadrzaj flex items-center justify-between gap-4 py-3.5">
          <Link
            href="/"
            aria-label={`${site.name} — početna`}
            className="shrink-0 py-1"
          >
            {/* pun lockup od sm nadalje, kompaktni na telefonu */}
            <Image
              src="/logo/alekom-lockup-dark.svg"
              alt={site.name}
              width={196}
              height={62}
              priority
              className="hidden h-9 w-auto sm:block"
            />
            <Image
              src="/logo/alekom-lockup-compact-dark.svg"
              alt={site.name}
              width={158}
              height={42}
              priority
              className="h-7 w-auto sm:hidden"
            />
          </Link>

          <nav aria-label="Glavna navigacija" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-malo text-mist-2">
              {linkovi.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="relative py-2 transition-colors duration-300 hover:text-platno"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#procena"
              className="hidden border border-mist-3 px-5 py-3 text-malo font-semibold text-platno transition-colors duration-300 hover:border-bakar hover:text-bakar-svetli md:inline-flex"
            >
              Pošaljite fotografiju
            </a>
            <a
              href={telLink}
              className="inline-flex min-h-[44px] items-center bg-bakar-dugme px-4 py-3 text-malo font-semibold text-white transition-colors duration-300 hover:bg-bakar-dugme-hover sm:px-5"
            >
              <span className="sm:hidden">Pozovite</span>
              <span className="hidden sm:inline">{site.phone.display}</span>
            </a>
            <button
              type="button"
              onClick={() => setOtvoren(true)}
              aria-label="Otvorite meni"
              aria-expanded={otvoren}
              className="ml-1 grid h-11 w-11 place-items-center text-platno lg:hidden"
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

      <MobileMenu otvoren={otvoren} zatvori={() => setOtvoren(false)} />
    </>
  );
}
