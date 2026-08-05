import { NextResponse } from "next/server";
import { Resend } from "resend";

import { contactFormEnabled, site } from "@/data/site";

const MAX_SLIKA = 5;
const MAX_PO_SLICI = 4 * 1024 * 1024; // 4 MB po fotografiji, posle kompresije na klijentu
const MAX_UKUPNO = 12 * 1024 * 1024; // razumna gornja granica zahteva, ispod Resend limita za priloge
const TIPOVI = new Set(["image/jpeg", "image/png", "image/webp"]);

const NAZIVI_KONTAKTA: Record<string, string> = {
  telefon: "Telefon",
  viber: "Viber",
  whatsapp: "WhatsApp",
  email: "Email",
};

/**
 * Prijem upita.
 *
 * Dok RESEND_API_KEY i NEXT_PUBLIC_CONTACT_FORM_ENABLED nisu oba postavljena,
 * ruta odbija zahtev i NIŠTA ne loguje — ni imena, ni telefone, ni tekst
 * upita, ni fotografije. Nikada ne vraća lažan uspeh.
 *
 * Uključivanje u produkciji — koraci u DEPLOY.md:
 *   1. Domen potvrđen u Resend-u (DKIM/SPF zapisi)
 *   2. RESEND_API_KEY, CONTACT_TO_EMAIL (i opciono CONTACT_FROM_EMAIL) u okruženju
 *   3. NEXT_PUBLIC_CONTACT_FORM_ENABLED=true
 *   4. Politika privatnosti popunjena i objavljena
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

  // zamka za botove — tiho se pretvara da je uspelo, ništa se ne šalje
  if (String(forma.get("zamka") ?? "").length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ime = String(forma.get("ime") ?? "").trim();
  const telefon = String(forma.get("telefon") ?? "").trim();
  const email = String(forma.get("email") ?? "").trim();
  const usluga = String(forma.get("usluga") ?? "").trim();
  const opis = String(forma.get("opis") ?? "").trim();
  const kontakt = String(forma.get("kontakt") ?? "").trim();

  if (ime.length < 2 || telefon.length < 8 || opis.length < 10) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const slike = forma.getAll("slike").filter((v): v is File => v instanceof File);
  let ukupno = 0;
  for (const s of slike) {
    if (!TIPOVI.has(s.type)) {
      return NextResponse.json({ ok: false }, { status: 415 });
    }
    if (s.size > MAX_PO_SLICI) {
      return NextResponse.json({ ok: false }, { status: 413 });
    }
    ukupno += s.size;
  }
  if (slike.length > MAX_SLIKA || ukupno > MAX_UKUPNO) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  try {
    const resend = new Resend(kljuc);
    const domacinDomena = new URL(site.url).hostname;
    const posiljalac =
      process.env.CONTACT_FROM_EMAIL ?? `${site.name} <upiti@${domacinDomena}>`;
    const primalac = process.env.CONTACT_TO_EMAIL ?? site.email;

    const prilozi = await Promise.all(
      slike.map(async (s) => ({
        filename: s.name || "fotografija.jpg",
        content: Buffer.from(await s.arrayBuffer()).toString("base64"),
      })),
    );

    const telo = [
      `Ime i prezime: ${ime}`,
      `Telefon: ${telefon}`,
      email ? `Email: ${email}` : null,
      usluga ? `Usluga: ${usluga}` : null,
      kontakt ? `Željeni kontakt: ${NAZIVI_KONTAKTA[kontakt] ?? kontakt}` : null,
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
      subject: `Novi upit sa sajta — ${ime}`,
      text: telo,
      attachments: prilozi.length ? prilozi : undefined,
    });

    if (error) {
      // Bez ličnih podataka u logu — samo poruka o grešci od Resend-a.
      console.error("Resend nije uspeo da pošalje upit:", error.message);
      return NextResponse.json(
        { ok: false, razlog: "slanje-neuspesno" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(
      "Neočekivana greška pri slanju upita:",
      e instanceof Error ? e.message : e,
    );
    return NextResponse.json(
      { ok: false, razlog: "slanje-neuspesno" },
      { status: 502 },
    );
  }
}
