"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categoryLabels, films, type Film, type FilmCategory } from "@/app/components/shared/data/films";
import { FilmItem } from "../components/shared/HomeSections";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

// ============================================================
// * TYPES AND CONFIG
// ============================================================

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

// ============================================================
// * COMPONENT: FilmsHero
// * Static banner photo with the page title. No autoplay, no controls.
// ============================================================

function FilmsHero() {
  return (
    <section className="relative h-[45svh] min-h-[550px] max-h-[660px] w-full overflow-hidden bg-ink">
      <Image
        // TODO: replace with the photographer's real banner photo
        src="/images/photos/satwinder-image8.jpeg"
        alt="Close-up of a film camera on location"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      {/* ? Gradient keeps the white text readable on bright photos */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/20" />

      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-6xl px-6 pb-10 md:px-8 md:pb-14">
          {/* ! This is the page's only h1 */}
          <h1 className="font-serif text-4xl font-semibold italic text-white md:text-6xl">
            Stories in motion.
          </h1>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// * COMPONENT: CategoryFilter
// * Text tabs separated by thin dividers: All | Classic | New Age | Intimates
// ============================================================

function CategoryFilter({
  active,
  onSelect,
}: {
  active: CategorySlug;
  onSelect: (slug: CategorySlug) => void;
}) {
  return (
    <nav aria-label="Film categories">
      <ul className="flex flex-wrap items-center gap-y-2">
        {categories.map((c, i) => (
          <li key={c.slug} className="flex items-center">
            {/* ? Decorative divider, hidden from screen readers */}
            {i > 0 && <span aria-hidden="true" className="mx-4 h-4 w-px bg-foreground/30 md:mx-6" />}
            <button
              type="button"
              aria-pressed={active === c.slug}
              onClick={() => onSelect(c.slug)}
              className={`py-1 font-serif text-base transition-colors md:text-lg ${
                active === c.slug
                  ? "font-semibold text-foreground underline decoration-2 underline-offset-8"
                  : "text-foreground/70 hover:text-primary"
              }`}
            >
              {c.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ============================================================
// * COMPONENT: FilmCard
// * The whole card is clickable. The title link stretches over the card,
// * so screen readers still announce a short, clear link name (the title).
// ============================================================

function FilmCard({ film }: { film: Film }) {
  return (
    <li>
      <article className="group relative">
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded bg-border">
          <Image
            src={film.image}
            alt="" // ? decorative: the title link right below names the card
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>

        <p className="mt-4 text-xs text-muted md:text-sm">
          {categoryLabels[film.category]} <span aria-hidden="true">•</span>{" "}
          <time dateTime={film.date}>{dateFormat.format(new Date(film.date))}</time>
        </p>

        <h2 className="mt-1 font-serif text-xl leading-snug text-foreground transition-colors group-hover:text-primary md:text-2xl">
          {/* * after:absolute after:inset-0 stretches the link over the whole card */}
          <Link href={`/films/${film.slug}`} className="after:absolute after:inset-0">
            {film.title}
          </Link>
        </h2>

        {/* ? line-clamp keeps every card the same height, even with long text */}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{film.description}</p>
      </article>
    </li>
  );
}

// ============================================================
// * COMPONENT: FilmGrid
// * 1 column on phones, 2 on tablets, 4 on desktop. Shows an empty state.
// ============================================================

function FilmGrid({ items }: { items: Film[] }) {
  if (items.length === 0) {
    return <p className="mt-12 text-muted">No films in this category yet.</p>;
  }

  return (
    <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((film) => (
        <FilmCard key={film.slug} film={film} />
      ))}
    </ul>
  );
}

// ============================================================
// * MAIN COMPONENT: FilmsPage
// * Hero on top, then the filter row, then the grid.
// ============================================================

export default function FilmsPage() {
  const [active, setActive] = useState<CategorySlug>("all");

  const visible = films
    .filter((f) => active === "all" || f.category === active)
    .sort((a:Film, b:Film) => b.date.localeCompare(a.date)); // newest first

  return (
    <>
    <Header/>
    <main>
      <FilmsHero />

      <section className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
        <CategoryFilter active={active} onSelect={setActive} />
        <FilmGrid items={visible} />
      </section>
    </main>
    <Footer/>
    </>
  );
}

// TODO: if there are many films, add a "Load more" button instead of one long page