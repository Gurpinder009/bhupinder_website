
"use client";

import { useEffect, useState } from "react";

type SplashScreenProps = {
  onComplete: () => void;
};

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

        window.setTimeout(() => {
          onComplete();
        }, 1200);
      }
    }, 110);

    return () => {
      window.clearInterval(typingInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="text-center px-6">
        <h1 className="font-serif text-4xl sm:text-6xl tracking-wide text-primary">
          {displayedText}
          <span className="ml-1 inline-block h-[0.9em] w-px animate-pulse bg-primary align-middle" />
        </h1>

        <p className="mt-5 text-xs sm:text-sm uppercase tracking-[0.4em] text-primary">
          Every story deserves a film
        </p>
      </div>
    </div>
  );
}
