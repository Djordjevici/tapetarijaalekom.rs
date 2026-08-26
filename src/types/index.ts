export type ImageKey =
  | "hero-radionica"
  | "radionica-detalj"
  | "materijali"
  | "servis-presvlacenje"
  | "servis-koza"
  | "servis-stilski"
  | "servis-ugostiteljstvo"
  | "servis-bastenski"
  | "servis-sivenje"
  | "fotelja-pre"
  | "fotelja-posle"
  | "stolice-pre"
  | "stolice-posle";

export interface Slika {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Privremeni vizueli su označeni da se lako pronađu i zamene. */
  privremena: boolean;
}

export interface Service {
  slug: string;
  title: string;
  lead: string;
  body: string;
  solves: string;
  items: readonly string[];
  image: ImageKey;
  featured: boolean;
}

export interface Project {
  slug: string;
  title: string;
  /** Kratak naziv za dugmad prelaska između projekata. */
  shortTitle: string;
  category: string;
  summary: string;
  beforeImage: ImageKey;
  afterImage: ImageKey;
  gallery: readonly ImageKey[];
  materials: readonly string[];
  workPerformed: readonly string[];
  duration: string | null;
  /** true = demonstracioni sadržaj, nikada se ne prikazuje u produkciji. */
  isPlaceholder: boolean;
  featured: boolean;
  published: boolean;
  seo: {
    title: string;
    description: string;
  };
}

export interface FaqItem {
  question: string;
  answer: string;
  /** Pitanja bez potvrđenog odgovora stoje na false. */
  enabled: boolean;
}

export interface Review {
  text: string;
  author: string;
  rating: number;
  date: string;
  source: string;
  url: string | null;
}

export interface ProcessStep {
  title: string;
  body: string;
  enabled: boolean;
}
