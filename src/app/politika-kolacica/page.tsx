import type { Metadata } from "next";

import Sekcija from "@/components/ui/Sekcija";
import { site } from "@/data/site";
import { meta } from "@/lib/seo";

export const metadata: Metadata = {
  ...meta({
    title: "Politika kolačića — Tapetarija Alekom",
    description: "Koje kolačiće sajt koristi i kako ih možete odbiti.",
    path: "/politika-kolacica",
  }),
  robots: { index: false, follow: true },
};

/**
 * Stranica postoji, ali se ne linkuje iz interfejsa dok analitika nije
 * konfigurisana — bez GA nema ni cookie bannera ni potrebe za ovim tekstom.
 */
export default function PolitikaKolacica() {
  return (
    <Sekcija podloga="papir" className="pt-40">
      <div className="sadrzaj">
        <div className="max-w-2xl">
          <h1 className="text-h2">Politika kolačića</h1>
          <p className="mt-4 text-malo text-ink-3">
            Poslednje ažuriranje: 19. avgust 2026.
          </p>

          <div className="mt-10 grid gap-9 text-body text-ink-2 [&_h2]:text-[1.14rem] [&_h2]:text-ink [&_p]:mt-2.5 [&_ul]:mt-2.5 [&_ul]:grid [&_ul]:gap-1.5 [&_ul]:pl-5 [&_li]:list-disc">
            <section>
              <h2>Šta su kolačići</h2>
              <p>
                Kolačići su mali fajlovi koje sajt ostavlja u vašem pregledaču.
                Ovaj sajt ih koristi u najmanjoj mogućoj meri.
              </p>
            </section>

            <section>
              <h2>Koje kolačiće koristimo</h2>
              <ul>
                <li>
                  <strong>Neophodni</strong> — pamte vaš izbor u vezi sa
                  analitikom u lokalnom skladištu pregledača (
                  <code>localStorage</code>), da vas ne pitamo pri svakoj poseti.
                </li>
                <li>
                  <strong>Statistika</strong> — Google Analytics 4, isključivo
                  kada postoji validan Measurement ID i kada je prihvatite. Ne
                  učitavamo analitiku pre vašeg pristanka.
                </li>
              </ul>
              <p>
                Ne koristimo kolačiće za reklamiranje ni za praćenje van ovog
                sajta.
              </p>
            </section>

            <section>
              <h2>Kako da odbijete kolačiće</h2>
              <p>
                Statistiku možete odbiti u obaveštenju koje se prikazuje pri
                prvoj poseti. Sajt posle toga radi na isti način. Kolačiće možete
                obrisati i kroz podešavanja svog pregledača.
              </p>
            </section>

            <section>
              <h2>Više informacija</h2>
              <p>
                O obradi ličnih podataka pročitajte u{" "}
                <a
                  href="/politika-privatnosti"
                  className="underline decoration-bakar underline-offset-2"
                >
                  politici privatnosti
                </a>
                . Za pitanja nas kontaktirajte na {site.privacyEmail}.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Sekcija>
  );
}
