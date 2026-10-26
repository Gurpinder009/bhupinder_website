"use client"

import Image from "next/image";
import Link from "next/link";
import Reveal from "../home/Reveal"; // ! adjust this path to wherever your Reveal.tsx lives
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";


// ============================================================
// * CONTENT: every word and photo below is a placeholder
// ============================================================

// TODO: replace with the photographer's real story, written in his own voice
const story = {
  eyebrow: "My story",
  heading: "Hello, I'm",
  accent: "the one behind the lens",
  paragraphs: [
    "Write the opening paragraph here: how he got started, and what first made him pick up a camera.",
    "Add a second paragraph about his style, what he looks for in a moment, and the kind of work he loves most.",
    "Close with something personal: where he's based, what he does off the clock, or why he stays in this work.",
  ],
};

// TODO: replace with the photographer's real beliefs (three short ones work best)
const beliefs = [
  { title: "Be present", text: "One or two sentences on how he stays in the moment instead of staging it." },
  { title: "Keep it honest", text: "One or two sentences on his approach to real emotion and natural light." },
  { title: "Make it last", text: "One or two sentences on delivering work that still feels right years later." },
];

// ? Generic steps. Edit them to match how he actually works. Only promise timings he can keep
const steps = [
  { title: "Say hello", text: "Send a message with your date, place, and what you have in mind." },
  { title: "Plan together", text: "We talk through the day, the look you like, and the moments that matter most to you." },
  { title: "The shoot", text: "I stay close without getting in the way, so the day feels like yours and not a production." },
  { title: "Delivery", text: "You receive your photos and films in a private gallery, with the timing agreed up front." },
];

// ============================================================
// * COMPONENT: Label
// * Small label with a line before it. `onDark` switches gold (dark bands) / teal (cream).
// ============================================================

function Label({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p
      className={`flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] ${
        onDark ? "text-gold" : "text-primary"
      }`}
    >
      <span aria-hidden="true" className={`h-px w-10 ${onDark ? "bg-gold/70" : "bg-primary/70"}`} />
      {children}
    </p>
  );
}

// ============================================================
// * COMPONENT: AboutHero
// * Static banner photo on a dark wash. Gold works here because the background is dark.
// ============================================================

function AboutHero() {
  return (
    <section className="relative h-[60svh] min-h-[460px] max-h-[640px] w-full overflow-hidden bg-[#051d1b]">
      <Image
        // TODO: replace with a real banner photo
        src="/images/photos/satwinder-image11.jpeg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      {/* ? Dark green wash keeps the white text readable on bright photos */}
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#051d1b] via-[#051d1b]/50 to-black/30" />

      <div className="absolute inset-0 flex items-end">
        {/* ? pb-24 leaves room for the cream section below, which overlaps the hero a little */}
        <div className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8 md:pb-32">
          <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#d8b45a]">
            <span aria-hidden="true" className="h-px w-10 bg-[#d8b45a]/70" />
            About
          </p>

          {/* ! This is the page's only h1 */}
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
            The people <em className="font-normal italic text-[#d8b45a]">behind the lens</em>
          </h1>

          {/* TODO: write your own line */}
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            A short line about who you are and what you care about.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// * COMPONENT: StorySection
// * Photo collage on the left, text on the right. Cream background.
// ============================================================

function StorySection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* ---------- Photo collage (second on phones, first on desktop) ---------- */}
        <Reveal className="order-2 lg:order-1">
          <div className="relative mx-auto w-full max-w-md pb-14 lg:max-w-none">
            <div className="relative aspect-[4/5] w-[78%]">
              <div
                aria-hidden="true"
                className="absolute -left-3 -top-3 h-full w-full rounded-t-[999px] border border-primary/40"
              />
              <div className="relative h-full w-full overflow-hidden rounded-t-[999px] bg-border">
                <Image
                  // TODO: a portrait of the photographer works well here
                  src="/images/photos/satwinder-image8.jpeg"
                  alt="Portrait of the photographer"
                  fill
                  sizes="(min-width: 1024px) 35vw, 70vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute bottom-0 right-0 z-10 aspect-[3/4] w-[46%] overflow-hidden rounded-card border-8 border-background bg-border shadow-card">
              <Image
                src="/images/photos/satwinder-image3.jpeg"
                alt="Describe this photo"
                fill
                sizes="(min-width: 1024px) 18vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        {/* ---------- Text ---------- */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <Label>{story.eyebrow}</Label>
            <h2 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl md:text-6xl">
              {story.heading}
              <em className="mt-1 block font-normal italic text-primary">{story.accent}</em>
            </h2>
          </Reveal>

          <div className="mt-8 space-y-5">
            {story.paragraphs.map((p, i) => (
              <Reveal key={p} delay={150 + i * 100}>
                <p className={i === 0 ? "text-xl leading-relaxed text-foreground md:text-2xl" : "text-lg leading-relaxed text-muted"}>
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={450}>
            <Link
              href="/films"
              className="mt-10 inline-flex items-center gap-3 border-b border-primary pb-1 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-all hover:gap-5"
            >
              See the films <span className="text-primary">&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// * COMPONENT: BeliefsSection
// * Green gradient band: three principles in glass panels, with big outlined numbers.
// ============================================================

function BeliefsSection() {
  return (
    <section aria-labelledby="beliefs-title" className="bg-background-darker py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <Label onDark>What I believe</Label>
          <h2 id="beliefs-title" className="mt-5 max-w-2xl font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            Three ideas behind <em className="font-normal italic text-gold">every frame</em>
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3">
          {beliefs.map((b, i) => (
            <li key={b.title}>
              <Reveal delay={i * 120} className="h-full">
                {/* ? Inside surface-green, bg-surface and border-border turn into translucent white */}
                <article className="h-full rounded-card border border-border bg-background p-8 backdrop-blur-sm md:p-10">
                  <p
                    aria-hidden="true"
                    className="font-serif text-6xl font-semibold leading-none text-transparent [-webkit-text-stroke:1px_var(--color-gold)]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-8 font-serif text-2xl font-semibold text-foreground md:text-3xl">{b.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{b.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ============================================================
// * COMPONENT: ProcessSection
// * Vertical timeline on cream. The heading stays in view while you scroll the steps.
// ============================================================

function ProcessSection() {
  return (
    <section aria-labelledby="process-title" className="mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-36">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        {/* ? Sticky on the outer div: a transform on a sticky element can break it, and Reveal uses one */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Label>The process</Label>
            <h2 id="process-title" className="mt-5 font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
              How we&apos;ll <em className="font-normal italic text-primary">work together</em>
            </h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-muted">
              A simple, relaxed path from first message to finished story.
            </p>
          </Reveal>
        </div>

        <ol className="relative ml-5 border-l border-border">
          {steps.map((s, i) => (
            <li key={s.title} className="relative pb-14 pl-10 last:pb-0 md:pl-14">
              {/* * Numbered dot sits centred on the timeline line */}
              <span
                aria-hidden="true"
                className="absolute -left-5 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-serif text-lg text-primary-foreground ring-8 ring-background"
              >
                {i + 1}
              </span>
              <Reveal delay={i * 100}>
                <h3 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">{s.title}</h3>
                <p className="mt-3 max-w-lg text-lg leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ============================================================
// * COMPONENT: PullQuote
// * One large line in the photographer's own words, framed by thin lines.
// ============================================================

function PullQuote() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-24 md:px-8 md:pb-36">
      <Reveal>
        <figure className="border-y border-border py-16 text-center md:py-24">
          <span aria-hidden="true" className="block font-serif text-7xl leading-none text-primary/40">
            &ldquo;
          </span>
          <blockquote className="font-serif text-2xl italic leading-snug text-foreground md:text-4xl">
            {/* TODO: a line in the photographer's own words. Do not invent a client testimonial. */}
            Write one sentence here that sums up how he sees his work.
          </blockquote>
          <figcaption className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
            Photographer&apos;s name
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

// ============================================================
// * COMPONENT: ClosingCta
// * Green band with one clear action. It flows straight into the deep-green footer.
// ============================================================

function ClosingCta() {
  return (
    <section aria-labelledby="about-cta-title" className="bg-background-darker px-6 py-28 text-center md:py-44">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Let&apos;s talk</p>
        <h2 id="about-cta-title" className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-semibold leading-[1.05] text-foreground md:text-7xl">
          Let&apos;s make something <em className="font-normal italic text-gold">worth keeping</em>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted">Tell me about your day, your film, or your idea.</p>
        <Link
          href="/contact-me"
          className="mt-10 inline-block rounded-full bg-primary px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-leaf"
        >
          Get in touch
        </Link>
      </Reveal>
    </section>
  );
}

// ============================================================
// * MAIN COMPONENT: AboutPage
// ============================================================

export default function AboutPage() {
  return (
    <>
      {/* ! Keep Header and Footer in ONE place only: here, or in layout.tsx, not both */}
      <Header />
      <main>
        <AboutHero />

        {/* ? -mt-10 / rounded top: the cream section overlaps the hero slightly, for a softer edge */}
        <div className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-background md:-mt-14">
          <StorySection />
        </div>

        <BeliefsSection />

        <div className="bg-background">
          <ProcessSection />
          <PullQuote />
        </div>

        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}

// TODO: add an "as seen in" row only with press mentions and awards the photographer has actually earned