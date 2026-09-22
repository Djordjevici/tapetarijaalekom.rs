# Slike

## Izvori i upotreba

Fajlovi se koriste na sajtu uz navedene namene. Pri ažuriranju slika zadržavaju
se imena fajlova, a dimenzije i alt tekst se ažuriraju u
`src/data/images.ts`.

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
| `trosed-pre.jpg` / `trosed-posle.jpg` | par pre i posle |
| `fotelja-pre.jpg` / `fotelja-posle.jpg` | par pre i posle |
| `stolice-pre.jpg` / `stolice-posle.jpg` | par pre i posle |

## Ažuriranje fotografija

1. Ubaci fajlove pod postojećim imenima
2. Ažuriraj `src/data/images.ts` — putanju, dimenzije i alt tekst
3. U `src/data/projects.ts` postavi `isPlaceholder: false`
4. Kada ima dovoljno parova, uključi `flags.beforeAfter` i `flags.worksInNav`
5. Uskladi sadržaj foldera sa evidencijom

### Uputstvo klijentu za snimanje pre/posle

- Isti komad, **isti ugao i ista razdaljina** pre i posle
- Dnevno svetlo, bez blica
- Telefon je dovoljan
- Komad u kadru celom dužinom, sa malo prostora oko njega
- Pozadina što neutralnija
- Uslikati i detalj šava ili tkanine

Cilj je 20–30 slika ukupno. Za prikaz na sajtu dovoljno je 2–3 dobra para.
