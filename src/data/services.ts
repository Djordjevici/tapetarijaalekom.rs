import type { Service } from "@/types";

/**
 * Samo usluge koje je klijent potvrdio.
 *
 * IKEA navlake su izostavljene iz vidljivog sadržaja dok se ne potvrdi da je
 * to aktivna usluga — vidi flags.ikeaCovers.
 *
 * Auto, moto i plovila se ne rade i ne smeju se pojaviti u sadržaju.
 */
export const services: readonly Service[] = [
  {
    slug: "presvlacenje-namestaja",
    title: "Presvlačenje nameštaja",
    lead: "Kauči, fotelje, stolice i taburei",
    body:
      "Komad se rasklapa do konstrukcije, proverava se noseći ram i ono na čemu se sedi, pa se kroji i šije nova presvlaka. Ako sunđer ili gurtne više ne drže oblik, to se rešava u istom prolazu — inače nova tkanina za godinu dana izgleda isto kao stara.",
    solves:
      "Tkanina je izbledela, eko-koža se ljušti ili se sedište ulegnulo, a komad je i dalje čvrst.",
    items: ["Trosed i dvosed", "Ugaona garnitura", "Fotelja", "Trpezarijske stolice", "Tabure i podnožje"],
    image: "servis-presvlacenje",
    featured: true,
  },
  {
    slug: "kozni-namestaj",
    title: "Kožni nameštaj",
    lead: "Presvlačenje u kožu i obnova kožnih komada",
    body:
      "Koža se ponaša drugačije od tkanine — drugačije se kroji, popušta na drugim mestima i traži drugu vrstu šava. Radimo presvlačenje kožnih garnitura i fotelja, kao i zamenu pojedinačnih delova kada je ostatak komada u dobrom stanju.",
    solves:
      "Koža je popucala na naslonima ili sedištu, ili želite da postojeći komad pređe iz tkanine u kožu.",
    items: ["Kožne garniture", "Kožne fotelje", "Kancelarijske stolice", "Zamena pojedinačnih delova"],
    image: "servis-koza",
    featured: true,
  },
  {
    slug: "stilski-i-antikvarni",
    title: "Stilski i antikvarni nameštaj",
    lead: "Restauracija komada koji imaju vrednost",
    body:
      "Kod starog nameštaja cilj nije da izgleda kao nov, nego da zadrži svoj karakter. Zato se radi pažljivije: konstrukcija se ojačava, originalni profili se poštuju, a tkanina se bira tako da odgovara periodu komada. Ovo je posao gde se najviše vidi razlika u šavu i završnoj obradi.",
    solves:
      "Nasledili ste ili kupili komad sa istorijom i ne želite da izgubi ono što ga čini posebnim.",
    items: ["Stilske fotelje", "Klasični trosedi", "Stolice sa rezbarijom", "Kožna galanterija"],
    image: "servis-stilski",
    featured: true,
  },
  {
    slug: "kafici-i-restorani",
    title: "Kafići i restorani",
    lead: "Tapaciranje prostora koji rade svaki dan",
    body:
      "U ugostiteljstvu nameštaj trpi višestruko veće trošenje od kućnog, pa se drugačije bira materijal i drugačije rešavaju ivice i uglovi. Radimo separee, klupe, barske stolice i sedišta, sa dogovorom o rasporedu radova da lokal stoji što kraće.",
    solves:
      "Sedišta i separei su istrošeni i ostavljaju loš prvi utisak, a zatvaranje lokala je skupo.",
    items: ["Separei i klupe", "Barske stolice", "Sedišta i naslon", "Zidne oblodge sa tapacirungom"],
    image: "servis-ugostiteljstvo",
    featured: false,
  },
  {
    slug: "bastenski-program",
    title: "Baštenski program",
    lead: "Tende, ljuljaške i ležaljke",
    body:
      "Za spolja se koriste materijali koji izdrže sunce i vlagu, jer obična tkanina za nekoliko sezona pređe u drugu boju. Šijemo nove tende i navlake za ljuljaške, kao i presvlake za baštenske ležaljke i sedalice.",
    solves:
      "Tenda je propustila, izbledela ili se pokidala, a konstrukcija ljuljaške je sasvim u redu.",
    items: ["Tende za ljuljaške", "Presvlake za ležaljke", "Baštenske sedalice", "Jastuci za spolja"],
    image: "servis-bastenski",
    featured: false,
  },
  {
    slug: "sivenje-po-meri",
    title: "Šivenje po meri",
    lead: "Presvlake, jastuci i tekstil za enterijer",
    body:
      "Kada komad ne treba rasklapati, radi se samo krojenje i šivenje po meri. Tu spadaju navlake koje se skidaju i peru, dekorativni jastuci i tekstilni detalji koji povezuju prostor.",
    solves:
      "Želite da osvežite prostor bez većih radova, ili vam treba nešto što se ne kupuje u standardnim dimenzijama.",
    items: ["Navlake po meri", "Dekorativni jastuci", "Presvlake za sedišta", "Tekstil za enterijer"],
    image: "servis-sivenje",
    featured: false,
  },
];

export const featuredServices = services.filter((s) => s.featured);

export function serviceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
