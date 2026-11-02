"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import Reveal from "../home/Reveal"; // ! adjust this path to wherever your Reveal.tsx lives
import { site } from "@/app/components/shared/data/site";

// ============================================================
// * CONTENT: contact details live in data/site.ts
// ============================================================

// TODO: your event link from Calendly (Event Types -> your event -> Copy link)
// ! This still points at a personal account. Use the photographer's own link
const CALENDLY_URL = "https://calendly.com/singh9464274057/30min";

// ! Placeholders only. Don't state prices, deposits, or turnaround times
//   unless the photographer has confirmed them
const faqs = [
  { q: "How do I book?", a: "Write a short answer here about the steps from first message to a confirmed date." },
  { q: "How far ahead should I get in touch?", a: "Write a short answer here about how early people usually reach out." },
  { q: "Do you travel?", a: "Write a short answer here about where you work and how travel is handled." },
  { q: "What will I receive?", a: "Write a short answer here about what the finished photos and films look like." },
  { q: "When will I see the finished work?", a: "Write a short answer here about the usual timeline, and only what you can keep to." },
];

// ============================================================
// * TYPES
// ============================================================

type FormValues = {
  name: string;
  email: string;
  eventDates: string;
  venue: string;
  source: string;
  message: string;
  website?: string; // ? honeypot: real people never see this field
};

type Status = "idle" | "success" | "error";

// ? What we hand to Calendly after a successful send, so the visitor doesn't retype it
type Booking = { name: string; email: string; eventDates: string; venue: string };

// ? Tells TypeScript about the object Calendly's script adds to the page
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: { name?: string; email?: string; customAnswers?: Record<string, string> };
      }) => void;
    };
  }
}

// ============================================================
// * FORM STYLES
// ============================================================

// * Underline-only input. "peer" + placeholder=" " are what drive the floating label
const lineClass =
  "peer block w-full border-0 border-b border-border bg-transparent px-0 pb-2 pt-6 text-foreground " +
  "placeholder-transparent transition focus:border-primary focus:shadow-[0_1px_0_0_var(--color-primary)] " +
  "focus:outline-none focus:ring-0 aria-[invalid=true]:border-accent";

// * The label sits where the text goes, then floats up when the field is focused or filled
const labelClass =
  "pointer-events-none absolute left-0 top-6 origin-left text-base text-muted transition-all duration-200 " +
  "peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-primary " +
  "peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:scale-75";

// ============================================================
// * COMPONENT: Label
// * Small label with a line before it. `onDark` switches gold (dark bands) / teal (cream).
// ============================================================

function Label({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p
      className={`flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] ${
        onDark ? "text-gold" : "text-primary"
      }`}
    >
      <span aria-hidden="true" className={`h-px w-10 ${onDark ? "bg-gold/70" : "bg-primary/70"}`} />
      {children}
    </p>
  );
}

// ============================================================
// * COMPONENT: ContactHero
// * Static banner photo on a dark wash. Gold works here because the background is dark.
// ============================================================

function ContactHero() {
  return (
    <section className="relative h-[60svh] min-h-[460px] max-h-[640px] w-full overflow-hidden bg-[#051d1b]">
      <Image
        // TODO: replace with the photographer's real banner photo
        src="/images/photos/satwinder-image9.jpeg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-bottom"
        priority
      />

      {/* ? Dark green wash keeps the white text readable on bright photos */}
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#051d1b] via-[#051d1b]/50 to-black/30" />

      <div className="absolute inset-0 flex items-end">
        {/* ? pb-24 leaves room for the cream section below, which overlaps the hero a little */}
        <div className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8 md:pb-32">
          <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#d8b45a]">
            <span aria-hidden="true" className="h-px w-10 bg-[#d8b45a]/70" />
            Inquire
          </p>

          {/* ! This is the page's only h1 */}
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
            Start the <em className="font-normal italic text-[#d8b45a]">conversation</em>
          </h1>

          {/* TODO: write your own line, and only promise a reply time you can keep */}
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            Tell us about your day, your film, or your idea.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// * COMPONENT: Line
// * Wraps one underline field: the control, its floating label, and the error.
// * The control inside must use lineClass and placeholder=" ".
// ============================================================

function Line({
  id,
  label,
  required = false,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <div className="relative">
        {children}
        <label htmlFor={id} className={labelClass}>
          {label}
          {required && <span aria-hidden="true">*</span>}
        </label>
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

// ============================================================
// * COMPONENT: CalendlyInline
// * Loads Calendly's script only when this panel appears, then embeds the calendar.
// ============================================================

function CalendlyInline({ prefill }: { prefill: Booking }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // * The script may already be on the page (a second inquiry in the same visit)
  useEffect(() => {
    if (window.Calendly) setReady(true);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!ready || !el || !window.Calendly) return;

    el.innerHTML = ""; // ? React StrictMode runs effects twice in dev. This stops a double embed
    window.Calendly.initInlineWidget({
      url: CALENDLY_URL,
      parentElement: el,
      prefill: {
        name: prefill.name,
        email: prefill.email,
        // ! a1, a2 = your Calendly custom questions, in the order they appear in the event settings
        customAnswers: { a1: prefill.eventDates, a2: prefill.venue },
      },
    });
    return () => {
      el.innerHTML = "";
    };
  }, [ready, prefill]);

  return (
    <>
      <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" precedence="default" />
      {/* ? onReady fires on every mount, onLoad only the first time */}
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" onReady={() => setReady(true)} />

      <div className="relative">
        {!ready && <p className="absolute inset-0 grid place-items-center text-sm text-muted">Loading calendar...</p>}
        <div ref={containerRef} className="h-[780px] min-w-[320px] sm:h-[700px]" />
      </div>
    </>
  );
}

// ============================================================
// * COMPONENT: ThankYou
// * Replaces the form after a successful send. If we have the visitor's details,
// * the Calendly calendar appears below so they can pick a time.
// ============================================================

function ThankYou({ booking, onReset }: { booking: Booking | null; onReset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div>
      <div role="status" className="rounded-card border border-border bg-surface px-8 py-12 text-center shadow-card">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12l5 5 9-10" />
          </svg>
        </span>
        <h2 ref={headingRef} tabIndex={-1} className="mt-6 font-serif text-3xl font-semibold text-foreground outline-none md:text-4xl">
          Thank you
        </h2>
        {/* TODO: only promise a reply time the photographer can keep */}
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-muted">
          {booking
            ? "Your message is in. If you'd like to talk it through, pick a time below."
            : "Your message is in. We'll read it carefully and reply by email."}
        </p>
      </div>

      {booking && (
        <section aria-labelledby="book-title" className="mt-8 rounded-card border border-border bg-surface p-2 shadow-card md:p-4">
          <h3 id="book-title" className="px-4 pt-4 font-serif text-2xl font-semibold text-foreground">
            Pick a time
          </h3>
          <p className="px-4 pb-2 text-sm text-muted">Optional. If none of these suit you, we&apos;ll reply by email.</p>
          <CalendlyInline prefill={booking} />
        </section>
      )}

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onReset}
          className="border-b border-primary pb-1 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary"
        >
          Send another inquiry
        </button>
      </div>
    </div>
  );
}

// ============================================================
// * COMPONENT: ContactForm
// * All form state and submission live here.
// ============================================================

function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [status, setStatus] = useState<Status>("idle");
  const [booking, setBooking] = useState<Booking | null>(null); // ? set only after a real send

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setStatus("idle");

    // * Honeypot: a bot filled the hidden field, so pretend it worked and send nothing
    if (data.website) {
      setBooking(null); // ! never show the calendar to a bot
      setStatus("success");
      reset();
      return;
    }

    // ! Fails loudly in dev if you forgot the env variable
    const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
    if (!endpoint) {
      console.error("NEXT_PUBLIC_FORM_ENDPOINT is not set");
      setStatus("error");
      return;
    }

    const payload = { ...data };
    delete payload.website;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setBooking({ name: data.name, email: data.email, eventDates: data.eventDates, venue: data.venue });
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <ThankYou
        booking={booking}
        onReset={() => {
          setStatus("idle");
          setBooking(null);
        }}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative border border-forest bg-background px-6 py-10 shadow-card md:px-12 md:py-14"
    >
      <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
        <Line id="name" label="Your name" required error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder=" "
            aria-invalid={!!errors.name}
            className={lineClass}
            {...register("name", { required: "Your name is required" })}
          />
        </Line>

        <Line id="email" label="Email address" required error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder=" "
            aria-invalid={!!errors.email}
            className={lineClass}
            {...register("email", {
              required: "Email address is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
            })}
          />
        </Line>

        {/* ? Plain text, so people can type a range or a few dates */}
        <Line id="eventDates" label="Event dates" required error={errors.eventDates?.message} className="sm:col-span-2">
          <input
            id="eventDates"
            type="text"
            autoComplete="off"
            placeholder=" "
            aria-invalid={!!errors.eventDates}
            className={lineClass}
            {...register("eventDates", { required: "Please add the date or dates" })}
          />
        </Line>

        <Line id="venue" label="Venue and city" required error={errors.venue?.message} className="sm:col-span-2">
          <input
            id="venue"
            type="text"
            autoComplete="off"
            placeholder=" "
            aria-invalid={!!errors.venue}
            className={lineClass}
            {...register("venue", { required: "Please add the venue and city" })}
          />
        </Line>

        <Line id="source" label="Where did you hear about us?" required error={errors.source?.message} className="sm:col-span-2">
          <input
            id="source"
            type="text"
            autoComplete="off"
            placeholder=" "
            aria-invalid={!!errors.source}
            className={lineClass}
            {...register("source", { required: "Please tell us where you heard about us" })}
          />
        </Line>

        <Line id="message" label="Message" className="sm:col-span-2">
          <textarea id="message" rows={4} placeholder=" " className={`${lineClass} resize-y`} {...register("message")} />
        </Line>
      </div>

      {/* * Honeypot: hidden from people and screen readers, bots fill it in */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Submit inquiry"}
          <svg
            width="28"
            height="24"
            viewBox="0 0 28 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            <path d="M2 12h24M20 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 rounded-card border border-accent/40 px-4 py-3 text-sm font-medium text-accent">
          Something went wrong. Please try again, or email us directly.
        </p>
      )}
    </form>
  );
}

// ============================================================
// * COMPONENT: ContactItem
// * Icon + small label + value, used in the details row.
// ============================================================

function ContactItem({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <li className="flex items-center gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
        {href ? (
          <a
            href={href}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            className="break-words text-foreground transition-colors hover:text-primary"
          >
            {value}
          </a>
        ) : (
          <p className="break-words text-foreground">{value}</p>
        )}
      </div>
    </li>
  );
}

// ============================================================
// * COMPONENT: SocialLink
// * Round icon button with the network name for screen readers.
// ============================================================

function SocialLink({ name, href, children }: { name: string; href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      title={name}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
    >
      {children}
    </a>
  );
}

// ============================================================
// * COMPONENT: ContactDetails
// * Email and phone on top, social icons underneath.
// ============================================================

function ContactDetails() {
  const iconProps = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  return (
    <div className="border-t border-border pt-12">
      <ul className="grid gap-8 sm:grid-cols-2">
        <ContactItem
          label="Email"
          value={site.email}
          href={`mailto:${site.email}`}
          icon={
            <svg {...iconProps}>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          }
        />
        <ContactItem
          label="Phone"
          value={site.phoneDisplay}
          href={`tel:${site.phone}`}
          icon={
            <svg {...iconProps}>
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
            </svg>
          }
        />
      </ul>

      <div className="mt-10 flex flex-wrap items-center gap-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Follow along</p>
        <div className="flex items-center gap-3">
          <SocialLink name="Instagram" href={site.instagram.url}>
            <svg {...iconProps} strokeWidth={1.7}>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
            </svg>
          </SocialLink>

          <SocialLink name="Facebook" href={site.facebook.url}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" />
            </svg>
          </SocialLink>

          <SocialLink name="YouTube" href={site.youtube.url}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
            </svg>
          </SocialLink>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// * COMPONENT: Faq
// * Cream band with native <details> accordions. They work with the keyboard
// * and screen readers with no extra code.
// ============================================================

function Faq() {
  return (
    <section aria-labelledby="faq-title" className="bg-background px-6 py-24 md:py-36">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Label>Good to know</Label>
          <h2 id="faq-title" className="mt-5 font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            Questions, <em className="font-normal italic text-primary">answered</em>
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-border border-y border-border md:mt-16">
          {faqs.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl text-foreground md:text-2xl [&::-webkit-details-marker]:hidden">
                {f.q}
                {/* * The plus turns into a cross when the item is open */}
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// * MAIN COMPONENT: ContactMe
// * Dark hero, form section, details row, FAQ, footer.
// ============================================================

export default function ContactMe() {
  return (
    <>
      {/* ! Keep Header and Footer in ONE place only: here, or in layout.tsx, not both */}
      <Header />
      <main>
        <ContactHero />

        {/* ? -mt-10 / rounded top: this section overlaps the hero slightly, for a softer edge */}
        <div className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-background-darker md:-mt-14">
          <section aria-labelledby="form-title" className="mx-auto max-w-2xl px-6 py-16 md:py-24">
            <Reveal>
              <Label>Inquiry</Label>
              <h2 id="form-title" className="mt-5 font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
                Tell us <em className="font-normal italic text-primary">about your day</em>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                A few details help us come back to you with something useful.
              </p>
            </Reveal>

            <div className="mt-10 md:mt-12">
              <ContactForm />
            </div>
          </section>

          <section className="mx-auto max-w-2xl px-6 pb-20 md:pb-28">
            <ContactDetails />
          </section>
        </div>

        <Faq />
      </main>
      <Footer />
    </>
  );
}
