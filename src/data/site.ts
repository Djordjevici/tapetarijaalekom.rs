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

  /** Potvrđeno iz APR-a. Broj godina se ne prikazuje automatski. */
  foundedYear: 2006,
  /** Ručno kontrolisan tekst, da se izbegne računanje godina bez datuma. */
  foundedLabel: "od 2006.",

  phone: {
    e164: "+381642496345",
    display: "064 24 96 345",
  },

  /** [FIKSNI TELEFON] — postoji u imenicima, nije na Google profilu. */
  landline: {
    e164: "+38121643362",
    display: "021 64 33 621",
  },

  email: "info@tapetarijaalekom.rs",

  address: {
    streetAddress: "Tunislava Paunovića 24",
    postalCode: "21132",
    /** Google vodi lokaciju kao Novi Sad; menjati ako registri to zahtevaju. */
    addressLocality: "Petrovaradin",
    addressRegion: "Novi Sad",
    addressCountry: "RS",
    /** Pomoćni podatak za mapu, ne ulazi u LocalBusiness schema. */
    plusCode: "6VRH+QC",
    full: "Tunislava Paunovića 24, 21132 Petrovaradin, Novi Sad",
  },

  /**
   * [RADNO VREME] — na Google profilu je unet samo ponedeljak (08:00–16:00).
   * Dok nije potvrđeno za sve dane, izostaje iz LocalBusiness schema.
   */
  hours: null as ReadonlyArray<{ days: string; opens: string; closes: string }> | null,

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

/**
 * Sve što nije potvrđeno stoji na false. Uključivanje je jedna linija.
 */
export const flags = {
  // kanali kontakta
  viber: false,
  whatsapp: false,
  facebook: false,
  landline: false,

  // tvrdnje o uslugama
  pickupDelivery: false,
  warranty: false,
  freeEstimate: false,
  ownFabric: false,
  materialSamples: false,
  ikeaCovers: false,
  extendedServiceArea: false,
  showPrices: false,

  // sekcije
  reviews: false,
  beforeAfter: false,
  worksInNav: false,

  /** Demonstracioni projekti se u produkciji nikada ne prikazuju. */
  showPlaceholderProjects: process.env.NODE_ENV !== "production",
} as const;

/** Forma obrađuje lične podatke samo kada je izričito uključena. */
export const contactFormEnabled =
  process.env.NEXT_PUBLIC_CONTACT_FORM_ENABLED === "true";

/** GA4 se ne učitava bez pravog ID-a, a bez GA nema ni cookie bannera. */
export const analyticsId = process.env.NEXT_PUBLIC_GA_ID ?? null;

export const viberLink = `viber://chat?number=${encodeURIComponent(site.phone.e164)}`;
export const whatsappLink = `https://wa.me/${site.phone.e164.replace("+", "")}`;
export const telLink = `tel:${site.phone.e164}`;
export const mailLink = `mailto:${site.email}`;

export const nav = [
  { label: "Usluge", href: "/usluge" },
  { label: "Radovi", href: "/radovi", flag: "worksInNav" as const },
  { label: "Kontakt", href: "/kontakt" },
] as const;

/** Sekcije početne strane, za praćenje aktivne u navigaciji. */
export const homeSections = [
  { id: "usluge", label: "Usluge" },
  { id: "radovi", label: "Radovi" },
  { id: "proces", label: "Kako radimo" },
  { id: "procena", label: "Procena" },
  { id: "kontakt", label: "Kontakt" },
] as const;
