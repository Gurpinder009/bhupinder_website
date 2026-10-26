import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/app/components/shared/HomeSections";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

export const metadata = {
  title: "About",
  description: "Meet the photographer and filmmaker behind the work, and how we'll work together.",
};

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

// ? Generic steps. Edit them to match how he actually works and what he offers.
const steps = [
  { title: "Say hello", text: "Send a message with your date, place, and what you have in mind. A reply comes within a couple of days." },
  { title: "Plan together", text: "We talk through the day, the look you like, and the moments that matter most to you." },
  { title: "The shoot", text: "I stay close without getting in the way, so the day feels like yours and not a production." },
  { title: "Delivery", text: "You receive your photos and films in a private gallery, with the timing agreed up front." },
];

// ============================================================
// * COMPONENT: AboutHero
// * Static banner photo with the page title. No autoplay, no controls.
// ============================================================

function AboutHero() {
  return (
    <section className="relative h-[45svh] min-h-[500px] max-h-[660px] w-full overflow-hidden bg-ink">
      <Image
        // TODO: replace with a real banner photo
        src="/images/photos/satwinder-image11.jpeg"
        alt="Describe the banner photo"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      {/* ? Gradient keeps the white text readable on bright photos */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/20" />

      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-6xl px-6 pb-10 md:px-8 md:pb-14">
          {/* ! This is the page's only h1 */}
          <h1 className="font-serif text-4xl font-semibold text-white md:text-6xl">
            About <em className="font-normal italic">the work</em>
          </h1>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// * COMPONENT: StorySection
// * Mirror of the home intro: photo collage on the left, text on the right.
// ============================================================

function StorySection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
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
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span aria-hidden="true" className="h-px w-10 bg-primary" />
              {story.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl">
              {story.heading}
              <em className="mt-1 block font-normal italic text-primary">{story.accent}</em>
            </h2>
          </Reveal>

          <div className="mt-8 space-y-5">
            {story.paragraphs.map((p, i) => (
              <Reveal key={p} delay={200 + i * 100}>
                <p className={i === 0 ? "text-lg leading-relaxed text-foreground md:text-xl" : "leading-relaxed text-muted"}>
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// * COMPONENT: BeliefsSection
// * Three short principles in numbered cards.
// ============================================================

function BeliefsSection() {
  return (
    <section aria-labelledby="beliefs-title" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span aria-hidden="true" className="h-px w-10 bg-primary" />
            What I believe
          </p>
          <h2 id="beliefs-title" className="mt-5 max-w-2xl font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            Three ideas behind <em className="font-normal italic text-primary">every frame</em>
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {beliefs.map((b, i) => (
            <li key={b.title}>
              <Reveal delay={i * 120} className="h-full">
                <article className="h-full rounded-card border border-border bg-background p-8 shadow-card">
                  <span className="font-serif text-4xl font-semibold text-primary/40">0{i + 1}</span>
                  <h3 className="mt-4 font-serif text-2xl text-foreground">{b.title}</h3>
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
// * Vertical timeline: how a client works with him, step by step.
// ============================================================

function ProcessSection() {
  return (
    <section aria-labelledby="process-title" className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span aria-hidden="true" className="h-px w-10 bg-primary" />
            The process
          </p>
          <h2 id="process-title" className="mt-5 font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            How we&apos;ll <em className="font-normal italic text-primary">work together</em>
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed text-muted">
            A simple, relaxed path from first message to finished story.
          </p>
        </Reveal>

        <ol className="relative space-y-10 border-l border-border pl-8 md:pl-10">
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <Reveal delay={i * 100}>
                {/* * Numbered dot sits on the timeline line */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[3.3rem] top-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-serif text-lg text-primary-foreground md:-left-[3.8rem]"
                >
                  {i + 1}
                </span>
                <h3 className="font-serif text-2xl text-foreground">{s.title}</h3>
                <p className="mt-2 max-w-lg leading-relaxed text-muted">{s.text}</p>
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
// * One large line in the photographer's own words.
// ============================================================

function PullQuote() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Reveal>
        <figure className="mx-auto max-w-3xl px-6 text-center md:px-8">
          <span aria-hidden="true" className="font-serif text-6xl leading-none text-primary/40">&ldquo;</span>
          <blockquote className="font-serif text-2xl italic leading-snug text-foreground md:text-4xl">
            {/* TODO: a line in the photographer's own words. Do not invent a client testimonial. */}
            Write one sentence here that sums up how he sees his work.
          </blockquote>
          <figcaption className="mt-6 text-sm uppercase tracking-[0.2em] text-muted">Photographer&apos;s name</figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

// ============================================================
// * COMPONENT: CtaBand
// * Dark closing band with a single clear action.
// ============================================================

function CtaBand() {
  return (
    <section className="bg-ink py-20 text-center md:py-24">
      <Reveal>
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-serif text-3xl font-semibold text-cream md:text-5xl">
            Let&apos;s make something <em className="font-normal italic">worth keeping</em>
          </h2>
          <p className="mt-4 text-cream/80">Tell me about your day, your film, or your idea.</p>
          <Link
            href="/contact-me"
            className="mt-8 inline-block rounded-card bg-cream px-8 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white"
          >
            Get in touch
          </Link>
        </div>
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
    <Header/>
    <main>
      
      <StorySection />
      <BeliefsSection />
      <ProcessSection />
      <PullQuote />
      {/* <CtaBand /> */}
    </main>
    <Footer/>
    </>
  );
}

// TODO: add an "as seen in" row only with press mentions and awards the photographer has actually earned