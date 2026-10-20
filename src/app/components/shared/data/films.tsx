export type FilmCategory = "classic-storytelling" | "new-age-modern" | "intimates";

export const categoryLabels: Record<FilmCategory, string> = {
  "classic-storytelling": "Classic Story Telling",
  "new-age-modern": "New Age Modern",
  intimates: "Intimates",
};

export type Memory = { src: string; alt: string };

export type Film = {
  slug: string; // ! must be unique. It becomes the URL: /films/<slug>
  title: string;
  date: string; // ISO, e.g. "2026-01-15"
  category: FilmCategory;
  description: string; // shown under the title on the detail page, on cards, and as the meta description
  image: string; // card thumbnail, also the video poster (16:9 or 3:2 works best)
  cover: string; // wide header image for the detail page
  videoSrc: string; // .mp4 URL, or an .m3u8 HLS stream
  memories?: Memory[]; // ? photos shown in the "Memories" grid. Leave out to hide the section
};

// TODO: replace with the client's real films. Don't invent names, places, or details.
// ? Categories below are guesses, so you can test the filter. Change them to match.
// ? Memory photos below reuse the sample images. Replace them with real photos from each film.
export const films: Film[] = [
  {
    slug: "film-one",
    title: "Client One and Partner, City",
    date: "2026-01-15",
    category: "classic-storytelling",
    description: "A short two or three line teaser for this film goes here.",
    image: "/images/photos/satwinder-image9.jpeg",
    cover: "/images/photos/satwinder-image9.jpeg",
    videoSrc: "/sat.mp4",
    memories: [
      { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image11.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe this photo" },
    ],
  },
  {
    slug: "film-two",
    title: "Client Two and Partner, City",
    date: "2026-01-10",
    category: "new-age-modern",
    description: "A short two or three line teaser for this film goes here.",
    image: "/images/photos/satwinder-image11.jpeg",
    cover: "/images/photos/satwinder-image11.jpeg",
    videoSrc: "/sat.mp4",
    memories: [
      { src: "/images/photos/satwinder-image11.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image11.jpeg", alt: "Describe this photo" },
    ],
  },
  {
    slug: "film-three",
    title: "Client Three and Partner, City",
    date: "2026-01-09",
    category: "new-age-modern",
    description: "A short two or three line teaser for this film goes here.",
    image: "/images/photos/satwinder-image8.jpeg",
    cover: "/images/photos/satwinder-image8.jpeg",
    videoSrc: "/sat.mp4",
    memories: [
      { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image11.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe this photo" },
    ],
  },
  {
    slug: "film-four",
    title: "Client Four and Partner, City",
    date: "2026-01-07",
    category: "classic-storytelling",
    description: "A short two or three line teaser for this film goes here.",
    image: "/images/photos/satwinder-image9.jpeg",
    cover: "/images/photos/satwinder-image9.jpeg",
    videoSrc: "/sat.mp4",
    memories: [
      { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image11.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe this photo" },
    ],
  },
  {
    slug: "film-five",
    title: "Client Five and Partner, City",
    date: "2025-12-26",
    category: "intimates",
    description: "A short two or three line teaser for this film goes here.",
    image: "/images/photos/satwinder-image11.jpeg",
    cover: "/images/photos/satwinder-image11.jpeg",
    videoSrc: "/sat.mp4",
    memories: [
      { src: "/images/photos/satwinder-image11.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image11.jpeg", alt: "Describe this photo" },
    ],
  },
  {
    slug: "film-six",
    title: "Client Six and Partner, City",
    date: "2025-12-10",
    category: "classic-storytelling",
    description: "A short two or three line teaser for this film goes here.",
    image: "/images/photos/satwinder-image8.jpeg",
    cover: "/images/photos/satwinder-image8.jpeg",
    videoSrc: "/sat.mp4",
    memories: [
      { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image9.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image11.jpeg", alt: "Describe this photo" },
      { src: "/images/photos/satwinder-image8.jpeg", alt: "Describe this photo" },
    ],
  },
];