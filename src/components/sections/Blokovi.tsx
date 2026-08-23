import Otkrij from "@/components/ui/Otkrij";
import Sekcija, { Zaglavlje } from "@/components/ui/Sekcija";
import Slika from "@/components/ui/Slika";
import { materialGroups, suppliers } from "@/data/business";
import { activeProcess, materialTopics, priceFactors } from "@/data/content";
import { site } from "@/data/site";

/** Trust traka odmah pod herojem. Bez izmišljenih brojeva. */
export function TrustTraka() {
  const stavke = [
    {
      naslov: site.foundedLabel,
      tekst: "Radionica u Petrovaradinu, u poslovanju od 2006. godine.",
    },
    {
      naslov: "Porodični posao",
      tekst: "Lična odgovornost i direktan dogovor sa Aleksandrom Komarovim.",
    },
    {
      naslov: "Besplatna početna procena",
      tekst: "Pošaljete fotografije i osnovne podatke, a zatim dogovaramo pregled.",
    },
  ];

  return (
    <Sekcija podloga="sumrak" tesna>
      <div className="sadrzaj">
        <ul className="grid gap-9 md:grid-cols-3 md:gap-12">
          {stavke.map((s, i) => (
            <Otkrij as="li" key={s.naslov} kasnjenje={i * 90}>
              <span aria-hidden className="mb-5 block h-px w-10 bg-bakar" />
              <h2 className="font-display text-[1.22rem]">{s.naslov}</h2>
              <p className="mt-2.5 text-malo leading-relaxed text-mist-2">
                {s.tekst}
              </p>
            </Otkrij>
          ))}
        </ul>
      </div>
    </Sekcija>
  );
}

/** Realan tok rada, bez obećavanja konačne cene ili roka unapred. */
export function Proces() {
  return (
    <Sekcija id="proces" podloga="papir">
      <div className="sadrzaj">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Zaglavlje
              nadnaslov="Kako radimo"
              naslov="Od fotografije do gotovog komada."
              uvod="Početna procena je besplatna, a konačan obim, cena i termin potvrđuju se tek nakon pregleda."
            />
            <Otkrij kasnjenje={180}>
              <Slika
                kljuc="radionica-detalj"
                odnos="4 / 3"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="mt-10 rounded-slika"
              />
            </Otkrij>
          </div>

          <ol className="lg:col-span-7">
            {activeProcess.map((k, i) => (
              <Otkrij as="li" key={k.title} kasnjenje={i * 80}>
                <div className="grid gap-4 border-b border-linija-svetla py-7 sm:grid-cols-[auto_1fr] sm:gap-8">
                  <span className="font-display text-[1.6rem] italic text-bakar">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-h3">{k.title}</h3>
                    <p className="mt-2.5 max-w-md text-body text-ink-2">
                      {k.body}
                    </p>
                  </div>
                </div>
              </Otkrij>
            ))}
          </ol>
        </div>
      </div>
    </Sekcija>
  );
}

/** O nama i razlozi za poverenje, bez izmišljenih statistika. */
export function ZastoMi() {
  const razlozi = [
    {
      naslov: "Pouzdanost pre svega",
      tekst:
        "Dogovoreni obim posla se jasno definiše, a o toku i završetku komuniciramo direktno i odgovorno.",
    },
    {
      naslov: "Stručno znanje i zanatsko učenje",
      tekst:
        "Stručno obrazovanje i kontinuirano usavršavanje primenjujemo kroz precizno krojenje, šivenje i završnu obradu.",
    },
    {
      naslov: "Savet prema načinu korišćenja",
      tekst:
        "Materijal i obim obnove ne biraju se samo po izgledu, već prema komadu, prostoru i svakodnevnom opterećenju.",
    },
    {
      naslov: "Ista radionica, ista odgovornost",
      tekst:
        "Godinama radimo na istoj adresi u Petrovaradinu, a veliki deo poslova i dalje dolazi kroz preporuke.",
    },
  ];

  return (
    <Sekcija id="o-nama" podloga="sumrak">
      <div className="sadrzaj">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Zaglavlje
              nadnaslov="O nama"
              naslov="Aleksandar Komarov. Porodični zanat od 2006."
              uvod="Ime Alekom nastalo je od ALEksandar + KOMarov. Porodična radionica u Petrovaradinu spaja stručno znanje, kreativnost i ličnu odgovornost prema svakom komadu."
              prigusen="text-mist-2"
            />
          </div>
          <ul className="grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:col-span-7">
            {razlozi.map((r, i) => (
              <Otkrij as="li" key={r.naslov} kasnjenje={i * 80}>
                <h3 className="font-display text-[1.18rem]">{r.naslov}</h3>
                <p className="mt-2.5 text-malo leading-relaxed text-mist-2">
                  {r.tekst}
                </p>
              </Otkrij>
            ))}
          </ul>
        </div>
      </div>
    </Sekcija>
  );
}

/** Materijali i savetovanje. */
export function Materijali() {
  return (
    <Sekcija podloga="platno">
      <div className="sadrzaj">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Zaglavlje
              nadnaslov="Izbor materijala"
              naslov="Materijal se bira prema komadu i životu oko njega."
              uvod="U radionici možete pogledati uzorke i dobiti savet prema načinu korišćenja, održavanju i željenom izgledu."
            />
            <Otkrij kasnjenje={160}>
              <Slika
                kljuc="materijali"
                odnos="3 / 2"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="mt-10 rounded-slika"
              />
            </Otkrij>
            <Otkrij kasnjenje={200}>
              <p className="mt-7 border-l-2 border-bakar pl-4 text-malo text-ink-2">
                Ako već imate odabran materijal, možete ga doneti uz prethodnu
                konsultaciju kako bismo proverili da li odgovara konkretnom
                komadu i načinu upotrebe.
              </p>
            </Otkrij>
          </div>
          <div className="lg:col-span-7">
            <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
              {materialTopics.map((m, i) => (
                <Otkrij as="li" key={m.title} kasnjenje={i * 60}>
                  <span aria-hidden className="mb-4 block h-px w-8 bg-bakar" />
                  <h3 className="font-display text-[1.1rem]">{m.title}</h3>
                  <p className="mt-2 text-malo leading-relaxed text-ink-2">
                    {m.body}
                  </p>
                </Otkrij>
              ))}
            </ul>
            <Otkrij kasnjenje={240}>
              <div className="mt-10 border-t border-linija-svetla pt-7">
                <h3 className="text-eyebrow font-semibold uppercase text-ink-3">
                  Materijali koje možemo nabaviti
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {materialGroups.map((m) => (
                    <li
                      key={m}
                      className="border border-linija-svetla px-3 py-1.5 text-[0.78rem] text-ink-2"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-malo text-ink-3">
                  Radimo sa materijalima i ponudom više proverenih dobavljača,
                  uključujući {suppliers.join(", ")}.
                </p>
              </div>
            </Otkrij>
          </div>
        </div>
      </div>
    </Sekcija>
  );
}

/** Kako se formira cena — bez javnog cenovnika i obećanja unapred. */
export function Cena() {
  return (
    <Sekcija podloga="papir" tesna>
      <div className="sadrzaj">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Zaglavlje
              nadnaslov="Cena"
              naslov="Kako se formira cena?"
              uvod="Svaki komad je drugačiji. Fotografije su dovoljne za besplatnu okvirnu procenu, dok konačnu cenu definišemo nakon pregleda."
            />
          </div>
          <div className="lg:col-span-7">
            <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {priceFactors.map((f, i) => (
                <Otkrij as="li" key={f} kasnjenje={i * 50}>
                  <div className="flex gap-3.5 border-b border-linija-svetla pb-4">
                    <span
                      aria-hidden
                      className="mt-2.5 h-px w-4 shrink-0 bg-bakar"
                    />
                    <span className="text-body text-ink-2">{f}</span>
                  </div>
                </Otkrij>
              ))}
            </ul>
            <Otkrij kasnjenje={220}>
              <p className="mt-9 max-w-xl text-lede">
                Najbrži način da dobijete okvirnu procenu jeste da pošaljete
                nekoliko fotografija i osnovne informacije o komadu.
              </p>
              <a
                href="#procena"
                className="group mt-6 inline-flex items-center gap-3 text-[0.94rem] font-semibold transition-colors duration-300 hover:text-bakar"
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
  );
}
