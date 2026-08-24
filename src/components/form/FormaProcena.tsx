"use client";

import { useRef, useState } from "react";

import {
  contactFormEnabled,
  flags,
  site,
  telLink,
  viberLink,
  whatsappLink,
} from "@/data/site";
import { services } from "@/data/services";

const MAX_SLIKA = 5;
const MAX_PO_SLICI = 2 * 1024 * 1024;
// Ograničavamo opterećenje servera i email priloge; ostavljamo rezervu za multipart overhead.
const MAX_UKUPNO = 4 * 1024 * 1024;
const TIPOVI = ["image/jpeg", "image/png", "image/webp"];

type Stanje = "mirno" | "slanje" | "uspeh" | "greska";

interface Greske {
  ime?: string;
  telefon?: string;
  email?: string;
  usluga?: string;
  opis?: string;
  slike?: string;
  kontakt?: string;
  pristanak?: string;
}

interface Prilog {
  file: File;
  url: string;
}

/**
 * Kompresija na klijentu. Fotografije sa telefona su često 6–12 MB, a za
 * procenu je dovoljna duža strana od 1600 px — bez ovoga zahtev ne bi prošao.
 */
async function kompresuj(file: File): Promise<File> {
  if (!TIPOVI.includes(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const maks = 1600;
    const skala = Math.min(1, maks / Math.max(bitmap.width, bitmap.height));
    if (skala === 1 && file.size <= MAX_PO_SLICI) return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * skala);
    canvas.height = Math.round(bitmap.height * skala);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", 0.78),
    );
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", {
      type: "image/jpeg",
    });
  } catch {
    return file;
  }
}

export default function FormaProcena() {
  const [prilozi, setPrilozi] = useState<Prilog[]>([]);
  const [greske, setGreske] = useState<Greske>({});
  const [stanje, setStanje] = useState<Stanje>("mirno");
  const [obrada, setObrada] = useState(false);
  const forma = useRef<HTMLFormElement>(null);
  const unos = useRef<HTMLInputElement>(null);

  const dodaj = async (lista: FileList | null) => {
    if (!lista?.length) return;
    setObrada(true);
    const novi: Prilog[] = [];
    let poruka = "";

    for (const f of Array.from(lista)) {
      if (prilozi.length + novi.length >= MAX_SLIKA) {
        poruka = `Najviše ${MAX_SLIKA} fotografija.`;
        break;
      }
      if (!TIPOVI.includes(f.type)) {
        poruka = "Dozvoljeni formati su JPG, PNG i WebP.";
        continue;
      }
      const smanjen = await kompresuj(f);
      if (smanjen.size > MAX_PO_SLICI) {
        poruka = `Fotografija „${f.name}“ je prevelika i posle smanjenja.`;
        continue;
      }
      novi.push({ file: smanjen, url: URL.createObjectURL(smanjen) });
    }

    const ukupno = [...prilozi, ...novi].reduce((s, p) => s + p.file.size, 0);
    if (ukupno > MAX_UKUPNO) {
      poruka = "Ukupna veličina fotografija je prevelika. Pošaljite manje slika.";
      novi.forEach((p) => URL.revokeObjectURL(p.url));
      setObrada(false);
      setGreske((g) => ({ ...g, slike: poruka }));
      return;
    }

    setPrilozi((p) => [...p, ...novi].slice(0, MAX_SLIKA));
    setGreske((g) => ({ ...g, slike: poruka || undefined }));
    setObrada(false);
  };

  const ukloni = (i: number) => {
    setPrilozi((p) => {
      const cilj = p[i];
      if (cilj) URL.revokeObjectURL(cilj.url);
      return p.filter((_, j) => j !== i);
    });
  };

  const posalji = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (stanje === "slanje") return; // zaštita od dvostrukog slanja

    const fd = new FormData(e.currentTarget);
    const ime = String(fd.get("ime") ?? "").trim();
    const telefon = String(fd.get("telefon") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const usluga = String(fd.get("usluga") ?? "").trim();
    const opis = String(fd.get("opis") ?? "").trim();
    const kontakt = String(fd.get("kontakt") ?? "").trim();
    const pristanak = fd.get("pristanak") === "on";

    const g: Greske = {};
    if (ime.length < 2) g.ime = "Unesite ime i prezime.";
    if (!/^[+\d][\d\s/()-]{7,}$/.test(telefon))
      g.telefon = "Unesite broj telefona na koji možemo da vas dobijemo.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      g.email = "Proverite email adresu.";
    if (!usluga) g.usluga = "Izaberite vrstu usluge.";
    if (opis.length < 10)
      g.opis = "Napišite u nekoliko reči o kom komadu je reč.";
    if (prilozi.length < 1)
      g.slike = "Dodajte najmanje jednu fotografiju komada.";
    if (!["poziv", "sms", "viber", "email"].includes(kontakt))
      g.kontakt = "Izaberite kako želite da vam odgovorimo.";
    if (kontakt === "email" && !email)
      g.email = "Unesite email adresu ako želite odgovor emailom.";
    if (!pristanak)
      g.pristanak = "Potrebna je saglasnost da bismo mogli da vas kontaktiramo.";

    setGreske(g);
    if (Object.keys(g).length) {
      requestAnimationFrame(() => {
        const prvo =
          forma.current?.querySelector<HTMLElement>("[aria-invalid='true']");
        prvo?.focus();
      });
      return;
    }

    // Bez potvrđenog servisa za slanje forma ne obrađuje lične podatke.
    if (!contactFormEnabled) {
      setStanje("greska");
      return;
    }

    setStanje("slanje");
    try {
      const telo = new FormData();
      telo.set("ime", ime);
      telo.set("telefon", telefon);
      telo.set("email", email);
      telo.set("usluga", usluga);
      telo.set("opis", opis);
      telo.set("dimenzije", String(fd.get("dimenzije") ?? "").trim());
      telo.set("lokacija", String(fd.get("lokacija") ?? "").trim());
      telo.set("rok", String(fd.get("rok") ?? "").trim());
      telo.set("kontakt", kontakt);
      telo.set("pristanak", pristanak ? "da" : "");
      telo.set("zamka", String(fd.get("zamka") ?? ""));
      prilozi.forEach((p) => telo.append("slike", p.file));

      const odgovor = await fetch("/api/upit", { method: "POST", body: telo });
      const podaci = (await odgovor.json()) as { ok?: boolean };
      if (!odgovor.ok || !podaci.ok) throw new Error("neuspelo");

      setStanje("uspeh");
      forma.current?.reset();
      prilozi.forEach((p) => URL.revokeObjectURL(p.url));
      setPrilozi([]);
    } catch {
      setStanje("greska");
    }
  };

  if (stanje === "uspeh") {
    return (
      <div
        role="status"
        className="border border-bakar/50 bg-sumrak/40 p-8 text-center"
      >
        <p className="font-display text-[1.4rem] text-platno">
          Upit je poslat.
        </p>
        <p className="mx-auto mt-3 max-w-sm text-malo text-mist-2">
          Javićemo vam se na kontakt koji ste ostavili, da zajedno prođemo kroz
          mogućnosti obnove.
        </p>
        <button
          type="button"
          onClick={() => setStanje("mirno")}
          className="mt-6 min-h-[44px] border border-mist-3 px-5 text-malo font-semibold text-platno"
        >
          Pošaljite još jedan upit
        </button>
      </div>
    );
  }

  const polje =
    "w-full border border-linija-tamna bg-transparent px-4 py-3.5 text-body text-platno " +
    "placeholder:text-mist-3 focus:border-bakar focus:outline-none focus-visible:outline-none";

  return (
    <form ref={forma} onSubmit={posalji} noValidate className="grid gap-5">
      {/* zamka za botove, skrivena od korisnika i čitača ekrana */}
      <input
        type="text"
        name="zamka"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute h-0 w-0 opacity-0"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ime" className="mb-2 block text-malo text-mist-2">
            Ime i prezime <span className="text-bakar">*</span>
          </label>
          <input
            id="ime"
            name="ime"
            autoComplete="name"
            maxLength={100}
            required
            aria-invalid={Boolean(greske.ime)}
            aria-describedby={greske.ime ? "greska-ime" : undefined}
            className={polje}
            placeholder="Marko Marković"
          />
          {greske.ime && (
            <p id="greska-ime" className="mt-2 text-malo text-bakar-svetli">
              {greske.ime}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="telefon" className="mb-2 block text-malo text-mist-2">
            Telefon <span className="text-bakar">*</span>
          </label>
          <input
            id="telefon"
            name="telefon"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={40}
            required
            aria-invalid={Boolean(greske.telefon)}
            aria-describedby={greske.telefon ? "greska-telefon" : undefined}
            className={polje}
            placeholder="06X XXX XXXX"
          />
          {greske.telefon && (
            <p id="greska-telefon" className="mt-2 text-malo text-bakar-svetli">
              {greske.telefon}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-malo text-mist-2">
            Email <span className="text-mist-3">(nije obavezno)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            aria-invalid={Boolean(greske.email)}
            aria-describedby={greske.email ? "greska-email" : undefined}
            className={polje}
            placeholder="vas@email.rs"
          />
          {greske.email && (
            <p id="greska-email" className="mt-2 text-malo text-bakar-svetli">
              {greske.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="usluga" className="mb-2 block text-malo text-mist-2">
            Vrsta usluge <span className="text-bakar">*</span>
          </label>
          <select
            id="usluga"
            name="usluga"
            required
            className={polje}
            defaultValue=""
            aria-invalid={Boolean(greske.usluga)}
            aria-describedby={greske.usluga ? "greska-usluga" : undefined}
          >
            <option value="" disabled className="bg-sumrak">
              Izaberite uslugu
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.title} className="bg-sumrak">
                {s.title}
              </option>
            ))}
            <option value="Drugo / nisam siguran" className="bg-sumrak">
              Drugo / nisam siguran
            </option>
          </select>
          {greske.usluga && (
            <p id="greska-usluga" className="mt-2 text-malo text-bakar-svetli">
              {greske.usluga}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="opis" className="mb-2 block text-malo text-mist-2">
          Opišite komad <span className="text-bakar">*</span>
        </label>
        <textarea
          id="opis"
          name="opis"
          rows={4}
          maxLength={3000}
          required
          aria-invalid={Boolean(greske.opis)}
          aria-describedby={greske.opis ? "greska-opis" : "pomoc-opis"}
          className={`${polje} resize-none`}
          placeholder="Npr. trosed na rasklapanje, dužina oko 220 cm, eko-koža se ljušti na naslonima."
        />
        {greske.opis ? (
          <p id="greska-opis" className="mt-2 text-malo text-bakar-svetli">
            {greske.opis}
          </p>
        ) : (
          <p id="pomoc-opis" className="mt-2 text-malo text-mist-3">
            Korisno je napisati približne dimenzije i šta želite da se promeni.
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label
            htmlFor="dimenzije"
            className="mb-2 block text-malo text-mist-2"
          >
            Približne dimenzije{" "}
            <span className="text-mist-3">(opciono)</span>
          </label>
          <input
            id="dimenzije"
            name="dimenzije"
            maxLength={200}
            className={polje}
            placeholder="npr. 220 × 90 cm"
          />
        </div>
        <div>
          <label htmlFor="lokacija" className="mb-2 block text-malo text-mist-2">
            Lokacija <span className="text-mist-3">(opciono)</span>
          </label>
          <input
            id="lokacija"
            name="lokacija"
            autoComplete="address-level2"
            maxLength={200}
            className={polje}
            placeholder="npr. Novi Sad"
          />
        </div>
        <div>
          <label htmlFor="rok" className="mb-2 block text-malo text-mist-2">
            Željeni rok <span className="text-mist-3">(opciono)</span>
          </label>
          <input
            id="rok"
            name="rok"
            maxLength={200}
            className={polje}
            placeholder="npr. tokom septembra"
          />
        </div>
      </div>

      <div>
        <span id="naslov-slike" className="mb-2 block text-malo text-mist-2">
          Fotografije <span className="text-bakar">*</span>{" "}
          <span className="text-mist-3">(preporučene 3, najviše {MAX_SLIKA})</span>
        </span>
        <label
          htmlFor="slike"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void dodaj(e.dataTransfer.files);
          }}
          className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-linija-tamna px-5 py-8 text-center transition-colors duration-300 hover:border-bakar"
        >
          <span className="text-body text-platno">
            {obrada ? "Priprema fotografija…" : "Izaberite ili prevucite fotografije"}
          </span>
          <span className="mt-1.5 text-malo text-mist-3">
            JPG, PNG ili WebP. Velike slike se automatski smanjuju.
          </span>
        </label>
        <input
          ref={unos}
          id="slike"
          name="slike"
          type="file"
          accept={TIPOVI.join(",")}
          multiple
          onChange={(e) => {
            void dodaj(e.target.files);
            e.target.value = "";
          }}
          aria-describedby={greske.slike ? "greska-slike" : undefined}
          aria-labelledby="naslov-slike"
          aria-invalid={Boolean(greske.slike)}
          required
          className="sr-only"
        />
        {greske.slike && (
          <p id="greska-slike" className="mt-2 text-malo text-bakar-svetli">
            {greske.slike}
          </p>
        )}

        {prilozi.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {prilozi.map((p, i) => (
              <li key={p.url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={`Priložena fotografija ${i + 1}`}
                  className="h-20 w-20 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => ukloni(i)}
                  aria-label={`Uklonite fotografiju ${i + 1}`}
                  className="absolute -right-3 -top-3 grid h-11 w-11 place-items-center rounded-full border border-linija-tamna bg-ugljen text-platno"
                >
                  <span aria-hidden>×</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <fieldset
        aria-invalid={Boolean(greske.kontakt)}
        aria-describedby={greske.kontakt ? "greska-kontakt" : undefined}
      >
        <legend className="mb-2 block text-malo text-mist-2">
          Kako želite da vas kontaktiramo
        </legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2.5">
          {[
            { v: "poziv", l: "Poziv", prikazi: true },
            { v: "sms", l: "SMS", prikazi: true },
            { v: "viber", l: "Viber", prikazi: flags.viber },
            { v: "email", l: "Email", prikazi: true },
          ]
            .filter((o) => o.prikazi)
            .map((o, i) => (
              <label
                key={o.v}
                className="flex min-h-[44px] cursor-pointer items-center gap-2.5 text-malo"
              >
                <input
                  type="radio"
                  name="kontakt"
                  value={o.v}
                  defaultChecked={i === 0}
                  className="h-5 w-5 accent-bakar"
                />
                {o.l}
              </label>
            ))}
        </div>
        {greske.kontakt && (
          <p id="greska-kontakt" className="mt-2 text-malo text-bakar-svetli">
            {greske.kontakt}
          </p>
        )}
      </fieldset>

      <div>
        <label className="flex min-h-[44px] cursor-pointer items-start gap-3 py-2 text-malo text-mist-2">
          <input
            type="checkbox"
            name="pristanak"
            required
            aria-invalid={Boolean(greske.pristanak)}
            aria-describedby={greske.pristanak ? "greska-pristanak" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-bakar"
          />
          <span>
            Saglasan sam da se moji podaci i priložene fotografije koriste radi
            odgovora na ovaj upit.{" "}
            <a
              href="/politika-privatnosti"
              className="underline decoration-bakar underline-offset-2"
            >
              Politika privatnosti
            </a>
          </span>
        </label>
        {greske.pristanak && (
          <p id="greska-pristanak" className="mt-2 text-malo text-bakar-svetli">
            {greske.pristanak}
          </p>
        )}
      </div>

      {/* Bez konfigurisanog servisa za slanje ne obrađujemo lične podatke. */}
      {!contactFormEnabled && (
        <p className="border-l-2 border-bakar bg-sumrak/40 px-4 py-3 text-malo text-mist-2">
          Online slanje još nije aktivno. Pozovite{" "}
          <a href={telLink} className="font-semibold text-platno underline">
            {site.phone.display}
          </a>
          {flags.viber && (
            <>
              {" "}
              ili pošaljite fotografije putem{" "}
              <a
                href={viberLink}
                className="font-semibold text-platno underline"
              >
                Vibera
              </a>
            </>
          )}
          .
        </p>
      )}

      {stanje === "greska" && (
        <p role="alert" className="text-malo text-bakar-svetli">
          {contactFormEnabled
            ? "Slanje nije uspelo. Pozovite nas ili pokušajte ponovo."
            : "Slanje sa sajta trenutno nije dostupno."}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <button
          type="submit"
          disabled={stanje === "slanje" || !contactFormEnabled}
          className="inline-flex min-h-[54px] items-center justify-center bg-bakar-dugme px-7 text-[0.94rem] font-semibold text-white transition-colors duration-300 hover:bg-bakar-dugme-hover disabled:cursor-not-allowed disabled:opacity-45"
        >
          {stanje === "slanje" ? "Slanje…" : "Pošaljite upit"}
        </button>
        <a
          href={telLink}
          className="text-malo font-semibold text-platno underline decoration-mist-3 underline-offset-4 transition-colors hover:text-bakar-svetli"
        >
          ili pozovite {site.phone.display}
        </a>
        {flags.viber && (
          <a href={viberLink} className="text-malo text-mist-2 underline">
            Viber
          </a>
        )}
        {flags.whatsapp && (
          <a href={whatsappLink} className="text-malo text-mist-2 underline">
            WhatsApp (direktan kontakt)
          </a>
        )}
      </div>
    </form>
  );
}
