import type { FaqItem, ProcessStep, Review } from "@/types";

/** Potvrđeni odgovori koji se prikazuju i ulaze u FAQ schema. */
export const faq: readonly FaqItem[] = [
  {
    question: "Kako mogu da dobijem procenu?",
    answer:
      "Pošaljite oko tri jasne fotografije, približne dimenzije, broj komada, opis oštećenja, lokaciju i željeni rok. Na osnovu toga dobijate besplatnu okvirnu procenu. Konačnu ponudu definišemo nakon pregleda komada uživo — u radionici ili na vašoj lokaciji, u zavisnosti od posla.",
    enabled: true,
  },
  {
    question: "Od čega zavisi cena presvlačenja?",
    answer:
      "Cena zavisi od vrste i veličine komada, njegovog trenutnog stanja, potrebnih popravki, složenosti krojenja i šivenja, kao i od izabranog materijala.",
    enabled: true,
  },
  {
    question: "Koliko traje presvlačenje?",
    answer:
      "Rok zavisi od obima posla, stanja komada, složenosti krojenja i dostupnosti izabranog materijala. Precizniji termin definišemo nakon pregleda i ne obećavamo fiksan rok pre nego što vidimo komad.",
    enabled: true,
  },
  {
    question: "Da li mogu da donesem svoj materijal?",
    answer:
      "Da. Ako već imate odabran materijal, možete ga doneti uz prethodnu konsultaciju kako bismo proverili da li odgovara konkretnom komadu i načinu upotrebe.",
    enabled: true,
  },
  {
    question: "Da li dolazite po nameštaj i vraćate gotov komad?",
    answer:
      "Preuzimanje i povrat nameštaja možemo organizovati po dogovoru, u zavisnosti od lokacije, količine i vrste komada. Komad možete i sami doneti i preuzeti u radionici.",
    enabled: true,
  },
  {
    question: "Da li radite stilski i antikvarni nameštaj?",
    answer:
      "Da, po dogovoru i nakon pregleda konkretnog komada. Kod stilskog i antikvarnog nameštaja prvo procenjujemo konstrukciju, detalje i obim intervencije.",
    enabled: true,
  },
  {
    question: "Da li popravljate konstrukciju, sunđer i opruge?",
    answer:
      "Sunđer, opruge, gurtne i trake menjamo ili popravljamo u sklopu tapetarskih radova. Popravka drvene konstrukcije i veoma oštećenih komada zavisi od stanja i dogovara se nakon pregleda. Mehanizme ne popravljamo.",
    enabled: true,
  },
  {
    question: "Da li je početna procena besplatna?",
    answer:
      "Da. Početna okvirna procena na osnovu fotografija i osnovnih informacija je besplatna. Konačna ponuda se definiše tek nakon pregleda komada uživo.",
    enabled: true,
  },
  {
    question: "Koja područja pokrivate?",
    answer:
      "Radimo u Novom Sadu i okolini, a ostale lokacije prihvatamo po dogovoru. Izlazak na teren zavisi od vrste i obima posla.",
    enabled: true,
  },
  {
    question: "Da li radite poslovne prostore?",
    answer:
      "Da. Sarađujemo sa restoranima, kafićima, hotelima, kancelarijama, dizajnerima enterijera i arhitektama na pojedinačnim komadima i serijama prema projektu.",
    enabled: true,
  },
];

export const activeFaq = faq.filter((f) => f.enabled);

export const processSteps: readonly ProcessStep[] = [
  {
    title: "Pošaljete fotografije",
    body:
      "Za početnu procenu idealne su oko tri fotografije, dimenzije, broj komada, opis oštećenja, lokacija i željeni rok.",
    enabled: true,
  },
  {
    title: "Dobijate besplatnu okvirnu procenu",
    body:
      "Fotografije su dovoljne za početnu okvirnu cenu i razgovor o mogućnostima, bez obaveze i bez obećavanja konačne ponude unapred.",
    enabled: true,
  },
  {
    title: "Pregled uživo",
    body:
      "Konačnu ponudu definišemo nakon pregleda komada u radionici ili na vašoj lokaciji, u zavisnosti od posla.",
    enabled: true,
  },
  {
    title: "Izbor materijala i pisana ponuda",
    body:
      "Biramo materijal u radionici ili kod vas, savetujemo prema nameni i potvrđujemo dogovoreni obim radova. Nakon prihvatanja ponude dogovara se avans od 30–50%, u zavisnosti od posla.",
    enabled: true,
  },
  {
    title: "Izrada i završna obrada",
    body:
      "Radimo prema dogovorenom obimu, uz pažnju na konstrukciju, preciznost krojenja, šav i završnu obradu.",
    enabled: true,
  },
  {
    title: "Završetak i predaja",
    body:
      "O završetku vas obaveštavamo telefonom. Preuzimanje i povrat nameštaja organizujemo prema dogovoru.",
    enabled: true,
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
  "Stanje sunđera, opruga, gurtni i traka",
  "Izbor materijala",
  "Složenost krojenja i šivenja",
  "Broj komada i obim radova",
  "Transport i organizacija posla",
  "Željeni termin, kada je hitnost moguća",
];

/**
 * Edukativna sekcija o materijalima, bez univerzalnih tvrdnji.
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
      "Pri izboru uzimamo u obzir održavanje, intenzitet korišćenja i svakodnevne potrebe domaćinstva. Za kućne ljubimce postoje pet-friendly meblovi; konkretan uzorak biramo prema načinu korišćenja.",
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
    title: "Spolja i intenzivno korišćenje",
    body:
      "Za tende, ljuljaške, ležaljke i ugostiteljske objekte biraju se materijali prema suncu, vlazi, čišćenju i intenzitetu korišćenja — bez tvrdnji o sertifikatima koje konkretan materijal nema.",
  },
  {
    title: "Šta ide ispod presvlake",
    body:
      "Izbor tkanine je vidljiv deo, ali vek trajanja najviše zavisi od onoga što se ne vidi — gurtni, sunđera i pripreme konstrukcije.",
  },
];
