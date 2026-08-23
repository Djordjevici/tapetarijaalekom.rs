import type { Metadata } from "next";

import Otkrij from "@/components/ui/Otkrij";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Sekcija, { Zaglavlje } from "@/components/ui/Sekcija";
import Slika from "@/components/ui/Slika";
import { Cena, Proces } from "@/components/sections/Blokovi";
import { Procena, ZavrsniCta } from "@/components/sections/Zavrsne";
import { services } from "@/data/services";
import { breadcrumbSchema, meta, serviceSchema } from "@/lib/seo";

export const metadata: Metadata = meta({
  title: "Tapetarske usluge Novi Sad | Alekom",
  description:
    "Presvlačenje kauča, fotelja i stolica, kožni nameštaj, poslovni enterijeri, IKEA navlake, tende, baštenski, moto i nautički program u Novom Sadu.",
  path: "/usluge",
});

export default function UslugeStrana() {
  const schema = [
    ...serviceSchema(services.map((s) => ({ title: s.title, body: s.body, slug: s.slug }))),
    breadcrumbSchema([
      { name: "Početna", path: "/" },
      { name: "Usluge", path: "/usluge" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Sekcija podloga="ugljen" className="pt-40">
        <div className="sadrzaj">
          <Breadcrumbs
            items={[{ label: "Početna", href: "/" }, { label: "Usluge" }]}
          />
          <Zaglavlje
            nadnaslov="Usluge"
            naslov="Šta sve radimo i za koga."
            glavni
            uvod="Svaka usluga ima svoje zahteve — drugačiji materijal, drugačiji šav i drugačiju pripremu konstrukcije. Ovde je detaljno šta to znači u praksi."
            prigusen="text-mist-2"
          />
        </div>
      </Sekcija>

      {services.map((s, i) => (
        <Sekcija
          key={s.slug}
          id={s.slug}
          podloga={i % 2 === 0 ? "papir" : "platno"}
        >
          <div className="sadrzaj">
            <div className="grid items-start gap-9 md:grid-cols-12 md:gap-12">
              <Otkrij
                className={`md:col-span-6 ${
                  i % 2 === 1 ? "md:order-2 md:col-start-7" : ""
                }`}
              >
                <Slika
                  kljuc={s.image}
                  odnos="4 / 3"
                  sizes="(max-width: 768px) 100vw, 48vw"
                  className="rounded-slika"
                />
              </Otkrij>

              <div
                className={`md:col-span-6 ${
                  i % 2 === 1 ? "md:order-1 md:row-start-1" : ""
                }`}
              >
                <Otkrij kasnjenje={70}>
                  <span className="font-display text-[0.95rem] italic text-bakar">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 text-h2">{s.title}</h2>
                  <p className="mt-1.5 text-malo text-ink-3">{s.lead}</p>
                  <p className="mt-6 max-w-xl text-body text-ink-2">{s.body}</p>

                  <h3 className="mt-8 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-3">
                    Kada ovo rešava problem
                  </h3>
                  <p className="mt-2.5 max-w-xl border-l-2 border-bakar pl-4 text-body text-ink-2">
                    {s.solves}
                  </p>

                  <h3 className="mt-8 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-3">
                    Tipični komadi
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {s.items.map((it) => (
                      <li
                        key={it}
                        className="border border-linija-svetla px-3 py-1.5 text-[0.8rem] text-ink-2"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#procena"
                    className="group mt-9 inline-flex items-center gap-3 text-[0.94rem] font-semibold transition-colors duration-300 hover:text-bakar"
                  >
                    Pošaljite fotografiju za procenu
                    <span
                      aria-hidden
                      className="h-px w-8 bg-bakar transition-all duration-500 ease-meko group-hover:w-12"
                    />
                  </a>
                </Otkrij>
              </div>
            </div>
          </div>
        </Sekcija>
      ))}

      <Proces />
      <Cena />
      <Procena />
      <ZavrsniCta />
    </>
  );
}
