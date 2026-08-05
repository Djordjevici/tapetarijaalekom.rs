# tapetarijaalekom.rs

Sajt Tapetarije Alekom — tapetarska radionica u Petrovaradinu, Novi Sad.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Vercel

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
    api/upit/          prijem forme (trenutno ne šalje — vidi DEPLOY.md)
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
  logo/                logotip, sve varijante + preview.html
  images/placeholders/ PRIVREMENE fotografije
tools/
  logo/                skript za generisanje logotipa
  snimci.py            full-page snimci sajta
  provera-klizaca.py   provera klizača pre/posle
landing-page/          stara „Uskoro" strana, zadržana kao referenca
```

## Gde se šta menja

**Nijedna komponenta ne sadrži kontakt podatak, tekst obećanja ni URL slike.**
Sve ide iz `src/data/`:

| Fajl | Šta sadrži |
|---|---|
| `data/site.ts` | telefon, adresa, email, mreže, radno vreme, **feature flagovi** |
| `data/services.ts` | usluge, opisi, tipični komadi |
| `data/projects.ts` | projekti za pre/posle i galeriju |
| `data/content.ts` | FAQ, koraci procesa, faktori cene, materijali, recenzije |
| `data/images.ts` | sve slike: putanja, dimenzije, alt tekst |

### Feature flagovi

U `data/site.ts`. Sve što klijent nije potvrdio stoji na `false` i **ne prikazuje se**.
Uključivanje je jedna linija:

```ts
export const flags = {
  viber: false,          // Viber na mobilnom broju
  whatsapp: false,       // WhatsApp na mobilnom broju
  facebook: false,       // uz to popuniti site.social.facebook
  landline: false,       // fiksni 021
  pickupDelivery: false, // preuzimanje i dostava
  warranty: false,       // garancija
  freeEstimate: false,   // besplatna procena
  ownFabric: false,      // kupac donosi svoju tkaninu
  materialSamples: false,// uzorci materijala
  ikeaCovers: false,     // navlake za IKEA nameštaj
  extendedServiceArea: false, // šire područje rada
  showPrices: false,     // prikaz cena
  reviews: false,        // sekcija recenzija
  beforeAfter: true,     // sekcija pre/posle (demo dok nema pravih foto)
  worksInNav: true,      // link „Pre i posle" u navigaciji
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

Kada stignu **najmanje 2–3 prava para**, stavi `isPlaceholder: false`,
isključi `flags.showPlaceholderProjects`, a `beforeAfter` / `worksInNav`
ostavi uključene.

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

Sve varijante su u `public/logo/`. Pregled: otvori `public/logo/preview.html`.

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

Za oba treba pokrenut server (`npm run start` na portu 3210, odnosno
`npm run dev` na 3211).

## Dalje

- `DEPLOY.md` — domen, Vercel, forma, analitika
- `PODACI-ZA-POTVRDU.md` — sve što klijent mora da potvrdi pre lansiranja
- `GOOGLE-PROFIL.md` — preporuke za Google Business profil
- `DIZAJN.md` — vizuelni sistem, tokeni, animacije
