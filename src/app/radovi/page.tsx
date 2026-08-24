import type { Metadata } from "next";

import IzborProjekta from "@/components/before-after/IzborProjekta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Otkrij from "@/components/ui/Otkrij";
import Sekcija, { Zaglavlje } from "@/components/ui/Sekcija";
import Slika from "@/components/ui/Slika";
import { Procena, ZavrsniCta } from "@/components/sections/Zavrsne";
import {
  categoriesOf,
  hasPublishedRealProjects,
  visibleProjects,
} from "@/data/projects";
import { allowIndexing, flags, site, telLink } from "@/data/site";
import { breadcrumbSchema, meta } from "@/lib/seo";

export const metadata: Metadata = {
  ...meta({
    title: "Radovi i pre/posle | Tapetarija Alekom Novi Sad",
    description:
      "Galerija presvlačenja kauča, fotelja i stolica Tapetarije Alekom. Dok čekamo originalne fotografije, prikazan je jasno označen demonstracioni slider.",
    path: "/radovi",
  }),
  ...(!hasPublishedRealProjects
    ? { robots: { index: false, follow: allowIndexing } }
    : {}),
};

export default function RadoviStrana() {
  const projekti = visibleProjects(flags.showPlaceholderProjects);
  const kategorije = categoriesOf(projekti);
  const imaSadrzaj = projekti.length > 0;
  const samoDemo = imaSadrzaj && projekti.every((p) => p.isPlaceholder);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Početna", path: "/" },
              { name: "Radovi", path: "/radovi" },
            ]),
          ),
        }}
      />

      <Sekcija podloga="ugljen" className="pt-40">
        <div className="sadrzaj">
          <Breadcrumbs
            items={[{ label: "Početna", href: "/" }, { label: "Radovi" }]}
          />
          <Zaglavlje
            nadnaslov="Radovi"
            naslov="Pre i posle, na istom komadu."
            glavni
            uvod={
              imaSadrzaj
                ? "Povucite klizač i uporedite stanje pre i posle radova."
                : "Galerija se dopunjava fotografijama iz radionice."
            }
            prigusen="text-mist-2"
          />

          {/* Filteri se prikazuju samo kad ima dovoljno pravih projekata. */}
          {kategorije.length > 0 && (
            <Otkrij className="mt-10">
              <ul className="flex flex-wrap gap-2">
                {kategorije.map((k) => (
                  <li
                    key={k}
                    className="border border-linija-tamna px-4 py-2 text-malo text-mist-2"
                  >
                    {k}
                  </li>
                ))}
              </ul>
            </Otkrij>
          )}

          {imaSadrzaj ? (
            <Otkrij className="mt-14">
              {samoDemo && (
                <p className="mb-6 max-w-2xl border-l-2 border-bakar pl-4 text-malo text-mist-2">
                  Demonstracioni prikaz komponente. Fotografije nisu radovi
                  Tapetarije Alekom i biće zamenjene originalnim pre/posle
                  materijalom pre javnog predstavljanja portfolija.
                </p>
              )}
              <h2 className="sr-only">
                {samoDemo
                  ? "Demonstracioni projekti pre i posle"
                  : "Projekti pre i posle"}
              </h2>
              <IzborProjekta projekti={projekti} />
            </Otkrij>
          ) : (
            /* Ukusno prazno stanje — bez nedovršenog izgleda i bez lažnih kartica. */
            <Otkrij className="mt-14">
              <div className="grid items-center gap-10 border border-linija-tamna p-8 md:grid-cols-2 md:p-12">
                <div>
                  <h2 className="text-h3">Fotografije radova su u pripremi.</h2>
                  <p className="mt-4 max-w-md text-body text-mist-2">
                    Radimo od {site.foundedYear}. godine, a fotografije
                    završenih komada tek prikupljamo. Do tada — pošaljite nam
                    svoj komad i javljamo se sa procenom.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a
                      href="#procena"
                      className="flex min-h-[52px] items-center justify-center bg-bakar-dugme px-6 text-malo font-semibold text-white transition-colors hover:bg-bakar-dugme-hover"
                    >
                      Pošaljite fotografiju
                    </a>
                    <a
                      href={telLink}
                      className="flex min-h-[52px] items-center justify-center border border-mist-3 px-6 text-malo font-semibold transition-colors hover:border-bakar hover:text-bakar-svetli"
                    >
                      Pozovite {site.phone.display}
                    </a>
                  </div>
                </div>
                <Slika
                  kljuc="radionica-detalj"
                  odnos="4 / 3"
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="rounded-slika"
                />
              </div>
            </Otkrij>
          )}
        </div>
      </Sekcija>

      {imaSadrzaj && (
        <Sekcija podloga="platno">
          <div className="sadrzaj">
            <Zaglavlje
              nadnaslov="Iz radionice"
              naslov="Detalji koji se ne vide na gotovom komadu."
            />
            {samoDemo && (
              <p className="mt-5 max-w-xl text-malo text-ink-3">
                I fotografije u nastavku su privremeni vizuelni sadržaj za
                proveru rasporeda.
              </p>
            )}
            <div className="mt-12 grid auto-rows-[9rem] gap-5 sm:grid-cols-2 lg:grid-cols-12">
              {(["radionica-detalj", "servis-sivenje", "materijali"] as const).map(
                (k, i) => (
                  <Otkrij
                    key={k}
                    kasnjenje={i * 80}
                    className={`${
                      i === 0
                        ? "row-span-3 lg:col-span-7"
                        : i === 1
                          ? "row-span-2 lg:col-span-5"
                          : "row-span-2 lg:col-span-5"
                    }`}
                  >
                    <Slika
                      kljuc={k}
                      odnos="auto"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="h-full rounded-slika"
                      imgClassName="transition-transform duration-[900ms] ease-meko hover:scale-[1.04]"
                    />
                  </Otkrij>
                ),
              )}
            </div>
          </div>
        </Sekcija>
      )}

      <Procena />
      <ZavrsniCta />
    </>
  );
}
