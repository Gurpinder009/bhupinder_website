"use client";

import { useState } from "react";
import Image from "next/image";

const categories = [
  { slug: "all", label: "All" },
  { slug: "classic-storytelling", label: "Classic Story Telling" },
  { slug: "new-age-modern", label: "New Age Modern" },
  { slug: "intimates", label: "Intimates" },
] as const;

type CategorySlug = (typeof categories)[number]["slug"];

const films: {
  slug: string;
  title: string;
  date: string; // ISO, e.g. "2024-05-01"
  description: string;
  image: string; // path inside /public
  category: Exclude<CategorySlug, "all">;
}[] = [
  {
    slug: "abc",
    title: "ABC",
    date: "2024-05-01",
    description: "Short description of the film.",
    image: "/images/films/abc.jpg",
    category: "classic-storytelling",
  },
];

export default function FilmsPage() {
  const [active, setActive] = useState<CategorySlug>("all");

  const visible = films
    .filter((f) => active === "all" || f.category === active)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main>
      <h1>Films</h1>

      <nav aria-label="Film categories">
        <ul>
          {categories.map((c) => (
            <li key={c.slug}>
              <button type="button" aria-pressed={active === c.slug} onClick={() => setActive(c.slug)}>
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {visible.length === 0 ? (
        <p>No films in this category yet.</p>
      ) : (
        <ul>
          {visible.map((f) => (
            <li key={f.slug}>
              <Image src={f.image} alt={f.title} width={640} height={360} />
              <h2>{f.title}</h2>
              <p>{f.description}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}