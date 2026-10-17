"use client"
import Link from "next/link";

const exploreLinks = [
  { name: "Photography", href: "/home" },
  { name: "Films", href: "/films" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
] as const;

// TODO: replace with the photographer's real details
const CONTACT_EMAIL = "hello@example.com";
const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/" },
  { name: "YouTube", href: "https://youtube.com/" },
] as const;

export default function Footer() {
  // const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3 md:px-8">
        <div>
          <Link href="/home" className="font-serif text-xl font-semibold text-foreground">
            Filmy Stories
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Photography and films that tell your story.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-serif text-base font-semibold text-foreground">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted transition-colors hover:text-primary">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-serif text-base font-semibold text-foreground">Get in touch</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted transition-colors hover:text-primary">
                {CONTACT_EMAIL}
              </a>
            </li>
            {socialLinks.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-primary"
                >
                  {s.name}
                </a>
              </li>
            ))}
            <li>
              <Link href="/contact-me" className="font-medium text-primary hover:underline">
                Send a message
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-6 py-5 text-xs text-muted md:px-8">
          &copy; {2026} Filmy Stories. All rights reserved.
        </p>
      </div>
    </footer>
  );
}