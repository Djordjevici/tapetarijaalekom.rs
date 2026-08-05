# Logotip — reproducibilna izrada

Logo je pravi vektor. Slova **nisu trasirana iz PNG-a** — krive su izvučene iz
Fraunces fonta preko `fontTools`, pa je svaki glif pojedinačno pozicioniran i
rotiran po luku kruga. Zbog toga gotovi SVG fajlovi ne zavise od prisustva fonta
na sistemu i nemaju ni jedan rasterski deo.

## Pokretanje

```bash
pip install fonttools

# 1. Preuzmi Fraunces (roman + kurziv) u /tmp/fonts
curl -sL -o "/tmp/fonts/Fraunces[SOFT,WONK,opsz,wght].ttf" \
  "https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/Fraunces%5BSOFT,WONK,opsz,wght%5D.ttf"
curl -sL -o "/tmp/fonts/Fraunces-Italic[SOFT,WONK,opsz,wght].ttf" \
  "https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/Fraunces-Italic%5BSOFT,WONK,opsz,wght%5D.ttf"

# 2. Izvuci krive slova u /tmp/logo/glyphs.json
python3 tools/logo/extract-glyphs.py

# 3. Generiši SVG varijante u public/logo/
python3 tools/logo/build-logo.py
```

## Šta se generiše

| Fajl | Namena |
|---|---|
| `alekom-seal.svg` | Pun pečat sa kružnim tekstom — od oko 64 px |
| `alekom-seal-dark.svg` | Isto, za tamnu podlogu |
| `alekom-seal-mono.svg` | Jednobojno, `currentColor` |
| `alekom-seal-alt-a.svg` | Alternativni monogram (WONK isključen) |
| `alekom-mark.svg` | Uprošćen znak — prsten, monogram, tačkasti šav |
| `alekom-mark-dark.svg` | Isto, za tamnu podlogu |
| `alekom-mark-mono.svg` | Jednobojno |
| `alekom-lockup.svg` | Vodoravno, za header: znak + naziv u dva reda |
| `alekom-lockup-dark.svg` | Isto, za tamnu podlogu |
| `alekom-lockup-mono.svg` | Jednobojno |
| `favicon.svg` | Znak, za 24 px i više |
| `favicon-tiny.svg` | Samo prsten i monogram, za 16 px |
| `favicon-tiny-dark.svg` | Isto, za tamnu podlogu |

`reference/` sadrži originalne PNG fajlove kao referencu za poređenje.

## Podešavanje

Ključne konstante na vrhu `build-logo.py`:

- `R_RING`, `RING_W` — spoljašnji prsten
- `CAP` — visina verzala u kružnom tekstu
- `BAND_OUTER` — koliko je tekstualni pojas uvučen od prstena
- `R_STITCH` — radijus bakarnog šava i tačaka
- `TRACK` — razmak između slova u kružnom tekstu
- `MONO_VARIANT` — `italic_wonk1` ili `italic_wonk0`

## Napomene

**Jednobojnu verziju ubacivati ugrađeno**, kao React komponentu ili inline SVG.
Kroz `<img>` `currentColor` ne može da se nasledi, pa boja neće raditi.

**Preciznost brojeva.** `fmt()` koristi 6 značajnih cifara. Zaokruživanje na
2 decimale kvari sitne `scale` faktore (npr. `0.0055` postane `0.01`, što je
greška od 80% u veličini teksta). Ne smanjivati preciznost.

**Razlika od originala.** Na PNG originalu A ima dekorativnu petlju na donjem
kraju leve noge. Fraunces kurziv nema taj zavijutak, pa je noga prava. Karakter
je isti — elegantan kurzivni serif — bez izmišljanja poteza kojeg nema u brend
fontu. Petlja se može docrtati ručno ako se tako odluči.

## Pregled

`public/logo/preview.html` — poređenje sa originalom, svetla i tamna podloga,
jednobojna verzija, favicon veličine, i simulacija headera.

## Rasterizovane app ikone

iOS Safari ne rasterizuje SVG za `apple-touch-icon`, a deo Android/Chromium
implementacija web manifesta i dalje očekuje PNG. Zato pored SVG-ova postoje i
rasterizovane verzije, generisane iz `alekom-mark.svg`:

```bash
node tools/logo/gen-app-icons.js
```

Piše u `public/icons/`: `apple-touch-icon.png` (180×180), `icon-192.png`,
`icon-512.png` (manifest, `purpose: any`) i `icon-maskable-512.png` (manifest,
`purpose: maskable`, monogram uvučen u bezbednu zonu). Pokrenuti ponovo ako se
`alekom-mark.svg` promeni.
