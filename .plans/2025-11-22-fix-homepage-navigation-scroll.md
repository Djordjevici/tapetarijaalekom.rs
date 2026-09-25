---
status: approved
---

# Goal
Make the header logo always show the top of the homepage and make “Usluge”, “Radovi”, and “Kontakt” always open their corresponding homepage sections after an immediate scroll reset.

# Current behavior and likely root cause

- `src/data/site.ts` sends the three requested navigation items to standalone App Router pages (`/usluge`, `/radovi`, and `/kontakt`), even though the homepage already exposes `usluge`, `radovi`, and `kontakt` section IDs.
- `src/components/layout/Header.tsx` renders the logo as `<Link href="/">` and desktop navigation as plain Next.js links with no explicit scroll reset. Next.js can preserve the current offset for same-route/client transitions, so clicking the homepage logo is not guaranteed to reach scroll position 0.
- `src/components/layout/MobileMenu.tsx::navigiraj(href: string)` resets scroll only when the internal URL has no `#`; changing the three destinations to homepage fragments would therefore bypass its current reset branch.
- `src/app/globals.css` enables smooth document scrolling. The current mobile reset uses `behavior: "auto"`, which follows that CSS behavior instead of guaranteeing an immediate reset before navigation.
- The destination anchors already exist: `src/components/sections/Usluge.tsx` renders `id="usluge"`, `src/components/sections/PreIPosle.tsx` renders `id="radovi"`, and `src/components/sections/Zavrsne.tsx::Lokacija` renders `id="kontakt"`. `src/components/ui/Sekcija.tsx` and `src/app/globals.css` already offset anchored sections for the fixed header.

# Steps

1. - [ ] **File**: `src/data/site.ts`
      **Change**: In the exported `nav` array, change only the three requested internal destinations to `{ label: "Usluge", href: "/#usluge" }`, `{ label: "Radovi", href: "/#radovi", flag: "worksInNav" as const }`, and `{ label: "Kontakt", href: "/#kontakt" }`. Keep `O nama`, the external gallery item, feature-flag filtering, `homeSections`, and the standalone `/usluge`, `/radovi`, and `/kontakt` routes unchanged.
      **Done when**: Both desktop and mobile menus derive all three requested links from the homepage-fragment URLs, while direct visits to the standalone pages still build.

2. - [ ] **File**: `src/components/layout/Header.tsx`
      **Change**: Add a local `resetujSkrolNaVrh(): void` click helper that calls `window.scrollTo({ top: 0, left: 0, behavior: "instant" })`. Attach it to the logo link and to internal navigation `Link` elements before their normal Next.js navigation; do not attach it to the external gallery `<a>`, telephone link, or CTA. Preserve the links’ real `href` values so native/new-tab behavior and Next.js fragment targeting continue to work.
      **Done when**: Clicking the logo from either a child route or any scroll position on `/` immediately sets the document to `scrollY === 0` and leaves the URL at `/`; clicking each requested desktop link resets first and then leaves the URL at `/#usluge`, `/#radovi`, or `/#kontakt` with the matching section visible below the fixed header.

3. - [ ] **File**: `src/components/layout/MobileMenu.tsx`
      **Change**: Update `navigiraj(href: string)` so it still calls `zatvori()`, but performs the same immediate `window.scrollTo({ top: 0, left: 0, behavior: "instant" })` for every root-relative internal destination, including URLs containing `#`. Keep external, telephone, Viber, and WhatsApp links outside this helper. Do not prevent the clicked link’s default navigation.
      **Done when**: “Početna” resets to the homepage top, and “Usluge”, “Radovi”, and “Kontakt” close the mobile menu, reset the old offset, and finish at their homepage anchors from both `/` and a standalone child route.

4. - [ ] **Files**: `src/components/sections/Usluge.tsx`, `src/components/sections/PreIPosle.tsx`, `src/components/sections/Zavrsne.tsx`, `src/components/ui/Sekcija.tsx`, `src/app/globals.css`
      **Change**: Make no code changes; verify that the existing `usluge`, `radovi`, and `kontakt` IDs remain unique and that `scroll-padding-top`/`scroll-mt-[var(--visina-headera)]` continue to keep anchored headings below the fixed header.
      **Done when**: Each fragment resolves to exactly one element and desktop/mobile anchor landings are not obscured by the header.

5. - [ ] **Files**: `src/components/layout/Header.tsx`, `src/components/layout/MobileMenu.tsx`, `src/data/site.ts`
      **Change**: Run static checks and production compilation, then manually exercise the navigation matrix at desktop and mobile widths: start from a deeply scrolled homepage, `/usluge`, `/radovi`, and `/kontakt`; click the logo and each of the three requested navigation items; repeat a link while already on its own fragment.
      **Done when**: All commands pass; the logo always ends at `/` with `window.scrollY === 0`; each section link always ends at its `/#...` URL with the intended section visible; no stale child-page content, old scroll offset, hidden heading, or open mobile overlay remains.

# Out of scope

- Removing or redesigning the standalone `/usluge`, `/radovi`, and `/kontakt` pages or changing links outside the main header/mobile menu.
- Changing homepage section markup, IDs, ordering, fixed-header dimensions, smooth-scroll styling, reveal animations, or content.
- Changing CTA destinations such as `/kontakt#procena`, footer links, breadcrumbs, skip links, or browser back/forward restoration.
- Introducing a browser-test framework solely for this fix; the repository currently has no configured automated UI test script.

# Verification

Run these commands in order:

```bash
npm run lint
npm run typecheck
npm run build
npm run dev
```

With the dev server running at `http://localhost:3000`, perform the Step 5 desktop/mobile matrix and inspect `window.scrollY` in DevTools after every logo click. Confirm the three final URLs are exactly `/#usluge`, `/#radovi`, and `/#kontakt`, and confirm each target heading remains below the fixed header.
