import Link from "next/link";

import Sekcija from "@/components/ui/Sekcija";
import { site, telLink } from "@/data/site";

export default function NijeNadjeno() {
  return (
    <Sekcija podloga="ugljen" className="pt-40">
      <div className="sadrzaj">
        <p className="text-eyebrow font-semibold uppercase text-mist-3">404</p>
        <h1 className="mt-5 max-w-xl text-h2">
          Ova stranica ne postoji.
        </h1>
        <p className="mt-5 max-w-md text-lede text-mist-2">
          Možda je link zastareo. Pogledajte usluge ili nas pozovite.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex min-h-[52px] items-center justify-center bg-bakar px-6 text-malo font-semibold text-white transition-colors hover:bg-bakar-svetli"
          >
            Na početnu
          </Link>
          <a
            href={telLink}
            className="flex min-h-[52px] items-center justify-center border border-mist-3 px-6 text-malo font-semibold transition-colors hover:border-bakar hover:text-bakar-svetli"
          >
            Pozovite {site.phone.display}
          </a>
        </div>
      </div>
    </Sekcija>
  );
}
