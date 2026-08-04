"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

import { analyticsId } from "@/data/site";

const KLJUC = "alekom-pristanak";

/**
 * Cookie banner postoji samo kada je GA4 stvarno konfigurisan.
 * Analitika se ne učitava pre pristanka korisnika.
 */
export default function CookieConsent() {
  const [stanje, setStanje] = useState<"cekanje" | "prihvaceno" | "odbijeno">(
    "cekanje",
  );

  useEffect(() => {
    if (!analyticsId) return;
    const sacuvano = localStorage.getItem(KLJUC);
    if (sacuvano === "prihvaceno" || sacuvano === "odbijeno") {
      setStanje(sacuvano);
    }
  }, []);

  if (!analyticsId) return null;

  const odluci = (vrednost: "prihvaceno" | "odbijeno") => {
    localStorage.setItem(KLJUC, vrednost);
    setStanje(vrednost);
  };

  return (
    <>
      {stanje === "prihvaceno" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${analyticsId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {stanje === "cekanje" && (
        <div
          role="region"
          aria-label="Obaveštenje o kolačićima"
          className="fixed inset-x-3 bottom-3 z-[70] border border-linija-tamna bg-sumrak p-5 text-platno shadow-2xl md:inset-x-auto md:right-5 md:max-w-md"
        >
          <p className="text-malo leading-relaxed text-mist-2">
            Koristimo kolačiće za anonimnu statistiku posećenosti. Možete
            odbiti — sajt radi isto.{" "}
            <Link href="/politika-kolacica" className="underline">
              Politika kolačića
            </Link>
          </p>
          <div className="mt-4 flex gap-2.5">
            <button
              type="button"
              onClick={() => odluci("prihvaceno")}
              className="min-h-[44px] flex-1 bg-bakar px-4 text-malo font-semibold text-white"
            >
              Prihvatam
            </button>
            <button
              type="button"
              onClick={() => odluci("odbijeno")}
              className="min-h-[44px] flex-1 border border-mist-3 px-4 text-malo font-semibold"
            >
              Odbijam
            </button>
          </div>
        </div>
      )}
    </>
  );
}
