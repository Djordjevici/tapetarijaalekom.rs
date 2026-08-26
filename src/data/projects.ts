import type { Project } from "@/types";

/**
 * Stvarni projekti za sekciju „Pre i posle" i stranicu /radovi.
 *
 * Fotografije potiču iz materijala Tapetarije Alekom. Parovi nisu snimani iz
 * potpuno istog ugla, pa služe kao poređenje stanja komada pre i nakon rada,
 * bez tvrdnje da su kadrovi piksel-po-piksel poravnati.
 */
export const projects: readonly Project[] = [
  {
    slug: "obnova-fotelje-zelena-tkanina",
    title: "Obnova fotelje sa drvenim rukonaslonima",
    shortTitle: "Fotelja",
    category: "Presvlačenje nameštaja",
    summary:
      "Fotelja sa drvenim ramom fotografisana je pre i nakon obnove. Završni komad je presvučen zelenom tkaninom uz zadržan karakter postojećeg drvenog rama.",
    beforeImage: "fotelja-pre",
    afterImage: "fotelja-posle",
    gallery: ["fotelja-posle"],
    materials: ["Zelena tkanina"],
    workPerformed: [
      "Obnova tapaciranih površina",
      "Nova presvlaka sedišta i naslona",
      "Završno zatezanje i obrada",
    ],
    duration: null,
    isPlaceholder: false,
    featured: true,
    published: true,
    seo: {
      title: "Obnova fotelje — Tapetarija Alekom",
      description:
        "Primer obnove fotelje sa drvenim rukonaslonima i novom zelenom presvlakom.",
    },
  },
  {
    slug: "obnova-barske-stolice",
    title: "Presvlačenje barske stolice",
    shortTitle: "Barska stolica",
    category: "Presvlačenje stolica",
    summary:
      "Istrošena braon presvlaka zamenjena je tamnosivom tkaninom, dok je postojeća metalna konstrukcija stolice zadržana.",
    beforeImage: "stolice-pre",
    afterImage: "stolice-posle",
    gallery: ["stolice-posle"],
    materials: ["Tamnosiva tkanina"],
    workPerformed: [
      "Skidanje stare presvlake",
      "Presvlačenje sedišta i naslona",
      "Završna obrada ivica",
    ],
    duration: null,
    isPlaceholder: false,
    featured: true,
    published: true,
    seo: {
      title: "Presvlačenje barske stolice — Tapetarija Alekom",
      description:
        "Primer presvlačenja barske stolice iz braon u tamnosivu presvlaku.",
    },
  },
];

/** Projekti koji smeju da se prikažu u trenutnom okruženju. */
export function visibleProjects(showPlaceholders: boolean): readonly Project[] {
  return projects.filter(
    (p) => p.published && (showPlaceholders || !p.isPlaceholder),
  );
}

/** Filteri se prikazuju samo kada ima dovoljno projekata u više kategorija. */
export function categoriesOf(list: readonly Project[]): readonly string[] {
  const seen = new Map<string, number>();
  for (const p of list) seen.set(p.category, (seen.get(p.category) ?? 0) + 1);
  return seen.size > 1 && list.length >= 4 ? [...seen.keys()] : [];
}

/** Koristi se za sitemap/noindex: demo projekti nisu javni portfolio. */
export const hasPublishedRealProjects = projects.some(
  (p) => p.published && !p.isPlaceholder,
);
