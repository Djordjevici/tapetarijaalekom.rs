# Produkcioni deploy — Vercel + Loopia

Produkcioni target je **Vercel**, domen je `tapetarijaalekom.rs`, a DNS ostaje
u Loopia panelu. Ovaj dokument ne menja DNS automatski.

## 1. Provera pre deploya

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```

Pre javnog lansiranja:

- zameniti privremeni `kontakt@tapetarijaalekom.rs` konačnom adresom u
  `src/data/site.ts`, `.env.example` i Vercel env varijablama;
- dodati originalne fotografije;
- postaviti `NEXT_PUBLIC_SHOW_DEMO_PROJECTS=false` ako demo projekti još nisu
  zamenjeni;
- pravno pregledati politiku privatnosti i potvrditi rok čuvanja od 12 meseci;
- testirati stvarnu isporuku forme i priloga.

## 2. Povezivanje Git repozitorijuma sa Vercelom

1. U Vercel dashboardu izabrati **Add New → Project**.
2. Povezati GitHub repozitorijum `tapetarijaalekom.rs`.
3. Izabrati produkcionu granu.
4. Framework preset: **Next.js**.
5. Build command: podrazumevani `next build`.
6. Install command: podrazumevani `npm install` / `npm ci`.
7. Node.js: 20 ili noviji.
8. Pokrenuti prvi Preview deploy pre povezivanja domena.

Vercel automatski hostuje App Router rute i `/api/upit` kao Function.

## 3. Environment promenljive

U **Project → Settings → Environment Variables** dodati:

```env
# Forma ostaje bezbedno isključena dok Resend i pravna provera nisu gotovi.
NEXT_PUBLIC_CONTACT_FORM_ENABLED=false

# Privremeno prikazuje jasno označen demo slider; false pre javnog lansiranja
# ako nema originalnih radova.
NEXT_PUBLIC_SHOW_DEMO_PROJECTS=true

# Resend — samo server, nikada NEXT_PUBLIC_.
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=KONACNI_EMAIL_NA_DOMENU
CONTACT_FROM_EMAIL=Tapetarija Alekom <upiti@tapetarijaalekom.rs>

# Opciono. Bez validnog ID-a nema GA skripte ni consent bannera.
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Za formu prvo uneti prave Resend vrednosti i testirati Preview, a tek zatim
prebaciti `NEXT_PUBLIC_CONTACT_FORM_ENABLED=true` u Production okruženju.

Forma preporučuje 3, prima najviše 5 JPG/PNG/WebP fotografija i kompresuje ih
pre slanja. Ukupni limit je 4 MB kako bi zahtev ostao ispod Vercel Function
payload limita.

## 4. Resend

1. U Resend-u dodati domen `tapetarijaalekom.rs`.
2. DKIM/SPF zapise koje Resend prikaže uneti u Loopia DNS.
3. Sačekati status **Verified**.
4. Kreirati API ključ samo za ovaj projekat.
5. Uneti env promenljive iz prethodnog odeljka.
6. Na Preview deployu poslati test sa 1, 3 i 5 fotografija.
7. Proveriti: sadržaj poruke, priloge, Reply-To, grešku i uspešno stanje forme.

Nema CC primaoca. API ne loguje sadržaj upita ni lične podatke.

## 5. Custom domen i Loopia DNS

1. U Vercelu: **Project → Settings → Domains**.
2. Dodati:
   - `tapetarijaalekom.rs`
   - `www.tapetarijaalekom.rs`
3. Kao primarni postaviti domen bez `www`; `www` preusmeriti na primarni.
4. Vercel prikazuje tačne DNS vrednosti. Njih koristiti kao izvor istine.
   Uobičajeno su:

   | Tip | Host | Vrednost |
   |---|---|---|
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

5. U Loopia panelu zameniti stare `@` / `www` zapise, ne ostavljati paralelne
   zapise ka starom hostingu.
6. Ne dirati email/DKIM/SPF zapise prilikom promene web hostinga.
7. Sačekati propagaciju i status **Valid Configuration** u Vercelu.
8. Vercel automatski izdaje i obnavlja TLS sertifikat.

## 6. Provera posle propagacije

```bash
curl -I https://tapetarijaalekom.rs
curl -I https://www.tapetarijaalekom.rs
curl https://tapetarijaalekom.rs/robots.txt
curl https://tapetarijaalekom.rs/sitemap.xml
```

Ručno proveriti:

- `www` preusmerava na domen bez `www`;
- `/`, `/usluge`, `/radovi`, `/kontakt` i pravne stranice rade;
- forma šalje stvaran email sa fotografijama;
- poziv, Viber i WhatsApp linkovi rade na telefonu;
- mapa i Instagram se otvaraju;
- nema demo projekata u sitemapu (dok ne postoje pravi);
- Search Console prihvata `/sitemap.xml`;
- Google Business profil vodi na novi HTTPS domen;
- NAP (naziv, adresa, telefon) je isti na sajtu i Google profilu.

## 7. Analytics i budući Meta Pixel

Bez `NEXT_PUBLIC_GA_ID` GA4 se ne učitava i banner se ne prikazuje. Sa validnim
ID-em GA4 se učitava tek nakon pristanka korisnika.

Meta Pixel nije uključen. Ako se kasnije doda, mora koristiti isti consent
mehanizam i politika kolačića mora biti dopunjena pre aktivacije.

