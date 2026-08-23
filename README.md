# tapetarijaalekom.rs

Sajt Tapetarije Alekom — tapetarska radionica u Petrovaradinu, Novi Sad.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS · Vercel · Resend

---

## Pokretanje

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # produkcioni build
npm run start      # pokreće build lokalno
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Node 20 ili noviji.

## Struktura

```
src/
  app/                 rute, layout, sitemap, robots, manifest, OG slika
    api/upit/          validacija i slanje forme preko Resend-a
  components/
    layout/            header, mobilni meni, footer, plutajući kontakt
    sections/          sekcije strana
    before-after/      klizač pre/posle
    form/              forma za procenu
    ui/                osnovni elementi
  data/                SVI podaci i tekstovi
  lib/                 SEO i schema
  types/               tipovi
public/
  logo/                odobrene SVG varijante logotipa
  icons/               PNG app i touch ikone
  images/placeholders/ PRIVREMENE fotografije
tools/
  logo/                skripte i interni pregled logotipa
  snimci.py            full-page snimci sajta
  provera-klizaca.py   provera klizača pre/posle
```

## Gde se šta menja

**Nijedna komponenta ne sadrži kontakt podatak, tekst obećanja ni URL slike.**
Sve ide iz `src/data/`:

| Fajl | Šta sadrži |
|---|---|
| `data/site.ts` | telefon, adresa, email, mreže, radno vreme, **feature flagovi** |
| `data/business.ts` | reference, B2B segmenti, dobavljači i vrste materijala |
| `data/services.ts` | usluge, opisi, tipični komadi |
| `data/projects.ts` | projekti za pre/posle i galeriju |
| `data/content.ts` | FAQ, koraci procesa, faktori cene, materijali, recenzije |
| `data/images.ts` | sve slike: putanja, dimenzije, alt tekst |

### Feature flagovi

U `data/site.ts`. Potvrđene funkcije su uključene, dok se nepotvrđene ne
renderuju:

```ts
export const flags = {
  viber: true,           // Viber na mobilnom broju
  whatsapp: true,        // direktna WhatsApp prečica, ne izbor u formi
  publicEmail: false,    // privremeni email se ne ističe javno
  facebook: false,       // uz to popuniti site.social.facebook
  landline: false,       // aktivan, ali namerno skriven u v1
  pickupDelivery: true,  // po dogovoru
  warranty: false,       // ne promoviše se javno
  freeEstimate: true,    // početna okvirna procena
  ownFabric: true,
  materialSamples: true,
  ikeaCovers: true,
  extendedServiceArea: true,
  showPrices: false,     // prikaz cena
  reviews: false,        // sekcija recenzija
  beforeAfter: true,     // sekcija pre/posle (demo dok nema pravih foto)
  worksInNav: true,      // link /radovi u navigaciji
};
```

### Zamena fotografija

1. Ubaci fajl u `public/images/` (privremene su u `placeholders/`)
2. Upiši ga u `src/data/images.ts` — putanja, **prave dimenzije** i alt tekst na srpskom
3. Ako je nov projekat, dodaj unos u `src/data/projects.ts` sa
   `isPlaceholder: false` i `published: true`

Komponente se pri tome ne diraju.

### Dodavanje projekta u pre/posle

```ts
{
  slug: "trosed-plava-tkanina",
  title: "Trosed u plavoj tkanini",
  shortTitle: "Trosed",
  category: "Presvlačenje nameštaja",
  summary: "Kratak opis šta je rađeno.",
  beforeImage: "trosed-2-pre",
  afterImage: "trosed-2-posle",
  gallery: ["trosed-2-posle"],
  materials: ["Tkanina"],
  workPerformed: ["Rasklapanje", "Nova presvlaka"],
  duration: null,
  isPlaceholder: false,   // pravi rad
  featured: true,
  published: true,
  seo: { title: "…", description: "…" },
}
```

Kada stignu pravi parovi, stavi `isPlaceholder: false`. Do tada je demo jasno
označen i `/radovi` ima `noindex`; uz
`NEXT_PUBLIC_SHOW_DEMO_PROJECTS=false` demo se potpuno skriva. Sitemap dodaje
`/radovi` tek kada postoji bar jedan objavljen pravi projekat.

### Dodavanje recenzije

`data/content.ts` → `reviews`, pa uključi `flags.reviews`:

```ts
{
  text: "Tekst recenzije.",
  author: "Ime ili inicijali",
  rating: 5,
  date: "2026-05-17",
  source: "Google",
  url: "https://…",  // opciono
}
```

### FAQ

`data/content.ts` → `faq`. Pitanja bez potvrđenog odgovora imaju
`enabled: false` i ne prikazuju se. Kada dobiješ odgovor, upiši ga i prebaci na
`enabled: true`.

## Logotip

Sve varijante su u `public/logo/`. Interni pregled: `tools/logo/preview.html`.

| Fajl | Kada |
|---|---|
| `alekom-seal.svg` | pun pečat sa kružnim tekstom, od ~64 px |
| `alekom-lockup.svg` | header, od 34 px |
| `alekom-lockup-compact.svg` | header na telefonu, do 32 px |
| `alekom-mark.svg` | znak, od 48 px |
| `alekom-mark-32.svg` | 32 px |
| `alekom-mark-16.svg` | 16 i 24 px |

Svaka ima `-dark` verziju za tamnu podlogu i `-mono` za jednu boju.

Jednobojnu verziju treba ubacivati **ugrađeno** (inline SVG), jer kroz
`<img>` `currentColor` ne može da se nasledi.

Regenerisanje posle izmena: `tools/logo/README.md`.

## Provere

```bash
python3 tools/snimci.py           # full-page snimci, desktop i mobilni
python3 tools/provera-klizaca.py  # klizač pre/posle + vodoravno prelivanje
```

Za provere treba pokrenuti odgovarajući lokalni server; portovi su navedeni u
samim alatima.

## Obavezno pre produkcije

- `site.email` i `site.privacyEmail` su trenutno privremeno
  `kontakt@tapetarijaalekom.rs`; zameniti konačnim poslovnim emailom.
- U Vercelu uneti pravi `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` i
  `RESEND_API_KEY`, pa testirati formu sa prilozima.
- Zameniti privremene fotografije originalnim radovima i fotografijama
  radionice.
- Pravno pregledati politiku privatnosti i potvrditi predloženi rok čuvanja od
  12 meseci.
- Uneti GA4 Measurement ID tek kada je spreman; bez njega se analitika i banner
  ne učitavaju.

## Dalje

- `DEPLOY.md` — Vercel, Loopia DNS, Resend i analitika
- `PODACI-ZA-POTVRDU.md` — sve što klijent mora da potvrdi pre lansiranja
- `GOOGLE-PROFIL.md` — preporuke za Google Business profil
- `DIZAJN.md` — vizuelni sistem, tokeni, animacije
