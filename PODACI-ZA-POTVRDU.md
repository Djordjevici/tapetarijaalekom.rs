# Preostalo pre produkcije

Poslovni podaci, telefon, adresa, radno vreme, usluge, proces rada, pravno lice,
PIB i matični broj već su uneti u centralne podatke.

## Obavezno

- [ ] **Konačan poslovni email na domenu** — zameniti privremeni
      `kontakt@tapetarijaalekom.rs` u `src/data/site.ts`, `.env.example` i Vercel
      env promenljivama.
- [ ] **Resend produkcija** — potvrditi domen, uneti `RESEND_API_KEY`,
      `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, testirati 1/3/5 fotografija, pa
      tek onda uključiti `NEXT_PUBLIC_CONTACT_FORM_ENABLED=true`.
- [ ] **Hero fotografija** — po zahtevu je ostala postojeća privremena hero slika; zameniti je samo ako klijent naknadno odobri novu.
- [x] **Originalne fotografije radova** — usluge, radionica i pre/posle galerija koriste dostavljene fotografije; objavljeni projekti imaju `isPlaceholder: false`.
- [ ] **Pravna provera privatnosti** — pravnik treba da potvrdi finalni tekst,
      Vercel/Resend procesore i predloženi rok čuvanja upita od 12 meseci.

## Kada podaci stignu

- [ ] Autentični tekstovi recenzija sa javnim izvorom/dozvolom. Do tada je
      sekcija prazna i skrivena.
- [ ] Potvrditi tačan naziv/spelling dodatnih dobavljača: Biptex, Drugi Maj i
      Alnassa. Do tada se javno prikazuju samo Mercis, Dezen Plus i Davis
      Fabrics.
- [ ] Nazivi i dokumentacija sertifikata/obuka/priznanja. Data model može biti
      dodat kasnije; ništa se sada ne renderuje.
- [ ] Eventualni Facebook, TikTok i YouTube URL-ovi. Prazne ikone se ne
      prikazuju.
- [ ] GA4 Measurement ID (`NEXT_PUBLIC_GA_ID`). Bez ID-a nema GA skripte ni
      consent bannera.
- [ ] Meta Pixel, samo kao buduća consent-aware integracija uz dopunu politike
      kolačića.

## Google Business

- [ ] Uneti kompletno radno vreme Pon–Pet 08:00–17:00, vikend zatvoreno.
- [ ] Ažurirati opis, kategoriju, fotografije i link ka sajtu.
- [ ] Održavati NAP identičnim sajtu.
- [ ] Dodati Instagram, redovne objave i legalan link/QR za prikupljanje
      recenzija.

