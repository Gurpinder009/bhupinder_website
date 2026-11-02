"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import Reveal from "../home/Reveal"; // ! adjust this path to wherever your Reveal.tsx lives

// ============================================================
// * CONTENT: placeholders. Replace with your own travel photos
// ============================================================

type Ratio = "portrait" | "landscape" | "square";

type TravelPhoto = {
  src: string; // path inside /public
  alt: string; // describe the photo for screen readers and search
  place?: string; // ? shown on hover and in the full-screen viewer
  ratio: Ratio; // ! match the real photo's shape, or it gets cropped
};

// * Tailwind needs the full class names written out, so they're mapped here
const ratioClass: Record<Ratio, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

// TODO: replace with your travel photos, newest first. Write a real alt for each
const photos: TravelPhoto[] = [
  { src: "/images/photos/satwinder-image4.jpeg", alt: "Describe this photo", place: "Place name", ratio: "portrait" },
  { src: "/images/photos/satwinder-image7.jpeg", alt: "Describe this photo", place: "Place name", ratio: "landscape" },
  { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe this photo", place: "Place name", ratio: "portrait" },
  { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe this photo", place: "Place name", ratio: "square" },
  { src: "/images/photos/satwinder-image11.jpeg", alt: "Describe this photo", place: "Place name", ratio: "portrait" },
  { src: "/images/photos/satwinder-image3.jpeg", alt: "Describe this photo", place: "Place name", ratio: "landscape" },
  { src: "/images/photos/satwinder-image4.jpeg", alt: "Describe this photo", place: "Place name", ratio: "square" },
  { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe this photo", place: "Place name", ratio: "landscape" },
  { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe this photo", place: "Place name", ratio: "portrait" },
];

const PAGE_SIZE = 12; // ? photos shown first, and added with each "Show more"

// ============================================================
// * COMPONENT: Label
// * Small label with a line before it. `onDark` switches gold (dark bands) / teal (cream).
// ============================================================

function Label({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p
      className={`flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] ${
        onDark ? "text-gold" : "text-primary"
      }`}
    >
      <span aria-hidden="true" className={`h-px w-10 ${onDark ? "bg-gold/70" : "bg-primary/70"}`} />
      {children}
    </p>
  );
}

// ============================================================
// * COMPONENT: TravelHero
// * Static banner photo on a dark wash. Gold works here because the background is dark.
// ============================================================

function TravelHero() {
  return (
    <section className="relative h-[60svh] min-h-[460px] max-h-[640px] w-full overflow-hidden bg-[#051d1b]">
      <Image
        // TODO: replace with your favourite travel photo
        src="/images/photos/satwinder-image11.jpeg"
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
            Travel
          </p>

          {/* ! This is the page's only h1 */}
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
            Frames <em className="font-normal italic text-[#d8b45a]">from the road</em>
          </h1>

          {/* TODO: write your own line */}
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            Photographs from places we wandered through, between the weddings and the work.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// * COMPONENT: Lightbox
// * Full-screen photo viewer on the native <dialog>, with the place name underneath.
// * Esc closes it, arrow keys and swipes change photo, clicking the dark area closes it.
// ============================================================

function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: TravelPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const photo = items[index];

  // * Wraps around at both ends
  const go = (i: number) => onNavigate((i + items.length) % items.length);

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
      // * Swipe left or right on touch screens
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? index + 1 : index - 1);
      }}
      className="m-0 h-full max-h-none w-full max-w-none bg-black/95 p-0 backdrop:bg-black/95"
    >
      <div
        className="relative flex h-full w-full items-center justify-center p-4 md:p-12"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* ? object-contain shows the whole photo, never cropped */}
        <div className="relative h-[78svh] w-full max-w-6xl">
          <Image key={photo.src + index} src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-contain" priority />
        </div>

        {photo.place && (
          <p className="absolute inset-x-0 bottom-5 text-center font-serif text-lg text-white/90 md:bottom-8 md:text-xl">
            {photo.place}
          </p>
        )}

        <p aria-live="polite" className="absolute left-5 top-5 text-sm font-medium tracking-[0.2em] text-white/80">
          {index + 1} / {items.length}
        </p>

        <button
          type="button"
          aria-label="Close viewer"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/25"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {items.length > 1 && (
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
// * COMPONENT: PhotoWall
// * Staggered columns. Clicking a photo opens it full screen.
// * Shows PAGE_SIZE photos first, then a "Show more" button.
// ============================================================

function PhotoWall() {
  // ? null = viewer closed
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // * Slicing from the start keeps each photo's index equal to its index in the full list,
  //   so the viewer opens the right photo and can page through all of them
  const visible = photos.slice(0, visibleCount);
  const remaining = photos.length - visible.length;

  return (
    <>
      {/* * CSS columns give the staggered look; break-inside-avoid keeps each photo whole */}
      <ul className="mt-12 columns-2 gap-3 md:mt-16 md:columns-3 md:gap-5">
        {visible.map((photo, i) => (
          <li key={`${photo.src}-${i}`} className="mb-3 break-inside-avoid md:mb-5">
            <Reveal delay={Math.min(i % 3, 2) * 90}>
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`View full screen: ${photo.place ? `${photo.place}. ` : ""}${photo.alt}`}
                className={`group relative block w-full overflow-hidden rounded-card bg-border ${ratioClass[photo.ratio]}`}
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                />

                {/* * Hover and keyboard-focus cue with the place name */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-end justify-between gap-3 bg-linear-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span className="font-serif text-lg text-white">{photo.place}</span>
                  <span className="shrink-0 rounded-full bg-white/90 p-2 text-black">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
                    </svg>
                  </span>
                </span>
              </button>
            </Reveal>
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="rounded-full border border-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Show more ({remaining} left)
          </button>
        </div>
      )}

      {openIndex !== null && (
        <Lightbox items={photos} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      )}
    </>
  );
}

// ============================================================
// * COMPONENT: ClosingCta
// * Green band with one clear action. It flows straight into the deep-green footer.
// ============================================================

function ClosingCta() {
  return (
    <section aria-labelledby="travel-cta-title" className="surface-green px-6 py-28 text-center md:py-44">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Let&apos;s talk</p>
        <h2 id="travel-cta-title" className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-semibold leading-[1.05] text-foreground md:text-7xl">
          Got a place <em className="font-normal italic text-gold">in mind?</em>
        </h2>
        {/* TODO: only say the photographer travels for work if he does */}
        <p className="mx-auto mt-6 max-w-md text-lg text-muted">Tell us about it, wherever it is.</p>
        <Link
          href="/contact-me"
          className="mt-10 inline-block rounded-full bg-primary px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-leaf"
        >
          Get in touch
        </Link>
      </Reveal>
    </section>
  );
}

// ============================================================
// * MAIN COMPONENT: TravelPage
// * Dark hero, cream photo wall, green closing band, footer.
// ============================================================

export default function TravelPage() {
  // * Number of different places, for the small stat line. Skipped if no photo has a place
  const placeCount = new Set(photos.map((p) => p.place).filter(Boolean)).size;

  return (
    <>
      {/* ! Keep Header and Footer in ONE place only: here, or in layout.tsx, not both */}
      <Header />
      <main>
        <TravelHero />

        {/* ? -mt-10 / rounded top: the cream section overlaps the hero slightly, for a softer edge */}
        <div className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-background md:-mt-14">
          <section aria-labelledby="travel-title" className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
            <Reveal>
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <Label>The road</Label>
                  <h2 id="travel-title" className="mt-5 font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
                    A few <em className="font-normal italic text-primary">favourites</em>
                  </h2>
                </div>

                <p className="text-sm text-muted md:text-right">
                  <span className="font-serif text-2xl text-foreground">{photos.length}</span> photographs
                  {placeCount > 0 && (
                    <>
                      {" "}
                      from <span className="font-serif text-2xl text-foreground">{placeCount}</span>{" "}
                      {placeCount === 1 ? "place" : "places"}
                    </>
                  )}
                  <br />
                  Select any photo to view it full size
                </p>
              </div>
            </Reveal>

            <PhotoWall />
          </section>
        </div>

        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}