import type { ReactNode } from "react";
import Otkrij from "./Otkrij";

type Podloga = "papir" | "platno" | "sumrak" | "ugljen";

const podloge: Record<Podloga, string> = {
  papir: "bg-papir text-ink",
  platno: "bg-platno text-ink",
  sumrak: "bg-sumrak text-platno zrno",
  ugljen: "bg-ugljen text-platno zrno",
};

/**
 * Sekcija. Ritam sajta se pravi naizmeničnim podlogama — tamne sekcije nose
 * fotografije i emociju, svetle nose čitanje.
 */
export default function Sekcija({
  id,
  podloga = "papir",
  tesna = false,
  className = "",
  children,
}: {
  id?: string;
  podloga?: Podloga;
  tesna?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const tamna = podloga === "sumrak" || podloga === "ugljen";
  return (
    <section
      id={id}
      className={`relative ${podloge[podloga]} ${
        tesna ? "py-sekcija-tesna" : "py-sekcija"
      } ${className}`}
      style={tamna ? { isolation: "isolate" } : undefined}
    >
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}

export function Nadnaslov({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`mb-4 font-body text-eyebrow font-semibold uppercase ${className}`}
    >
      {children}
    </p>
  );
}

/** Zaglavlje sekcije: nadnaslov, naslov, uvodni tekst. */
export function Zaglavlje({
  nadnaslov,
  naslov,
  uvod,
  centrirano = false,
  prigusen = "text-ink-2",
}: {
  nadnaslov?: string;
  naslov: ReactNode;
  uvod?: ReactNode;
  centrirano?: boolean;
  prigusen?: string;
}) {
  return (
    <div className={centrirano ? "mx-auto max-w-tekst text-center" : "max-w-2xl"}>
      {nadnaslov && (
        <Otkrij>
          <Nadnaslov className={prigusen}>{nadnaslov}</Nadnaslov>
        </Otkrij>
      )}
      <Otkrij kasnjenje={60}>
        <h2 className="text-h2">{naslov}</h2>
      </Otkrij>
      {uvod && (
        <Otkrij kasnjenje={120}>
          <p className={`mt-5 text-lede ${prigusen}`}>{uvod}</p>
        </Otkrij>
      )}
    </div>
  );
}

/** Tanka bakarna nit — motiv šava, koristi se kao razdelnik. */
export function Sav({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`sav ${className}`} />;
}
