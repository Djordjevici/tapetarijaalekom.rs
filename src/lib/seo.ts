import { site, flags, analyticsId } from "@/data/site";

const OG = `${site.url}/opengraph-image`;

interface MetaArgs {
  title: string;
  description: string;
  path?: string;
}

export function meta({ title, description, path = "/" }: MetaArgs) {
  const url = `${site.url}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: "sr_RS",
      type: "website" as const,
      images: [{ url: OG, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [OG],
    },
  };
}

/**
 * LocalBusiness schema.
 *
 * openingHours izostaje dok radno vreme nije potvrđeno za sve dane, a
 * aggregateRating dok nema autentičnih recenzija. Plus Code se ne koristi
 * kao zamena za adresu, a geo ide samo sa proverenim koordinatama.
 */
export function localBusinessSchema() {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${site.url}#radnja`,
    name: site.name,
    legalName: site.legal.registeredName,
    description:
      "Porodična tapetarska radionica Aleksandra Komarova u Petrovaradinu. Presvlačenje i tapaciranje nameštaja, kožni nameštaj, poslovni enterijeri i šivenje po meri.",
    url: site.url,
    telephone: site.phone.e164,
    foundingDate: site.foundedDate,
    founder: {
      "@type": "Person",
      name: site.owner,
    },
    identifier: [
      {
        "@type": "PropertyValue",
        name: "PIB",
        value: site.legal.taxId,
      },
      {
        "@type": "PropertyValue",
        name: "Matični broj",
        value: site.legal.registrationNumber,
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.streetAddress,
      postalCode: site.address.postalCode,
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      addressCountry: site.address.addressCountry,
    },
    areaServed: [
      { "@type": "City", name: "Novi Sad" },
      { "@type": "Place", name: "Petrovaradin" },
      { "@type": "Place", name: "Okolina Novog Sada" },
    ],
    logo: `${site.url}/logo/alekom-seal.svg`,
    openingHoursSpecification: site.hours.specifications.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
  };

  if (flags.publicEmail) schema.email = site.email;

  const sameAs = [site.social.instagram, flags.facebook ? site.social.facebook : null]
    .filter((v): v is string => Boolean(v));
  if (sameAs.length) schema.sameAs = sameAs;

  if (site.maps.coordinates) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: site.maps.coordinates.latitude,
      longitude: site.maps.coordinates.longitude,
    };
  }

  return schema;
}

/** WebSite entitet, odvojen od LocalBusiness — pomaže Google-u da poveže naziv sajta sa domenom. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}#sajt`,
    name: site.name,
    url: site.url,
    inLanguage: "sr-RS",
    publisher: { "@id": `${site.url}#radnja` },
  };
}

export function faqSchema(items: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function serviceSchema(
  items: readonly { title: string; body: string; slug: string }[],
) {
  return items.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.body,
    serviceType: s.title,
    url: `${site.url}/usluge#${s.slug}`,
    provider: { "@id": `${site.url}#radnja` },
    areaServed: [
      { "@type": "City", name: "Novi Sad" },
      { "@type": "Place", name: "Petrovaradin" },
    ],
  }));
}

export function breadcrumbSchema(trail: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${site.url}${t.path === "/" ? "" : t.path}`,
    })),
  };
}

export const hasAnalytics = Boolean(analyticsId);
