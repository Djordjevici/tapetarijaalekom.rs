import FormaProcena from "@/components/form/FormaProcena";
import Faq from "@/components/sections/Faq";
import Otkrij from "@/components/ui/Otkrij";
import Sekcija, { Zaglavlje } from "@/components/ui/Sekcija";
import { activeFaq, reviews } from "@/data/content";
import {
  flags,
  site,
  telLink,
  viberLink,
  whatsappLink,
} from "@/data/site";

/** Glavna konverzija: slanje fotografija za procenu. */
export function Procena() {
  return (
    <Sekcija id="procena" podloga="sumrak">
      <div className="sadrzaj">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Zaglavlje
              nadnaslov="Procena"
              naslov="Pošaljite fotografije i zatražite besplatnu okvirnu procenu."
              uvod="Oko tri fotografije i osnovne informacije dovoljne su za početnu procenu. Konačnu ponudu definišemo nakon pregleda komada uživo."
              prigusen="text-mist-2"
            />
            <Otkrij kasnjenje={200}>
              <ul className="mt-9 grid gap-4 border-t border-linija-tamna pt-7">
                {[
                  "Oko 3 fotografije iz više uglova",
                  "Približne dimenzije komada",
                  "Broj komada, lokacija i šta želite da se promeni",
                ].map((s) => (
                  <li key={s} className="flex gap-3.5 text-malo text-mist-2">
                    <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-bakar" />
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-7 text-malo text-mist-3">
                Ako vam je lakše telefonom —{" "}
                <a
                  href={telLink}
                  className="font-semibold text-platno underline decoration-bakar underline-offset-4"
                >
                  {site.phone.display}
                </a>
                {flags.viber && (
                  <>
                    {" "}
                    ili{" "}
                    <a
                      href={viberLink}
                      className="font-semibold text-platno underline decoration-bakar underline-offset-4"
                    >
                      pišite na Viber
                    </a>
                  </>
                )}
              </p>
            </Otkrij>
          </div>

          <Otkrij className="lg:col-span-7" kasnjenje={120}>
            <FormaProcena />
          </Otkrij>
        </div>
      </div>
    </Sekcija>
  );
}

/** FAQ sa odgovorima koji ne zahtevaju nepotvrđene podatke. */
export function CestaPitanja() {
  if (!activeFaq.length) return null;
  return (
    <Sekcija podloga="papir">
      <div className="sadrzaj">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Zaglavlje nadnaslov="Česta pitanja" naslov="Pitanja koja najčešće dobijamo." />
          </div>
          <Otkrij className="lg:col-span-8">
            <Faq />
          </Otkrij>
        </div>
      </div>
    </Sekcija>
  );
}

/**
 * Recenzije. Ne renderuje se dok nema autentičnih — bez praznog prostora,
 * bez lažnih kartica i bez Google ocene bez konteksta.
 */
export function Recenzije() {
  if (!flags.reviews || reviews.length === 0) return null;

  return (
    <Sekcija podloga="platno">
      <div className="sadrzaj">
        <Zaglavlje nadnaslov="Recenzije" naslov="Šta kažu klijenti." />
        <ul className="mt-12 grid gap-7 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Otkrij as="li" key={`${r.author}-${i}`} kasnjenje={i * 80}>
              <figure className="flex h-full flex-col border border-linija-svetla bg-white p-7">
                <div aria-hidden className="mb-4 flex gap-1 text-bakar">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <span key={k}>★</span>
                  ))}
                </div>
                <blockquote className="flex-1 text-body text-ink-2">
                  {r.text}
                </blockquote>
                <figcaption className="mt-6 border-t border-linija-svetla pt-4 text-malo text-ink-3">
                  <span className="font-semibold text-ink">{r.author}</span>
                  {" · "}
                  {new Date(r.date).toLocaleDateString("sr-RS")}
                  {" · "}
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {r.source}
                    </a>
                  ) : (
                    r.source
                  )}
                </figcaption>
              </figure>
            </Otkrij>
          ))}
        </ul>
      </div>
    </Sekcija>
  );
}

/** Lokacija, kontakt, radno vreme i područje rada. */
export function Lokacija() {
  return (
    <Sekcija id="kontakt" podloga="ugljen">
      <div className="sadrzaj">
        <div className="grid gap-11 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Zaglavlje
              nadnaslov="Gde smo"
              naslov="Radionica u Petrovaradinu."
              uvod={site.visitNote}
              prigusen="text-mist-2"
            />
            <Otkrij kasnjenje={140}>
              <dl className="mt-9 grid gap-6 border-t border-linija-tamna pt-7">
                <div>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-mist-3">
                    Adresa
                  </dt>
                  <dd className="mt-1.5 text-body text-mist-1">
                    {site.address.streetAddress}
                    <br />
                    {site.address.postalCode} {site.address.addressLocality},{" "}
                    {site.address.addressRegion}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-mist-3">
                    Poruke
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-malo">
                    <a
                      href={viberLink}
                      className="text-platno underline decoration-bakar underline-offset-4"
                    >
                      Viber
                    </a>
                    <a
                      href={whatsappLink}
                      className="text-mist-2 underline decoration-mist-3 underline-offset-4"
                    >
                      WhatsApp
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-mist-3">
                    Telefon
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href={telLink}
                      className="text-body text-platno underline decoration-bakar underline-offset-4"
                    >
                      {site.phone.display}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-mist-3">
                    Radno vreme
                  </dt>
                  <dd className="mt-1.5 text-body text-mist-2">
                    {site.hours.weekdays}
                    <br />
                    {site.hours.weekend}
                    <span className="mt-1 block text-malo text-mist-3">
                      {site.hours.holidayNote}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-mist-3">
                    Područje rada
                  </dt>
                  <dd className="mt-1.5 text-body text-mist-2">
                    {site.serviceArea}
                  </dd>
                </div>
              </dl>
              <a
                href={site.maps.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-3 text-malo font-semibold text-platno transition-colors hover:text-bakar-svetli"
              >
                Otvorite u Google mapama
                <span
                  aria-hidden
                  className="h-px w-8 bg-bakar transition-all duration-500 ease-meko group-hover:w-12"
                />
              </a>
            </Otkrij>
          </div>

          <Otkrij className="lg:col-span-7" kasnjenje={100}>
            <div
              className="overflow-hidden rounded-slika border border-linija-tamna"
              style={{ aspectRatio: "4 / 3" }}
            >
              <iframe
                src={site.maps.embed}
                title={`Lokacija ${site.name} na mapi`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full grayscale-[0.35]"
              />
            </div>
          </Otkrij>
        </div>
      </div>
    </Sekcija>
  );
}

/** Završni CTA. Jak, ali jednostavan — bez ponavljanja cele forme. */
export function ZavrsniCta() {
  return (
    <Sekcija podloga="sumrak" tesna>
      <div className="sadrzaj text-center">
        <Otkrij>
          <p className="font-display text-[1.15rem] italic text-bakar-svetli">
            {site.slogan}
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl text-h2">
            Vaš nameštaj verovatno ne treba menjati.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lede text-mist-2">
            Pošaljite fotografiju i saznajte šta se može uraditi.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#procena"
              className="flex min-h-[54px] w-full items-center justify-center bg-bakar-dugme px-8 text-[0.94rem] font-semibold text-white transition-colors duration-300 hover:bg-bakar-dugme-hover sm:w-auto"
            >
              Pošaljite fotografiju za procenu
            </a>
            <a
              href={telLink}
              className="flex min-h-[54px] w-full items-center justify-center border border-mist-3 px-8 text-[0.94rem] font-semibold transition-colors duration-300 hover:border-bakar hover:text-bakar-svetli sm:w-auto"
            >
              Pozovite {site.phone.display}
            </a>
          </div>
        </Otkrij>
      </div>
    </Sekcija>
  );
}
