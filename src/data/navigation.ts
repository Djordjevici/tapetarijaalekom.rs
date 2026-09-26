import { visibleProjects } from "./projects";
import { flags } from "./site";

export const showHomepageWorks: boolean =
  flags.beforeAfter && visibleProjects(flags.showPlaceholderProjects).length > 0;

export const nav = [
  { label: "Usluge", href: "/#usluge" },
  {
    label: "Radovi",
    href: showHomepageWorks ? "/#radovi" : "/radovi",
    flag: "worksInNav" as const,
  },
  { label: "O nama", href: "/#o-nama" },
  { label: "Kontakt", href: "/#kontakt" },
  {
    label: "Galerija fotografija",
    href: "https://photos.app.goo.gl/afSsKdP9CR5AvkBj7",
    external: true,
  },
] as const;

/** Sekcije početne strane, za praćenje aktivne u navigaciji. */
export const homeSections = [
  { id: "usluge", label: "Usluge" },
  ...(showHomepageWorks ? [{ id: "radovi", label: "Radovi" }] : []),
  { id: "proces", label: "Kako radimo" },
  { id: "o-nama", label: "O nama" },
  { id: "procena", label: "Procena" },
  { id: "kontakt", label: "Kontakt" },
] as const;
