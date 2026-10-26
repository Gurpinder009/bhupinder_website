import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import FilmPlayer from "@/app/components/shared/FilmPlayer";
import { categoryLabels, films } from "@/app/components/shared/data/films";
import FilmMemories from "@/app/films/[slug]/FilmMemories";
import Reveal from "@/app/home/Reveal";
import Header from "@/app/components/shared/Header";
import Footer from "@/app/components/shared/Footer";

// ============================================================
// * STATIC ROUTES
// ============================================================

// ! With Cache Components, this must return at least one entry. An empty array fails the build.
export function generateStaticParams() {
  return films.map((f) => ({ slug: f.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const film = films.find((f) => f.slug === slug);
  return film ? { title: film.title, description: film.description } : {};
}

// ? timeZone UTC stops "2026-01-15" from shifting a day in some regions
const dateFormat = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "long", timeZone: "UTC" });

// ============================================================
// * PAGE
// * Header image > title + description > video > "Memories" photo grid.
// * Header and Footer are rendered here, so make sure the layout doesn't render them too.
// ============================================================

// * The exported page is sync. Everything async happens inside the Suspense boundary
export default function FilmPage({ params }: PageProps) {
  return (
    <Suspense fallback={<main aria-busy="true" className="min-h-svh bg-background" />}>
      <FilmContent params={params} />
    </Suspense>
  );
}

async function FilmContent({ params }: PageProps) {
  const { slug } = await params;
  const film = films.find((f) => f.slug === slug);
  if (!film) notFound();

  const memories = film.memories ?? [];

  return (
    <>
      <Header />
      <main>
        {/* ============ 1. Header image ============ */}
        <header className="relative h-[55svh] max-h-[620px] min-h-[380px] w-full overflow-hidden bg-[#051d1b]">
          <Image
            src={film.cover}
            alt="" // ? decorative: the title right below carries the meaning
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* ? Dark at the top so the floating header stays readable. The bottom is covered by the cream section */}
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-black/55 via-transparent to-black/25" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-5xl px-6 pb-20 md:px-8 md:pb-24">
              <Link
                href="/films"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-all hover:gap-3 hover:text-white"
              >
                <span aria-hidden="true">&larr;</span> All films
              </Link>
            </div>
          </div>
        </header>

        {/* ? -mt-10 / rounded top: the cream section overlaps the header image slightly, for a softer edge */}
        <div className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-background md:-mt-14">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            {/* ============ 2. Title + description ============ */}
            <section className="pb-10 pt-14 md:pb-14 md:pt-20">
              <Reveal>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  <span aria-hidden="true" className="h-px w-10 bg-primary/70" />
                  <span>{categoryLabels[film.category]}</span>
                  <span aria-hidden="true">&middot;</span>
                  <time dateTime={film.date} className="text-muted">
                    {dateFormat.format(new Date(film.date))}
                  </time>
                </p>

                {/* ! This is the page's only h1 */}
                <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-6xl">
                  {film.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl md:leading-relaxed">
                  {film.description}
                </p>
              </Reveal>
            </section>

            {/* ============ 3. Video ============ */}
            <section aria-label={`Watch ${film.title}`} className="pb-6 md:pb-10">
              <div className="relative">
                {/* * Offset outline behind the player, same as the home page stories */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 hidden translate-x-4 translate-y-4 rounded-card border md:block"
                />
                {/* ! No transform/animation wrapper around the player: it can break fullscreen controls */}
                <div className="relative overflow-hidden rounded-card bg-background">
                  <FilmPlayer videoSrc={film.videoSrc} poster=""/>
                </div>
              </div>
            </section>
          </div>

          {/* ============ 4. Memories ============ */}
          {memories.length > 0 && <FilmMemories memories={memories} />}
        </div>
      </main>

      <Footer />
    </>
  );
}