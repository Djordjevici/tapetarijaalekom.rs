# Deploy — Coolify Docker Compose

Produkcija koristi jednu Coolify Docker Compose aplikaciju, UUID
`salbmytyaflmprszapfx8x7h`, sa servisom `website` na kontejnerskom portu
`3000`. Kanonski javni domen je `https://tapetarijaalekom.rs`; javni alias je
`https://www.tapetarijaalekom.rs`. Nema landing servisa, porta `8080`, staging
rutiranja ni HTTP Basic Auth-a.

## 1. Provera pre deploya

```bash
npm ci
npm run lint
npm run typecheck
NEXT_PUBLIC_SITE_URL=https://tapetarijaalekom.rs NEXT_PUBLIC_ALLOW_INDEXING=true NEXT_PUBLIC_CONTACT_FORM_ENABLED=true npm run build
docker compose config --quiet
docker compose -f docker-compose.yml -f docker-compose.local.yml config --quiet
```

Lokalno se pokreće samo `website` na `http://localhost:3000`:

```bash
NEXT_PUBLIC_CONTACT_FORM_ENABLED=true RESEND_API_KEY=local-validation-placeholder docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build website
docker compose -f docker-compose.yml -f docker-compose.local.yml down
```

## 2. Coolify postupak

Ovlašćeni operator prvo u maskiranom Coolify interfejsu za aplikaciju
`salbmytyaflmprszapfx8x7h` beleži redigovani snapshot: naziv, repozitorijum i
branch, deployment ID/commit, build/compose podešavanja, servise/domene,
redirect-e, health check, nazive environment promenljivih i rollback akciju.
Ne beleže se vrednosti tajni.

U Coolify-ju se postojeća aplikacija ažurira ovim javnim vrednostima, i za
build argumente i za runtime environment:

```env
NEXT_PUBLIC_SITE_URL=https://tapetarijaalekom.rs
NEXT_PUBLIC_ALLOW_INDEXING=true
NEXT_PUBLIC_CONTACT_FORM_ENABLED=true
```

`NEXT_PUBLIC_*` promenljive se ugrađuju tokom `next build`; promena zahteva
Redeploy, a ne samo restart. Server-only runtime promenljive su obavezne:

```env
RESEND_API_KEY
CONTACT_TO_EMAIL
CONTACT_FROM_EMAIL
```

Ovlašćeni operator ih pribavlja/proverava u Resend-u i odobrenom password
manager-u, zatim ih samo ručno unosi ili proverava u Coolify maskiranim poljima.
`CONTACT_FROM_EMAIL` mora koristiti Resend-verifikovan sender domen, a
`CONTACT_TO_EMAIL` mora biti kontrolisan, nadziran i testabilan mailbox.
Vrednosti se nikad ne stavljaju u Git, MCP/chat tekst, shell history,
screenshot-e, logove ili sačuvani command output.

Mapirati oba javna hosta na `website:3000`, ukloniti landing i Basic Auth
mapiranja, bez dupliranja domena ako Compose/Coolify već upravlja rutiranjem.
Deployovati pregledani commit, čekati uspešan i healthy status, pa ponovo
pročitati redigovano stanje aplikacije, environment-a, domena i health-a.

## 3. Provera produkcije i kontakt forme

Posle deploya proveriti TLS, oba hosta, odsustvo `WWW-Authenticate`, canonical
apex URL, indeksabilni `robots.txt`, health i omogućen endpoint. Nepotpuni
multipart zahtev prema `/api/upit` mora vratiti `422` i
`neispravni-podaci`, ne `503`.

Zatim poslati tačno jednu sintetičku prijavu bez korisničkih podataka, sa
apex `Origin`, praznim honeypot poljem i 1-pixel PNG prilogom, prema postupku
iz plana. Sačuvati samo odgovor `{"ok":true}` i generisani test ID. Operator
potvrđuje da se isti ID jednom vidi kao accepted/delivered u Resend-u i jednom
u nadziranom mailbox-u; ne čuvaju se adresa, ključ, header-i ni screenshot.

Ako je stvarno slanje zabranjeno ili privremeno nemoguće, redigovani operator
note beleži odobravaoca, razlog i vreme. Tada se proverava omogućen UI i `422`
probe, pa se Resend `GET /domains` pokreće samo sa privremeno, tiho unetim
`RESEND_API_KEY`; zahtev mora vratiti `200`, a operator ručno potvrđuje da je
domen iz `CONTACT_FROM_EMAIL` `verified`. Ne-200, neverifikovan domen,
onemogućen endpoint ili nemogućnost autentikacije su neuspešan rollout.

## 4. Rollback

Sačuvati Step 1 redigovani snapshot do završetka provere. Kod neuspešnog
build-a, TLS-a, rutiranja, health-a, indeksiranja, forme, Resend-a ili prijema,
zaustaviti rollout i Coolify rollback/redeploy akcijom vratiti prethodni
uspešan deployment/commit. Ako rollback ne vrati runtime polja, vratiti
prethodna javna polja iz snapshot-a, a tajne operator ručno iz password
manager-a u maskirana polja. U neizvesnom rollback-u postaviti indeksiranje na
`false`, vratiti prethodno apex/`www` mapiranje i Basic Auth samo ako su bili u
snapshot-u, redeployovati i ponovo proveriti prethodnu topologiju. Ne brisati
ni rotirati Resend kredencijale bez posebnog odobrenja.
