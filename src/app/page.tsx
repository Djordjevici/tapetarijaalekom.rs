import Hero from "@/components/sections/Hero";
import PreIPosle from "@/components/sections/PreIPosle";
import Usluge from "@/components/sections/Usluge";
import {
  Cena,
  Materijali,
  Proces,
  TrustTraka,
  ZastoMi,
} from "@/components/sections/Blokovi";
import {
  CestaPitanja,
  Lokacija,
  Procena,
  Recenzije,
  ZavrsniCta,
} from "@/components/sections/Zavrsne";
import Marquee from "@/components/ui/Marquee";
import { activeFaq } from "@/data/content";
import { faqSchema } from "@/lib/seo";

export default function Pocetna() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(activeFaq)) }}
      />

      {/* Ritam sekcija: tamno, tamno, svetlo, tamno, svetlo… */}
      <Hero />
      <TrustTraka />
      <Usluge />
      <PreIPosle />
      <Marquee />
      <Proces />
      <ZastoMi />
      <Materijali />
      <Cena />
      <Recenzije />
      <Procena />
      <CestaPitanja />
      <Lokacija />
      <ZavrsniCta />
    </>
  );
}
