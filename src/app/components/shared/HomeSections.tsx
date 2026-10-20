"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import VideoPlayerComponent from "./VideoPlayerComponent";

// ============================================================
// * TYPES
// ============================================================


export type GalleryPhoto = {
  src: string; // path inside /public
  alt: string; // describe the photo for screen readers and SEO
  ratio?: Ratio; // ? no longer used. Left optional so older data still type-checks
};
type Ratio = "portrait" | "landscape" | "square";



export type FilmItem = {
  id: string;
  title: string;
  description: string;
  poster: string; // local thumbnail inside /public
  videoSrc: string; // .mp4 file URL, or an .m3u8 HLS stream URL
  category?: string; // ? e.g. "Wedding film". Shown as a small label
  year?: string; // ? e.g. "2026"
};

// * Tailwind needs full class names written out, so map them here
const ratioClass: Record<Ratio, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
};

// ============================================================
// * COMPONENT: IntroSection
// * Editorial layout: big heading, photo lower-left, text centre,
// * taller photo upper-right. Stacks on phones.
// ============================================================
// ============================================================
// * COMPONENT: Reveal
// * Fades and lifts its children in once, when they scroll into view.
// * Skips the animation if the OS asks for reduced motion.
// ============================================================

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number; // ms
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect(); // ? animate once, then stop watching
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ============================================================
// * COMPONENT: IntroSection
// * Text column on the left, photo collage on the right.
// * Stacks on phones: text first, photos below.
// ============================================================

export function IntroSection({
  eyebrow,
  heading,
  accent,
  paragraphs,
  stats,
  cta,
  mainPhoto,
  secondaryPhoto,
}: {
  eyebrow: string;
  heading: string;
  accent: string; // ? shown on its own line in italic, in the brand colour
  paragraphs: string[];
  stats?: { value: string; label: string }[];
  cta?: { label: string; href: string };
  mainPhoto: { src: string; alt: string };
  secondaryPhoto: { src: string; alt: string };
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* ---------- Text column ---------- */}
        <div>
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span aria-hidden="true" className="h-px w-10 bg-primary" />
              {eyebrow}
            </p>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
              {heading}
              <em className="mt-1 block font-normal italic text-primary">{accent}</em>
            </h2>
          </Reveal>

          <div className="mt-8 space-y-5">
            {paragraphs.map((p, i) => (
              <Reveal key={p} delay={200 + i * 100}>
                {/* ? The first paragraph is slightly larger, like a magazine intro */}
                <p className={i === 0 ? "text-lg leading-relaxed text-foreground md:text-xl" : "leading-relaxed text-muted"}>
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          {stats && stats.length > 0 && (
            <Reveal delay={400}>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dd className="font-serif text-3xl font-semibold text-foreground md:text-4xl">{s.value}</dd>
                    <dt className="mt-1 text-xs uppercase tracking-wide text-muted">{s.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {cta && (
            <Reveal delay={500}>
              <Link
                href={cta.href}
                className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
              >
                {cta.label}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </Reveal>
          )}
        </div>

        {/* ---------- Photo collage ---------- */}
        <Reveal delay={150}>
          <div className="relative mx-auto w-full max-w-md pb-14 lg:max-w-none">
            {/* * Main photo: arch-shaped, with an offset outline frame behind it */}
            <div className="relative ml-auto aspect-[4/5] w-[78%]">
              <div
                aria-hidden="true"
                className="absolute -right-3 -top-3 h-full w-full rounded-t-[999px] border border-primary/40"
              />
              <div className="relative h-full w-full overflow-hidden rounded-t-[999px] bg-border">
                <Image
                  src={mainPhoto.src}
                  alt={mainPhoto.alt}
                  fill
                  sizes="(min-width: 1024px) 35vw, 70vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* * Secondary photo: overlaps the corner; the border matches the page background */}
            <div className="absolute bottom-0 left-0 z-10 aspect-[3/4] w-[46%] overflow-hidden rounded-card border-8 border-background bg-border shadow-card">
              <Image
                src={secondaryPhoto.src}
                alt={secondaryPhoto.alt}
                fill
                sizes="(min-width: 1024px) 18vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photo = photos[index];
  const go = (i: number) => onNavigate((i + photos.length) % photos.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    // ? Guard against calling showModal twice (React StrictMode runs effects twice in dev)
    if (dialog && !dialog.open) dialog.showModal();

    // * Stop the page behind the viewer from scrolling
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const arrowBtn =
    "absolute top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/25";

  return (
    <dialog
      ref={dialogRef}
      aria-label="Photo viewer"
      onClose={onClose} // ? fires on Esc as well
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      className="m-0 h-full max-h-none w-full max-w-none bg-black/90 p-0 backdrop:bg-black/90"
    >
      <div
        className="relative flex h-full w-full items-center justify-center p-4 md:p-12"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative h-[80svh] w-full max-w-5xl">
          <Image src={photo.src} alt={photo.alt} fill sizes="90vw" className="object-contain" />
        </div>

        <button type="button" aria-label="Close viewer" onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/25">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {photos.length > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => go(index - 1)} className={`${arrowBtn} left-3 md:left-6`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button type="button" aria-label="Next photo" onClick={() => go(index + 1)} className={`${arrowBtn} right-3 md:right-6`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}

// ============================================================
// * COMPONENT: GallerySection
// * Masonry-style columns. Clicking a photo opens the Lightbox.
// ============================================================
// ============================================================
// * COMPONENT: GallerySection
// * Masonry-style columns. Clicking a photo opens the Lightbox.
// * Shows `initialCount` photos first, then a "Show more" button.
// ============================================================

// ============================================================
// * LAYOUT PATTERN
// * Repeats every 8 photos so the grid always interlocks with no gaps.
// * Phones (2 columns): "big" tiles span the full width.
// * md and up (4 columns): big = 2x2, tall = 1x2, small = 1x1.
// ! grid-flow-dense on the <ul> is what makes the small tiles fill the gaps.
// ============================================================

const tilePattern = [
  "col-span-2 md:row-span-2", // 0 big, left
  "", // 1 small
  "md:row-span-2", // 2 tall
  "", // 3 small
  "col-span-2 md:col-start-3 md:row-span-2", // 4 big, right
  "", // 5 small
  "md:row-span-2", // 6 tall
  "", // 7 small
] as const;

// ============================================================
// * COMPONENT: GalleryTile
// * One photo tile with the hover frame, number, and expand icon.
// ============================================================

function GalleryTile({
  photo,
  index,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number; // 0-based position in the full list
  onOpen: () => void;
}) {
  return (
    <li className={`relative ${tilePattern[index % tilePattern.length]}`}>
      {/* ? Stagger only within a row of three so far-down tiles never wait long */}
      <Reveal delay={Math.min(index % 3, 2) * 90} className="h-full">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`View larger: ${photo.alt}`}
          className="group relative block h-full w-full overflow-hidden rounded-card bg-border"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
          />

          {/* * Soft gradient so the number stays readable */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          />

          {/* * Inset frame that draws in on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 scale-95 border border-white/70 opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
          />

          {/* * Photo number */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-5 left-6 translate-y-2 font-serif text-xl text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* * Expand icon */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-5 rounded-full bg-white/90 p-2 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
            </svg>
          </span>
        </button>
      </Reveal>
    </li>
  );
}

// ============================================================
// * COMPONENT: GallerySection
// * Header + mosaic grid + "Show more". Clicking a photo opens the Lightbox.
// ============================================================
export function GallerySection({
  eyebrow = "Gallery",
  title = "Moments",
  accent = "worth a second look",
  photos,
  initialCount = 8, // ! keep this a multiple of 8 so each batch completes the pattern
  toolbar,
  resetKey,
}: {
  eyebrow?: string;
  title?: string;
  accent?: string;
  photos: GalleryPhoto[];
  initialCount?: number;
  toolbar?: React.ReactNode; // ? rendered between the header and the grid
  resetKey?: string; // ? when this changes, "Show more" goes back to the first batch
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(initialCount);

  // * Back to the first batch whenever the filter changes
  useEffect(() => {
    setVisibleCount(initialCount);
  }, [resetKey, initialCount]);

  // ...unchanged: visible, remaining

  // * Slicing from the start keeps each tile's index equal to its index in `photos`,
  //   so the Lightbox opens the right photo and can still page through all of them
  const visible = photos.slice(0, visibleCount);
  const remaining = photos.length - visible.length;

  return (
    <section aria-labelledby="gallery-title" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* ---------- Header ---------- */}
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <span aria-hidden="true" className="h-px w-10 bg-primary" />
                {eyebrow}
              </p>
              <h2
                id="gallery-title"
                className="mt-5 max-w-2xl font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl"
              >
                {title} <em className="font-normal italic text-primary">{accent}</em>
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-muted md:text-right">
              <span className="font-serif text-2xl text-foreground">{photos.length}</span> photographs
              <br />
              Select any photo to view it full size
            </p>
          </div>
        </Reveal>
               

        {toolbar && <div className="mt-10">{toolbar}</div>}

        {/* ---------- Mosaic ---------- */}

        {/* ---------- Mosaic ---------- */}
        <ul className="mt-12 grid auto-rows-[11rem] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[13rem] md:auto-rows-[12rem] md:grid-cols-4 md:gap-4 lg:auto-rows-[15rem]">
          {visible.map((photo, i) => (
            <GalleryTile key={`${photo.src}-${i}`} photo={photo} index={i} onOpen={() => setOpenIndex(i)} />
          ))}
        </ul>

        {remaining > 0 && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + initialCount)}
              className="rounded-card border border-primary px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Show more ({remaining} left)
            </button>
          </div>
        )}
      </div>

      {openIndex !== null && (
        <Lightbox photos={photos} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      )}
    </section>
  );
}


// ============================================================
// * COMPONENT: VideoCard
// * Shows a poster image. The real video player only loads after a click,
// * so the page stays fast even with several videos.
// ============================================================
// ============================================================
// * COMPONENT: FilmMeta
// * Small "category · year" line. Renders nothing if both are missing.
// ============================================================

function FilmMeta({ film }: { film: FilmItem }) {
  const parts = [film.category, film.year].filter(Boolean);
  if (parts.length === 0) return null;
  return <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">{parts.join("  ·  ")}</p>;
}

// ============================================================
// * COMPONENT: VideoCard
// * Poster first. The real player loads only after a click, so the page stays fast.
// * variant "featured" = big play button, text beside the video on desktop.
// ============================================================// ============================================================
// * COMPONENT: VideoCard
// * Poster first. The real player loads only after a click, so the page stays fast.
// * Renders its own <li> and fade-in, so it can sit directly inside a <ul>.
// ============================================================

function VideoCard({
  film,
  index,
}: {
  film: FilmItem;
  index: number; // 0-based position in the list
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <li>
      {/* ? Stagger within each row of three so lower cards never wait long */}
      <Reveal delay={Math.min(index % 3, 2) * 100}>
        <article>
          {/* ---------- Video / poster ---------- */}
          <div className="relative aspect-video overflow-hidden rounded-card bg-ink shadow-card">
            {playing ? (
              // * The player fills the card, same shape as the poster it replaces
              <div className="absolute inset-0">
                <VideoPlayerComponent videoSrc={film.videoSrc} poster={film.poster} />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play film: ${film.title}`}
                className="group absolute inset-0"
              >
                <Image
                  src={film.poster}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                />
                <span className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent transition-colors group-hover:from-black/60" />

                {/* * Play button, with a ring that expands on hover */}
                <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-card transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none md:h-16 md:w-16">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100 motion-reduce:hidden md:h-16 md:w-16"
                />
              </button>
            )}
          </div>

          {/* ---------- Text ---------- */}
          <div className="mt-5">
            <div className="flex items-baseline gap-3">
              <span aria-hidden="true" className="font-serif text-2xl text-primary/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <FilmMeta film={film} />
            </div>
            <h3 className="mt-2 font-serif text-xl leading-snug text-foreground md:text-2xl">{film.title}</h3>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{film.description}</p>
          </div>
        </article>
      </Reveal>
    </li>
  );
}




// ============================================================
// * COMPONENT: FilmsSection
// * Header, then an even grid of film cards: 1 column on phones, 2 on tablets, 3 on desktop.
// ============================================================
export function FilmsSection({
  eyebrow = "Films",
  title = "Stories",
  accent = "in motion",
  description,
  films,
}: {
  eyebrow?: string;
  title?: string;
  accent?: string; // ? italic line in the brand colour
  description?: string; // ? one or two short sentences under the heading
  films: FilmItem[];
}) {
  if (films.length === 0) return null;

  return (
    <section aria-labelledby="films-title" className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
      {/* ---------- Header ---------- */}
      <Reveal>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
         <div>
  <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
    <span aria-hidden="true" className="h-px w-10 bg-primary" />
    {eyebrow}
  </p>
  <h2
    id="films-title"
    className="mt-5 max-w-2xl font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl"
  >
    {title} <em className="font-normal italic text-primary">{accent}</em>
  </h2>

  {/* * Short intro line under the heading. Hidden if no description is passed */}
  {description && (
    <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">{description}</p>
  )}
</div>

          <Link
            href="/films"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
          >
            View all films <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </Reveal>

      {/* ---------- Grid ---------- */}
      <ul className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {films.map((film, i) => (
          <VideoCard key={film.id} film={film} index={i} />
        ))}
      </ul>
    </section>
  );
}

// TODO: add an "as seen in" strip only with logos the client is allowed to use




// ============================================================
// * COMPONENT: GalleryBrowser
// * Category filter pills + the mosaic. Used by the /gallery page.
// ============================================================

export type CategorizedPhoto = GalleryPhoto & { category: string };

export function GalleryBrowser({
  photos,
  categories,
}: {
  photos: CategorizedPhoto[];
  categories: { slug: string; label: string }[];
}) {
  const [active, setActive] = useState("all");

  const countFor = (slug: string) =>
    slug === "all" ? photos.length : photos.filter((p) => p.category === slug).length;

  // ? Hide categories with no photos, so there are no dead-end pills
  const tabs = [{ slug: "all", label: "All" }, ...categories].filter((t) => countFor(t.slug) > 0);

  const filtered = active === "all" ? photos : photos.filter((p) => p.category === active);

  const toolbar = (
    <nav aria-label="Photo categories">
      <ul className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <li key={t.slug}>
            <button
              type="button"
              aria-pressed={active === t.slug}
              onClick={() => setActive(t.slug)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                active === t.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {t.label} <span className="opacity-60">({countFor(t.slug)})</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <GallerySection
      eyebrow="Photography"
      title="Every frame,"
      accent="a small story"
      photos={filtered}
      toolbar={toolbar}
      resetKey={active}
    />
  );
}