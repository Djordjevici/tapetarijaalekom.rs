import { NextResponse } from "next/server";

import { contactFormEnabled } from "@/data/site";

const MAX_UKUPNO = 12 * 1024 * 1024;
const TIPOVI = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * Prijem upita.
 *
 * Dok servis za slanje (Resend) nije konfigurisan, ruta odbija zahtev i
 * NIŠTA ne loguje — ni imena, ni telefone, ni tekst upita, ni fotografije.
 * Nikada ne vraća lažan uspeh.
 *
 * Uključivanje u produkciji:
 *   1. RESEND_API_KEY u okruženju
 *   2. NEXT_PUBLIC_CONTACT_FORM_ENABLED=true
 *   3. Politika privatnosti popunjena i objavljena
 * Vidi DEPLOY.md.
 */
export async function POST(request: Request) {
  const kljuc = process.env.RESEND_API_KEY;

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

  let forma: FormData;
  try {
    forma = await request.formData();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // zamka za botove
  if (String(forma.get("zamka") ?? "").length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ime = String(forma.get("ime") ?? "").trim();
  const telefon = String(forma.get("telefon") ?? "").trim();
  const opis = String(forma.get("opis") ?? "").trim();

  if (ime.length < 2 || telefon.length < 8 || opis.length < 10) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const slike = forma.getAll("slike").filter((v): v is File => v instanceof File);
  let ukupno = 0;
  for (const s of slike) {
    if (!TIPOVI.has(s.type)) {
      return NextResponse.json({ ok: false }, { status: 415 });
    }
    ukupno += s.size;
  }
  if (slike.length > 5 || ukupno > MAX_UKUPNO) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  // Ovde ide poziv Resend-a. Namerno nije implementiran naslepo — dok se ne
  // potvrdi domen i pravni podaci, ruta ne sme da šalje lične podatke.
  return NextResponse.json(
    { ok: false, razlog: "isporuka-nije-implementirana" },
    { status: 503 },
  );
}
