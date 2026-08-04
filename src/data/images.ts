import type { ImageKey, Slika } from "@/types";

/**
 * Sve slike na jednom mestu.
 *
 * PAŽNJA: sve slike su privremene i generisane su samo da bi se razvio dizajn.
 * Nijedna ne prikazuje stvaran rad Tapetarije Alekom. Zamena je opisana u
 * public/images/placeholders/IZVORI.md — dovoljno je zameniti fajl i ažurirati
 * dimenzije i alt tekst ovde, komponente se ne diraju.
 */

const P = "/images/placeholders";

export const images: Record<ImageKey, Slika> = {
  "hero-radionica": {
    src: `${P}/hero-radionica.jpg`,
    width: 1536,
    height: 1024,
    alt: "Tapetarska radionica sa delimično rasklopljenim kaučem i rolnama tkanine",
    privremena: true,
  },
  "radionica-detalj": {
    src: `${P}/radionica-detalj.jpg`,
    width: 1200,
    height: 800,
    alt: "Detalj ručno ukucanih tapetarskih klinaca na drvenom ramu stolice",
    privremena: true,
  },
  materijali: {
    src: `${P}/materijali.jpg`,
    width: 1400,
    height: 933,
    alt: "Uzorci tkanina za tapaciranje raspoređeni uz metar i kalemove konca",
    privremena: true,
  },
  "servis-presvlacenje": {
    src: `${P}/servis-presvlacenje.jpg`,
    width: 1200,
    height: 800,
    alt: "Ruke razvlače tkaninu preko naslona kauča pri presvlačenju",
    privremena: true,
  },
  "servis-koza": {
    src: `${P}/servis-koza.jpg`,
    width: 1200,
    height: 800,
    alt: "Detalj šava na koži fotelje sa tapetarskim dugmetom",
    privremena: true,
  },
  "servis-stilski": {
    src: `${P}/servis-stilski.jpg`,
    width: 1200,
    height: 800,
    alt: "Restaurirana stilska fotelja sa rezbarenim drvetom, presvučena u somot",
    privremena: true,
  },
  "servis-ugostiteljstvo": {
    src: `${P}/servis-ugostiteljstvo.jpg`,
    width: 1200,
    height: 800,
    alt: "Tapacirani separe u ugostiteljskom prostoru sa stolom",
    privremena: true,
  },
  "servis-bastenski": {
    src: `${P}/servis-bastenski.jpg`,
    width: 1200,
    height: 800,
    alt: "Baštenska ljuljaška sa novom tendom od jedrenke",
    privremena: true,
  },
  "servis-sivenje": {
    src: `${P}/servis-sivenje.jpg`,
    width: 1200,
    height: 800,
    alt: "Šivenje šava na tkanini za tapaciranje na industrijskoj mašini",
    privremena: true,
  },
  "trosed-pre": {
    src: `${P}/trosed-pre.jpg`,
    width: 1400,
    height: 933,
    alt: "Trosed pre presvlačenja, sa izbledelom i istrošenom tkaninom",
    privremena: true,
  },
  "trosed-posle": {
    src: `${P}/trosed-posle.jpg`,
    width: 1400,
    height: 933,
    alt: "Isti trosed posle presvlačenja u tkaninu tamnozelene boje",
    privremena: true,
  },
  "fotelja-pre": {
    src: `${P}/fotelja-pre.jpg`,
    width: 1400,
    height: 933,
    alt: "Fotelja pre obnove, sa izbledelom presvlakom",
    privremena: true,
  },
  "fotelja-posle": {
    src: `${P}/fotelja-posle.jpg`,
    width: 1400,
    height: 933,
    alt: "Ista fotelja posle presvlačenja u tkaninu boje gline",
    privremena: true,
  },
  "stolice-pre": {
    src: `${P}/stolice-pre.jpg`,
    width: 1400,
    height: 933,
    alt: "Trpezarijske stolice pre tapaciranja, sa istrošenim sedištima",
    privremena: true,
  },
  "stolice-posle": {
    src: `${P}/stolice-posle.jpg`,
    width: 1400,
    height: 933,
    alt: "Iste stolice posle tapaciranja sedišta u lan boje peska",
    privremena: true,
  },
};

export function img(key: ImageKey): Slika {
  return images[key];
}
