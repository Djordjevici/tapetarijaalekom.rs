import type { FaqItem, ProcessStep, Review } from "@/types";

/**
 * Prikazuju se samo pitanja čiji odgovor ne zahteva podatak koji nemamo.
 * Ostala čekaju potvrdu klijenta i stoje na enabled: false.
 */
export const faq: readonly FaqItem[] = [
  {
    question: "Kako mogu da dobijem okvirnu procenu?",
    answer:
      "Najbrže je da pošaljete nekoliko jasnih fotografija komada, njegove približne dimenzije i kratak opis željenih radova. Kada pregledamo te informacije, dogovaramo naredne korake.",
    enabled: true,
  },
  {
    question: "Od čega zavisi cena presvlačenja?",
    answer:
      "Cena zavisi od vrste i veličine komada, njegovog trenutnog stanja, potrebnih popravki, složenosti krojenja i šivenja, kao i od izabranog materijala.",
    enabled: true,
  },
  {
    question: "Da li se isplati presvući stari nameštaj?",
    answer:
      "Kvalitetan komad sa dobrom konstrukcijom često vredi obnoviti. Odluka zavisi od stanja konstrukcije, potrebnih popravki, emotivne ili materijalne vrednosti komada i željenog krajnjeg izgleda.",
    enabled: true,
  },
  {
    question: "Koje informacije treba da pošaljem uz fotografije?",
    answer:
      "Poželjno je poslati fotografije iz više uglova, približne dimenzije, opis oštećenja i informaciju o tome kakav rezultat želite.",
    enabled: true,
  },
  {
    question: "Da li radite stilski i antikvarni nameštaj?",
    answer:
      "Da. Radimo tapaciranje stilskog nameštaja i restauraciju antikvarnih komada, kao i kožnu galanteriju.",
    enabled: true,
  },
  // --- Čeka potvrdu klijenta ---
  {
    question: "Koliko traje presvlačenje kauča?",
    answer: "[ROK — potvrditi sa klijentom]",
    enabled: false,
  },
  {
    question: "Mogu li da donesem svoju tkaninu?",
    answer: "[POTVRDITI]",
    enabled: false,
  },
  {
    question: "Da li dolazite po nameštaj?",
    answer: "[POTVRDITI — preuzimanje i dostava]",
    enabled: false,
  },
  {
    question: "Koja područja pokrivate?",
    answer: "[POTVRDITI — šire područje rada]",
    enabled: false,
  },
  {
    question: "Da li postoji garancija na radove?",
    answer: "[POTVRDITI — šta pokriva i koliko traje]",
    enabled: false,
  },
];

export const activeFaq = faq.filter((f) => f.enabled);

/**
 * Koraci su formulisani neutralno. Ne obećavaju rok, cenu, besplatnu procenu
 * ni prevoz, jer to još nije potvrđeno.
 */
export const processSteps: readonly ProcessStep[] = [
  {
    title: "Pošaljete fotografije i kratak opis",
    body:
      "Putem forme, Vibera, WhatsAppa ili direktnim pozivom. Korisno je više uglova i približne dimenzije komada.",
    enabled: true,
  },
  {
    title: "Razgovor i okvirna procena",
    body:
      "Na osnovu fotografija i informacija definišemo naredne korake. Ako je potreban pregled uživo, termin se dogovara naknadno.",
    enabled: true,
  },
  {
    title: "Izbor materijala i detalja",
    body:
      "Dogovaramo izgled, namenu, vrstu materijala i radove koje treba izvesti na konstrukciji i sedištu.",
    enabled: true,
  },
  {
    title: "Izrada i završna obrada",
    body:
      "Komad prolazi kroz dogovorene tapetarske radove i priprema se za preuzimanje ili predaju.",
    enabled: true,
  },
  {
    // Uključuje se samo ako klijent potvrdi uslugu — vidi flags.pickupDelivery
    title: "Preuzimanje i dostava",
    body: "[POTVRDITI — uslovi preuzimanja i dostave]",
    enabled: false,
  },
];

export const activeProcess = processSteps.filter((s) => s.enabled);

/**
 * Nema autentičnih recenzija sa tekstom. Sekcija se ne renderuje dok niz
 * ne dobije sadržaj i dok se ne uključi flags.reviews.
 *
 * Struktura jednog unosa:
 *   {
 *     text: "Tekst recenzije.",
 *     author: "Ime ili inicijali",
 *     rating: 5,
 *     date: "2026-05-17",
 *     source: "Google",
 *     url: "https://…",   // opciono
 *   }
 */
export const reviews: readonly Review[] = [];

/**
 * Faktori koji ulaze u procenu. Bez ijedne cifre — cene nisu potvrđene.
 */
export const priceFactors: readonly string[] = [
  "Vrsta i veličina komada",
  "Stanje noseće konstrukcije",
  "Stanje sunđera, gurtni i mehanizama",
  "Izbor materijala",
  "Složenost krojenja i šivenja",
  "Dodatne popravke na komadu",
];

/**
 * Edukativna sekcija o materijalima. Ne tvrdi da radionica ima katalog,
 * uzorke na stanju ni određene brendove — to nije potvrđeno.
 */
export const materialTopics: readonly { title: string; body: string }[] = [
  {
    title: "Koliko se sedi na komadu",
    body:
      "Trosed u dnevnoj sobi i fotelja u uglu ne trpe isto. Za komad koji se koristi svaki dan bira se gušće tkanje, jer se pre svega troši površina na kojoj se sedi.",
  },
  {
    title: "Deca i kućni ljubimci",
    body:
      "Ako u kući ima mačke, tkanine sa izvučenim petljama nisu dobra ideja. Za takve prostore biraju se čvršća, zatvorena tkanja i materijali koji se lakše čiste.",
  },
  {
    title: "Tkanina ili koža",
    body:
      "Koža je izdržljiva i lepo stari, ali je skuplja i drugačije se ponaša na hladnom i toplom. Tkanina daje više slobode u boji i teksturi i obično je pristupačnija.",
  },
  {
    title: "Boja i svetlo u prostoru",
    body:
      "Ista tkanina drugačije izgleda pored prozora i u dubini sobe. Zato se uzorak uvek gleda u prostoru u kom će komad stajati, i to u toku dana.",
  },
  {
    title: "Komadi za spolja",
    body:
      "Za tende, ljuljaške i ležaljke koriste se materijali otporni na sunce i vlagu. Obična tkanina u tim uslovima za nekoliko sezona izgubi boju.",
  },
  {
    title: "Šta ide ispod presvlake",
    body:
      "Izbor tkanine je vidljiv deo, ali vek trajanja najviše zavisi od onoga što se ne vidi — gurtni, sunđera i pripreme konstrukcije.",
  },
];
