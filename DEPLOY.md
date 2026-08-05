# Deploy i integracije

**Ništa od ovoga nije izvršeno.** DNS nije menjan i produkcioni deploy nije
rađen — čeka se odobrenje.

Sajt se hostuje samostalno, na Hetzner VM-u (Linux), ne na Vercelu.

---

## 1. Server: Hetzner VM (Docker + Caddy)

Pretpostavka: Ubuntu 22.04/24.04 VM na Hetzneru, SSH pristup sa `sudo`.

### Jednokratno podešavanje servera

```bash
# na serveru
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER   # ponovo se ulogovati posle ovoga

sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Prvi deploy

```bash
# na serveru
git clone https://github.com/Djordjevici/tapetarijaalekom.rs.git
cd tapetarijaalekom.rs
cp .env.example .env.production
nano .env.production   # popuniti prave vrednosti — vidi odeljke 3 i 4 ispod

docker compose build
docker compose up -d
```

`docker-compose.yml` pokreće dva kontejnera:

- **`sajt`** — Next.js u samostalnom (`standalone`) režimu, sluša interno na
  portu 3000, nije direktno izložen internetu
- **`caddy`** — reverse proxy na portovima 80/443, sam izdaje i obnavlja
  Let's Encrypt sertifikat za `tapetarijaalekom.rs` i `www.tapetarijaalekom.rs`
  (domeni su već upisani u `Caddyfile`)

### Ažuriranje posle izmena u kodu

```bash
cd tapetarijaalekom.rs
git pull
docker compose build
docker compose up -d
docker image prune -f   # briše stare slojeve slike
```

Kratak prekid u radu je moguć u trenutku zamene kontejnera (par sekundi);
za deploy bez prekida trebalo bi dodati drugi `sajt` kontejner i preusmeriti
Caddy tek kad je zdrav (van obima ovog dokumenta dok sajt ne dobije značajniji
saobraćaj).

### Provera da je sve živo

```bash
docker compose ps
docker compose logs -f sajt
curl -I https://tapetarijaalekom.rs
```

### Alternativa bez Dockera

Ako se ipak ne koristi Docker: `npm ci && npm run build`, pa pokrenuti
`.next/standalone/server.js` (posle kopiranja `public/` i `.next/static/` u
taj folder — tačno ono što `Dockerfile` radi) pod `systemd` servisom, i
staviti `nginx` ili `caddy` ispred njega kao reverse proxy sa TLS-om.
`Dockerfile` je referenca za tačan redosled koraka builda.

## 2. Domen: Loopia → Hetzner

Domen `tapetarijaalekom.rs` je registrovan preko Loopia.

**Postojeća „Uskoro" strana ostaje aktivna sve do prebacivanja.**

### Koraci

1. U Loopia panelu (DNS zapisi za domen), usmeriti oba zapisa direktno na IP
   Hetzner servera:

   | Tip | Ime | Vrednost |
   |---|---|---|
   | `A` | `@` | `<javni IP Hetzner servera>` |
   | `A` | `www` | `<javni IP Hetzner servera>` |

   (Ako se koristi Hetzner IPv6, dodati i odgovarajuće `AAAA` zapise.)
2. Ako Loopia već ima `A`/`CNAME` zapise za `@` i `www` (stara coming-soon
   strana), te zapise treba zameniti, ne dodavati uz postojeće.
3. Sačekati propagaciju (obično do nekoliko časova).
4. Caddy na serveru sam izdaje SSL sertifikat čim DNS pokazuje na njega — nema
   ručnog koraka za sertifikat.
5. Redirekcija `www` → bez `www` je već podešena u `Caddyfile`, da ne postoje
   dve verzije sajta za Google.

### Posle prebacivanja

- Proveriti da `https://tapetarijaalekom.rs/sitemap.xml` radi
- Poslati sitemap u Google Search Console
- Proveriti da link na Google Business profilu vodi na novi sajt

## 3. Forma za upit

Forma je u potpunosti napravljena — validacija, upload sa kompresijom na
klijentu, stanja slanja, greške i uspeh. Slanje preko Resend-a je **već
implementirano** u `src/app/api/upit/route.ts`. **Ne obrađuje lične podatke**
dok se ne uključi izričito.

### Trenutno stanje

- `NEXT_PUBLIC_CONTACT_FORM_ENABLED` nije `true` → dugme za slanje je
  onemogućeno, a iznad njega stoji poruka sa telefonom kao alternativom
- `/api/upit` vraća `503` i **ništa ne loguje** — ni imena, ni telefone, ni
  tekst upita, ni fotografije
- Nikada se ne prikazuje lažno „poslato"

### Uključivanje (Resend)

1. Registruj domen `tapetarijaalekom.rs` u [Resend](https://resend.com) i
   dodaj DKIM/SPF zapise u Loopia
2. U `.env.production` na serveru:

   ```
   RESEND_API_KEY=re_…
   CONTACT_TO_EMAIL=info@tapetarijaalekom.rs
   NEXT_PUBLIC_CONTACT_FORM_ENABLED=true
   ```

   (`CONTACT_FROM_EMAIL` je opciono — podrazumevano je
   `Tapetarija Alekom <upiti@tapetarijaalekom.rs>`; ta adresa mora biti na
   domenu potvrđenom u koraku 1.)
3. `docker compose up -d` da se izmena env fajla primeni (kontejner mora da se
   restartuje da pokupi nove vrednosti).
4. **Pre uključivanja** popuniti politiku privatnosti — vidi
   `PODACI-ZA-POTVRDU.md`, tačke 2–7.

Ruta validira polja, tip i veličinu fajlova, šalje email preko Resend-a sa
fotografijama kao prilozima, i postavlja `replyTo` na email upitioca ako ga je
ostavio. Greške Resend-a se beleže u server log **bez** ličnih podataka iz
upita (samo poruka o grešci).

### Fotografije u poruci

- najviše 5 fotografija
- do 4 MB po fotografiji **posle** kompresije na klijentu
- do 12 MB ukupno po zahtevu
- dozvoljeno: JPG, PNG, WebP

Fotografije sa telefona se automatski smanjuju na 1600 px duže strane pre
slanja, jer bi originali od 8–12 MB probili limit. Resend prihvata priloge do
40 MB po emailu, tako da 12 MB ukupno ostaje sa velikom rezervom.

**HEIC nije podržan.** Da bi radio, treba proveriti ceo tok — izbor fajla,
validaciju, preview, upload i otvaranje priloga kod primaoca — pa se dodaje
kasnije kao posebno testirana funkcija. iPhone po podrazumevanim
podešavanjima deli fotografije kao JPEG, pa u praksi ovo retko pravi problem.

## 4. Analitika

Bez `NEXT_PUBLIC_GA_ID` analitika se **ne učitava** i cookie banner se **ne
prikazuje**.

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Kada je postavljen:

- prikazuje se cookie banner
- GA4 se učitava **samo posle pristanka**
- odluka se pamti u `localStorage`
- treba linkovati `/politika-kolacica` (već postoji) i popuniti placeholdere

### Meta Pixel

Nije uključen. Ako se kasnije doda, treba ga vezati na isti pristanak kao GA4 i
dopuniti politiku kolačića.

## 5. Provera pre lansiranja

```bash
npm run lint
npm run typecheck
npm run build
```

Pa vizuelno:

```bash
npm run start                     # port 3000, ili PORT=3210
python3 tools/snimci.py           # snimci na 320/390/1024/1440
python3 tools/provera-klizaca.py  # klizač + vodoravno prelivanje
```

Ručno proveriti:

- [ ] Radno vreme uneto, nije `[RADNO VREME]`
- [ ] Politika privatnosti popunjena i pravno pregledana
- [ ] Forma šalje na pravi email i prikazuje pravo stanje
- [ ] Prave fotografije zamenile privremene
- [ ] `flags.showPlaceholderProjects` u produkciji **nije** aktivan
- [ ] Nijedan demonstracioni projekat nije javno vidljiv
- [ ] Google Business profil dopunjen — vidi `GOOGLE-PROFIL.md`
- [ ] Telefon, adresa i naziv identični na sajtu, Google profilu i imenicima
- [ ] `.env.production` na serveru ima prave vrednosti, ne primere iz
      `.env.example`
- [ ] `docker compose ps` pokazuje oba kontejnera zdrava (`healthy`/`Up`)
