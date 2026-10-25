import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

// TODO: replace with what the photographer really offers. Don't add prices here
const services = [
  { title: "Weddings", text: "One or two sentences about how you cover a wedding day, start to finish." },
  { title: "Portraits", text: "One or two sentences about portrait sessions: where, how long, what clients get." },
  { title: "Films", text: "One or two sentences about the films you make and what they feel like to watch." },
];

// ============================================================
// * COMPONENT: Services
// * Three columns separated by hairlines. Stacks on phones.
// ============================================================

export default function Services() {
  return (
    <section aria-labelledby="services-title" className="mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-36">
      <SectionHeader
        id="services-title"
        eyebrow="What we do"
        title="Made for"
        accent="the moments"
        action={{ label: "Contact Me", href: "/contact-me" }}
      />

      <ul className="mt-12 grid divide-y divide-border border-y border-border md:mt-16 md:grid-cols-3 md:divide-x md:divide-y-0">
        {services.map((s, i) => (
          <li key={s.title} className="py-10 md:px-8 md:first:pl-0 md:last:pr-0">
            <Reveal delay={i * 100}>
              <p className="font-serif text-lg text-gold">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-serif text-2xl font-semibold text-foreground md:text-3xl">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}