# Deploy i integracije

**Ništa od ovoga nije izvršeno.** DNS nije menjan i produkcioni deploy nije
rađen — čeka se odobrenje.

---

## 1. Vercel

```bash
npm i -g vercel
vercel link
vercel        # preview
vercel --prod # produkcija, tek po odobrenju
```

Ili preko Vercel dashboarda: import GitHub repozitorijuma, framework se
prepoznaje sam (Next.js), bez dodatnih podešavanja build komande.

## 2. Domen: Loopia → Vercel

Domen `tapetarijaalekom.rs` je registrovan preko Loopia. Sajt ne mora biti
hostovan tamo — dovoljno je usmeriti DNS na Vercel.

**Postojeća „Uskoro" strana ostaje aktivna sve do prebacivanja.**

### Koraci

1. U Vercelu: Project → Settings → Domains → dodaj `tapetarijaalekom.rs` i
   `www.tapetarijaalekom.rs`. Vercel prikaže tačne vrednosti zapisa.
2. U Loopia panelu (DNS zapisi za domen):

   | Tip | Ime | Vrednost |
   |---|---|---|
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

   Vrednosti **uvek proveriti u Vercel panelu** — Vercel ih može promeniti.
3. Ako Loopia već ima `A` ili `CNAME` za `@` i `www` (stara coming-soon
   strana), te zapise treba zameniti, ne dodavati uz postojeće.
4. Sačekati propagaciju (obično do nekoliko časova) i u Vercelu proveriti da
   domen ima status *Valid Configuration*.
5. Vercel sam izdaje SSL sertifikat.
6. Podesiti preusmerenje `www` → bez `www` (ili obrnuto), da ne postoje dve
   verzije sajta za Google.

### Posle prebacivanja

- Proveriti da `https://tapetarijaalekom.rs/sitemap.xml` radi
- Poslati sitemap u Google Search Console
- Proveriti da link na Google Business profilu vodi na novi sajt

## 3. Forma za upit

Forma je u potpunosti napravljena — validacija, upload sa kompresijom na
klijentu, stanja slanja, greške i uspeh. **Ne obrađuje lične podatke** dok se
ne uključi izričito.

### Trenutno stanje

- `NEXT_PUBLIC_CONTACT_FORM_ENABLED` nije `true` → dugme za slanje je
  onemogućeno, a iznad njega stoji poruka sa telefonom kao alternativom
- `/api/upit` vraća `503` i **ništa ne loguje** — ni imena, ni telefone, ni
  tekst upita, ni fotografije
- Nikada se ne prikazuje lažno „poslato"

### Uključivanje (Resend)

1. Registruj domen `tapetarijaalekom.rs` u [Resend](https://resend.com) i
   dodaj DKIM/SPF zapise u Loopia
2. Environment varijable u Vercelu:

   ```
   RESEND_API_KEY=re_…
   CONTACT_TO_EMAIL=info@tapetarijaalekom.rs
   NEXT_PUBLIC_CONTACT_FORM_ENABLED=true
   ```

3. U `src/app/api/upit/route.ts` implementirati poziv Resend-a na mestu koje je
   označeno komentarom. Validacija, provera tipa i veličine fajlova su već tu.
4. **Pre uključivanja** popuniti politiku privatnosti — vidi
   `PODACI-ZA-POTVRDU.md`, tačke 2–7.

### Fotografije u poruci

Ograničenja su usklađena sa serverless rutom:

- najviše 5 fotografija
- do 4 MB po fotografiji **posle** kompresije na klijentu
- do 12 MB ukupno po zahtevu
- dozvoljeno: JPG, PNG, WebP

Fotografije sa telefona se automatski smanjuju na 1600 px duže strane pre
slanja, jer bi originali od 8–12 MB probili limit.

**HEIC nije podržan.** Da bi radio, treba proveriti ceo tok — izbor fajla,
validaciju, preview, upload i otvaranje priloga kod primaoca — pa se dodaje
kasnije kao posebno testirana funkcija. iPhone po podrazumevanim
podešavanjima deli fotografije kao JPEG, pa u praksi ovo retko pravi problem.

Ako prilozi budu problem za email, alternativa je upload na storage
(Vercel Blob ili S3) i slanje linkova u poruci.

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
