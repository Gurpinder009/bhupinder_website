"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { categoryLabels, films, type Film, type FilmCategory } from "@/app/components/shared/data/films";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import Reveal from "../home/Reveal"; // ! adjust this path to wherever your Reveal.tsx lives

// ============================================================
// * TYPES AND CONFIG
// ============================================================

const PAGE_SIZE = 3; // ? films per page. Set to 3 so pagination shows with the 6 sample films. Try 6 later

type CategorySlug = "all" | FilmCategory;

// * "All" first, then every category in the shared data file, so adding one there updates the tabs
const categories: { slug: CategorySlug; label: string }[] = [
  { slug: "all", label: "All" },
  ...(Object.keys(categoryLabels) as FilmCategory[]).map((slug) => ({ slug, label: categoryLabels[slug] })),
];

// ? timeZone UTC stops "2026-01-15" from shifting a day in some regions
const dateFormat = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

// * Page buttons to show: always first and last, plus the current page and its neighbours.
//   Gaps become "…". Example for page 5 of 10: 1 … 4 5 6 … 10
function getPageItems(current: number, total: number): (number | "…")[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const items: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push("…");
    items.push(p);
  });
  return items;
}

// ============================================================
// * COMPONENT: FilmsHero
// * Static banner photo on a dark wash. Gold works here because the background is dark.
// ============================================================

function FilmsHero() {
  return (
    <section className="relative h-[60svh] min-h-[460px] max-h-[640px] w-full overflow-hidden bg-[#051d1b]">
      <Image
        // TODO: replace with the photographer's real banner photo
        src="/images/photos/satwinder-image8.jpeg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      {/* ? Dark green wash keeps the white text readable on bright photos */}
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#051d1b] via-[#051d1b]/50 to-black/30" />

      <div className="absolute inset-0 flex items-end">
        {/* ? pb-24 leaves room for the cream section below, which overlaps the hero a little */}
        <div className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8 md:pb-32">
          <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#d8b45a]">
            <span aria-hidden="true" className="h-px w-10 bg-[#d8b45a]/70" />
            Films
          </p>

          {/* ! This is the page's only h1 */}
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
            Stories <em className="font-normal italic text-[#d8b45a]">in motion</em>
          </h1>

          {/* TODO: write your own line */}
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            A selection of films, each one a day we were lucky enough to be part of.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// * COMPONENT: CategoryFilter
// * Pill buttons with counts. The active one is filled teal.
// ============================================================

function CategoryFilter({
  active,
  onSelect,
}: {
  active: CategorySlug;
  onSelect: (slug: CategorySlug) => void;
}) {
  const countFor = (slug: CategorySlug) =>
    slug === "all" ? films.length : films.filter((f) => f.category === slug).length;

  return (
    <nav aria-label="Film categories">
      <ul className="flex flex-wrap gap-2 md:gap-3">
        {categories.map((c) => (
          <li key={c.slug}>
            <button
              type="button"
              aria-pressed={active === c.slug}
              onClick={() => onSelect(c.slug)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                active === c.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background-darker text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {c.label} <span className="opacity-60">({countFor(c.slug)})</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ============================================================
// * COMPONENT: FilmItem
// * One row of the vertical list: image on one side, text on the other.
// * `reversed` swaps the sides. On phones the image always comes first.
// ============================================================

function FilmItem({ film, index, reversed }: { film: Film; index: number; reversed: boolean }) {
  const href = `/films/${film.slug}`;

  return (
    // ? group lets hovering either side drive the hover effects on both
    <li className="group py-14 md:py-24">
      <article className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
        {/* ============ Image side ============ */}
        <Reveal className={`md:col-span-7 ${reversed ? "md:order-1" : "md:order-2"}`}>
          <div className="relative">
            {/* * Offset outline. It flips to the other side on alternate rows */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 hidden rounded-card border border-primary/40 md:block ${
                reversed ? "-translate-x-4 translate-y-4" : "translate-x-4 translate-y-4"
              }`}
            />

            {/* ? aria-hidden + tabIndex -1: the title link right beside it already names this destination */}
            <Link
              href={href}
              aria-hidden="true"
              tabIndex={-1}
              className="relative block aspect-video overflow-hidden rounded-card bg-border shadow-card"
            >
              <Image
                src={film.image}
                alt=""
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

              {/* * Play badge, centred */}
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-card transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none md:h-20 md:w-20">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </Link>
          </div>
        </Reveal>

        {/* ============ Text side ============ */}
        {/* ? relative here so the stretched title link covers this whole column */}
        <Reveal delay={150} className={`relative md:col-span-5 ${reversed ? "md:order-2" : "md:order-1"}`}>
          {/* * Big outlined number */}
          <p
            aria-hidden="true"
            className="font-serif text-7xl font-semibold leading-none text-transparent [-webkit-text-stroke:1px_var(--color-primary)] md:text-8xl"
          >
            {String(index + 1).padStart(2, "0")}
          </p>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {categoryLabels[film.category]} <span aria-hidden="true">&middot;</span>{" "}
            <time dateTime={film.date} className="text-muted">
              {dateFormat.format(new Date(film.date))}
            </time>
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary md:text-4xl">
            {/* * after:absolute after:inset-0 stretches the link over the whole text column */}
            <Link href={href} className="after:absolute after:inset-0">
              {film.title}
            </Link>
          </h2>

          {/* ? line-clamp keeps every row the same height, even with long text */}
          <p className="mt-5 line-clamp-4 max-w-md text-lg leading-relaxed text-muted">{film.description}</p>

          <span
            aria-hidden="true"
            className="mt-8 inline-flex items-center gap-3 border-b border-primary pb-1 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-all group-hover:gap-5"
          >
            Watch film <span className="text-primary">&rarr;</span>
          </span>
        </Reveal>
      </article>
    </li>
  );
}

// ============================================================
// * COMPONENT: FilmList
// * Vertical list with thin dividers. `startIndex` keeps the numbers and the
// * left/right alternation continuing across pages (page 2 starts at 04).
// ============================================================

function FilmList({ items, startIndex }: { items: Film[]; startIndex: number }) {
  if (items.length === 0) {
    return <p className="mt-16 text-lg text-muted">No films in this category yet.</p>;
  }

  return (
    <ul className="mt-6 divide-y divide-border md:mt-10">
      {items.map((film, i) => (
        // ? key is the slug, so rows keep their identity when the filter changes
        <FilmItem key={film.slug} film={film} index={startIndex + i} reversed={(startIndex + i) % 2 === 1} />
      ))}
    </ul>
  );
}

// ============================================================
// * COMPONENT: Pagination
// * Previous, numbered pages with "…" gaps, Next. Hidden when there is only one page.
// ============================================================

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const edge =
    "inline-flex h-11 items-center justify-center rounded-full border border-border bg-backrgound-darker px-5 text-sm font-semibold uppercase tracking-[0.15em] text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav aria-label="Pagination" className="mt-10 border-t border-border pt-10 md:mt-16">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} className={edge}>
            <span aria-hidden="true" className="mr-2">
              &larr;
            </span>
            Prev
          </button>
        </li>

        {getPageItems(page, totalPages).map((item, i) =>
          item === "…" ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => onChange(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                  item === page
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background-darker text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {item}
              </button>
            </li>
          )
        )}

        <li>
          <button type="button" onClick={() => onChange(page + 1)} disabled={page === totalPages} className={edge}>
            Next
            <span aria-hidden="true" className="ml-2">
              &rarr;
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

// ============================================================
// * MAIN COMPONENT: FilmsPage
// * Hero on top, then the cream section with the filter, the list, and the pagination.
// ============================================================

export default function FilmsPage() {
  const [active, setActive] = useState<CategorySlug>("all");
  const [page, setPage] = useState(1);
  const listTopRef = useRef<HTMLDivElement>(null);

  const filtered = films
    .filter((f) => active === "all" || f.category === active)
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages); // ? safety net if the list ever shrinks
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  // * Changing the filter always goes back to page 1
  const selectCategory = (slug: CategorySlug) => {
    setActive(slug);
    setPage(1);
  };

  // * Changing the page scrolls back to the top of the list
  const changePage = (next: number) => {
    setPage(next);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    listTopRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      {/* ! Keep Header and Footer in ONE place only: here, or in layout.tsx, not both */}
      <Header />
      <main>
        <FilmsHero />

        {/* ? -mt-10 / rounded top: the cream section overlaps the hero slightly, for a softer edge */}
        <div className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-background md:-mt-14">
          {/* ? scroll-mt keeps the filter row clear of the floating header after a page change */}
          <section ref={listTopRef} className="mx-auto max-w-6xl scroll-mt-24 px-6 py-14 md:px-8 md:py-20">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <CategoryFilter active={active} onSelect={selectCategory} />
              <p className="text-sm text-muted" aria-live="polite">
                {filtered.length === 0
                  ? "No films"
                  : `Showing ${start + 1}\u2013${start + visible.length} of ${filtered.length} ${
                      filtered.length === 1 ? "film" : "films"
                    }`}
              </p>
            </div>

            <FilmList items={visible} startIndex={start} />
            <Pagination page={current} totalPages={totalPages} onChange={changePage} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}