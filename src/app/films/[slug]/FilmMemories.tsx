"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/app/home/Reveal"; // ! adjust these two paths to where your files live
import SectionHeader from "@/app/home/SectionHeader";

type Memory = { src: string; alt: string };

// ============================================================
// * COMPONENT: Lightbox
// * Full-screen photo viewer on the native <dialog>.
// * Esc closes it, arrow keys and swipes change photo, clicking the dark area closes it.
// ============================================================

function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: Memory[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const photo = photos[index];

  // * Wraps around at both ends
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
        <div className="relative h-[82svh] w-full max-w-6xl">
          <Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-contain" priority />
        </div>

        <p aria-live="polite" className="absolute left-5 top-5 text-sm font-medium tracking-[0.2em] text-white/80">
          {index + 1} / {photos.length}
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
// * COMPONENT: FilmMemories
// * 2 columns on phones, 3 on tablets, 4 on desktop. Clicking a photo opens it full screen.
// ============================================================

export default function FilmMemories({ memories }: { memories: Memory[] }) {
  // ? null = viewer closed
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section aria-labelledby="memories-title" className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
      <SectionHeader id="memories-title" eyebrow="From the day" title="Memories" accent="we kept" />

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-14 md:gap-4 lg:grid-cols-4">
        {memories.map((memory, i) => (
          <li key={`${memory.src}-${i}`}>
            <Reveal delay={Math.min(i % 4, 3) * 70}>
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`View full screen: ${memory.alt}`}
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-card bg-border"
              >
                <Image
                  src={memory.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                />

                {/* * Hover and keyboard-focus cue with an expand icon */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-end justify-end bg-linear-to-t from-black/45 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span className="rounded-full bg-white/90 p-2 text-black">
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

      {openIndex !== null && (
        <Lightbox photos={memories} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      )}
    </section>
  );
}