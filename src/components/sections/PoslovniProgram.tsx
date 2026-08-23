import Otkrij from "@/components/ui/Otkrij";
import Sekcija, { Zaglavlje } from "@/components/ui/Sekcija";
import { businessClients, references } from "@/data/business";

/**
 * B2B segment i javno odobrene reference. Namerno bez logotipa i opisa
 * projekata: imamo dozvolu za imena, ali ne i proverene detalje radova.
 */
export default function PoslovniProgram() {
  return (
    <Sekcija podloga="papir">
      <div className="sadrzaj">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Zaglavlje
              nadnaslov="Poslovni enterijeri"
              naslov="Tapacirana rešenja za prostore koji rade svaki dan."
              uvod="Za ugostiteljske i poslovne enterijere radimo pojedinačne komade, serije stolica, klupe, separee i druga tapacirana rešenja prema projektu."
            />
            <Otkrij kasnjenje={160}>
              <p className="mt-7 border-l-2 border-bakar pl-4 text-body text-ink-2">
                Sarađujemo sa vlasnicima prostora, dizajnerima enterijera i
                arhitektama. Materijal i dinamiku rada dogovaramo prema projektu,
                bez unapred obećanog roka ili obima koji nismo pregledali.
              </p>
            </Otkrij>
          </div>

          <div className="lg:col-span-7">
            <ul className="grid gap-3 sm:grid-cols-2">
              {businessClients.map((client, i) => (
                <Otkrij as="li" key={client} kasnjenje={i * 55}>
                  <div className="flex min-h-[72px] items-center border-b border-linija-svetla py-4 text-body text-ink-2">
                    <span aria-hidden className="mr-4 h-px w-6 shrink-0 bg-bakar" />
                    {client}
                  </div>
                </Otkrij>
              ))}
            </ul>

            <Otkrij kasnjenje={260}>
              <div className="mt-12 border border-linija-svetla bg-platno/45 p-7 sm:p-9">
                <p className="text-eyebrow font-semibold uppercase text-ink-3">
                  Reference
                </p>
                <p className="mt-3 max-w-xl text-malo text-ink-2">
                  Neke od organizacija i prostora sa kojima je radionica
                  sarađivala:
                </p>
                <ul className="mt-7 grid gap-5 sm:grid-cols-3">
                  {references.map((reference) => (
                    <li
                      key={reference}
                      className="border-t border-bakar pt-4 font-display text-[1.08rem]"
                    >
                      {reference}
                    </li>
                  ))}
                </ul>
              </div>
            </Otkrij>
          </div>
        </div>
      </div>
    </Sekcija>
  );
}
