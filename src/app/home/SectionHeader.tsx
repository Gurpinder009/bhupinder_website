import Link from "next/link";
import Reveal from "./Reveal";

// ============================================================
// * COMPONENT: SectionHeader
// * One header style for every list section: gold label, serif title,
// * gold italic accent, and an optional link on the right.
// ============================================================

export default function SectionHeader({
  id,
  eyebrow,
  title,
  accent,
  action,
}: {
  id: string; // ? matches aria-labelledby on the section
  eyebrow: string;
  title: string;
  accent: string;
  action?: { label: string; href: string };
}) {
  return (
    <Reveal>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            <span aria-hidden="true" className="h-px w-10 bg-gold/70" />
            {eyebrow}
          </p>
          <h2 id={id} className="mt-4 font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            {title} <em className="font-normal italic text-gold">{accent}</em>
          </h2>
        </div>

        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-all hover:gap-4"
          >
            {action.label}
            <span aria-hidden="true" className="text-gold">
              &rarr;
            </span>
          </Link>
        )}
      </div>
    </Reveal>
  );
}