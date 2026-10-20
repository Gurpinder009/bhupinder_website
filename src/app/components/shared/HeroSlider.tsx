"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ============================================================
// * TYPES
// ============================================================

export type HeroPhoto = {
  src: string; // path inside /public, e.g. "/images/hero/one.jpg"
  alt: string; // describe the photo for screen readers and SEO
};

type HeroIntro = {
  heading: string;
  text: string;
  cta?: { label: string; href: string };
};

// ============================================================
// * HOOK: useHeroSlider
// * Owns the current slide, autoplay, and pause rules.
// * Autoplay stops when: the user pauses it, a mouse is over the
// * hero, keyboard focus is inside it, or the OS asks for reduced motion.
// ============================================================

function useHeroSlider(count: number, intervalMs: number) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  // * Hover and keyboard focus are tracked separately so one can't cancel the other
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // * Follow the OS "reduce motion" setting, including live changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const playing = count > 1 && !userPaused && !hovered && !focused && !reduceMotion;

  // * Advance on a timer. Depending on `index` restarts the timer
  //   after a manual change, so a click never gets skipped immediately.
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearTimeout(id);
  }, [playing, index, count, intervalMs]);

  // * Wrap around at both ends
  const goTo = (i: number) => setIndex(((i % count) + count) % count);

  return {
    index,
    playing,
    userPaused,
    goTo,
    next: () => goTo(index + 1),
    prev: () => goTo(index - 1),
    togglePause: () => setUserPaused((p) => !p),
    setHovered,
    setFocused,
  };
}

// ============================================================
// * COMPONENT: HeroSlide
// * One photo. All slides are stacked; only the active one is visible.
// ============================================================

function HeroSlide({ photo, active, isFirst }: { photo: HeroPhoto; active: boolean; isFirst: boolean }) {
  return (
    <div
      // ? Hide inactive slides from screen readers
      aria-hidden={!active}
      className={`absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="100vw"
        className="object-center object-cover"
        // ! Only the first image gets priority (it is the page's biggest paint)
        priority={isFirst}
      />
    </div>
  );
}

// ============================================================
// * COMPONENT: HeroOverlay
// * Dark gradient for contrast + the intro text and button.
// ============================================================

function HeroOverlay({ heading, text, cta }: HeroIntro) {
  return (
    <>
      {/* ? Gradient keeps white text readable on bright photos */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />

      <div className="absolute inset-0 flex items-end md:items-center">
        <div className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-8 md:pb-0">
          {/* ! Keep exactly one h1 per page. Change to h2 if the page already has one. */}
          <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-tight text-white md:text-6xl">
            {heading}
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/90 md:text-lg">{text}</p>
          {cta && (
            <Link
              href={cta.href}
              className="mt-8 inline-block rounded-card bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-leaf"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

// ============================================================
// * COMPONENT: ArrowButton
// * Round previous / next button on the sides (hidden on phones).
// ============================================================

function ArrowButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous photo" : "Next photo"}
      onClick={onClick}
      className={`absolute top-1/2 hidden -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur transition hover:bg-black/50 md:block ${
        direction === "prev" ? "left-4" : "right-4"
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}

// ============================================================
// * COMPONENT: HeroControls
// * Pause / play button + dots along the bottom edge.
// ============================================================

function HeroControls({
  photos,
  index,
  userPaused,
  onSelect,
  onTogglePause,
}: {
  photos: HeroPhoto[];
  index: number;
  userPaused: boolean;
  onSelect: (i: number) => void;
  onTogglePause: () => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4">
      {/* ? Autoplay needs a visible pause control (accessibility guidance) */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={onTogglePause}
          aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
          className="rounded-full bg-black/30 p-2 text-white backdrop-blur transition hover:bg-black/50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {userPaused ? <path d="M8 5v14l11-7z" /> : <path d="M6 5h4v14H6zM14 5h4v14h-4z" />}
          </svg>
        </button>
      )}

      <div className="flex gap-2">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
            aria-current={i === index}
            onClick={() => onSelect(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// * MAIN COMPONENT: HeroSlider
// * Full-width hero. Place it right under <Header /> on the home page.
// ============================================================

export default function HeroSlider({
  photos,
  heading,
  text,
  cta,
  intervalMs = 6000,
}: { photos: HeroPhoto[]; intervalMs?: number } & HeroIntro) {
  const { index, playing, userPaused, goTo, next, prev, togglePause, setHovered, setFocused } =
    useHeroSlider(photos.length, intervalMs);

  // ? Nothing to show, so render nothing instead of an empty block
  if (photos.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Introduction"
      // * Only a real mouse pauses on hover (touch taps are ignored)
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      // * Only keyboard focus pauses. Clicking a button no longer freezes autoplay.
      onFocus={(e) => e.target.matches(":focus-visible") && setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      className="relative h-[70svh] max-h-[900px] min-h-[650px] w-full overflow-hidden bg-ink"
    >
      {/* ? Announce slide changes only while autoplay is off, so it never spams */}
      <div aria-live={playing ? "off" : "polite"}>
        {photos.map((photo, i) => (
          <HeroSlide key={photo.src} photo={photo} active={i === index} isFirst={i === 0} />
        ))}
      </div>

      <HeroOverlay heading={heading} text={text} cta={cta} />

      <ArrowButton direction="prev" onClick={prev} />
      <ArrowButton direction="next" onClick={next} />

      <HeroControls
        photos={photos}
        index={index}
        userPaused={userPaused}
        onSelect={goTo}
        onTogglePause={togglePause}
      />
    </section>
  );
}

