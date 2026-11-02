
"use client";

import { useEffect, useState } from "react";

type SplashScreenProps = {
  onComplete: () => void;
};

function SplashIcon() {
  return (
    <>
      <style>{`
        .si-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: si-draw 0.9s ease-out forwards;
        }
        .si-ray { animation-duration: 0.4s; }

        /* * Sun and cloud shrink and fade as the waves take over */
        .si-scene {
          transform-origin: 32px 32px;
          animation: si-out 0.7s ease-in 1.7s forwards;
        }

        @keyframes si-draw { to { stroke-dashoffset: 0; } }
        @keyframes si-out  { to { opacity: 0; transform: scale(0.6); } }

        /* ? Reduced motion: skip the story and show the final waves */
        @media (prefers-reduced-motion: reduce) {
          .si-scene { display: none; }
          .si-draw { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>

      {/* ? text-primary suits the cream splash. On a dark splash, switch to text-gold */}
      <svg
        viewBox="0 0 64 64"
        width="96"
        height="96"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="mx-auto mb-8 text-primary sm:h-28 sm:w-28"
      >
        {/* ---------- Scene 1: sun behind a cloud ---------- */}
        <g className="si-scene">
          {/* Sun rays pop in first, each slightly later than the last */}
          <path pathLength="1" className="si-draw si-ray" style={{ animationDelay: "0s" }} d="M32 6v6" />
          <path pathLength="1" className="si-draw si-ray" style={{ animationDelay: "0.08s" }} d="M18 11l3 5" />
          <path pathLength="1" className="si-draw si-ray" style={{ animationDelay: "0.16s" }} d="M46 11l-3 5" />
          <path pathLength="1" className="si-draw si-ray" style={{ animationDelay: "0.24s" }} d="M9 24l6 2" />
          <path pathLength="1" className="si-draw si-ray" style={{ animationDelay: "0.32s" }} d="M55 24l-6 2" />

          {/* Half sun, then the cloud in front of it */}
          <path pathLength="1" className="si-draw" style={{ animationDelay: "0.3s" }} d="M22 31a10 10 0 0 1 20 0" />
          <path pathLength="1" className="si-draw" style={{ animationDelay: "0.55s" }} d="M18 50h26a8 8 0 0 0 1-15.9A11 11 0 0 0 24 32a9 9 0 0 0-6 18z" />
        </g>

        {/* ---------- Scene 2: two waves, drawn after the scene shrinks ---------- */}
        <path pathLength="1" className="si-draw" style={{ animationDelay: "2.0s" }} d="M11 26q7-8 14 0t14 0t14 0" />
        <path pathLength="1" className="si-draw" style={{ animationDelay: "2.25s" }} d="M11 40q7-8 14 0t14 0t14 0" />
      </svg>
    </>
  );
}

// ============================================================
// * MAIN COMPONENT: SplashScreen
// ============================================================

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const text = "STORY FELLA FILMS";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;

    const typingInterval = window.setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(typingInterval);

        // ? Hold long enough for the waves to finish drawing (about 3.1s in total)
        window.setTimeout(() => {
          onComplete();
        }, 1500);
      }
    }, 110);

    return () => {
      window.clearInterval(typingInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="px-6 text-center">
        <SplashIcon />

        <h1 className="font-serif text-4xl tracking-wide text-primary sm:text-6xl">
          {displayedText}
          <span className="ml-1 inline-block h-[0.9em] w-px animate-pulse bg-primary align-middle" />
        </h1>

        <p className="mt-5 text-xs uppercase tracking-[0.4em] text-primary sm:text-sm">
          Where Moments Become Stories
        </p>
      </div>
    </div>
  );
}