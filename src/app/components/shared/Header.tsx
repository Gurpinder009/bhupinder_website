"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ============================================================
// * CONFIG
// ============================================================

const navLinks = [
 
  { name: "Films", href: "/films" },
   { name: "Gallery", href: "/gallery" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact Me", href: "/contact-me", cta: true },
] as const;
// * Pages that start with a hero image. Header floats over the hero here.
const HERO_ROUTES = ["/", "/home", "/contact-me", "/films", "/about", "/gallery"]; // exact matches
const HERO_PREFIXES = ["/films/"]; // every page under these, e.g. /films/film-one
// ? How far (px) the page scrolls before the header turns solid
const SCROLL_THRESHOLD = 24;

// ============================================================
// * MAIN COMPONENT: Header
// ============================================================

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

const isHeroPage =
  HERO_ROUTES.includes(pathname) || HERO_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // * Transparent only on the hero page, at the very top, with the mobile menu closed
  const overHero = isHeroPage && !scrolled && !open;

  // * Track scroll position (React skips re-renders unless the value flips)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll(); // ? covers pages restored mid-scroll on reload
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // * Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // * Close the mobile menu after navigating
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // ============================================================
  // * STYLES
  // ============================================================

const linkClass = (href: string, cta?: boolean) => {
  const base = "rounded-md px-3 py-2 text-sm font-medium transition-colors";

  // * Contact button: outlined, fills white on hover
  if (cta) {
    return `${base} rounded-full border border-white/60 px-5 text-white hover:bg-white hover:text-neutral-900`;
  }
  if (isActive(href)) return `${base} text-white underline decoration-2 underline-offset-8`;
  return `${base} text-white/80 hover:text-white`;
};

  return (
   <header
  // ! fixed on the hero page so the hero can start at the top of the screen.
  // ! sticky elsewhere so the header keeps its own space and hides nothing.
  className={`${isHeroPage ? "fixed" : "sticky"} inset-x-0 top-0 z-50`}
>
  {/* * Dark fade at the very top, only while over the hero video */}
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-linear-to-b from-black/50 to-transparent transition-opacity duration-300 ${
      overHero ? "opacity-100" : "opacity-0"
    }`}
  />

  {/* * 90% wide, centred. mt-3 is the gap that lets it float. */}
  <div className="relative mx-auto mt-3 w-[90%]">
    {/* * Liquid glass. Fades in once you scroll. It also covers the mobile menu when it opens */}
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl border border-white/20 bg-neutral-900/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xs backdrop-saturate-[1.2] transition-opacity duration-300 ${
        overHero ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* ? Soft highlight along the top, like light catching the glass */}
      <div className="absolute inset-0 bg-linear-to-b from-white/15 via-transparent to-transparent" />
    </div>

    {/* ? The text shadow keeps the white text readable when something bright scrolls underneath */}
    <nav
      aria-label="Main"
      className="flex h-16 items-center justify-between px-5 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] md:px-8"
    >
      <Link href="/home" className="font-serif text-xl font-semibold tracking-tight text-white">
        Filmy Stories
      </Link>

      {/* Desktop links */}
      <ul className="hidden items-center gap-1 md:flex">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={linkClass(link.href, "cta" in link)}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile menu button */}
      <button
        type="button"
        className="rounded-md p-2 text-white md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
    </nav>

    {/* Mobile panel: sits on the same glass, which grows to cover it */}
    {open && (
      <ul
        id="mobile-menu"
        className="border-t border-white/15 px-5 py-3 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] md:hidden"
      >
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`block py-3 text-base ${linkClass(link.href, "cta" in link)} ${
                "cta" in link ? "mt-2 text-center" : ""
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
</header>
  );
}
