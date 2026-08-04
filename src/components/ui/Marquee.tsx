import { services } from "@/data/services";
import { site } from "@/data/site";

/**
 * Jedan spor marquee na prelazu između sekcija. Namerno samo jedan na strani,
 * da se ritam ne izgubi u stalnom pokretu.
 */
export default function Marquee() {
  const stavke = [...services.map((s) => s.title), site.slogan];
  const traka = [...stavke, ...stavke];

  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-linija-tamna bg-ugljen py-5"
    >
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap will-change-transform motion-reduce:animate-none">
        {traka.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="flex items-center gap-10 font-display text-[1.05rem] text-mist-3"
          >
            {t}
            <span className="h-1 w-1 rounded-full bg-bakar" />
          </span>
        ))}
      </div>
      {/* meko gašenje na ivicama, da traka ne izgleda odsečeno */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ugljen to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ugljen to-transparent" />
    </div>
  );
}
