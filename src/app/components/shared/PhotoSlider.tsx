"use client";

import Image from "next/image";
import { useRef, useState } from "react";

// ============================================================
// * TYPES
// ============================================================

export type Photo = {
  src: string; // path inside /public, e.g. "/images/photos/one.jpg"
  alt: string; // describe the photo for screen readers and SEO
};

// ============================================================
// * HOOK: useSlider
// * Owns the scroll track, the current index, and navigation.
// * The UI components below stay dumb and just receive props.
// ============================================================

function useSlider(count: number) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  // * Scroll the track so slide `i` is in view (clamped to a valid range)
  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(count - 1, i));
    // ? Respect users who ask their OS to reduce motion
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: next * el.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  };

  // * Keep `index` in sync when the user swipes or scrolls by hand
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  // * Left and right arrow keys move between slides when the track is focused
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goTo(index + 1);
    if (e.key === "ArrowLeft") goTo(index - 1);
  };

  return { trackRef, index, goTo, onScroll, onKeyDown };
}

// ============================================================
// * COMPONENT: ArrowIcon
// * Small inline SVG so we don't need an icon library.
// ============================================================

function ArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

// ============================================================
// * COMPONENT: SlideArrow
// * One round button, used for both previous and next.
// ============================================================

function SlideArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const position = direction === "prev" ? "left-3" : "right-3";

  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous photo" : "Next photo"}
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 ${position} rounded-full bg-background/80 p-3 text-foreground shadow-card backdrop-blur transition hover:bg-background disabled:pointer-events-none disabled:opacity-0`}
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}

// ============================================================
// * COMPONENT: Slide
// * A single photo inside the track.
// ============================================================

function Slide({
  photo,
  position,
  total,
  isFirst,
}: {
  photo: Photo;
  position: number; // 1-based, used in the screen reader label
  total: number;
  isFirst: boolean;
}) {
  return (
    <li
      role="group"
      aria-roledescription="slide"
      aria-label={`${position} of ${total}`}
      className="relative aspect-[3/2] w-full shrink-0 snap-center"
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(min-width: 1152px) 1152px, 100vw"
        className="object-cover"
        // ! Only the first image gets priority. Don't set it on the rest.
        priority={isFirst}
      />
    </li>
  );
}

// ============================================================
// * COMPONENT: SlideTrack
// * The scrollable row. Scroll-snap handles the swipe feel.
// ============================================================

function SlideTrack({
  photos,
  trackRef,
  onScroll,
  onKeyDown,
}: {
  photos: Photo[];
  trackRef: React.RefObject<HTMLUListElement | null>;
  onScroll: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <ul
      ref={trackRef}
      onScroll={onScroll}
      onKeyDown={onKeyDown}
      // ? tabIndex makes the track focusable so the arrow keys work
      tabIndex={0}
      className="flex snap-x snap-mandatory overflow-x-auto rounded-card scrollbar-none [&::-webkit-scrollbar]:hidden"
    >
      {photos.map((photo, i) => (
        <Slide key={photo.src} photo={photo} position={i + 1} total={photos.length} isFirst={i === 0} />
      ))}
    </ul>
  );
}

// ============================================================
// * COMPONENT: SlideDots
// * Row of dots showing and controlling the current slide.
// ============================================================

function SlideDots({
  photos,
  index,
  onSelect,
}: {
  photos: Photo[];
  index: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="mt-4 flex justify-center gap-2">
      {photos.map((photo, i) => (
        <button
          key={photo.src}
          type="button"
          aria-label={`Go to photo ${i + 1}`}
          aria-current={i === index}
          onClick={() => onSelect(i)}
          className={`h-2.5 rounded-full transition-all ${
            i === index ? "w-6 bg-primary" : "w-2.5 bg-border hover:bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

// ============================================================
// * MAIN COMPONENT: PhotoSlider
// * Only composes the pieces above. Use this one in your pages.
// ============================================================

export default function PhotoSlider({ photos }: { photos: Photo[] }) {
  const { trackRef, index, goTo, onScroll, onKeyDown } = useSlider(photos.length);

  // ? Nothing to show, so render nothing instead of an empty box
  if (photos.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Photo gallery"
      className="relative mx-auto w-full max-w-6xl"
    >
      <SlideTrack photos={photos} trackRef={trackRef} onScroll={onScroll} onKeyDown={onKeyDown} />

      <SlideArrow direction="prev" disabled={index === 0} onClick={() => goTo(index - 1)} />
      <SlideArrow direction="next" disabled={index === photos.length - 1} onClick={() => goTo(index + 1)} />

      <SlideDots photos={photos} index={index} onSelect={goTo} />
    </section>
  );
}
