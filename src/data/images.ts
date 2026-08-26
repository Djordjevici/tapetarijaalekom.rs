import type { ImageKey, Slika } from "@/types";

/**
 * Sve slike na jednom mestu.
 *
 * Hero ostaje postojeća privremena vizuelna verzija po zahtevu.
 * Ostale fotografije potiču iz stvarnih fotografija radova koje je dostavio
 * klijent i pripremljene su za web (kadar, format i kompresija).
 */

const DEMO = "/images/placeholders";
const REAL = "/images/radovi";

export const images: Record<ImageKey, Slika> = {
  "hero-radionica": {
    src: `${DEMO}/hero-radionica.jpg`,
    width: 1536,
    height: 1024,
    alt: "Tapetarska radionica sa delimično rasklopljenim kaučem i rolnama tkanine",
    privremena: true,
  },
  "radionica-detalj": {
    src: `${REAL}/radionica-detalj.webp`,
    width: 1440,
    height: 960,
    alt: "Fotelja u procesu obnove u tapetarskoj radionici",
    privremena: false,
  },
  materijali: {
    src: `${REAL}/materijali.webp`,
    width: 1440,
    height: 960,
    alt: "Tapacirana stolica u somotu sa izraženom teksturom i završnom obradom",
    privremena: false,
  },
  "servis-presvlacenje": {
    src: `${REAL}/servis-presvlacenje.webp`,
    width: 1440,
    height: 960,
    alt: "Svetlosivi dvosed nakon presvlačenja i završne obrade",
    privremena: false,
  },
  "servis-koza": {
    src: `${REAL}/servis-koza.webp`,
    width: 1440,
    height: 960,
    alt: "Ugaona garnitura sa tamnim kožnim delovima i svetlim tapaciranim sedištima",
    privremena: false,
  },
  "servis-stilski": {
    src: `${REAL}/servis-stilski.webp`,
    width: 1440,
    height: 960,
    alt: "Obnovljena fotelja sa drvenim rukonaslonima i žutom presvlakom",
    privremena: false,
  },
  "servis-ugostiteljstvo": {
    src: `${REAL}/servis-ugostiteljstvo.webp`,
    width: 1440,
    height: 960,
    alt: "Tapacirane barske stolice i klupa u ugostiteljskom enterijeru",
    privremena: false,
  },
  "servis-bastenski": {
    src: `${REAL}/servis-bastenski.webp`,
    width: 1440,
    height: 960,
    alt: "Baštenske fotelje sa novim svetlim jastucima na terasi",
    privremena: false,
  },
  "servis-sivenje": {
    src: `${REAL}/servis-sivenje.webp`,
    width: 1440,
    height: 960,
    alt: "Jastuci i tapacirana klupa izrađeni po meri uz prozor",
    privremena: false,
  },
  "fotelja-pre": {
    src: `${REAL}/fotelja-pre.webp`,
    width: 1440,
    height: 960,
    alt: "Fotelja sa drvenim rukonaslonima pre obnove presvlake",
    privremena: false,
  },
  "fotelja-posle": {
    src: `${REAL}/fotelja-posle.webp`,
    width: 1440,
    height: 960,
    alt: "Ista fotelja nakon obnove u zelenoj tkanini",
    privremena: false,
  },
  "stolice-pre": {
    src: `${REAL}/stolice-pre.webp`,
    width: 1440,
    height: 960,
    alt: "Barska stolica sa oštećenom braon presvlakom pre obnove",
    privremena: false,
  },
  "stolice-posle": {
    src: `${REAL}/stolice-posle.webp`,
    width: 1440,
    height: 960,
    alt: "Barska stolica nakon presvlačenja u tamnosivu tkaninu",
    privremena: false,
  },
};

export function img(key: ImageKey): Slika {
  return images[key];
}
