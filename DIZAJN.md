# Vizuelni sistem

Pravac: **tihi luksuz zanata.** Tamne sekcije nose fotografije i emociju,
svetle nose čitanje. Bakar je nit koja ih povezuje — tanka i štedljiva.

## Boje

| Token | HEX | Upotreba |
|---|---|---|
| `sumrak` | `#1C2F2A` | glavna tamna: hero header, CTA sekcije |
| `ugljen` | `#12151A` | najdublja: pre/posle, lokacija, footer |
| `platno` | `#E7E6E0` | svetla osnova za čitanje |
| `papir` | `#F2F1EB` | najsvetlija: sekcije teksta |
| `bakar` | `#BE7242` | akcenat |
| `bakar-svetli` | `#D08B5C` | hover, akcenat na tamnom |
| `orah` | `#2B241F` | duboki topli ton |
| `lisce` | `#869896` | prigušeni sekundarni akcenat |

Paleta je spoj pravaca A i B iz predloga klijentu.

### Bakar — pravila

Koristi se **isključivo** za: tanke linije i motiv šava, hover i focus, aktivnu
navigaciju, numeraciju koraka, male oznake, detalj logotipa, primarno dugme.

Nikada: velike pozadinske površine, metalik gradijenti, sjaj.

## Tipografija

| | Font | Upotreba |
|---|---|---|
| Naslovi | **Fraunces** | h1–h4, brojevi koraka, citati. Kurziv za akcenat |
| Tekst | **Manrope** | telo, navigacija, dugmad, forme |

Samo dve porodice. Fraunces dolazi iz pravca A, Manrope iz pravca B.

Skala je fluidna (`clamp`), od 320 px do 1920 px:

```
h1     clamp(2.35rem, 6.2vw, 4.6rem)   line-height 1.04, tracking -0.022em
h2     clamp(1.75rem, 3.8vw, 2.85rem)
h3     clamp(1.2rem, 2vw, 1.5rem)
lede   clamp(1.02rem, 1.5vw, 1.2rem)   line-height 1.6
body   clamp(0.95rem, 1.1vw, 1.02rem)  line-height 1.65
```

## Prostor i oblik

- Sekcije: `clamp(4.5rem, 9vw, 8.5rem)` vertikalno
- Sadržaj: `max-w-sadrzaj` = 76rem, tekst `max-w-tekst` = 38rem
- Grid 12 kolona, asimetrični rasporedi (7/5, 5/7), naizmenično levo/desno
- Radijusi mali i namerni: 10 px za slike, `999px` samo za pilule.
  **Bez preterano zaobljenih kartica**
- Ivice umesto senki

## Ritam sekcija

Naizmenične podloge, da nijedna sekcija ne izgleda kao nastavak prethodne i da
se izbegne beskrajna tamna površina:

```
hero          ugljen     ← momenat
trust         sumrak
usluge        platno     ← čitanje
pre/posle     ugljen     ← momenat
marquee       ugljen
proces        papir      ← čitanje
zašto mi      sumrak
materijali    platno     ← čitanje
cena          papir
procena       sumrak     ← konverzija
FAQ           papir
lokacija      ugljen
završni CTA   sumrak
footer        ugljen
```

## Animacije

Tri nivoa, da se izbegne ponavljanje istim intenzitetom.

**Nivo 1 — tiho.** Reveal na skrol: `opacity` + `translateY(16px)`, 700 ms,
`cubic-bezier(0.22, 1, 0.36, 1)`, stagger 50–90 ms. Jednom, ne ponavlja se.

**Nivo 2 — prisutno.** Parallax hero fotografije (do 90 px, samo od 768 px).
Bakarni šav koji se iscrtava. Skaliranje fotografije na hover (1.03–1.04).

**Nivo 3 — momenat.** Sekvencijalni ulazak heroja. Jedan spor marquee na strani.
Demonstracija klizača pre/posle pri prvom ulasku u vidno polje.

**Mikrointerakcije.** Dugmad: bakarna nit izraste iz leve ivice. Linkovi:
linija se izduži. Focus: bakarni prsten, uvek vidljiv.

### Pravila bez izuzetka

- Animiraju se samo `transform` i `opacity`
- Sadržaj je u DOM-u i čitljiv **pre** animacije — animacija nikada ne odlaže prikaz
- Bez JS-a (`.bez-js`) sve je odmah vidljivo
- `prefers-reduced-motion: reduce` gasi sve; klizač pre/posle ostaje potpuno upotrebljiv
- Bez fake loading ekrana, zvuka, rotiranja blokova teksta i custom cursora
- Na telefonu: parallax isključen

## Hero copy

Potvrđena varijanta:

> Tapetarija u Novom Sadu — od 2006.
> **Presvlačimo nameštaj koji vredi zadržati.**
> Tapaciranje, obnova i šivenje po meri. Pošaljite fotografiju i zatražite procenu.

CTA na desktopu: „Pošaljite fotografiju za procenu" primarno, „Pozovite" sekundarno.
Na telefonu obrnuto — poziv prvi.

### Alternativne varijante (nisu u kodu)

**B — konkretnija, jače lokalno:**
> Tapetarska radionica — Petrovaradin, Novi Sad
> Kauč koji volite ne mora u otpad.
> Presvlačenje i obnova nameštaja od 2006. Pošaljite fotografiju — javljamo procenu.

**C — mirnija, zanat u prvom planu:**
> Od 2006. — Novi Sad i okolina
> Šav po šav, nameštaj se vraća u život.
> Tapaciranje, restauracija i šivenje po meri. Procena na osnovu vaših fotografija.

## Ton pisanja

Formalno „vi", ali prirodno i neposredno. Ni hladno poslovno, ni familijarno.

Konkretno umesto marketinškog: „Ako gurtne i sunđer više ne drže, nova tkanina
za godinu izgleda kao stara" radi bolje od „vrhunski kvalitet i dugogodišnje
iskustvo".

Bez izmišljenih brojeva, ocena i izjava klijenata.

## Šta se ne koristi

Generičan SaaS izgled · nasumični gradijenti · preterano zaobljene kartice ·
mreže identičnih kartica · sitan tekst bez razloga · prenatrpanost · jeftine
animacije · ikonice bez svrhe · stock fotografije poslovnih ljudi ·
rukovanje · fake loading · zvuk · custom cursor · horizontalni skrol na
telefonu · skrivanje osnovne navigacije radi efekta · lažni brojevi i recenzije.
