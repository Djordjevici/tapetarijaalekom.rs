import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Vidljive mrvice koje prate BreadcrumbList schema na unutrašnjim stranama. */
export default function Breadcrumbs({
  items,
}: {
  items: readonly BreadcrumbItem[];
}) {
  return (
    <nav aria-label="Putanja" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-[0.76rem] text-mist-3">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-platno"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-mist-2">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
