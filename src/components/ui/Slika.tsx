import Image from "next/image";
import { img } from "@/data/images";
import type { ImageKey } from "@/types";

/**
 * Slika u fiksnom odnosu strana, da ne postoji pomeranje layouta.
 * Sve slike su privremene — vidi src/data/images.ts.
 */
export default function Slika({
  kljuc,
  odnos = "4 / 3",
  sizes = "(max-width: 768px) 100vw, 50vw",
  prioritet = false,
  className = "",
  imgClassName = "",
}: {
  kljuc: ImageKey;
  odnos?: string;
  sizes?: string;
  prioritet?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const s = img(kljuc);
  return (
    <div
      className={`relative overflow-hidden bg-orah/10 ${className}`}
      style={{ aspectRatio: odnos }}
    >
      <Image
        src={s.src}
        alt={s.alt}
        width={s.width}
        height={s.height}
        sizes={sizes}
        priority={prioritet}
        loading={prioritet ? undefined : "lazy"}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
