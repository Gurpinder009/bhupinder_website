
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";


export type Tile = {
  id: string;
  name: string;
  description: string;
  meta?: string; // ? small line above the title, e.g. "Wedding film · 2026"
  image: string; // use wide (16:9) photos
  videoSrc: string; // full film, played in the pop-up
  previewSrc?: string; // ? short silent clip played on hover. Falls back to videoSrc
};

// TODO: replace with the real stories
const tiles: Tile[] = [
  {
    id: "one",
    name: "Story one",
    meta: "Wedding film · 2026",
    description: "Write two or three sentences here about this film: who it's about and what made the day special.",
    image: "/images/photos/satwinder-image4.jpeg",
    videoSrc: "/sat.mp4",
  },
  {
    id: "two",
    name: "Story two",
    meta: "Wedding film · 2026",
    description: "Write two or three sentences here about this film: who it's about and what made the day special.",
    image: "/images/photos/satwinder-image7.jpeg",
    videoSrc: "/sat.mp4",
  },
  {
    id: "three",
    name: "Story three",
    meta: "Portrait film · 2025",
    description: "Write two or three sentences here about this film: who it's about and what made the day special.",
    image: "/images/photos/satwinder-image8.jpeg",
    videoSrc: "/sat.mp4",
  },
];

// ============================================================
// * COMPONENT: TileMedia
// * The video side. Photo first, preview clip on hover, pop-up on click.
// * The preview file is only downloaded the first time it is hovered.
// ============================================================

function TileMedia({ tile, onOpen, flip }: { tile: Tile; onOpen: (tile: Tile) => void; flip: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [armed, setArmed] = useState(false); // ? true after the first hover, so the video file loads
  const [ready, setReady] = useState(false); // ? true once the video is playing, so it can fade in

  // * Play on hover or keyboard focus, stop and rewind when it ends
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !armed) return;
    if (hovered) {
      video.play().catch(() => {}); // ? if the browser blocks it, the photo simply stays
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [hovered, armed]);

  const start = () => {
    // ! Visitors who ask for reduced motion never get the moving preview
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    setHovered(true);
  };

  const stop = () => {
    setHovered(false);
    setReady(false);
  };

  return (
    <div className="relative">
      {/* * Offset gold outline. It flips to the other side on alternate rows */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 hidden rounded-card border border-gold/60 md:block ${
          flip ? "-translate-x-4 translate-y-4" : "translate-x-4 translate-y-4"
        }`}
      />

      <button
        type="button"
        onClick={() => onOpen(tile)}
        // * Mouse only: touch screens have no hover, so a tap goes straight to the pop-up
        onPointerEnter={(e) => e.pointerType === "mouse" && start()}
        onPointerLeave={stop}
        // * Keyboard focus plays it too. :focus-visible ignores mouse clicks
        onFocus={(e) => e.target.matches(":focus-visible") && start()}
        onBlur={stop}
        aria-label={`Play film: ${tile.name}`}
        className="group relative block aspect-video w-full overflow-hidden rounded-card bg-neutral-900 shadow-2xl shadow-black/40"
      >
        {/* * Photo and preview sit in one wrapper so they zoom together */}
        <span className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none">
          <Image src={tile.image} alt="" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />

          <video
            ref={videoRef}
            // ? No src until the first hover, so nothing downloads while the page loads
            src={armed ? (tile.previewSrc ?? tile.videoSrc) : undefined}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            onPlaying={() => setReady(true)}
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              ready && hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </span>

        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/50 via-black/5 to-transparent transition-opacity duration-500 group-hover:opacity-60"
        />

        {/* * Play button with a slow pulse ring */}
        <span aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/40 [animation-duration:2.5s] motion-reduce:animate-none" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-black transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none md:h-20 md:w-20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </button>
    </div>
  );
}

// ============================================================
// * COMPONENT: TileRow
// * Vertical list. Video on one side (wider), text on the other,
// * and the sides swap with every item.
// ============================================================

// ============================================================
// * COMPONENT: TileRow
// * Vertical list. Video on one side (wider), text on the other,
// * and the sides swap with every item.
// ============================================================

export default function TileRow({ onOpen }: { onOpen: (tile: Tile) => void }) {
  return (
    <section aria-labelledby="tiles-title" className="mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-36">
      <SectionHeader
        id="tiles-title"
        eyebrow="Selected work"
        title="Our latest"
        accent="stories"
        action={{ label: "All films", href: "/films" }}
      />

      <ul className="mt-6 divide-y divide-border md:mt-12">
        {tiles.map((tile, i) => {
          const reversed = i % 2 === 1; // ? odd items: video on the left, text on the right

          return (
            <li key={tile.id} className="grid items-center gap-10 py-14 md:grid-cols-12 md:gap-12 md:py-24">
              {/* ? On phones the video always comes first. From md up, order puts it on the chosen side */}
              <Reveal className={`md:col-span-7 ${reversed ? "md:order-1" : "md:order-2"}`}>
                <TileMedia tile={tile} onOpen={onOpen} flip={reversed} />
              </Reveal>

              <Reveal delay={150} className={`md:col-span-5 ${reversed ? "md:order-2" : "md:order-1"}`}>
                {/* * Big outlined number */}
                <p
                  aria-hidden="true"
                  className="font-serif text-7xl font-semibold leading-none text-transparent [-webkit-text-stroke:1px_var(--color-gold)] md:text-8xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>

                {tile.meta && (
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{tile.meta}</p>
                )}
                <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
                  {tile.name}
                </h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{tile.description}</p>

                <button
                  type="button"
                  onClick={() => onOpen(tile)}
                  className="group mt-8 inline-flex items-center gap-3 border-b border-gold pb-1 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-all hover:gap-5"
                >
                  Watch film
                  <span aria-hidden="true" className="text-gold">
                    &rarr;
                  </span>
                </button>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}