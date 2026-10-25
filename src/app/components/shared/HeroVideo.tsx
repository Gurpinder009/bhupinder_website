"use client";

import { useRef, useEffect } from "react";

const DRIFT = 15; // how far the video moves up, in screen-height percent (0 = pinned still)
const ZOOM = 0.06; // extra zoom by the end of the scroll (0 = no zoom)
const DIM = 0.3; // how dark it gets at the end, 0 to 1 (0 = no dimming)

export default function HeroVideo({ src, title = "Story Fella Films" }: { src: string; title?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const dim = dimRef.current;
    const heading = titleRef.current;
    if (!video || !dim || !heading) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const apply = () => {
      frame = 0;

      // * Normal scroll: the title moves up by exactly the number of pixels scrolled.
      //   This is real scrolling, not an effect, so it stays even with reduced motion.
      heading.style.transform = `translate3d(0, ${-window.scrollY}px, 0)`;

      if (mq.matches) {
        video.style.transform = "";
        dim.style.opacity = "0";
        return;
      }

      // * Progress runs 0 to 1 over the first screen of scrolling,
      //   which is how long the content takes to cover the video
      const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      video.style.transform = `translate3d(0, ${(-p * DRIFT).toFixed(2)}svh, 0) scale(${(1 + p * ZOOM).toFixed(4)})`;
      dim.style.opacity = (p * DIM).toFixed(3);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    // * Reduced motion: pause the video and skip the video effects
    const syncMotion = () => {
      if (mq.matches) video.pause();
      else video.play().catch(() => {}); // ? if autoplay is blocked, the black background stays visible
      apply();
    };

    syncMotion();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", syncMotion);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", syncMotion);
    };
  }, []);

  return (
    // ? overflow-hidden clips the taller video to the screen
    <section className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true" // ? decorative: the title below carries the meaning
        className="absolute left-0 top-0 w-full object-fill will-change-transform"
        // * The content slides up over the bottom of the video, so a height of 85 + DRIFT never shows a gap
        style={{ height: `${85 + DRIFT}svh` }}
      />

      {/* * Black layer that fades in as you scroll */}
      <div ref={dimRef} aria-hidden="true" className="absolute inset-0 bg-black opacity-0" />

      {/* * Centred title, above the dimming layer so it stays crisp */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        {/* ! This is the page's only h1 */}
        <h1
          ref={titleRef}
          className="text-center  font-serif text-[clamp(6.5rem,4.5vw,3.25rem)] font-semibold leading-none tracking-wide text-white will-change-transform [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]"
        >
          {title}
        </h1>
      </div>
    </section>
  );
}