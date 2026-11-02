import Link from "next/link";
import Script from "next/script";
import { createElement } from "react";

// ============================================================
// * CONTENT: placeholders. Replace with the photographer's real details
// ============================================================

// ! From your Behold dashboard (the feed-id in the embed code you pasted)
const BEHOLD_FEED_ID = "tTwssRoR6OhfuM7gBCHS";

// TODO: use the photographer's real Instagram handle
const INSTAGRAM_HANDLE = "bsaurav_";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`;

// ============================================================
// * COMPONENT: Logo
// * The wave mark with the name stacked beside it, like the reference's spaced-out wordmark.
// ============================================================

function Logo() {
  return (
    <Link href="/home" aria-label="Story Fella Films, home" className="group flex items-center gap-5">
      {/* * Same two waves as the splash screen */}
      <svg
        viewBox="0 0 64 64"
        width="64"
        height="64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0 text-gold transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none"
      >
        <path d="M11 26q7-8 14 0t14 0t14 0" />
        <path d="M11 40q7-8 14 0t14 0t14 0" />
      </svg>

      <span className="font-serif text-lg font-semibold uppercase leading-[1.6] tracking-[0.45em] text-foreground">
        Story
        <br />
        Fella
        <br />
        Films
      </span>
    </Link>
  );
}

// ============================================================
// * COMPONENT: InstagramFeed
// * Behold widget. Layout (row or grid, number of posts, gaps) is set in the Behold dashboard.
// * createElement is used because "behold-widget" is not a known JSX tag in TypeScript.
// ============================================================

function InstagramFeed() {
  return (
    <>
      {/* ? min-h reserves space, so the footer doesn't jump when the feed loads */}
      <div className="min-h-36 min-w-0">{createElement("behold-widget", { "feed-id": BEHOLD_FEED_ID })}</div>

      <Script id="behold-widget" src="https://w.behold.so/widget.js" type="module" strategy="afterInteractive" />
    </>
  );
}

// ============================================================
// * MAIN COMPONENT: Footer
// * Logo on the left, Instagram photos on the right, copyright line below.
// ============================================================

export default function Footer() {
  return (
    <footer className="surface-green z-10 border-t border-border">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:px-8 lg:grid-cols-[auto_1fr] lg:gap-16">
        <div>
          <Logo />
          {/* <p className="mt-5 max-w-xs text-sm text-muted">Photography and films that tell your story.</p> */}
        </div>

        <InstagramFeed />
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>&copy; 2026 StoryFellaFilms.com All rights reserved.</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            Follow @{INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    </footer>
  );
}