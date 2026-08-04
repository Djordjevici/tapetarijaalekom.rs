"use client";

import { useEffect, useState } from "react";

import { site, telLink } from "@/data/site";

/**
 * Diskretna traka na dnu telefona. Samo dve akcije, po dogovorenom prioritetu:
 * poziv je primarni na mobilnom, slanje fotografije sekundarni.
 */
export default function MobileActionBar() {
  const [vidljiva, setVidljiva] = useState(false);

  useEffect(() => {
    const naSkrol = () => setVidljiva(window.scrollY > 520);
    naSkrol();
    window.addEventListener("scroll", naSkrol, { passive: true });
    return () => window.removeEventListener("scroll", naSkrol);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-linija-tamna bg-sumrak/97 backdrop-blur-md transition-transform duration-500 ease-meko md:hidden ${
        vidljiva ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={telLink}
        className="flex min-h-[56px] items-center justify-center gap-2 text-malo font-semibold text-white"
      >
        <span aria-hidden>✆</span> Pozovite odmah
        <span className="sr-only">{site.phone.display}</span>
      </a>
      <a
        href="#procena"
        className="flex min-h-[56px] items-center justify-center border-l border-linija-tamna text-malo font-semibold text-platno"
      >
        Pošaljite fotografiju
      </a>
    </div>
  );
}
