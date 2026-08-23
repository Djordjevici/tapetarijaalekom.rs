import Link from "next/link";

import Otkrij from "@/components/ui/Otkrij";
import Sekcija, { Zaglavlje } from "@/components/ui/Sekcija";
import Slika from "@/components/ui/Slika";
import { featuredServices, services } from "@/data/services";

/**
 * Usluge na početnoj: tri izdvojene kao editorial blokovi, ostale kao
 * kratak spisak. Namerno bez mreže identičnih kartica.
 */
export default function Usluge() {
  const ostale = services.filter((s) => !s.featured);

  return (
    <Sekcija id="usluge" podloga="platno">
      <div className="sadrzaj">
        <Zaglavlje
          nadnaslov="Šta radimo"
          naslov={
            <>
              Od kućnog i kožnog nameštaja
              <br />
              do poslovnog enterijera.
            </>
          }
          uvod="Presvlačenje, tapaciranje i šivenje po meri za domove i poslovne prostore — uz poseban fokus na kožni nameštaj i preciznu završnu obradu."
        />

        <div className="mt-16 grid gap-16 sm:mt-20 sm:gap-24">
          {featuredServices.map((s, i) => (
            <article
              key={s.slug}
              className="grid items-center gap-8 md:grid-cols-12 md:gap-12"
            >
              <Otkrij
                className={`md:col-span-7 ${
                  i % 2 === 1 ? "md:order-2 md:col-start-6" : ""
                }`}
              >
                <Slika
                  kljuc={s.image}
                  odnos="3 / 2"
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="rounded-slika"
                  imgClassName="transition-transform duration-[900ms] ease-meko hover:scale-[1.03]"
                />
              </Otkrij>

              <div
                className={`md:col-span-5 ${
                  i % 2 === 1 ? "md:order-1 md:col-start-1 md:row-start-1" : ""
                }`}
              >
                <Otkrij kasnjenje={80}>
                  <span className="font-display text-[0.95rem] italic text-bakar">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 text-h3">
                    <Link
                      href={`/usluge#${s.slug}`}
                      className="transition-colors hover:text-bakar-tekst"
                    >
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-malo text-ink-3">{s.lead}</p>
                  <p className="mt-5 text-body text-ink-2">{s.body}</p>
                  <p className="mt-4 border-l-2 border-bakar pl-4 text-malo text-ink-2">
                    {s.solves}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-2">
                    {s.items.map((it) => (
                      <li
                        key={it}
                        className="border border-linija-svetla px-3 py-1.5 text-[0.78rem] text-ink-2"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </Otkrij>
              </div>
            </article>
          ))}
        </div>

        <Otkrij>
          <div className="mt-16 border-t border-linija-svetla pt-9 sm:mt-20">
            <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start md:gap-14">
              <h3 className="text-h3">Radimo i</h3>
              <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-3">
                {ostale.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/usluge#${s.slug}`}
                      className="font-display text-[1.05rem] transition-colors hover:text-bakar-tekst"
                    >
                      {s.title}
                    </Link>
                    <p className="mt-1.5 text-malo text-ink-3">{s.lead}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/usluge"
              className="group mt-10 inline-flex items-center gap-3 text-[0.94rem] font-semibold text-ink transition-colors duration-300 hover:text-bakar"
            >
              Sve usluge detaljno
              <span
                aria-hidden
                className="h-px w-8 bg-bakar transition-all duration-500 ease-meko group-hover:w-12"
              />
            </Link>
          </div>
        </Otkrij>
      </div>
    </Sekcija>
  );
}
