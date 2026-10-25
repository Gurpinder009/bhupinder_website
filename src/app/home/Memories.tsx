import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

type Memory = { src: string; alt: string; ratio: "portrait" | "landscape" | "square" };

// * Tailwind needs the full class names written out, so they're mapped here
const ratioClass = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
} as const;

// TODO: replace with the real photos and write a real alt for each one
const memories: Memory[] = [
  { src: "/images/photos/satwinder-image4.jpeg", alt: "Describe this photo", ratio: "portrait" },
  { src: "/images/photos/satwinder-image7.jpeg", alt: "Describe this photo", ratio: "landscape" },
  { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe this photo", ratio: "portrait" },
  { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe this photo", ratio: "square" },
  { src: "/images/photos/satwinder-image11.jpeg", alt: "Describe this photo", ratio: "portrait" },
  { src: "/images/photos/satwinder-image3.jpeg", alt: "Describe this photo", ratio: "landscape" },
];

// ============================================================
// * COMPONENT: Memories
// * Staggered photo collage. The middle column sits lower on desktop.
// ============================================================

export default function Memories() {
  return (
    <section aria-labelledby="memories-title" className="mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-36">
      <SectionHeader
        id="memories-title"
        eyebrow="From the archive"
        title="Memories"
        accent="we keep"
        action={{ label: "Full gallery", href: "/gallery" }}
      />

      {/* * items-start so each photo keeps its own height. The offsets create the stagger */}
      <ul className="mt-12 grid grid-cols-2 items-start gap-3 md:mt-16 md:grid-cols-3 md:gap-6">
        {memories.map((m, i) => (
          <li key={`${m.src}-${i}`} className="max-md:[&:nth-child(even)]:mt-8 md:[&:nth-child(3n+2)]:mt-16">
            <Reveal delay={Math.min(i % 3, 2) * 90}>
              <figure className={`group relative overflow-hidden rounded-card bg-neutral-900 ${ratioClass[m.ratio]}`}>
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                />
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}