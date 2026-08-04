import type { Metadata } from "next";

import { Lokacija, Procena } from "@/components/sections/Zavrsne";
import Sekcija, { Zaglavlje } from "@/components/ui/Sekcija";
import { breadcrumbSchema, meta } from "@/lib/seo";

export const metadata: Metadata = meta({
  title: "Kontakt — Tapetarija Alekom, Petrovaradin",
  description:
    "Tunislava Paunovića 24, Petrovaradin, Novi Sad. Pozovite 064 24 96 345 ili pošaljite fotografije za procenu.",
  path: "/kontakt",
});

export default function KontaktStrana() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Početna", path: "/" },
              { name: "Kontakt", path: "/kontakt" },
            ]),
          ),
        }}
      />

      <Sekcija podloga="ugljen" className="pt-40" tesna>
        <div className="sadrzaj">
          <Zaglavlje
            nadnaslov="Kontakt"
            naslov="Javite se — dogovorimo se."
            glavni
            uvod="Najbrže je telefonom. Ako vam je lakše, pošaljite fotografije kroz formu i mi se javljamo."
            prigusen="text-mist-2"
          />
        </div>
      </Sekcija>

      <Procena />
      <Lokacija />
    </>
  );
}
