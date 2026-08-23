import Image from "next/image";
import Link from "next/link";

import {
  flags,
  mailLink,
  nav,
  site,
  telLink,
  viberLink,
  whatsappLink,
} from "@/data/site";
import { services } from "@/data/services";

export default function Footer() {
  const linkovi = nav.filter((n) => !("flag" in n) || flags[n.flag]);

  return (
    <footer className="zrno relative bg-ugljen pb-28 pt-sekcija-tesna text-platno md:pb-14">
      <div className="sadrzaj relative z-[1]">
        <div className="grid gap-12 border-b border-linija-tamna pb-12 md:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <Image
              src="/logo/alekom-lockup-dark.svg"
              alt={site.name}
              width={196}
              height={62}
              className="h-11 w-auto"
            />
            <p className="mt-6 max-w-xs text-malo leading-relaxed text-mist-2">
              Porodična tapetarska radionica Aleksandra Komarova u
              Petrovaradinu. Presvlačenje, tapaciranje i šivenje po meri.
            </p>
            <p className="mt-5 font-display text-[1.05rem] italic text-bakar-svetli">
              {site.slogan}
            </p>
          </div>

          <div>
            <h2 className="mb-5 text-eyebrow font-semibold uppercase text-mist-3">
              Usluge
            </h2>
            <ul className="grid gap-2.5 text-malo text-mist-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/usluge#${s.slug}`}
                    className="transition-colors duration-300 hover:text-platno"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-eyebrow font-semibold uppercase text-mist-3">
              Kontakt
            </h2>
            <ul className="grid gap-2.5 text-malo text-mist-2">
              <li>
                <a
                  href={telLink}
                  className="text-platno transition-colors duration-300 hover:text-bakar-svetli"
                >
                  {site.phone.display}
                </a>
              </li>
              {/* Fiksni telefon je aktivan, ali se namerno ne prikazuje u v1. */}
              {flags.landline && (
                <li>
                  <a href={`tel:${site.landline.e164}`}>
                    {site.landline.display}
                  </a>
                </li>
              )}
              {flags.publicEmail && (
                <li>
                  <a
                    href={mailLink}
                    className="transition-colors duration-300 hover:text-platno"
                  >
                    {site.email}
                  </a>
                </li>
              )}
              <li className="pt-1">{site.address.streetAddress}</li>
              <li>
                {site.address.postalCode} {site.address.addressLocality},{" "}
                {site.address.addressRegion}
              </li>
              <li className="pt-3">
                <a
                  href={viberLink}
                  className="transition-colors duration-300 hover:text-platno"
                >
                  Viber
                </a>
                {" · "}
                <a
                  href={whatsappLink}
                  className="transition-colors duration-300 hover:text-platno"
                >
                  WhatsApp
                </a>
              </li>
              <li className="pt-1">
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-platno"
                >
                  Instagram
                </a>
                {/* Facebook ikona se ne prikazuje dok link nije potvrđen. */}
                {flags.facebook && site.social.facebook && (
                  <>
                    {" · "}
                    <a
                      href={site.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </a>
                  </>
                )}
              </li>
              <li className="pt-1 text-mist-3">
                {site.hours.weekdays} · {site.hours.weekend}
              </li>
              <li className="text-mist-3">
                {site.hours.holidayNote}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-malo text-mist-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.foundedLabel}
          </p>
          <nav aria-label="Sporedna navigacija">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {linkovi.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-colors duration-300 hover:text-platno"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/politika-privatnosti"
                  className="transition-colors duration-300 hover:text-platno"
                >
                  Privatnost
                </Link>
              </li>
              <li>
                <Link
                  href="/politika-kolacica"
                  className="transition-colors duration-300 hover:text-platno"
                >
                  Kolačići
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sadrzaj relative z-[1] mt-7 flex justify-center">
        <a
          href="mailto:luka.djordjevic7017@gmail.com"
          aria-label="Website by Luka Djordjevic — pošaljite email"
          className="group relative inline-flex text-[0.6875rem] tracking-[0.03em] text-mist-3/60 transition-colors duration-300 hover:text-mist-2 focus-visible:text-mist-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bakar-svetli/60 focus-visible:ring-offset-4 focus-visible:ring-offset-ugljen"
        >
          Website by Luka Djordjevic
          <span
            role="tooltip"
            className="pointer-events-none invisible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded border border-linija-tamna bg-sumrak px-2.5 py-1.5 text-[0.625rem] tracking-normal text-mist-2 opacity-0 shadow-lg transition-opacity duration-200 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 motion-reduce:transition-none"
          >
            luka.djordjevic7017@gmail.com
          </span>
        </a>
      </div>
    </footer>
  );
}
