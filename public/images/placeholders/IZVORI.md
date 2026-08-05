# Privremene fotografije

**Nijedna fotografija u ovom folderu ne prikazuje stvaran rad Tapetarije
Alekom.** Sve su privremene i služe isključivo razvoju dizajna.

## Poreklo

Fotografije su generisane pomoću AI modela za potrebe razvoja. Nisu preuzete sa
Unsplasha ni Pexelsa — direktna pretraga tih servisa nije bila dostupna iz
okruženja u kom je sajt građen, a generisanje uklanja i pitanje licence i
atribucije. Ako se pre dobijanja pravih fotografija poželi stock, ovi fajlovi se
zamenjuju istim imenima i dimenzije se ažuriraju u `src/data/images.ts`.

## Kako su nastali „pre" snimci

`*-pre.jpg` nisu odvojene fotografije. Izvedeni su iz istog fajla kao
`*-posle.jpg` — smanjenom zasićenošću, blagom patinom i tragovima trošenja.
Razlog je tehnički: klizač pre/posle radi smisleno samo ako je kadar identičan,
a dva odvojena snimka se nikada ne poklapaju piksel u piksel.

## Spisak

| Fajl | Namena |
|---|---|
| `hero-radionica.jpg` | hero na početnoj |
| `radionica-detalj.jpg` | sekcija procesa, prazno stanje `/radovi` |
| `materijali.jpg` | sekcija materijala |
| `servis-presvlacenje.jpg` | usluga: presvlačenje nameštaja |
| `servis-koza.jpg` | usluga: kožni nameštaj |
| `servis-stilski.jpg` | usluga: stilski i antikvarni |
| `servis-ugostiteljstvo.jpg` | usluga: kafići i restorani |
| `servis-bastenski.jpg` | usluga: baštenski program |
| `servis-sivenje.jpg` | usluga: šivenje po meri |
| `trosed-pre.jpg` / `trosed-posle.jpg` | demonstracioni par |
| `fotelja-pre.jpg` / `fotelja-posle.jpg` | demonstracioni par |
| `stolice-pre.jpg` / `stolice-posle.jpg` | demonstracioni par |

## Zaštita od prikazivanja kao pravi rad

- Svaki projekat u `src/data/projects.ts` ima `isPlaceholder: true`
- U produkciji se takvi projekti **ne prikazuju** —
  `flags.showPlaceholderProjects` je trenutno uključen radi pregleda dizajna
- Nose vidljivu oznaku **„Demonstracioni sadržaj"**
- Sekcija pre/posle (`flags.beforeAfter`) je uključena za pregled — pred
  lansiranje sa pravim fotografijama isključiti demo projekte
- Nigde ne postoji natpis koji tvrdi da je nešto izveden rad

## Zamena pravim fotografijama

1. Ubaci prave fajlove (može i pod istim imenima)
2. Ažuriraj `src/data/images.ts` — putanju, **prave dimenzije** i alt tekst
3. U `src/data/projects.ts` postavi `isPlaceholder: false`
4. Kada ima dovoljno parova, uključi `flags.beforeAfter` i `flags.worksInNav`
5. Obriši nezamenjene privremene fajlove iz ovog foldera

### Uputstvo klijentu za snimanje pre/posle

- Isti komad, **isti ugao i ista razdaljina** pre i posle
- Dnevno svetlo, bez blica
- Telefon je dovoljan
- Komad u kadru celom dužinom, sa malo prostora oko njega
- Pozadina što neutralnija
- Uslikati i detalj šava ili tkanine

Cilj je 20–30 slika ukupno. Za prikaz na sajtu dovoljno je 2–3 dobra para.
