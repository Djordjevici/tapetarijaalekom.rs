import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Ton = "puni" | "obris" | "tihi";

const osnova =
  "group relative inline-flex items-center justify-center gap-2 " +
  "font-body text-[0.94rem] font-semibold leading-none " +
  "px-6 py-[0.95rem] min-h-[48px] " +
  "transition-colors duration-300 ease-meko";

const tonovi: Record<Ton, string> = {
  puni: "bg-bakar text-white hover:bg-bakar-svetli",
  obris:
    "border border-current text-current hover:text-bakar " +
    "[&>span]:transition-colors",
  tihi: "text-current hover:text-bakar",
};

function Sadrzaj({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="relative z-10">{children}</span>
      {/* bakarna nit koja izraste iz leve ivice pri prelazu mišem */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-0 bg-bakar transition-all duration-500 ease-meko group-hover:w-full"
      />
    </>
  );
}

interface DugmeProps {
  ton?: Ton;
  className?: string;
  children: ReactNode;
}

export function DugmeLink({
  href,
  ton = "puni",
  className = "",
  children,
  ...rest
}: DugmeProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={`${osnova} ${tonovi[ton]} ${className}`} {...rest}>
      <Sadrzaj>{children}</Sadrzaj>
    </Link>
  );
}

export function DugmeA({
  ton = "puni",
  className = "",
  children,
  ...rest
}: DugmeProps & ComponentProps<"a">) {
  return (
    <a className={`${osnova} ${tonovi[ton]} ${className}`} {...rest}>
      <Sadrzaj>{children}</Sadrzaj>
    </a>
  );
}

export function Dugme({
  ton = "puni",
  className = "",
  children,
  ...rest
}: DugmeProps & ComponentProps<"button">) {
  return (
    <button className={`${osnova} ${tonovi[ton]} ${className}`} {...rest}>
      <Sadrzaj>{children}</Sadrzaj>
    </button>
  );
}
