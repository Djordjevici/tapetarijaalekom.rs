/**
 * Jedini izvor istine za kontakt podatke, linkove i feature flagove.
 *
 * Pravilo: nijedna komponenta ne sme da sadrži telefon, adresu, link ili
 * tvrdnju o usluzi direktno. Sve ide odavde, da se pred lansiranje menja
 * na jednom mestu.
 *
 * Sve što klijent još nije potvrdio je isključeno ili je placeholder.
 * Vidi PODACI-ZA-POTVRDU.md.
 */

export const site = {
  name: "Tapetarija Alekom",
  shortName: "Alekom",
  slogan: "Zanat koji traje.",
  url: "https://tapetarijaalekom.rs",

  owner: "Aleksandar Komarov",
  nameOrigin: "ALEksandar + KOMarov",

  legal: {
    registeredName:
      "ZANATSKA RADNJA ALEKOM ALEKSANDAR KOMAROV PR PETROVARADIN",
    taxId: "104376153",
    registrationNumber: "60138257",
    activityCode: "3101",
    activityName: "Proizvodnja nameštaja za poslovne i prodajne prostore",
  },

  foundedYear: 2006,
  foundedDate: "2006-06-01",
  foundedLabel: "od 2006.",

  phone: {
    e164: "+381642496345",
    display: "064 24 96 345",
  },

  /** Potvrđeno aktivan, ali se u v1 ne prikazuje javno. */
  landline: {
    e164: "+38121643362",
    display: "021 64 33 621",
  },

  /**
   * PRIVREMENA profesionalna adresa. Zameniti konačnom adresom na domenu pre
   * produkcionog uključivanja forme i potvrditi je u Resend-u.
   */
  email: "kontakt@tapetarijaalekom.rs",
  privacyEmail: "kontakt@tapetarijaalekom.rs",

  address: {
    streetAddress: "Tunislava Paunovića 24",
    postalCode: "21132",
    /** Google vodi lokaciju kao Novi Sad; menjati ako registri to zahtevaju. */
    addressLocality: "Petrovaradin",
    addressRegion: "Novi Sad",
    addressCountry: "RS",
    countryName: "Srbija",
    /** Pomoćni podatak za mapu, ne ulazi u LocalBusiness schema. */
    plusCode: "6VRH+QC",
    full: "Tunislava Paunovića 24, 21132 Petrovaradin, Novi Sad, Srbija",
  },

  hours: {
    weekdays: "Pon–Pet 08:00–17:00",
    weekend: "Sub–Ned zatvoreno",
    holidayNote: "Ne radimo državnim i verskim praznicima.",
    specifications: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
  },

  serviceArea: "Novi Sad i okolina, a ostale lokacije po dogovoru.",
  visitNote: "U radionicu možete doći direktno, bez zakazivanja.",
  transportNote:
    "Preuzimanje i povrat nameštaja možemo organizovati po dogovoru, u zavisnosti od lokacije, količine i vrste komada.",
  privacyRetentionMonths: 12,

  social: {
    instagram: "https://www.instagram.com/tapetarijaalekom/",
    /** [FACEBOOK URL] */
    facebook: null as string | null,
  },

  maps: {
    /** Pretraga po adresi; ne koristi približne koordinate. */
    embed:
      "https://www.google.com/maps?q=Tunislava+Paunovi%C4%87a+24,+21132+Petrovaradin,+Novi+Sad&output=embed",
    link: "https://www.google.com/maps/search/?api=1&query=Tapetarija+Alekom+Tunislava+Paunovi%C4%87a+24+Petrovaradin",
    /**
     * geo za LocalBusiness ide samo kada imamo proverene koordinate.
     * Plus Code nije zamena i ne izvodimo koordinate iz njega.
     */
    coordinates: null as { latitude: number; longitude: number } | null,
  },
} as const;

/** Potvrđene mogućnosti i kontrole javnog prikaza. */
export const flags = {
  // kanali kontakta
  viber: true,
  whatsapp: true,
  publicEmail: false,
  facebook: false,
  landline: false,

  // tvrdnje o uslugama
  pickupDelivery: true,
  warranty: false,
  freeEstimate: true,
  ownFabric: true,
  materialSamples: true,
  ikeaCovers: true,
  extendedServiceArea: true,
  showPrices: false,

  // sekcije
  reviews: false,
  /** Uključeno radi pregleda — isključiti pred lansiranje ako nema pravih fotografija. */
  beforeAfter: true,
  worksInNav: true,

  /**
   * Omogućava prikaz demo projekata u razvojnom okruženju ako se ponovo dodaju.
   * Trenutni portfolio koristi stvarne fotografije i ne zavisi od ove zastavice.
   */
  showPlaceholderProjects:
    process.env.NEXT_PUBLIC_SHOW_DEMO_PROJECTS !== "false",
} as const;

/** Forma obrađuje lične podatke samo kada je izričito uključena. */
export const contactFormEnabled =
  process.env.NEXT_PUBLIC_CONTACT_FORM_ENABLED === "true";

/** GA4 se ne učitava bez validnog Measurement ID-a. */
const configuredAnalyticsId = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const analyticsId = /^G-[A-Z0-9]+$/i.test(configuredAnalyticsId)
  ? configuredAnalyticsId
  : null;

export const viberLink = `viber://chat?number=${encodeURIComponent(site.phone.e164)}`;
export const whatsappLink = `https://wa.me/${site.phone.e164.replace("+", "")}`;
export const telLink = `tel:${site.phone.e164}`;
export const mailLink = `mailto:${site.email}`;

export const nav = [
  { label: "Usluge", href: "/usluge" },
  { label: "Radovi", href: "/radovi", flag: "worksInNav" as const },
  { label: "O nama", href: "/#o-nama" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

/** Sekcije početne strane, za praćenje aktivne u navigaciji. */
export const homeSections = [
  { id: "usluge", label: "Usluge" },
  { id: "radovi", label: "Radovi" },
  { id: "proces", label: "Kako radimo" },
  { id: "o-nama", label: "O nama" },
  { id: "procena", label: "Procena" },
  { id: "kontakt", label: "Kontakt" },
] as const;
