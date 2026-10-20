import HeroSlider from "@/app/components/shared/HeroSlider";
import { FilmsSection, GallerySection, IntroSection } from "@/app/components/shared/HomeSections";

export const metadata = {
  title: "Photography and Films",
  description: "Photography and films for weddings, portraits, and the moments in between.",
};

// TODO: replace every alt with a real description of that photo
const heroPhotos = [
  { src: "/images/photos/satwinder-image4.jpeg", alt: "Describe photo 1" },
  { src: "/images/photos/satwinder-image7.jpeg", alt: "Describe photo 2" },
  { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe photo 3" },
];

const galleryPhotos = [
  { src: "/images/photos/satwinder-image4.jpeg", alt: "Describe photo 1", ratio: "portrait" },
  { src: "/images/photos/satwinder-image7.jpeg", alt: "Describe photo 2", ratio: "landscape" },
  { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe photo 3", ratio: "portrait" },
  { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe photo 4", ratio: "square" },
  { src: "/images/photos/satwinder-image11.jpeg", alt: "Describe photo 5", ratio: "portrait" },
  { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe photo 5", ratio: "portrait" },
  { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe photo 5", ratio: "portrait" },
  { src: "/images/photos/satwinder-image3.jpeg", alt: "Describe photo 5", ratio: "portrait" },

] as const;

// TODO: use the client's real YouTube or Vimeo video IDs and local poster images
const films = [
  {
    id: "film-one",
    title: "Film title one",
    description: "A short teaser line for this film goes here.",
    poster: "/images/photos/satwinder-image11.jpeg",
    videoSrc: "/sat.mp4",
  },
  {
    id: "film-two",
    title: "Film title two",
    description: "A short teaser line for this film goes here.",
    poster: "/images/films/film-two.jpg",
    videoSrc: "https://www.youtube-nocookie.com/embed/VIDEO_ID_TWO",
  },
  {
    id: "film-three",
    title: "Film title three",
    description: "A short teaser line for this film goes here.",
    poster: "/images/films/film-three.jpg",
    videoSrc: "https://www.youtube-nocookie.com/embed/VIDEO_ID_THREE",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSlider
        photos={heroPhotos}
        heading="Stories told in light"
        text="Photography and films for weddings, portraits, and the moments in between."
        cta={{ label: "View our work", href: "/films" }}
      />

      <IntroSection
        eyebrow="About"
        heading="Honest stories"
        accent="told with patience and light"
        paragraphs={[
          "Write two or three sentences here about the photographer's approach and what clients can expect.",
          "Add a second short paragraph about experience, style, or the kinds of days he loves to shoot.",
        ]}
        // TODO: replace with the photographer's real numbers, or delete the stats prop
        stats={[
          { value: "00", label: "Years behind the camera" },
          { value: "00", label: "Stories told" },
          { value: "00", label: "Cities shot in" },
        ]}
        cta={{ label: "More about me", href: "/about" }}
        mainPhoto={{ src: "/images/photos/satwinder-image11.jpeg", alt: "Describe this photo" }}
        secondaryPhoto={{ src: "/images/photos/satwinder-image9.jpeg", alt: "Describe this photo" }}
      />

      <GallerySection photos={[...galleryPhotos]} />

      <FilmsSection films={films} description={metadata.description} />
    </>
  );
}