"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ============================================================
// * CONFIG
// ============================================================

const navLinks = [
  { name: "Photography", href: "/home" },
  { name: "Films", href: "/films" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact Me", href: "/contact-me", cta: true },
] as const;

// * Routes that start with the HeroSlider. Header floats over the hero here.
const HERO_ROUTES = ["/", "/home","/contact-me"];

// ? How far (px) the page scrolls before the header turns solid
const SCROLL_THRESHOLD = 24;

// ============================================================
// * MAIN COMPONENT: Header
// ============================================================

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHeroPage = HERO_ROUTES.includes(pathname);

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

    // * Contact button: outlined over the hero, filled once the bar is solid
    if (cta) {
      return `${base} rounded-full  px-5 ${
        overHero
          ? "text-primary-foreground bg-primary hover:bg-leaf"
          : "border-primary bg-primary text-primary-foreground hover:bg-leaf"
      }`;
    }

    if (isActive(href)) {
      return `${base} underline decoration-2 underline-offset-8 ${overHero ? "text-white" : "text-primary"}`;
    }
    return `${base} ${overHero ? "text-white/85 hover:text-white" : "text-foreground/80 hover:text-primary"}`;
  };

  return (
    <header
      // ! fixed on the hero page so the hero can start at the top of the screen.
      // ! sticky elsewhere so the header keeps its own space and hides nothing.
      className={`${isHeroPage ? "fixed" : "sticky"} inset-x-0 top-0 z-50`}
    >
      {/* * Background layers: crossfade instead of snapping between styles */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 bg-linear-to-b from-black/50 to-transparent transition-opacity duration-300 ${
          overHero ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 border-b border-border bg-surface/95 backdrop-blur transition-opacity duration-300 ${
          overHero ? "opacity-0" : "opacity-100"
        }`}
      />

      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-8">
        <Link
          href="/home"
          className={`font-serif text-xl font-semibold tracking-tight transition-colors ${
            overHero ? "text-white" : "text-foreground"
          }`}
        >
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
          className={`rounded-md p-2 transition-colors md:hidden ${overHero ? "text-white" : "text-foreground"}`}
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

      {/* Mobile panel (header is forced solid while this is open) */}
      {open && (
        <ul id="mobile-menu" className="border-t border-border bg-background px-6 py-3 md:hidden">
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
    </header>
  );
}
