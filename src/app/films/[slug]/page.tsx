import Image from "next/image";
import { notFound } from "next/navigation";
import FilmPlayer from "@/app/components/shared/FilmPlayer";
import { films } from "@/app/components/shared/data/films";

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

// ============================================================
// * PAGE (follows the hand-drawn layout)
// Header image > title + description > video > "Memories" photo grid
// The footer comes from the shared layout, so it is not repeated here.
// ============================================================

export default async function FilmPage({ params }: PageProps) {
  const { slug } = await params;
  const film = films.find((f) => f.slug === slug);
  if (!film) notFound();

  const memories = film.memories ?? [];

  return (
    <main className=" text-neutral-100">
      {/* ============ 1. Header image ============ */}
      <header className="relative h-[45svh] min-h-[280px] w-full md:h-[60svh]">
        <Image
          src={film.cover}
          alt="" // ? decorative: the title right below carries the meaning
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </header>

      <div className="mx-auto max-w-5xl px-6 md:px-8">
        {/* ============ 2. Title + description ============ */}
        <section className="py-12 md:py-16">
          {/* ! This is the page's only h1 */}
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-ink md:text-6xl">
            {film.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed  text-ink md:text-xl md:leading-relaxed">
            {film.description}
          </p>
        </section>

        {/* ============ 3. Video ============ */}
        <section aria-label={`Watch ${film.title}`}>
          {/* ! No transform/animation wrapper around the player: it can break fullscreen controls */}
          <div className="overflow-hidden rounded-lg bg-black ring-1 ring-white/10">
            <FilmPlayer videoSrc={film.videoSrc} poster={""} />
          </div>
        </section>

        {/* ============ 4. Memories ============ */}
        {memories.length > 0 && (
          <section aria-labelledby="memories-title" className="py-12 md:py-16">
            <h2 id="memories-title" className="mb-6 font-serif text-2xl font-semibold text-ink md:text-3xl">
              Memories
            </h2>

            {/* ? 2 columns on mobile, 3 on tablet, 4 on desktop, as in the sketch */}
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {memories.map((memory, i) => (
                <li key={`${memory.src}-${i}`} className="relative aspect-[4/5] overflow-hidden rounded-md bg-neutral-900">
                  <Image
                    src={memory.src}
                    alt={memory.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}