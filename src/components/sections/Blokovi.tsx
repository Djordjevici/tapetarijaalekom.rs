import Otkrij from "@/components/ui/Otkrij";
import Sekcija, { Zaglavlje } from "@/components/ui/Sekcija";
import Slika from "@/components/ui/Slika";
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
      naslov: "Rad po meri",
      tekst: "Krojenje po originalnim delovima komada, a ne po standardnim merama.",
    },
    {
      naslov: "Procena po fotografiji",
      tekst: "Pošaljete slike i opis, pa se dogovaramo o narednim koracima.",
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

/** Proces rada. Koraci ne obećavaju rok, cenu ni prevoz. */
export function Proces() {
  return (
    <Sekcija id="proces" podloga="papir">
      <div className="sadrzaj">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Zaglavlje
              nadnaslov="Kako radimo"
              naslov="Četiri koraka, bez nepoznanica."
              uvod="Ovako to obično ide od prve poruke do gotovog komada."
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

/** Zašto Alekom. Poverenje bez statistike koju ne možemo potvrditi. */
export function ZastoMi() {
  const razlozi = [
    {
      naslov: "Prvo konstrukcija, pa tkanina",
      tekst:
        "Ako gurtne i sunđer više ne drže, nova tkanina za godinu izgleda kao stara. Zato se to rešava u istom prolazu, a ne posle.",
    },
    {
      naslov: "Krojenje po komadu",
      tekst:
        "Delovi stare presvlake služe kao šablon, pa novi šav pada tamo gde je i original — bez nabora na mestima gde ih ne treba biti.",
    },
    {
      naslov: "Stari komadi ostaju stari",
      tekst:
        "Kod stilskog nameštaja cilj nije da izgleda kao nov, nego da zadrži karakter. Profili i proporcije se poštuju.",
    },
    {
      naslov: "Direktan dogovor",
      tekst:
        "Razgovarate sa čovekom koji radi na vašem komadu. Nema posrednika ni prepričavanja.",
    },
  ];

  return (
    <Sekcija podloga="sumrak">
      <div className="sadrzaj">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Zaglavlje
              nadnaslov="Zašto Alekom"
              naslov="Ono što se ne vidi drži komad."
              uvod="Presvlaka je vidljivi deo posla. Koliko će trajati zavisi od onoga ispod nje."
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

/**
 * Materijali. Edukativno, bez tvrdnji da postoji katalog, uzorci na stanju
 * ili određeni brendovi — to nije potvrđeno.
 */
export function Materijali() {
  return (
    <Sekcija podloga="platno">
      <div className="sadrzaj">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Zaglavlje
              nadnaslov="Izbor materijala"
              naslov="Šta vredi razmotriti pre izbora tkanine."
              uvod="Nema univerzalno najboljeg materijala — ima onog koji odgovara vašem komadu i načinu na koji ga koristite."
            />
            <Otkrij kasnjenje={160}>
              <Slika
                kljuc="materijali"
                odnos="3 / 2"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="mt-10 rounded-slika"
              />
            </Otkrij>
          </div>
          <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:col-span-7">
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
        </div>
      </div>
    </Sekcija>
  );
}

/** Kako se formira cena. Bez ijedne cifre dok cene nisu potvrđene. */
export function Cena() {
  return (
    <Sekcija podloga="papir" tesna>
      <div className="sadrzaj">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Zaglavlje
              nadnaslov="Cena"
              naslov="Kako se formira cena?"
              uvod="Svaki komad je drugačiji, pa se cena ne može odrediti bez uvida u njegovo stanje. Ovo su faktori koji ulaze u procenu."
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
                nekoliko fotografija i kratak opis komada.
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
