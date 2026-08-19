import type { Project } from "@/types";

/**
 * Projekti za sekciju „Pre i posle" i stranicu /radovi.
 *
 * SVI projekti su trenutno demonstracioni (isPlaceholder: true) i služe samo
 * razvoju dizajna i animacija. U produkciji se ne prikazuju — vidi
 * flags.showPlaceholderProjects i flags.beforeAfter.
 *
 * Kako dodati pravi projekat:
 *   1. Ubaci fotografije u public/images/ i upiši ih u src/data/images.ts
 *   2. Dodaj unos ovde sa isPlaceholder: false i published: true
 *   3. Kad postoje najmanje 2–3 prava para, uključi flags.beforeAfter
 * Komponente se pri tome ne menjaju.
 */
export const projects: readonly Project[] = [
  {
    slug: "trosed-tamnozelena-tkanina",
    title: "Trosed u tamnozelenoj tkanini",
    shortTitle: "Trosed",
    category: "Presvlačenje nameštaja",
    summary:
      "Konstrukcija je bila zdrava, ali je tkanina izbledela i sedište se ulegnulo. Zamenjen je sunđer u sedištu i presvučeno u gustu tkaninu.",
    beforeImage: "trosed-pre",
    afterImage: "trosed-posle",
    gallery: ["trosed-posle"],
    materials: ["Tkanina tamnozelene boje", "Novi sunđer u sedištu"],
    workPerformed: [
      "Rasklapanje do konstrukcije",
      "Zamena sunđera u sedištu",
      "Krojenje i šivenje nove presvlake",
      "Završna obrada ivica",
    ],
    duration: null,
    isPlaceholder: true,
    featured: true,
    published: true,
    seo: {
      title: "Presvlačenje troseda — Tapetarija Alekom",
      description:
        "Trosed presvučen u tamnozelenu tkaninu, sa zamenom sunđera u sedištu.",
    },
  },
  {
    slug: "fotelja-boja-gline",
    title: "Fotelja u boji gline",
    shortTitle: "Fotelja",
    category: "Presvlačenje nameštaja",
    summary:
      "Fotelja sa drvenim nogama, obnovljena bez menjanja originalnog oblika. Drvo je očišćeno, presvlaka zamenjena.",
    beforeImage: "fotelja-pre",
    afterImage: "fotelja-posle",
    gallery: ["fotelja-posle"],
    materials: ["Tkanina boje gline", "Nove gurtne"],
    workPerformed: [
      "Skidanje stare presvlake",
      "Zamena gurtni",
      "Krojenje po originalnim delovima",
      "Obnova drvenih nogu",
    ],
    duration: null,
    isPlaceholder: true,
    featured: true,
    published: true,
    seo: {
      title: "Obnova fotelje — Tapetarija Alekom",
      description: "Fotelja presvučena u tkaninu boje gline, uz obnovu drvenih nogu.",
    },
  },
  {
    slug: "trpezarijske-stolice-lan",
    title: "Trpezarijske stolice u lanu",
    shortTitle: "Stolice",
    category: "Presvlačenje nameštaja",
    summary:
      "Sedišta su bila probijena od svakodnevne upotrebe. Tapacirana su u lan boje peska, sa pojačanjem ispod sedišta.",
    beforeImage: "stolice-pre",
    afterImage: "stolice-posle",
    gallery: ["stolice-posle"],
    materials: ["Lan boje peska", "Pojačanje ispod sedišta"],
    workPerformed: [
      "Skidanje sedišta",
      "Pojačanje nosećih ploča",
      "Tapaciranje i zatezanje",
      "Vraćanje na ram",
    ],
    duration: null,
    isPlaceholder: true,
    featured: true,
    published: true,
    seo: {
      title: "Tapaciranje trpezarijskih stolica — Tapetarija Alekom",
      description: "Trpezarijske stolice sa sedištima tapaciranim u lan boje peska.",
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
