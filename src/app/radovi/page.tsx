import type { Metadata } from "next";

import IzborProjekta from "@/components/before-after/IzborProjekta";
import Otkrij from "@/components/ui/Otkrij";
import Sekcija, { Zaglavlje } from "@/components/ui/Sekcija";
import Slika from "@/components/ui/Slika";
import { Procena, ZavrsniCta } from "@/components/sections/Zavrsne";
import { categoriesOf, visibleProjects } from "@/data/projects";
import { flags, site, telLink } from "@/data/site";
import { breadcrumbSchema, meta } from "@/lib/seo";

export const metadata: Metadata = meta({
  title: "Radovi — pre i posle | Tapetarija Alekom",
  description:
    "Primeri presvlačenja i obnove nameštaja. Uporedite stanje pre i posle radova.",
  path: "/radovi",
});

export default function RadoviStrana() {
  const projekti = visibleProjects(flags.showPlaceholderProjects);
  const kategorije = categoriesOf(projekti);
  const imaSadrzaj = projekti.length > 0;

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
          <Zaglavlje
            nadnaslov="Radovi"
            naslov="Pre i posle, na istom komadu."
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
                      className="flex min-h-[52px] items-center justify-center bg-bakar px-6 text-malo font-semibold text-white transition-colors hover:bg-bakar-svetli"
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
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(["radionica-detalj", "servis-sivenje", "materijali"] as const).map(
                (k, i) => (
                  <Otkrij key={k} kasnjenje={i * 80}>
                    <Slika
                      kljuc={k}
                      odnos="4 / 3"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="rounded-slika"
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
