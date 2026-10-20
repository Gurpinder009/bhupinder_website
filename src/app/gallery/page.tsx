import Image from "next/image";
import { GalleryBrowser, type CategorizedPhoto } from "@/app/components/shared/HomeSections";

export const metadata = {
  title: "Gallery",
  description: "A selection of photographs, from weddings to portraits and everything in between.",
};

// ============================================================
// * CONTENT: placeholders. Replace with the photographer's real categories and photos
// ============================================================

// TODO: use the categories the photographer actually shoots
const categories = [
  { slug: "weddings", label: "Weddings" },
  { slug: "portraits", label: "Portraits" },
  { slug: "events", label: "Events" },
];

// ! Aim for a multiple of 8 photos per category, so the mosaic has no gaps at the end.
// ? Put the best wide shots at positions 1, 5, 9 (big tiles) and tall shots at 3, 7, 11 (tall tiles).
// TODO: write a real alt for every photo
const photos: CategorizedPhoto[] = [
  { src: "/images/photos/satwinder-image4.jpeg", alt: "Describe photo 1", category: "weddings" },
  { src: "/images/photos/satwinder-image7.jpeg", alt: "Describe photo 2", category: "weddings" },
  { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe photo 3", category: "portraits" },
  { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe photo 4", category: "portraits" },
  { src: "/images/photos/satwinder-image11.jpeg", alt: "Describe photo 5", category: "events" },
  { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe photo 6", category: "weddings" },
  { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe photo 7", category: "portraits" },
  { src: "/images/photos/satwinder-image3.jpeg", alt: "Describe photo 8", category: "events" },
];

// ============================================================
// * COMPONENT: GalleryHero
// * Static banner photo with the page title. No autoplay, no controls.
// ============================================================

function GalleryHero() {
  return (
    <section className="relative h-[45svh] min-h-[500px] max-h-[660px] w-full overflow-hidden bg-ink">
      <Image
        // TODO: replace with a real banner photo
        src="/images/photos/satwinder-image3.jpeg"
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
            The <em className="font-normal italic">gallery</em>
          </h1>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// * MAIN COMPONENT: GalleryPage
// ============================================================

export default function GalleryPage() {
  return (
    <main>
      <GalleryHero />
      <GalleryBrowser photos={photos} categories={categories} />
    </main>
  );
}