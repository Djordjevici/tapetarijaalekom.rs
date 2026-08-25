# Deploy — Coolify Docker Compose

Jedan Coolify resurs gradi dve odvojene slike iz ovog repozitorijuma:

- `landing`: statična „Uskoro” stranica iz `landing-page/`, Nginx na portu `80`;
- `website`: Next.js aplikacija iz korena, Node na portu `3000`.

Javni domeni `tapetarijaalekom.rs` i `www.tapetarijaalekom.rs` vode na landing.
Razvojni sajt je na `dev.tapetarijaalekom.rs`, javan je radi pregleda, ali ima
`noindex, nofollow`, blokirajući `robots.txt` i isključenu kontakt formu.

## 1. Provera pre deploya

```bash
npm ci
npm run lint
npm run typecheck
npm run build
docker compose config
docker compose -f docker-compose.yml -f docker-compose.local.yml config
docker compose -f docker-compose.yml -f docker-compose.local.yml build
```

Lokalno pokretanje obe slike:

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build
```

Landing je na `http://localhost:8080`, a Next.js na
`http://localhost:3000`. Zaustavljanje:

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml down
```

## 2. Coolify resurs

U Coolify-ju napraviti jednu aplikaciju iz Git repozitorijuma i podesiti:

| Podešavanje | Vrednost |
|---|---|
| Build pack | **Docker Compose** |
| Base directory | `/` |
| Compose location | `/docker-compose.yml` |

`docker-compose.yml` namerno nema host portove ni sopstvenu mrežu. Coolify
povezuje servise sa svojim reverse proxy-jem. Posle učitavanja Compose fajla,
u podešavanjima pojedinačnih servisa dodeliti:

| Servis | Domen u Coolify-ju | Container port |
|---|---|---|
| `landing` | `https://tapetarijaalekom.rs` | `80` |
| `landing` | `https://www.tapetarijaalekom.rs` | `80` |
| `website` | `https://dev.tapetarijaalekom.rs:3000` | `3000` |

Sufiks `:3000` govori Coolify-ju na koji port kontejnera prosleđuje zahtev;
posetioci i dalje koriste normalan `https://dev.tapetarijaalekom.rs` URL bez
porta. Nginx u `landing` servisu trajno preusmerava `www` na apex domen.

## 3. Environment promenljive

Compose ima bezbedne podrazumevane vrednosti za dev sajt:

```env
NEXT_PUBLIC_SITE_URL=https://dev.tapetarijaalekom.rs
NEXT_PUBLIC_ALLOW_INDEXING=false
NEXT_PUBLIC_CONTACT_FORM_ENABLED=false
NEXT_PUBLIC_SHOW_DEMO_PROJECTS=true
NEXT_PUBLIC_GA_ID=
```

`NEXT_PUBLIC_SITE_URL` se koristi za canonical, Open Graph, sitemap i
strukturirane podatke. `NEXT_PUBLIC_ALLOW_INDEXING=false` dodaje robots
metadata, `X-Robots-Tag` zaglavlje i `Disallow: /` u `robots.txt`.

`NEXT_PUBLIC_*` vrednosti se ugrađuju tokom `next build`, zato posle svake
promene treba uraditi **Redeploy**, ne samo restart kontejnera. Za ovaj dev
resurs vrednosti za indeksiranje i formu su u Compose fajlu namerno fiksirane
na `false`.

`website` je dodatno zaštićen HTTP Basic Auth prijavom na Traefik nivou.
Compose definiše bcrypt korisnika i Coolify shorthand labelu koja middleware
automatski dodaje generisanom HTTPS routeru. Kredencijali su korisničko ime
`alekom2026` i lozinka `alekom2026`; u Git-u je samo bcrypt hash lozinke.

Resend promenljive su ostavljene kao opcione za kasnije aktiviranje na
budućem produkcionom Next.js resursu:

```env
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=KONACNI_EMAIL_NA_DOMENU
CONTACT_FROM_EMAIL=Tapetarija Alekom <upiti@tapetarijaalekom.rs>
```

Pre uključivanja forme treba potvrditi domen u Resend-u, pravno pregledati
politiku privatnosti, testirati priloge, pa promeniti
`NEXT_PUBLIC_CONTACT_FORM_ENABLED` i u build args i u runtime environment-u.
Dok je vrednost `false`, `/api/upit` odmah vraća `503` i ne obrađuje lične
podatke.

## 4. DNS i TLS

Kod DNS provajdera usmeriti web zapise ka Coolify serveru:

- apex (`@`) — `A`/`AAAA` vrednost servera;
- `www` — `CNAME` ka apexu ili odgovarajući `A`/`AAAA`;
- `dev` — `A`/`AAAA` vrednost servera.

Ne menjati MX, SPF, DKIM, DMARC niti druge zapise za email. Tačne IP vrednosti
uzima administrator Coolify servera; ne upisivati primer IP adresu. Kada DNS
propagira, Coolify proxy izdaje TLS sertifikate za sva tri hosta.

## 5. Provera posle deploya

```bash
curl -I https://tapetarijaalekom.rs
curl -I https://www.tapetarijaalekom.rs
curl -I https://dev.tapetarijaalekom.rs
curl -u alekom2026:alekom2026 -I https://dev.tapetarijaalekom.rs
curl -u alekom2026:alekom2026 https://dev.tapetarijaalekom.rs/robots.txt
curl -u alekom2026:alekom2026 https://dev.tapetarijaalekom.rs/sitemap.xml
curl -u alekom2026:alekom2026 -i -X POST https://dev.tapetarijaalekom.rs/api/upit
```

Potvrditi sledeće:

- apex prikazuje landing, a `www` vraća trajni redirect na apex;
- oba servisa imaju status **healthy**;
- dev domen bez kredencijala vraća `401`, a sa kredencijalima učitava sajt;
- `/`, `/usluge`, `/radovi`, `/kontakt` i pravne stranice rade na dev domenu;
- HTML dev sajta ima canonical i Open Graph URL-ove sa `dev` domenom;
- dev odgovori imaju `X-Robots-Tag: noindex, nofollow`;
- dev HTML ima `noindex, nofollow`, a `robots.txt` sadrži `Disallow: /`;
- sitemap i JSON-LD koriste `https://dev.tapetarijaalekom.rs`;
- `/api/upit` vraća `503` sa razlogom `slanje-nije-konfigurisano`;
- landing i Next.js statički/optimizovani resursi se učitavaju bez grešaka.

## 6. Napomene

- Coolify gradi direktno iz Git repozitorijuma; nema registry workflow-a.
- Landing namerno i dalje koristi Google Fonts i Unsplash resurse sa interneta.
- `Dockerfile` pravi Next.js standalone runtime i izvršava ga kao non-root
  korisnik.
- Lokalni portovi postoje samo u `docker-compose.local.yml`.
- Ograničenje priloga od 4 MB štiti Node proces i email isporuku. Za jaču
  zaštitu forme dodati rate limiting na Coolify reverse proxy-ju ili deljeno
  skladište između replika.
