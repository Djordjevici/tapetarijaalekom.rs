import { NextResponse } from "next/server";
import { Resend } from "resend";

import { contactFormEnabled, site } from "@/data/site";
import { services } from "@/data/services";

export const runtime = "nodejs";

const MAX_SLIKA = 5;
const MAX_PO_SLICI = 2 * 1024 * 1024;
const MAX_UKUPNO = 4 * 1024 * 1024;

const TIPOVI = new Set(["image/jpeg", "image/png", "image/webp"]);

const KONTAKTI = new Set(["poziv", "sms", "viber", "email"]);

const USLUGE = new Set([
  ...services.map((s) => s.title),
  "Drugo / nisam siguran",
]);

const NAZIVI_KONTAKTA: Record<string, string> = {
  poziv: "Poziv",
  sms: "SMS",
  viber: "Viber",
  email: "Email",
};

/**
 * Best-effort rate limiting po Node procesu.
 *
 * Ako aplikacija jednog dana bude imala više replika,
 * rate limiting treba prebaciti na reverse proxy ili shared storage.
 */
const zahtevi = new Map<string, { broj: number; reset: number }>();

function previseZahteva(ip: string): boolean {
  const sada = Date.now();
  const prethodni = zahtevi.get(ip);

  if (!prethodni || prethodni.reset < sada) {
    zahtevi.set(ip, {
      broj: 1,
      reset: sada + 15 * 60 * 1000,
    });

    return false;
  }

  prethodni.broj += 1;

  return prethodni.broj > 5;
}

function potpisOdgovara(tip: string, bytes: Uint8Array): boolean {
  if (tip === "image/jpeg") {
    return (
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }

  if (tip === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  }

  if (tip === "image/webp") {
    return (
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    );
  }

  return false;
}

/**
 * Proverava da zahtev dolazi sa javnog domena konfigurisanog za sajt.
 *
 * Ne poredi se sa request.url zato što aplikacija radi iza
 * Coolify / Traefik reverse proxy-ja i request.url može sadržati
 * interni Docker host umesto javnog domena.
 */
function dozvoljenOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  // Origin može nedostajati kod nekih non-browser zahteva.
  // Endpoint je svakako zaštićen validacijom, rate limitom i honeypot-om.
  if (!origin) {
    return true;
  }

  try {
    const zahtevOrigin = new URL(origin).origin;
    const dozvoljeniOrigin = new URL(site.url).origin;

    return zahtevOrigin === dozvoljeniOrigin;
  } catch {
    return false;
  }
}

/**
 * Prijem upita sa kontakt forme.
 *
 * Potrebno:
 * - NEXT_PUBLIC_CONTACT_FORM_ENABLED=true
 * - RESEND_API_KEY
 * - verifikovan domen u Resend-u
 */
export async function POST(request: Request) {
  const kljuc = process.env.RESEND_API_KEY?.trim();

  if (!contactFormEnabled || !kljuc) {
    return NextResponse.json(
      {
        ok: false,
        razlog: "slanje-nije-konfigurisano",
        poruka:
          "Slanje sa sajta još nije aktivno. Molimo pozovite nas telefonom.",
      },
      { status: 503 },
    );
  }

  if (!dozvoljenOrigin(request)) {
    return NextResponse.json(
      {
        ok: false,
        razlog: "nedozvoljen-origin",
      },
      { status: 403 },
    );
  }

  const ip =
    request.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim() ?? "unknown";

  if (previseZahteva(ip)) {
    return NextResponse.json(
      {
        ok: false,
        razlog: "previse-zahteva",
      },
      { status: 429 },
    );
  }

  let forma: FormData;

  try {
    forma = await request.formData();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        razlog: "neispravna-forma",
      },
      { status: 400 },
    );
  }

  // Honeypot za botove.
  if (String(forma.get("zamka") ?? "").length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ime = String(forma.get("ime") ?? "").trim();
  const telefon = String(forma.get("telefon") ?? "").trim();
  const email = String(forma.get("email") ?? "").trim();
  const usluga = String(forma.get("usluga") ?? "").trim();
  const opis = String(forma.get("opis") ?? "").trim();
  const dimenzije = String(forma.get("dimenzije") ?? "").trim();
  const lokacija = String(forma.get("lokacija") ?? "").trim();
  const rok = String(forma.get("rok") ?? "").trim();
  const kontakt = String(forma.get("kontakt") ?? "").trim();
  const pristanak = forma.get("pristanak") === "da";

  if (
    ime.length < 2 ||
    ime.length > 100 ||
    !/^[+\d][\d\s/()-]{7,}$/.test(telefon) ||
    telefon.length > 40 ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) ||
    !USLUGE.has(usluga) ||
    opis.length < 10 ||
    opis.length > 3000 ||
    dimenzije.length > 200 ||
    lokacija.length > 200 ||
    rok.length > 200 ||
    !KONTAKTI.has(kontakt) ||
    (kontakt === "email" && !email) ||
    !pristanak
  ) {
    return NextResponse.json(
      {
        ok: false,
        razlog: "neispravni-podaci",
      },
      { status: 422 },
    );
  }

  const slike = forma
    .getAll("slike")
    .filter((v): v is File => v instanceof File);

  if (slike.length < 1 || slike.length > MAX_SLIKA) {
    return NextResponse.json(
      {
        ok: false,
        razlog: "neispravan-broj-slika",
      },
      { status: 422 },
    );
  }

  let ukupno = 0;

  for (const slika of slike) {
    if (!TIPOVI.has(slika.type)) {
      return NextResponse.json(
        {
          ok: false,
          razlog: "nepodrzan-format-slike",
        },
        { status: 415 },
      );
    }

    if (slika.size > MAX_PO_SLICI) {
      return NextResponse.json(
        {
          ok: false,
          razlog: "slika-prevelika",
        },
        { status: 413 },
      );
    }

    const potpis = new Uint8Array(
      await slika.slice(0, 12).arrayBuffer(),
    );

    if (!potpisOdgovara(slika.type, potpis)) {
      return NextResponse.json(
        {
          ok: false,
          razlog: "neispravan-format-slike",
        },
        { status: 415 },
      );
    }

    ukupno += slika.size;
  }

  if (ukupno > MAX_UKUPNO) {
    return NextResponse.json(
      {
        ok: false,
        razlog: "prilozi-preveliki",
      },
      { status: 413 },
    );
  }

  try {
    const resend = new Resend(kljuc);

    const domacinDomena = new URL(site.url).hostname;

    const posiljalac =
      process.env.CONTACT_FROM_EMAIL?.trim() ||
      `${site.name} <upiti@${domacinDomena}>`;

    const primalac =
      process.env.CONTACT_TO_EMAIL?.trim() ||
      site.email;

    const prilozi = await Promise.all(
      slike.map(async (slika) => ({
        filename: slika.name || "fotografija.jpg",
        content: Buffer.from(
          await slika.arrayBuffer(),
        ).toString("base64"),
      })),
    );

    const telo = [
      `Ime i prezime: ${ime}`,
      `Telefon: ${telefon}`,
      email ? `Email: ${email}` : null,
      `Usluga: ${usluga}`,
      dimenzije
        ? `Približne dimenzije: ${dimenzije}`
        : null,
      lokacija ? `Lokacija: ${lokacija}` : null,
      rok ? `Željeni rok: ${rok}` : null,
      `Željeni kontakt: ${NAZIVI_KONTAKTA[kontakt]}`,
      "",
      "Opis:",
      opis,
    ]
      .filter((red): red is string => red !== null)
      .join("\n");

    const { error } = await resend.emails.send({
      from: posiljalac,
      to: primalac,
      replyTo: email || undefined,
      subject: "Novi upit sa sajta",
      text: telo,
      attachments: prilozi.length
        ? prilozi
        : undefined,
    });

    if (error) {
      console.error(
        "Resend nije uspeo da pošalje upit:",
        error.message,
      );

      return NextResponse.json(
        {
          ok: false,
          razlog: "slanje-neuspesno",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (e) {
    console.error(
      "Neočekivana greška pri slanju upita:",
      e instanceof Error ? e.message : e,
    );

    return NextResponse.json(
      {
        ok: false,
        razlog: "slanje-neuspesno",
      },
      { status: 502 },
    );
  }
}