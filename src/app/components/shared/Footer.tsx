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

const linkClass = "text-muted transition-colors hover:text-white";

export default function Footer() {
  // const year = new Date().getFullYear();

  return (
    <footer className="surface-green border-t border-border z-10">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3 md:px-8">
        <div>
          <Link href="/home" className="font-serif text-xl font-semibold text-foreground">
            Filmy Stories
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted">Photography and films that tell your story.</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-serif text-base font-semibold text-foreground">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
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
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
            </li>
            {socialLinks.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {s.name}
                </a>
              </li>
            ))}
            <li>
              <Link href="/contact-me" className="font-medium text-gold hover:underline">
                Send a message
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-muted md:px-8">
          &copy; 2024 Filmy Stories. All rights reserved.
        </p>
      </div>
    </footer>
  );
}