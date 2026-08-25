import type { Metadata } from "next";

import Sekcija from "@/components/ui/Sekcija";
import { allowIndexing, site } from "@/data/site";
import { meta } from "@/lib/seo";

export const metadata: Metadata = {
  ...meta({
    title: "Politika privatnosti — Tapetarija Alekom",
    description:
      "Kako Tapetarija Alekom obrađuje podatke iz upita i priloženih fotografija.",
    path: "/politika-privatnosti",
  }),
  robots: { index: false, follow: allowIndexing },
};

/**
 * NACRT politike privatnosti.
 *
 * Poslovni podaci i tok obrade su popunjeni. Tekst i predloženi rok čuvanja od
 * 12 meseci mora pravno da se pregleda pre produkcionog uključivanja forme.
 */
export default function PolitikaPrivatnosti() {
  return (
    <Sekcija podloga="papir" className="pt-40">
      <div className="sadrzaj">
        <div className="max-w-2xl">
          <h1 className="text-h2">Politika privatnosti</h1>
          <p className="mt-4 text-malo text-ink-3">
            Poslednje ažuriranje: 19. avgust 2026.
          </p>

          <div className="mt-10 grid gap-9 text-body text-ink-2 [&_h2]:text-[1.14rem] [&_h2]:text-ink [&_p]:mt-2.5 [&_ul]:mt-2.5 [&_ul]:grid [&_ul]:gap-1.5 [&_ul]:pl-5 [&_li]:list-disc">
            <section>
              <h2>Ko upravlja vašim podacima</h2>
              <p>
                Podacima upravlja {site.legal.registeredName}, sa sedištem na
                adresi {site.address.full}, PIB {site.legal.taxId}, matični broj{" "}
                {site.legal.registrationNumber}. Za sva pitanja u vezi sa
                obradom podataka možete nas kontaktirati na{" "}
                <a
                  href={`mailto:${site.privacyEmail}`}
                  className="underline decoration-bakar underline-offset-2"
                >
                  {site.privacyEmail}
                </a>{" "}
                ili telefonom na {site.phone.display}.
              </p>
            </section>

            <section>
              <h2>Koje podatke prikupljamo</h2>
              <p>Kada pošaljete upit kroz formu na sajtu, prikupljamo:</p>
              <ul>
                <li>ime i prezime;</li>
                <li>broj telefona;</li>
                <li>email adresu, ako je unesete;</li>
                <li>izabranu uslugu i opis komada koji ste napisali;</li>
                <li>približne dimenzije, lokaciju i željeni rok, ako ih unesete;</li>
                <li>željeni način kontakta;</li>
                <li>fotografije koje priložite uz upit.</li>
              </ul>
              <p>
                Ne prikupljamo podatke o plaćanju i ne tražimo podatke koji nisu
                potrebni za odgovor na vaš upit.
              </p>
            </section>

            <section>
              <h2>Podaci iz priloženih fotografija</h2>
              <p>
                Fotografije koje pošaljete koristimo isključivo da bismo
                procenili stanje komada i pripremili odgovor. Fotografije mogu
                sadržati i podatke o okruženju u kom je komad snimljen, kao i
                tehničke podatke zapisane u samom fajlu. Ne objavljujemo
                priložene fotografije i ne koristimo ih za portfolio, društvene
                mreže ili marketing bez vaše posebne, dodatne saglasnosti.
              </p>
            </section>

            <section>
              <h2>Zašto obrađujemo podatke</h2>
              <p>
                Podatke obrađujemo da bismo odgovorili na vaš upit, pripremili
                okvirnu procenu i dogovorili naredne korake. Ne koristimo ih za
                automatizovano odlučivanje ni za profilisanje.
              </p>
            </section>

            <section>
              <h2>Pravni osnov</h2>
              <p>
                Obrada se zasniva na vašoj saglasnosti, koju dajete označavanjem
                polja pre slanja upita, i na potrebi da preduzmemo radnje pre
                eventualnog zaključenja posla. Saglasnost možete povući u svakom
                trenutku, bez posledica na obradu koja je već izvršena.
              </p>
            </section>

            <section>
              <h2>Kome se podaci prosleđuju</h2>
              <p>
                Podatke ne prodajemo i ne prosleđujemo trećim licima u
                marketinške svrhe. U tehničkoj obradi nam pomažu:
              </p>
              <ul>
                <li>
                  naš hosting provajder — infrastruktura i tehnička isporuka
                  sajta preko naše Coolify instalacije;
                </li>
                <li>Resend — dostava upita na poslovnu email adresu;</li>
                <li>
                  Google Analytics 4 — statistika posećenosti, samo ako je
                  aktivirana i ako korisnik prethodno pristane.
                </li>
              </ul>
              <p>
                Podaci se mogu obrađivati i van Republike Srbije, uz mere zaštite
                koje ti servisi primenjuju.
              </p>
            </section>

            <section>
              <h2>Koliko dugo čuvamo podatke</h2>
              <p>
                Upite i priložene fotografije čuvamo najduže{" "}
                {site.privacyRetentionMonths} meseci, nakon čega ih brišemo. Ako
                od upita nastane posao, podatke potrebne za evidenciju čuvamo u
                rokovima propisanim zakonom.
              </p>
            </section>

            <section>
              <h2>Vaša prava</h2>
              <p>U svakom trenutku imate pravo da:</p>
              <ul>
                <li>tražite pristup podacima koje o vama imamo;</li>
                <li>tražite ispravku netačnih podataka;</li>
                <li>tražite brisanje podataka;</li>
                <li>tražite ograničenje obrade;</li>
                <li>povučete saglasnost;</li>
                <li>
                  podnesete pritužbu Povereniku za informacije od javnog značaja
                  i zaštitu podataka o ličnosti.
                </li>
              </ul>
              <p>
                Zahtev nam pošaljite na {site.privacyEmail}. Odgovaramo u roku
                propisanom zakonom.
              </p>
            </section>

            <section>
              <h2>Bezbednost podataka</h2>
              <p>
                Sajt koristi šifrovanu vezu. Pristup upitima imaju samo lica
                kojima je to potrebno da bi odgovorila na vaš zahtev. Fotografije
                i podatke iz upita ne držimo duže nego što je navedeno.
              </p>
            </section>

            <section>
              <h2>Izmene ove politike</h2>
              <p>
                Politiku možemo ažurirati kada se promene servisi koje koristimo
                ili obim podataka koje prikupljamo. Datum poslednje izmene je
                naveden na početku stranice.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Sekcija>
  );
}
