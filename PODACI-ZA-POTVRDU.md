# Podaci koje klijent mora da potvrdi

Sve nepotvrđeno je u kodu isključeno flagom ili stoji kao placeholder u
uglastim zagradama, pa se nigde ne pojavljuje kao tvrdnja.

---

## 1. Blokira lansiranje

Bez ovoga sajt ne treba pustiti u produkciju.

| # | Podatak | Gde se koristi |
|---|---|---|
| 1 | **Radno vreme za sve dane** | footer, `/kontakt`, LocalBusiness schema. Na Google profilu je unet samo ponedeljak 08:00–16:00. Do potvrde `site.hours = null` i vreme **izostaje iz schema** |
| 2 | **Pun pravni naziv preduzetnika** | politika privatnosti |
| 3 | **PIB** | politika privatnosti |
| 4 | **Matični broj** | politika privatnosti |
| 5 | **Email za pitanja o privatnosti** | politika privatnosti |
| 6 | **Rok čuvanja podataka iz upita** | politika privatnosti |
| 7 | **Pravni pregled politike privatnosti** | tekst je nacrt, nije pravni savet |
| 8 | **Prave fotografije radova + pravo korišćenja** | sve slike su sada privremene |

### Pre uključivanja forme

Forma u produkciji ne obrađuje lične podatke dok se ne završi 2–7 i ne podesi
Resend. Vidi `DEPLOY.md`.

---

## 2. Otključava već napravljene delove

Sve je izgrađeno i čeka jednu liniju u `src/data/site.ts`.

| Pitanje klijentu | Flag | Šta se pojavi |
|---|---|---|
| Radi li **Viber** na 064 24 96 345? | `viber` | Viber u plutajućem meniju, mobilnom meniju i formi |
| Radi li **WhatsApp** na istom broju? | `whatsapp` | isto, uz Viber |
| Je li **fiksni 021 64 33 621** aktivan? | `landline` | fiksni u footeru |
| Postoji li **preuzimanje i dostava**? Uz doplatu? | `pickupDelivery` | peti korak u procesu + FAQ pitanje |
| Je li **procena besplatna**? | `freeEstimate` | tek tada CTA sme da kaže „besplatna procena". Do tada svuda stoji samo „Pošaljite fotografiju za procenu" |
| Postoji li **garancija** i šta pokriva? | `warranty` | garancija se trenutno **nigde ne spominje** |
| Može li kupac **doneti svoju tkaninu**? | `ownFabric` | FAQ pitanje |
| Postoje li **uzorci materijala** u radionici? | `materialSamples` | sekcija materijala sada samo edukuje, bez tvrdnje o katalogu |
| Rade li **navlake za IKEA nameštaj**? | `ikeaCovers` | usluga + kasnije zasebna SEO stranica |
| Koja **mesta pokrivaju** osim Novog Sada i Petrovaradina? | `extendedServiceArea` | FAQ pitanje + `areaServed` u schema |
| **Facebook URL** | `facebook` | + upisati u `site.social.facebook` |
| **Prosečni rokovi** za tipične radove | — | FAQ pitanje „Koliko traje presvlačenje kauča?" |
| Prikazujemo **cene** ili samo način formiranja? | `showPrices` | sada nema ni jedne cifre |

---

## 3. Sadržaj koji poboljšava sajt

| Podatak | Zašto |
|---|---|
| **Pre/posle fotografije** — najmanje 2–3 para, cilj 20–30 slika | otključava `flags.beforeAfter` i `/radovi` u navigaciji |
| **Fotografije radionice** | zamena privremenih u sekciji procesa |
| **Fotografija majstora** | jača lični brend, što izveštaj naglašava kao slabost |
| **Google recenzije** — 10–15 od starih klijenata | otključava `flags.reviews` |
| **Tačan mesec osnivanja 2006.** | potrebno samo ako želimo tačan broj godina. Sada se koristi „od 2006." kao ručno kontrolisan tekst i broj godina se ne računa |
| **Ime i saglasnost vlasnika za javni prikaz** | ime se trenutno **ne pojavljuje** ni u tekstu, ni u schema, ni u pravnim stranicama |

---

## 4. Otvorena pitanja o adresi i lokaciji

- **Kanonski zapis adrese.** Sajt koristi
  `Tunislava Paunovića 24, 21132 Petrovaradin, Novi Sad`.
  Google profil vodi lokaciju kao „Novi Sad 21132", a 21132 je poštanski broj
  Petrovaradina. `addressLocality` je izdvojeno polje u `site.ts`, pa se menja
  na jednom mestu ako registri zahtevaju drugačije.
- **Koordinate.** `geo` u LocalBusiness schema **izostaje** dok nemamo
  proverene `latitude` i `longitude`. Plus Code `6VRH+QC` je samo pomoćni
  podatak i ne koristi se kao zamena za adresu.

---

## Kako predati podatke

Najlakše je poslati listu u jednoj poruci, u ovom obliku:

```
Radno vreme: pon–pet 08–16, sub 08–13, ned zatvoreno
Pravni naziv: …
PIB: …
Matični broj: …
Email za privatnost: …
Rok čuvanja: 12 meseci
Viber: da / ne
WhatsApp: da / ne
Fiksni 021: aktivan / nije
Procena besplatna: da / ne
Preuzimanje i dostava: da, uz doplatu / ne
Područje rada: …
Svoja tkanina: može / ne može
Uzorci u radionici: ima / nema
Garancija: … meseci na … / nema
Rokovi: kauč ~… dana, fotelja ~… dana
IKEA navlake: radimo / ne radimo
Facebook: …
Cene: prikazujemo / ne prikazujemo
```
