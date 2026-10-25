import Link from "next/link";
import Reveal from "./Reveal";

// * Introduction Text
const intro = {
  heading: "We tell stories worth keeping",
  text: "Write two or three sentences here about who you are and what you make. Keep it warm and plain.",
  button: { label: "View films", href: "/films" },
};


export default function IntroBlock() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center md:py-36">
      <Reveal>
        <h2 className="font-serif text-xl font-semibold leading-tight text-foreground md:text-4xl">{intro.heading}</h2>
        <p className="mx-auto mt-6 max-w-xl text-md leading-relaxed text-muted">{intro.text}</p>
        <Link
          href={intro.button.href}
          className="mt-10 inline-block rounded-full border border-foreground px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          {intro.button.label}
        </Link>
      </Reveal>
    </section>
  );
}