import Link from "next/link";
import Reveal from "./Reveal";

const EMAIL = "hello@example.com"; // TODO: the photographer's real address

// ============================================================
// * COMPONENT: ClosingCta
// * Last block before the footer. One clear action.
// ============================================================

export default function ClosingCta() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-4xl px-6 py-28 text-center md:py-44">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Let&apos;s talk</p>
        <h2 id="cta-title" className="mt-6 font-serif text-4xl font-semibold leading-[1.05] text-foreground md:text-7xl">
          Have a story <em className="font-normal italic text-gold">to tell?</em>
        </h2>

        <a
          href={`mailto:${EMAIL}`}
          className="mt-8 inline-block text-lg text-muted underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          {EMAIL}
        </a>

        <div className="mt-10">
          <Link
            href="/contact-me"
            className="inline-block rounded-full bg-primary px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-leaf"
          >
            Get in touch
          </Link>
        </div>
      </Reveal>
    </section>
  );
}