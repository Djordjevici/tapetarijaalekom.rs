import type { Service } from "@/types";

/** Potvrđene usluge, grupisane u šest čitljivih celina. */
export const services: readonly Service[] = [
  {
    slug: "presvlacenje-namestaja",
    title: "Presvlačenje i tapaciranje nameštaja",
    lead: "Kućni nameštaj — od stolice do ugaone garniture",
    body:
      "Obnavljamo kauče, sofe, trosede, dvoseda, fotelje, ugaone garniture, stolice, taburee, klupe, krevete i uzglavlja. Pre nove presvlake proveravamo stanje sunđera, opruga, gurtni i traka, pa predlažemo obim koji ima smisla za konkretan komad.",
    solves:
      "Presvlaka je istrošena, sedište se uleglo ili komad više ne odgovara enterijeru, ali ga zbog kvaliteta ili vrednosti želite da zadržite.",
    items: [
      "Kauči, sofe, trosedi i dvosedi",
      "Ugaone garniture",
      "Fotelje i stolice",
      "Taburei i klupe",
      "Kreveti i uzglavlja",
      "Kancelarijske stolice",
    ],
    image: "servis-presvlacenje",
    featured: true,
  },
  {
    slug: "kozni-namestaj",
    title: "Kožni nameštaj",
    lead: "Prirodna koža, eko-koža i kožna galanterija",
    body:
      "Radimo presvlačenje i popravku kožnog nameštaja prirodnom kožom ili eko-kožom, kao i kožnu galanteriju. Koža se drugačije kroji, zateže i šije od tkanine, pa se svakom delu pristupa prema obliku i mestu opterećenja.",
    solves:
      "Koža ili eko-koža je popucala i oljuštila se, potrebno je zameniti oštećene delove ili želite novu kožnu presvlaku.",
    items: [
      "Kožne garniture i fotelje",
      "Prirodna koža",
      "Eko-koža",
      "Kožne kancelarijske stolice",
      "Kožna galanterija",
    ],
    image: "servis-koza",
    featured: true,
  },
  {
    slug: "poslovni-enterijeri",
    title: "Poslovni i ugostiteljski enterijeri",
    lead: "Kafići, restorani, hoteli, kancelarije i drugi poslovni prostori",
    body:
      "Za ugostiteljske i poslovne enterijere radimo pojedinačne komade, serije stolica, klupe, separee i druga tapacirana rešenja prema projektu. Materijal i način izrade biraju se prema nameni i intenzitetu korišćenja.",
    solves:
      "Enterijer traži obnovu postojećih sedišta ili izradu tapaciranih elemenata koji moraju da prate projekat i svakodnevni rad prostora.",
    items: [
      "Separei, klupe i zidni paneli",
      "Stolice i barske stolice",
      "Hotelski i kancelarijski nameštaj",
      "Čekaonice i medicinski program",
      "Frizerske stolice",
    ],
    image: "servis-ugostiteljstvo",
    featured: true,
  },
  {
    slug: "sivenje-i-izrada-po-meri",
    title: "Šivenje i izrada po meri",
    lead: "Jastuci, navlake, tapacirani paneli, tende i zaštitna rešenja",
    body:
      "Šijemo nove jastuke i navlake prema konkretnim merama, uključujući IKEA navlake, tapacirane panele, tende, zaštitne navlake i cerade tamo gde materijal i namena to dozvoljavaju.",
    solves:
      "Potreban vam je tekstilni element nestandardne mere, rezervna periva navlaka ili novo rešenje koje ne postoji kao gotov proizvod.",
    items: [
      "Jastuci po meri",
      "Navlake i IKEA navlake",
      "Tapacirani paneli",
      "Tende i zaštitne navlake",
      "Cerade — po dogovoru",
    ],
    image: "servis-sivenje",
    featured: false,
  },
  {
    slug: "stilski-i-zahtevni-komadi",
    title: "Stilski i zahtevni komadi",
    lead: "Stilski i antikvarni nameštaj — po dogovoru",
    body:
      "Kod vrednih i zahtevnih komada prvo procenjujemo stanje, konstrukciju i obim intervencije. Stilski i antikvarni nameštaj prihvatamo po dogovoru, uz cilj da se sačuvaju karakter, proporcije i kvalitet završne obrade.",
    solves:
      "Imate komad sa istorijom ili složenim detaljima i potrebno vam je da pre odluke razgovaramo o mogućnostima i ograničenjima obnove.",
    items: [
      "Stilske fotelje i sofe",
      "Antikvarni komadi",
      "Konstrukcija — po dogovoru",
      "Veoma oštećeni komadi — nakon pregleda",
    ],
    image: "servis-stilski",
    featured: false,
  },
  {
    slug: "bastenski-moto-i-nauticki-program",
    title: "Baštenski, moto i nautički program",
    lead: "Ljuljaške, ležaljke, motocikli i čamci",
    body:
      "Za spoljašnje i pokretne komade biraju se materijali prema suncu, vlazi i načinu korišćenja. Radimo tende i jastuke za baštenske ljuljaške, ležaljke, zaštitne navlake, motociklistička sedišta i tapacirane delove čamaca.",
    solves:
      "Postojeća presvlaka je izbledela, popucala ili više ne štiti komad, dok je osnovna konstrukcija i dalje upotrebljiva.",
    items: [
      "Baštenske ljuljaške i jastuci",
      "Ležaljke i tende",
      "Motociklistička sedišta",
      "Čamci",
      "Automobilski program — po dogovoru",
    ],
    image: "servis-bastenski",
    featured: false,
  },
];

export const featuredServices = services.filter((s) => s.featured);

export function serviceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
