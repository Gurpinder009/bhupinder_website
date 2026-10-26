
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ============================================================
// CONFIG
// ============================================================

const navLinks = [
  { name: "Home", href: "/home" },
  { name: "Films", href: "/films" },
  // { name: "Gallery", href: "/gallery" },
  // { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact Me", href: "/contact-me", cta: true },
] as const;

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/gurpinder_sg009/",
    icon: "instagram",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/YOUR_PAGE/",
    icon: "facebook",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@YOUR_CHANNEL",
    icon: "youtube",
  },
] as const;

const HERO_ROUTES = [
  "/",
  "/home",
  "/contact-me",
  "/films",
  "/about",
  "/gallery",
];

const HERO_PREFIXES = ["/films/"];
const SCROLL_THRESHOLD = 24;

// ============================================================
// SOCIAL ICON COMPONENT
// ============================================================

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
  const commonProps = {
    className: "h-5 w-5",
    "aria-hidden": true as const,
  };

  switch (icon) {
    case "instagram":
      return (
        <svg
          {...commonProps}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
      );

    case "facebook":
      return (
        <svg
          {...commonProps}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" />
        </svg>
      );

    case "youtube":
      return (
        <svg
          {...commonProps}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
        </svg>
      );
  }
}

// ============================================================
// MAIN COMPONENT: HEADER
// ============================================================

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHeroPage =
    HERO_ROUTES.includes(pathname) ||
    HERO_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  const overHero = isHeroPage && !scrolled && !open;

  // Track scroll position
  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > SCROLL_THRESHOLD);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu with Escape
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close mobile menu after navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = (href: string, cta?: boolean) => {
    const base =
      "rounded-md px-3 py-2 text-sm font-medium transition-colors";

    if (cta) {
      return `${base} rounded-full border border-white/60 px-5 text-white hover:bg-white hover:text-neutral-900`;
    }

    if (isActive(href)) {
      return `${base} text-white underline decoration-2 underline-offset-8`;
    }

    return `${base} text-white/80 hover:text-white`;
  };

  return (
    <header
      className={`${isHeroPage ? "fixed" : "sticky"} inset-x-0 top-0 z-50`}
    >
      {/* Dark fade over hero */}


      
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-linear-to-b from-black/50 to-transparent transition-opacity duration-300 ${
          overHero ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative mx-auto mt-3 w-[90%]">
        {/* Glass background */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl border border-white/20 bg-neutral-900/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xs backdrop-saturate-[1.2] transition-opacity duration-300 ${
            overHero ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="absolute inset-0 bg-linear-to-b from-white/15 via-transparent to-transparent" />
        </div>

        <nav
          aria-label="Main"
          className="flex h-16 items-center justify-between px-5 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] md:px-8"
        >
          {/* Logo */}
          <Link
            href="/home"
            className="font-serif text-xl font-semibold tracking-tight text-white capitalize"
          >
            STORY FELLA FILMS
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-4 md:flex">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={
                      isActive(link.href) ? "page" : undefined
                    }
                    className={linkClass(link.href, "cta" in link)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social media icons */}
            <div className="flex items-center gap-4 border-l border-white/20 pl-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="text-white/80 transition-colors hover:scale-110 hover:text-white"
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="rounded-md p-2 text-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <ul
            id="mobile-menu"
            className="border-t border-white/15 px-5 py-3 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] md:hidden"
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={
                    isActive(link.href) ? "page" : undefined
                  }
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-base ${linkClass(
                    link.href,
                    "cta" in link
                  )} ${
                    "cta" in link ? "mt-2 text-center" : ""
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {/* Mobile social media links */}
            <li className="mt-3 border-t border-white/15 pt-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/60">
                Follow Us
              </p>

              <div className="flex items-center gap-6 pb-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
                  >
                    <SocialIcon icon={social.icon} />
                    <span className="text-sm">{social.name}</span>
                  </a>
                ))}
              </div>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}
