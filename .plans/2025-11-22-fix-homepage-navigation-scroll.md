---
status: approved
---

# Goal
Make every internal navigation path preserve the intended page context and land once at the unobscured start of its target, without a preliminary jump to page top, a hard reload, a missing section, or broken back/forward restoration.

# Findings and root causes

## Confirmed route and link inventory

- App Router pages are `/`, `/usluge`, `/radovi`, `/kontakt`, `/politika-privatnosti`, `/politika-kolacica`, and the global not-found page; `src/app/layout.tsx` keeps `Header`, `Footer`, `FloatingContact`, `MobileActionBar`, and `CookieConsent` mounted around every route.
- `src/data/site.ts::nav` currently sends `Usluge`, `Radovi`, `O nama`, and `Kontakt` to homepage fragments (`/#usluge`, `/#radovi`, `/#o-nama`, `/#kontakt`). `Header`, `MobileMenu`, and the footer secondary navigation consume this array. This part of the previously approved fix is directionally correct: returning these labels to `/usluge`, `/radovi`, or `/kontakt` would intentionally replace the homepage with a standalone page and reproduce the reported “other sections disappear” behavior.
- `src/components/layout/Header.tsx::resetujSkrolNaVrh` is attached to the logo and every internal desktop navigation link. `src/components/layout/MobileMenu.tsx::navigiraj` performs the same reset for every root-relative link. Because click handlers run before Next.js processes the fragment, a section click first moves the old document to `0`, then Next/browser fragment handling moves it to the target. With `html { scroll-behavior: smooth }`, this becomes a visible two-stage trip. It also changes the departing history entry’s saved offset, so Back can restore the top instead of the user’s former position. This is the central defect in the approved fix and those unconditional resets must not remain.
- The header logo still needs special same-homepage behavior: a click on `/` or `/#...` must reach `0`, while a click from another route must let Next.js navigate normally without first scrolling the old route. Modified clicks (new tab/window) must never mutate the current tab’s scroll position.
- Homepage-local anchors are `Hero` → `#procena` and `#usluge`, `PreIPosle` → `#procena`, `Cena` → `#procena`, and `ZavrsniCta` → `#procena`. Standalone `/usluge` and `/radovi` also contain their own `#procena` targets. These hash-only native anchors are correct because each target is in the same rendered document.
- Homepage service title/list links and “Sve usluge detaljno” intentionally open `/usluge` or `/usluge#<service-slug>`; footer service links do the same. `/usluge` renders one section for each slug from `src/data/services.ts`. These are detail-page links, not homepage section navigation, and should remain standalone-route destinations.
- Breadcrumb home links, the not-found “Na početnu” link, footer legal links, and the cookie-banner legal link already use `next/link`. In contrast, the header photo CTA, mobile-menu photo CTA, floating-contact photo CTA, mobile action bar photo CTA, the form privacy link, and the cookie-policy privacy link use raw `<a>` elements for internal routes. They trigger document navigation instead of App Router navigation and make these transitions feel like unrelated new pages. External HTTP links, `tel:`, `mailto:`, `viber:`, and WhatsApp links correctly remain native anchors.
- Homepage IDs are `sadrzaj`, `usluge`, `radovi`, `proces`, `o-nama`, `procena`, and `kontakt`; `/usluge` adds the six service slugs plus its local `procena`; `/radovi` and `/kontakt` each have their own local `procena`, and `/kontakt` also has local `kontakt`. IDs are unique within each rendered document. Reuse across separate routes is valid.
- `src/components/sections/PreIPosle.tsx::PreIPosle` omits the entire `radovi` target when `flags.beforeAfter` is false or `visibleProjects(...)` is empty. `src/data/site.ts::nav` only checks `flags.worksInNav`, so a build with `NEXT_PUBLIC_SHOW_DEMO_PROJECTS=false` currently exposes `/#radovi` even though all current projects are placeholders and no `radovi` element exists. The standalone `/radovi` route does provide an empty state, so it is the required fallback destination in that configuration.
- `src/app/globals.css` applies `scroll-padding-top: var(--visina-headera)` to the scroll container, while `src/components/ui/Sekcija.tsx::Sekcija` also applies `scroll-mt-[var(--visina-headera)]` to every target. Browser anchor alignment combines scroll padding and target scroll margin, producing approximately two header offsets rather than one. A single global `scroll-padding-top` policy is sufficient and also covers `#sadrzaj` and non-`Sekcija` targets.
- `src/components/ui/Otkrij.tsx` server-renders reveal content with `opacity: 0`; JavaScript later marks it visible through `IntersectionObserver`. A direct fragment landing can therefore briefly show the correct section background with its heading/content transparent, which resembles a missing section. The vertical page itself is not clipped: `html`/`body` only use `overflow-x: clip`; `Hero` and image wrappers use local overflow clipping; the mobile menu’s `body.style.overflow = "hidden"` is removed by effect cleanup.
- There is no custom router, pathname observer, hash listener, `history.scrollRestoration`, `popstate`, or route-level scroll manager. Next.js/browser defaults currently own fragment navigation and back/forward restoration except where the click handlers interfere.
- `package.json` has lint, typecheck, build, and dev scripts but no unit/E2E test command. Existing CDP-based Python tools inspect accessibility, screenshots, and the before/after slider, but none checks link destinations, intermediate scroll positions, hash alignment, mobile-menu cleanup, repeated hashes, or Back/Forward restoration.

## Recommended behavior contract

- Main navigation labels always mean homepage sections when those sections exist; `Radovi` falls back to `/radovi` only when the homepage section is not rendered.
- Hash navigation performs one direct browser/Next.js movement from the current offset to the target. It never calls `scrollTo(0, 0)` first.
- The header logo and mobile “Početna” action land at `/` and `scrollY === 0`; only a plain primary click while already on the homepage performs an explicit same-document top scroll.
- Internal cross-route links use `next/link`; same-document fragments and external/protocol destinations use native anchors.
- One fixed-header offset mechanism aligns a target section’s top below the fixed header. A fragment-targeted reveal section is visible immediately, including before hydration.
- Browser Back/Forward remains native/Next-managed and restores the position saved before navigation.

# Steps

1. - [x] **Files**: `src/data/navigation.ts` (new), `src/data/site.ts`, `src/components/layout/Header.tsx`, `src/components/layout/MobileMenu.tsx`, `src/components/layout/Footer.tsx`, `src/components/sections/PreIPosle.tsx`
      **Change**: Move the exported `nav` and `homeSections` definitions out of `site.ts` into the new `navigation.ts`. In `navigation.ts`, import `flags` from `site.ts` and `visibleProjects` from `projects.ts`; export `showHomepageWorks: boolean = flags.beforeAfter && visibleProjects(flags.showPlaceholderProjects).length > 0`. Define the `Radovi` item as `{ label: "Radovi", href: showHomepageWorks ? "/#radovi" : "/radovi", flag: "worksInNav" as const }`; keep `Usluge`, `O nama`, and `Kontakt` at their homepage fragments and keep the gallery external. Build `homeSections` without `radovi` when `showHomepageWorks` is false. Update the three layout components to import `nav` from `navigation.ts`. Update `PreIPosle` to return `null` when `showHomepageWorks` is false and otherwise render the already computed visible project list; do not alter `/radovi`’s empty state.
      **Done when**: A normal/demo build renders exactly one `id="radovi"` and all three global navigation surfaces use `/#radovi`; a `NEXT_PUBLIC_SHOW_DEMO_PROJECTS=false` build renders no homepage `radovi` ID and all three surfaces use `/radovi` instead of a dead fragment.

2. - [x] **File**: `src/components/layout/Header.tsx`
      **Change**: Delete `resetujSkrolNaVrh` and remove it from every `nav` link. Add `naKlikLogotipa(event: React.MouseEvent<HTMLAnchorElement>): void` (import the event type) that returns without side effects for a prevented, non-left-button, Meta/Ctrl/Shift/Alt-modified click or when `window.location.pathname !== "/"`; only for a plain click already on `/`, call `window.scrollTo({ top: 0, left: 0, behavior: "instant" })` and allow the `Link href="/"` default action to remove any hash. Attach this handler only to the logo. Replace the raw photo CTA `<a href="/kontakt#procena">` with `Link` using the same href, text, and classes. Leave gallery and telephone anchors native.
      **Done when**: Desktop section links never invoke `window.scrollTo`; a section click goes directly to its fragment; a logo click on `/` or `/#...` reaches `/` at `scrollY === 0`; a logo click from a child route does not first change that child route’s offset; and Ctrl/Cmd-clicking the logo leaves the current tab untouched.

3. - [x] **File**: `src/components/layout/MobileMenu.tsx`
      **Change**: Replace `navigiraj(href: string)` with `navigiraj(): void` that only calls `zatvori()`, and use it for all internal section links. Add `naKlikPocetne(event: React.MouseEvent<HTMLAnchorElement>): void` with the same plain-click and `window.location.pathname === "/"` guards as the header logo; call `zatvori()` for every click, and call the instant top scroll only for a guarded same-homepage click. Convert the `/kontakt#procena` photo CTA from `<a>` to `Link` and close the menu without a manual scroll. Keep external gallery, telephone, Viber, and WhatsApp anchors native.
      **Done when**: Every mobile selection closes the overlay and restores `document.body.style.overflow`; section links make one movement to the target; “Početna” reaches the homepage top; child-route offsets are not reset before navigation; and modified clicks do not scroll the current tab.

4. - [x] **Files**: `src/components/layout/FloatingContact.tsx`, `src/components/layout/MobileActionBar.tsx`, `src/components/form/FormaProcena.tsx`, `src/app/politika-kolacica/page.tsx`
      **Change**: Use `next/link` for only the root-relative destinations in these files: `/kontakt#procena` in `FloatingContact` and `MobileActionBar`, and `/politika-privatnosti` in `FormaProcena` and `PolitikaKolacica`. In `FloatingContact`, add an explicit `internal` discriminator to the photo item and render that item with `Link`; keep the `tel:`, `viber:`, and WhatsApp items as `<a>`. Preserve every href, class, label, visibility flag, and menu-closing callback.
      **Done when**: All root-relative cross-route links in `src` use `Link` (except the intentional skip link and hash-only anchors), while every external/protocol link remains an `<a>` and retains its existing `target`/`rel` attributes where applicable.

5. - [x] **Files**: `src/components/ui/Sekcija.tsx`, `src/app/globals.css`
      **Change**: Remove `scroll-mt-[var(--visina-headera)]` from `Sekcija` so `html`’s `scroll-padding-top` is the sole fixed-header offset. Keep the responsive `--visina-headera`, smooth scrolling, reduced-motion override, and horizontal `overflow-x: clip`. Add a utility rule `section:target .otkrij` that sets `opacity: 1`, `transform: none`, and `transition-delay: 0ms`, so content in a fragment-targeted section cannot remain transparent before `IntersectionObserver` runs.
      **Done when**: At 390, 1024, and 1440 px widths, each hash target’s bounding top is at or below the fixed header bottom but is not displaced by two header offsets; targeted headings are visible immediately; reduced-motion remains non-animated; and there is no horizontal overflow regression.

6. - [x] **File**: `tools/provera-navigacije.py` (new)
      **Change**: Add a CDP test following the existing `Tab`/headless-Chrome pattern in `tools/provera-pristupacnosti.py`. Accept `SITE_BASE` and `EXPECT_HOME_RADOVI` environment variables. At 1440×900 and 390×844, exercise: all rendered header/mobile/footer `nav` hrefs; homepage `#usluge`, `#radovi` when expected, `#o-nama`, `#procena`, and `#kontakt`; all six `/usluge#<slug>` links; header/mobile/floating/action-bar `/kontakt#procena` CTAs; breadcrumb and logo home links; the skip link; both legal routes; and a not-found home link. For each internal target assert final pathname/hash, exactly one matching ID, visible target content, target top below the header, and no hard reload by preserving a sentinel on `window`. Record scroll events around a `Radovi` click and fail if the sequence reaches `0` before the nonzero target. Add repeated-current-hash, plain/modified logo click, mobile body-overflow cleanup, and Back restoration checks. Statically assert `_blank` external links have `rel` containing `noopener` and `noreferrer`; do not launch `tel:`, `mailto:`, `viber:`, WhatsApp, maps, social, review, or gallery destinations.
      **Done when**: The script exits 0 and prints a passed result for every desktop/mobile matrix row in both the normal target-present mode and the target-absent fallback mode; deliberately restoring either unconditional top reset makes the intermediate-scroll or Back-restoration check fail.

7. - [x] **Files**: `package.json`, `README.md`
      **Change**: Add `"test:navigation": "python3 tools/provera-navigacije.py"` to scripts. In README’s verification section, document that a server must run on port 3210 (or `SITE_BASE` must be supplied), that Python’s `websocket-client` and Google Chrome are prerequisites already shared by the existing tools, and show both `EXPECT_HOME_RADOVI=true` and false-build invocations.
      **Done when**: `npm run test:navigation` calls the new audit against the documented server, and a contributor can reproduce both feature configurations without guessing environment variables or ports.

8. - [x] **Files**: `src/data/navigation.ts`, `src/components/layout/Header.tsx`, `src/components/layout/MobileMenu.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/FloatingContact.tsx`, `src/components/layout/MobileActionBar.tsx`, `src/components/sections/Hero.tsx`, `src/components/sections/Usluge.tsx`, `src/components/sections/PreIPosle.tsx`, `src/components/sections/Blokovi.tsx`, `src/components/sections/Zavrsne.tsx`, `src/components/form/FormaProcena.tsx`, `src/components/ui/Breadcrumbs.tsx`, `src/app/layout.tsx`, `src/app/usluge/page.tsx`, `src/app/radovi/page.tsx`, `src/app/kontakt/page.tsx`, `src/app/politika-kolacica/page.tsx`, `src/app/politika-privatnosti/page.tsx`, `src/app/not-found.tsx`
      **Change**: Perform a final mechanical link audit: compare every rendered root-relative/hash href against the target inventory in Findings; verify that each hash-only href has exactly one same-document ID on every route where its component renders; verify that standalone detail links remain standalone; verify that disabled feature branches cannot emit a dead homepage hash; and make no destination changes beyond Steps 1–4.
      **Done when**: Grep plus the navigation script account for every `Link` and `<a href>` in `src`; there are no dead internal targets, accidental hard navigations, duplicate IDs within one route, or protocol/external links rendered as `Link`.

# Edge cases to preserve

- Clicking a different homepage fragment, the same fragment after manually scrolling away, or a fragment from a standalone route must all realign the target without visiting `0` first.
- Back/Forward after a fragment or cross-route navigation must restore the browser/Next-managed previous offset; no custom `history.scrollRestoration` is introduced.
- Plain-click and keyboard activation may scroll the current page; Ctrl/Cmd/Shift/Alt/middle clicks must retain native new-tab/new-window behavior without scrolling the source tab.
- The mobile menu must release body scroll and close even when selecting a same-page fragment whose route component does not remount.
- `Radovi` must never point to a missing ID when demo projects are excluded, `beforeAfter` is false, or `worksInNav` is false; the latter continues to hide the item entirely.
- Header offsets must work at the 1024 px CSS-variable breakpoint and the 1280 px desktop-navigation breakpoint, as well as phone widths and reduced-motion mode.
- Local `#procena` links on `/`, `/usluge`, and `/radovi` remain local; global photo CTAs intentionally retain `/kontakt#procena` and therefore open the dedicated contact route.
- Reveal animation changes apply only to a targeted section; normal scroll-triggered reveals and the hero’s explicit initial reveal remain unchanged.

# Out of scope

- Removing, redirecting, or redesigning `/usluge`, `/radovi`, `/kontakt`, legal pages, or their SEO metadata/sitemap entries.
- Changing service-card/footer service destinations to homepage anchors; those links intentionally open detailed service sections.
- Changing the global photo CTA destination from `/kontakt#procena` to the homepage form, changing labels/content/section order, or adding active-navigation highlighting.
- Replacing native smooth scrolling, implementing a custom router/scroll-restoration store, or overriding browser Back/Forward behavior.
- Launching or validating third-party apps/sites for telephone, email, Viber, WhatsApp, maps, social, reviews, or the gallery; only href/target/rel integrity is checked.
- Visual redesign of the fixed header, mobile overlays, footer, reveal system, or before/after component.

# Verification

Run these commands in order (use separate terminals for the server commands):

```bash
npm run lint
npm run typecheck
npm run build
PORT=3210 npm run start
SITE_BASE=http://127.0.0.1:3210 EXPECT_HOME_RADOVI=true npm run test:navigation
SITE_BASE=http://127.0.0.1:3210 python3 tools/provera-pristupacnosti.py
SITE_BASE=http://127.0.0.1:3210 python3 tools/provera-klizaca.py
```

Stop the first server, then verify the no-homepage-project fallback with a fresh build:

```bash
NEXT_PUBLIC_SHOW_DEMO_PROJECTS=false npm run build
PORT=3210 npm run start
SITE_BASE=http://127.0.0.1:3210 EXPECT_HOME_RADOVI=false npm run test:navigation
```

Finally, in Chrome at 1440×900 and 390×844, manually click `Radovi` from a deeply scrolled homepage and from `/usluge`, repeat it after scrolling away from `/#radovi`, use Back, click the logo from both routes, and enable reduced motion. Confirm there is no top flash, the complete target starts below the fixed header, surrounding homepage sections remain present, the mobile overlay closes, and Back restores the former offset.
